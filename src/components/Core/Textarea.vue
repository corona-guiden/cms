<template>
  <div class="input-wrapper" :class="{ 'has-tts': tts }">
    <textarea
      v-autoheight
      class="input"
      :class="{
        'is-loading': loading,
        'has-error': hasError,
        'full-width': expanded,
        transparent: $attrs.hasOwnProperty('transparent')
      }"
      :type="$attrs.type || 'text'"
      :value="value"
      v-bind="$attrs"
      rows="1"
      v-on="listeners"
    />

    <ssml v-if="tts" :text="value" class="input-tts"></ssml>
  </div>
</template>

<script>
import Ssml from '../Ssml'

export default {
  name: 'BaseTextarea',
  components: { Ssml },
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    loading: Boolean,
    expanded: Boolean,
    tts: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hasError: false
    }
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: event => {
          let { value } = event.target

          if (this.$attrs.type === 'number') {
            value = parseInt(value, 10)
          }

          this.$emit('input', value)
        }
      }
    }
  }
}
</script>

<style scoped>
.input-wrapper {
  position: relative;
  width: 100%;
}

textarea {
  max-width: 100%;
  min-width: 100%;

  border: 1px solid transparent;
  border-radius: 3px;
  color: var(--gray-900);
  box-shadow: none;
  display: inline-flex;
  font-size: 18px;
  font-family: inherit;
  line-height: 1.5;
  padding: 8px 15px;
  position: relative;
}

textarea::placeholder {
  color: var(--gray-600);
}

.has-tts textarea {
  padding-right: 40px;
}

.input-tts {
  position: absolute;
  right: 10px;
  top: 30px;
  transform: translateY(-50%);
  cursor: pointer;
}

.input-tts >>> svg {
  display: block;
}
</style>
