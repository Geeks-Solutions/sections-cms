<template>
  <div v-if="isGlobalEvent(finalLink) || isAnchorOrExternalLink(finalLink)" class="md:cursor-pointer" @click="emitGlobalEvent(finalLink, formLinkTarget)">
    <slot/>
  </div>
  <nuxt-link v-else :to="localePath(finalLink)+inlineParams" :target="formLinkTarget ? formLinkTarget : linkTarget(finalLink)">
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
      default: "en"
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
