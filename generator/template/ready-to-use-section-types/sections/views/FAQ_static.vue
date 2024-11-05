<template>
  <div v-if="settings" class="nft-wrapper bg-dark-blue">
    <div class="section-4 QASec">
      <div class="title">{{ settings[lang].title }}</div>
      <div id="faq">
        <div v-for="(qa, index) in settings.QAs" :key="`qa-${index}`" class="question" :class="[`question-${sectionWeight}`, answerShowing[index] === true ? 'expanded' : 'collapsed']">
          <div class="flex flex-row justify-between" :class="`question-title-${index}-${sectionWeight}`" @click="toggleAnswer(index)">
            <div class="question-title">{{ qa[lang].question }}</div>
            <img :src="answerShowing[index] === true ? require('@/assets/icons/arrowUp.svg') : require('@/assets/icons/arrowDown.svg')" alt="arrow" class="w-6" loading="lazy" />
          </div>
          <div v-if="answerShowing[index] === true" class="answer" :class="[index === 0 ? 'show' : '', `answer-${index}-${sectionWeight}`]">
            <div class="flex w-full justify-start">
              <div class="ql-editor ql-snow tracking-tight w-fit md:mx-0" style="padding: 0 !important;" v-html="qa[lang].answer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FAQStatic",
  data() {
    return {
      answerShowing: []
    }
  },
  props: {
    section: {
      type: Object,
      default: () => {},
    },
    lang: {
      type: String,
      default: "en"
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
  methods: {
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
        this.$set(this.answerShowing, index, false)
      } else this.$set(this.answerShowing, index, true)
    }
  },
  mounted() {
    this.initQAs()
  }
}
</script>

<style>
.QASec {
  min-height: auto !important;
  font-family: 'Raleway', sans-serif;
}
.section-4 .title {
  font-family: 'Courier New', Courier, monospace;
  font-size: 35px;
  font-weight: 400;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #12adca;
}
.section-4 {
  padding-bottom: 20px;
  min-height: 100vh;
  background: #00131f;
}
.section-4 #faq {
  width: 90%;
  margin: 0 auto;
}
.section-4 #faq hr {
  border-color: #00131f;
  border-top-width: 2px;
  box-shadow: 3px 4px 3px 3px rgb(0 0 0 / 15%);
}
.section-4 #faq a {
  color: white;
  text-decoration: underline;
}
.section-4 #faq a:hover {
  cursor: pointer;
}
.section-4 #faq .question {
  color: white;
  margin-bottom: 20px;
  border-radius: 0;
  padding: 20px;
  box-shadow: 3px 4px 3px 3px rgb(0 0 0 / 15%);
}
.section-4 #faq .question.collapsed {
  border: 2px solid #61035B;
}
.section-4 #faq .question.expanded {
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%2303B1C7' stroke-width='5' stroke-dasharray='14%2c 15' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
}
.section-4 #faq .question:hover {
  color: white;
  cursor: pointer;
}
.section-4 #faq .question .question-title {
  font-size: 20px;
}
.section-4 #faq .question .answer {
  font-size: 14px;
}
.section-4 #faq .question .answer {
  &.show {
    display: block;
  }
  b {
    color: #12adca;
  }
}
@media only screen and (min-width: 1024px) {
  .section-4 .title {
    font-size: 35px;
    height: 100px;
  }
  .section-4 #faq .question .question-title {
    font-size: 2rem;
  }
  .section-4 #faq .question .answer {
    font-size: 20px;
  }
}
</style>
