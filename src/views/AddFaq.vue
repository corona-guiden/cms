<template>
  <div class="page-wrapper">
    <form class="faq-action-bar" @submit.prevent="create">
      <h1>Create new FAQ</h1>

      <BaseField label="Status">
        <BaseSelect
          :transparent="false"
          :expanded="true"
          :border="true"
          v-model="faq.status"
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </BaseSelect>
      </BaseField>

      <BaseField label="Question">
        <BaseInput
          placeholder=""
          tts
          v-model="faq.question"
        />
      </BaseField>

      <h4>Alternate question formulations</h4>

      <BaseField
        v-for="(item, index) in faq.formulations"
        :key="item.id || index"
        style="display: flex;"
      >
        <BaseInput
          v-model="item.formulation"
          :ref="`formulation-${index}`"
          :placeholder="'Formulation ' + (index + 1)"
        />

        <BaseButton
          type="danger"
          @click.prevent="
            faq.formulations.splice(
              faq.formulations.indexOf(item),
              1
            )
          "
        >
          x
        </BaseButton>
      </BaseField>

      <BaseField>
        <BaseButton @click.prevent="addFormulation">
          Add formulation
        </BaseButton>
      </BaseField>

      <BaseField label="Answer">
        <BaseTextarea
          placeholder=""
          :rows="4"
          v-model="faq.answer"
          tts
        />
      </BaseField>

      <BaseField>
        <BaseButton expanded type="primary" :disabled="faqCreationPending">
          Create FAQ
        </BaseButton>
      </BaseField>
    </form>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import { cloneDeep } from 'lodash'
import BaseButton from '../components/Core/Button.vue'
import BaseSelect from '../components/Core/Select.vue'
import BaseField from '../components/Core/Field.vue'
import BaseTextarea from '../components/Core/Textarea.vue'
import BaseInput from '../components/Core/Input.vue'

export default {
  components: { BaseInput, BaseTextarea, BaseField, BaseSelect, BaseButton },
  data() {
    return {
      faq: null
    }
  },
  computed: mapState('faqs', ['faqToCreate', 'faqCreationPending']),
  created() {
    this.faq = cloneDeep(this.faqToCreate)
  },
  methods: {
    ...mapMutations('faqs', ['setFaqToCreate']),
    ...mapActions('faqs', ['triggerAddFaqAction']),
    async create() {
      this.faq.createdAt = Math.round(Date.now() / 1000)
      await this.triggerAddFaqAction(this.faq)

      await this.$router.push({ name: 'faqs' })
    },
    addFormulation() {
      if (typeof this.faq.formulations === 'undefined') {
        this.$set(this.faq, 'formulations', [])
      }

      const formulationIndex = this.faq.formulations.push({
        formulation: this.faq.question
      })

      this.$nextTick(() => {
        const $refElement = this.$refs[`formulation-${formulationIndex - 1}`][0]
        if (!$refElement) return
        const formulation = $refElement.$el
        formulation.focus()
        formulation.select()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.faq-action-bar {
  .faq-name-input {
    height: 42px;
    padding: 11px 15px;
    width: 150px;
    outline: none;
    font: inherit;
    border: 1px solid;
    border-color: #2c3e50;
    border-radius: 3px;
    width: 100%;
    display: block;
  }

  .create-faq-btn {
    cursor: pointer;
    padding: 11px 20px;
    border: 1px solid;
    display: inline-block;
    border-radius: 5px;
    background: $vue-color;
    color: #fff;
    font-weight: 600;
    width: 100%;
    text-align: center;

    &.disabled {
      pointer-events: none;
      background-color: #aaa;
    }

    &:hover {
      color: #fff;
      background-color: lighten($vue-color, 5%);
    }
  }
}
</style>
