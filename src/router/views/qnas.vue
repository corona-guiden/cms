<script>
  import http from "@utils/http";

  export default {
    data() {
      return {
        search: '',
        loading: false,
        filters: {
          status: []
        },
        options: {
          itemsPerPage: -1,
        },
        qnas: [],
        headers: [
          {text: 'Status', value: 'status', width: 100},
          {
            text: 'Question',
            align: 'start',
            value: 'question',
          },
          { text: 'Updated', value: 'source_updated_at', align: 'end', width: 170 },
          { text: 'Actions', value: 'actions', sortable: false, align: 'end', width: 180 },
        ],
      }
    },
    computed: {
      filteredQnas() {
        return this.qnas.filter(d => {
          return Object.keys(this.filters).every(f => {
            return this.filters[f].length < 1 || this.filters[f].includes(d[f])
          })
        })
      }
    },
    created() {
      // this.getDataFromApi().then(data => {
      //   this.qnas = data
      // })
    },
    methods: {
      getStatusColor(status) {
        if (status === 'new') return 'blue'
        if (status === 'updated') return 'orange'
        if (status === 'approved') return 'green'
      },
      async getDataFromApi() {
        this.loading = true
        const res = await http.get('/api/qnas')
        this.loading = false

        return res.data
      }
    },
    page() {
      return {
        title: 'QNA\'s',
      }
    },
  }
</script>

<template>
    <div>
        <v-card :elevation="4" :loading="loading">
            <v-card-title>
                QNA's

                <v-spacer/>

                <v-row>
                    <v-col cols="6">
                        <v-select
                                v-model="filters.status"
                                :items="['new', 'updated', 'approved']"
                                label="Filter status"
                                solo
                                large
                                hide-details
                                multiple
                        ></v-select>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field
                                v-model="search"
                                append-icon="mdi-magnify"
                                label="Search"
                                solo
                                hide-details
                                large
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-card-title>

            <v-data-table
                    :headers="headers"
                    :items="filteredQnas"
                    :options.sync="options"
                    :multi-sort="false"
                    :search="search"
                    @click:row.self="$router.push({ name: 'suggestion', params: { id: $event.id } })"
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
