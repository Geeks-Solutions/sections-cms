<template>
  <div class="p-4">
    <!-- Basic Information -->
    <div class="flex flex-col items-start justify-start mt-4">
      <label class="mr-4 font-medium">{{ $t("LinkTree.title") }}*</label>
      <input v-model="settings[0].title[selectedLang]" type="text" :placeholder="$t('LinkTree.titlePlaceholder')"
        :class="[sectionsStyle.input, errors.generalSettings.title ? 'error' : '']" />
      <span v-show="errors.generalSettings.title === true" class="text-error text-sm pt-2 pl-2">
        {{ $t('LinkTree.requiredField') }}
      </span>
    </div>

    <div class="flex flex-col items-start justify-start mt-4">
      <label class="mr-4 font-medium">{{ $t("LinkTree.bio") }}</label>
      <textarea v-model="settings[0].bio[selectedLang]" type="text" :placeholder="$t('LinkTree.bioPlaceholder')"
        :class="sectionsStyle.textarea" rows="4"></textarea>
    </div>

    <!-- Profile Picture Section -->
    <div class="mb-6 mt-4">
      <LazyMediasUploadMedia :media-label="$t('LinkTree.profilePicture')"
        :upload-text="$t('LinkTree.uploadProfilePicture')" :change-text="$t('LinkTree.changeProfilePicture')"
        :seo-tag="$t('LinkTree.seoTag')"
        :media="settings[0].profileImage && Object.keys(settings[0].profileImage).length > 0 ? [settings[0].profileImage] : []"
        @uploadContainerClicked="openProfileImageModal(settings[0].profileImage && Object.keys(settings[0].profileImage).length > 0 ? settings[0].profileImage.media_id : null)"
        @removeUploadedImage="removeProfileImage()" />
      <span class="flex text-xs text-Gray_800">{{ $t("LinkTree.profilePictureDesc") }}</span>
    </div>

    <!-- Social Links Section -->
    <div id="social-links" class="flex flex-col mt-8 pt-8 border-t">
      <h3 class="text-lg font-semibold mb-4">{{ $t("LinkTree.socialLinks") }}</h3>
      <span class="text-xs text-Gray_800 mb-4">{{ $t("LinkTree.socialLinksDesc") }}</span>

      <LazySectionsFormsFieldSets :array-data-pop="settings[0].socialLinks" :fieldset-group="'social_links'"
        :legend-label="$t('LinkTree.socialLink')" @array-updated="(data) => updateSocialLinks(data)"
        @remove-fieldset="(object, idx) => removeSocialLink(idx)">
        <template #default="{ object, idx }">
          <div class="flex flex-col items-start justify-start mt-4">
            <label class="mr-4 font-medium">{{ $t("LinkTree.platform") }}*</label>
            <div class="select-style-chooser w-full">
              <select v-model="object.platform" :class="sectionsStyle.input"
                style="padding-top: 0px !important;padding-bottom: 0px !important;">
                <option value="website">{{ $t('LinkTree.website') }}</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter/X</option>
                <option value="linkedin">LinkedIn</option>
                <option value="facebook">Facebook</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="github">GitHub</option>
                <option value="custom">{{ $t('LinkTree.custom') }}</option>
              </select>
            </div>
          </div>

          <div class="flex flex-col items-start justify-start mt-4">
            <label class="mr-4 font-medium">{{ $t("LinkTree.linkText") }}*</label>
            <input v-model="object.linkText[selectedLang]" type="text" :placeholder="$t('LinkTree.linkTextPlaceholder')"
              :class="sectionsStyle.input" />
          </div>

          <div class="flex flex-col items-start justify-start mt-4">
            <label class="mr-4 font-medium">{{ $t("LinkTree.url") }}*</label>
            <input v-model="object.url" type="url" :placeholder="$t('LinkTree.urlPlaceholder')"
              :class="sectionsStyle.input" />
          </div>
        </template>
      </LazySectionsFormsFieldSets>

      <div class="add-button underline cursor-pointer mt-2" @click="addSocialLink()">
        <div class="p3 bold text">{{ $t("LinkTree.addSocialLink") }}</div>
      </div>
    </div>

    <!-- Contact Information Section -->
    <div class="flex flex-col items-start justify-start mt-8 pt-8 border-t">
      <h3 class="text-lg font-semibold mb-4">{{ $t("LinkTree.contactInformation") }}</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div class="flex flex-col items-start justify-start">
          <label class="mr-4 font-medium">{{ $t("LinkTree.phone") }}</label>
          <input v-model="settings[0].phone" type="tel" :placeholder="$t('LinkTree.phonePlaceholder')"
            :class="sectionsStyle.input" />
        </div>

        <div class="flex flex-col items-start justify-start">
          <label class="mr-4 font-medium">{{ $t("LinkTree.email") }}</label>
          <input v-model="settings[0].email" type="email" :placeholder="$t('LinkTree.emailPlaceholder')"
            :class="sectionsStyle.input" />
        </div>
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("LinkTree.address") }}</label>
        <textarea v-model="settings[0].address[selectedLang]" type="text"
          :placeholder="$t('LinkTree.addressPlaceholder')" :class="sectionsStyle.textarea" rows="3"></textarea>
      </div>
    </div>

    <!-- Display Options -->
    <div class="flex flex-col items-start justify-start mt-8 pt-8 border-t">
      <h3 class="text-lg font-semibold mb-4">{{ $t("LinkTree.displayOptions") }}</h3>

      <!-- Theme Mode Selection -->
      <div class="flex flex-col items-start justify-start mb-6">
        <label class="mr-4 font-medium mb-2">{{ $t("LinkTree.styleMode") }}</label>
        <div class="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
          <label class="flex items-center cursor-pointer">
            <input v-model="settings[0].styleMode" type="radio" value="default" class="h-4 w-4 mr-2" />
            <span>{{ $t("LinkTree.defaultTheme") }}</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input v-model="settings[0].styleMode" type="radio" value="predefined" class="h-4 w-4 mr-2" />
            <span>{{ $t("LinkTree.predefinedThemes") }}</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input v-model="settings[0].styleMode" type="radio" value="custom" class="h-4 w-4 mr-2" />
            <span>{{ $t("LinkTree.customColors") }}</span>
          </label>
        </div>
        <span class="text-xs text-Gray_800 mt-2">{{ $t("LinkTree.styleModeDesc") }}</span>
      </div>

      <!-- Custom Colors Section -->
      <div v-if="settings[0].styleMode === 'custom'" class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-4">
        <div class="flex flex-col items-start justify-start">
          <label class="mr-4 font-medium">{{ $t("LinkTree.backgroundColor") }}</label>
          <input v-model="settings[0].backgroundColor" type="color" :class="sectionsStyle.input" />
        </div>

        <div class="flex flex-col items-start justify-start">
          <label class="mr-4 font-medium">{{ $t("LinkTree.textColor") }}</label>
          <input v-model="settings[0].textColor" type="color" :class="sectionsStyle.input" />
        </div>
      </div>

      <!-- Theme Selection -->
      <div v-if="settings[0].styleMode === 'predefined'" class="flex flex-col items-start justify-start w-full mb-4">
        <label class="mr-4 font-medium mb-2">{{ $t("LinkTree.selectTheme") }}</label>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
          <div v-for="theme in availableThemes" :key="theme.id" @click="selectTheme(theme.id)" :class="[
            'theme-card cursor-pointer p-4 rounded-lg border-2 transition-all',
            settings[0].selectedTheme === theme.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          ]">
            <div class="theme-preview w-full h-16 rounded mb-2" :style="{ background: theme.preview }"></div>
            <h4 class="font-medium text-sm text-center">{{ $t(`LinkTree.themes.${theme.id}`) }}</h4>
            <p class="text-xs text-gray-500 text-center mt-1">{{ $t(`LinkTree.themes.${theme.id}Desc`) }}</p>
          </div>
        </div>
      </div>

      <!-- Default Theme Info -->
      <div v-if="settings[0].styleMode === 'default'" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="ml-3">
            <h4 class="text-sm font-medium text-blue-800">{{ $t("LinkTree.defaultThemeSelected") }}</h4>
            <p class="text-sm text-blue-700 mt-1">{{ $t("LinkTree.defaultThemeDesc") }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- General Settings -->
    <div class="flex flex-col items-start justify-start mt-8 pt-8 border-t">
      <h3 class="text-lg font-semibold mb-4">{{ $t("LinkTree.generalSettings") }}</h3>

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("LinkTree.cssClasses") }}</label>
        <span class="text-xs text-Gray_800">{{ $t("LinkTree.cssClassesDesc") }}</span>
        <input v-model="settings[0].classes" type="text" placeholder="CSS Classes" :class="sectionsStyle.input" />
      </div>
    </div>
  </div>
