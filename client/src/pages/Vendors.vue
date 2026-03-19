<script setup>
import { onMounted, ref } from 'vue'
import { 
    Globe, ShieldCheck, MapPin, 
    ArrowRight, Star, Building
} from 'lucide-vue-next'

const vendors = ref([])
const loading = ref(true)

onMounted(async () => {
    try {
        const res = await fetch('http://localhost:5001/api/sellers')
        vendors.value = await res.json()
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
})
</script>

<template>
  <div class="vendors-page container">
    <header class="page-header animate-up">
        <h1>Verified <span class="gradient-text">Vendors</span></h1>
        <p>Direct connectivity to global industrial manufacturers and distributors.</p>
    </header>

    <div v-if="loading" class="grid-skeleton">
        <div v-for="i in 6" :key="i" class="skeleton-card glass"></div>
    </div>

    <div v-else class="vendor-grid">
        <div v-for="vendor in vendors" :key="vendor.id" class="vendor-card glass-card animate-up">
            <div class="v-header">
                <div class="v-logo glass">
                    <img :src="vendor.logo || 'https://picsum.photos/seed/v'+vendor.id+'/200'" />
                </div>
                <div class="v-rating"><Star :size="14" fill="#fbbf24" color="#fbbf24" /> 4.8</div>
            </div>
            
            <div class="v-body">
                <h3>{{ vendor.store_name }}</h3>
                <div class="v-meta">
                    <div class="meta-bit"><MapPin :size="14" /> Logistics Hub, GER</div>
                    <div class="meta-bit"><ShieldCheck :size="14" /> Verified Since 2024</div>
                </div>
                <p>Specializing in precision industrial assets and high-fidelity manufacturing equipment.</p>
            </div>

            <div class="v-footer">
                <div class="v-stats">
                    <div class="v-stat"><span>1.2k</span><p>Assets</p></div>
                    <div class="v-stat"><span>98%</span><p>Fulfillment</p></div>
                </div>
                <router-link :to="'/vendor/' + vendor.id" class="btn-premium small">
                    View Portfolio <ArrowRight :size="16" />
                </router-link>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>

.vendors-page  {
     padding:  4rem 0 8rem;
 }

.page-header  {
     text-align:  center;
     margin-bottom:  6rem;
 }

.page-header h1  {
     font-size:  3.5rem;
     margin-bottom:  1rem;
 }


.vendor-grid  {
     display:  grid;
     grid-template-columns:  repeat(3,  1fr);
     gap:  2.5rem;
 }


.vendor-card  {
     padding:  2.5rem;
     display:  flex;
     flex-direction:  column;
     gap:  1.5rem;
 }


.v-header  {
     display:  flex;
     justify-content:  space-between;
     align-items:  flex-start;
 }

.v-logo  {
     width:  64px;
     height:  64px;
     border-radius:  12px;
     overflow:  hidden;
 }

.v-logo img  {
     width:  100%;
     height:  100%;
     object-fit:  cover;
 }

.v-rating  {
     background:  rgba(251,  191,  36,  0.1);
     color:  #fbbf24;
     padding:  4px 10px;
     border-radius:  100px;
     font-size:  0.75rem;
     font-weight:  800;
     display:  flex;
     align-items:  center;
     gap:  6px;
 }


.v-body h3  {
     font-size:  1.5rem;
     margin-bottom:  0.75rem;
 }

.v-meta  {
     display:  flex;
     flex-direction:  column;
     gap:  8px;
     margin-bottom:  1.5rem;
 }

.meta-bit  {
     display:  flex;
     align-items:  center;
     gap:  10px;
     font-size:  0.8rem;
     color:  var(--text-secondary);
 }

.meta-bit svg  {
     color:  var(--accent-blue);
 }

.v-body p  {
     color:  var(--text-secondary);
     font-size:  0.9rem;
     line-height:  1.6;
 }


.v-footer  {
     margin-top:  auto;
     padding-top:  2rem;
     border-top:  1px solid var(--border-glass);
     display:  flex;
     justify-content:  space-between;
     align-items:  center;
 }

.v-stats  {
     display:  flex;
     gap:  1.5rem;
 }

.v-stat span  {
     display:  block;
     font-weight:  800;
     font-family:  'Outfit';
     font-size:  1.1rem;
 }

.v-stat p  {
     font-size:  0.65rem;
     color:  var(--text-secondary);
     text-transform:  uppercase;
     margin:  0;
 }


.btn-premium.small  {
     padding:  0.6rem 1.25rem;
     font-size:  0.85rem;
 }


.grid-skeleton  {
     display:  grid;
     grid-template-columns:  repeat(3,  1fr);
     gap:  2.5rem;
 }

.skeleton-card  {
     height:  400px;
     border-radius:  20px;
 }


@media (max-width: 1024px)  {
     .vendor-grid  {
     grid-template-columns:  repeat(2,  1fr);
 }
 }
@media (max-width: 640px)  {
     .vendor-grid  {
     grid-template-columns:  1fr;
 }
 }

</style>
