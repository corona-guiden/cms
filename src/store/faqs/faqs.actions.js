import FaqsDB from '@/firebase/faqs-db'

export default {
  /**
   * Fetch faqs
   */
  getFaqs: async ({ commit }) => {
    const faqsDb = new FaqsDB()

    const faqs = await faqsDb.readAll()
    commit('setFaqs', faqs)
  },

  /**
   * Create a faq
   */
  createFaq: async ({ commit }, faq) => {
    const faqsDb = new FaqsDB()

    commit('setFaqCreationPending', true)
    const createdFaq = await faqsDb.create(faq)
    commit('addFaq', createdFaq)
    commit('setFaqCreationPending', false)
    return createdFaq
  },

  updateFaq: async ({ commit }, faq) => {
    const faqsDb = new FaqsDB()

    commit('addFaqUpdatingPending', faq.id)
    const updatedFaq = await faqsDb.update(faq)
    commit('updateFaq', faq)
    commit('removeFaqUpdatingPending', faq.id)

    return updatedFaq
  },

  /**
   * Create a new faq and reset faq object
   */
  triggerAddFaqAction: async ({ dispatch, state, commit }) => {
    if (state.faqToCreate === {}) return

    const faq = state.faqToCreate
    commit('setFaqToCreate', {})
    // eslint-disable-next-line consistent-return
    return dispatch('createFaq', faq)
  },

  /**
   * Delete a faq from its id
   */
  deleteUserFaq: async ({ commit, getters }, faqId) => {
    if (getters.isFaqDeletionPending(faqId)) return

    const userFaqsDb = new FaqsDB()

    commit('addFaqDeletionPending', faqId)
    await userFaqsDb.delete(faqId)
    commit('removeFaqById', faqId)
    commit('removeFaqDeletionPending', faqId)
  }
}
