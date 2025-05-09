<template>
  <div class="p-4">
    <div class="flex flex-col items-start justify-start mt-4">
      <label class="mr-4 font-medium">{{ $t("RestaurantMenu.viewMode") }}</label>
      <div class="flex items-center mt-2">
        <label class="flex items-center cursor-pointer mr-4">
          <input type="radio" v-model="settings[0].viewMode" value="list" class="mr-2 h-[20px] w-[20px]" />
          <span>{{ $t("RestaurantMenu.listView") }}</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input type="radio" v-model="settings[0].viewMode" value="category" class="mr-2 h-[20px] w-[20px]" />
          <span>{{ $t("RestaurantMenu.categoryView") }}</span>
        </label>
      </div>
      <span class="text-xs text-Gray_800 mt-1">{{ $t("RestaurantMenu.viewModeDesc") }}</span>
    </div>
    <!-- Categories Section -->
    <div id="categories" class="flex flex-col mt-4">
      <h3 class="text-lg font-semibold mb-4">{{ $t("RestaurantMenu.categories") }}</h3>
      <span class="text-xs text-Gray_800 mb-4">{{ $t("RestaurantMenu.categoriesDesc") }}</span>

      <FieldSets :array-data-pop="settings[0].categories" :fieldset-group="'categories'"
        :legend-label="$t('RestaurantMenu.category')" @array-updated="(data) => $set(settings[0], 'categories', data)"
        @remove-fieldset="(object, idx) => removeCategory(idx)">
        <template #default="{ object, idx }">
          <div class="flex flex-col items-start justify-start mt-4">
            <label class="mr-4 font-medium">{{ $t("RestaurantMenu.categoryName") }}*</label>
            <input v-model="object.name[selectedLang]" type="text" placeholder="Category Name"
              :class="sectionsStyle.input" />
            <span v-show="errors.categories[idx].name === true" class="text-error text-sm pt-2 pl-2">{{
              $t('RestaurantMenu.requiredField') }}</span>
          </div>

          <!-- Category Icon -->
          <div class="mb-4 mt-4">
            <UploadMedia :media-label="$t('RestaurantMenu.categoryIcon')" :upload-text="$t('RestaurantMenu.uploadIcon')"
              :change-text="$t('RestaurantMenu.changeIcon')" :seo-tag="$t('RestaurantMenu.seoTag')"
              :media="object.icon && Object.keys(object.icon).length > 0 ? [object.icon] : []"
              @uploadContainerClicked="openCategoryIconModal(object.id, object.icon && Object.keys(object.icon).length > 0 ? object.icon.media_id : null)"
              @removeUploadedImage="removeCategoryIcon(object.id)" />
            <span class="flex text-xs text-Gray_800">{{ $t("RestaurantMenu.categoryIconDesc") }}</span>
          </div>

          <div class="flex flex-col items-start justify-start mt-4">
            <label class="mr-4 font-medium">{{ $t("RestaurantMenu.categoryDescription") }}</label>
            <textarea v-model="object.description[selectedLang]" type="text" placeholder="Category Description"
              :class="sectionsStyle.textarea" rows="3"></textarea>
          </div>

          <div class="flex flex-col items-start justify-start mt-4">
            <label class="mr-4 font-medium">{{ $t("RestaurantMenu.cssClasses") }}</label>
            <span class="text-xs text-Gray_800">{{ $t("RestaurantMenu.cssClassesDesc") }}</span>
            <input v-model="object.classes" type="text" placeholder="CSS Classes" :class="sectionsStyle.input" />
          </div>

        </template>
      </FieldSets>

      <div class="add-button underline cursor-pointer mt-2" @click="addCategory()">
        <div class="p3 bold text">{{ $t("RestaurantMenu.addCategory") }}</div>
      </div>
    </div>

    <!-- Menu Items Section -->
    <div id="menu-items" class="flex flex-col mt-8 pt-8 border-t">
      <h3 class="text-lg font-semibold mb-4">{{ $t("RestaurantMenu.menuItems") }}</h3>
      <span class="text-xs text-Gray_800 mb-4">{{ $t("RestaurantMenu.menuItemsDesc") }}</span>

      <!-- Category Selector for Menu Items -->
      <div class="flex flex-col items-start justify-start mb-6">
        <label class="mr-4 font-medium mb-2">{{ $t("RestaurantMenu.selectCategory") }}</label>
        <gAutoComplete :main-filter="selectedCategoryId" :placeholder="$t('RestaurantMenu.selectCategory')"
          :filter-label-prop="'name'" :reduce="option => option.id" :filter-options="getCategoryOptions()"
          :filter-searchable="true" :close-on-select="true" :filter-clearable="true" :track-by="'id'"
          @itemSelected="val => selectedCategoryId = val">
          <template #option="{ name, _showId }">
            {{ _showId ? `Category ${id.slice(0, 4)}` : name }}
          </template>
        </gAutoComplete>
      </div>

      <div v-if="selectedCategoryId">
        <FieldSets :array-data-pop="getMenuItemsByCategory(selectedCategoryId)" :fieldset-group="'menuItems'"
          :legend-label="$t('RestaurantMenu.menuItem')"
          @array-updated="(data) => updateMenuItemsForCategory(selectedCategoryId, data)"
          @remove-fieldset="(object, idx) => removeMenuItem(object.id)">
          <template #default="{ object }">
            <!-- Item Name -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("RestaurantMenu.itemName") }}*</label>
              <input v-model="object.name[selectedLang]" type="text" placeholder="Item Name"
                :class="sectionsStyle.input" />
              <span v-show="getErrorForMenuItem(object.id, 'name') === true" class="text-error text-sm pt-2 pl-2">{{
                $t('RestaurantMenu.requiredField') }}</span>
            </div>

            <!-- Item Description -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("RestaurantMenu.itemDescription") }}</label>
              <textarea v-model="object.description[selectedLang]" type="text" placeholder="Item Description"
                :class="sectionsStyle.textarea" rows="3"></textarea>
            </div>

            <!-- Item Price -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("RestaurantMenu.itemPrice") }}*</label>
              <input v-model="object.price" type="number" min="0" step="0.01" placeholder="Price"
                :class="sectionsStyle.input" />
              <span v-show="getErrorForMenuItem(object.id, 'price') === true" class="text-error text-sm pt-2 pl-2">{{
                $t('RestaurantMenu.requiredField') }}</span>
            </div>

            <!-- Item Image -->
            <div class="mb-4 mt-4">
              <UploadMedia :media-label="$t('RestaurantMenu.itemImage')" :upload-text="$t('RestaurantMenu.uploadMedia')"
                :change-text="$t('RestaurantMenu.changeMedia')" :seo-tag="$t('RestaurantMenu.seoTag')"
                :media="object.image && Object.keys(object.image).length > 0 ? [object.image] : []"
                @uploadContainerClicked="openMediaModal(object.id, object.image && Object.keys(object.image).length > 0 ? object.image.media_id : null)"
                @removeUploadedImage="removeItemImage(object.id)" />
              <span class="flex text-xs text-Gray_800">{{ $t("RestaurantMenu.itemImageDesc") }}</span>
            </div>

            <!-- Featured Item -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("RestaurantMenu.featuredItem") }}</label>
              <div class="flex items-center">
                <input v-model="object.featured" type="checkbox" class="h-5 w-5 mr-2" />
                <span class="text-xs text-Gray_800">{{ $t("RestaurantMenu.featuredItemDesc") }}</span>
              </div>
            </div>

            <!-- CSS Classes -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("RestaurantMenu.cssClasses") }}</label>
              <span class="text-xs text-Gray_800">{{ $t("RestaurantMenu.cssClassesDesc") }}</span>
              <input v-model="object.classes" type="text" placeholder="CSS Classes" :class="sectionsStyle.input" />
            </div>
          </template>
        </FieldSets>

        <div class="add-button underline cursor-pointer mt-2" @click="addMenuItem(selectedCategoryId)">
          <div class="p3 bold text">{{ $t("RestaurantMenu.addMenuItem") }}</div>
        </div>
      </div>
      <div v-else class="text-center py-4 text-gray-500">
        {{ $t("RestaurantMenu.selectCategoryFirst") }}
      </div>
    </div>

    <!-- General Settings -->
    <div class="flex flex-col items-start justify-start mt-8 pt-8 border-t">
      <h3 class="text-lg font-semibold mb-4">{{ $t("RestaurantMenu.generalSettings") }}</h3>



      <!-- Restaurant Logo -->
      <div class="mb-6">
        <UploadMedia :media-label="$t('RestaurantMenu.restaurantLogo') || 'Restaurant Logo'"
          :upload-text="$t('RestaurantMenu.uploadLogo') || 'Upload Logo'"
          :change-text="$t('RestaurantMenu.changeLogo') || 'Change Logo'" :seo-tag="$t('RestaurantMenu.seoTag')"
          :media="settings[0].logo && Object.keys(settings[0].logo).length > 0 ? [settings[0].logo] : []"
          @uploadContainerClicked="openLogoModal(settings[0].logo && Object.keys(settings[0].logo).length > 0 ? settings[0].logo.media_id : null)"
          @removeUploadedImage="removeLogo()" />
        <span class="flex text-xs text-Gray_800">{{ $t("RestaurantMenu.logoDesc") }}</span>
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("RestaurantMenu.menuTitle") }}</label>
        <input v-model="settings[0].menuTitle[selectedLang]" type="text" placeholder="Menu Title"
          :class="sectionsStyle.input" />
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("RestaurantMenu.menuSubtitle") }}</label>
        <input v-model="settings[0].menuSubtitle[selectedLang]" type="text" placeholder="Menu Subtitle"
          :class="sectionsStyle.input" />
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("RestaurantMenu.currencySymbol") }}</label>
        <input v-model="settings[0].currencySymbol" type="text" placeholder="$" :class="sectionsStyle.input" />
      </div>

      <div class="flex flex-col items-start justify-start mt-8 pt-8 border-t">
        <h3 class="text-lg font-semibold mb-4">{{ $t("RestaurantMenu.taxSettings") }}</h3>

        <div class="flex flex-col items-start justify-start mt-4">
          <div class="flex items-center mb-2">
            <input v-model="settings[0].enableTax" type="checkbox" id="enableTax" class="h-5 w-5 mr-2" />
            <label for="enableTax" class="mr-4 font-medium">
              {{ $t("RestaurantMenu.enableTax") }}
            </label>
          </div>
          <span class="text-xs text-Gray_800 mb-2">
            {{ $t("RestaurantMenu.enableTaxDesc") }}
          </span>
        </div>

        <div v-if="settings[0].enableTax" class="flex flex-col items-start justify-start mt-4">
          <label class="mr-4 font-medium">
            {{ $t("RestaurantMenu.taxRate") }}
          </label>
          <input v-model.number="settings[0].taxRate" type="number" min="0" max="100" step="0.01" placeholder="10.00"
            :class="sectionsStyle.input" />
          <span class="text-xs text-Gray_800">
            {{ $t("RestaurantMenu.taxRateDesc") }}
          </span>
        </div>
      </div>

      <div class="flex flex-col items-start justify-start mt-8 pt-8 border-t">
        <h3 class="text-lg font-semibold mb-4">{{ $t("socialMedia.socialMedia") }}</h3>
        <span class="text-xs text-Gray_800 mb-4">{{ $t("socialMedia.socialMediaDesc") }}</span>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <!-- Instagram -->
          <div class="flex flex-col items-start justify-start">
            <label class="flex items-center mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#E1306C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span class="font-medium">{{ $t("socialMedia.instagram") }}</span>
            </label>
            <input v-model="settings[0].socialMedia.instagram" type="text"
              placeholder="https://instagram.com/yourusername" :class="sectionsStyle.input" />
          </div>

          <!-- Facebook -->
          <div class="flex flex-col items-start justify-start">
            <label class="flex items-center mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#4267B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              <span class="font-medium">{{ $t("socialMedia.facebook") }}</span>
            </label>
            <input v-model="settings[0].socialMedia.facebook" type="text" placeholder="https://facebook.com/yourpage"
              :class="sectionsStyle.input" />
          </div>

          <!-- TikTok -->
          <div class="flex flex-col items-start justify-start">
            <label class="flex items-center mb-1">
              <svg width="24" height="24" fill="black" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12.14 2h2.41c.11 1.2.48 2.21 1.08 3.02a5.57 5.57 0 0 0 3.16 2c.1 0 .22 0 .32.02v2.38a6.5 6.5 0 0 1-3.55-1.07v5.47c0 2.55-1.98 4.75-4.49 5.15a4.77 4.77 0 0 1-5.48-4.71 4.86 4.86 0 0 1 5.56-5.16v2.36a2.42 2.42 0 0 0-2.27 2.54 2.37 2.37 0 0 0 2.71 2.22c1.14-.16 2.01-1.2 2.01-2.38V2z" />
              </svg>
              <span class="font-medium">{{ $t("socialMedia.tiktok") }}</span>
            </label>
            <input v-model="settings[0].socialMedia.tiktok" type="text" placeholder="https://tiktok.com/@yourusername"
              :class="sectionsStyle.input" />
          </div>

          <!-- WhatsApp -->
          <div class="flex flex-col items-start justify-start">
            <div class="flex items-center mb-2">
              <input v-model="settings[0].showWhatsApp" type="checkbox" id="showWhatsApp" class="h-5 w-5 mr-2" />
              <label for="showWhatsApp" class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#22c55e" viewBox="0 0 16 16">
                  <path
                    d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                </svg>
                <span class="font-medium ml-2">{{ $t("socialMedia.whatsapp") }}</span>
              </label>
            </div>

            <div v-if="settings[0].showWhatsApp" class="w-full">
              <input v-model="settings[0].whatsappNumber" type="text" placeholder="+1234567890"
                :class="sectionsStyle.input" class="mb-2" />
              <span class="text-xs text-Gray_800 mb-2 block">{{ $t("socialMedia.whatsappNumberDesc") }}</span>

              <label class="block text-sm font-medium mb-1">{{ $t("socialMedia.whatsappMessage") }}</label>
              <input v-model="settings[0].whatsappMessage[selectedLang]" type="text"
                placeholder="Hello! I would like to reserve a table." :class="sectionsStyle.input" />
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("RestaurantMenu.cssClasses") }}</label>
        <span class="text-xs text-Gray_800">{{ $t("RestaurantMenu.cssClassesDesc") }}</span>
        <input v-model="settings[0].classes" type="text" placeholder="CSS Classes" :class="sectionsStyle.input" />
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import UploadMedia from "@geeks.solutions/nuxt-sections/lib/src/components/Medias/UploadMedia.vue";
import FieldSets from "@geeks.solutions/nuxt-sections/lib/src/components/SectionsForms/FieldSets.vue";
import { sectionsStyle, scrollToFirstError } from "@/utils/constants";
import 'vue-select/dist/vue-select.css';

