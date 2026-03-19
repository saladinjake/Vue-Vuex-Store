<script setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { CheckCircle, Truck, Package, MapPin, Calendar, CreditCard } from 'lucide-vue-next'

const store = useStore()
const route = useRoute()

const order = computed(() => store.state.orders.currentOrder)
const loading = computed(() => store.state.orders.loading)

onMounted(() => {
    store.dispatch('orders/fetchOrderById', route.params.id)
})
</script>

<template>
  <div class="order-detail container">
    <div v-if="loading" class="loading-state">
        <div class="skeleton glass" style="height: 400px; border-radius: 20px;"></div>
    </div>

    <div v-else-if="order" class="animate-up">
        <div v-if="route.query.new" class="success-banner glass">
            <CheckCircle :size="50" class="banner-icon" />
            <div>
                <h2>Order Transmitted Successfully</h2>
                <p>Transaction ID: #{{ order.id }} | Status: Processing</p>
            </div>
        </div>

        <div class="detail-grid">
            <div class="main-info">
                <section class="info-card glass-card">
                    <div class="card-header">
                        <h3><Package :size="20" /> Order Assets</h3>
                        <span class="status-pill blue">{{ order.status }}</span>
                    </div>
                    <div class="order-items">
                        <div v-for="item in order.items" :key="item.id" class="o-item">
                            <img :src="item.images[0]" />
                            <div class="o-details">
                                <h4>{{ item.name }}</h4>
                                <p>Industrial Grade | Qty: {{ item.quantity }}</p>
                            </div>
                            <span class="o-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
                        </div>
                    </div>
                </section>

                <section class="info-card glass-card">
                    <h3><Truck :size="20" /> Tracking & Logistics</h3>
                    <div class="tracking-viz">
                        <div class="track-line">
                            <div class="fill" style="width: 30%"></div>
                        </div>
                        <div class="nodes">
                            <div class="node active"><span class="dot"></span><span>Placed</span></div>
                            <div class="node"><span class="dot"></span><span>Shipment</span></div>
                            <div class="node"><span class="dot"></span><span>Port Transit</span></div>
                            <div class="node"><span class="dot"></span><span>Delivered</span></div>
                        </div>
                    </div>
                </section>
            </div>

            <aside class="side-info">
                <div class="info-card glass-card">
                    <h4><MapPin :size="16" /> Facility Address</h4>
                    <p>{{ order.shipping_details.firstName }} {{ order.shipping_details.lastName }}</p>
                    <p>{{ order.shipping_details.company }}</p>
                    <p>{{ order.shipping_details.address }}</p>
                    <p>{{ order.shipping_details.city }}, {{ order.shipping_details.state }} {{ order.shipping_details.zip }}</p>
                    <p class="email-text">{{ order.shipping_details.email }}</p>
                </div>

                <div class="info-card glass-card">
                    <h4><Calendar :size="16" /> Timestamp</h4>
                    <p>{{ new Date(order.created_at).toLocaleString() }}</p>
                </div>

                <div class="info-card glass-card">
                    <h4><CreditCard :size="16" /> Payment</h4>
                    <p>{{ order.payment_method }}</p>
                    <div class="divider"></div>
                    <div class="total-row">
                        <span>Total Paid</span>
                        <span class="price">${{ order.total_amount }}</span>
                    </div>
                </div>
            </aside>
        </div>
    </div>
  </div>
</template>

<style scoped>
.order-detail  {
     padding:  4rem 0 8rem;
 }


.success-banner  {
    
    display:  flex;
    
    align-items:  center;
    
    gap:  3rem;
    
    padding:  3rem 4rem;
    
    border-radius:  28px;
    
    margin-bottom:  4rem;
    
    background:  #f0fdf4;
    
    border:  1.5px solid #dcfce7;
    
}

.banner-icon  {
     color:  #22c55e;
 }

.success-banner h2  {
     font-size:  1.8rem;
     font-weight:  900;
     color:  #166534;
 }

