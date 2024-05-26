import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { storeValidator } from '#validators/product'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'

export default class ProductController {
    async index ({ request }: HttpContext) {
        const { userId, filter } = request.all()

        if(userId) {
            const products = await Product.query()
            .where('userId', userId)
            .preload('images')

            return { products }
        } else {
            if(filter && filter != 'all') {
                const products = await Product.query()
                .where('status', filter)
                .preload('user')
                .preload('images')

                return { products }
            }

            const products = await Product.query()
            .preload('user')
            .preload('images')

            return { products }
        }
    }

    async store ({ request, response, auth }: HttpContext) {
        const user = await auth.authenticate()
        const data = request.all()
        const payload = await storeValidator.validate(data)

        const photos = request.files('photos', {
            size: '5mb',
            extnames: ['jpg', 'png', 'pdf', 'webp', 'jpeg']
        })

        if(photos.length > 5) {
            return response.status(400).json({
                errors: [
                    {
                        message: 'Maximum 5 photos can be added per product!', 
                        field: 'photos'
                    }
                ]
            })
        }

        const product = await Product.create({
            userId: user.id,
            name: payload.name,
            price: payload.price,
            description: payload.description
        })

        for (const photo of photos) {
            const photoName = `${cuid()}.${photo.extname}`
            console.log(photoName)
            await photo.move(app.makePath('uploads'), {
                name: photoName
            })

            await db.table('product_images')
            .insert({
                product_id: product.id,
                name: photoName,
                created_at: new Date(),
                updated_at: new Date()
            })
        }

        return response.json({
            status: 'success',
            message: 'Product created!',
            product: product
        })
    }

    async show ({ auth, params }: HttpContext) {
        const user = await auth.authenticate()

        const product = await Product.query()
        .where({
            id: params.id
        })
        .preload('images')
        .preload('user')
        .preload('bids', (q) => q.whereNull('parentId').preload('user').preload('bids', (q1) => q1.preload('user').orderBy('id', 'asc')).orderBy('id', 'desc'))
        .firstOrFail()

        // check if user has already bid for the product
        const bid = await db.from('bids')
        .where({
            user_id: user.id,
            product_id: product.id
        })
        .first()

        const acceptedBid = await db.from('bids')
        .where({
            product_id: product.id,
            accepted: true
        })
        .first()

        return { product, bid, acceptedBid }
    }

    async update ({ request, response, auth, params }: HttpContext) {
        const user = await auth.authenticate()
        const data = request.all()
        const payload = await storeValidator.validate(data)

        const photos = request.files('photos', {
            size: '5mb',
            extnames: ['jpg', 'png', 'pdf', 'webp', 'jpeg']
        })

        if(photos.length > 5) {
            return response.status(400).json({
                errors: [
                    {
                        message: 'Maximum 5 photos can be added per product!', 
                        field: 'photos'
                    }
                ]
            })
        }

        await Product.query()
        .where({
            userId: user.id,
            id: params.id
        })
        .update({
            name: payload.name,
            price: payload.price,
            description: payload.description
        })

        for (const photo of photos) {
            const photoName = `${cuid()}.${photo.extname}`
            console.log(photoName)
            await photo.move(app.makePath('uploads'), {
                name: photoName
            })

            await db.table('product_images')
            .insert({
                product_id: params.id,
                name: photoName,
                created_at: new Date(),
                updated_at: new Date()
            })
        }

        return response.json({
            status: 'success',
            message: 'Product updated!'
        })
    }

    async destroy ({ auth, params }: HttpContext) {
        const user = await auth.authenticate()

        await Product.query()
        .where({
            userId: user.id,
            id: params.id
        })
        .delete()

        return { message: 'Product deleted!', status: 'success' }
    }
}