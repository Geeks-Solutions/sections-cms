<template>
  <div class="social-media-links mb-6 flex justify-center gap-3">
    <!-- Social Media Links -->
    <template
      v-if="filteredLinks.length > 0 || (showWhatsApp && whatsappNumber)"
    >
      <a
        v-for="link in filteredLinks"
        :key="link.type"
        :href="link.url"
        target="_blank"
        rel="noopener"
        class="social-link rounded-full p-2 transition-colors duration-200"
        :class="[`social-link-${link.type}`]"
      >
        <component :is="getSocialIcon(link.type)" />
      </a>
    </template>

    <!-- Fixed WhatsApp button if enabled (hide when branches are enabled) -->
    <a
      v-if="showWhatsApp && whatsappNumber"
      :href="whatsappUrl"
      target="_blank"
      rel="noopener"
      class="whatsapp-button fixed bottom-4 right-4 z-40 rounded-full p-3 shadow-lg transition-colors duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path
          d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"
        />
      </svg>
    </a>
  </div>
</template>

<script setup>
import { computed, watch, h } from 'vue'
import { generateWhatsAppMessage } from '@/utils/constants'

const props = defineProps({
  links: {
    type: Array,
    default: () => [],
  },
  showWhatsApp: {
    type: Boolean,
    default: false,
  },
  whatsappNumber: {
    type: String,
    default: '',
  },
  whatsappMessage: {
    type: String,
    default: '',
  },
  cart: {
    type: Array,
    default: () => [],
  },
  lang: {
    type: String,
    default: 'en',
  },
  type: {
    type: String,
    default: 'restaurant', // 'restaurant' or 'service'
    validator: (value) => ['restaurant', 'service'].includes(value),
  },
  i18n: {
    type: Function,
    required: true,
  },
  enableBranches: {
    type: Boolean,
    default: false,
  },
})

// Computed properties
const filteredLinks = computed(() => {
  return (props.links || []).filter(
    (link) =>
      link &&
      link.url &&
      typeof link.url === 'string' &&
      link.url.trim() !== '',
  )
})

const whatsappUrl = computed(() => {
  if (!props.whatsappNumber) return '#'

  const phoneNumber = props.whatsappNumber.replace(/[^0-9+]/g, '')

  let message = ''

  // If branches are enabled, only send default message (no cart items)
  if (props.enableBranches) {
    message =
      props.whatsappMessage ||
      (props.type === 'service'
        ? props.i18n('whatsapp.defaultServiceMessage') ||
          'Hello! I would like to book a service.'
        : props.i18n('whatsapp.defaultOrderMessage') ||
          'Hello! I would like to place an order.')
  } else {
    // If branches disabled, send full cart message
    message = generateWhatsAppMessage(
      props.cart,
      props.type,
      props.lang,
      props.i18n,
    )
  }

  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
})

// Methods
const getSocialIcon = (type) => {
  switch (type) {
    case 'instagram':
      return () =>
        h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '24',
            height: '24',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          [
            h('rect', {
              x: '2',
              y: '2',
              width: '20',
              height: '20',
              rx: '5',
              ry: '5',
            }),
            h('path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' }),
            h('line', { x1: '17.5', y1: '6.5', x2: '17.51', y2: '6.5' }),
          ],
        )

    case 'facebook':
      return () =>
        h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '24',
            height: '24',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          [
            h('path', {
              d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
            }),
          ],
        )

    case 'tiktok':
      return () =>
        h(
          'svg',
          {
            width: '24',
            height: '24',
            fill: 'currentColor',
            viewBox: '0 0 24 24',
          },
          [
            h('path', {
              d: 'M12.14 2h2.41c.11 1.2.48 2.21 1.08 3.02a5.57 5.57 0 0 0 3.16 2c.1 0 .22 0 .32.02v2.38a6.5 6.5 0 0 1-3.55-1.07v5.47c0 2.55-1.98 4.75-4.49 5.15a4.77 4.77 0 0 1-5.48-4.71 4.86 4.86 0 0 1 5.56-5.16v2.36a2.42 2.42 0 0 0-2.27 2.54 2.37 2.37 0 0 0 2.71 2.22c1.14-.16 2.01-1.2 2.01-2.38V2z',
            }),
          ],
        )

    case 'twitter':
      return () =>
        h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '24',
            height: '24',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          [
            h('path', {
              d: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z',
            }),
          ],
        )

    case 'youtube':
      return () =>
        h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '24',
            height: '24',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          [
            h('path', {
              d: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z',
            }),
            h('polygon', {
              points: '9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02',
            }),
          ],
        )

    default:
      // Link icon as default
      return () =>
        h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '24',
            height: '24',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          [
            h('path', {
              d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
            }),
            h('path', {
              d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
            }),
          ],
        )
  }
}

// Watch for cart changes (optional, for reactivity)
watch(
  () => props.cart,
  () => {
    // Cart changes will automatically trigger whatsappUrl recomputation
  },
  { deep: true },
)
</script>
