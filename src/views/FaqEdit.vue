<template>
  <div class="faq-edit container">
    <form v-if="currentFaq" class="faq-action-bar" @submit.prevent="update">
      <h1>Edit FAQ</h1>

      <BaseField label="Status">
        <BaseSelect
          v-model="currentFaq.status"
          :transparent="false"
          :expanded="true"
          :border="true"
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </BaseSelect>
      </BaseField>

      <BaseField label="Question">
        <BaseInput v-model="currentFaq.question" placeholder="" :tts="true" />
      </BaseField>

      <h4>Alternate question formulations</h4>

      <BaseField
        v-for="(item, index) in currentFaq.formulations || []"
        :key="item.id || index"
        style="display: flex;"
      >
        <BaseInput
          :ref="`formulation-${index}`"
          v-model="item.formulation"
          :placeholder="'Formulation ' + (index + 1)"
        />

        <BaseButton
          type="danger"
          @click.prevent="
            currentFaq.formulations.splice(
              currentFaq.formulations.indexOf(item),
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
          v-model="currentFaq.answer"
          placeholder=""
          :rows="4"
          :tts="true"
        />
      </BaseField>

      <BaseField>
        <BaseButton
          expanded
          type="primary"
          :is-loading="isFaqUpdating(currentFaq.id)"
        >
          Save
        </BaseButton>
      </BaseField>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseSelect from '@/components/Core/Select.vue'
import BaseField from '@/components/Core/Field.vue'
import BaseInput from '@/components/Core/Input.vue'
import BaseButton from '@/components/Core/Button.vue'
import BaseTextarea from '@/components/Core/Textarea.vue'
import { cloneDeep } from 'lodash'

export default {
  components: {
    BaseTextarea,
    BaseButton,
    BaseInput,
    BaseField,
    BaseSelect
  },

  data() {
    return {
      currentFaq: null
    }
  },

  computed: {
    ...mapGetters('faqs', ['getFaqById', 'isFaqUpdating']),
    storedFaq() {
      return this.getFaqById(this.$route.params.id)
    }
  },

  watch: {
    storedFaq(val) {
      this.currentFaq = cloneDeep(val)
    }
  },

  created() {
    this.currentFaq = cloneDeep(this.getFaqById(this.$route.params.id))
  },

  methods: {
    ...mapActions('faqs', ['updateFaq']),
    async update() {
      await this.updateFaq(this.currentFaq)

      this.$router.push({ name: 'faqs' })
    },
    addFormulation() {
      if (typeof this.currentFaq.formulations === 'undefined') {
        this.$set(this.currentFaq, 'formulations', [])
      }

      const formulationIndex = this.currentFaq.formulations.push({
        formulation: this.currentFaq.question
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

.faq-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
