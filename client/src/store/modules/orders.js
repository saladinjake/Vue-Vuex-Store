import axios from 'axios'

const API = 'http://localhost:5001/api/orders'

export default {
    namespaced: true,
    state: () => ({
        orders: [],
        currentOrder: null,
        loading: false
    }),
    mutations: {
        SET_ORDERS(state, orders) { state.orders = orders },
        SET_CURRENT(state, order) { state.currentOrder = order },
        SET_LOADING(state, val) { state.loading = val }
    },
    actions: {
        async placeOrder({ commit, dispatch }, orderData) {
            commit('SET_LOADING', true)
            try {
                const res = await axios.post(API, orderData)
                dispatch('cart/clearCart', null, { root: true })
                return res.data
            } catch (err) {
                console.error(err)
                throw err
            } finally {
                commit('SET_LOADING', false)
            }
        },
        async fetchOrders({ commit }, userId) {
            commit('SET_LOADING', true)
            try {
                const res = await axios.get(API, { params: { userId } })
                commit('SET_ORDERS', res.data)
            } catch (err) {
                console.error(err)
            } finally {
                commit('SET_LOADING', false)
            }
        },
        async fetchOrderById({ commit }, id) {
            commit('SET_LOADING', true)
            try {
                const res = await axios.get(`${API}/${id}`)
                commit('SET_CURRENT', res.data)
                return res.data
            } catch (err) {
                console.error(err)
            } finally {
                commit('SET_LOADING', false)
            }
        }
    },
    getters: {
        allOrders: state => state.orders,
        currentOrder: state => state.currentOrder,
        isLoading: state => state.loading
    }
}
