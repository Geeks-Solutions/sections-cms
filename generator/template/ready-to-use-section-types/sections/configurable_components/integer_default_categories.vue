<template>
  <div class="w-full">
    <label class="mr-4 font-bold">{{ $t("forms.defaultCategories")+'*' }}</label>
    <div v-if="optionValues.option_values">
      <div class="selectMultipleOptions">
        <div v-for="option in optionValues.option_values" :key="option.id" class="multiple-options-wrapper">
          <div class="single-multiple-option" :class="isSelected(option.title, field.name) ? 'multiple-options-selected' : ''" @click="selectOption(option.title, field.name)">{{ option.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "StringBaseUrl",
  props: ["options", "optionsData", "field", "customFormData", "sectionsUserId", "reference", "selectedLang", "locales", "optionValues"],
  data() {
    return {
      configurableReference: null,
      inputStyle: 'py-4 pl-6 border titleBorder rounded-xl h-48px w-full focus:outline-none',
      base_url: ""
    }
  },
  watch: {
    reference(value) {
      this.configurableReference = value
      // if (this.configurableReference.optionsData.base_url) {
      //   this.base_url = this.configurableReference.optionsData.base_url
      // }
    }
  },
  methods: {
    isSelected(title, name) {
      return this.configurableReference.optionsData[name] !== undefined && this.configurableReference.optionsData[name] !== null && this.configurableReference.optionsData[name].includes(title);
    },
    selectOption(value, name) {
      if (Array.isArray(this.configurableReference.optionsData[name]) && !this.configurableReference.optionsData[name].includes(value)) {
        this.configurableReference.optionsData[name].push(value);
      } else if (Array.isArray(this.configurableReference.optionsData[name]) && this.configurableReference.optionsData[name].includes(value)) {
        this.configurableReference.optionsData[name].splice(this.configurableReference.optionsData[name].indexOf(value), 1);
      } else {
        this.$set(this.configurableReference.optionsData, name, [value]);
      }
      this.configurableReference.options[0][name] = this.configurableReference.optionsData[name]
    }
  }
}

</script>

<style>
.selectMultipleOptions {
  border-radius: 0.75rem;
  border-width: 1px;
  border-radius: 0.75rem;
  overflow-y: scroll;
  align-items: flex-start;
  flex-direction: column;
  max-width: 32rem;
  height: 250px;
  display: flex;
  margin-top: 0.5rem;
}

.single-multiple-option {
  padding-left: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  width: 100%;
}

.multiple-options-wrapper {
  width: 100%;
}

.multiple-options-selected {
  background: #C2C2C2;
}
</style>
