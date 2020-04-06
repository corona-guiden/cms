<template>
  <button
    class="button"
    :class="buttonClasses"
    v-bind="$attrs"
    v-on="listeners"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    rounded: Boolean,
    expanded: Boolean,
    isLoading: Boolean,
    small: Boolean
  },
  computed: {
    listeners(event) {
      return {
        ...this.$listeners,
        input: () => {
          this.$emit('input', event.target.value)
        }
      }
    },
    buttonClasses() {
      return {
        [`is-${this.type}`]: !!this.type,
        [`is-${this.size}`]: !!this.size,
        'is-fullwidth': this.expanded,
        'is-rounded': this.rounded,
        'is-loading': this.isLoading,
        'is-small': this.small
      }
    }
  }
}
</script>

<style scoped>
.button {
  border: 1px solid transparent;
  border-radius: 4px;
  color: var(--blue-500);
  cursor: pointer;
  box-shadow: none;
  display: inline-block;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  font-family: inherit;
  position: relative;
  vertical-align: top;
  text-align: center;
  outline: 0;
  justify-content: center;
  padding: 8px 15px;
  white-space: nowrap;
  text-decoration: none;
}

.button:hover {
  opacity: 0.85;
}

.button:active {
  opacity: 0.95;
}

.button.is-primary {
  background-color: var(--blue-500);
  border-color: transparent;
  color: #fff;
}

.button.is-primary:hover {
  background-color: var(--blue-500);
}

.button.is-primary.is-outlined {
  background-color: transparent;
  border-color: var(--blue-500);
  color: var(--blue-500);
}

.button.is-danger {
  background-color: var(--red-500);
  border-color: transparent;
  color: #fff;
}
.button.is-danger:hover {
  background-color: var(--red-500);
}

.button.is-danger.is-outlined {
  background-color: transparent;
  border-color: var(--red-500);
  color: var(--red-500);
}

.is-fullwidth {
  width: 100%;
}

.button[disabled='disabled'] {
  opacity: 0.5;
  cursor: not-allowed;
}

.button.is-rounded {
  border-width: 2px;
}

.button.is-small {
  border-radius: 3px;
  font-size: 0.85rem;
  font-weight: 600;
}

.button.is-large {
  padding-bottom: 15px;
  padding-top: 15px;
  font-size: 18px;
}

.button.is-loading {
  color: transparent !important;
  pointer-events: none;
}

.button.is-loading:after {
  left: calc(50% - 0.5em);
  top: calc(50% - 0.5em);
  animation: spinAround 0.5s infinite linear;
  border: 2px solid var(--blue-500);
  border-radius: 290486px;
  border-right-color: transparent;
  border-top-color: transparent;
  content: '';
  display: block;
  height: 1em;
  position: absolute;
  width: 1em;
}

.button.is-primary.is-loading:after {
  border-color: transparent transparent #fff #fff !important;
}

@keyframes spinAround {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
