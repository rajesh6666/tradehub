import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue'),
            meta: {
                guest: true
            }
        },
        {
            path: '/signup',
            name: 'signup',
            component: () => import('../views/SignupView.vue'),
            meta: {
                guest: true
            }
        },
        {
            path: '/',
            name: 'dashboard',
            component: () => import('../views/DashboardView.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/products/create',
            name: 'product-create',
            component: () => import('../views/ProductCreateView.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/products/:id',
            name: 'product',
            component: () => import('../views/ProductView.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/products/:id/edit',
            name: 'product-edit',
            component: () => import('../views/ProductEditView.vue'),
            meta: {
                requiresAuth: true
            }
        }
    ]
})

// Navigation guard to check for token
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')

    // If the route has guest set to true and has a token then redirect them to homepage
    if (to.matched.some(record => record.meta.guest) && token) {
        next({ name: 'home' })
    }

    // If the route requires authentication and there's no token, redirect to the login page
    if (to.matched.some(record => record.meta.requiresAuth) && !token) {
        next({ name: 'login' })
    } else {
        next()
    }
})

export default router