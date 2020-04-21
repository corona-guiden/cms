<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" small v-on="on">
        Show diff
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
      </v-card-title>
      <v-card-text>
        <v-container>
          <VueMarkdown :source="output">Loading...</VueMarkdown>
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
  import DiffMatchPatch from "diff-match-patch";
  import VueMarkdown from 'vue-markdown'
  import * as Diff from "diff";

  export default {
    name: 'WebsiteMonitorDiffContent',
    components: { VueMarkdown },
    data() {
      return {
        dialog: false,
        output: '',
      }
    },
    props: {
      websiteMonitor: {
        type: Object,
        required: true,
      },
    },
    watch: {
      dialog(val) {
        if (!val) return

        http.get('/api/website-monitors/' + this.websiteMonitor.id).then(({data}) => {
          this.output = this.jsDiff(data.page_content_previous, data.page_content)
        })
      }
    },
    methods: {
      jsDiff(text1, text2) {
        const diff = Diff.diffWords(text1, text2)
        let output = ''

        diff.forEach((part) => {
          if (!part.added && !part.removed) {
            output += part.value
          }

          if (part.added) {
            output += `<span style="color: green">${part.value}</span>`
          }

          if (part.removed) {
            output += `<span style="color: red">${part.value}</span>`
          }
        });

        return output
      },
      diff(text1, text2) {
        const dmp = new DiffMatchPatch()
        const diff = dmp.diff_main(text1, text2, true)
        let output = ''

        diff.forEach((part) => {
          if (part[0] === 0) {
            output += part[1]
          }

          if (part[0] === 1) {
            output += `<span style="color: green">${part[1]}</span>`
          }

          if (part[0] === -1) {
            output += `<span style="color: red">${part[1]}</span>`
          }
        })

        return output
      },
      async fetchMonitor() {
        this.dialog = false
        const res = await http.post('/api/website-monitors', this.websiteMonitor)
        this.$emit('created', res.data)
      }
    },
  }
</script>