</template>

<i18n src="./LinkTree_i18n.json"></i18n>

<script setup>
import { ref, reactive, watch, nextTick, onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { sectionsStyle, scrollToFirstError } from "@/utils/constants"
const { t: $t } = useI18n({ useScope: 'local' })

// Props
const props = defineProps({
  selectedLang: {
    type: String,
    default: 'en'
  },
  selectedMedia: {
    type: Object,
    default: null
  },
  selectedMediaIndex: {
    type: Number,
    default: -1
  },
  locales: {
    type: Array,
    default: () => []
  },
  mediaFields: {
    type: Array,
    default: () => [
      {
        type: 'image',
        name: 'medias'
      }
    ]
  }
})

// Emits
const emit = defineEmits(['openMediaModal', 'closeMediaModal'])

// Available themes
const availableThemes = ref([
  {
    id: 'classic',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'proBlack',
    preview: 'linear-gradient(135deg, #000000 0%, #434343 100%)'
  },
  {
    id: 'goldenBlack',
    preview: 'linear-gradient(135deg, #1a1a1a 0%, #ffd700 100%)'
  },
  {
    id: 'ocean',
    preview: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)'
  },
  {
    id: 'sunset',
    preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 'forest',
    preview: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)'
  },
  {
    id: 'purple',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'minimalist',
    preview: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
  },
  {
    id: 'neon',
    preview: 'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)'
  },
  {
    id: 'corporate',
    preview: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
  }
])

