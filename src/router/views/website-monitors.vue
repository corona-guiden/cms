<script>
  import http from "@utils/http";
  import WebsiteMonitorCreate from "@components/_website-monitor-create.vue";
  import WebsiteMonitorDiffContent from "@components/_website-monitor-diff-content.vue";

  export default {
    components: {WebsiteMonitorDiffContent, WebsiteMonitorCreate},
    data() {
      return {
        search: '',
        loading: true,
        websiteMonitors: [],
        headers: [
          {text: 'Status', value: 'status', width: 100},
          {
            text: 'Url',
            align: 'start',
            value: 'url',
          },
          // { text: 'Answer', value: 'answer' },
          {text: 'Actions', value: 'actions', sortable: false, width: 290, align: 'end'},
        ],
      }
    },
    created() {
      this.getDataFromApi()
          .then(data => {
            this.websiteMonitors = data.data
          })
    },
    methods: {
      setMonitorAsOK(item) {
        this.websiteMonitors.find(w => w.id === item.id).status = 'ok'
        http.patch('/api/website-monitors/' + item.id, {status: 'ok'})
      },
      deleteMonitor(item) {
        if (!confirm('Are you sure you want to delete this resource?')) return

        this.websiteMonitors.splice(this.websiteMonitors.indexOf(item), 1)

        http.delete('/api/website-monitors/' + item.id)
      },
      getStatusColor(status) {
        if (status === 'new') return 'blue'
        if (status === 'ok') return 'green'
        if (status === 'updated') return 'orange'
      },
      async getDataFromApi() {
        this.loading = true

        const res = await http.get('/api/website-monitors')

        this.loading = false
        return res
      },
      truncStringPortion(str, endCharCount = 50) {
        let convertedStr = ''
        const url = (new URL(str))
        const firstCharCount = url.origin.length + 1

        convertedStr += str.substring(0, firstCharCount);
        convertedStr += '...'
        convertedStr += str.substring(str.length - endCharCount, str.length);
        return convertedStr;
      }
    },
    page() {
      return {
        title: 'Website monitors',
      }
    },
  }
</script>

<template>
    <div>
        <v-card :elevation="4" :loading="loading">
            <v-card-title>
                  Website monitors

                  <v-spacer/>

              <!--                        <v-text-field-->
              <!--                          v-model="search"-->
              <!--                          append-icon="mdi-magnify"-->
              <!--                          label="Search"-->
              <!--                          hide-details-->
              <!--                          large-->
              <!--                        />-->
              <WebsiteMonitorCreate @created="websiteMonitors.push($event)" />
            </v-card-title>

            <v-data-table
                    :headers="headers"
                    :items="websiteMonitors"
                    :search="search"
                    disable-pagination
                    hide-default-footer
            >
                <template v-slot:item.status="{ item }">
                    <v-chip :color="getStatusColor(item.status)" small dark class="text-capitalize">{{ item.status }}
                    </v-chip>
                </template>

                <template v-slot:item.url="{ item }">
                    <v-tooltip top color="primary" open-delay="500">
                        <template v-slot:activator="{ on }">
                            <a :href="item.url" target="_blank" style="text-decoration: none" v-on="on">
                                {{ truncStringPortion(item.url) }}
                            </a>
                        </template>

                        <span>{{ item.url }}</span>
                    </v-tooltip>
                </template>

                <template v-slot:item.actions="{ item }">
                    <WebsiteMonitorDiffContent
                      v-if="item.page_content_previous !== '' && item.status === 'updated'"
                      :website-monitor="item"
                    />

                    <v-tooltip v-if="item.status !== 'ok'" left>
                        <template v-slot:activator="{ on }">
                            <v-btn
                                    link
                                    icon
                                    target="_blank"
                                    @click="setMonitorAsOK(item)"
                                    v-on="on"
                            >
                                <v-icon small color="green">
                                    mdi-check
                                </v-icon>
                            </v-btn>
                        </template>

                        <span>Mark as OK</span>
                    </v-tooltip>

                    <v-tooltip left>
                      <template v-slot:activator="{ on }">
                        <v-btn
                                link
                                icon
                                :href="item.url"
                                target="_blank"
                                v-on="on"
                        >
                          <v-icon small color="orange">
                            mdi-eye
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Go to website</span>
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

                    <v-btn link icon @click="deleteMonitor(item)">
                        <v-icon small color="red">
                            mdi-delete
                        </v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>
