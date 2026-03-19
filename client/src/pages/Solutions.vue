<script setup>
import { 
    Cpu, Network, Factory, Box, 
    ArrowRight, Check, Zap, Shield
} from 'lucide-vue-next'

const solutions = [
    {
        title: 'Smart Manufacturing',
        desc: 'End-to-end automation and IoT integration for legacy production lines.',
        icon: Factory,
        color: 'blue'
    },
    {
        title: 'Supply Chain Intelligence',
        desc: 'Real-time traceability and predictive logistics using ML models.',
        icon: Network,
        color: 'purple'
    },
    {
        title: 'B2B Procurement API',
        desc: 'Seamlessly integrate our industrial catalog into your custom ERP systems.',
        icon: Cpu,
        color: 'pink'
    }
]
</script>

<template>
  <div class="solutions-page">
    <header class="solutions-hero container">
      <div class="hero-content animate-up">
        <h1 class="gradient-text">Industrial <span class="white-text">Optimization</span></h1>
        <p>Advanced ecosystem solutions for modern manufacturing and enterprise procurement.</p>
        <div class="hero-stats">
          <div class="h-stat"><span>30%</span><p>Efficiency Uplift</p></div>
          <div class="h-stat"><span>15ms</span><p>Transaction Latency</p></div>
          <div class="h-stat"><span>256-bit</span><p>Security Encryption</p></div>
        </div>
      </div>
    </header>

    <section class="solutions-grid container">
      <div v-for="s in solutions" :key="s.title" class="sol-card glass-card">
        <div class="icon-wrap" :class="s.color">
          <component :is="s.icon" :size="32" />
        </div>
        <h3>{{ s.title }}</h3>
        <p>{{ s.desc }}</p>
        <ul class="features">
            <li><Check :size="14" /> High-fidelity tracking</li>
            <li><Check :size="14" /> Cloud-native architecture</li>
            <li><Check :size="14" /> Enterprise-grade SLA</li>
        </ul>
        <button class="btn-premium small">Learn More <ArrowRight :size="16" /></button>
      </div>
    </section>

    <section class="cta-section container animate-up">
      <div class="cta-card glass">
        <div class="cta-text">
            <h2>Ready to evolve your <span class="gradient-text">Infrastructure?</span></h2>
            <p>Join over 2,000 industrial leaders optimizing their chain on B2B Nexus.</p>
        </div>
        <button class="btn-premium">Contact Solutions Team</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.solutions-page  {
     padding:  4rem 0 8rem;
 }

.solutions-hero  {
     text-align:  center;
     margin-bottom:  6rem;
 }

.solutions-hero h1  {
     font-size:  4rem;
     margin-bottom:  1.5rem;
     font-weight:  800;
 }

.white-text  {
     color:  white;
     -webkit-text-fill-color:  white;
 }

.solutions-hero p  {
     font-size:  1.25rem;
     color:  var(--text-secondary);
     max-width:  700px;
     margin:  0 auto 4rem;
 }


.hero-stats  {
     display:  flex;
     justify-content:  center;
     gap:  4rem;
 }

.h-stat span  {
     display:  block;
     font-size:  2.5rem;
     font-weight:  800;
     font-family:  'Outfit';
     color:  var(--accent-blue);
 }

.h-stat p  {
     font-size:  0.85rem;
     color:  var(--text-secondary);
     text-transform:  uppercase;
     letter-spacing:  1px;
     margin:  0;
 }


.solutions-grid  {
     display:  grid;
     grid-template-columns:  repeat(3,  1fr);
     gap:  2.5rem;
 }

.sol-card  {
     padding:  3rem;
     display:  flex;
     flex-direction:  column;
     gap:  1.5rem;
 }

.icon-wrap  {
     width:  64px;
     height:  64px;
     border-radius:  16px;
     display:  flex;
     align-items:  center;
     justify-content:  center;
 }

.icon-wrap.blue  {
     background:  rgba(59,  130,  246,  0.1);
     color:  var(--accent-blue);
 }

.icon-wrap.purple  {
     background:  rgba(139,  92,  246,  0.1);
     color:  var(--accent-purple);
 }

.icon-wrap.pink  {
     background:  rgba(236,  72,  153,  0.1);
     color:  var(--accent-pink);
 }


.sol-card h3  {
     font-size:  1.5rem;
 }

.sol-card p  {
     color:  var(--text-secondary);
     font-size:  0.95rem;
 }


.features  {
     list-style:  none;
     display:  flex;
     flex-direction:  column;
     gap:  10px;
     margin:  1.5rem 0;
 }

.features li  {
     display:  flex;
     align-items:  center;
     gap:  10px;
     font-size:  0.85rem;
     color:  var(--text-secondary);
 }

.features li svg  {
     color:  #10b981;
 }


.btn-premium.small  {
     padding:  0.6rem 1.5rem;
     font-size:  0.9rem;
     margin-top:  auto;
 }


.cta-section  {
     margin-top:  8rem;
 }

.cta-card  {
     padding:  4rem;
     border-radius:  32px;
     display:  flex;
     justify-content:  space-between;
     align-items:  center;
     gap:  3rem;
 }

.cta-text h2  {
     font-size:  2.5rem;
     margin-bottom:  1rem;
 }

.cta-text p  {
     color:  var(--text-secondary);
     font-size:  1.1rem;
 }


@media (max-width: 1024px)  {
    
  .solutions-grid  {
     grid-template-columns:  1fr;
 }

  .cta-card  {
     flex-direction:  column;
     text-align:  center;
     padding:  3rem;
 }

}

</style>