.success-banner p  {
     color:  #166534;
     opacity:  0.8;
     font-weight:  600;
 }


.detail-grid  {
    
    display:  grid;
    
    grid-template-columns:  1fr 380px;
    
    gap:  3.5rem;
    
}

.info-card  {
     padding:  3rem;
     margin-bottom:  3rem;
     background:  white;
 }

.info-card h3  {
     display:  flex;
     align-items:  center;
     gap:  15px;
     margin-bottom:  2.5rem;
     font-size:  1.5rem;
     font-weight:  900;
 }

.info-card h4  {
     display:  flex;
     align-items:  center;
     gap:  12px;
     font-size:  0.8rem;
     text-transform:  uppercase;
     color:  var(--text-muted);
     margin-bottom:  1.5rem;
     letter-spacing:  1.5px;
     font-weight:  800;
 }


.card-header  {
     display:  flex;
     justify-content:  space-between;
     align-items:  center;
     margin-bottom:  3rem;
 }


.status-pill.blue  {
     background:  #eff6ff;
     color:  var(--accent-blue);
 }


.order-items  {
     display:  flex;
     flex-direction:  column;
     gap:  2rem;
 }

.o-item  {
     display:  grid;
     grid-template-columns:  80px 1fr auto;
     gap:  2rem;
     align-items:  center;
 }

.o-item img  {
     width:  80px;
     height:  80px;
     border-radius:  16px;
     object-fit:  cover;
     background:  #f8fafc;
 }

.o-details  {
     flex:  1;
 }

.o-details h4  {
     font-size:  1.1rem;
     color:  var(--text-primary);
     text-transform:  none;
     margin:  0;
     letter-spacing:  normal;
 }

.o-details p  {
     font-size:  0.9rem;
     color:  var(--text-muted);
     margin-top:  6px;
     font-weight:  600;
 }

.o-price  {
     font-weight:  800;
     font-family:  'Outfit';
     font-size:  1.25rem;
     color:  var(--text-primary);
 }


.tracking-viz  {
     padding:  3rem 0 1rem;
 }

.track-line  {
     height:  6px;
     background:  #f1f5f9;
     border-radius:  10px;
     position:  relative;
     margin-bottom:  2.5rem;
 }

.track-line .fill  {
     position:  absolute;
     left:  0;
     top:  0;
     height:  100%;
     background:  var(--accent-blue);
     border-radius:  10px;
     box-shadow:  0 0 20px rgba(59,  130,  246,  0.3);
 }


.nodes  {
     display:  flex;
     justify-content:  space-between;
 }

.node  {
     display:  flex;
     flex-direction:  column;
     align-items:  center;
     gap:  12px;
     font-size:  0.8rem;
     color:  var(--text-muted);
     font-weight:  700;
 }

.node.active  {
     color:  var(--text-primary);
 }

.node .dot  {
     width:  14px;
     height:  14px;
     border-radius:  50%;
     background:  #e2e8f0;
     transition:  0.3s;
 }

.node.active .dot  {
     background:  var(--accent-blue);
     box-shadow:  0 0 15px rgba(59,  130,  246,  0.4);
 }


.side-info p  {
     font-size:  1rem;
     margin-bottom:  0.75rem;
     color:  var(--text-secondary);
     font-weight:  500;
 }

.email-text  {
     color:  var(--accent-blue) !important;
     font-weight:  700 !important;
 }

.divider  {
     height:  1.5px;
     background:  #f1f5f9;
     margin:  2rem 0;
 }

.total-row  {
     display:  flex;
     justify-content:  space-between;
     align-items:  center;
 }

.total-row span:first-child  {
     font-weight:  700;
     color:  var(--text-muted);
 }

.total-row .price  {
     font-size:  2rem;
     font-weight:  900;
     color:  var(--text-primary);
     font-family:  'Outfit';
 }


@media (max-width: 1024px)  {
    
    .detail-grid  {
     grid-template-columns:  1fr;
 }

}
</style>
