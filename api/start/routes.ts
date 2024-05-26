/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import { sep, normalize } from 'node:path'
import app from '@adonisjs/core/services/app'
const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// import controllers
import AuthController from '#controllers/auth_controller'
import ProductController from '#controllers/product_controller'
import BidController from '#controllers/bid_controller'
import db from '@adonisjs/lucid/services/db'

router.get('/', async () => {
    return {
        hello: 'world',
    }
})

router.get('/db', async () => {
    const prods = await db.from('products')
    return {
        prods: prods,
    }
})

router.group(() => {
	router.post('/signup', [AuthController, 'signup'])
	router.post('/login', [AuthController, 'login'])
    router.get('/me', [AuthController, 'me']).use(middleware.auth({ guards: ['api'] }))

    router.get('/products', [ProductController, 'index']).use(middleware.auth({ guards: ['api'] }))
	router.post('/products', [ProductController, 'store']).use(middleware.auth({ guards: ['api'] }))
    router.get('/products/:id', [ProductController, 'show']).use(middleware.auth({ guards: ['api'] }))
    router.put('/products/:id', [ProductController, 'update']).use(middleware.auth({ guards: ['api'] }))
    router.delete('/products/:id', [ProductController, 'destroy']).use(middleware.auth({ guards: ['api'] }))

    router.post('/bids', [BidController, 'store']).use(middleware.auth({ guards: ['api'] }))
    router.post('/bids/purchase', [BidController, 'directPurchase']).use(middleware.auth({ guards: ['api'] }))
    router.post('/bids/:id/approve', [BidController, 'approve']).use(middleware.auth({ guards: ['api'] }))
    router.post('/bids/:id/purchase', [BidController, 'purchase']).use(middleware.auth({ guards: ['api'] }))
})
.prefix('api/v1')

router.get('/uploads/*', ({ request, response }) => {
    const filePath = request.param('*').join(sep)
    const normalizedPath = normalize(filePath)
    
    if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
        return response.badRequest('Malformed path')
    }
  
    const absolutePath = app.makePath('uploads', normalizedPath)
    return response.download(absolutePath)
})