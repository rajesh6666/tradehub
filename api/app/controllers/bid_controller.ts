import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import Bid from '#models/bid'
import { storeValidator, purchaseValidator } from '#validators/bid'

export default class BidController {
    async store ({ request, response, auth }: HttpContext) {
        const user = await auth.authenticate()
        const data = request.all()
        const payload = await storeValidator.validate(data)

        await Bid.create({
            userId: user.id,
            productId: payload.productId,
            offerPrice: payload.offerPrice,
            parentId: payload.parentId
        })

        return response.json({
            status: 'success',
            message: 'Counter offer created!'
        })
    }

    async approve ({ request, response, auth, params }: HttpContext) {
        const user = await auth.authenticate()
        const data = request.all()
        const payload = await storeValidator.validate(data)

        const product = await Product.query()
        .where('id', payload.productId)
        .firstOrFail()

        let bid = null
        if(payload.parentId) {
            bid = await Bid.query()
            .where({
                id: payload.parentId
            })
            .first()
        } else {
            bid = await Bid.query()
            .where({
                userId: user.id,
                productId: payload.productId
            })
            .first()
        }
        // console.log(bid, product)
        if(product && product.userId == user.id || bid && bid.userId == user.id) {
            await Bid.query()
            .where({
                id: params.id
            })
            .update({
                acceptedBy: user.id,
                accepted: true
            })

            await Product.query()
            .where('id', payload.productId)
            .update({
                status: 'reserved'
            })

            return response.json({
                status: 'success',
                message: 'Counter offer accepted!'
            })
        } else {
            return response.status(401).send('Unauthorized access!')
        }
    }

    async purchase ({ request, response, auth }: HttpContext) {
        const user = await auth.authenticate()
        const data = request.all()
        const payload = await purchaseValidator.validate(data)

        const product = await Product.query()
        .where('id', payload.productId)
        .firstOrFail()
        
        const acceptedBid = await Bid.query()
        .where({
            productId: product.id,
            accepted: true
        })
        .first()

        if(acceptedBid && (acceptedBid.acceptedBy == user.id || acceptedBid.userId == user.id)) {
            await Product.query()
            .where('id', payload.productId)
            .update({
                status: 'sold'
            })

            return response.json({
                status: 'success',
                message: 'Product purchased!'
            })
        } else {
            return response.status(401).send('Unauthorized access!')
        }
    }

    async directPurchase ({ request, response, auth }: HttpContext) {
        const user = await auth.authenticate()
        const data = request.all()
        const payload = await purchaseValidator.validate(data)

        const product = await Product.query().where('id', payload.productId).firstOrFail()

        if(product && product.status == 'available' && product.userId != user.id) {
            await Product.query()
            .where('id', payload.productId)
            .update({
                status: 'sold'
            })

            return response.json({
                status: 'success',
                message: 'Product purchased!'
            })
        } else {
            return response.status(401).send('Unauthorized access!')
        }
    }
}