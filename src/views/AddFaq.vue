<template>
  <div class="page-wrapper">
    <form class="faq-action-bar" @submit.prevent="create">
      <h1>Create new FAQ</h1>

      <BaseField label="Status">
        <BaseSelect
          :transparent="false"
          :expanded="true"
          :border="true"
          :value="faqToCreate.status"
          required
          @input="setFaqToCreate({ status: $event.target.value })"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </BaseSelect>
      </BaseField>

      <BaseField label="Question">
        <BaseInput
          placeholder=""
          :value="faqToCreate.question"
          @input="setFaqToCreate({ question: $event })"
        />
      </BaseField>

      <h4>Alternate question formulations</h4>

      <BaseField
        v-for="(item, index) in faqToCreate.formulations"
        :key="item.id || index"
        style="display: flex;"
      >
        <BaseInput
          v-model="item.formulation"
          :placeholder="'Formulation ' + (index + 1)"
        />

        <BaseButton
          type="danger"
          @click.prevent="
            faqToCreate.formulations.splice(
              faqToCreate.formulations.indexOf(item),
              1
            )
          "
        >
          x
        </BaseButton>
      </BaseField>

      <BaseField>
        <BaseButton
          @click.prevent="faqToCreate.formulations.push({ question: '' })"
        >
          Add formulation
        </BaseButton>

        <BaseButton
          style="margin-left: 20px;"
          @click.prevent="faqToCreate.formulations.push({ question: faqToCreate.question })"
        >
          Add formulation from question
        </BaseButton>
      </BaseField>

      <BaseField label="Answer">
        <BaseTextarea
          v-autoheight
          placeholder=""
          :rows="4"
          :value="faqToCreate.answer"
          @input="setFaqToCreate({ answer: $event })"
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
import BaseButton from '../components/Core/Button.vue'
import BaseSelect from '../components/Core/Select.vue'
import BaseField from '../components/Core/Field.vue'
import BaseTextarea from '../components/Core/Textarea.vue'
import BaseInput from '../components/Core/Input.vue'

export default {
  components: { BaseInput, BaseTextarea, BaseField, BaseSelect, BaseButton },
  data() {
    return {
      questionFormulations: []
    }
  },
  computed: mapState('faqs', ['faqToCreate', 'faqCreationPending']),
  methods: {
    ...mapMutations('faqs', ['setFaqToCreate']),
    ...mapActions('faqs', ['triggerAddFaqAction']),
    async create() {
      await this.triggerAddFaqAction()

      // this.questionFormulations.forEach(formulation => {
      //   new FaqQuestionFormulationsDB().create({
      //     faqId: res.id,
      //     ...formulation
      //   })
      // })

      await this.$router.push({ name: 'faqs' })
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
