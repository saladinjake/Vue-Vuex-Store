<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { 
    LayoutDashboard, Package, ShoppingCart, 
    BarChart3, Settings, LogOut, Search,
    TrendingUp, ArrowUpRight, Clock
} from 'lucide-vue-next'

const store = useStore()
const router = useRouter()
const activeTab = ref('overview')
const user = computed(() => store.state.auth.user)
const orders = computed(() => store.getters['orders/allOrders'])
const loading = computed(() => store.getters['orders/isLoading'])

onMounted(() => {
    if (user.value?.id) {
        store.dispatch('orders/fetchOrders', user.value.id)
    }
})

const handleLogout = () => {
    store.dispatch('auth/logout')
    router.push('/login')
}

const stats = [
    { label: 'Active Contracts', value: '12', growth: '+2', icon: LayoutDashboard },
    { label: 'Procurement Volume', value: '$248.5k', growth: '+15%', icon: BarChart3 },
    { label: 'Pending Logistics', value: '4 Assets', growth: 'Delayed', icon: Package },
    { label: 'Platform Rating', value: '4.9/5', growth: 'Top 1%', icon: TrendingUp },
]
</script>

<template>
  <div class="dashboard-container">
    <div class="container dash-layout">
      <!-- Side Navigation -->
      <aside class="dash-sidebar glass">
        <div class="user-block">
          <div class="avatar-premium">{{ user?.name ? user.name.charAt(0) : (user?.email ? user.email.charAt(0).toUpperCase() : 'U') }}</div>
          <div class="user-info">
            <h4>{{ user?.name || user?.email || 'User' }}</h4>
            <span>{{ user?.role || 'Customer' }}</span>
          </div>
        </div>

        <nav class="dash-nav">
          <button v-for="t in ['overview', 'orders', 'inventory', 'analytics', 'settings']" 
                  :key="t" 
                  :class="{ active: activeTab === t }"
                  @click="activeTab = t">
            <component :is="t === 'overview' ? LayoutDashboard : t === 'orders' ? ShoppingCart : t === 'inventory' ? Package : t === 'analytics' ? BarChart3 : Settings" :size="18" />
            {{ t.charAt(0).toUpperCase() + t.slice(1) }}
          </button>
        </nav>

        <div class="sidebar-spacer"></div>
        <button class="btn-logout" @click="handleLogout"><LogOut :size="18" /> Terminate Session</button>
      </aside>

      <!-- Main Panel -->
      <main class="dash-main animate-up">
        <header class="dash-header">
          <div class="header-text">
            <h1>Enterprise <span class="gradient-text">Intelligence</span></h1>
            <p>Unified control center for your industrial chain.</p>
          </div>
          <div class="header-actions">
            <div class="search-compact glass">
              <Search :size="16" />
              <input type="text" placeholder="Trace ID..." />
            </div>
          </div>
        </header>

        <section v-if="activeTab === 'overview'" class="tab-content">
          <div class="stats-grid">
            <div v-for="s in stats" :key="s.label" class="stat-card glass-card">
              <div class="stat-head">
                <div class="stat-icon"><component :is="s.icon" :size="20" /></div>
                <span class="growth-label" :class="{ danger: s.growth === 'Delayed' }">
                    {{ s.growth }} <ArrowUpRight :size="12" v-if="s.growth.includes('+')" />
                </span>
              </div>
              <div class="stat-body">
                <h3>{{ s.value }}</h3>
                <span>{{ s.label }}</span>
              </div>
            </div>
          </div>

          <div class="table-card glass-card">
            <div class="table-header">
                <h3>Recent Transactions</h3>
                <router-link to="/orders" class="view-all">Full History</router-link>
            </div>
            <div class="table-wrapper">
                <table class="premium-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Timestamp</th>
                            <th>Fiscal Allocation</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in orders.slice(0, 5)" :key="order.id">
                            <td><span class="id-tag">#{{ order.id }}</span></td>
                            <td><div class="date-cell"><Clock :size="14" /> {{ new Date(order.created_at).toLocaleDateString() }}</div></td>
                            <td class="price-cell">${{ order.total_amount }}</td>
                            <td><span class="status-pill" :class="order.status">{{ order.status }}</span></td>
                            <td><router-link :to="'/order/' + order.id" class="btn-table">Trace</router-link></td>
                        </tr>
                        <tr v-if="orders.length === 0">
                            <td colspan="5" class="empty-table">No recent transactions located.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
          </div>
        </section>

        <section v-if="activeTab === 'orders'" class="tab-content animate-up">
            <div class="table-card glass-card">
                <h3>All Procurement Records</h3>
                <div class="table-wrapper">
                    <table class="premium-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Timestamp</th>
                                <th>Logistics</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in orders" :key="order.id">
                                <td>#{{ order.id }}</td>
                                <td>{{ new Date(order.created_at).toLocaleString() }}</td>
                                <td>{{ order.shipping_method }}</td>
                                <td class="price-cell">${{ order.total_amount }}</td>
                                <td><span class="status-pill" :class="order.status">{{ order.status }}</span></td>
                                <td><router-link :to="'/order/' + order.id" class="btn-table">View</router-link></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <section v-if="activeTab === 'inventory'" class="tab-content animate-up">
            <div class="table-card glass-card">
                <div class="table-header">
                    <h3>Inventory Assets</h3>
                    <button class="btn-premium small">Procure New Material</button>
                </div>
                <div class="table-wrapper">
                    <table class="premium-table">
                        <thead>
                            <tr>
                                <th>Asset Module</th>
                                <th>Stock Level</th>
                                <th>Unit Price</th>
                                <th>Performance</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i in 5" :key="i">
                                <td><div class="asset-cell">Asset #X-{{ 100+i }}</div></td>
                                <td><div class="progress-wrap"><div class="progress-bar" :style="{width: (70 - i*10) + '%'}"></div></div></td>
                                <td>$420.00</td>
                                <td><span class="status-pill delivered">Optimal</span></td>
                                <td><button class="btn-table">Manage</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <section v-if="activeTab === 'analytics'" class="tab-content animate-up">
            <div class="grid-2">
                <div class="glass-card chart-mock">
                    <h3>Procurement Trends</h3>
                    <div class="chart-viz">
                        <div v-for="h in [40, 70, 50, 90, 60, 80, 45]" :key="h" class="bar" :style="{height: h + '%'}"></div>
                    </div>
                </div>
                <div class="glass-card chart-mock">
                    <h3>Vendor Performance</h3>
                    <div class="chart-viz circular">
                        <div class="inner-circle"><span>94%</span></div>
                    </div>
                </div>
            </div>
        </section>

        <section v-if="activeTab === 'settings'" class="tab-content animate-up">
            <div class="glass-card settings-panel">
                <h3>Account Configurations</h3>
                <div class="settings-form">
                    <div class="input-group full">
                        <label>Contact Email</label>
                        <input type="text" class="input-premium" value="admin@victor-mfg.com" />
                    </div>
                    <div class="input-group full">
                        <label>Security Protocol</label>
                        <select class="input-premium"><option>2FA - Hardware Key</option></select>
                    </div>
                    <button class="btn-premium">Synchronize Settings</button>
                </div>
            </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container  {
     min-height:  100vh;
     padding:  2rem 0 6rem;
     background:  #f8fafc;
 }


