<script setup>
import { onMounted, ref, inject } from 'vue'
import { RouterLink } from 'vue-router'
const axios = inject('axios')
const products = ref([])
const filter = ref('all')

onMounted(async () => await getProducts())

const getProducts = async () => {
    try {
        const res = await axios.get(`/products?filter=${filter.value}`)
        products.value = [...res.data.products]
    } catch(e) {
        console.error(e)
    }
}
</script>

<template>
    <main class="max-w-5xl mx-auto py-16 px-4">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl md:text-4xl font-semibold">
                    All Products
                </h1>
                <p class="text-sm">{{ products.length }} products found</p>
            </div>
            
            <div class="w-full max-w-60">
                <label for="filter" class="text-sm">Filter Products</label>
                <select v-model="filter" @change="getProducts" class="input">
                    <option value="all" selected>All</option>
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                </select>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
            <div class="shadow-md rounded-md border border-gray-200" v-for="product in products" :key="product.id">
                <figure v-if="product.images.length">
                    <img 
                        :src="`http://localhost:3333/uploads/${product.images[0].name}`" 
                        :alt="product.name"
                        class="rounded-t-md block h-48 w-full object-cover"
                    />
                </figure>
                <div v-else>
                    <div class="h-48 bg-gray-200 rounded-md"></div>
                </div>
                <div class="p-4">
                    <span :class="{
                        'badge-available': product.status == 'available', 
                        'badge-sold': product.status == 'sold', 
                        'badge-reserved': product.status == 'reserved'
                    }">
                        {{ product.status }}
                    </span>
                    <h2 class="text-xl font-semibold py-2">
                        {{ product.name }}
                    </h2>
                    <p class="text-sm pb-4text-gray-400 pb-2">
                        {{ product.description }}
                    </p>
                    <p class="text-sm text-lime-600 font-semibold pb-2">
                        Listed by {{ product.user.name }}
                    </p>
                    <p class="text-xl font-semibold pb-2">
                        ${{ product.price }}
                    </p>
                    <div class="flex items-center space-x-2">
                        <RouterLink class="button-primary-outline w-full" :to="`/products/${product.id}`">
                            View Product
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>