<template>
  <div>
    <p v-if="faqs === null" class="infos-label">Loading...</p>
    <p v-if="faqs && !faqs.length" class="infos-label">
      You don't have any faq yet
    </p>
    <vue-good-table
      :columns="columns"
      :rows="faqs || []"
      :sort-options="{
        enabled: true,
        initialSortBy: { field: 'createdAt', type: 'desc' }
      }"
      :search-options="{
        enabled: true,
        skipDiacritics: true,
        placeholder: 'Search for question or answer'
      }"
      @on-cell-click="onCellClick"
      @on-row-click="() => {}"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      columns: [
        {
          label: 'Question',
          field: 'question',
          width: '280px'
        },
        {
          label: 'Answer',
          field: 'answer'
        },
        {
          label: 'Formulations',
          field: 'formulations',
          tdClass: row => `formulations-${row.formulations.length}`,
          type: 'number',
          formatFn: (value = []) => {
            return value.length
          }
        },
        {
          label: 'Created On',
          field: 'createdAt',
          type: 'date',
          dateInputFormat: 't',
          dateOutputFormat: 'yyyy-MM-dd kk:mm',
          width: '160px'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('faqs', ['isFaqDeletionPending']),
    ...mapState('faqs', ['faqs']),
    ...mapState('app', ['networkOnLine'])
  },
  methods: {
    ...mapActions('faqs', ['deleteUserFaq']),
    onCellClick(params) {
      this.$router.push({ name: 'faq.edit', params: { id: params.row.id } })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.infos-label {
  text-align: center;
}

.faq-row {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 10px auto;
  justify-content: space-between;
}

.vgt-wrap >>> {
  .formulations-0,
  .formulations-1 {
    color: orangered;
    font-weight: 700;
  }
}
</style>