.progress-wrap  {
     width:  100%;
     height:  6px;
     background:  rgba(15,  23,  42,  0.05);
     border-radius:  3px;
     overflow:  hidden;
 }

.progress-bar  {
     height:  100%;
     background:  var(--accent-blue);
     border-radius:  3px;
     transition:  1s;
 }


.grid-2  {
     display:  grid;
     grid-template-columns:  1fr 1fr;
     gap:  2rem;
 }

.chart-mock  {
     padding:  2.5rem;
     height:  350px;
     display:  flex;
     flex-direction:  column;
     background:  white;
 }

.chart-viz  {
     flex:  1;
     display:  flex;
     align-items:  flex-end;
     gap:  1rem;
     margin-top:  2rem;
     padding:  0 1rem;
 }

.chart-viz.circular  {
     align-items:  center;
     justify-content:  center;
     position:  relative;
 }

.circular::before  {
     content:  '';
     width:  180px;
     height:  180px;
     border-radius:  50%;
     border:  8px solid rgba(59,  130,  246,  0.05);
 }

.circular::after  {
     content:  '';
     width:  180px;
     height:  180px;
     border-radius:  50%;
     border:  8px solid var(--accent-blue);
     border-bottom-color:  transparent;
     border-left-color:  transparent;
     position:  absolute;
     transform:  rotate(-45deg);
 }

