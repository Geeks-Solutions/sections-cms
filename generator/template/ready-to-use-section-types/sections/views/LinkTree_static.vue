<template>
  <div v-if="settings" class="linktree-section py-2.5" :class="[settings.classes, themeClass]" :style="sectionStyles">
    <div class="linktree-container">
      <!-- Profile Picture -->
      <div v-if="settings && settings.profileImage && settings.profileImage.url"
        class="profile-picture text-center mb-6">
        <NuxtImg :src="settings.profileImage.url"
          :alt="(settings.profileImage.seo_tag) || profileTitle" width="120" height="120"
          class="profile-img h-30 w-30 object-cover rounded-full mx-auto" placeholder quality="80" format="webp" preload
          fetchpriority="high" />
      </div>

      <!-- Title and Bio -->
      <div class="profile-info mb-8 text-center">
        <h2 v-if="profileTitle" class="profile-title mb-3 drop-shadow-sm">
          {{ profileTitle }}
        </h2>

        <div v-if="profileBio" class="profile-bio drop-shadow-sm max-w-md mx-auto">
          <h3 v-html="profileBio"></h3>
        </div>
      </div>

      <!-- Social Links -->
      <div v-if="socialLinks && socialLinks.length > 0" class="social-links mb-8">
        <a v-for="(link, index) in socialLinks" :key="`social-${index}`"
          :href="link.url || '#'"
          :target="link.url ? '_blank' : '_self'"
          :rel="link.url ? 'noopener noreferrer' : ''"
          class="social-link button-selector flex px-4 my-4 w-full"
          :class="[`social-link-${link.platform}`, { 'disabled-link': !link.url }]"
          @click="!link.url && $event.preventDefault()">
          <span class="social-icon pr-2" :class="[`social-icon-${link.platform}`]">
            <!-- Use ClientOnly wrapper for SVG content -->
            <ClientOnly>
              <span v-if="getSocialIconSVG(link.platform)" v-html="getSocialIconSVG(link.platform)">
              </span>
              <template #fallback>
                <!-- Fallback content for SSR -->
                <span class=""></span>
              </template>
            </ClientOnly>

            <!-- Custom Icon (also wrapped) -->
            <ClientOnly v-if="link.customIcon && !getSocialIconSVG(link.platform)">
              <span v-html="link.customIcon"></span>
              <template #fallback>
                <span class=""></span>
              </template>
            </ClientOnly>

            <!-- Default Link Icon (shown during SSR) -->
            <span v-if="!getSocialIconSVG(link.platform) && !link.customIcon" class="text-xl"></span>
          </span>
          <span class="social-text">
            {{ link.linkText[lang] }}
          </span>
        </a>
      </div>

      <!-- Contact Information -->
      <div v-if="hasContactInfo" class="contact-info mb-8">
        <h3 class="contact-title font-semibold mb-5 text-center ">
          {{ $t('LinkTree.contact') }}
        </h3>

        <div class="contact-items">
          <div v-if="settings.email" class="contact-item my-4 button-selector w-full text-left">
            <a :href="`mailto:${settings.email}`" class="contact-link flex items-center">
              <span class="contact-icon mr-2">📧</span>
              <span>{{ settings.email }}</span>
            </a>
          </div>

          <div v-if="settings.phone" class="contact-item my-4 button-selector w-full text-left">
            <a :href="`tel:${settings.phone}`" class="contact-link flex items-center">
              <span class="contact-icon mr-2">📱</span>
              <span>{{ settings.phone }}</span>
            </a>
          </div>

          <div v-if="settings.address && settings.address[lang]" class="contact-item mb-3 button-selector w-full text-left">
            <div class="contact-link flex items-center">
              <span class="contact-icon mr-2">📍</span>
              <span>{{ settings.address[lang]}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<i18n src="../../sections/forms/LinkTree_i18n.json"></i18n>


<script setup>
import { ref, computed, watch, onMounted, inject } from 'vue'

// Props with proper default structure
const props = defineProps({
  section: {
    type: Object,
    default: () => ({})
  },
  lang: {
    type: String,
    default: "en"
  },
  locales: {
    type: Array,
    default: () => []
  },
  viewStructure: {
    settings: [
      {
        profileImage: {
          url: '',
          seo_tag: ''
        },
        title: {
          en: "John Doe - Digital Creator",
          fr: "John Doe - Créateur Numérique"
        },
        bio: {
          en: "Welcome to my digital space! I'm a content creator, entrepreneur, and tech enthusiast sharing my journey and connecting with amazing people.",
          fr: "Bienvenue dans mon espace numérique ! Je suis créateur de contenu, entrepreneur et passionné de technologie."
        },
        address: {
          en: "123 Main Street, New York United States",
          fr: "123 Rue Principale, New York, NY 10001, États-Unis"
        },
        useCustomColors: false,
        selectedTheme: 'neon',
        styleMode: 'default',
        backgroundColor: "#667eea",
        textColor: "#ffffff",
        phone: '+1 (555) 123-4567',
        email: 'john@example.com',
        classes: '',
        socialLinks: [
          {
            id: "social_001",
            platform: "instagram",
            linkText: {
              en: "Follow me on Instagram",
              fr: "Suivez-moi sur Instagram"
            },
            url: "https://instagram.com/johndoe",
            customIcon: ""
          },
          {
            id: "social_002",
            platform: "twitter",
            linkText: {
              en: "Latest thoughts on Twitter",
              fr: "Mes dernières pensées sur Twitter"
            },
            url: "https://twitter.com/johndoe",
            customIcon: ""
          }
        ],
        files: []
      }
    ]
  }
})

// Add reactive state for client-side rendering
const isClient = ref(false)

const { t: $t } = useI18n({ useScope: 'local' })

// Theme definitions
const themes = {
  classic: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    linkBackground: 'rgba(255, 255, 255, 0.15)',
    linkHoverBackground: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    iconBackground: 'rgba(255, 255, 255, 0.2)'
  },
  proBlack: {
    background: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
    textColor: '#ffffff',
    linkBackground: 'rgba(255, 255, 255, 0.1)',
    linkHoverBackground: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    iconBackground: 'rgba(255, 255, 255, 0.15)'
  },
  goldenBlack: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    textColor: '#ffd700',
    linkBackground: 'rgba(255, 215, 0, 0.1)',
    linkHoverBackground: 'rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
    iconBackground: 'rgba(255, 215, 0, 0.2)'
  },
  ocean: {
    background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
    textColor: '#ffffff',
    linkBackground: 'rgba(255, 255, 255, 0.15)',
    linkHoverBackground: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    iconBackground: 'rgba(255, 255, 255, 0.2)'
  },
  sunset: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    textColor: '#ffffff',
    linkBackground: 'rgba(255, 255, 255, 0.15)',
    linkHoverBackground: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    iconBackground: 'rgba(255, 255, 255, 0.2)'
  },
  forest: {
    background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    textColor: '#ffffff',
    linkBackground: 'rgba(255, 255, 255, 0.15)',
    linkHoverBackground: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    iconBackground: 'rgba(255, 255, 255, 0.2)'
  },
  purple: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    linkBackground: 'rgba(255, 255, 255, 0.15)',
    linkHoverBackground: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    iconBackground: 'rgba(255, 255, 255, 0.2)'
  },
  minimalist: {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    textColor: '#212529',
    linkBackground: 'rgba(0, 0, 0, 0.05)',
    linkHoverBackground: 'rgba(0, 0, 0, 0.1)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    iconBackground: 'rgba(0, 0, 0, 0.1)'
  },
  neon: {
    background: 'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)',
    textColor: '#ffffff',
    linkBackground: 'rgba(255, 255, 255, 0.15)',
    linkHoverBackground: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    iconBackground: 'rgba(255, 255, 255, 0.2)'
  },
  corporate: {
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    textColor: '#ffffff',
    linkBackground: 'rgba(255, 255, 255, 0.15)',
    linkHoverBackground: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    iconBackground: 'rgba(255, 255, 255, 0.2)'
  }
}

