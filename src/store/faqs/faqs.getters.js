import { find } from 'lodash'

export default {
  /**
   * Check if a faq has deletion pending
   */
  isFaqDeletionPending: state => faqId =>
    state.faqDeletionPending.includes(faqId),

  isFaqUpdating: state => faqId =>
      state.faqUpdatingPending.includes(faqId),

  /**
   * Get faq by id
   */
  getFaqById: state => faqId =>
    find(state.faqs, faq => faq.id === faqId)
}