.inner-circle  {
     position:  absolute;
     font-size:  2.5rem;
     font-weight:  900;
     font-family:  'Outfit';
     color:  var(--text-primary);
 }


.bar  {
     flex:  1;
     background:  var(--gradient-premium);
     border-radius:  4px 4px 0 0;
     transition:  transform 0.6s cubic-bezier(0.175,  0.885,  0.32,  1.275);
     transform-origin:  bottom;
     opacity:  0.85;
 }

.bar:hover  {
     transform:  scaleY(1.1);
     filter:  brightness(1.1);
     opacity:  1;
 }


.settings-panel  {
     padding:  3rem;
     max-width:  700px;
     background:  white;
 }

.settings-form  {
     display:  flex;
     flex-direction:  column;
     gap:  2.5rem;
     margin-top:  2rem;
 }

.asset-cell  {
     font-weight:  700;
     color:  var(--text-primary);
 }


.dash-layout  {
     display:  grid;
     grid-template-columns:  280px 1fr;
     gap:  3rem;
     align-items:  start;
 }


.dash-sidebar  {
     padding:  2rem;
     border-radius:  28px;
     height:  calc(100vh - 4rem);
     position:  sticky;
     top:  2rem;
     display:  flex;
     flex-direction:  column;
     background:  white;
     box-shadow:  var(--shadow-premium);
     border:  1px solid var(--border-glass);
 }


.user-block  {
     display:  flex;
     align-items:  center;
     gap:  1rem;
     margin-bottom:  3.5rem;
     padding-bottom:  2rem;
     border-bottom:  1px solid var(--border-glass);
 }

.avatar-premium  {
     width:  48px;
     height:  48px;
     border-radius:  12px;
     background:  var(--gradient-premium);
     color:  white;
     display:  flex;
     align-items:  center;
     justify-content:  center;
     font-weight:  800;
     font-family:  'Outfit';
 }

.user-info h4  {
     font-size:  0.95rem;
     line-height:  1.2;
     color:  var(--text-primary);
 }

.user-info span  {
     font-size:  0.75rem;
     color:  var(--text-muted);
 }


.dash-nav  {
     display:  flex;
     flex-direction:  column;
     gap:  0.75rem;
 }

.dash-nav button  {
    
    display:  flex;
     align-items:  center;
     gap:  1rem;
     padding:  1rem 1.25rem;
    
    background:  none;
     border:  none;
     color:  var(--text-secondary);
    
    border-radius:  14px;
     cursor:  pointer;
     transition:  0.3s;
    
    font-size:  0.95rem;
     font-weight:  600;
     font-family:  inherit;
    
    text-align:  left;
    
}
.dash-nav button:hover  {
     background:  #f8fafc;
     color:  var(--text-primary);
 }

.dash-nav button.active  {
     background:  #eff6ff;
     color:  var(--accent-blue);
 }


.sidebar-spacer  {
     flex:  1;
 }

.btn-logout  {
     
    display:  flex;
     align-items:  center;
     gap:  10px;
     padding:  1rem;
    
    color:  #ef4444;
     background:  none;
     border:  none;
     cursor:  pointer;
    
    font-size:  0.9rem;
     font-weight:  700;
     opacity:  0.8;
     transition:  0.3s;
    
}
.btn-logout:hover  {
     opacity:  1;
     transform:  translateX(5px);
 }


.dash-main  {
     display:  flex;
     flex-direction:  column;
     gap:  3.5rem;
 }


.dash-header  {
     display:  flex;
     justify-content:  space-between;
     align-items:  center;
 }

.header-text h1  {
     font-size:  2.8rem;
     font-weight:  900;
     letter-spacing:  -1px;
 }

.header-text p  {
     color:  var(--text-secondary);
     font-size:  1.1rem;
 }


