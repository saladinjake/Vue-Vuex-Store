import { createStore } from 'vuex'
import products from './modules/products'
import cart from './modules/cart'
import orders from './modules/orders'

export default createStore({
    modules: {
        products,
        cart,
        orders
    }
})
