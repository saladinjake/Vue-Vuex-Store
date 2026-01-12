<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'
import { Package, Plus, Image as ImageIcon, Trash2, Save, X } from 'lucide-vue-next'

const router = useRouter()
const store = useStore()
const categories = ref([])
const loading = ref(false)
const successMessage = ref('')

const user = computed(() => store.state.auth.user)

const form = ref({
  name: '',
  price: '',
  category_id: '',
  description: '',
  stock: '',
  images: [],
  variants: [{ type: 'Color', value: '' }]
})

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/categories')
    categories.value = res.data
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
})

const addVariant = () => {
  form.value.variants.push({ type: 'Size', value: '' })
}

const removeVariant = (index) => {
  form.value.variants.splice(index, 1)
}

const handleImageUpload = () => {
  form.value.images.push('https://picsum.photos/seed/' + Math.random() + '/800/600')
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const sellerRes = await axios.get('http://localhost:5000/api/sellers')
    const seller = sellerRes.data.find(s => s.user_id === user.value.id)
    
    if (!seller) {
      alert('You must be a registered seller to add products.')
      return
    }

    const payload = {
      ...form.value,
      seller_id: seller.id,
      images: JSON.stringify(form.value.images),
      variants: JSON.stringify(form.value.variants)
    }

    await axios.post('http://localhost:5001/api/products', payload)
    successMessage.value = 'Product published and awaiting admin approval!'
    setTimeout(() => {
      router.push('/dashboard')
    }, 2500)
  } catch (err) {
    alert('Failed to publish product: ' + err.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="add-product-page container maxWidth-md">
    <div class="page-header">
      <h1 class="gradient-text"><Package /> Add New Product</h1>
      <p>List your industrial component on the global marketplace.</p>
    </div>

    <div class="product-form-container glass">
      <form @submit.prevent="handleSubmit" class="main-form">
        <div v-if="successMessage" class="success-banner">{{ successMessage }}</div>
        
        <div class="form-section">
          <h3><Package :size="20" /> Basic Information</h3>
          <div class="input-grid">
            <div class="input-group">
              <label>Product Name</label>
              <input v-model="form.name" type="text" placeholder="e.g. Industrial Valve XJ-900" required>
            </div>
            <div class="input-group">
              <label>Category</label>
              <select v-model="form.category_id" class="glass-select" required>
                <option value="">Select Category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div class="input-group">
              <label>Unit Price ($)</label>
              <input v-model="form.price" type="number" step="0.01" placeholder="0.00" required>
            </div>
            <div class="input-group">
              <label>Stock Quantity</label>
              <input v-model="form.stock" type="number" placeholder="500" required>
            </div>
          </div>
          <div class="input-group full">
            <label>Description</label>
            <textarea v-model="form.description" rows="4" placeholder="Detailed product specifications..."></textarea>
          </div>
        </div>

        <div class="form-section">
          <h3><ImageIcon :size="20" /> Product Images</h3>
          <div class="image-uploader">
            <div v-for="(img, idx) in form.images" :key="idx" class="uploaded-preview" :style="{ backgroundImage: `url(${img})` }">
              <button @click="form.images.splice(idx, 1)" type="button" class="remove-img"><X :size="14" /></button>
            </div>
            <button @click="handleImageUpload" type="button" class="upload-btn">
              <Plus :size="24" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        <div class="form-footer">
          <router-link to="/dashboard" class="btn-ghost">Cancel</router-link>
          <button type="submit" class="btn-primary" :disabled="loading"><Save :size="18" /> {{ loading ? 'Publishing...' : 'Publish Product' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

.add-product-page  {
     padding:  120px 0;
 }

.maxWidth-md  {
     max-width:  900px;
 }

.product-form-container  {
     padding:  3rem;
     border-radius:  20px;
     background:  white;
     border:  1px solid #e2e8f0;
 }

.success-banner  {
     background:  #f0fdf4;
     border:  1px solid #10b981;
     color:  #10b981;
     padding:  1rem;
     border-radius:  8px;
     margin-bottom:  2rem;
     text-align:  center;
 }

.form-section  {
     margin-bottom:  3rem;
 }

.input-grid  {
     display:  grid;
     grid-template-columns:  1fr 1fr;
     gap:  1.5rem;
 }

.input-group label  {
     display:  block;
     margin-bottom:  0.5rem;
     font-size:  0.9rem;
     color:  #64748b;
 }

.input-group input,  .input-group textarea,  .glass-select  {
     width:  100%;
     padding:  0.75rem;
     border:  1px solid #e2e8f0;
     border-radius:  8px;
     outline:  none;
 }

.image-uploader  {
     display:  flex;
     gap:  1rem;
     flex-wrap:  wrap;
 }

.uploaded-preview  {
     width:  120px;
     height:  120px;
     border-radius:  8px;
     background-size:  cover;
     position:  relative;
 }

.remove-img  {
     position:  absolute;
     top:  -10px;
     right:  -10px;
     background:  #ef4444;
     color:  white;
     border:  none;
     border-radius:  50%;
     width:  24px;
     height:  24px;
     cursor:  pointer;
 }

.upload-btn  {
     width:  120px;
     height:  120px;
     border:  2px dashed #e2e8f0;
     border-radius:  8px;
     display:  flex;
     flex-direction:  column;
     align-items:  center;
     justify-content:  center;
     background:  none;
     color:  #94a3b8;
     cursor:  pointer;
 }

.form-footer  {
     display:  flex;
     justify-content:  flex-end;
     gap:  1.5rem;
     margin-top:  3rem;
 }

</style>
