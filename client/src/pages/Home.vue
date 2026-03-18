<script setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { ArrowRight, ShieldCheck, Zap, Globe, Package } from 'lucide-vue-next'

const store = useStore()
const featuredProducts = computed(() => store.getters['products/featured'])
const loading = computed(() => store.getters['products/isLoading'])

onMounted(() => {
  store.dispatch('products/fetchFeatured')
})
</script>

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <header class="hero">
      <div class="hero-glow"></div>
      <div class="container hero-content animate-up">
        <div class="hero-text">
          <div class="badge-premium">Next-Gen Industrial Commerce</div>
          <h1>Powering the <span class="gradient-text">Global Supply Chain</span> with Intelligence</h1>
          <p>Seamless procurement, verified vendors, and industrial-grade logistics for enterprise-level operations.</p>
          <div class="hero-ctas">
            <router-link to="/products" class="btn-premium">Explore Catalog <ArrowRight :size="20" /></router-link>
            <button class="btn-ghost">Watch Demo</button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="visual-card glass shadow-premium">
            <div class="card-header">
              <div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div>
            </div>
            <div class="card-body">
              <div class="line long"></div>
              <div class="line mid"></div>
              <div class="line short"></div>
              <div class="stat-row">
                <div class="stat-box"><span class="val">98%</span><span class="lab">Up-time</span></div>
                <div class="stat-box"><span class="val">2.4k</span><span class="lab">Vendors</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Features Section -->
    <section class="features container">
      <div class="feat-card glass-card">
        <Zap class="feat-icon blue" />
        <h3>Instant Quotes</h3>
        <p>AI-driven pricing models for bulk industrial orders.</p>
      </div>
      <div class="feat-card glass-card">
        <ShieldCheck class="feat-icon purple" />
        <h3>Verified Sellers</h3>
        <p>Rigorous multi-point verification for every manufacturer.</p>
      </div>
      <div class="feat-card glass-card">
        <Globe class="feat-icon pink" />
        <h3>Global Logistics</h3>
        <p>End-to-end tracking for freight and sea-borne cargo.</p>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="featured-section container">
      <div class="section-header">
        <h2 class="outfit">Superior <span class="gradient-text">Assets</span></h2>
        <router-link to="/products" class="view-all">View Full Catalog <ArrowRight :size="16" /></router-link>
      </div>

      <div v-if="loading" class="grid-skeleton">
        <div v-for="i in 4" :key="i" class="skeleton-card glass"></div>
      </div>

      <div v-else class="product-grid">
        <div v-for="product in featuredProducts" :key="product.id" class="product-card glass-card">
          <div class="img-wrapper">
            <img :src="product.images[0]" :alt="product.name" />
            <div class="overlay">
              <button @click="store.dispatch('cart/addToCart', product)" class="btn-icon"><Package :size="20" /></button>
            </div>
          </div>
          <div class="p-info">
            <span class="p-cat">Category {{ product.category_id }}</span>
            <h4>{{ product.name }}</h4>
            <div class="p-footer">
              <span class="p-price">${{ product.price }}</span>
              <router-link :to="'/product/' + product.id" class="btn-link">Details</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page { padding-bottom: 8rem; }

.hero {
  position: relative;
  padding: 10rem 0 8rem;
  overflow: hidden;
  background: radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.05), transparent);
}

.hero-glow {
  position: absolute;
  top: -15%;
  right: -10%;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%);
  z-index: -1;
}

.hero-content {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
  gap: 5rem;
}

.badge-premium {
      display: inline-block;
  padding: 0.6rem 1.25rem;
  background: #eff6ff;
          color: var(--accent-blue);
          border-radius: 100px;
          font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 2.5rem;
  letter-spacing: 1.5px;
}

.hero-text h1 {
  font-size: 5rem;
  line-height: 1;
  letter-spacing: -2.5px;
  margin-bottom: 2rem;
  font-weight: 900;
  color: #0f172a;
}

.hero-text p {
  font-size: 1.35rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin-bottom: 4rem;
  line-height: 1.6;
}

.hero-ctas {
  display: flex;
  gap: 2rem;
}

