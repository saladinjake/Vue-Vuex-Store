import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import { createRouter, createWebHistory } from 'vue-router'
import './index.css'

const routes = [
    { path: '/', component: () => import('./pages/Home.vue') },

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')
