<template>
  <div v-if="isGlobalEvent(finalLink) || isAnchorOrExternalLink(finalLink)" @click="emitGlobalEvent(finalLink)" class="md:cursor-pointer">
    <slot/>
  </div>
  <nuxt-link v-else :to="localePath(finalLink)+inlineParams" :target="linkTarget(finalLink)">
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
