<template>
  <div class="p-4">
    <div class="flex flex-col items-start justify-start mt-4">
      <label class="mr-4 font-medium">{{ $t("ServicePackages.viewMode") || "View Mode" }}</label>
      <div class="flex items-center mt-2">
        <label class="flex items-center cursor-pointer mr-4">
          <input type="radio" v-model="settings[0].viewMode" value="list" class="mr-2 h-[20px] w-[20px]" />
          <span>{{ $t("ServicePackages.listView") || "List View" }}</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input type="radio" v-model="settings[0].viewMode" value="category" class="mr-2 h-[20px] w-[20px]" />
          <span>{{ $t("ServicePackages.categoryView") || "Category View" }}</span>
        </label>
      </div>
      <span class="text-xs text-Gray_800 mt-1">{{ $t("ServicePackages.viewModeDesc") || "Choose how to display your service packages" }}</span>
    </div>

    <!-- Business Type Section -->
    <div class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 font-medium">{{ $t("ServicePackages.businessType") || "Business Type" }}</label>
      <div class="flex items-center mt-2">
        <label class="flex items-center cursor-pointer mr-4">
          <input type="radio" v-model="settings[0].businessType" value="travel" class="mr-2 h-[20px] w-[20px]" />
          <span>{{ $t("ServicePackages.travelAgency") || "Travel Agency" }}</span>
        </label>
        <label class="flex items-center cursor-pointer mr-4">
          <input type="radio" v-model="settings[0].businessType" value="spa" class="mr-2 h-[20px] w-[20px]" />
          <span>{{ $t("ServicePackages.spa") || "Spa" }}</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input type="radio" v-model="settings[0].businessType" value="salon" class="mr-2 h-[20px] w-[20px]" />
          <span>{{ $t("ServicePackages.salon") || "Salon" }}</span>
        </label>
      </div>
      <span class="text-xs text-Gray_800 mt-1">{{ $t("ServicePackages.businessTypeDesc") || "Select your business type for specialized features" }}</span>
    </div>

    <!-- Categories Section -->
    <div id="categories" class="flex flex-col mt-8 pt-4 border-t">
      <h3 class="text-lg font-semibold mb-4">{{ $t("ServicePackages.categories") || "Categories" }}</h3>
      <span class="text-xs text-Gray_800 mb-4">{{ $t("ServicePackages.categoriesDesc") || "Define the categories for your services" }}</span>

      <FieldSets :array-data-pop="settings[0].categories" :fieldset-group="'categories'"
        :legend-label="$t('ServicePackages.category') || 'Category'" @array-updated="(data) => $set(settings[0], 'categories', data)"
        @remove-fieldset="(object, idx) => removeCategory(idx)">
        <template #default="{ object, idx }">
          <div class="flex flex-col items-start justify-start mt-4">
            <label class="mr-4 font-medium">{{ $t("ServicePackages.categoryName") || "Category Name" }}*</label>
            <input v-model="object.name[selectedLang]" type="text" placeholder="Category Name"
              :class="sectionsStyle.input" />
            <span v-show="errors.categories[idx].name === true" class="text-error text-sm pt-2 pl-2">{{
              $t('ServicePackages.requiredField') || "Required field" }}</span>
          </div>

          <!-- Category Icon -->
          <div class="mb-4 mt-4">
            <UploadMedia :media-label="$t('ServicePackages.categoryIcon') || 'Category Icon'" 
              :upload-text="$t('ServicePackages.uploadIcon') || 'Upload Icon'"
              :change-text="$t('ServicePackages.changeIcon') || 'Change Icon'" 
              :seo-tag="$t('ServicePackages.seoTag') || 'SEO Tag'"
              :media="object.icon && Object.keys(object.icon).length > 0 ? [object.icon] : []"
              @uploadContainerClicked="openCategoryIconModal(object.id, object.icon && Object.keys(object.icon).length > 0 ? object.icon.media_id : null)"
              @removeUploadedImage="removeCategoryIcon(object.id)" />
            <span class="flex text-xs text-Gray_800">{{ $t("ServicePackages.categoryIconDesc") || "Upload an icon to represent this category" }}</span>
          </div>

          <div class="flex flex-col items-start justify-start mt-4">
            <label class="mr-4 font-medium">{{ $t("ServicePackages.categoryDescription") || "Category Description" }}</label>
            <textarea v-model="object.description[selectedLang]" type="text" placeholder="Category Description"
              :class="sectionsStyle.textarea" rows="3"></textarea>
          </div>

          <div class="flex flex-col items-start justify-start mt-4">
            <label class="mr-4 font-medium">{{ $t("ServicePackages.cssClasses") || "CSS Classes" }}</label>
            <span class="text-xs text-Gray_800">{{ $t("ServicePackages.cssClassesDesc") || "Add custom CSS classes for styling" }}</span>
            <input v-model="object.classes" type="text" placeholder="CSS Classes" :class="sectionsStyle.input" />
          </div>

          <div class="flex flex-col items-start justify-start mt-4">
            <label class="mr-4 font-medium">{{ $t("ServicePackages.displayOrder") || "Display Order" }}</label>
            <input v-model="object.order" type="number" min="0" placeholder="Display Order"
              :class="sectionsStyle.input" />
          </div>
        </template>
      </FieldSets>

      <div class="add-button underline cursor-pointer mt-2" @click="addCategory()">
        <div class="p3 bold text">{{ $t("ServicePackages.addCategory") || "Add Category" }}</div>
      </div>
    </div>

    <!-- Service Items Section -->
    <div id="service-items" class="flex flex-col mt-8 pt-8 border-t">
      <h3 class="text-lg font-semibold mb-4">{{ $t("ServicePackages.serviceItems") || "Service Items" }}</h3>
      <span class="text-xs text-Gray_800 mb-4">{{ $t("ServicePackages.serviceItemsDesc") || "Add services or packages to your categories" }}</span>

      <!-- Category Selector for Service Items -->
      <div class="flex flex-col items-start justify-start mb-6">
        <label class="mr-4 font-medium mb-2">{{ $t("ServicePackages.selectCategory") || "Select Category" }}</label>
        <gAutoComplete :main-filter="selectedCategoryId" :placeholder="$t('ServicePackages.selectCategory') || 'Select Category'"
          :filter-label-prop="'name'" :reduce="(option) => option.id" :filter-options="getCategoryOptions()"
          :filter-searchable="true" :close-on-select="true" :filter-clearable="true" :track-by="'id'"
          @itemSelected="(val) => { selectedCategoryId = val; }">
        </gAutoComplete>
      </div>

      <div v-if="selectedCategoryId">
        <FieldSets :array-data-pop="getServiceItemsByCategory(selectedCategoryId)" :fieldset-group="'serviceItems'"
          :legend-label="$t('ServicePackages.serviceItem') || 'Service Item'"
          @array-updated="(data) => updateServiceItemsForCategory(selectedCategoryId, data)"
          @remove-fieldset="(object, idx) => removeServiceItem(object.id)">
          <template #default="{ object, idx }">
            <!-- Item Name -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("ServicePackages.itemName") || "Item Name" }}*</label>
              <input v-model="object.name[selectedLang]" type="text" placeholder="Item Name"
                :class="sectionsStyle.input" />
              <span v-show="getErrorForServiceItem(object.id, 'name') === true" class="text-error text-sm pt-2 pl-2">{{
                $t('ServicePackages.requiredField') || "Required field" }}</span>
            </div>

            <!-- Item Description -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("ServicePackages.itemDescription") || "Item Description" }}</label>
              <textarea v-model="object.description[selectedLang]" type="text" placeholder="Item Description"
                :class="sectionsStyle.textarea" rows="3"></textarea>
            </div>

            <!-- Item Price -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("ServicePackages.itemPrice") || "Item Price" }}*</label>
              <input v-model="object.price" type="number" min="0" step="0.01" placeholder="Price"
                :class="sectionsStyle.input" />
              <span v-show="getErrorForServiceItem(object.id, 'price') === true" class="text-error text-sm pt-2 pl-2">{{
                $t('ServicePackages.requiredField') || "Required field" }}</span>
            </div>

            <!-- Item Duration -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("ServicePackages.itemDuration") || "Duration" }}</label>
              <input v-model="object.duration" type="text" placeholder="e.g. 1 hour, 3 days"
                :class="sectionsStyle.input" />
            </div>

            <!-- Item Details (for bullet points) -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("ServicePackages.itemDetails") || "Item Details" }}</label>
              <span class="text-xs text-Gray_800 mb-2">{{ $t("ServicePackages.itemDetailsDesc") || "Add bullet points to describe the service (one per line)" }}</span>
              <textarea v-model="objectDetailsText" type="text" placeholder="One detail per line"
                :class="sectionsStyle.textarea" rows="4" @input="updateObjectDetails(object)"></textarea>
            </div>

            <!-- Item Image -->
            <div class="mb-4 mt-4">
              <UploadMedia :media-label="$t('ServicePackages.itemImage') || 'Item Image'" 
                :upload-text="$t('ServicePackages.uploadMedia') || 'Upload Image'"
                :change-text="$t('ServicePackages.changeMedia') || 'Change Image'" 
                :seo-tag="$t('ServicePackages.seoTag') || 'SEO Tag'"
                :media="object.image && Object.keys(object.image).length > 0 ? [object.image] : []"
                @uploadContainerClicked="openMediaModal(object.id, object.image && Object.keys(object.image).length > 0 ? object.image.media_id : null)"
                @removeUploadedImage="removeItemImage(object.id)" />
              <span class="flex text-xs text-Gray_800">{{ $t("ServicePackages.itemImageDesc") || "Upload an image representing this service" }}</span>
            </div>

            <!-- Availability -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("ServicePackages.availability") || "Availability" }}</label>
              <div class="flex items-center mt-2">
                <select v-model="object.availability" :class="sectionsStyle.input">
                  <option value="available">{{ $t("ServicePackages.fullyAvailable") || "Fully Available" }}</option>
                  <option value="limited">{{ $t("ServicePackages.limitedAvailability") || "Limited Availability" }}</option>
                </select>
              </div>
            </div>

            <!-- Featured Item -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("ServicePackages.featuredItem") || "Featured Item" }}</label>
              <div class="flex items-center">
                <input v-model="object.featured" type="checkbox" class="h-5 w-5 mr-2" />
                <span class="text-xs text-Gray_800">{{ $t("ServicePackages.featuredItemDesc") || "Highlight this as a featured service" }}</span>
              </div>
            </div>

            <!-- CSS Classes -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("ServicePackages.cssClasses") || "CSS Classes" }}</label>
              <span class="text-xs text-Gray_800">{{ $t("ServicePackages.cssClassesDesc") || "Add custom CSS classes for styling" }}</span>
              <input v-model="object.classes" type="text" placeholder="CSS Classes" :class="sectionsStyle.input" />
            </div>
          </template>
        </FieldSets>

        <div class="add-button underline cursor-pointer mt-2" @click="addServiceItem(selectedCategoryId)">
          <div class="p3 bold text">{{ $t("ServicePackages.addServiceItem") || "Add Service Item" }}</div>
        </div>
      </div>
      <div v-else class="text-center py-4 text-gray-500">
        {{ $t("ServicePackages.selectCategoryFirst") || "Please select a category first" }}
      </div>
    </div>

    <!-- General Settings -->
    <div class="flex flex-col items-start justify-start mt-8 pt-8 border-t">
      <h3 class="text-lg font-semibold mb-4">{{ $t("ServicePackages.generalSettings") || "General Settings" }}</h3>

      <!-- Business Logo -->
      <div class="mb-6">
        <UploadMedia :media-label="$t('ServicePackages.businessLogo') || 'Business Logo'"
          :upload-text="$t('ServicePackages.uploadLogo') || 'Upload Logo'"
          :change-text="$t('ServicePackages.changeLogo') || 'Change Logo'" 
          :seo-tag="$t('ServicePackages.seoTag') || 'SEO Tag'"
          :media="settings[0].logo && Object.keys(settings[0].logo).length > 0 ? [settings[0].logo] : []"
          @uploadContainerClicked="openLogoModal(settings[0].logo && Object.keys(settings[0].logo).length > 0 ? settings[0].logo.media_id : null)"
          @removeUploadedImage="removeLogo()" />
        <span class="flex text-xs text-Gray_800">{{ $t("ServicePackages.logoDesc") || "Upload your business logo" }}</span>
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("ServicePackages.pageTitle") || "Page Title" }}</label>
        <input v-model="settings[0].pageTitle[selectedLang]" type="text" placeholder="Page Title"
          :class="sectionsStyle.input" />
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("ServicePackages.pageSubtitle") || "Page Subtitle" }}</label>
        <input v-model="settings[0].pageSubtitle[selectedLang]" type="text" placeholder="Page Subtitle"
          :class="sectionsStyle.input" />
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("ServicePackages.currencySymbol") || "Currency Symbol" }}</label>
        <input v-model="settings[0].currencySymbol" type="text" placeholder="$" :class="sectionsStyle.input" />
      </div>

      <div class="flex flex-col items-start justify-start mt-8 pt-8 border-t">
        <h3 class="text-lg font-semibold mb-4">{{ $t("ServicePackages.feeSettings") || "Fee Settings" }}</h3>

        <div class="flex flex-col items-start justify-start mt-4">
          <div class="flex items-center mb-2">
            <input v-model="settings[0].enableTax" type="checkbox" id="enableTax" class="h-5 w-5 mr-2" />
            <label for="enableTax" class="mr-4 font-medium">
              {{ $t("ServicePackages.enableTax") || "Enable Tax" }}
            </label>
          </div>
          <span class="text-xs text-Gray_800 mb-2">
            {{ $t("ServicePackages.enableTaxDesc") || "Enable tax calculation for bookings" }}
          </span>
        </div>

        <div v-if="settings[0].enableTax" class="flex flex-col items-start justify-start mt-4">
          <label class="mr-4 font-medium">
            {{ $t("ServicePackages.taxRate") || "Tax Rate (%)" }}
          </label>
          <input v-model.number="settings[0].taxRate" type="number" min="0" max="100" step="0.01" placeholder="10.00"
            :class="sectionsStyle.input" />
          <span class="text-xs text-Gray_800">
            {{ $t("ServicePackages.taxRateDesc") || "Percentage of tax applied to bookings" }}
          </span>
        </div>

        <div class="flex flex-col items-start justify-start mt-4">
          <div class="flex items-center mb-2">
            <input v-model="settings[0].enableServiceFee" type="checkbox" id="enableServiceFee" class="h-5 w-5 mr-2" />
            <label for="enableServiceFee" class="mr-4 font-medium">
              {{ $t("ServicePackages.enableServiceFee") || "Enable Service Fee" }}
            </label>
          </div>
          <span class="text-xs text-Gray_800 mb-2">
            {{ $t("ServicePackages.enableServiceFeeDesc") || "Apply a service fee to bookings" }}
          </span>
        </div>

        <div v-if="settings[0].enableServiceFee" class="flex flex-col items-start justify-start mt-4">
          <label class="mr-4 font-medium">
            {{ $t("ServicePackages.serviceFeeRate") || "Service Fee Rate (%)" }}
          </label>
          <input v-model.number="settings[0].serviceFeeRate" type="number" min="0" max="100" step="0.01" placeholder="5.00"
            :class="sectionsStyle.input" />
          <span class="text-xs text-Gray_800">
            {{ $t("ServicePackages.serviceFeeRateDesc") || "Percentage of service fee applied to bookings" }}
          </span>
        </div>
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("ServicePackages.cssClasses") || "CSS Classes" }}</label>
        <span class="text-xs text-Gray_800">{{ $t("ServicePackages.cssClassesDesc") || "Add custom CSS classes for styling" }}</span>
        <input v-model="settings[0].classes" type="text" placeholder="CSS Classes" :class="sectionsStyle.input" />
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("ServicePackages.backgroundColor") || "Background Color" }}</label>
        <input v-model="settings[0].backgroundColor" type="color" :class="sectionsStyle.input" />
        <span class="text-xs text-Gray_800">{{ $t("ServicePackages.backgroundColorDesc") || "Set the background color for the services page" }}</span>
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
  name: 'ServicePackages',
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
        name: 'media'
      }
    ]
  },
  data() {
    return {
      settings: [
        {
          categories: [],
          serviceItems: [],
          pageTitle: {},
          pageSubtitle: {},
          currencySymbol: '$',
          classes: '',
          logo: {},
          backgroundColor: '#ffffff',
          viewMode: 'list',
          businessType: 'travel', // travel, spa, or salon
          enableTax: true,
          taxRate: 10.00,
          enableServiceFee: true,
          serviceFeeRate: 5.00
        }
      ],
      errors: {
        categories: [],
        serviceItems: []
      },
      objectDetailsText: '', // For managing item details textarea
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
        // Update business logo
        this.$set(this.settings[0], 'logo', media);
      } else if (this.currentMediaType === 'categoryIcon') {
        // Update category icon
        const categoryIndex = this.settings[0].categories.findIndex(cat => cat.id === this.currentCategoryId);
        if (categoryIndex !== -1) {
          this.$set(this.settings[0].categories[categoryIndex], 'icon', media);
        }
      } else if (this.currentMediaType === 'serviceItem') {
        // Handle service item image
        const itemIndex = this.settings[0].serviceItems.findIndex(item => item.id === this.currentMediaItemId);
        if (itemIndex !== -1) {
          this.$set(this.settings[0].serviceItems[itemIndex], 'image', media);
        }
      }

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

        if (value[0].serviceItems) {
          // Update service item errors
          this.errors.serviceItems = value[0].serviceItems.map(item => ({
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
    // Initialize with empty category and service item
    if (this.settings[0].categories.length === 0) {
      this.addCategory();
    } else {
      // Select the first category and store its ID
      const firstCategory = this.settings[0].categories[0];
      this.selectedCategoryId = firstCategory.id;
    }

    // Initialize localized fields
    this.initializeLocalizedFields();
  },
  methods: {
    resetMediaState() {
      this.currentMediaItemId = null;
      this.currentCategoryId = null;
      this.currentMediaType = null;
    },
    openMediaModal(itemId, mediaId) {
      this.$emit('openMediaModal', mediaId);
      this.$nextTick(() => {
        this.currentMediaItemId = itemId;
        this.currentMediaType = 'serviceItem';
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
      this.$set(this.settings[0], 'logo', {});
    },
    removeCategoryIcon(categoryId) {
      const categoryIndex = this.settings[0].categories.findIndex(cat => cat.id === categoryId);
      if (categoryIndex !== -1) {
        this.$set(this.settings[0].categories[categoryIndex], 'icon', {});
      }
    },
    initializeLocalizedFields() {
      // Initialize pageTitle and pageSubtitle for all locales
      if (!this.settings[0].pageTitle) {
        this.settings[0].pageTitle = {};
      }
      if (!this.settings[0].pageSubtitle) {
        this.settings[0].pageSubtitle = {};
      }

      this.locales.forEach(locale => {
        if (!this.settings[0].pageTitle[locale]) {
          this.settings[0].pageTitle[locale] = '';
        }
        if (!this.settings[0].pageSubtitle[locale]) {
          this.settings[0].pageSubtitle[locale] = '';
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

      // Remove all service items that belong to the deleted category
      if (removedCategory && removedCategory.id) {
        const categoryId = removedCategory.id;
        this.settings[0].serviceItems = this.settings[0].serviceItems.filter(item => item.categoryId !== categoryId);

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
    updateObjectDetails(object) {
      // Convert textarea content to array of localized objects
      const lines = this.objectDetailsText.split('\n').filter(line => line.trim() !== '');
      
      if (!object.details) {
        this.$set(object, 'details', []);
      }
      
      object.details = lines.map(line => {
        const detailObj = {};
        this.locales.forEach(locale => {
          detailObj[locale] = line;
        });
        return detailObj;
      });
    },
    addServiceItem(categoryId) {
      if (!categoryId) return;

      const serviceItem = {
        id: uuidv4(),
        categoryId: categoryId,
        name: {},
        description: {},
        price: '',
        duration: '',
        image: {},
        details: [],
        availability: 'available',
        featured: false,
        classes: ''
      };

      // Initialize localized fields
      this.locales.forEach(locale => {
        serviceItem.name[locale] = '';
        serviceItem.description[locale] = '';
      });

      this.settings[0].serviceItems.push(serviceItem);
      this.errors.serviceItems.push({
        id: serviceItem.id,
        name: false,
        price: false
      });
      
      // Reset the details text area when adding a new item
      this.objectDetailsText = '';
    },
    removeServiceItem(itemId) {
      // Find the index of the service item with this ID
      const idx = this.settings[0].serviceItems.findIndex(item => item.id === itemId);
      if (idx === -1) return;

      // Remove the service item
      this.$set(this.settings[0], 'serviceItems', this.settings[0].serviceItems.filter(item => item.id !== itemId));

      // Also update errors - find the error with this ID
      const errorIdx = this.errors.serviceItems.findIndex(err => err.id === itemId);
      if (errorIdx !== -1) {
        this.errors.serviceItems.splice(errorIdx, 1);
      }
    },
    removeItemImage(itemId) {
      const itemIndex = this.settings[0].serviceItems.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        this.settings[0].serviceItems[itemIndex].image = {};
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
    getServiceItemsByCategory(categoryId) {
      if (!categoryId || !this.settings[0].serviceItems) return [];

      const items = this.settings[0].serviceItems.filter(item => item.categoryId === categoryId);
      
      // For newly loaded items, set the details text area
      if (items.length > 0 && items[0].details && items[0].details.length > 0) {
        // Set the details text from the first available language
        this.objectDetailsText = items[0].details
          .map(detail => detail[this.selectedLang] || detail['en'] || '')
          .join('\n');
      } else {
        this.objectDetailsText = '';
      }
      
      return items;
    },
    updateServiceItemsForCategory(categoryId, updatedItems) {
      if (!categoryId) return;

      // Get all items that don't belong to this category
      const otherItems = this.settings[0].serviceItems.filter(item => item.categoryId !== categoryId);

      // Combine with the updated items for this category
      this.$set(this.settings[0], 'serviceItems', [...otherItems, ...updatedItems]);
    },
    getErrorForServiceItem(itemId, field) {
      const error = this.errors.serviceItems.find(err => err.id === itemId);
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

      // Validate service items
      this.settings[0].serviceItems.forEach(item => {
        // Find the error object for this item
        const errorIdx = this.errors.serviceItems.findIndex(err => err.id === item.id);
        if (errorIdx === -1) return;

        // Reset errors
        this.errors.serviceItems[errorIdx].name = false;
        this.errors.serviceItems[errorIdx].price = false;

        // Check for required fields
        if (!item.name.en) {
          this.errors.serviceItems[errorIdx].name = true;
          valid = false;
        }

        if (!item.price && item.price !== 0) {
          this.errors.serviceItems[errorIdx].price = true;
          valid = false;
        }
      });

      // Clean up media objects
      this.settings[0].serviceItems.forEach(item => {
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
          message: this.$t("fill-required-fields") || "Please fill all required fields"
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