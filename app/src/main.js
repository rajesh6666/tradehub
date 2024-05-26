import './index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3Toasity from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import App from './App.vue'
import router from './router'
import axios from './plugins/axios'

const app = createApp(App)

app.use(axios)
app.use(createPinia())
app.use(router)
app.use( 
    Vue3Toasity,
    { autoClose: 3000 }
)

app.mount('#app')