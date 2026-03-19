<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'
import { Building2, Globe, FileText, CheckCircle, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const store = useStore()
const step = ref(1)
const loading = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  companyName: '',
  businessReg: '',
  website: '',
  category: '',
  description: ''
})

const nextStep = async () => {
    if (step.value < 2) {
        step.value++
    } else if (step.value === 2) {
        loading.value = true
        try {
            const userRes = await store.dispatch('auth/signup', {
                name: form.value.name,
                email: form.value.email,
                password: form.value.password,
                role: 'seller'
            })

            await axios.post('http://localhost:5000/api/sellers', {
                user_id: userRes.userId,
                name: form.value.companyName,
                email: form.value.email,
                description: form.value.description || 'Enterprise Industrial Supplier'
            })

            step.value = 3
        } catch (err) {
            alert('Signup failed: ' + (err.response?.data?.message || err.message))
        } finally {
            loading.value = false
        }
    } else {
        router.push('/dashboard')
    }
}
</script>

<template>
  <div class="seller-signup-page container">
    <div class="stepper">
      <div v-for="i in 3" :key="i" class="step-dot" :class="{ active: step >= i, current: step === i }">
        <span v-if="step > i"><CheckCircle :size="16" /></span>
        <span v-else>{{ i }}</span>
      </div>
    </div>

    <div class="signup-card glass-card animate-up col-md-8 mx-auto">
      <div v-if="step === 1" class="step-content">
        <h1 class="gradient-text">Account Creation</h1>
        <p>Create your enterprise account to start selling.</p>
        <div class="form-grid">
          <div class="input-group full">
            <label>Full Name</label>
            <input v-model="form.name" type="text" placeholder="John Doe" required>
          </div>
          <div class="input-group">
            <label>Work Email</label>
            <input v-model="form.email" type="email" placeholder="name@company.com" required>
          </div>
          <div class="input-group">
            <label>Password</label>
            <input v-model="form.password" type="password" placeholder="••••••••" required>
          </div>
        </div>
      </div>

      <div v-if="step === 2" class="step-content">
        <h1 class="gradient-text">Business Profile</h1>
        <p>Tell us about your company to start selling globally.</p>
        <div class="form-grid">
          <div class="input-group">
            <label><Building2 :size="16" /> Company name</label>
            <input v-model="form.companyName" type="text" placeholder="e.g. Apex Industrial Ltd">
          </div>
          <div class="input-group">
            <label><FileText :size="16" /> Registration Number</label>
            <input v-model="form.businessReg" type="text" placeholder="RE-9283-X">
          </div>
          <div class="input-group full">
            <label><Globe :size="16" /> Business Website</label>
            <input v-model="form.website" type="url" placeholder="https://apex-industrial.com">
          </div>
        </div>
      </div>

      <div v-if="step === 3" class="step-content">
        <h1 class="gradient-text text-center">Ready to Go</h1>
        <p class="text-center">Your application is being processed by our admin team.</p>
        <div class="success-illustration text-center">
          <CheckCircle :size="80" color="#10b981" />
        </div>
      </div>

      <div class="card-footer">
        <button v-if="step > 1 && step < 3" @click="step--" class="btn-ghost">Back</button>
        <button @click="nextStep" class="btn-primary" :disabled="loading">
          {{ step === 3 ? 'Go to Dashboard' : (loading ? 'Processing...' : 'Next Step') }} <ArrowRight v-if="!loading" :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.seller-signup-page  {
     padding:  120px 0;
 }

.stepper  {
     display:  flex;
     justify-content:  center;
     gap:  3rem;
     margin-bottom:  3rem;
 }

.step-dot  {
     width:  40px;
     height:  40px;
     border-radius:  50%;
     border:  1px solid #e2e8f0;
     display:  flex;
     align-items:  center;
     justify-content:  center;
     background:  white;
     font-weight:  700;
     position:  relative;
 }

.step-dot.active  {
     background:  #10b981;
     color:  white;
     border-color:  #10b981;
 }

.step-dot.current  {
     box-shadow:  0 0 15px rgba(16,  185,  129,  0.4);
     transform:  scale(1.1);
 }

.spacer  {
     border-top:  1px solid #e2e8f0;
     width:  100px;
     position:  absolute;
     top:  20px;
     z-index:  -1;
 }

.signup-card  {
     padding:  4rem;
     border-radius:  20px;
     border:  1px solid #e2e8f0;
     background:  white;
 }

.form-grid  {
     display:  grid;
     grid-template-columns:  1fr 1fr;
     gap:  2rem;
     margin-top:  2rem;
 }

.full  {
     grid-column:  span 2;
 }

.input-group label  {
     display:  block;
     margin-bottom:  0.5rem;
     color:  #64748b;
     font-size:  0.9rem;
 }

.input-group input  {
     width:  100%;
     padding:  0.8rem;
     border:  1px solid #e2e8f0;
     border-radius:  8px;
 }

.success-illustration  {
     padding:  3rem 0;
 }

.card-footer  {
     display:  flex;
     justify-content:  space-between;
     margin-top:  4rem;
 }

</style>
