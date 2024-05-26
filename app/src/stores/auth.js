import { defineStore } from 'pinia'

export const authStore = defineStore('auth', {
    state: () => ({ 
        loggedInUser: null,
        authenticated: false
    }),
    getters: {
        getUser: (state) => state.user,
        isAuthenticated: (state) => state.authenticated
    },
    actions: {
        setUser(payload) {
            this.loggedInUser = payload
            this.authenticated = true
        },
        removeUser() {
            this.loggedInUser = null
            this.authenticated = false
        }
    },
})