<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Truck, Shield, Lock, ChevronRight, Check } from 'lucide-vue-next'

const store = useStore()
const router = useRouter()

const cartItems = computed(() => store.getters['cart/cartItems'])
const subtotal = computed(() => parseFloat(store.getters['cart/totalPrice']))
const shippingCost = ref(150) // Premium
const tax = computed(() => +(subtotal.value * 0.05).toFixed(2))
const total = computed(() => +(subtotal.value + shippingCost.value + tax.value).toFixed(2))

const step = ref(1)
const placing = ref(false)

const shipping = ref({
    firstName: '', lastName: '',
    company: '', email: '',
    phone: '', address: '',
    city: '', state: '',
    zip: '', country: 'US'
})

const handleCheckout = async () => {
    placing.value = true
    try {
        const orderData = {
            userId: 1, // Mock
            total: total.value,
            items: cartItems.value.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
            shipping: shipping.value,
            shippingMethod: 'Express Freight',
            shippingCost: shippingCost.value,
            tax: tax.value,
            paymentMethod: 'Bank Wire'
        }
        const res = await store.dispatch('orders/placeOrder', orderData)
        router.push(`/order/${res.orderId}?new=1`)
    } catch (err) {
        alert('Checkout failed')
    } finally {
        placing.value = false
    }
}
</script>

<template>
  <div class="checkout-page container">
    <header class="checkout-header animate-up">
        <h1>Secured <span class="gradient-text">Checkout</span></h1>
        <p>Payment and shipping terminal.</p>
    </header>

    <div class="checkout-layout">
        <div class="checkout-main">
            <!-- Progress -->
            <div class="progress-bar glass">
                <div v-for="(s, i) in ['Shipping', 'Review', 'Payment']" :key="i"
                     class="step" :class="{ active: step === i+1, done: step > i+1 }">
                    <span class="step-num">{{ i+1 }}</span>
                    <span class="step-label">{{ s }}</span>
                    <ChevronRight v-if="i < 2" :size="16" />
                </div>
            </div>

            <section v-if="step === 1" class="checkout-form glass-card animate-up">
                <h3><Truck :size="20" /> Shipping Logistics</h3>
                <div class="form-grid">
                    <input v-model="shipping.firstName" class="input-premium" placeholder="First Name" />
                    <input v-model="shipping.lastName" class="input-premium" placeholder="Last Name" />
                    <input v-model="shipping.company" class="input-premium full" placeholder="Corporation Name" />
                    <input v-model="shipping.email" class="input-premium full" placeholder="Business Email" />
                    <input v-model="shipping.address" class="input-premium full" placeholder="Facility Address" />
                    <input v-model="shipping.city" class="input-premium" placeholder="City" />
                    <input v-model="shipping.zip" class="input-premium" placeholder="Postal Code" />
                </div>
                <button @click="step = 2" class="btn-premium">Continue to Review <ChevronRight :size="18" /></button>
            </section>

            <section v-if="step === 2" class="checkout-form glass-card animate-up">
                <h3><Shield :size="20" /> Order Review</h3>
                <div class="review-items">
                    <div v-for="item in cartItems" :key="item.id" class="r-item">
                        <img :src="item.images[0]" />
                        <div class="r-info">
                            <h4>{{ item.name }}</h4>
                            <p>Qty: {{ item.quantity }}</p>
                        </div>
                        <span class="r-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
                    </div>
                </div>
                <div class="btn-row">
                    <button @click="step = 1" class="btn-ghost">Back</button>
                    <button @click="handleCheckout" class="btn-premium" :disabled="placing">
                        <Lock v-if="!placing" :size="18" />
                        <span v-if="!placing">Place Order — ${{ total }}</span>
                        <span v-else>Processing...</span>
                    </button>
                </div>
            </section>
        </div>

        <aside class="summary-sidebar glass">
            <h3>Summary</h3>
            <div class="sum-row"><span>Subtotal</span><span>${{ subtotal }}</span></div>
            <div class="sum-row"><span>Logistics</span><span>${{ shippingCost }}</span></div>
            <div class="sum-row"><span>Tax</span><span>${{ tax }}</span></div>
            <div class="divider"></div>
            <div class="sum-row total"><span>Total</span><span>${{ total }}</span></div>
            <div class="trust-icons">
                <div class="trust"><Check :size="14" /> Encrypted Transaction</div>
                <div class="trust"><Check :size="14" /> Logistics Insurance</div>
            </div>
        </aside>
    </div>
  </div>
</template>

<style scoped>
.checkout-page { padding: 4rem 0; }
.checkout-header { margin-bottom: 4rem; text-align: center; }

.checkout-layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 3rem;
}

.progress-bar {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem 2rem;
    border-radius: 100px;
    margin-bottom: 3rem;
    width: fit-content;
}

.step { display: flex; align-items: center; gap: 10px; opacity: 0.4; }
.step.active { opacity: 1; color: var(--accent-blue); }
.step.done { opacity: 1; color: var(--accent-pink); }
.step-num {
    width: 24px; 
    height: 24px; 
    border-radius: 50%; 
    border: 1px solid currentColor;
    display: flex; 
    align-items: center; 
    justify-content: center;
     font-size: 0.75rem; font-weight: 800;
}

.checkout-form { padding: 3rem; }
.checkout-form h3 { 
    display: flex; align-items: center;
     gap: 12px; margin-bottom: 2rem;
      font-size: 1.5rem; }

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.input-premium.full { grid-column: span 2; }

.review-items { margin-bottom: 3rem; }
.r-item {
    display: flex; align-items: center; gap: 1.5rem;
    padding: 1rem 0;
    border-bottom: 1px solid var(--border-glass);
}
.r-item img { 
    width: 60px; height: 60px; 
    border-radius: 12px; 
    object-fit: cover; }
.r-info { flex: 1; }
.r-info h4 { font-size: 1rem; }
.r-info p { 
    color: var(--text-secondary); 
    font-size: 0.85rem; }
.r-price { font-weight: 700; color: var(--accent-blue); }

.summary-sidebar {
    padding: 2.5rem;
    border-radius: 20px;
    height: fit-content;
}

.summary-sidebar h3 { margin-bottom: 2rem; }
.sum-row { 
    display: flex; 
    justify-content: space-between;
     margin-bottom: 1rem; 
     color: var(--text-secondary); 
    
    
    }

    .sum-row.total { 
        font-size: 1.5rem; 
        color: white; 
        
        font-weight: 800; }
.divider {
     height: 1px;
      background: var(--border-glass); 
      margin: 2rem 0; }


      .trust-icons { margin-top: 2rem; display: flex; flex-direction: column; gap: 10px; }
.trust { 
    display: flex; align-items: center;
     gap: 8px; font-size: 0.8rem; 
     
     
     color: var(--text-secondary); 
    
    }

.btn-row {
     display: flex;
     
     justify-content: space-between; align-items: center; }

@media (max-width: 1024px) {
    .checkout-layout { grid-template-columns: 1fr; }
}
</style>
