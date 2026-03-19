<script setup>
import { onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { Filter, Search, Grid, List, Package } from 'lucide-vue-next'

const store = useStore()
const products = computed(() => store.getters['products/allProducts'])
const loading = computed(() => store.getters['products/isLoading'])

const search = ref('')

const handleSearch = () => {
  store.dispatch('products/fetchProducts', { search: search.value })
}

onMounted(() => {
  store.dispatch('products/fetchProducts')
})
</script>

<template>
  <div class="products-page container">
    <header class="catalog-header animate-up">
      <h1 class="gradient-text">Industrial Catalog</h1>
      <p>Premium sourcing from global manufacturing leaders.</p>
    </header>

    <div class="catalog-layout">
      <aside class="filters glass">
        <h3>Filters</h3>
        <div class="filter-group">
          <label>Category</label>
          <div class="filter-opt">Electronics</div>
          <div class="filter-opt">Machinery</div>
          <div class="filter-opt">Chemicals</div>
        </div>
        <div class="filter-group">
          <label>Price Range</label>
          <input type="range" class="range-input" />
        </div>
      </aside>

      <main class="catalog-main">
        <div class="catalog-toolbar glass">
            <div class="search-input">
                <Search :size="16" />
                <input v-model="search" @input="handleSearch" type="text" placeholder="Search specifications..." />
            </div>
            <div class="view-options">
                <button class="active"><Grid :size="18" /></button>
                <button><List :size="18" /></button>
            </div>
        </div>

        <div v-if="loading" class="grid-skeleton">
            <div v-for="i in 8" :key="i" class="skeleton-card glass"></div>
        </div>

        <div v-else class="product-grid">
            <div v-for="product in products" :key="product.id" class="product-card glass-card">
                <div class="img-wrapper">
                    <img :src="product.images[0]" :alt="product.name" />
                    <div class="overlay">
                        <button @click="store.dispatch('cart/addToCart', product)" class="btn-icon"><Package :size="20" /></button>
                    </div>
                </div>
                <div class="p-info">
                    <span class="p-cat">Seller ID {{ product.seller_id }}</span>
                    <h4>{{ product.name }}</h4>
                    <div class="p-footer">
                        <span class="p-price">${{ product.price }}</span>
                        <router-link :to="'/product/' + product.id" class="btn-link">Details</router-link>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.products-page  {
     padding:  4rem 0;
 }

.catalog-header  {
     margin-bottom:  4rem;
     text-align:  center;
 }

.catalog-header h1  {
     font-size:  3.5rem;
     margin-bottom:  1rem;
 }


.catalog-layout  {
    
    display:  grid;
    
    grid-template-columns:  280px 1fr;
    
    gap:  3rem;
    
}

.filters  {
    
    padding:  2rem;
    
    border-radius:  20px;
    
    height:  fit-content;
    
    position:  sticky;
    
    top:  100px;
    
}

.filters h3  {
     margin-bottom:  2rem;
     font-size:  1.25rem;
 }

.filter-group  {
     margin-bottom:  2rem;
 }

.filter-group label  {
     display:  block;
     font-size:  0.8rem;
     text-transform:  uppercase;
     color:  var(--text-secondary);
     margin-bottom:  1rem;
     letter-spacing:  1px;
 }


.filter-opt  {
    
    padding:  0.6rem 0;
}

.products-page  {
     padding:  4rem 0 8rem;
 }

.catalog-layout  {
     display:  grid;
     grid-template-columns:  280px 1fr;
     gap:  4rem;
     align-items:  start;
 }


.page-header  {
     margin-bottom:  5rem;
 }

.page-header h1  {
     font-size:  3.5rem;
     letter-spacing:  -2px;
     font-weight:  900;
 }


.filters  {
     padding:  2.5rem;
     border-radius:  28px;
     position:  sticky;
     top:  110px;
     background:  white;
 }

.filters h3  {
     margin-bottom:  2rem;
     font-size:  1.25rem;
     font-weight:  800;
 }


.filter-group  {
     margin-bottom:  2.5rem;
 }

.filter-group label  {
     display:  block;
     font-size:  0.75rem;
     color:  var(--text-muted);
     text-transform:  uppercase;
     letter-spacing:  1.5px;
     font-weight:  800;
     margin-bottom:  1.25rem;
 }


.cat-list  {
     display:  flex;
     flex-direction:  column;
     gap:  0.75rem;
 }

.cat-item  {
     
    padding:  0.75rem 1.25rem;
     
    border-radius:  12px;
     
    cursor:  pointer;
     
    transition:  0.3s;
    
    font-size:  0.95rem;
    
    color:  var(--text-secondary);
    
    font-weight:  600;
    
}
.cat-item:hover  {
     background:  #f8fafc;
     color:  var(--text-primary);
 }

.cat-item.active  {
     background:  #eff6ff;
     color:  var(--accent-blue);
 }


.view-options  {
     display:  flex;
     gap:  1rem;
     margin-bottom:  3.5rem;
 }

.view-options button  {
    
    padding:  0.75rem 1.5rem;
    
    background:  white;
    
    border:  1.5px solid var(--border-glass);
    
    color:  var(--text-secondary);
    
    cursor:  pointer;
    
    border-radius:  12px;
    
    font-weight:  700;
    
    transition:  0.3s;
    
}

.view-options button:hover  {
     border-color:  var(--text-muted);
 }

.view-options button.active  {
     color:  var(--accent-blue);
     background:  #eff6ff;
     border-color:  var(--accent-blue);
 }


.product-grid  {
    
    display:  grid;
    
    grid-template-columns:  repeat(3,  1fr);
    
    gap:  2.5rem;
    
}

.product-card  {
     background:  white;
     border-radius:  28px;
     overflow:  hidden;
     padding-bottom:  1.5rem;
 }

.img-wrapper  {
    
  position:  relative;
    
  height:  260px;
    
  overflow:  hidden;
    
  background:  #f8fafc;
    
}

.img-wrapper img  {
    
  width:  100%;
    
  height:  100%;
    
  object-fit:  cover;
    
  transition:  0.8s cubic-bezier(0.2,  0.8,  0.2,  1);
    
}
.product-card:hover .img-wrapper img  {
     transform:  scale(1.1);
 }


.p-info  {
     padding:  2rem;
 }

.p-cat  {
     color:  var(--accent-blue);
     font-size:  0.75rem;
     text-transform:  uppercase;
     font-weight:  800;
     letter-spacing:  1px;
 }

.p-info h4  {
     margin:  1rem 0 1.5rem;
     font-size:  1.25rem;
     font-weight:  800;
     color:  var(--text-primary);
     line-height:  1.3;
 }

.p-footer  {
     display:  flex;
     justify-content:  space-between;
     align-items:  center;
     border-top:  1.5px solid #f1f5f9;
     padding-top:  1.5rem;
 }

.p-price  {
     font-size:  1.5rem;
     font-weight:  900;
     font-family:  'Outfit';
     color:  var(--text-primary);
 }


.grid-skeleton  {
    
    display:  grid;
    
    grid-template-columns:  repeat(3,  1fr);
    
    gap:  2.5rem;
    
}

.skeleton-card  {
     height:  400px;
     border-radius:  28px;
     background:  white;
 }


@media (max-width: 1200px)  {
    
    .catalog-layout  {
     grid-template-columns:  1fr;
 }

    .filters  {
     display:  none;
 }

    .product-grid  {
     grid-template-columns:  repeat(2,  1fr);
 }

}

@media (max-width: 640px)  {
    
    .product-grid  {
     grid-template-columns:  1fr;
 }

}
</style>
