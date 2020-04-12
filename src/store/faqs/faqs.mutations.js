export default {
  /* Faq input */
  setFaqToCreate: (state, faq) => {
    state.faqToCreate = { ...state.faqToCreate, ...faq }
  },

  /* Faqs */
  setFaqs: (state, faqs) => (state.faqs = faqs),
  addFaq: (state, faq) => state.faqs.push(faq),
  removeFaqById: (state, faqId) => {
    const index = state.faqs.findIndex(faq => faq.id === faqId)
    state.faqs.splice(index, 1)
  },

  updateFaq: (state, faq) => {
    state.faqs = [
      ...state.faqs.filter(f => f.id !== faq.id),
      faq
    ]
  },

  /* Faqs deletion */
  addFaqDeletionPending: (state, faqId) => state.faqDeletionPending.push(faqId),
  removeFaqDeletionPending: (state, faqId) => {
    const index = state.faqs.findIndex(faq => faq.id === faqId)
    state.faqDeletionPending.splice(index, 1)
  },

  /* Faq creation */
  setFaqCreationPending: (state, value) => (state.faqCreationPending = value),

  /* Faq updating */
  addFaqUpdatingPending: (state, value) => (state.faqUpdatingPending.push(value)),
  removeFaqUpdatingPending: (state, faqId) => {
    const index = state.faqs.findIndex(faq => faq.id === faqId)
    state.faqUpdatingPending.splice(index, 1)
  },
}
