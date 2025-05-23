<template>
  <div v-if="settings" class="zaq-widget">
    <client-only>
      <zaq-widget
        :website-id="settings[0].websiteId"
        :hide-badge="settings[0].hideBadge.toString()"
        :lang="$i18n.locale"
        :server-url="$route.query.zaq_api ? `https://${$route.query.zaq_api}` : ''"
        :websocket-url="$route.query.zaq_api ? `wss://${$route.query.zaq_api}/socket` : ''"
        :load-sequence="settings[0].sequence && settings[0].sequence.url ? settings[0].sequence.url : ''"
        :css="settings[0].css && settings[0].css.url ? settings[0].css.url : ''"
        :icons='JSON.stringify({
          sendBtn: settings[0].sendBtnMedia && settings[0].sendBtnMedia.url ? settings[0].sendBtnMedia.url : "",
          typingIcon: settings[0].typingIconMedia && settings[0].typingIconMedia.url ? settings[0].typingIconMedia.url : ""
        })'
        :session-suffix="settings[0].websiteId"
      ></zaq-widget>
    </client-only>
  </div>
</template>

<script>

export default {
  name: 'ZAQWidgetStatic',
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
      scriptElement: null,
      widgetEventHandler: null,
      sequenceRun: ''
    }
  },
  computed: {
    settings() {
      return this.section.settings
    }
  },
  watch: {
    "section.settings": {
      handler(v) {
        if (v && v[0] && v[0].websiteId) {
          this.initializeWidget()
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    if (this.settings && this.settings[0].websiteId) {
      this.initializeWidget()
    }
  },
  beforeUnmount() {
    if (window.zaq) {
      window.zaq.$emit("clearConversations")
      window.zaq.$emit("clearWidgetState")
      window.zaq.removeEventListners()
      window.zaq.disconnect()
    }
    window.zaq = null
    // Remove the script when the component is destroyed
    if (this.scriptElement) {
      document.head.removeChild(this.scriptElement);
    }
    if (this.widgetEventHandler) {
      window.removeEventListener('zaqWidget', this.widgetEventHandler, false)
      this.widgetEventHandler = null
    }
  },
  methods: {
    initializeWidget() {
      if (process.browser) {
        let bucketName = `zaq-ai`
        if (this.$route.query.zaq_dev === 'true') {
          bucketName = `zaq-ai-dev`
        }

        const scriptSrc = `https://${bucketName}.s3.eu-west-2.amazonaws.com/widget/zaq-widget-vue.min.js`;
        if (!document.querySelector(`head script[src="${scriptSrc}"]`)) {
          const recaptchaScript = document.createElement('script')
          this.scriptElement = recaptchaScript
          recaptchaScript.setAttribute(
            'src',
            scriptSrc
          )

          document.head.appendChild(recaptchaScript)
        }

        if (this.$route.query.runSequence || (this.settings && this.settings[0] && this.settings[0].autoStart && this.settings[0].autoStart !== 'None')) {
          if (this.settings && this.settings[0] && this.settings[0].autoStart && this.settings[0].autoStart !== 'None') {
            this.sequenceRun = this.settings[0].autoStart
          }
          if (this.$route.query.runSequence) {
            this.sequenceRun = this.$route.query.runSequence
          }
          this.widgetEventHandler = (e) => {
            window.zaq.$emit('changeLang', `${this.lang}`)
            if (e.detail.sequenceDone) {
              window.zaq.$emit('initSequence', this.sequenceRun)
              window.zaq.$emit('showPromo', true)
            }
          }
          window.addEventListener('zaqWidget', this.widgetEventHandler, false)
        }

      }
    }
  }
};
</script>
