<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-vue-next'

const store = useStore()
const cartItems = computed(() => store.getters['cart/cartItems'])
const totalItems = computed(() => store.getters['cart/totalItems'])
const totalPrice = computed(() => store.getters['cart/totalPrice'])

const updateQty = (id, qty) => {
    store.dispatch('cart/updateQuantity', { id, qty })
}

const removeItem = (id) => {
    store.dispatch('cart/removeFromCart', id)
}
</script>

<template>
  <div class="cart-page container">
    <header class="cart-header animate-up">
      <h1 class="gradient-text">Procurement <span class="white-text">Basket</span></h1>
      <p>Manage your industrial assets and manufacturing requirements.</p>
    </header>

    <div v-if="cartItems.length > 0" class="cart-layout animate-up">
      <div class="cart-main">
        <div v-for="item in cartItems" :key="item.id" class="cart-card glass-card">
          <img :src="item.images[0]" :alt="item.name" class="item-img" />
          
          <div class="item-info">
            <span class="p-cat">Asset ID: #PRD-{{ item.id }}</span>
            <h3>{{ item.name }}</h3>
            <p class="p-vendor">Supplier: Unified Manufacturing Corp.</p>
          </div>

          <div class="item-controls">
            <div class="qty-selector glass">
              <button @click="updateQty(item.id, item.quantity - 1)" class="qty-btn"><Minus :size="16" /></button>
              <span class="qty-val">{{ item.quantity }}</span>
              <button @click="updateQty(item.id, item.quantity + 1)" class="qty-btn"><Plus :size="16" /></button>
            </div>
            <div class="price-info">
              <span class="unit-price">${{ item.price }} / unit</span>
              <span class="total-price-item">${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
            <button @click="removeItem(item.id)" class="remove-btn">
              <Trash2 :size="20" />
            </button>
          </div>
        </div>
      </div>

      <aside class="cart-summary glass">
        <h3>Order Intelligence</h3>
        <div class="summary-lines">
          <div class="sum-row">
            <span>Subtotal ({{ totalItems }} items)</span>
            <span>${{ totalPrice }}</span>
          </div>
          <div class="sum-row">
            <span>Logistics & Freight</span>
            <span>$150.00</span>
          </div>
          <div class="sum-row">
            <span>Estimated Tax (5%)</span>
            <span>${{ (totalPrice * 0.05).toFixed(2) }}</span>
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="sum-total">
          <span>Final Amount</span>
          <span class="total-val">${{ (parseFloat(totalPrice) + 150 + parseFloat(totalPrice * 0.05)).toFixed(2) }}</span>
        </div>

        <router-link to="/checkout" class="btn-premium checkout-btn">
          Initialize Checkout <ArrowRight :size="20" />
        </router-link>

        <div class="trust-badge">
          <ShieldCheck :size="18" />
          <span>Verified Enterprise Transaction</span>
        </div>
      </aside>
    </div>

    <div v-else class="empty-cart glass-card animate-up">
      <ShoppingBag :size="80" class="empty-icon" />
      <h2>Your basket is empty</h2>
      <p>Explore our premium catalog to add industrial assets to your procurement project.</p>
      <router-link to="/products" class="btn-premium">Browse Catalog</router-link>
    </div>
  </div>
</template>

<style scoped>
.cart-page  {
     padding:  4rem 0 8rem;
 }

.cart-header  {
     margin-bottom:  4rem;
     text-align:  center;
 }

.cart-header h1  {
     font-size:  3.5rem;
     margin-bottom:  1rem;
     letter-spacing:  -2px;
 }


.cart-layout  {
    
  display:  grid;
    
  grid-template-columns:  1fr 380px;
    
  gap:  4rem;
    
  align-items:  start;
    
}

.cart-main  {
     display:  flex;
     flex-direction:  column;
     gap:  1.5rem;
 }


.cart-card  {
    
  display:  flex;
    
  align-items:  center;
    
  gap:  2.5rem;
    
  padding:  2rem;
    
  background:  white;
    
}

.item-img  {
    
  width:  140px;
    
  height:  140px;
    
  object-fit:  cover;
    
  border-radius:  20px;
    
  background:  #f8fafc;
    
}

.item-info  {
     flex:  1;
 }

.p-cat  {
     font-size:  0.75rem;
     color:  var(--text-muted);
     text-transform:  uppercase;
     letter-spacing:  1px;
     font-weight:  800;
     margin-bottom:  0.5rem;
     display:  block;
 }

.item-info h3  {
     font-size:  1.4rem;
     margin-bottom:  0.5rem;
     color:  var(--text-primary);
 }

.p-vendor  {
     color:  var(--text-secondary);
     font-size:  0.9rem;
     margin-bottom:  1.5rem;
 }


.item-controls  {
    
  display:  flex;
    
  align-items:  center;
    
  gap:  3rem;
    
}

.qty-selector  {
    
  display:  flex;
    
  align-items:  center;
    
  gap:  1.5rem;
    
  padding:  0.5rem 1rem;
    
  border-radius:  100px;
    
  background:  #f1f5f9;
    
}

.qty-btn  {
    
  background:  none;
    
  border:  none;
    
  color:  var(--text-primary);
    
  cursor:  pointer;
    
  display:  flex;
    
  padding:  6px;
    
  transition:  0.2s;
    
  border-radius:  8px;
    
}
.qty-btn:hover  {
     background:  white;
     color:  var(--accent-blue);
     box-shadow:  0 4px 10px rgba(0, 0, 0, 0.05);
 }


.qty-val  {
     font-weight:  800;
     min-width:  25px;
     text-align:  center;
     font-family:  'Outfit';
 }


.price-info  {
     display:  flex;
     flex-direction:  column;
     text-align:  right;
     min-width:  140px;
 }

.unit-price  {
     font-size:  0.85rem;
     color:  var(--text-muted);
 }

.total-price-item  {
     font-size:  1.4rem;
     font-weight:  900;
     font-family:  'Outfit';
     color:  var(--text-primary);
 }


.remove-btn  {
    
  background:  none;
    
  border:  none;
    
  color:  #ef4444;
    
  cursor:  pointer;
    
  opacity:  0.7;
    
  transition:  0.3s;
    
  padding:  10px;
    
  border-radius:  12px;
    
}
.remove-btn:hover  {
     opacity:  1;
     background:  #fef2f2;
     transform:  scale(1.1);
 }


.cart-summary  {
     padding:  3rem;
     border-radius:  28px;
     position:  sticky;
     top:  110px;
     background:  white;
 }

.cart-summary h3  {
     margin-bottom:  2.5rem;
     font-size:  1.8rem;
     font-weight:  900;
 }


.summary-lines  {
     display:  flex;
     flex-direction:  column;
     gap:  1.25rem;
 }

.sum-row  {
     display:  flex;
     justify-content:  space-between;
     color:  var(--text-secondary);
     font-size:  1rem;
 }


.divider  {
     height:  1.5px;
     background:  #f1f5f9;
     margin:  2rem 0;
 }


.sum-total  {
    
  display:  flex;
    
  justify-content:  space-between;
    
  align-items:  center;
    
  margin-bottom:  2rem;
    
}
.sum-total span:first-child  {
     font-weight:  700;
     font-size:  1.1rem;
     color:  var(--text-primary);
 }

.total-val  {
     font-size:  2rem;
     font-weight:  900;
     font-family:  'Outfit';
     color:  var(--text-primary);
 }


.checkout-btn  {
     width:  100%;
     justify-content:  center;
     height:  64px;
     font-size:  1.1rem;
 }


.trust-badge  {
    
  display:  flex;
    
  align-items:  center;
    
  justify-content:  center;
    
  gap:  10px;
    
  margin-top:  2rem;
    
  font-size:  0.85rem;
    
  color:  var(--text-muted);
    
}

.empty-cart  {
    
  text-align:  center;
    
  padding:  8rem 2rem;
    
  display:  flex;
    
  flex-direction:  column;
    
  align-items:  center;
    
  max-width:  600px;
    
  margin:  2rem auto;
    
}

.empty-icon  {
     color:  #f1f5f9;
     margin-bottom:  2.5rem;
 }

.empty-cart h2  {
     font-size:  2.5rem;
     margin-bottom:  1rem;
     font-weight:  900;
 }

.empty-cart p  {
     color:  var(--text-secondary);
     margin-bottom:  3.5rem;
     font-size:  1.1rem;
 }


@media (max-width: 1200px)  {
    
  .cart-layout  {
     grid-template-columns:  1fr;
 }

  .cart-summary  {
     position:  static;
     margin-top:  2rem;
 }

}

@media (max-width: 768px)  {
    
  .cart-card  {
     flex-direction:  column;
     text-align:  center;
 }

  .item-controls  {
     flex-direction:  column;
     gap:  2rem;
     width:  100%;
 }

  .price-info  {
     text-align:  center;
 }

}
</style>
