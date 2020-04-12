<template>
  <div class="page-wrapper">
    <faq-detail v-if="currentFaq" :faq="currentFaq"></faq-detail>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FaqDetail from '@/components/FaqDetail'

export default {
  components: { FaqDetail },
  props: {
    id: String
  },
  computed: {
    ...mapGetters('faqs', ['getFaqById']),
    currentFaq() {
      return this.getFaqById(this.id)
    }
  }
}
</script>
