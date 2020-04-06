<template>
  <div class="faq-edit container">
    <form v-if="currentFaq" class="faq-action-bar" @submit.prevent="updateFaq(currentFaq)">
      <h1>Edit FAQ</h1>

      <BaseField label="Status">
        <BaseSelect
          :transparent="false"
          :expanded="true"
          :border="true"
          v-model="currentFaq.status"
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </BaseSelect>
      </BaseField>

      <BaseField label="Question">
        <BaseInput placeholder="" v-model="currentFaq.question" />
      </BaseField>

      <h4>Alternate question formulations</h4>

      <BaseField
        v-for="(item, index) in currentFaq.formulations || []"
        :key="item.id || index"
        style="display: flex;"
      >
        <BaseInput
          v-model="item.formulation"
          :placeholder="'Formulation ' + (index + 1)"
        />

        <BaseButton
          type="danger"
          @click="currentFaq.formulations.splice(currentFaq.formulations.indexOf(item), 1)"
        >
          x
        </BaseButton>
      </BaseField>

      <BaseField>
        <BaseButton @click="addFormulation">
          Add formulation
        </BaseButton>
      </BaseField>

      <BaseField label="Answer">
        <BaseTextarea
          v-autoheight
          placeholder=""
          :rows="4"
          v-model="currentFaq.answer"
        />
      </BaseField>

      <BaseField>
        <BaseButton expanded type="primary">
          Save
        </BaseButton>
      </BaseField>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseSelect from "@/components/Core/Select.vue";
import BaseField from "@/components/Core/Field.vue";
import BaseInput from "@/components/Core/Input.vue";
import BaseButton from "@/components/Core/Button.vue";
import BaseTextarea from "@/components/Core/Textarea.vue";
import { cloneDeep } from "lodash";

export default {
  components: { BaseTextarea, BaseButton, BaseInput, BaseField, BaseSelect },

  data() {
    return {
      currentFaq: null
    }
  },

  created() {
    this.currentFaq = cloneDeep(this.getFaqById(this.$route.params.id))
  },

  watch: {
    storedFaq(val) {
      this.currentFaq = cloneDeep(val)
    }
  },

  computed: {
    ...mapGetters('faqs', ['getFaqById']),
    storedFaq() {
      return this.getFaqById(this.$route.params.id)
    }
  },

  methods: {
    ...mapActions('faqs', ['updateFaq']),
    addFormulation() {
      if (typeof this.currentFaq.formulations === 'undefined') {
        this.$set(this.currentFaq, 'formulations', [])
      }

      this.currentFaq.formulations.push({ question: '' })
    }
  },
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
