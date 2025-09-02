<template>
  <div :key="resetKey" class="max-w-4xl mx-auto p-6 bg-white builder-settings">

    <div class="flex flex-row justify-end">
      <button
        @click="resetSettings()"
        class="w-max mb-3 flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {{ $t('builderSettings.reset') }}
      </button>
    </div>

    <!-- PriceAndCurrency Settings -->
    <div class="mb-8">
      <button
        @click="toggleSection('priceAndCurrency')"
        class="priceAndCurrency w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <h3 class="text-lg font-semibold text-gray-800">{{ $t('builderSettings.priceAndCurrency') }}</h3>
        <svg
          :class="{ 'rotate-180': expandedSections.priceAndCurrency }"
          class="w-5 h-5 text-gray-600 transition-transform"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div v-show="expandedSections.priceAndCurrency" class="mt-4 p-4 border border-gray-200 rounded-b-lg bg-gray-50">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label for="base-font-size" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('builderSettings.priceFontSize') }}
            </label>
            <input
              id="price-font-size"
              v-model="formData['--section-price-font-size']"
              @input="emitUpdate"
              type="text"
              placeholder="16px"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Normal State -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-600">{{ $t('builderSettings.normalState') }}</h5>
            <ColorPicker
              v-model="formData['--section-price-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.priceColor')}`"
              field-name="price-color"
            />
          </div>
          <!-- Hover State -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-600">{{ $t('builderSettings.hoverState') }}</h5>
            <ColorPicker
              v-model="formData['--section-hover-price-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.hoverPriceColor')}`"
              field-name="hover-price-color"
            />
          </div>
        </div>

      </div>
    </div>

    <!-- closeIcon Settings -->
    <div class="mb-8">
      <button
        @click="toggleSection('closeIcon')"
        class="closeIconToggle w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <h3 class="text-lg font-semibold text-gray-800">{{ $t('builderSettings.closeIcon') }}</h3>
        <svg
          :class="{ 'rotate-180': expandedSections.closeIcon }"
          class="w-5 h-5 text-gray-600 transition-transform"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div v-show="expandedSections.closeIcon" class="mt-4 p-4 border border-gray-200 rounded-b-lg bg-gray-50">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Normal State -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-600">{{ $t('builderSettings.normalState') }}</h5>
            <ColorPicker
              v-model="formData['--section-close-icon-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.closeIconColor')}`"
              field-name="close-icon-color"
            />
            <ColorPicker
              v-model="formData['--section-close-icon-background-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.closeIconBackgroundColor')}`"
              field-name="close-icon-background-color"
              picker-type="both"
            />
          </div>
          <!-- Hover State -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-600">{{ $t('builderSettings.hoverState') }}</h5>
            <ColorPicker
              v-model="formData['--section-hover-close-icon-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.hoverCloseIconColor')}`"
              field-name="hover-close-icon-color"
            />
            <ColorPicker
              v-model="formData['--section-hover-close-icon-background-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.hoverCloseIconBackgroundColor')}`"
              field-name="hover-close-icon-background-color"
              picker-type="both"
            />
          </div>
        </div>

      </div>
    </div>

    <!-- quantity Settings -->
    <div class="mb-8">
      <button
        @click="toggleSection('quantity')"
        class="quantity w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <h3 class="text-lg font-semibold text-gray-800">{{ $t('builderSettings.quantity') }}</h3>
        <svg
          :class="{ 'rotate-180': expandedSections.quantity }"
          class="w-5 h-5 text-gray-600 transition-transform"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div v-show="expandedSections.quantity" class="mt-4 p-4 border border-gray-200 rounded-b-lg bg-gray-50">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Normal State -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-600">{{ $t('builderSettings.normalState') }}</h5>
            <ColorPicker
              v-model="formData['--section-quantity-label-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.quantityLabelColor')}`"
              field-name="quantity-label-color"
            />
            <ColorPicker
              v-model="formData['--section-quantity-number-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.quantityNumberColor')}`"
              field-name="quantity-number-color"
              picker-type="both"
            />
          </div>
          <!-- Hover State -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-600">{{ $t('builderSettings.hoverState') }}</h5>
            <ColorPicker
              v-model="formData['--section-hover-quantity-label-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.hoverQuantityLabelColor')}`"
              field-name="hover-quantity-label-color"
            />
            <ColorPicker
              v-model="formData['--section-hover-quantity-number-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.hoverQuantityNumberColor')}`"
              field-name="hover-quantity-number-color"
              picker-type="both"
            />
          </div>
        </div>

      </div>
    </div>

    <!-- specialInstructions Settings -->
    <div class="mb-8">
      <button
        @click="toggleSection('specialInstructions')"
        class="specialInstructions w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <h3 class="text-lg font-semibold text-gray-800">{{ $t('builderSettings.specialInstructions') }}</h3>
        <svg
          :class="{ 'rotate-180': expandedSections.specialInstructions }"
          class="w-5 h-5 text-gray-600 transition-transform"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div v-show="expandedSections.specialInstructions" class="mt-4 p-4 border border-gray-200 rounded-b-lg bg-gray-50">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Normal State -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-600">{{ $t('builderSettings.normalState') }}</h5>
            <ColorPicker
              v-model="formData['--section-special-instructions-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.specialInstructionsColor')}`"
              field-name="special-instructions-color"
            />
          </div>
          <!-- Hover State -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-600">{{ $t('builderSettings.hoverState') }}</h5>
            <ColorPicker
              v-model="formData['--section-hover-special-instructions-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.hoverSpecialInstructionsColor')}`"
              field-name="hover-special-instructions-color"
            />
          </div>
        </div>

      </div>
    </div>

    <!-- categories Settings -->
    <div class="mb-8">
      <button
        @click="toggleSection('categories')"
        class="categories w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <h3 class="text-lg font-semibold text-gray-800">{{ $t('builderSettings.categories') }}</h3>
        <svg
          :class="{ 'rotate-180': expandedSections.categories }"
          class="w-5 h-5 text-gray-600 transition-transform"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div v-show="expandedSections.categories" class="mt-4 p-4 border border-gray-200 rounded-b-lg bg-gray-50">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Normal State -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-600">{{ $t('builderSettings.normalState') }}</h5>
            <ColorPicker
              v-model="formData['--section-categories-text-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.categoriesTextColor')}`"
              field-name="categories-text-color"
            />
            <ColorPicker
              v-model="formData['--section-categories-background-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.categoriesBackgroundColor')}`"
              field-name="categories-background-color"
              picker-type="both"
            />
            <ColorPicker
              v-model="formData['--section-categories-active-text-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.categoriesActiveTextColor')}`"
              field-name="categories-active-text-color"
            />
            <ColorPicker
              v-model="formData['--section-categories-active-background-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.categoriesActiveBackgroundColor')}`"
              field-name="categories-active-background-color"
              picker-type="both"
            />
          </div>
          <!-- Hover State -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-600">{{ $t('builderSettings.hoverState') }}</h5>
            <ColorPicker
              v-model="formData['--section-hover-categories-text-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.hoverCategoriesTextColor')}`"
              field-name="hover-categories-text-color"
            />
            <ColorPicker
              v-model="formData['--section-hover-categories-background-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.hoverCategoriesBackgroundColor')}`"
              field-name="hover-categories-background-color"
              picker-type="both"
            />
            <ColorPicker
              v-model="formData['--section-hover-categories-active-text-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.hoverCategoriesActiveTextColor')}`"
              field-name="hover-categories-active-text-color"
            />
            <ColorPicker
              v-model="formData['--section-hover-categories-active-background-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.hoverCategoriesActiveBackgroundColor')}`"
              field-name="hover-categories-active-background-color"
              picker-type="both"
            />
          </div>
        </div>

      </div>
    </div>

    <!-- cartIcon Settings -->
    <div class="mb-8">
      <button
        @click="toggleSection('cartIcon')"
        class="cartIconToggle w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <h3 class="text-lg font-semibold text-gray-800">{{ $t('builderSettings.cartIcon') }}</h3>
        <svg
          :class="{ 'rotate-180': expandedSections.cartIcon }"
          class="w-5 h-5 text-gray-600 transition-transform"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div v-show="expandedSections.cartIcon" class="mt-4 p-4 border border-gray-200 rounded-b-lg bg-gray-50">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Normal State -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-600">{{ $t('builderSettings.normalState') }}</h5>
            <ColorPicker
              v-model="formData['--section-cart-icon-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.cartIconColor')}`"
              field-name="cart-icon-color"
            />
            <ColorPicker
              v-model="formData['--section-cart-icon-background-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.cartIconBackgroundColor')}`"
              field-name="cart-icon-background-color"
              picker-type="both"
            />
          </div>
          <!-- Hover State -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-600">{{ $t('builderSettings.hoverState') }}</h5>
            <ColorPicker
              v-model="formData['--section-hover-cart-icon-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.hoverCartIconColor')}`"
              field-name="hover-cart-icon-color"
            />
            <ColorPicker
              v-model="formData['--section-hover-cart-icon-background-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.hoverCartIconBackgroundColor')}`"
              field-name="hover-cart-icon-background-color"
              picker-type="both"
            />
          </div>
        </div>

      </div>
    </div>

    <!-- socialNetworkLinks Settings -->
    <div class="mb-8">
      <button
        @click="toggleSection('socialNetworkLinks')"
        class="socialNetworkLinks w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <h3 class="text-lg font-semibold text-gray-800">{{ $t('builderSettings.socialNetworkLinks') }}</h3>
        <svg
          :class="{ 'rotate-180': expandedSections.socialNetworkLinks }"
          class="w-5 h-5 text-gray-600 transition-transform"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div v-show="expandedSections.socialNetworkLinks" class="mt-4 p-4 border border-gray-200 rounded-b-lg bg-gray-50">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Normal State -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-600">{{ $t('builderSettings.normalState') }}</h5>
            <ColorPicker
              v-model="formData['--section-social-network-icon-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.socialNetworkIconColor')}`"
              field-name="social-network-icon-color"
            />
            <ColorPicker
              v-model="formData['--section-social-network-icon-background-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.socialNetworkIconBackgroundColor')}`"
              field-name="social-network-icon-background-color"
              picker-type="both"
            />
          </div>
          <!-- Hover State -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-600">{{ $t('builderSettings.hoverState') }}</h5>
            <ColorPicker
              v-model="formData['--section-hover-social-network-icon-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.hoverSocialNetworkIconColor')}`"
              field-name="hover-social-network-icon-color"
            />
            <ColorPicker
              v-model="formData['--section-hover-social-network-icon-background-color']"
              @update:model-value="emitUpdate"
              :label="`${$t('builderSettings.hoverSocialNetworkIconBackgroundColor')}`"
              field-name="hover-social-network-icon-background-color"
              picker-type="both"
            />
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import {ref, reactive, watch} from 'vue'
import { callDynamicFunction } from '@/utils/constants.js'

