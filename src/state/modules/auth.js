import http from '@utils/http'
import router from "@router";

export const state = {
  currentUser: getSavedState('auth.currentUser'),
}

export const mutations = {
  SET_CURRENT_USER(state, newValue) {
    state.currentUser = newValue
    saveState('auth.currentUser', newValue)
  },
}

export const getters = {
  // Whether the user is currently logged in.
  loggedIn(state) {
    return !!state.currentUser
  },
}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  async init({ state, dispatch }) {
    await http.get('/sanctum/csrf-cookie')
    dispatch('validate')
  },

  // Logs in the current user.
  logIn({ commit, dispatch, getters }, { email, password } = {}) {
    if (getters.loggedIn) return dispatch('validate')

    return http
      .post('/api/login', { email, password })
      .then(() => {
        return dispatch('validate')
      })
  },

  // Logs out the current user.
  async logOut({ commit }) {
    await http.post('/api/logout')
    commit('SET_CURRENT_USER', null)
    await router.push({ name: 'login' })
  },

  // Validates the current user
  validate({ commit, state }) {
    return http
      .get('/api/user')
      .then((response) => {
        const user = response.data
        commit('SET_CURRENT_USER', user)
        return user
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          commit('SET_CURRENT_USER', null)
        } else {
          console.warn(error)
        }
        return null
      })
  },
}

// ===
// Private helpers
// ===

function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

function saveState(key, state) {
  window.localStorage.setItem(key, JSON.stringify(state))
}
//
// function setDefaultAuthHeaders(state) {
//   http.defaults.headers.common.Authorization = 'Bearer ' + (state.currentUser
//     ? state.currentUser.token
//     : '')
// }
