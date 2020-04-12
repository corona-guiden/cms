import SuggestionsDb from '@/firebase/suggestions-db'

export default {
  /**
   * Fetch suggestions
   */
  getSuggestions: async ({ rootState, commit }) => {
    const suggestionsDb = new SuggestionsDb(rootState.authentication.user.id)

    const suggestions = await suggestionsDb.readAll()
    commit('setSuggestions', suggestions)
  },

  setSuggestionToApproved: async ({ rootState, commit }, suggestion) => {
    const suggestionsDb = new SuggestionsDb(rootState.authentication.user.id)

    suggestion.status = 'approved'

    await suggestionsDb.update(suggestion)
    commit('approveSuggestion', suggestion)
  }
}