export default {
  name: 'RestaurantMenu',
  components: { FieldSets, UploadMedia },
  props: {
    selectedLang: {
      type: String,
      default: 'en'
    },
    selectedMedia: {},
    selectedMediaIndex: {
      type: Number,
      default: -1
    },
    locales: {
      type: Array,
      default() {
        return []
      }
    },
    mediaFields: [
      {
        type: 'image',
        name: 'medias' // Changed from 'media' to 'medias'
      }
    ]
  },
  data() {
    return {
      settings: [
        {
          categories: [],
          menuItems: [],
          menuTitle: {},
          menuSubtitle: {},
          currencySymbol: '$',
          classes: '',
          logo: {},
          viewMode: 'list',
          enableTax: true,
          taxRate: 10.00,
          medias: [],
          socialMedia: {
            instagram: '',
            facebook: '',
            tiktok: '',
            twitter: '',
            youtube: ''
          },
          showWhatsApp: false,
          whatsappNumber: '',
          whatsappMessage: {}
        }
      ],
      errors: {
        categories: [],
        menuItems: []
      },
      currentMediaItemId: null,
      currentMediaType: null, // To track what kind of media we're uploading
      currentCategoryId: null,
      selectedCategoryId: '',
      sectionsStyle
    }
  },
  watch: {
    selectedMedia(mediaObject) {
      if (!mediaObject) return;

      const media = {
        media_id: "",
        url: "",
        seo_tag: "",
        filename: "",
        headers: {}
      };

      media.media_id = mediaObject.id;
      media.url = mediaObject.files[0].url;
      media.seo_tag = mediaObject.seo_tag;
      media.filename = mediaObject.files[0].filename;

      if (mediaObject.files[0].headers) {
        media.headers = mediaObject.files[0].headers;
      }

      // Handle different media types
      if (this.currentMediaType === 'logo') {
        // Update restaurant logo
        this.$set(this.settings[0], 'logo', media);
      } else if (this.currentMediaType === 'categoryIcon') {
        // Update category icon
        const categoryIndex = this.settings[0].categories.findIndex(cat => cat.id === this.currentCategoryId);
        if (categoryIndex !== -1) {
          this.$set(this.settings[0].categories[categoryIndex], 'icon', media);
        }
      } else if (this.currentMediaType === 'menuItem') {
        // Handle menu item image (existing functionality)
        const itemIndex = this.settings[0].menuItems.findIndex(item => item.id === this.currentMediaItemId);
        if (itemIndex !== -1) {
          this.$set(this.settings[0].menuItems[itemIndex], 'image', media);
        }
      }

      // Add to the medias array for content linking
      this.updateMediasArray(media);

      this.$emit('closeMediaModal');
      this.resetMediaState();
    },
    settings: {
      handler(value) {
        if (value[0].categories) {
          // Initialize errors object when categories change
          this.errors.categories = value[0].categories.map(() => ({ name: false }));

          // Initialize selectedCategoryId if not set and we have categories
          if (!this.selectedCategoryId && value[0].categories.length > 0) {
            this.selectedCategoryId = value[0].categories[0].id;
          }
        }

        if (value[0].menuItems) {
          // Update menu item errors
          this.errors.menuItems = value[0].menuItems.map(item => ({
            id: item.id,
            name: false,
            price: false
          }));
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // Initialize localized fields
    this.initializeLocalizedFields();

    // Initialize medias array with existing media items
    this.initializeMediasArray();

    // Ensure socialMedia object exists and has all platforms
    if (!this.settings[0].socialMedia) {
      this.$set(this.settings[0], 'socialMedia', {
        instagram: '',
        facebook: '',
        tiktok: '',
        twitter: '',
        youtube: ''
      });
    } else {
      // Ensure all platforms exist
      const platforms = ['instagram', 'facebook', 'tiktok', 'twitter', 'youtube'];
      platforms.forEach(platform => {
        if (typeof this.settings[0].socialMedia[platform] === 'undefined') {
          this.$set(this.settings[0].socialMedia, platform, '');
        }
      });
    }

    // Set WhatsApp properties if not already defined
    if (typeof this.settings[0].showWhatsApp === 'undefined') {
      this.$set(this.settings[0], 'showWhatsApp', false);
    }

    if (!this.settings[0].whatsappNumber) {
      this.$set(this.settings[0], 'whatsappNumber', '');
    }

    if (!this.settings[0].whatsappMessage) {
      this.$set(this.settings[0], 'whatsappMessage', {});
    }

    // Initialize whatsappMessage for all locales
    this.locales.forEach(locale => {
      if (!this.settings[0].whatsappMessage[locale]) {
        this.$set(this.settings[0].whatsappMessage, locale, 'Hello! I would like to reserve a table.');
      }
    });
  },
  methods: {
    // Method to update the medias array
    updateMediasArray(media) {
      if (!media || !media.media_id) return;

      // Remove any existing entry with the same ID
      const existingIndex = this.settings[0].medias.findIndex(m => m.media_id === media.media_id);
      if (existingIndex !== -1) {
        this.settings[0].medias.splice(existingIndex, 1);
      }

      // Add the new media
      this.settings[0].medias.push(media);
    },

    // Method to remove from medias array
    removeFromMediasArray(mediaId) {
      if (!mediaId) return;

      // Remove media with the given ID
      this.settings[0].medias = this.settings[0].medias.filter(m => m.media_id !== mediaId);
    },

    // Initialize the medias array with existing media references
    initializeMediasArray() {
      // Clear existing medias array
      this.settings[0].medias = [];

      // Add logo if it exists
      if (this.settings[0].logo && this.settings[0].logo.media_id) {
        this.settings[0].medias.push(this.settings[0].logo);
      }

      // Add category icons
      if (this.settings[0].categories) {
        this.settings[0].categories.forEach(category => {
          if (category.icon && category.icon.media_id) {
            this.settings[0].medias.push(category.icon);
          }
        });
      }

      // Add menu item images
      if (this.settings[0].menuItems) {
        this.settings[0].menuItems.forEach(item => {
          if (item.image && item.image.media_id) {
            this.settings[0].medias.push(item.image);
          }
        });
      }
    },

    resetMediaState() {
      this.currentMediaItemId = null;
      this.currentCategoryId = null;
      this.currentMediaType = null;
    },
    openMediaModal(itemId, mediaId) {
      this.$emit('openMediaModal', mediaId);
      this.$nextTick(() => {
        this.currentMediaItemId = itemId;
        this.currentMediaType = 'menuItem';
      });
    },
    openCategoryIconModal(categoryId, mediaId) {
      this.$emit('openMediaModal', mediaId);
      this.$nextTick(() => {
        this.currentCategoryId = categoryId;
        this.currentMediaType = 'categoryIcon';
      });
    },
    openLogoModal(mediaId) {
      this.$emit('openMediaModal', mediaId);
      this.$nextTick(() => {
        this.currentMediaType = 'logo';
      });
    },
    removeLogo() {
      if (this.settings[0].logo && this.settings[0].logo.media_id) {
        this.removeFromMediasArray(this.settings[0].logo.media_id);
      }
      this.$set(this.settings[0], 'logo', {});
    },
    removeCategoryIcon(categoryId) {
      const categoryIndex = this.settings[0].categories.findIndex(cat => cat.id === categoryId);
      if (categoryIndex !== -1 && this.settings[0].categories[categoryIndex].icon) {
        const mediaId = this.settings[0].categories[categoryIndex].icon.media_id;
        if (mediaId) {
          this.removeFromMediasArray(mediaId);
        }
        this.$set(this.settings[0].categories[categoryIndex], 'icon', {});
      }
    },
    removeItemImage(itemId) {
      const itemIndex = this.settings[0].menuItems.findIndex(item => item.id === itemId);
      if (itemIndex !== -1 && this.settings[0].menuItems[itemIndex].image) {
        const mediaId = this.settings[0].menuItems[itemIndex].image.media_id;
        if (mediaId) {
          this.removeFromMediasArray(mediaId);
        }
        this.settings[0].menuItems[itemIndex].image = {};
      }
    },
    initializeLocalizedFields() {
      // Initialize menuTitle and menuSubtitle for all locales
      if (!this.settings[0].menuTitle) {
        this.settings[0].menuTitle = {};
      }
      if (!this.settings[0].menuSubtitle) {
        this.settings[0].menuSubtitle = {};
      }

      this.locales.forEach(locale => {
        if (!this.settings[0].menuTitle[locale]) {
          this.$set(this.settings[0].menuTitle, locale, '');
        }
        if (!this.settings[0].menuSubtitle[locale]) {
          this.$set(this.settings[0].menuSubtitle, locale, '');
        }
      });
    },
    addCategory() {
      const category = {
        id: uuidv4(),
        name: {},
        description: {},
        classes: '',
        icon: {}
      };

      // Initialize names for ALL locales
      this.locales.forEach(locale => {
        category.name[locale] = ''
      });

      this.settings[0].categories.push(category);
      this.errors.categories.push({ name: false });

      // Select the newly created category
      if (this.settings[0].categories.length === 1) {
        this.$nextTick(() => {
          this.selectedCategoryId = category.id;
        });
      }
    },
    removeCategory(idx) {
      const removedCategory = this.settings[0].categories[idx];

      // Remove the category
      this.$set(this.settings[0], 'categories', this.settings[0].categories.filter((ct, i) => idx !== i));

      // Also update errors
      this.errors.categories.splice(idx, 1);

      // Remove all menu items that belong to the deleted category
      if (removedCategory && removedCategory.id) {
        const categoryId = removedCategory.id;
        this.settings[0].menuItems = this.settings[0].menuItems.filter(item => item.categoryId !== categoryId);

        // If we're removing the currently selected category
        if (this.selectedCategoryId === categoryId) {
          // Select the first available category if any
          if (this.settings[0].categories.length > 0) {
            this.selectedCategoryId = this.settings[0].categories[0].id;
          } else {
            this.selectedCategoryId = '';
          }
        }
      }
    },
    addMenuItem(categoryId) {
      if (!categoryId) return;

      const menuItem = {
        id: uuidv4(),
        categoryId,
        name: {},
        description: {},
        price: '',
        image: {},
        featured: false,
        classes: ''
      };

      // Initialize localized fields
      this.locales.forEach(locale => {
        menuItem.name[locale] = '';
        menuItem.description[locale] = '';
      });

      this.settings[0].menuItems.push(menuItem);
      this.errors.menuItems.push({
        id: menuItem.id,
        name: false,
        price: false
      });
    },
    removeMenuItem(itemId) {
      // Find the index of the menu item with this ID
      const idx = this.settings[0].menuItems.findIndex(item => item.id === itemId);
      if (idx === -1) return;

      // Get the media ID before removing the item
      const mediaId = this.settings[0].menuItems[idx].image && this.settings[0].menuItems[idx].image.media_id;
      if (mediaId) {
        this.removeFromMediasArray(mediaId);
      }

      // Remove the menu item
      this.$set(this.settings[0], 'menuItems', this.settings[0].menuItems.filter(item => item.id !== itemId));

      // Also update errors - find the error with this ID
      const errorIdx = this.errors.menuItems.findIndex(err => err.id === itemId);
      if (errorIdx !== -1) {
        this.errors.menuItems.splice(errorIdx, 1);
      }
    },
    getCategoryOptions() {
      if (!this.settings[0].categories) return [];

      return this.settings[0].categories.map(category => {
        // Get the category name in the selected language, fall back to English if not available
        // If neither is available, use a default name with part of the ID for identification
        const displayName = category.name[this.selectedLang] ||
          category.name.en ||
          `Category ${category.id.substring(0, 4)}`;

        return {
          id: category.id,
          name: displayName
        };
      });
    },
    getMenuItemsByCategory(categoryId) {
      if (!categoryId || !this.settings[0].menuItems) return [];

      return this.settings[0].menuItems.filter(item => item.categoryId === categoryId);
    },
    updateMenuItemsForCategory(categoryId, updatedItems) {
      if (!categoryId) return;

      // Get all items that don't belong to this category
      const otherItems = this.settings[0].menuItems.filter(item => item.categoryId !== categoryId);

      // Combine with the updated items for this category
      this.$set(this.settings[0], 'menuItems', [...otherItems, ...updatedItems]);
    },
    getErrorForMenuItem(itemId, field) {
      const error = this.errors.menuItems.find(err => err.id === itemId);
      return error ? error[field] : false;
    },
    validate() {
      let valid = true;

      // Validate categories
      this.settings[0].categories.forEach((category, idx) => {
        // Reset error
        this.errors.categories[idx].name = false;

        // Check for required name
        if (!category.name.en) {
          this.errors.categories[idx].name = true;
          valid = false;
        }
      });

      // Validate menu items
      this.settings[0].menuItems.forEach(item => {
        // Find the error object for this item
        const errorIdx = this.errors.menuItems.findIndex(err => err.id === item.id);
        if (errorIdx === -1) return;

        // Reset errors
        this.errors.menuItems[errorIdx].name = false;
        this.errors.menuItems[errorIdx].price = false;

        // Check for required fields
        if (!item.name.en) {
          this.errors.menuItems[errorIdx].name = true;
          valid = false;
        }

        if (!item.price && item.price !== 0) {
          this.errors.menuItems[errorIdx].price = true;
          valid = false;
        }
      });

      // Clean up media objects
      this.settings[0].menuItems.forEach(item => {
        if (item.image && (Object.keys(item.image).length === 0 || !item.image.media_id || !item.image.url)) {
          delete item.image;
        }
      });

      // Clean up category icon objects
      this.settings[0].categories.forEach(category => {
        if (category.icon && (Object.keys(category.icon).length === 0 || !category.icon.media_id || !category.icon.url)) {
          delete category.icon;
        }
      });

      // Clean up logo
      if (this.settings[0].logo && (Object.keys(this.settings[0].logo).length === 0 || !this.settings[0].logo.media_id || !this.settings[0].logo.url)) {
        delete this.settings[0].logo;
      }

      if (!valid) {
        this.$root.$emit("toast", {
          type: "Error",
          message: this.$t("fill-required-fields")
        });
        scrollToFirstError(this.errors);
      }

      return valid;
    }
  }
}
</script>

<style>
.content-wrapper {
  overflow-x: hidden;
}
</style>
