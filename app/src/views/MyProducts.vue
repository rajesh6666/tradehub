<script setup>
import { onMounted, ref, inject } from 'vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue3-toastify'
const axios = inject('axios')
const products = ref([])

onMounted(async () => {
    try {
        const res = await axios.get('/products')
        products.value = [...res.data.products]
        console.log('products ---> ', products)
    } catch(e) {
        console.error(e)
    }
})

const handleDelete = async (id) => {
    const action = confirm('Are you sure you want to delete the product?')

    if(action) {
        try {
            const res = await axios.delete(`/products/${id}`)
            const { message } = res.data
            toast.success(message)
            let arr = products.value
            arr.splice(arr.findIndex(x => x.id == id), 1)
            products.value = arr
        } catch(e) {
            console.error(e)
            toast.error('An error occured!')
        }
    }
}
</script>

<template>
    <main class="max-w-5xl mx-auto py-16 px-4">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl md:text-4xl font-semibold">
                All products
            </h1>

            <router-link to="/products/create" class="button-primary">
                Add New
            </router-link>
        </div>

        <p class="text-sm">{{ products.length }} products found</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
            <div class="p-6 shadow-md rounded-md border border-gray-200" v-for="product in products" :key="product.id">
                <figure v-if="product.images.length">
                    <img 
                        :src="`http://localhost:3333/uploads/${product.images[0].name}`" 
                        :alt="product.name"
                        class="rounded-md mb-2 block h-48 w-full object-cover"
                    />
                </figure>
                <div v-else>
                    <div class="h-48 bg-gray-200 rounded-md mb-2"></div>
                </div>
                <h2 class="text-xl font-semibold pb-2">
                    {{ product.name }}
                </h2>
                <p class="text-sm pb-4text-gray-400 pb-2">
                    {{ product.description }}
                </p>
                <div class="flex items-center space-x-2">
                    <RouterLink class="button-primary w-full" :to="`/products/${product.id}/edit`">
                        Edit
                    </RouterLink>

                    <button class="button-danger w-full" @click="handleDelete(product.id)">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>