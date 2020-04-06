<template>
  <div class="select-wrap">
    <span class="select" :style="widthStyle" :class="fieldClasses">
      <span v-if="label" class="label">
        {{ label }}
      </span>

      <select
        ref="select"
        v-model="computedValue"
        v-bind="$attrs"
        :style="widthStyle"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      >
        <template v-if="placeholder">
          <option :value="null" selected disabled hidden>
            {{ placeholder }}
          </option>
        </template>

        <slot></slot>
      </select>
    </span>

    <!-- This is needed to measure the selected options text length to adjust the real select's width -->
    <div class="dummy-wrap">
      <span ref="dummySelect" class="select dummy" :class="fieldClasses">
        <select>
          <option>{{ dummyText }}</option>
        </select>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseSelect',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array, Function],
      default: ''
    },
    placeholder: {
      type: [String, Number, Boolean],
      default: ''
    },
    label: {
      type: [String, Number, Boolean],
      default: ''
    },
    transparent: Boolean,
    expanded: Boolean,
    autoWidth: Boolean,
    small: Boolean,
    large: Boolean,
    border: Boolean,
    maxWidth: Number
  },
  data() {
    return {
      selected: this.value,
      width: false,
      dummyText: null
    }
  },

  computed: {
    widthStyle() {
      if (this.expanded || (this.transparent && this.label)) {
        return {}
      }

      return { width: `${this.width}px` }
    },
    computedValue: {
      get() {
        return this.selected
      },
      set(value) {
        this.selected = value
        this.calculateWidth()
        this.$emit('input', value)
      }
    },

    fieldClasses() {
      return {
        'is-small': this.small,
        'is-expanded': this.expanded,
        'is-large': this.large,
        'is-transparent': this.transparent,
        'has-border': this.border,
        level: this.label
      }
    }
  },

  watch: {
    value(value) {
      this.selected = value

      this.$nextTick(() => {
        this.calculateWidth()
      })
    }
  },

  mounted() {
    this.calculateWidth()
  },

  methods: {
    calculateWidth() {
      const { select } = this.$refs
      const selectedOption = select.options[select.selectedIndex]

      if (!selectedOption) return

      this.dummyText = selectedOption.text

      this.$nextTick(() => {
        this.width = this.calculateMaxWidth(this.$refs.dummySelect.offsetWidth)
      })
    },
    calculateMaxWidth(width) {
      if (!this.maxWidth) {
        return width
      }

      return width > this.maxWidth ? this.maxWidth : width
    }
  }
}
</script>

<style scoped>
.select {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.select select {
  appearance: none;
  background-color: white;
  color: var(--navy-700);
  cursor: pointer;
  display: block;
  text-transform: inherit;
  outline: none;

  align-items: center;
  border: 1px solid transparent;
  border-radius: var(--radius);
  box-shadow: none;
  font-size: 18px;
  font-family: inherit;
  font-weight: 400;
  justify-content: flex-start;
  line-height: 1.5;
  padding: 8px 30px 8px 15px;
  position: relative;
  vertical-align: top;
}

.select::after {
  right: 0.425em;
  z-index: 4;
  content: ' ';
  display: block;
  margin-top: -3px;
  position: absolute;
  top: 50%;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid var(--navy-700);
  border-radius: 2px;
  pointer-events: none;
}

.label {
  font-size: 18px;
}

.has-border .label {
  margin-right: 15px;
}

.select.is-expanded,
.select.is-expanded select {
  width: 100%;
}

.select.is-transparent select {
  background: transparent;
  padding: 0 15px 0 0;
  height: auto;
}

.select.is-transparent::after {
  right: 0;
}

.select.is-small select {
  font-size: 16px;
  padding-right: 23px;
}

.select.is-small .label {
  font-size: 16px;
}

.select.has-border select {
  border: 1px solid #e0e7ea;
  border-radius: 6px;
}

.select.is-large select {
  padding: 12px 36px 12px 18px;
}

.select.is-large::after {
  right: 0.825em;
}

.select.level {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.select select[disabled] {
  background: var(--gray-200);
  cursor: not-allowed;
}

.dummy-wrap {
  display: block;
  height: 0;
}

.dummy select {
  visibility: hidden !important;
  height: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  margin: 0 !important;
  border-bottom: 0 !important;
  border-top: 0 !important;
}

.dummy::after,
.dummy::before {
  opacity: 0;
  visibility: hidden;
}
</style>
