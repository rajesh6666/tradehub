<script setup>
import { reactive, ref, inject } from 'vue'
import { toast } from "vue3-toastify"
import { useRouter } from 'vue-router'
import { authStore } from '@/stores/auth'
const axios = inject('axios')
const router = useRouter()
const store = authStore()

const formData = reactive({
    name: '',
    email: '',
    password: ''
})

const errors = ref({})

const handleSignup = async (formData) => {
    try {
        const signupRes = await axios.post('/signup', {
            name: formData.name,
            email: formData.email,
            password: formData.password
        })

        const { status } = signupRes.data

        const loginRes = await axios.post('/login', {
            email: formData.email,
            password: formData.password
        })

        const { token } = loginRes.data

        if(token) {
            const userRes = await axios.get(`/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(userRes.data))
            store.setUser(userRes.data)
        }

        // Reset form data after submission
        formData.name = ''
        formData.email = ''
        formData.password = ''

        toast.success('Account created succesfully!')

        router.push('/')
    } catch(e) {
        console.error(e)
        toast.error('An error occured!')
    }
}

const handleSubmit = async () => {
    // Reset errors
    errors.value = {}

    // Validate name
    if (!formData.name.length) {
        errors.value.name = 'Name is required'
    }

    // Validate email
    if (!formData.email) {
        errors.value.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
        errors.value.email = 'Email is invalid'
    }

    // Validate password
    if (!formData.password) {
        errors.value.password = 'Password is required'
    } else {
        if (formData.password.length < 8) {
            errors.value.password = 'Password should be minimun 8 characters'
        }
    }


    // If there are no errors, submit the form
    if (Object.keys(errors.value).length === 0) {
        // Perform form submission logic here
        await handleSignup(formData)
    }
}

// Utility function to validate email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}
</script>

<template>
    <main class="max-w-5xl mx-auto px-4">
        <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 class="mt-6 text-center text-3xl font-semibold leading-9 tracking-tight text-gray-900">
                    Create account
                </h2>
            </div>
            <div class="mt-4 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                    <form class="space-y-6" @submit.prevent="handleSubmit">
                        <div>
                            <label for="name" class="block text-sm font-medium leading-6 text-gray-900">
                                Full Name
                            </label>
                            <div class="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autocomplete="name"
                                    required
                                    class="input"
                                    v-model="formData.name"
                                />
                                <p v-if="errors.name" class="text-red-500">{{ errors.name }}</p>
                            </div>
                        </div>

                        <div>
                            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div class="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autocomplete="email"
                                    required
                                    class="input"
                                    v-model="formData.email"
                                />
                                <p v-if="errors.email" class="text-red-500">{{ errors.email }}</p>
                            </div>
                        </div>

                        <div>
                            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div class="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autocomplete="current-password"
                                    required
                                    class="input"
                                    v-model="formData.password"
                                />
                                <p v-if="errors.password" class="text-red-500">{{ errors.password }}</p>
                            </div>
                        </div>
                        <div>
                            <button type="submit" class="button-primary w-full">Create Account</button>
                            <p class="text-sm pt-3">Already have an account? <RouterLink to="/login">Login</RouterLink></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </main>
</template>