.btn-ghost {
  background: white;
      border: 1.5px solid var(--border-glass);
  color: var(--text-primary);
    padding: 0.9rem 2.5rem;
    border-radius: 100px;
    font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

.btn-ghost:hover {
    background: #f8fafc;
    border-color: var(--text-muted);
}

.hero-visual { position: relative; }
.visual-card {
  width: 500px;
      border-radius: 28px;
      padding: 2.5rem;
  background: white;
  box-shadow: 0 40px 100px -20px rgba(15, 23, 42, 0.15);
}

.card-header { display: flex; gap: 8px; margin-bottom: 2.5rem; }
.dot { width: 12px; height: 12px; border-radius: 50%; opacity: 0.3; }
.dot.red { background: #ef4444; }
.dot.yellow { background: #fbbf24; }
.dot.green { background: #10b981; }

.line { height: 10px; border-radius: 5px; background: #f1f5f9; margin-bottom: 16px; }
.line.long { width: 100%; }
.line.mid { width: 75%; }
.line.short { width: 45%; }

.stat-row { display: flex; gap: 3rem; margin-top: 4rem; }
.stat-box { display: flex; flex-direction: column; }
.stat-box .val { font-size: 2.5rem;
   font-weight: 900; 
   font-family: 'Outfit';
    color: var(--text-primary); 
  }
.stat-box .lab { 
  color: var(--text-muted); 
  font-size: 0.85rem;
   font-weight: 600; 
   text-transform: uppercase; }

/* Features */
.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  margin-top: -4rem;
  position: relative;
  z-index: 10;
}

.feat-card { padding: 4rem 3rem; }
.feat-icon { width: 48px; height: 48px; margin-bottom: 2rem; }
.feat-icon.blue { color: var(--accent-blue); }
.feat-icon.purple { color: var(--accent-purple); }
.feat-icon.pink { color: var(--accent-pink); }
.feat-card h3 { font-size: 1.5rem; margin-bottom: 1.25rem; font-weight: 800; }
.feat-card p { color: var(--text-secondary); font-size: 1.05rem; line-height: 1.6; }

.featured-section { margin-top: 10rem; }
.section-header {
     display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 4rem;
}

.section-header h2 { font-size: 3rem; font-weight: 900; letter-spacing: -1.5px; }
.view-all {
  text-decoration: none;
  color: var(--accent-blue);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.5rem;
}

.product-card { overflow: hidden; padding-bottom: 1.5rem; }
.img-wrapper {
  position: relative;
  height: 280px;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
}

.img-wrapper img {
  width: 100%;
     height: 100%;
  object-fit: cover;
  transition: 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.product-card:hover .img-wrapper img { transform: scale(1.1); }

.overlay {
  position: absolute;
  inset: 0;
    background: rgba(15, 23, 42, 0.3);
  
    backdrop-filter: blur(4px);
  display: flex;
     align-items: center;
  justify-content: center;
  opacity: 0;
  transition: 0.4s;
}

.product-card:hover .overlay { opacity: 1; }

.btn-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: white;
      color: var(--text-primary);
      border: none;
      cursor: pointer;
  display: flex;
    align-items: center;
  justify-content: center;
  transform: translateY(30px) rotate(15deg);
  transition: 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.product-card:hover .btn-icon { transform: translateY(0) rotate(0); }

.p-info { padding: 2rem; }
.p-cat { color: var(--accent-blue);
             font-size: 0.75rem; 
   text-transform: uppercase; 
   font-weight: 800; 
   letter-spacing: 1px; }
.p-info h4 { 
  margin: 0.75rem 0 1.5rem; 
  font-size: 1.15rem; 
            font-weight: 700; 
  color: #1e293b; }
.p-footer { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
}
.p-price { 
  font-size: 1.4rem; 
  font-weight: 900; 
  font-family: 'Outfit'; 
  color: var(--text-primary); 

}
.btn-link { 
  color: var(--accent-blue); 
  text-decoration: none;
   font-size: 0.95rem; 
   font-weight: 700; 
  }

@media (max-width: 1200px) {
  .hero-content { grid-template-columns: 1fr; text-align: center; }
  .hero-text h1 { font-size: 4rem; }


  .hero-text p { margin-left: auto; 
    margin-right: auto;                }
  .hero-ctas {
     justify-content: center; }
  .hero-visual { display: none; }
  .product-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .hero-text h1 { font-size: 3rem; }
  .features { 
    grid-template-columns: 1fr; }
  .feat-card { padding: 3rem 2rem; }
  .product-grid { grid-template-columns: 1fr; }
}
</style>
