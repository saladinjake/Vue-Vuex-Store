import axios from 'axios'

const API = 'http://localhost:5001/api/products'

export default {
    namespaced: true,
    state: () => ({
        products: [],
        featuredProducts: [],
        loading: false,
        error: null
    }),
    mutations: {
        SET_PRODUCTS(state, products) { state.products = products },
        SET_FEATURED(state, products) { state.featuredProducts = products },
        SET_LOADING(state, val) { state.loading = val },
        SET_ERROR(state, msg) { state.error = msg }
    },
    actions: {
        async fetchProducts({ commit }, params = {}) {
            commit('SET_LOADING', true)
            try {
                const res = await axios.get(API, { params })
                commit('SET_PRODUCTS', res.data)
            } catch (err) {
                commit('SET_ERROR', err.message)
            } finally {
                commit('SET_LOADING', false)
            }
        },
        async fetchFeatured({ commit }) {
            try {
                const res = await axios.get(API, { params: { featured: 1, limit: 8 } })
                commit('SET_FEATURED', res.data)
            } catch (err) {
                console.error('Featured error:', err)
            }
        }
    },
    getters: {
        allProducts: state => state.products,
        featured: state => state.featuredProducts,
        isLoading: state => state.loading
    }
}
