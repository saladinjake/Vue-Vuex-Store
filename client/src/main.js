import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import { createRouter, createWebHistory } from 'vue-router'
import './index.css'

const routes = [
    { path: '/', component: () => import('./pages/Home.vue') },
    { path: '/products', component: () => import('./pages/Products.vue') },
    { path: '/product/:id', component: () => import('./pages/ProductDetail.vue') },
    { path: '/cart', component: () => import('./pages/Cart.vue') },
    { path: '/checkout', component: () => import('./pages/Checkout.vue') },
    { path: '/orders', component: () => import('./pages/Orders.vue') },
    { path: '/order/:id', component: () => import('./pages/OrderDetail.vue') },


]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')
