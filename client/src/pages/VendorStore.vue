<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { Package, MapPin, ShieldCheck, Star } from 'lucide-vue-next'

const route = useRoute()
const store = useStore()
const vendorId = route.params.id

const vendor = ref(null)
const loadingVendor = ref(true)

const products = computed(() => store.getters['products/allProducts'])
const loadingProducts = computed(() => store.getters['products/isLoading'])

onMounted(async () => {
    store.dispatch('products/fetchProducts', { seller_id: vendorId })
    
    try {
        const res = await fetch(`http://localhost:5001/api/sellers/${vendorId}`)
        if (res.ok) {
           const data = await res.json()
           if (Array.isArray(data)) {
               vendor.value = data.find(v => String(v.id) === String(vendorId)) || data[0];
           } else {
               vendor.value = data
           }
        }
    } catch (err) {
        console.error(err)
    } finally {
        loadingVendor.value = false
    }
})
</script>

<template>
  <div class="vendor-store-page container">
    <div v-if="loadingVendor" class="skeleton-header glass"></div>
    <header v-else-if="vendor" class="vendor-header glass-card animate-up">
        <div class="v-brand">
            <img :src="vendor.logo || 'https://picsum.photos/seed/v'+vendor.id+'/200'" class="v-avatar"/>
            <div class="v-info">
                <h1>{{ vendor.store_name }}</h1>
                <div class="v-meta">
                    <span class="meta-item"><MapPin :size="16"/> Global Hub</span>
                    <span class="meta-item"><ShieldCheck :size="16"/> Verified Partner</span>
                    <span class="meta-item rating"><Star :size="16" fill="#fbbf24" color="#fbbf24"/> 4.9 Rating</span>
                </div>
            </div>
        </div>
    </header>

    <main class="store-main">
        <h3>Products from {{ vendor?.store_name || 'Vendor' }}</h3>
        
        <div v-if="loadingProducts" class="grid-skeleton">
            <div v-for="i in 4" :key="i" class="skeleton-card glass"></div>
        </div>
        
        <div v-else-if="products.length === 0" class="no-products">
             <p>No products available from this vendor.</p>
        </div>

        <div v-else class="product-grid">
            <div v-for="product in products" :key="product.id" class="product-card glass-card">
                <div class="img-wrapper">
                    <img :src="product.images[0]" :alt="product.name" />
                    <div class="overlay">
                        <button @click="store.dispatch('cart/addToCart', product)" class="btn-icon"><Package :size="20" /></button>
                    </div>
                </div>
                <div class="p-info">
                    <span class="p-cat">Seller ID {{ product.seller_id }}</span>
                    <h4>{{ product.name }}</h4>
                    <div class="p-footer">
                        <span class="p-price">${{ product.price }}</span>
                        <router-link :to="'/product/' + product.id" class="btn-link">Details</router-link>
                    </div>
                </div>
            </div>
        </div>
    </main>
  </div>
</template>

<style scoped>
.vendor-store-page {
    padding: 4rem 0 8rem;
}
.skeleton-header {
    height: 180px;
    border-radius: 24px;
    margin-bottom: 4rem;
}
.vendor-header {
    padding: 3rem;
    border-radius: 24px;
    margin-bottom: 4rem;
}
.v-brand {
    display: flex;
    gap: 2rem;
    align-items: center;
}
.v-avatar {
    width: 120px;
    height: 120px;
    border-radius: 20px;
    object-fit: cover;
}
.v-info h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}
.v-meta {
    display: flex;
    gap: 1.5rem;
}
.meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-secondary);
    font-weight: 600;
}
.meta-item.rating {
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.1);
    padding: 4px 12px;
    border-radius: 100px;
}
.store-main h3 {
    font-size: 1.8rem;
    margin-bottom: 2rem;
}
.product-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
}
@media (max-width: 1024px) {
    .product-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
@media (max-width: 768px) {
    .product-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    .v-brand {
        flex-direction: column;
        text-align: center;
    }
}
@media (max-width: 480px) {
    .product-grid {
        grid-template-columns: 1fr;
    }
}
.product-card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    padding-bottom: 1rem;
}
.img-wrapper {
    position: relative;
    height: 220px;
    overflow: hidden;
    background: #f8fafc;
}
.img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.product-card:hover .img-wrapper img {
    transform: scale(1.1);
}
.p-info {
    padding: 1.5rem;
}
.p-cat {
    color: var(--accent-blue);
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 800;
}
.p-info h4 {
    margin: 0.75rem 0 1rem;
    font-size: 1.1rem;
    font-weight: 800;
}
.p-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f1f5f9;
    padding-top: 1rem;
}
.p-price {
    font-size: 1.25rem;
    font-weight: 900;
}
.no-products {
    padding: 3rem;
    text-align: center;
    background: white;
    border-radius: 24px;
    color: var(--text-secondary);
}
</style>
