<template>
  <a v-if="isGlobalEvent(finalLink) || isAnchorOrExternalLink(finalLink)" :href="finalLink" :target="formLinkTarget ? formLinkTarget : linkTarget(finalLink)" class="md:cursor-pointer global-link" @click="(event) => emitGlobalEvent(finalLink, formLinkTarget, event)">
    <slot/>
  </a>
  <nuxt-link v-else :to="localePath(finalLink)+inlineParams" :target="formLinkTarget ? formLinkTarget : linkTarget(finalLink)" class="global-link">
    <slot/>
  </nuxt-link>
</template>

<script>
import {emitGlobalEvent, fallBackLink, isAnchorOrExternalLink, isGlobalEvent, linkTarget} from "@/utils/constants";

export default {
  name: 'GlobalLink',
  props: {
    link: {
      type: Object,
      default() {
        return {}
      }
    },
    inlineParams: {
      type: String,
      default: ""
    },
    lang: {
      type: String,
      default: "en"
    },
    formLinkTarget: {
      type: String,
      default: ""
    }
  },
  computed: {
    finalLink() {
      return fallBackLink(this.link, this.lang)
    }
  },
  methods: {
    isAnchorOrExternalLink,
    emitGlobalEvent,
    isGlobalEvent,
    linkTarget
  }
}
</script>
