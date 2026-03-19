import axios from 'axios'

const API = 'http://localhost:5001'

export default {
    namespaced: true,
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async login({ commit }, credentials) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)
            try {
                const res = await axios.post(`${API}/api/auth/login`, credentials)
                if (res.data.success) {
                    commit('SET_USER', res.data.user)
                    commit('SET_TOKEN', res.data.token)
                    localStorage.setItem('user', JSON.stringify(res.data.user))
                    localStorage.setItem('token', res.data.token)
                    return res.data
                }
            } catch (err) {
                const errMsg = err.response?.data?.message || err.message
                commit('SET_ERROR', errMsg)
                throw err
            } finally {
                commit('SET_LOADING', false)
            }
        },
        async signup({ commit }, userData) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)
            try {
                const res = await axios.post(`${API}/api/auth/register`, userData)
                if (res.data.success) {
                    commit('SET_USER', res.data.user)
                    commit('SET_TOKEN', res.data.token)
                    localStorage.setItem('user', JSON.stringify(res.data.user))
                    localStorage.setItem('token', res.data.token)
                    return res.data
                }
            } catch (err) {
                const errMsg = err.response?.data?.message || err.message
                commit('SET_ERROR', errMsg)
                throw err
            } finally {
                commit('SET_LOADING', false)
            }
        },
        logout({ commit }) {
            commit('SET_USER', null)
            commit('SET_TOKEN', null)
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        }
    },
    mutations: {
        SET_USER(state, user) { state.user = user },
        SET_TOKEN(state, token) { state.token = token },
        SET_LOADING(state, val) { state.loading = val },
        SET_ERROR(state, msg) { state.error = msg }
    }
}
