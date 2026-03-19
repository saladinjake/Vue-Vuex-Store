<script setup>
import { ShoppingCart, User, Search, Menu } from 'lucide-vue-next'
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const cartCount = computed(() => store.getters['cart/totalItems'])
</script>

<template>
  <nav class="navbar glass">
    <div class="container nav-content">
      <router-link to="/" class="logo">
        <span class="gradient-text">B2B</span><span class="logo-light">NEXUS</span>
      </router-link>

      <div class="search-bar">
        <Search :size="18" class="search-icon" />
        <input type="text" placeholder="Search industrial assets..." />
      </div>

      <div class="nav-links">
        <router-link to="/products">Catalog</router-link>
        <router-link to="/solutions">Solutions</router-link>
        <router-link to="/vendors">Vendors</router-link>
      </div>

      <div class="nav-actions">
        <router-link to="/cart" class="icon-btn cart-btn">
          <ShoppingCart :size="22" />
          <span v-if="cartCount" class="badge">{{ cartCount }}</span>
        </router-link>
        <router-link to="/dashboard" class="icon-btn">
          <User :size="22" />
        </router-link>
        <button class="mobile-menu">
          <Menu :size="24" />
        </button>
      </div>
    </div>
  </nav>

  <main class="page-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>

  <footer class="footer glass">
    <div class="container footer-grid">
      <div class="footer-brand">
        <h3 class="gradient-text">B2B NEXUS</h3>
        <p>The elite ecosystem for industrial procurement and manufacturing assets.</p>
      </div>
      <div>
        <h4>Company</h4>
        <p>About Us</p>
        <p>Careers</p>
      </div>
      <div>
        <h4>Resources</h4>
        <p>Docs</p>
        <p>API</p>
      </div>
      <div>
        <h4>Legal</h4>
        <p>Privacy</p>
        <p>Terms</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 B2B Nexus. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.logo {
  font-family: 'Outfit', sans-serif;
  font-size: 1.6rem;
  font-weight: 900;
  text-decoration: none;
  letter-spacing: -1.5px;
}

.logo-light { color: var(--text-primary); }

.search-bar {
  position: relative;
  width: 380px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-bar input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3.2rem;
  background: #f1f5f9;
  border: 1px solid transparent;
  border-radius: 100px;
  color: var(--text-primary);
  outline: none;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.search-bar input:focus {
  background: white;
  border-color: var(--accent-blue);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  width: 420px;
}

.nav-links {
  display: flex;
  gap: 3rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 600;
  transition: 0.3s;
}

.nav-links a:hover, .nav-links a.router-link-active {
  color: var(--accent-blue);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.icon-btn {
  color: var(--text-secondary);
  text-decoration: none;
  position: relative;
  transition: 0.3s;
  padding: 8px;
  border-radius: 12px;
}

.icon-btn:hover { 
    color: var(--accent-blue); 
    background: rgba(59, 130, 246, 0.05);
}

.badge {
  position: absolute;
  top: 0px;
  right: 0px;
  background: var(--accent-pink);
  color: white;
  font-size: 0.65rem;
  font-weight: 900;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-menu {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
}

.page-container {
  padding-top: 85px;
  min-height: 100vh;
}

.footer {
  margin-top: 8rem;
  padding: 6rem 0 3rem;
  background: #f8fafc;
  border-top: 1px solid var(--border-glass);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2.5fr 1fr 1fr 1fr;
  gap: 6rem;
}

.footer-brand h3 { font-size: 1.5rem; margin-bottom: 1.5rem; }
.footer-brand p {
  color: var(--text-secondary);
  font-size: 1rem;
  max-width: 350px;
}

h4 { font-size: 1.1rem; margin-bottom: 2rem; color: var(--text-primary); }
.footer p { margin-bottom: 1rem; font-size: 0.95rem; color: var(--text-secondary); cursor: pointer; transition: 0.2s; }
.footer p:hover { color: var(--accent-blue); }

.footer-bottom {
  text-align: center;
  margin-top: 6rem;
  padding-top: 3rem;
  border-top: 1px solid var(--border-glass);
  font-size: 0.9rem;
  color: var(--text-muted);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 1024px) {
  .search-bar, .nav-links { display: none; }
  .mobile-menu { display: block; }
}
</style>
