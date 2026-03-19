<script setup>
import { onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { 
    ShoppingCart, ChevronLeft, ShieldCheck, 
    Truck, Award, RefreshCcw, Star
} from 'lucide-vue-next'

const store = useStore()
const route = useRoute()
const product = ref(null)
const loading = ref(true)
const selectedImage = ref(0)
const quantity = ref(1)

onMounted(async () => {
    try {
        const response = await fetch(`http://localhost:5001/api/products/${route.params.id}`)
        product.value = await response.json()
    } catch (err) {
        console.error('Failed to fetch product:', err)
    } finally {
        loading.value = false
    }
})

const addToCart = () => {
    store.dispatch('cart/addToCart', { ...product.value, quantity: quantity.value })
}
</script>

<template>
  <div class="product-detail-page container">
    <router-link to="/products" class="back-link">
      <ChevronLeft :size="18" /> Back to Catalog
    </router-link>

    <div v-if="loading" class="skeleton-layout animate-up">
        <div class="sk-img glass"></div>
        <div class="sk-info">
            <div class="sk-line long glass"></div>
            <div class="sk-line mid glass"></div>
            <div class="sk-line short glass"></div>
        </div>
    </div>

    <div v-else-if="product" class="product-layout animate-up">
      <!-- Media Gallery -->
      <section class="media-gallery">
        <div class="main-image glass-card">
          <img :src="product.images[selectedImage]" :alt="product.name" />
        </div>
        <div class="thumbnail-grid">
          <div v-for="(img, idx) in product.images" :key="idx" 
               class="thumb glass" :class="{ active: selectedImage === idx }"
               @click="selectedImage = idx">
            <img :src="img" />
          </div>
        </div>
      </section>

      <!-- Information Panel -->
      <section class="product-info">
        <div class="p-header">
            <span class="p-badge">Industrial Grade</span>
            <h1>{{ product.name }}</h1>
            <div class="p-rating">
                <Star v-for="i in 5" :key="i" :size="16" :fill="i <= 4 ? '#fbbf24' : 'none'" :color="i <= 4 ? '#fbbf24' : '#666'" />
                <span>(128 Technical Reviews)</span>
            </div>
        </div>

        <div class="p-price-block">
            <span class="price-val">${{ product.price }}</span>
            <span class="price-unit">per unit / EXW</span>
            <p class="inventory-status" :class="{ ok: product.inventory > 10 }">
                <span class="dot"></span> {{ product.inventory }} units available in local hub
            </p>
        </div>

        <div class="p-description glass-card">
            <h3>Technical Abstract</h3>
            <p>{{ product.description }}</p>
            <div class="spec-grid">
                <div class="spec"><span>Certifications</span><p>CE, ISO-9001</p></div>
                <div class="spec"><span>Lead Time</span><p>5-10 Business Days</p></div>
                <div class="spec"><span>Country of Origin</span><p>Germany / UK</p></div>
            </div>
        </div>

        <div class="p-actions">
            <div class="qty-control glass">
                <button @click="quantity = Math.max(1, quantity - 1)">-</button>
                <span>{{ quantity }}</span>
                <button @click="quantity++">+</button>
            </div>
            <button @click="addToCart" class="btn-premium">
                <ShoppingCart :size="20" /> Incorporate to Project
            </button>
        </div>

        <div class="p-trust-grid">
            <div class="trust-item"><ShieldCheck :size="18" /> <span>Quality Assured</span></div>
            <div class="trust-item"><Truck :size="18" /> <span>Global Freight</span></div>
            <div class="trust-item"><Award :size="18" /> <span>Verified Vendor</span></div>
            <div class="trust-item"><RefreshCcw :size="18" /> <span>RMA Support</span></div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.product-detail-page  {
     padding:  4rem 0 8rem;
 }

.back-link  {
     display:  flex;
     align-items:  center;
     gap:  8px;
     color:  var(--text-muted);
     text-decoration:  none;
     margin-bottom:  3rem;
     font-size:  0.95rem;
     transition:  0.3s;
     font-weight:  600;
 }

.back-link:hover  {
     color:  var(--accent-blue);
     transform:  translateX(-5px);
 }


.product-layout  {
     display:  grid;
     grid-template-columns:  1fr 1fr;
     gap:  6rem;
 }


/* Gallery */
.main-image  {
     border-radius:  32px;
     overflow:  hidden;
     margin-bottom:  2rem;
     aspect-ratio:  1;
     background:  white;
 }

.main-image img  {
     width:  100%;
     height:  100%;
     object-fit:  cover;
 }


.thumbnail-grid  {
     display:  flex;
     gap:  1.25rem;
 }

.thumb  {
     width:  90px;
     height:  90px;
     border-radius:  16px;
     overflow:  hidden;
     cursor:  pointer;
     border:  2.5px solid transparent;
     transition:  0.3s;
     background:  white;
 }

.thumb img  {
     width:  100%;
     height:  100%;
     object-fit:  cover;
 }

.thumb.active  {
     border-color:  var(--accent-blue);
     transform:  translateY(-5px);
 }


/* Info */
.p-header h1  {
     font-size:  4rem;
     margin:  1.5rem 0;
     line-height:  1;
     font-weight:  900;
     color:  var(--text-primary);
 }

.p-badge  {
     background:  #eff6ff;
     color:  var(--accent-blue);
     padding:  0.6rem 1.25rem;
     border-radius:  100px;
     font-size:  0.8rem;
     font-weight:  800;
     text-transform:  uppercase;
     letter-spacing:  1.5px;
 }

.p-rating  {
     display:  flex;
     align-items:  center;
     gap:  10px;
     color:  var(--text-muted);
     font-size:  0.95rem;
     font-weight:  600;
 }


.p-price-block  {
     margin:  3.5rem 0;
 }

.price-val  {
     font-size:  3.5rem;
     font-weight:  900;
     font-family:  'Outfit';
     color:  var(--text-primary);
 }

.price-unit  {
     color:  var(--text-muted);
     margin-left:  1rem;
     font-size:  1.1rem;
 }

.inventory-status  {
     display:  flex;
     align-items:  center;
     gap:  12px;
     margin-top:  1.5rem;
     font-size:  1rem;
     font-weight:  600;
     color:  #ef4444;
 }

.inventory-status.ok  {
     color:  #10b981;
 }

.inventory-status .dot  {
     width:  10px;
     height:  10px;
     border-radius:  50%;
     background:  currentColor;
 }


.p-description  {
     padding:  3rem;
     margin-bottom:  3.5rem;
 }

.p-description h3  {
     font-size:  1.5rem;
     margin-bottom:  1.5rem;
     font-weight:  800;
 }

.p-description p  {
     color:  var(--text-secondary);
     line-height:  1.8;
     margin-bottom:  2.5rem;
     font-size:  1.1rem;
 }


.spec-grid  {
     display:  grid;
     grid-template-columns:  repeat(3,  1fr);
     gap:  2.5rem;
     border-top:  1.5px solid #f1f5f9;
     padding-top:  2.5rem;
 }

.spec span  {
     display:  block;
     font-size:  0.75rem;
     color:  var(--text-muted);
     text-transform:  uppercase;
     letter-spacing:  1.5px;
     margin-bottom:  0.75rem;
     font-weight:  800;
 }

.spec p  {
     color:  var(--text-primary);
     font-weight:  700;
     font-size:  1rem;
     margin:  0;
 }


.p-actions  {
     display:  flex;
     gap:  2rem;
     align-items:  center;
     margin-bottom:  5rem;
 }

.qty-control  {
     display:  flex;
     align-items:  center;
     gap:  2rem;
     padding:  0.75rem 1.5rem;
     border-radius:  100px;
     height:  64px;
     background:  #f1f5f9;
 }

.qty-control button  {
     background:  none;
     border:  none;
     color:  var(--text-primary);
     font-size:  1.5rem;
     cursor:  pointer;
     font-weight:  700;
     width:  32px;
     height:  32px;
     border-radius:  10px;
     transition:  0.2s;
 }

.qty-control button:hover  {
     background:  white;
     color:  var(--accent-blue);
 }

.qty-control span  {
     font-weight:  900;
     font-family:  'Outfit';
     width:  40px;
     text-align:  center;
     font-size:  1.25rem;
 }


.p-actions .btn-premium  {
     flex:  1;
     height:  64px;
     justify-content:  center;
     font-size:  1.15rem;
 }


.p-trust-grid  {
     display:  grid;
     grid-template-columns:  1fr 1fr;
     gap:  2rem;
 }

.trust-item  {
     display:  flex;
     align-items:  center;
     gap:  15px;
     font-size:  0.95rem;
     color:  var(--text-secondary);
     font-weight:  600;
 }

.trust-item svg  {
     color:  var(--accent-blue);
 }


@media (max-width: 1024px)  {
    
    .product-layout  {
     grid-template-columns:  1fr;
     gap:  4rem;
 }

}
</style>
