<script setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { Clock, Package, ExternalLink, Filter } from 'lucide-vue-next'

const store = useStore()
const orders = computed(() => store.getters['orders/allOrders'])
const loading = computed(() => store.getters['orders/isLoading'])

onMounted(() => {
    store.dispatch('orders/fetchOrders', 1)
})
</script>

<template>
  <div class="orders-page container">
    <header class="page-header animate-up">
        <h1>Procurement <span class="gradient-text">History</span></h1>
        <p>Comprehensive record of all enterprise asset acquisitions.</p>
    </header>

    <div class="orders-layout">
        <aside class="orders-filter glass">
            <h3>Refine Logs</h3>
            <div class="f-group">
                <label>Fiscal Year</label>
                <select class="input-premium">
                    <option>2026</option>
                    <option>2025</option>
                </select>
            </div>
            <div class="f-group">
                <label>Status</label>
                <div class="chk"><input type="checkbox" checked /> <span>Delivered</span></div>
                <div class="chk"><input type="checkbox" checked /> <span>Processing</span></div>
                <div class="chk"><input type="checkbox" checked /> <span>Disputed</span></div>
            </div>
        </aside>

        <main class="orders-content">
            <div v-if="loading" class="skeleton-list">
                <div v-for="i in 3" :key="i" class="skeleton glass" style="height: 120px; border-radius: 16px; margin-bottom: 1rem;"></div>
            </div>

            <div v-else-if="orders.length > 0" class="order-list">
                <div v-for="order in orders" :key="order.id" class="order-item glass-card animate-up">
                    <div class="oi-header">
                        <div class="oi-id">
                            <span class="label">TRANS-ID</span>
                            <h4>#{{ order.id }}</h4>
                        </div>
                        <div class="oi-status">
                            <span class="status-pill" :class="order.status">{{ order.status }}</span>
                        </div>
                    </div>
                    
                    <div class="oi-body">
                        <div class="oi-meta">
                            <div class="meta-bit"><Clock :size="14" /> {{ new Date(order.created_at).toLocaleDateString() }}</div>
                            <div class="meta-bit"><Package :size="14" /> Express Freight</div>
                        </div>
                        <div class="oi-price">
                            <span class="label">FISCAL TOTAL</span>
                            <span class="amount">${{ order.total_amount }}</span>
                        </div>
                        <router-link :to="'/order/' + order.id" class="btn-premium small">
                            Full Trace <ExternalLink :size="14" />
                        </router-link>
                    </div>
                </div>
            </div>

            <div v-else class="empty-state glass-card">
                <Package :size="60" />
                <h3>No procurement records found</h3>
                <router-link to="/products" class="btn-premium">Initiate Sourcing</router-link>
            </div>
        </main>
    </div>
  </div>
</template>

<style scoped>
.orders-page { padding: 4rem 0 8rem; }
.page-header { margin-bottom: 4rem; text-align: center; }
.page-header h1 { font-size: 3.5rem; margin-bottom: 1rem; }

.orders-layout { display: grid; grid-template-columns: 280px 1fr; gap: 3rem; }

.orders-filter { padding: 2rem; border-radius: 20px; height: fit-content; position: sticky; top: 100px; }
.orders-filter h3 { margin-bottom: 2rem; font-size: 1.25rem; }
.f-group { margin-bottom: 1.5rem; }
.f-group label { display: block; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 0.75rem; }

.chk { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; color: var(--text-secondary); font-size: 0.9rem; }

.order-list { display: flex; flex-direction: column; gap: 1.5rem; }
.order-item { padding: 2rem; }

.oi-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
.label { font-size: 0.65rem; color: var(--text-secondary); letter-spacing: 1px; }
.oi-id h4 { font-size: 1.4rem; font-family: 'Outfit'; margin-top: 2px; }

.status-pill { padding: 0.4rem 1rem; border-radius: 100px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
.status-pill.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.status-pill.delivered { background: rgba(16, 185, 129, 0.1); color: #10b981; }

.oi-body { display: flex; justify-content: space-between; align-items: center; }

.oi-meta { display: flex; gap: 2rem; }
.meta-bit { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-secondary); }

.oi-price { text-align: right; }
.amount { display: block; font-size: 1.5rem; font-weight: 800; font-family: 'Outfit'; color: var(--accent-blue); }

.btn-premium.small { padding: 0.6rem 1.25rem; font-size: 0.85rem; }

.empty-state { text-align: center; padding: 5rem; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; color: var(--text-secondary); }

@media (max-width: 1024px) {
    .orders-layout { grid-template-columns: 1fr; }
    .orders-filter { display: none; }
}
</style>
