<template>
  <div v-if="settings" class="faq">
	<div class="section-wrapper QASec">
	  <h2 class="title">{{ settings[lang].title }}</h2>
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
</style>