const emit = defineEmits(['section-theme-updated'])
const savedSettings = ref(null)
const resetKey = ref(0)

// Expandable sections state
const expandedSections = ref({
  priceAndCurrency: true,
  closeIcon: false,
  quantity: false,
  specialInstructions: false,
  categories: false,
  cartIcon: false,
  socialNetworkLinks: false
})

const props = defineProps({
  sectionData: {
    type: Object,
    default() {
      return {}
    }
  },
  originalThemeSettingsProp: {
    type: Object,
    default() {
      return {}
    }
  },
  themeSettingsProp: {
    type: Object,
    default() {
      return {}
    }
  }
})

// Form data with all required fields
let formData = reactive({
  // PriceAndCurrency
  '--section-price-font-size': '',
  '--section-price-color': '',
  '--section-hover-price-color': '',

  '--section-close-icon-color': '',
  '--section-close-icon-background-color': '',
  '--section-hover-close-icon-color': '',
  '--section-hover-close-icon-background-color': '',

  '--section-quantity-label-color': '',
  '--section-quantity-number-color': '',
  '--section-hover-quantity-label-color': '',
  '--section-hover-quantity-number-color': '',

  '--section-special-instructions-color': '',
  '--section-hover-special-instructions-color': '',

  '--section-categories-text-color': '',
  '--section-categories-background-color': '',
  '--section-hover-categories-text-color': '',
  '--section-hover-categories-background-color': '',

  '--section-categories-active-text-color': '',
  '--section-categories-active-background-color': '',
  '--section-hover-categories-active-text-color': '',
  '--section-hover-categories-active-background-color': '',

  '--section-cart-icon-color': '',
  '--section-cart-icon-background-color': '',
  '--section-hover-cart-icon-color': '',
  '--section-hover-cart-icon-background-color': '',

  '--section-social-network-icon-color': '',
  '--section-social-network-icon-background-color': '',
  '--section-hover-social-network-icon-color': '',
  '--section-hover-social-network-icon-background-color': ''
})

