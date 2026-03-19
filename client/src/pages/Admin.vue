<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Shield, CheckCircle, XCircle, Users, Package, AlertTriangle } from 'lucide-vue-next'

const pendingSellers = ref([])
const pendingProducts = ref([])
const stats = ref({ sellers: 0, products: 0, revenue: 0 })

const fetchData = async () => {
    try {
        const sellersRes = await axios.get('http://localhost:5001/api/admin/pending-sellers')
        pendingSellers.value = sellersRes.data
        
        const productsRes = await axios.get('http://localhost:5001/api/admin/pending-products')
        pendingProducts.value = productsRes.data

        const allSellers = await axios.get('http://localhost:5001/api/sellers')
        const allProds = await axios.get('http://localhost:5001/api/products')
        stats.value.sellers = allSellers.data.length
        stats.value.products = allProds.data.length
        stats.value.revenue = 1250000 
    } catch (err) {
        console.error('Admin fetch error:', err)
    }
}

onMounted(fetchData)

const verifySeller = async (id, status) => {
    try {
        await axios.put(`http://localhost:5001/api/admin/sellers/${id}/verify`, { status })
        await fetchData()
    } catch (err) {
        alert('Verification failed')
    }
}

const verifyProduct = async (id, status) => {
    try {
        await axios.put(`http://localhost:5001/api/admin/products/${id}/verify`, { status })
        await fetchData()
    } catch (err) {
        alert('Product moderation failed')
    }
}
</script>

<template>
  <div class="admin-page container">
    <header class="admin-header">
      <h1 class="gradient-text"><Shield /> Admin Control Center</h1>
      <div class="admin-stats">
        <div class="stat-card glass"><span>Sellers</span> {{ stats.sellers }}</div>
        <div class="stat-card glass"><span>Products</span> {{ stats.products }}</div>
        <div class="stat-card glass"><span>Revenue</span> ${{ (stats.revenue / 1000000).toFixed(1) }}M</div>
      </div>
    </header>

    <div class="admin-grid">
      <section class="admin-card glass-card">
        <h3><Users :size="20" /> Seller Verifications <span class="badge">{{ pendingSellers.length }}</span></h3>
        <div class="list-container">
          <div v-for="seller in pendingSellers" :key="seller.id" class="list-item">
            <div class="item-info">
              <h4>{{ seller.name }}</h4>
              <p>{{ seller.email }} • Applied for verification</p>
            </div>
            <div class="actions">
              <button @click="verifySeller(seller.id, 'verified')" class="btn-icon approve"><CheckCircle :size="20" /></button>
              <button @click="verifySeller(seller.id, 'rejected')" class="btn-icon reject"><XCircle :size="20" /></button>
            </div>
          </div>
          <p v-if="pendingSellers.length === 0" class="empty-state">No pending verifications.</p>
        </div>
      </section>

      <section class="admin-card glass-card">
        <h3><Package :size="20" /> Product Moderation <span class="badge">{{ pendingProducts.length }}</span></h3>
        <div class="list-container">
          <div v-for="prod in pendingProducts" :key="prod.id" class="list-item">
            <div class="item-info">
              <h4>{{ prod.name }}</h4>
              <p>{{ prod.seller }} • ${{ prod.price }} • Approval Requested</p>
            </div>
            <div class="actions">
              <button @click="verifyProduct(prod.id, 'approved')" class="btn-icon approve"><CheckCircle :size="20" /></button>
              <button @click="verifyProduct(prod.id, 'rejected')" class="btn-icon reject"><XCircle :size="20" /></button>
            </div>
          </div>
          <p v-if="pendingProducts.length === 0" class="empty-state">No products awaiting approval.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin-page  {
     padding:  120px 0;
 }

.admin-header  {
     display:  flex;
     justify-content:  space-between;
     align-items:  center;
     margin-bottom:  4rem;
 }

.admin-header h1  {
     display:  flex;
     align-items:  center;
     gap:  1rem;
     font-size:  2.5rem;
 }

.admin-stats  {
     display:  flex;
     gap:  1rem;
 }

.stat-card  {
     padding:  0.75rem 1.5rem;
     border:  1px solid #e2e8f0;
     border-radius:  12px;
     display:  flex;
     flex-direction:  column;
     background:  white;
 }

.stat-card span  {
     font-size:  0.75rem;
     color:  #64748b;
     text-transform:  uppercase;
 }

.admin-grid  {
     display:  grid;
     grid-template-columns:  1fr 1fr;
     gap:  2rem;
 }

.admin-card  {
     padding:  2rem;
     border-radius:  20px;
     border:  1px solid #e2e8f0;
     background:  white;
 }

.badge  {
     background:  #eff6ff;
     color:  #3b82f6;
     padding:  2px 8px;
     border-radius:  10px;
     font-size:  0.75rem;
     margin-left:  10px;
 }

.list-item  {
     display:  flex;
     justify-content:  space-between;
     padding:  1.5rem 0;
     border-bottom:  1px solid #f1f5f9;
 }

.item-info h4  {
     font-size:  1rem;
     margin-bottom:  0.25rem;
 }

.item-info p  {
     color:  #64748b;
     font-size:  0.85rem;
 }

.actions  {
     display:  flex;
     gap:  1rem;
 }

.btn-icon  {
     background:  none;
     border:  none;
     cursor:  pointer;
     transition:  0.2s;
 }

.btn-icon:hover  {
     transform:  scale(1.2);
 }

.approve  {
     color:  #10b981;
 }

.reject  {
     color:  #ef4444;
 }

.empty-state  {
     padding:  3rem 0;
     text-align:  center;
     color:  #94a3b8;
 }

</style>
