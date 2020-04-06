<template>
  <input
    ref="input"
    class="input"
    :class="{
      'is-loading': loading,
      'has-error': hasError,
      'has-border': $attrs.hasOwnProperty('border'),
      'is-large': $attrs.hasOwnProperty('large'),
      'is-narrow': isNarrow,
      transparent: $attrs.hasOwnProperty('transparent')
    }"
    :type="$attrs.type || 'text'"
    :value="computedValue"
    v-bind="$attrs"
    @input="onInput"
  />
</template>

<script>
export default {
  name: 'BaseInput',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    loading: Boolean,
    isNarrow: Boolean
  },
  data() {
    return {
      newValue: this.value,
      hasError: false
    }
  },
  computed: {
    computedValue: {
      get() {
        return this.newValue
      },
      set(value) {
        this.newValue = value
        this.$emit('input', value)
      }
    }
  },
  watch: {
    /**
     * When v-model is changed:
     *   1. Set internal value.
     */
    value(value) {
      this.newValue = value
    }
  },
  methods: {
    /**
     * Input's 'input' event listener, 'nextTick' is used to prevent event firing
     * before ui update, helps when using masks (Cleavejs and potentially others).
     */
    onInput(event) {
      this.$nextTick(() => {
        if (event.target) {
          this.computedValue = event.target.value
        }
      })
    }
  }
}
</script>

<style scoped>
.input {
  align-items: center;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--gray-900);
  box-shadow: none;
  display: inline-flex;
  font-size: 18px;
  font-family: inherit;
  justify-content: flex-start;
  line-height: 1.5;
  width: 100%;
  padding: 8px 15px;
  position: relative;
  vertical-align: top;
}

.input[type='text'] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.input[readonly] {
  color: var(--gray-700);
}

.input[disabled] {
  background: var(--gray-200);
  cursor: not-allowed;
}

.has-error {
  border: 1px solid var(--red-500);
}

.has-border {
  border: 1px solid #e0e7ea;
  border-radius: 6px;
}

.is-narrow {
  width: auto;
}

.is-large {
  padding-bottom: 16px;
  padding-top: 16px;
}

.input::placeholder {
  color: var(--gray-600);
  font-style: italic;
}

.input[type='number'].transparent::-webkit-inner-spin-button,
.input[type='number'].transparent::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input[type='number'].transparent {
  background: transparent;
  -webkit-appearance: none;
  border: 0;
  outline: 0;
  padding: 0 5px;
  height: auto;
  text-align: right;
}
</style>
