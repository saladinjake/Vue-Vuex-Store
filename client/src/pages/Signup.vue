<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { User, Mail, Lock, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const store = useStore()

const form = ref({
    name: '',
    email: '',
    password: '',
    role: 'customer'
})

const loading = computed(() => store.state.auth.loading)
const errorMsg = computed(() => store.state.auth.error)

const handleSignup = async () => {
    try {
        await store.dispatch('auth/signup', form.value)
        router.push('/')
    } catch (err) {
        console.error(err)
    }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card glass">
      <div class="auth-header">
        <h1 class="gradient-text">Create Account</h1>
        <p>Join the global B2B network</p>
      </div>

      <form @submit.prevent="handleSignup" class="auth-form">
        <div v-if="errorMsg" class="error-banner">
            {{ errorMsg }}
        </div>
        <div class="input-group">
          <label>Full Name</label>
          <div class="input-wrapper">
            <User :size="20" />
            <input v-model="form.name" type="text" placeholder="John Doe" required>
          </div>
        </div>

        <div class="input-group">
          <label>Email Address</label>
          <div class="input-wrapper">
            <Mail :size="20" />
            <input v-model="form.email" type="email" placeholder="name@company.com" required>
          </div>
        </div>

        <div class="input-group">
          <label>Password</label>
          <div class="input-wrapper">
            <Lock :size="20" />
            <input v-model="form.password" type="password" placeholder="••••••••" required>
          </div>
        </div>

        <button type="submit" class="btn-primary auth-submit" :disabled="loading">
          <span v-if="!loading">Get Started <ArrowRight :size="18" /></span>
          <span v-else class="loader"></span>
        </button>
      </form>

      <div class="auth-footer">
        <p>Already have an account? <router-link to="/login">Sign In</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Same styles as Login.vue */
.auth-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at bottom left, rgba(139, 92, 246, 0.15), transparent);
}

.auth-card {
  width: 100%;
  max-width: 480px;
  padding: 3rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.auth-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.error-banner {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #94a3b8;
}

.input-wrapper {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 12px;
}

.input-wrapper input {
  background: none;
  border: none;
  color: #f8fafc;
  width: 100%;
  outline: none;
  font-size: 1rem;
}

.auth-submit {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
}

.auth-footer a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid white;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
