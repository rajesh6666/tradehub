import axios from 'axios'

// Set the base URL for all API requests
const apiClient = axios.create({
    baseURL: 'http://localhost:3333/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Get the Bearer token from localStorage or cookie
        const token = localStorage.getItem('token') || getCookieValue('token')

        // If the token exists, add it to the request headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Modify the request configuration, if needed
        return config
    },
    (error) => {
        // Handle request error
        return Promise.reject(error)
    }
)

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        // Handle successful response
        return response
    },
    (error) => {
        // Handle response error
        return Promise.reject(error)
    }
)

// Helper function to get cookie value
function getCookieValue(name) {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()
        if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(name.length + 1)
        }
    }
    return null
}

export default {
    install: (app) => {
        // Inject the apiClient instance into the Vue app
        app.provide('axios', apiClient)
    },
}