// Computed properties with safe access
const settings = computed(() => {
  // First check if section has settings
  if (props.section?.settings) {
    return Array.isArray(props.section.settings) ? props.section.settings[0] : props.section.settings
  }

  // Then check viewStructure
  if (props.viewStructure?.settings?.length > 0) {
    return props.viewStructure.settings[0]
  }

  // Return empty object as fallback
  return {}
})

const currentTheme = computed(() => {
  if (settings.value.useCustomColors) {
    return null
  }
  return themes[settings.value.selectedTheme] || themes.classic
})

const themeClass = computed(() => {
  if (settings.value.useCustomColors) {
    return ''
  }
  return `theme-${settings.value.selectedTheme || 'classic'}`
})

const profileTitle = computed(() => {
  return settings.value?.title?.[props.lang] || ''
})

const profileBio = computed(() => {
  return settings.value?.bio?.[props.lang] || ''
})

// Updated social links computed to show links with text even if URL is empty
const socialLinks = computed(() => {
  if (!settings.value?.socialLinks || !Array.isArray(settings.value.socialLinks)) return []
  return settings.value.socialLinks.filter(link =>
    link &&
    link.linkText &&
    link.linkText[props.lang] &&
    link.linkText[props.lang].trim() !== ''
  )
})

const sectionStyles = computed(() => {
  const styles = {}

  // Check if using the new styleMode system (default, predefined, custom)
  if (settings.value.styleMode) {
    if (settings.value.styleMode === 'custom') {
      // Use custom colors
      if (settings.value.backgroundColor) {
        styles.backgroundColor = settings.value.backgroundColor
      }
      if (settings.value.textColor) {
        styles.color = settings.value.textColor
      }
    } else if (settings.value.styleMode === 'predefined') {
      // Use predefined theme
      const theme = currentTheme.value
      if (theme) {
        styles.background = theme.background
        styles.color = theme.textColor
      }
    }
    // If styleMode === 'default', don't apply any styles (let global CSS handle it)
  } else {
    // Backward compatibility with old useCustomColors system
    if (settings.value.useCustomColors) {
      // Use custom colors
      if (settings.value.backgroundColor) {
        styles.backgroundColor = settings.value.backgroundColor
      }
      if (settings.value.textColor) {
        styles.color = settings.value.textColor
      }
    } else {
      // Use theme
      const theme = currentTheme.value
      if (theme) {
        styles.background = theme.background
        styles.color = theme.textColor
      }
    }
  }

  return styles
})

