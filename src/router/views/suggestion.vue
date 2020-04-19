<script>
export default {
  page() {
    return {
      title: this.suggestion.question,
    }
  },
  props: {
    suggestion: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <div>
    <h1>
      {{ suggestion.question }}
    </h1>

    <v-row>
      <v-col md="8">
        <v-card>
          <v-card-title v-text="suggestion.question" />
          <v-card-subtitle>
            {{ suggestion.source_updated_at }} – {{ suggestion.source.toUpperCase() }}
          </v-card-subtitle>
          <v-card-text v-html="suggestion.answer" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
