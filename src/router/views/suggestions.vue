<script>
  import {debounce, omit} from "lodash";
  import http from "@utils/http";

  export default {
    data() {
      return {
        search: '',
        sortBy: 'status',
        sortDesc: true,
        loading: true,
        options: {
          search: '',
          filter: {
            status: ['new', 'updated']
          },
        },
        suggestions: [],
        pagination: {
          current_page: null,
          from: null,
          last_page: null,
          per_page: null,
          to: null,
          total: null,
        },
        headers: [
          {text: 'Status', value: 'status', width: 100},
          {
            text: 'Question',
            align: 'start',
            value: 'question',
          },
          // { text: 'Answer', value: 'answer' },
          {text: 'Actions', value: 'actions', sortable: false},
        ],
      }
    },
    watch: {
      options: {
        handler() {
          this.getDataFromApi()
              .then(data => {
                this.suggestions = data.data
                this.pagination = omit(this.suggestions, 'data');
                this.pagination.per_page = parseInt(this.pagination.per_page, 10)
              })
        },
        deep: true,
      },
    },
    methods: {
      searchFor: debounce(function (val) {
        this.options.search = val;
      }, 200),
      getStatusColor(status) {
        if (status === 'new') return 'green'
        if (status === 'updated') return 'orange'
      },
      async getDataFromApi() {
        this.loading = true

        let sort = '';

        if (this.options.sortBy.length) {
          sort = (this.options.sortDesc[0] ? '-' : '') + this.options.sortBy[0]
        }

        let filters = '';

        const filter = Object.keys(this.options.filter);

        filter.forEach(key => {
          const val = this.options.filter[key]
          filters += `filter[${key}]=${val.join(',')}`
        })

        const params = {
          sort,
          search: this.options.search,
          page: this.options.page,
          perPage: this.options.itemsPerPage,
        }

        const res = await http.get('/api/suggestions?' + filters, {params})
        this.loading = false
        return res
      }
    },
    page() {
      return {
        title: 'Suggestions',
        meta: [
          {
            name: 'description',
            content: `Suggestions`,
          },
        ],
      }
    },
  }
</script>

<template>
    <div>
        <v-card :elevation="4" :loading="loading">
            <v-card-title>
                Suggestions

                <v-spacer/>

                <v-row>
                    <v-col cols="6">
                        <v-select
                                v-model="options.filter.status"
                                :items="['new', 'updated', 'approved']"
                                label="Status"
                                multiple
                        ></v-select>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field
                                append-icon="mdi-magnify"
                                label="Search question"
                                single-line
                                hide-details
                                @input="searchFor($event)"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-card-title>

            <v-data-table
                    :headers="headers"
                    :items="suggestions.data"
                    :options.sync="options"
                    :server-items-length="pagination.total"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :multi-sort="false"
                    :items-per-page="pagination.per_page"
            >
                <template v-slot:item.status="{ item }">
                    <v-chip :color="getStatusColor(item.status)" small dark class="text-capitalize">{{ item.status }}
                    </v-chip>
                </template>

                <template v-slot:item.actions="{ item }">
                    <v-tooltip left>
                      <template v-slot:activator="{ on }">
                        <v-btn
                                v-if="item.source === 'fohm'"
                                title=""
                                link
                                icon
                                :href="`https://www.folkhalsomyndigheten.se/smittskydd-beredskap/utbrott/aktuella-utbrott/covid-19/fragor-och-svar/?exp=${item.question_id}#_${item.question_id}`"
                                target="_blank"
                                v-on="on"
                        >
                          <v-icon small color="orange">
                            mdi-eye
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>View on folkhalsomyndigheten.se</span>
                    </v-tooltip>

                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-btn icon link v-on="on">
                        <v-icon small color="grey">
                          mdi-clock
                        </v-icon>
                      </v-btn>
                    </template>

                    <span><strong>Source updated at:</strong> {{ item.source_updated_at }}</span>
                  </v-tooltip>

                    <v-btn link icon :to="{ name: 'suggestion', params: { id: item.id } }">
                        <v-icon small color="primary">
                            mdi-pencil
                        </v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>