.search-compact  {
     display:  flex;
     align-items:  center;
     gap:  10px;
     padding:  0.75rem 1.5rem;
     border-radius:  100px;
     background:  white;
     border:  1.5px solid var(--border-glass);
 }

.search-compact input  {
     background:  none;
     border:  none;
     color:  var(--text-primary);
     outline:  none;
     font-size:  0.9rem;
     width:  180px;
 }


.stats-grid  {
     display:  grid;
     grid-template-columns:  repeat(4,  1fr);
     gap:  2rem;
 }

.stat-card  {
     padding:  2rem;
     background:  white;
 }

.stat-head  {
     display:  flex;
     justify-content:  space-between;
     margin-bottom:  2rem;
 }

.stat-icon  {
     color:  var(--accent-blue);
     padding:  10px;
     background:  rgba(59,  130,  246,  0.05);
     border-radius:  12px;
 }

.growth-label  {
     font-size:  0.75rem;
     font-weight:  800;
     color:  #10b981;
     background:  #f0fdf4;
     padding:  5px 10px;
     border-radius:  100px;
 }

.growth-label.danger  {
     color:  #f59e0b;
     background:  #fffbeb;
 }

.stat-body h3  {
     font-size:  2rem;
     margin-bottom:  0.5rem;
     font-family:  'Outfit';
     color:  var(--text-primary);
 }

.stat-body span  {
     font-size:  0.8rem;
     color:  var(--text-muted);
     text-transform:  uppercase;
     letter-spacing:  1.5px;
     font-weight:  700;
 }


.table-card  {
     padding:  3rem;
     background:  white;
 }

.table-header  {
     display:  flex;
     justify-content:  space-between;
     align-items:  center;
     margin-bottom:  2.5rem;
 }

.view-all  {
     color:  var(--accent-blue);
     text-decoration:  none;
     font-size:  0.95rem;
     font-weight:  700;
 }


.table-wrapper  {
     width:  100%;
     overflow-x:  auto;
 }

.premium-table  {
     width:  100%;
     border-collapse:  collapse;
 }

.premium-table th  {
     text-align:  left;
     padding:  1.5rem 1rem;
     color:  var(--text-muted);
     font-size:  0.8rem;
     text-transform:  uppercase;
     letter-spacing:  1.5px;
     border-bottom:  1.5px solid #f1f5f9;
     font-weight:  800;
 }

.premium-table td  {
     padding:  1.75rem 1rem;
     border-bottom:  1.5px solid #f1f5f9;
     font-size:  0.95rem;
     color:  var(--text-secondary);
 }


.id-tag  {
     background:  #f1f5f9;
     color:  var(--text-primary);
     padding:  5px 12px;
     border-radius:  8px;
     font-weight:  800;
     font-family:  'Outfit';
 }

.date-cell  {
     display:  flex;
     align-items:  center;
     gap:  10px;
     color:  var(--text-muted);
 }

.price-cell  {
     font-weight:  800;
     font-family:  'Outfit';
     color:  var(--text-primary);
 }


.btn-table  {
     color:  var(--accent-blue);
     text-decoration:  none;
     font-size:  0.85rem;
     font-weight:  700;
     border:  1.5px solid #eff6ff;
     background:  #eff6ff;
     padding:  0.6rem 1.25rem;
     border-radius:  100px;
     transition:  0.3s;
 }

.btn-table:hover  {
     background:  var(--accent-blue);
     color:  white;
     border-color:  var(--accent-blue);
 }


.empty-table  {
     padding:  5rem;
     text-align:  center;
     color:  var(--text-muted);
 }


.premium-table tr  {
    
    transition:  background 0.2s;
    
}

.premium-table tbody tr:hover  {
    
    background:  #f8fafc;
    
}

.premium-table tbody tr:hover td  {
    
    color:  var(--text-primary);
    
}

@media (max-width:  1400px)  {
     .stats-grid  {
     grid-template-columns:  repeat(2,  1fr);
 }
 }
@media (max-width: 1024px)  {
     .dash-layout  {
     grid-template-columns:  1fr;
 }
 .dash-sidebar  {
     height:  auto;
     position:  static;
 }
 }
</style>
