<template>
  <div id="BooleanPrimaryContent" class="w-full">
    <div class="flex flex-row items-center cursor-pointer">
      <label class="mr-3 font-bold">{{ $t("forms.primaryContent") }}</label>
      <input
        :checked="primary_content"
        type="checkbox"
        value=""
        class="
            h-15px
            w-15px
            border border-FieldGray
            rounded-sm
            focus:outline-none
          "
        @change="toggleSwitch"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: "BooleanPrimaryContent",
  props: ["options", "optionsData", "field", "customFormData", "sectionsUserId", "reference", "selectedLang", "locales"],
  data() {
    return {
      configurableReference: null,
      primary_content: false
    }
  },
  watch: {
    reference(value) {
      this.configurableReference = value
      // eslint-disable-next-line no-prototype-builtins
      if (this.configurableReference.optionsData.hasOwnProperty('primary_content')) {
        this.primary_content = this.configurableReference.optionsData.primary_content
      } else {
        this.configurableReference.optionsData.primary_content = false
        this.configurableReference.options[0].primary_content = false
      }
    }
  },
  methods: {
    toggleSwitch() {
      this.primary_content = !this.primary_content
      this.configurableReference.optionsData.primary_content = this.primary_content
      this.configurableReference.options[0].primary_content = this.primary_content
    },
    // optionsValidated(parent) {
    //   parent.options[0].primary_content = parent.options[0].primary_content === 'true';
    //   console.log(parent)
    // }
  }
}

</script>
