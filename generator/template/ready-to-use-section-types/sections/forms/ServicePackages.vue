<template>
  <div class="p-4">
    <div class="flex flex-col items-start justify-start mt-4">
      <label class="mr-4 font-medium">{{ $t("ServicePackages.viewMode") }}</label>
      <div class="flex items-center mt-2">
        <label class="flex items-center cursor-pointer mr-4">
          <input type="radio" v-model="settings[0].viewMode" value="list" class="mr-2 h-[20px] w-[20px]" />
          <span>{{ $t("ServicePackages.listView") }}</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input type="radio" v-model="settings[0].viewMode" value="category" class="mr-2 h-[20px] w-[20px]" />
          <span>{{ $t("ServicePackages.categoryView") }}</span>
        </label>
      </div>
      <span class="text-xs text-Gray_800 mt-1">{{ $t("ServicePackages.viewModeDesc") }}</span>
    </div>

    <!-- Business Type Section -->
    <div class="flex flex-col items-start justify-start mt-8">
      <label class="mr-4 font-medium">{{ $t("ServicePackages.businessType") }}</label>
      <div class="flex items-center mt-2">
        <label class="flex items-center cursor-pointer mr-4">
          <input type="radio" v-model="settings[0].businessType" value="travel" class="mr-2 h-[20px] w-[20px]" />
          <span>{{ $t("ServicePackages.travelAgency") }}</span>
        </label>
        <label class="flex items-center cursor-pointer mr-4">
          <input type="radio" v-model="settings[0].businessType" value="spa" class="mr-2 h-[20px] w-[20px]" />
          <span>{{ $t("ServicePackages.spa") }}</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input type="radio" v-model="settings[0].businessType" value="salon" class="mr-2 h-[20px] w-[20px]" />
          <span>{{ $t("ServicePackages.salon") }}</span>
        </label>
      </div>
      <span class="text-xs text-Gray_800 mt-1">{{ $t("ServicePackages.businessTypeDesc") }}</span>
    </div>

    <!-- Categories Section -->
    <div id="categories" class="flex flex-col mt-8 pt-4 border-t">
      <h3 class="text-lg font-semibold mb-4">{{ $t("ServicePackages.categories") }}</h3>
      <span class="text-xs text-Gray_800 mb-4">{{ $t("ServicePackages.categoriesDesc") }}</span>

      <FieldSets :array-data-pop="settings[0].categories" :fieldset-group="'categories'"
        :legend-label="$t('ServicePackages.category') || 'Category'"
        @array-updated="(data) => $set(settings[0], 'categories', data)"
        @remove-fieldset="(object, idx) => removeCategory(idx)">
        <template #default="{ object, idx }">
          <div class="flex flex-col items-start justify-start mt-4">
            <label class="mr-4 font-medium">{{ $t("ServicePackages.categoryName") }}*</label>
            <input v-model="object.name[selectedLang]" type="text" placeholder="Category Name"
              :class="sectionsStyle.input" />
            <span v-show="errors.categories[idx].name === true" class="text-error text-sm pt-2 pl-2">{{
              $t('ServicePackages.requiredField') }}</span>
          </div>

          <!-- Category Icon -->
          <div class="mb-4 mt-4">
            <UploadMedia :media-label="$t('ServicePackages.categoryIcon')"
              :upload-text="$t('ServicePackages.uploadIcon')" :change-text="$t('ServicePackages.changeIcon')"
              :seo-tag="$t('ServicePackages.seoTag')"
              :media="object.icon && Object.keys(object.icon).length > 0 ? [object.icon] : []"
              @uploadContainerClicked="openCategoryIconModal(object.id, object.icon && Object.keys(object.icon).length > 0 ? object.icon.media_id : null)"
              @removeUploadedImage="removeCategoryIcon(object.id)" />
            <span class="flex text-xs text-Gray_800">{{ $t("ServicePackages.categoryIconDesc") }}</span>
          </div>

          <div class="flex flex-col items-start justify-start mt-4">
            <label class="mr-4 font-medium">{{ $t("ServicePackages.categoryDescription") }}</label>
            <textarea v-model="object.description[selectedLang]" type="text" placeholder="Category Description"
              :class="sectionsStyle.textarea" rows="3"></textarea>
          </div>

          <div class="flex flex-col items-start justify-start mt-4">
            <label class="mr-4 font-medium">{{ $t("ServicePackages.cssClasses") }}</label>
            <span class="text-xs text-Gray_800">{{ $t("ServicePackages.cssClassesDesc") }}</span>
            <input v-model="object.classes" type="text" placeholder="CSS Classes" :class="sectionsStyle.input" />
          </div>

          <div class="flex flex-col items-start justify-start mt-4">
            <label class="mr-4 font-medium">{{ $t("ServicePackages.displayOrder") }}</label>
            <input v-model="object.order" type="number" min="0" placeholder="Display Order"
              :class="sectionsStyle.input" />
          </div>
        </template>
      </FieldSets>

      <div class="add-button underline cursor-pointer mt-2" @click="addCategory()">
        <div class="p3 bold text">{{ $t("ServicePackages.addCategory") }}</div>
      </div>
    </div>

    <!-- Service Items Section -->
    <div id="service-items" class="flex flex-col mt-8 pt-8 border-t">
      <h3 class="text-lg font-semibold mb-4">{{ $t("ServicePackages.serviceItems") }}</h3>
      <span class="text-xs text-Gray_800 mb-4">{{ $t("ServicePackages.serviceItemsDesc") }}</span>

      <!-- Category Selector for Service Items -->
      <div class="flex flex-col items-start justify-start mb-6">
        <label class="mr-4 font-medium mb-2">{{ $t("ServicePackages.selectCategory") }}</label>
        <gAutoComplete :main-filter="selectedCategoryId" :placeholder="$t('ServicePackages.selectCategory')"
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
          <template #default="{ object }">
            <!-- Item Name -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("ServicePackages.itemName") }}*</label>
              <input v-model="object.name[selectedLang]" type="text" placeholder="Item Name"
                :class="sectionsStyle.input" />
              <span v-show="getErrorForServiceItem(object.id, 'name') === true" class="text-error text-sm pt-2 pl-2">{{
                $t('ServicePackages.requiredField') }}</span>
            </div>

            <!-- Item Description -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("ServicePackages.itemDescription") }}</label>
              <textarea v-model="object.description[selectedLang]" type="text" placeholder="Item Description"
                :class="sectionsStyle.textarea" rows="3"></textarea>
            </div>

            <!-- Item Price -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("ServicePackages.itemPrice") }}*</label>
              <input v-model="object.price" type="number" min="0" step="0.01" placeholder="Price"
                :class="sectionsStyle.input" />
              <span v-show="getErrorForServiceItem(object.id, 'price') === true" class="text-error text-sm pt-2 pl-2">{{
                $t('ServicePackages.requiredField') }}</span>
            </div>

            <div class="flex flex-col items-start justify-start mt-4">
              <div class="flex items-center">
                <input v-model="object.hasDiscount" type="checkbox" id="hasDiscount" class="h-5 w-5 mr-2" />
                <label for="hasDiscount" class="mr-4 font-medium">
                  {{ $t("ServicePackages.hasDiscount") }}
                </label>
              </div>
              <span class="text-xs text-Gray_800 mb-2">
                {{ $t("ServicePackages.hasDiscountDesc") }}
              </span>
            </div>

            <!-- Discounted Price (only shows when hasDiscount is checked) -->
            <div v-if="object.hasDiscount" class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("ServicePackages.discountedPrice") }}*</label>
              <input v-model="object.discountedPrice" type="number" min="0" step="0.01" placeholder="Discounted Price"
                :class="sectionsStyle.input" />
              <span v-show="getErrorForServiceItem(object.id, 'discountedPrice') === true"
                class="text-error text-sm pt-2 pl-2">{{
                  $t('ServicePackages.requiredField') }}</span>
            </div>

            <!-- Item Duration -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("ServicePackages.itemDuration") }}</label>
              <input v-model="object.duration" type="text" placeholder="e.g. 1 hour, 3 days"
                :class="sectionsStyle.input" />
            </div>

            <!-- Item Details (for bullet points) -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("ServicePackages.itemDetails") }}</label>
              <span class="text-xs text-Gray_800 mb-2">{{ $t("ServicePackages.itemDetailsDesc") }}</span>
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
              <span class="flex text-xs text-Gray_800">{{ $t("ServicePackages.itemImageDesc") }}</span>
            </div>

            <!-- Availability -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("ServicePackages.availability") }}</label>
              <div class="flex items-center mt-2">
                <select v-model="object.availability" :class="sectionsStyle.input">
                  <option value="available">{{ $t("ServicePackages.fullyAvailable") }}</option>
                  <option value="limited">{{ $t("ServicePackages.limitedAvailability") }}</option>
                </select>
              </div>
            </div>

            <!-- Featured Item -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("ServicePackages.featuredItem") }}</label>
              <div class="flex items-center">
                <input v-model="object.featured" type="checkbox" class="h-5 w-5 mr-2" />
                <span class="text-xs text-Gray_800">{{ $t("ServicePackages.featuredItemDesc") }}</span>
              </div>
            </div>

            <!-- CSS Classes -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("ServicePackages.cssClasses") }}</label>
              <span class="text-xs text-Gray_800">{{ $t("ServicePackages.cssClassesDesc") }}</span>
              <input v-model="object.classes" type="text" placeholder="CSS Classes" :class="sectionsStyle.input" />
            </div>
          </template>
        </FieldSets>

        <div class="add-button underline cursor-pointer mt-2" @click="addServiceItem(selectedCategoryId)">
          <div class="p3 bold text">{{ $t("ServicePackages.addServiceItem") }}</div>
        </div>
      </div>
      <div v-else class="text-center py-4 text-gray-500">
        {{ $t("ServicePackages.selectCategoryFirst") }}
      </div>
    </div>

    <!-- General Settings -->
    <div class="flex flex-col items-start justify-start mt-8 pt-8 border-t">
      <h3 class="text-lg font-semibold mb-4">{{ $t("ServicePackages.generalSettings") }}</h3>

      <!-- Business Logo -->
      <div class="mb-6">
        <UploadMedia :media-label="$t('ServicePackages.businessLogo') || 'Business Logo'"
          :upload-text="$t('ServicePackages.uploadLogo') || 'Upload Logo'"
          :change-text="$t('ServicePackages.changeLogo') || 'Change Logo'"
          :seo-tag="$t('ServicePackages.seoTag') || 'SEO Tag'"
          :media="settings[0].logo && Object.keys(settings[0].logo).length > 0 ? [settings[0].logo] : []"
          @uploadContainerClicked="openLogoModal(settings[0].logo && Object.keys(settings[0].logo).length > 0 ? settings[0].logo.media_id : null)"
          @removeUploadedImage="removeLogo()" />
        <span class="flex text-xs text-Gray_800">{{ $t("ServicePackages.logoDesc") }}</span>
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("ServicePackages.pageTitle") }}</label>
        <input v-model="settings[0].pageTitle[selectedLang]" type="text" placeholder="Page Title"
          :class="sectionsStyle.input" />
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("ServicePackages.pageSubtitle") }}</label>
        <input v-model="settings[0].pageSubtitle[selectedLang]" type="text" placeholder="Page Subtitle"
          :class="sectionsStyle.input" />
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("ServicePackages.currencySymbol") }}</label>
        <input v-model="settings[0].currencySymbol" type="text" placeholder="$" :class="sectionsStyle.input" />
      </div>

      <div class="flex flex-col items-start justify-start mt-8 pt-8 border-t">
        <h3 class="text-lg font-semibold mb-4">{{ $t("ServicePackages.feeSettings") }}</h3>

        <div class="flex flex-col items-start justify-start mt-4">
          <div class="flex items-center mb-2">
            <input v-model="settings[0].enableTax" type="checkbox" id="enableTax" class="h-5 w-5 mr-2" />
            <label for="enableTax" class="mr-4 font-medium">
              {{ $t("ServicePackages.enableTax") }}
            </label>
          </div>
          <span class="text-xs text-Gray_800 mb-2">
            {{ $t("ServicePackages.enableTaxDesc") }}
          </span>
        </div>

        <div v-if="settings[0].enableTax" class="flex flex-col items-start justify-start mt-4">
          <label class="mr-4 font-medium">
            {{ $t("ServicePackages.taxRate") }}
          </label>
          <input v-model.number="settings[0].taxRate" type="number" min="0" max="100" step="0.01" placeholder="10.00"
            :class="sectionsStyle.input" />
          <span class="text-xs text-Gray_800">
            {{ $t("ServicePackages.taxRateDesc") }}
          </span>
        </div>

        <div class="flex flex-col items-start justify-start mt-4">
          <div class="flex items-center mb-2">
            <input v-model="settings[0].enableServiceFee" type="checkbox" id="enableServiceFee" class="h-5 w-5 mr-2" />
            <label for="enableServiceFee" class="mr-4 font-medium">
              {{ $t("ServicePackages.enableServiceFee") }}
            </label>
          </div>
          <span class="text-xs text-Gray_800 mb-2">
            {{ $t("ServicePackages.enableServiceFeeDesc") }}
          </span>
        </div>

        <div v-if="settings[0].enableServiceFee" class="flex flex-col items-start justify-start mt-4">
          <label class="mr-4 font-medium">
            {{ $t("ServicePackages.serviceFeeRate") }}
          </label>
          <input v-model.number="settings[0].serviceFeeRate" type="number" min="0" max="100" step="0.01"
            placeholder="5.00" :class="sectionsStyle.input" />
          <span class="text-xs text-Gray_800">
            {{ $t("ServicePackages.serviceFeeRateDesc") }}
          </span>
        </div>
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("ServicePackages.cssClasses") }}</label>
        <span class="text-xs text-Gray_800">{{ $t("ServicePackages.cssClassesDesc") }}</span>
        <input v-model="settings[0].classes" type="text" placeholder="CSS Classes" :class="sectionsStyle.input" />
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("ServicePackages.backgroundColor") }}</label>
        <input v-model="settings[0].backgroundColor" type="color" :class="sectionsStyle.input" />
        <span class="text-xs text-Gray_800">{{ $t("ServicePackages.backgroundColorDesc") }}</span>
      </div>
    </div>

    <div class="flex flex-col items-start justify-start mt-8 pt-8 border-t">
      <h3 class="text-lg font-semibold mb-4">{{ $t("ServicePackages.socialMedia") }}</h3>
      <span class="text-xs text-Gray_800 mb-4">{{ $t("ServicePackages.socialMediaDesc") }}</span>

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
              placeholder="Hello! I would like to book a service." :class="sectionsStyle.input" />
          </div>
        </div>
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
          serviceFeeRate: 5.00,
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

    // Safely initialize social media settings
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
        this.$set(this.settings[0].whatsappMessage, locale, 'Hello! I would like to book a service.');
      }
    });
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
        categoryId,
        name: {},
        description: {},
        price: '',
        duration: '',
        hasDiscount: false,
        discountedPrice: '',
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
        price: false,
        discountedPrice: false // Add this to handle discount validation
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
          category.name.en ||
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
          .map(detail => detail[this.selectedLang] || detail.en || '')
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
        if (this.errors.serviceItems[errorIdx].discountedPrice !== undefined) {
          this.errors.serviceItems[errorIdx].discountedPrice = false;
        }

        // Check for required fields
        if (!item.name.en) {
          this.errors.serviceItems[errorIdx].name = true;
          valid = false;
        }

        if (!item.price && item.price !== 0) {
          this.errors.serviceItems[errorIdx].price = true;
          valid = false;
        }

        // Check for discounted price if discount is enabled
        if (item.hasDiscount && (!item.discountedPrice && item.discountedPrice !== 0)) {
          // Make sure the discountedPrice error field exists
          if (this.errors.serviceItems[errorIdx].discountedPrice === undefined) {
            this.$set(this.errors.serviceItems[errorIdx], 'discountedPrice', true);
          } else {
            this.errors.serviceItems[errorIdx].discountedPrice = true;
          }
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
