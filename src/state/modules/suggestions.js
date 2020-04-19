import http from '@utils/http'
import {omit} from "lodash";

export const state = {
  data: [],
  pagination: {
    current_page: null,
    from: null,
    last_page: null,
    per_page: null,
    to: null,
    total: null,
  }
}

export const getters = {}

export const mutations = {
  CACHE_SUGGESTION(state, newSuggestion) {
    state.data.push(newSuggestion)
  },
  SET_SUGGESTIONS(state, suggestions) {
    suggestions.data.forEach(s => {
      if (state.data.some((suggestion) => suggestion.id === s.id)) {
        return
      }

      state.data.push(s)
    })

    state.pagination = omit(suggestions, 'data');
  },
}

export const actions = {
  fetchSuggestion({ commit, state, rootState }, { id }) {
    // 2. Check if we've already fetched and cached the user.
    const matchedSuggestion = state.data.find((suggestion) => suggestion.id === id)
    if (matchedSuggestion) {
      return Promise.resolve(matchedSuggestion)
    }

    // 3. Fetch the user from the API and cache it in case
    //    we need it again in the future.
    return http.get(`/api/suggestions/${id}`).then((response) => {
      const suggestion = response.data
      commit('CACHE_SUGGESTION', suggestion)
      return suggestion
    })
  },
}
