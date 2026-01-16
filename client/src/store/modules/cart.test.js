import { describe, it, expect, beforeEach, vi } from 'vitest'
import cart from './cart'

// Mock localStorage globally
const storage = {}
const localStorageMock = {
    getItem: vi.fn(key => storage[key] || null),
    setItem: vi.fn((key, value) => { storage[key] = value }),
    removeItem: vi.fn(key => { delete storage[key] }),
    clear: vi.fn(() => { Object.keys(storage).forEach(k => delete storage[k]) })
}
vi.stubGlobal('localStorage', localStorageMock)

describe('Cart Store Module', () => {
    let state

    beforeEach(() => {
        vi.clearAllMocks()
        state = cart.state()
    })

    it('ADD_TO_CART adds a new item to the cart', () => {
        const product = { id: 1, name: 'Product 1', price: 100 }
        cart.mutations.ADD_TO_CART(state, product)
        
        expect(state.items).toHaveLength(1)
        expect(state.items[0].id).toBe(1)
    })

    it('getters.totalPrice calculates correctly', () => {
        state.items = [
            { id: 1, price: 10, quantity: 2 },
            { id: 2, price: 15, quantity: 1 }
        ]
        const total = cart.getters.totalPrice(state)
        expect(total).toBe("35.00")
    })
})
