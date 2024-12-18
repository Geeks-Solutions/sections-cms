<template>
  <div class="QAWr">

    <div class="flex flex-col items-start justify-start mt-8">
      <div class="flex">
        <label class="mr-4 font-bold">{{ $t("Title") }}</label>
      </div>
      <input
        v-model="settings[0][siteLang].title"
        type="text"
        value=""
        :placeholder="$t('Title')"
        :class="['py-4 pl-6 border rounded-xl h-48px w-344px focus:outline-none', errors.title ? 'border-error' : 'border-FieldGray']"
      />
    </div>

    <div class="flex flex-col mt-4">

      <div v-for="(object, idx) in settings[0].QAs" :key="`qa-${idx}`" class="flex flex-col">

        <fieldset class="fieldSetStyle border border-solid border-gray-300 p-3 mt-2">
          <legend class="w-auto px-16">{{ $t("QA") }} #{{ idx + 1 }}:</legend>


          <div class="flex flex-row w-full justify-between">
            <div class="flex flex-col w-full items-start justify-start">
              <div class="flex flex-row w-full justify-between">
                <label class="mr-4 font-medium">{{ $t("Question") }}</label>
                <div class="pr-3 pb-2" @click="removeQA(idx)">
                  <Cross alt="" class="cursor-pointer pl-2"/>
                </div>
              </div>
              <input
                v-model="object[siteLang].question"
                type="text"
                value=""
                :placeholder="$t('Question')"
                class="
            py-4
            pl-6
            border border-FieldGray
            rounded-xl
            h-48px
            w-full
            focus:outline-none
          "
              />
            </div>

          </div>

          <div class="flex flex-col items-start justify-start mt-8">
            <label class="mr-4 font-medium">{{ $t("Answer") }}</label>
            <wysiwyg :quill-key="`object-${idx}`" :html="object[siteLang].answer" @settingsUpdate="(content) => updateQAAnswer(content, idx)"/>
          </div>

        </fieldset>

      </div>

      <div
        class="add-button underline cursor-pointer mt-2"
        :class="{ disabled: settings[0].QAs.length === 4 }"
        @click="addQA()"
      >
        <div class="p3 bold text">{{ $t("ADD NEW Container") }}</div>
      </div>


    </div>

  </div>
</template>

<script>
import wysiwyg from "@geeks.solutions/nuxt-sections/lib/src/components/Editor/wysiwyg.vue";
import Cross from "@/components/icons/cross";

export default {
  name: "FAQ",
  components: {
    Cross, wysiwyg
  },
  props: {
    selectedLang: {
      type: String,
      default: 'en'
    },
    locales: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      settings: [
        {
          en: {
            title: ''
          },
          fr: {
            title: ''
          },
          QAs: [],
        }
      ],
      errors: {
        title: false,
        text: false,
        buttonText: false
      },
      siteLang: 'en'
    }
  },
  watch: {
    selectedLang: {
      handler(val) {
        this.siteLang = val
      },
      deep: true,
      immediate: true
    },
    settings(val) {
      if (Array.isArray(val) === false ) {
        this.settings = [val]
      }
    }
  },
  methods: {
    updateQAAnswer(content, idx) {
      this.settings[0].QAs[idx][this.siteLang].answer = content
    },
    addQA() {
      this.settings[0].QAs.push({
        en: {
          question: '',
          answer: ''
        },
        fr: {
          question: '',
          answer: ''
        }
      })
    },
    removeQA(idx) {
      this.settings[0].QAs = this.settings[0].QAs.filter((img, i) => idx !== i)
    },
    validate() {
      let valid = true;
      this.errors.title = false;
      if (!this.settings[0].en.title) {
        this.errors.title = true;
        valid = false;
      }
      if (!valid) {
        this.$root.$emit("toast", {
          type: "Error",
          message: this.$t("fill-required-fields")
        });
      }
      return valid;
    }
  }
}
</script>
