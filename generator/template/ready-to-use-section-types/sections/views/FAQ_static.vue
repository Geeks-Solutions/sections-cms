<template>
  <div v-if="settings" class="faq">
    <div class="faq-row-wrapper" :class="settings.imagePosition === 'right' ? 'image-right' : 'image-left'">
      <div class="section-wrapper QASec">
        <h2 class="title">{{ settings[lang].title }}</h2>
        <div id="faq">
          <div v-for="(qa, index) in settings.QAs" :key="`qa-${index}`" class="question" :class="[`question-${sectionWeight}`, answerShowing[index] === true ? 'expanded' : 'collapsed']">
            <div class="flex flex-row justify-between" :class="`question-title-${index}-${sectionWeight}`" @click="toggleAnswer(index)">
              <h3 class="question-title">{{ qa[lang].question }}</h3>
              <img :src="answerShowing[index] === true ? importAsset('/assets/icons/arrowUp.svg') : importAsset('/assets/icons/arrowDown.svg')" alt="arrow" class="arrow w-6" loading="lazy" />
            </div>
            <div v-if="answerShowing[index] === true" class="answer" :class="[index === 0 ? 'show' : '', `answer-${index}-${sectionWeight}`]">
              <div class="flex w-full justify-start">
                <gWysiwygContent tag="p" :wrapper-classes="qa.classes" :classes="`tracking-tight w-fit md:mx-0`" style="padding: 0 !important;" :html-content="qa[lang].answer" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="settings.imagePosition !== 'none'" class="w-full md:w-auto gap-4 imageWrapper">
        <div :class="'flex h-[240px] md:h-[360px] md:row-span-2 md:mt-6'">
          <NuxtImg
            v-if="settings.media && settings.media.url"
            :src="settings.media.url"
            :alt="settings.media.seo_tag ? settings.media.seo_tag : ''"
            class="w-full"
            :class="'h-full object-contain'"
            width="300"
           height="300"
           :placeholder="[300, 300, 75, 5]"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { importAsset } from '~/utils/constants.js'

export default {
  name: "FAQStatic",
  props: {
    section: {
      type: Object,
      default: () => {},
    },
    lang: {
      type: String,
      default: "en"
    },
	viewStructure: {
	  settings: [
		{
		  en: {
			title: 'string'
		  },
		  fr: {
			title: 'string'
		  },
		  QAs: [
			{
			  en: {
				question: 'text',
				answer: 'text'
			  },
			  fr: {
				question: 'text',
				answer: 'text'
			  }
			},
			{
			  en: {
				question: 'text',
				answer: 'text'
			  },
			  fr: {
				question: 'text',
				answer: 'text'
			  }
			},
			{
			  en: {
				question: 'text',
				answer: 'text'
			  },
			  fr: {
				question: 'text',
				answer: 'text'
			  }
			},
			{
			  en: {
				question: 'text',
				answer: 'text'
			  },
			  fr: {
				question: 'text',
				answer: 'text'
			  }
			}
		  ],
		}
	  ]
	}
  },
  data() {
    return {
      answerShowing: []
    }
  },
  computed: {
    sectionWeight() {
      return this.section.weight
    },
    settings() {
      if (Array.isArray(this.section.settings) === false) {
        return this.section.settings;
      } else {
        return this.section.settings[0];
      }
    },
  },
  watch: {
    "section.settings"() {
      this.initQAs()
    }
  },
  mounted() {
    this.initQAs()
  },
  methods: {
    importAsset,
    initQAs() {
      let questions = []
      this.answerShowing = []
      questions = document.querySelectorAll(`.question-${this.sectionWeight}`)
      questions.forEach((question, index) => {
        if (index === 0) {
          this.answerShowing.push(true)
        } else this.answerShowing.push(false)
      })
    },
    toggleAnswer(index) {
      if (this.answerShowing[index]) {
        this.answerShowing[index] = false
      } else this.answerShowing[index] = true
    }
  }
}
</script>

<style>
.QASec {
  min-height: auto !important;
}
.section-wrapper .title {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.faq .section-wrapper {
  padding-bottom: 20px;
  min-height: 100vh;
  width: 100%;
}
.section-wrapper #faq {
  width: 90%;
  margin: 0 auto;
}
.section-wrapper #faq a {
  text-decoration: underline;
}
.section-wrapper #faq a:hover {
  cursor: pointer;
}
.section-wrapper #faq .question {
  margin-bottom: 20px;
  border-radius: 0;
  padding: 20px;
}
.section-wrapper #faq .question:hover {
  cursor: pointer;
}
.section-wrapper #faq .arrow {
  filter: invert(1);
}

.section-wrapper #faq .question .answer {
  &.show {
    display: block;
  }
}
@media only screen and (min-width: 1024px) {
  .section-wrapper .title {
    height: 100px;
  }
}
.faq-row-wrapper {
  display: flex;
  width: 100%;
  padding: 0.625rem 0;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}
.faq-row-wrapper.image-right {
  flex-direction: column
}
.faq-row-wrapper.image-left {
  flex-direction: column-reverse
}
@media (min-width: 768px) {
  .faq-row-wrapper {
    padding: 0.625rem 0;
  }
  .faq-row-wrapper.image-right {
    flex-direction: row
  }
  .faq-row-wrapper.image-left {
    flex-direction: row-reverse
  }
}

section .faq {
  container: faq / inline-size;
}

@container faq (max-width: 768px) {
  .faq .faq-row-wrapper.image-right {
    flex-wrap: wrap !important;
  }
  .faq .faq-row-wrapper.image-left {
    flex-wrap: wrap-reverse !important;
  }
}
</style>
