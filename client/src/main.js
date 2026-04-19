import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import { createRouter, createWebHistory } from 'vue-router'
import './index.css'

const routes = [
    { path: '/', component: () => import('./pages/Home.vue') },
    { path: '/login', component: () => import('./pages/Login.vue') },
    { path: '/signup', component: () => import('./pages/Signup.vue') },
    { path: '/admin-login', component: () => import('./pages/AdminLogin.vue') },
    { path: '/products', component: () => import('./pages/Products.vue') },
    { path: '/checkout', component: () => import('./pages/Checkout.vue'), meta: { requiresAuth: true } },
    { path: '/order/:id', component: () => import('./pages/OrderDetail.vue'), meta: { requiresAuth: true } },
    { path: '/product/:id', component: () => import('./pages/ProductDetail.vue') },
    { path: '/cart', component: () => import('./pages/Cart.vue'), meta: { requiresAuth: true } },
    { path: '/admin', component: () => import('./pages/Admin.vue'), meta: { requiresAuth: true, role: 'admin' } },
    { path: '/seller-signup', component: () => import('./pages/SellerSignup.vue') },
    { path: '/add-product', component: () => import('./pages/AddProduct.vue'), meta: { requiresAuth: true, role: 'seller' } },
    { path: '/dashboard', component: () => import('./pages/Dashboard.vue'), meta: { requiresAuth: true } },
    { path: '/solutions', component: () => import('./pages/Solutions.vue') },
    { path: '/orders', component: () => import('./pages/Orders.vue'), meta: { requiresAuth: true } },
    { path: '/vendors', component: () => import('./pages/Vendors.vue') },
    { path: '/vendor/:id', component: () => import('./pages/VendorStore.vue') }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters['auth/isAuthenticated']
    const userRole = store.state.auth.user?.role
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else if (to.meta.role && userRole !== to.meta.role) {
        next('/')
    } else {
        next()
    }
})

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')
