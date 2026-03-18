export default {
    namespaced: true,
    state: () => ({
        items: JSON.parse(localStorage.getItem('cart') || '[]')
    }),
    mutations: {
        ADD_TO_CART(state, product) {
            const item = state.items.find(i => i.id === product.id)
            if (item) {
                item.quantity++
            } else {
                state.items.push({ ...product, quantity: 1 })
            }
            localStorage.setItem('cart', JSON.stringify(state.items))
        },
        REMOVE_FROM_CART(state, productId) {
            state.items = state.items.filter(i => i.id !== productId)
            localStorage.setItem('cart', JSON.stringify(state.items))
        },
        UPDATE_QTY(state, { id, qty }) {
            const item = state.items.find(i => i.id === id)
            if (item) {
                item.quantity = Math.max(1, qty)
            }
            localStorage.setItem('cart', JSON.stringify(state.items))
        },
        CLEAR_CART(state) {
            state.items = []
            localStorage.removeItem('cart')
        }
    },
    actions: {
        addToCart({ commit }, product) {
            commit('ADD_TO_CART', product)
        },
        removeFromCart({ commit }, id) {
            commit('REMOVE_FROM_CART', id)
        },
        updateQuantity({ commit }, payload) {
            commit('UPDATE_QTY', payload)
        }
    },
    getters: {
        cartItems: state => state.items,
        totalItems: state => state.items.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: state => state.items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)
    }
}
