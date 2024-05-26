<script setup>
import { onMounted, ref, inject } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import dayjs from 'dayjs'
const axios = inject('axios')
const product = ref([])
const bid = ref({})
const acceptedBid = ref({})
const router = useRouter()
const route = useRoute()
const user = ref(JSON.parse(localStorage.getItem('user')))

onMounted(async () => {
    await getProduct()
})

const getProduct = async () => {
    try {
        const res = await axios.get(`/products/${route.params.id}`)
        const userRes = await axios.get(`/me`)
        product.value = res.data.product
        bid.value = res.data.bid
        acceptedBid.value = res.data.acceptedBid
    } catch(e) {
        console.error(e)
    }
}

const handleBid = async () => {
    const amount = prompt('How much you want to offer for this product?')
    
    try {
        const res = await axios.post(`/bids`, {
            offerPrice: amount,
            productId: route.params.id
        })
        
        const { message } = res.data

        toast.success(message)

        await getProduct()
    } catch(e) {
        console.error(e)
        toast.error('An error occured!')
    }
}

const handlePurchase = async () => {
    const op = confirm(`Are you sure you want to purchase the product?`)
    
    if(!op) return

    try {
        let url = ''
        if(product.value.bids.length) {
            url = `/bids/${route.params.id}/purchase`
        } else {
            url = `/bids/purchase`
        }

        const res = await axios.post(url, {
            productId: route.params.id
        })
        
        const { message } = res.data

        toast.success(message)

        await getProduct()
    } catch(e) {
        console.error(e)
        toast.error('An error occured!')
    }
}

const counterBid = async (id) => {
    const amount = prompt('How much you want to counter offer?')
    
    try {
        const res = await axios.post(`/bids`, {
            offerPrice: amount,
            parentId: id,
            productId: route.params.id
        })
        
        const { message } = res.data

        toast.success(message)

        await getProduct()
    } catch(e) {
        console.error(e)
        toast.error('An error occured!')
    }
}

const acceptBid = async (id, parentId, price) => {
    const op = confirm('Are you sure you want to accept this offer?')
    
    if(!op) return

    try {
        const res = await axios.post(`/bids/${id}/approve`, {
            productId: route.params.id,
            parentId: parentId,
            offerPrice: price
        })
        
        const { message } = res.data

        toast.success(message)

        router.push('/')
    } catch(e) {
        console.error(e)
        toast.error('An error occured!')
    }
}
</script>

<template>
    <main class="max-w-5xl mx-auto py-16 px-4" v-if="product">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl md:text-4xl font-semibold pb-4">
                {{ product.name }}
            </h1>

            <RouterLink to="/" class="flex items-center justify-center space-x-2 text-sm pt-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                <span>Back to all products</span>
            </RouterLink>
        </div>

        <div class="p-6 shadow-md rounded-md border border-gray-200">
            <figure v-if="product.images && product.images.length">
                <img 
                    :src="`http://localhost:3333/uploads/${product.images[0].name}`" 
                    :alt="product.name"
                    class="rounded-md mb-2 block w-full object-cover"
                />
            </figure>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 py-3">
                <div v-for="(img, index) in product.images" :key="index">
                    <img 
                        :src="`http://localhost:3333/uploads/${img.name}`" 
                        :alt="product.name"
                        class="rounded-md mb-2 h-40 block w-full object-cover"
                    />
                </div>
            </div>

            <span :class="{
                'badge-available': product.status == 'available', 
                'badge-sold': product.status == 'sold', 
                'badge-reserved': product.status == 'reserved'
            }">
                {{ product.status }}
            </span>

            <p class="text-gray-400 py-2">
                {{ product.description }}
            </p>
            <p class="text-lime-600 font-semibold pb-2" v-if="product.user">
                Listed by {{ product.user.name }}
            </p>
            <p class="text-xl font-semibold pb-2">
                ${{ product.price }}
            </p>
            <div class="flex items-center space-x-4" v-if="product.userId !== user.id">
                <button class="button-primary-outline w-full" v-if="product.status == 'available' && (!bid || user && product.id != user.id)" @click="handleBid">
                    Counter Offer
                </button>
                <button 
                    class="button-primary w-full" 
                    v-if="product.status == 'available' && product.bids.length == 0 || product.status == 'reserved' && acceptedBid && (acceptedBid.accepted_by == user.id || acceptedBid.user_id == user.id) && product.userId != user.id" 
                    @click="handlePurchase"
                >
                    Purchase <span v-if="acceptedBid" class="pl-1">at ${{ acceptedBid.offer_price }}</span>
                </button>
            </div>
        </div>

        <div class="py-3 mt-6" v-if="product.bids && product.bids.length">
            <h2 class="text-xl font-semibold">Negotiation History</h2>
        </div>
        <div class="p-6 shadow-md rounded-md border border-gray-200" v-for="bid in product.bids" :key="bid.id">
            <div class="sm:flex items-end justify-between space-x-2 pb-4">
                <p>
                    <span class="font-semibold text-lime-600 text-xl">${{ bid.offerPrice }}</span> offered by {{ bid.user.name }}
                </p>
                <p class="text-sm text-gray-400">{{ dayjs(bid.createdAt).format('DD MMM, YYYY') }}</p>
            </div>

            <p class="text-lime-600 font-semibold" v-if="bid.accepted">This offer is accepted</p>
            
            <div class="flex items-center space-x-3" v-if="product.userId == user.id && product.status == 'available'">
                <button class="button-primary-outline" @click="counterBid(bid.id)">
                    Counter Offer
                </button>
                <button class="button-primary" @click="acceptBid(bid.id, null, bid.offerPrice)">
                    Accept Offer
                </button>
            </div>

            <div class="p-6 shadow-md rounded-md border border-gray-200 mt-6" :class="child.accepted ? 'shadow-lime-600' : ''" v-for="child in bid.bids" :key="child.id">
                <div class="sm:flex items-end justify-between space-x-2 pb-4">
                    <p>
                        <span class="font-semibold text-lime-600 text-xl">
                            ${{ child.offerPrice }}
                        </span> offered by {{ child.user ? child.user.name : '' }} 
                        <span class="text-xs font-semibold" :class="product.userId == child.userId ? 'text-lime-700' : 'text-slate-600'">({{ product.userId == child.userId ? 'Seller' : 'Buyer' }})</span>
                    </p>
                    <p class="text-sm text-gray-400">{{ dayjs(child.createdAt).format('DD MMM, YYYY | hh:mm A') }}</p>
                </div>
                
                <p class="text-lime-600 font-semibold" v-if="child.accepted">This offer is accepted</p>
                
                <div class="sm:flex items-center space-x-3" v-if="(bid.userId == user.id || product.userId == user.id) && product.status == 'available'">
                    <button class="button-primary-outline" @click="counterBid(bid.id)" v-if="child.userId != user.id">
                        Counter
                    </button>
                    <button class="button-primary" @click="acceptBid(child.id, bid.id, child.offerPrice)" v-if="child.userId != user.id">
                        Accept
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>