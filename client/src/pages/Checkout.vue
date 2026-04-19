<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Truck, Shield, Lock, ChevronRight, Check, Globe, CreditCard } from 'lucide-vue-next'

const store = useStore()
const router = useRouter()

const user = computed(() => store.state.auth.user)
const cartItems = computed(() => store.getters['cart/cartItems'])
const subtotal = computed(() => parseFloat(store.getters['cart/totalPrice']))
const shippingCost = ref(150) // Premium flat rate
const tax = computed(() => +(subtotal.value * 0.05).toFixed(2))
const total = computed(() => +(subtotal.value + shippingCost.value + tax.value).toFixed(2))

const step = ref(1)
const placing = ref(false)
const paymentGateway = ref('paystack')

const shipping = ref({
    firstName: user.value?.name?.split(' ')[0] || '', 
    lastName: user.value?.name?.split(' ')[1] || '',
    company: '', email: user.value?.email || '',
    phone: '', address: '',
    city: '', state: '',
    zip: '', country: 'US'
})

const payWithStripe = async () => {
    placing.value = true
    try {
        const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/create-checkout-session`, {
            items: cartItems.value,
            email: shipping.value.email
        });
        
        // Before redirecting, we store the intent or create a pending order.
        // For this demo, we'll create the order first so it exists in the system.
        const orderData = {
            userId: user.value?.id || 1,
            total: total.value,
            items: cartItems.value.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price, name: i.name })),
            shipping: shipping.value,
            shippingMethod: 'Express Freight',
            shippingCost: shippingCost.value,
            tax: tax.value,
            paymentMethod: 'STRIPE',
            paymentReference: res.data.id
        }
        await store.dispatch('orders/placeOrder', orderData)
        await store.dispatch('cart/clearCart')

        const result = await stripe.redirectToCheckout({
            sessionId: res.data.id
        });
        if (result.error) alert(result.error.message);
    } catch (err) {
        console.error('Stripe error:', err)
        const errMsg = err.response?.data?.error || err.message || 'Unknown error'
        alert('Stripe payment failed: ' + errMsg)
    } finally {
        placing.value = false
    }
}

const payWithPaystack = () => {
    placing.value = true
    const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_your_default_key',
        email: shipping.value.email,
        amount: Math.round(total.value * 100),
        ref: 'PAY_' + Math.floor((Math.random() * 1000000000) + 1),
        callback: (response) => {
            handleCheckout(response.reference)
        },
        onClose: () => {
            placing.value = false
            alert('Payment cancelled.')
        }
    });
    handler.openIframe();
}

const handleCheckout = async (paymentRef = null) => {
    placing.value = true
    try {
        const orderData = {
            userId: user.value?.id || 1,
            total: total.value,
            items: cartItems.value.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price, name: i.name })),
            shipping: shipping.value,
            shippingMethod: 'Express Freight',
            shippingCost: shippingCost.value,
            tax: tax.value,
            paymentMethod: paymentGateway.value.toUpperCase(),
            paymentReference: paymentRef
        }
        const res = await store.dispatch('orders/placeOrder', orderData)
        await store.dispatch('cart/clearCart')
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
        <h1>Secure <span class="gradient-text">Checkout</span></h1>
        <p>Enterprise procurement terminal.</p>
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
                    <button @click="step = 3" class="btn-premium">Continue to Payment <ChevronRight :size="18" /></button>
                </div>
            </section>

            <section v-if="step === 3" class="checkout-form glass-card animate-up">
                <h3><CreditCard :size="20" /> Payment Selection</h3>
                
                <div class="gateway-selection">
                    <p class="selection-label">Choose your secure payment provider:</p>
                    <div class="gateway-grid">
                        <div class="gateway-card" :class="{ active: paymentGateway === 'paystack' }" @click="paymentGateway = 'paystack'">
                            <CreditCard :size="28" />
                            <span>Paystack</span>
                        </div>
                        <div class="gateway-card" :class="{ active: paymentGateway === 'stripe' }" @click="paymentGateway = 'stripe'">
                            <Globe :size="28" />
                            <span>Stripe</span>
                        </div>
                    </div>
                </div>

                <div class="payment-info glass">
                    <p v-if="paymentGateway === 'paystack'">Cards, Bank Transfer, USSD, and Mobile Money.</p>
                    <p v-else>Visa, Mastercard, American Express, and Digital Wallets.</p>
                </div>

                <div class="btn-row">
                    <button @click="step = 2" class="btn-ghost">Back</button>
                    <button @click="paymentGateway === 'stripe' ? payWithStripe() : payWithPaystack()" class="btn-premium" :disabled="placing">
                        <Lock v-if="!placing" :size="18" />
                        <span v-if="!placing">Pay with {{ paymentGateway === 'stripe' ? 'Stripe' : 'Paystack' }} — ${{ total }}</span>
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
.checkout-page  {
     padding:  4rem 0;
 }

.checkout-header  {
     margin-bottom:  4rem;
     text-align:  center;
 }


.checkout-layout  {
    
    display:  grid;
    
    grid-template-columns:  1fr 380px;
    
    gap:  3rem;
    
}

.progress-bar  {
    
    display:  flex;
    
    align-items:  center;
    
    gap:  1.5rem;
    
    padding:  1rem 2rem;
    
    border-radius:  100px;
    
    margin-bottom:  3rem;
    
    width:  fit-content;
    
}

.step  {
     display:  flex;
     align-items:  center;
     gap:  10px;
     opacity:  0.4;
 }

.step.active  {
     opacity:  1;
     color:  var(--accent-blue);
 }

.step.done  {
     opacity:  1;
     color:  var(--accent-pink);
 }

.step-num  {
    
    width:  24px;
     height:  24px;
     border-radius:  50%;
     border:  1px solid currentColor;
    
    display:  flex;
     align-items:  center;
     justify-content:  center;
     font-size:  0.75rem;
     font-weight:  800;
    
}

.checkout-form  {
     padding:  3rem;
 }

.checkout-form h3  {
     display:  flex;
     align-items:  center;
     gap:  12px;
     margin-bottom:  2rem;
     font-size:  1.5rem;
 }


.form-grid  {
    
    display:  grid;
    
    grid-template-columns:  1fr 1fr;
    
    gap:  1.5rem;
    
    margin-bottom:  3rem;
    
}

.input-premium.full  {
     grid-column:  span 2;
 }


.review-items  {
     margin-bottom:  3rem;
 }

.r-item  {
    
    display:  flex;
     align-items:  center;
     gap:  1.5rem;
    
    padding:  1rem 0;
    
    border-bottom:  1px solid var(--border-glass);
    
}
.r-item img  {
     width:  60px;
     height:  60px;
     border-radius:  12px;
     object-fit:  cover;
 }

.r-info  {
     flex:  1;
 }

.r-info h4  {
     font-size:  1rem;
 }

.r-info p  {
     color:  var(--text-secondary);
     font-size:  0.85rem;
 }

.r-price  {
     font-weight:  700;
     color:  var(--accent-blue);
 }


.summary-sidebar  {
    
    padding:  2.5rem;
    
    border-radius:  20px;
    
    height:  fit-content;
    
}

.summary-sidebar h3  {
     margin-bottom:  2rem;
 }

.sum-row  {
     display:  flex;
     justify-content:  space-between;
     margin-bottom:  1rem;
     color:  var(--text-secondary);
 }

.sum-row.total  {
     font-size:  1.5rem;
     color:  white;
     font-weight:  800;
 }

.divider  {
     height:  1px;
     background:  var(--border-glass);
     margin:  2rem 0;
 }

.trust-icons  {
     margin-top:  2rem;
     display:  flex;
     flex-direction:  column;
     gap:  10px;
 }

.trust  {
     display:  flex;
     align-items:  center;
     gap:  8px;
     font-size:  0.8rem;
     color:  var(--text-secondary);
 }


.btn-row  {
     display:  flex;
     justify-content:  space-between;
     align-items:  center;
 }


.gateway-selection  {
     margin:  2rem 0;
 }

.selection-label  {
     font-size:  0.9rem;
     color:  var(--text-secondary);
     margin-bottom:  1.5rem;
 }

.gateway-grid  {
     display:  grid;
     grid-template-columns:  1fr 1fr;
     gap:  1.5rem;
 }

.gateway-card  {
    
    display:  flex;
     flex-direction:  column;
     align-items:  center;
     gap:  1rem;
    
    padding:  2rem;
     border-radius:  20px;
     border:  1px solid var(--border-glass);
    
    cursor:  pointer;
     transition:  0.3s cubic-bezier(0.4,  0,  0.2,  1);
    
    background:  rgba(255,  255,  255,  0.03);
    
}
.gateway-card:hover  {
     transform:  translateY(-5px);
     background:  rgba(255,  255,  255,  0.08);
     border-color:  var(--accent-blue);
 }

.gateway-card.active  {
     border-color:  var(--accent-blue);
     background:  rgba(59,  130,  246,  0.15);
     box-shadow:  0 10px 30px rgba(59,  130,  246,  0.2);
 }

.gateway-card span  {
     font-weight:  700;
     font-size:  1rem;
 }

.payment-info  {
     padding:  1rem 1.5rem;
     border-radius:  12px;
     margin-bottom:  2rem;
     font-size:  0.85rem;
     color:  var(--text-secondary);
     text-align:  center;
 }


@media (max-width: 1024px)  {
    
    .checkout-layout  {
     grid-template-columns:  1fr;
 }

}
</style>
