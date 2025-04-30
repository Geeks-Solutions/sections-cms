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

          <div class="flex flex-col items-start justify-start mt-4">
            <label class="mr-4 font-medium">{{ $t("RestaurantMenu.displayOrder") }}</label>
            <input v-model="object.order" type="number" min="0" placeholder="Display Order"
              :class="sectionsStyle.input" />
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
          :filter-label-prop="'name'" :reduce="(option) => option.id" :filter-options="getCategoryOptions()"
          :filter-searchable="true" :close-on-select="true" :filter-clearable="true" :track-by="'id'"
          @itemSelected="(val) => { selectedCategoryId = val; }">
        </gAutoComplete>
      </div>

      <div v-if="selectedCategoryId">
        <FieldSets :array-data-pop="getMenuItemsByCategory(selectedCategoryId)" :fieldset-group="'menuItems'"
          :legend-label="$t('RestaurantMenu.menuItem')"
          @array-updated="(data) => updateMenuItemsForCategory(selectedCategoryId, data)"
          @remove-fieldset="(object, idx) => removeMenuItem(object.id)">
          <template #default="{ object, idx }">
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

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("RestaurantMenu.cssClasses") }}</label>
        <span class="text-xs text-Gray_800">{{ $t("RestaurantMenu.cssClassesDesc") }}</span>
        <input v-model="settings[0].classes" type="text" placeholder="CSS Classes" :class="sectionsStyle.input" />
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("RestaurantMenu.backgroundColor") }}</label>
        <input v-model="settings[0].backgroundColor" type="color" :class="sectionsStyle.input" />
        <span class="text-xs text-Gray_800">{{ $t("RestaurantMenu.backgroundColorDesc") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import UploadMedia from "@geeks.solutions/nuxt-sections/lib/src/components/Medias/UploadMedia.vue";
import FieldSets from "@geeks.solutions/nuxt-sections/lib/src/components/SectionsForms/FieldSets.vue";
import { sectionsStyle, scrollToFirstError } from "@/utils/constants";
import 'vue-select/dist/vue-select.css';
import { v4 as uuidv4 } from 'uuid';

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
          backgroundColor: '#ffffff',
          viewMode: 'list',
          enableTax: true,
          taxRate: 10.00,
          medias: [] // Added this array to track all media references
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
    // Initialize with empty category and menu item
    if (this.settings[0].categories.length === 0) {
      this.addCategory();
    } else {
      // Select the first category and store its ID
      const firstCategory = this.settings[0].categories[0];
      this.selectedCategoryId = firstCategory.id;

      // Log the selected category name for debugging
      const categoryName = firstCategory.name[this.selectedLang] ||
        firstCategory.name['en'] ||
        `Category ${firstCategory.id.substring(0, 4)}`;
      console.log("Selected category:", categoryName);
    }

    // Initialize localized fields
    this.initializeLocalizedFields();

    // Initialize medias array with existing media items
    this.initializeMediasArray();
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
          this.settings[0].menuTitle[locale] = '';
        }
        if (!this.settings[0].menuSubtitle[locale]) {
          this.settings[0].menuSubtitle[locale] = '';
        }
      });
    },
    addCategory() {
      const category = {
        id: uuidv4(),
        name: {},
        description: {},
        classes: '',
        order: this.settings[0].categories.length,
        icon: {}
      };

      // Initialize localized fields
      this.locales.forEach(locale => {
        category.name[locale] = '';
        category.description[locale] = '';
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
        categoryId: categoryId,
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
          category.name['en'] ||
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