watch(() => props.originalThemeSettingsProp, (value) => {
  if (value && value.specific && value.specific[props.sectionData.id]) {
    if (!savedSettings.value) {
      Object.assign(formData, value.specific[props.sectionData.id])
      savedSettings.value = value.specific[props.sectionData.id]
    }
  }
}, {deep: true, immediate: true})

watch(() => props.themeSettingsProp, (value) => {
  if (value && value.specific && value.specific[props.sectionData.id]) {
    Object.assign(formData, value.specific[props.sectionData.id])
  }
}, {deep: true, immediate: true})

const toggleSection = (section) => {
  expandedSections.value[section] = !expandedSections.value[section]
}

const resetSettings = () => {
  const emptyFormData = {
    // PriceAndCurrency
    '--section-price-font-size': '',
    '--section-price-color': '',
    '--section-hover-price-color': '',

    '--section-close-icon-color': '',
    '--section-close-icon-background-color': '',
    '--section-hover-close-icon-color': '',
    '--section-hover-close-icon-background-color': '',

    '--section-quantity-label-color': '',
    '--section-quantity-number-color': '',
    '--section-hover-quantity-label-color': '',
    '--section-hover-quantity-number-color': '',

    '--section-special-instructions-color': '',
    '--section-hover-special-instructions-color': '',

    '--section-categories-text-color': '',
    '--section-categories-background-color': '',
    '--section-hover-categories-text-color': '',
    '--section-hover-categories-background-color': '',

    '--section-categories-active-text-color': '',
    '--section-categories-active-background-color': '',
    '--section-hover-categories-active-text-color': '',
    '--section-hover-categories-active-background-color': '',

    '--section-cart-icon-color': '',
    '--section-cart-icon-background-color': '',
    '--section-hover-cart-icon-color': '',
    '--section-hover-cart-icon-background-color': '',

    '--section-social-network-icon-color': '',
    '--section-social-network-icon-background-color': '',
    '--section-hover-social-network-icon-color': '',
    '--section-hover-social-network-icon-background-color': ''
  }
  Object.assign(formData, emptyFormData)
  emitUpdate(true)
  resetKey.value++
}

const emitUpdate = async (reset) => {
  await callDynamicFunction(
    "/theme/theme-hooks",     // file path
    "applySettingsToCSS",   // function name
    { ...formData },        // arguments
    props.sectionData,
    "specific",
    reset
  )
  emit('section-theme-updated', {...formData})
}

// Initial emit
emitUpdate()
</script>

<style>
.builder-settings label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
