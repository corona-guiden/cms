<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" large v-on="on">
        Create monitor
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Website monitor</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="websiteMonitor.url"
                label="Website URL"
                type="url"
                hint="Full URL to the website"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="websiteMonitor.dateSelector"
                label="Date selector"
                hint="CSS selector for the updated at date. Ex: '.footer .updated-at time'"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="websiteMonitor.contentSelector"
                label="Content selector"
                hint="CSS selector for the main content. Ex: '.article__main' or '#content'"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" dark @click.prevent="create">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import http from '@utils/http.js';

  export default {
    name: 'WebsiteMonitorCreate',
    data() {
      return {
        dialog: false,
        websiteMonitor: {
          url: '',
          selector: '',
        },
      }
    },
    methods: {
      async create() {
        this.dialog = false
        const res = await http.post('/api/website-monitors', this.websiteMonitor)
        this.$emit('created', res.data)
      }
    },
  }
</script>
