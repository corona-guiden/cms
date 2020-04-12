export default {
  /* Suggestions */
  setSuggestions: (state, suggestions) => (state.suggestions = suggestions),
  addSuggestion: (state, suggestions) => state.suggestions.push(suggestions),
  approveSuggestion: (state, suggestion) =>
    (state.suggestions.find(s => s.id === suggestion.id).status = 'approved')
}