const hasContactInfo = computed(() => {
  if (!settings.value) return false
  return !!(settings.value.email ||
    settings.value.phone ||
    (settings.value.address && settings.value.address[props.lang]))
})

// Methods
const initializeProfileFields = () => {
  if (settings.value) {
    if (!settings.value.title) {
      settings.value.title = {}
    }
    if (!settings.value.title[props.lang]) {
      settings.value.title[props.lang] = ''
    }
    if (!settings.value.bio) {
      settings.value.bio = {}
    }
    if (!settings.value.bio[props.lang]) {
      settings.value.bio[props.lang] = ''
    }
    if (!settings.value.address) {
      settings.value.address = {}
    }
    if (!settings.value.address[props.lang]) {
      settings.value.address[props.lang] = ''
    }
  }
}

// Move SVG icons to a stable object to prevent hydration issues
const svgIcons = {
  instagram: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>`,

  x: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
  </svg>`,

  twitter: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
  </svg>`,

  linkedin: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>`,

  github: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>`,

  facebook: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>`,

  youtube: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>`,

  tiktok: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>`,

  website: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>`,

  custom: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H6.9C4.29 7 2.2 9.09 2.2 11.7s2.09 4.7 4.7 4.7h4v-1.9H6.9c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9.1-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.61 0 4.7-2.09 4.7-4.7S19.71 7 17.1 7z"/>
  </svg>`
}

const getSocialIconSVG = (platform) => {
  // Only return SVG on client side to prevent hydration mismatch
  if (!isClient.value) return null
  return svgIcons[platform?.toLowerCase()] || svgIcons.custom
}

// Watchers
watch(() => settings.value, (newValue) => {
  if (newValue) {
    initializeProfileFields()
  }
}, { deep: true })

watch(() => props.lang, () => {
  if (settings.value) {
    initializeProfileFields()
  }
})

// Lifecycle hooks
onMounted(() => {
  // Set client flag to enable SVG rendering
  isClient.value = true

  initializeProfileFields()

  // Initialize settings properties safely
  if (settings.value && typeof settings.value === 'object') {
    if (!settings.value.socialLinks) {
      settings.value.socialLinks = []
    }

    if (!settings.value.files) {
      settings.value.files = []
    }

    if (typeof settings.value.useCustomColors === 'undefined') {
      settings.value.useCustomColors = false
    }

    if (!settings.value.selectedTheme) {
      settings.value.selectedTheme = 'classic'
    }

    if (!settings.value.backgroundColor) {
      settings.value.backgroundColor = '#667eea'
    }

    if (!settings.value.textColor) {
      settings.value.textColor = '#ffffff'
    }
  }

  const sectionsThemeComponents = inject('sectionsThemeComponents')
  sectionsThemeComponents?.(props.section.name, [
    {
      id: 'global',
      name: useI18n().t('sectionsBuilder.globalSettings'),
      path: '/theme/global_settings'
    }
  ])
})

</script>

<style scoped>
.profile-title {
}

.social-links,.contact-info {
  width: 25%;
  margin: 0 auto;
}
</style>