// Reactive data
const settings = ref([
  {
    title: {},
    bio: {},
    address: {},
    styleMode: 'default', // Changed from useCustomColors to styleMode with default value
    selectedTheme: 'classic',
    backgroundColor: '#667eea',
    textColor: '#ffffff',
    phone: '',
    email: '',
    classes: '',
    profileImage: {},
    socialLinks: [],
    medias: []
  }
])

const errors = reactive({
  generalSettings: {
    title: false
  },
  socialLinks: []
})

const currentMediaType = ref(null)

// Methods
const updateSocialLinks = (data) => {
  settings.value[0].socialLinks = data
}

const updateMediasArray = (media) => {
  if (!media || !media.media_id) return

  const existingIndex = settings.value[0].medias.findIndex(m => m.media_id === media.media_id)
  if (existingIndex !== -1) {
    settings.value[0].medias.splice(existingIndex, 1)
  }

  settings.value[0].medias.push(media)
}

const removeFromMediasArray = (mediaId) => {
  if (!mediaId) return
  settings.value[0].medias = settings.value[0].medias.filter(m => m.media_id !== mediaId)
}

const initializeLocalizedFields = () => {
  const locales = props.locales.length > 0 ? props.locales : ['en', 'fr']

  if (!settings.value[0].title) {
    settings.value[0].title = {}
  }
  if (!settings.value[0].bio) {
    settings.value[0].bio = {}
  }
  if (!settings.value[0].address) {
    settings.value[0].address = {}
  }

  locales.forEach(locale => {
    if (!settings.value[0].title[locale]) {
      settings.value[0].title[locale] = ''
    }
    if (!settings.value[0].bio[locale]) {
      settings.value[0].bio[locale] = ''
    }
    if (!settings.value[0].address[locale]) {
      settings.value[0].address[locale] = ''
    }
  })
}

const selectTheme = (themeId) => {
  settings.value[0].selectedTheme = themeId
}

const openProfileImageModal = (mediaId) => {
  emit('openMediaModal', mediaId)
  nextTick(() => {
    currentMediaType.value = 'profileImage'
  })
}

const removeProfileImage = () => {
  if (settings.value[0].profileImage && settings.value[0].profileImage.media_id) {
    removeFromMediasArray(settings.value[0].profileImage.media_id)
  }
  settings.value[0].profileImage = {}
}

const addSocialLink = () => {
  const locales = props.locales.length > 0 ? props.locales : ['en', 'fr']

  const socialLink = {
    id: uuidv4(),
    linkText: {},
    platform: 'website',
    url: '',
    customIcon: ''
  }

  locales.forEach(locale => {
    socialLink.linkText[locale] = ''
  })

  settings.value[0].socialLinks.push(socialLink)
}

const removeSocialLink = (idx) => {
  settings.value[0].socialLinks = settings.value[0].socialLinks.filter((link, i) => idx !== i)
}

const validate = () => {
  let valid = true

  // Reset errors
  errors.generalSettings.title = false

  // Validate title (required)
  if (!settings.value[0].title.en) {
    errors.generalSettings.title = true
    valid = false
  }

  // Clean up empty media objects
  if (settings.value[0].profileImage && (Object.keys(settings.value[0].profileImage).length === 0 || !settings.value[0].profileImage.media_id || !settings.value[0].profileImage.url)) {
    delete settings.value[0].profileImage
  }

  if (!valid) {
    if (scrollToFirstError) {
      scrollToFirstError(errors)
    }
  }

  return valid
}

// Watchers
watch(() => props.selectedMedia, (mediaObject) => {
  if (!mediaObject) return

  const media = {
    media_id: mediaObject.id,
    url: mediaObject.files[0].url,
    seo_tag: mediaObject.seo_tag || '',
    filename: mediaObject.files[0].filename,
    headers: mediaObject.files[0].headers || {}
  }

  if (currentMediaType.value === 'profileImage') {
    settings.value[0].profileImage = media
  }

  updateMediasArray(media)
  emit('closeMediaModal')
  currentMediaType.value = null
})

// Backward compatibility watcher - convert old useCustomColors to new styleMode
watch(() => settings.value[0], (newSettings) => {
  // Convert old useCustomColors boolean to new styleMode string
  if (typeof newSettings.useCustomColors === 'boolean' && !newSettings.styleMode) {
    if (newSettings.useCustomColors === true) {
      newSettings.styleMode = 'custom'
    } else {
      newSettings.styleMode = 'predefined'
    }
    // Clean up old property
    delete newSettings.useCustomColors
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  initializeLocalizedFields()
})

// Expose methods that might be called from parent
defineExpose({
  validate,
  settings
})
</script>

<style>
.content-wrapper {
  overflow-x: hidden;
}

.theme-card {
  min-height: 100px;
}

.theme-preview {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>