<template>
  <div class="suggestion-detail">
    <h1>{{ suggestion.question }}</h1>
    <small>{{ suggestion.createdAt }}</small>
    <div>
      <small><strong>Source:</strong> {{ suggestion.sourceId }} </small>
      <small><strong>Status:</strong> {{ suggestion.status }}</small>
    </div>
    <p>{{ suggestion.answer }}</p>
  </div>
</template>

<script>
export default {
  props: {
    suggestion: Object
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.suggestion-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
}
</style>
