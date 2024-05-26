<script setup>
import { reactive, ref, inject } from 'vue'
import { toast } from "vue3-toastify"
import { useRouter } from 'vue-router'
const axios = inject('axios')
const selectedPhotos = ref([])
const fileInput = ref(null)
const router = useRouter()

const formData = reactive({
    name: '',
    price: '',
    password: '',
    photos: null
})

const errors = ref({})

const handleCreateProduct = async (formData) => {
    try {
        const data = new FormData()
        data.append('name', formData.name)
        data.append('price', formData.price)
        data.append('description', formData.description)
        if (fileInput.value && fileInput.value.files.length > 0) {
            const photos = [...fileInput.value.files]
            photos.forEach((file) => {
                data.append(`photos[]`, file)
            })
        }

        const res = await axios.post('/products', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        const { message } = res.data

        // Reset form data after submission
        formData.name = ''
        formData.price = ''
        formData.description = ''
        fileInput.value.value = ''
        selectedPhotos.value = []

        toast.success(message)

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

    // Validate price
    if (!formData.price) {
        errors.value.price = 'price is required'
    } else if (!parseInt(formData.price) >= 1 && parseInt(formData.price) <= 999999) {
        errors.value.price = 'price should be between 1 to 999999'
    }

    // Validate description
    if (formData.description && formData.description.length > 200) {
        errors.value.description = 'description should be within 200 characters'
    }


    // If there are no errors, submit the form
    console.log(Object.keys(errors.value).length, errors.value)
    if (Object.keys(errors.value).length === 0) {
        // Perform form submission logic here
        await handleCreateProduct(formData)
    }
}

const handleFileChange = (e) => {
    const files = e.target.files
    if(files) {
        for(let i = 0; i < files.length; i++) {
            const reader = new FileReader()
            reader.onload = (e) => {
                selectedPhotos.value.push(e.target.result)
            }
            reader.readAsDataURL(files[i])
        }
    }
}

const removePhoto = (index) => {
    let arr = selectedPhotos.value
    arr.splice(index, 1)
    selectedPhotos.value = arr
}
</script>

<template>
    <main class="max-w-5xl mx-auto px-4">
        <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h2 class="mt-6 text-3xl font-semibold leading-9 tracking-tight text-gray-900">
                    Add New Product
                </h2>
                <RouterLink to="/" class="flex items-center justify-center space-x-2 text-sm pt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    <span>Back to all products</span>
                </RouterLink>
            </div>
            <div class="mt-4 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                    <form class="space-y-6" @submit.prevent="handleSubmit">
                        <div>
                            <label for="photos" class="block text-sm font-medium leading-6 text-gray-900">
                                Product Photos
                            </label>
                            <div class="mt-2">
                                <input
                                    type="file"
                                    required
                                    class="input"
                                    multiple
                                    ref="fileInput"
                                    @change="handleFileChange"
                                />
                                <p v-if="errors.photos" class="text-red-500">{{ errors.photos }}</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-5 gap-2" v-if="selectedPhotos.length">
                            <div v-for="(photo, index) in selectedPhotos" :key="photo">
                                <img :src="photo" class="w-full h-12 rounded-md">
                                <a href="#" class="text-xs text-red-500 hover:text-red-600" @click.prevent="removePhoto(index)">
                                    Remove
                                </a>
                            </div>
                        </div>

                        <div>
                            <label for="name" class="block text-sm font-medium leading-6 text-gray-900">
                                Name
                            </label>
                            <div class="mt-2">
                                <input
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
                            <label for="price" class="block text-sm font-medium leading-6 text-gray-900">
                                Price
                            </label>
                            <div class="mt-2">
                                <input
                                    type="number"
                                    autocomplete="price"
                                    required
                                    class="input"
                                    v-model="formData.price"
                                />
                                <p v-if="errors.price" class="text-red-500">{{ errors.price }}</p>
                            </div>
                        </div>

                        <div>
                            <label for="description" class="block text-sm font-medium leading-6 text-gray-900">
                                Description
                            </label>
                            <div class="mt-2">
                                <textarea
                                    autocomplete="description"
                                    required
                                    class="input"
                                    v-model="formData.description"
                                ></textarea>
                                <p v-if="errors.description" class="text-red-500">{{ errors.description }}</p>
                            </div>
                        </div>
                        <div>
                            <button type="submit" class="button-primary w-full">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </main>
</template>