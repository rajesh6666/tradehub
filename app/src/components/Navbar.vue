<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { inject, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { authStore } from '@/stores/auth'
const axios = inject('axios')
const token = localStorage.getItem('token')
const router = useRouter()
const { loggedInUser } = storeToRefs(authStore())
const user = ref(loggedInUser)
const isOpen = ref(false)

onMounted(async () => {
    if(token) {
        try {
            const res = await axios.get('/me')
            user.value = res.data
        } catch(e) {
            console.error(e)
        }
    }
})

const handleLogout = () => {
    localStorage.removeItem('token')
    user.value = null
    router.push('/login')
}

const toggleMenu = () => {
    isOpen.value = !isOpen.value
}
</script>

<template>
    <nav class="bg-white border-gray-200 dark:bg-gray-900">
        <div class="max-w-5xl flex flex-wrap items-center justify-between mx-auto p-4">
            <RouterLink to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
                <h1 class="text-2xl font-semibold">Tradehub</h1>
            </RouterLink>
            <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false" @click="toggleMenu">
                <span class="sr-only">Open main menu</span>
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
            </button>
            <div class="w-full md:block md:w-auto" :class="{'hidden': !isOpen}" id="navbar-default">
                <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                    <li v-if="!user">
                        <RouterLink to="/login" class="" aria-current="page">
                            Login
                        </RouterLink>
                    </li>
                    <li v-else>
                        <RouterLink to="/products/create" class="" aria-current="page">
                            Sell
                        </RouterLink>
                    </li>
                    <li v-if="!user">
                        <RouterLink to="/signup" class="" aria-current="page">
                            Sign up
                        </RouterLink>
                    </li>
                    <li v-else>
                        <a href="#" @click.prevent="handleLogout" class="text-red-500">
                            ({{ user.name }}) Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>