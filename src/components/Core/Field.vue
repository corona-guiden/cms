<template>
  <div :class="fieldClasses" class="field">
    <label v-if="label != null" class="label">{{ label || '&nbsp;' }}</label>

    <slot></slot>

    <div v-if="errors.length" class="error" v-text="errors[0]"></div>
  </div>
</template>
<script>
export default {
  name: 'BaseField',
  props: {
    label: {
      type: String,
      default: null
    },
    strike: Boolean,
    errors: {
      type: Array,
      default: () => []
    },
    inset: {
      type: Boolean,
      default: false
    },
    largeSpacing: Boolean
  },
  computed: {
    fieldClasses() {
      return {
        strike: this.strike && this.label,
        inset: this.inset,
        'no-label': !this.label,
        'large-spacing': this.largeSpacing
      }
    }
  },
  watch: {
    errors(val) {
      // Reach into the slot child and set the has-error data.
      if (this.$children.length && this.$children[0].$data.hasError) {
        this.$children[0].$data.hasError = !!val.length
      }
    }
  }
}
</script>

<style scoped>
.field:not(:last-child) {
  margin-bottom: 23px;
}

/* Field should only have one child, but if we have two, we'll put som margin on it. */
/*.field > :first-child:not(:last-child) {*/
/*  margin-bottom: 6px;*/
/*}*/

/*.field.no-label:last-child {*/
/*  margin-top: 1.8rem;*/
/*}*/

.field.large-spacing > .label {
  margin-bottom: 25px;
}

.field.large-spacing:not(:first-child) {
  margin-top: 39px;
}

.label {
  display: flex;
  align-items: center;
  position: relative;
  color: var(--navy-700);
  font-weight: 500;
  font-size: 16px;
  white-space: nowrap;
  line-height: 1;
  margin-bottom: 5px;
}

.strike > .label {
  font-weight: bold;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  /*margin-bottom: 16px;*/
}

.inset > .label {
  margin-left: -1rem;
}

.strike > .label {
  color: var(--blue-gray-600);
}

.strike > .label:after {
  content: '';
  z-index: 0;
  height: 1px;
  flex: 1;
  background: var(--blue-gray-500);
  opacity: 0.5;
  transform: translateY(-50%);
  margin-left: var(--navigation-spacing);
  margin-right: calc(var(--navigation-spacing) * -1);
}

.error {
  margin-top: 5px;
  color: var(--red-600);
  font-size: 12px;
  line-height: 17px;
}
</style>
