<template>
  <div>
    <p v-if="suggestions === null" class="infos-label">Loading...</p>
    <p v-if="suggestions && !suggestions.length" class="infos-label">
      You don't have any suggestion yet
    </p>
    <vue-good-table
      :columns="columns"
      :rows="suggestions"
      @on-cell-click="onCellClick"
      @on-row-click="() => {}"
    >
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field === 'actions'">
          <a class="primary-link" role="button" @click.prevent="triggerFaqToCreate(props.row)">
            Create FAQ
          </a>
        </span>
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { cloneDeep } from 'lodash'

export default {
  data() {
    return {
      columns: [
        {
          label: 'Question',
          field: 'question'
        },
        {
          label: 'Source',
          field: 'sourceId',
          filterOptions: {
            enabled: true,
            filterDropdownItems: ['FOHM', '1177']
          }
        },
        {
          label: 'Status',
          field: 'status',
          tdClass: this.tdClassFunc,
          filterOptions: {
            enabled: true,
            filterDropdownItems: ['New', 'Active']
          }
        },
        {
          label: 'Created On',
          field: 'createdAt',
          type: 'date',
          dateInputFormat: 't',
          dateOutputFormat: 'yyyy-MM-dd kk:mm',
          width: '160px'
        },
        {
          label: 'Actions',
          field: 'actions'
        }
      ]
    }
  },
  computed: {
    ...mapState('suggestions', ['suggestions']),
    ...mapState('app', ['networkOnLine'])
  },
  methods: {
    ...mapMutations('faqs', ['setFaqToCreate']),
    tdClassFunc(row) {
      return `status-${row.status.toLowerCase()}`
    },
    onCellClick(params) {
      if (params.column.field === 'actions') {
        return
      }

      this.$router.push({ name: 'suggestion', params: { id: params.row.id } })
    },
    triggerFaqToCreate(row) {
      const data = cloneDeep(row)

      data.status = 'active'
      data.suggestionId = data.id

      this.$delete(data, 'id')
      this.setFaqToCreate(data)
      this.$router.push({ name: 'faqs.create' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.infos-label {
  text-align: center;
}

.suggestion-row {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 40px auto;
  justify-content: space-between;
}

.vgt-wrap >>> .status-new {
  color: green;
}
</style>
