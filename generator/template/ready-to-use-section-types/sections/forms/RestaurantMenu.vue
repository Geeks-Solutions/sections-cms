<template>
  <div class="p-4">
    <div class="flex flex-col items-start justify-start mt-4">
      <label class="mr-4 font-medium">{{ $t("RestaurantMenu.viewMode") }}</label>
      <div class="flex items-center mt-2">
        <label class="flex items-center cursor-pointer mr-4">
          <input v-model="settings[0].viewMode" type="radio" value="list" class="mr-2 h-[20px] w-[20px]" />
          <span>{{ $t("RestaurantMenu.listView") }}</span>
        </label>
        <label class="flex items-center cursor-pointer">
          <input v-model="settings[0].viewMode" type="radio" value="category" class="mr-2 h-[20px] w-[20px]" />
          <span>{{ $t("RestaurantMenu.categoryView") }}</span>
        </label>
      </div>
      <span class="text-xs text-Gray_800 mt-1">{{ $t("RestaurantMenu.viewModeDesc") }}</span>
    </div>

    <!-- Categories Section -->
    <div id="categories" class="flex flex-col mt-4">
      <h3 class="text-lg font-semibold mb-4">{{ $t("RestaurantMenu.categories") }}</h3>
      <span class="text-xs text-Gray_800 mb-4">{{ $t("RestaurantMenu.categoriesDesc") }}</span>

      <LazySectionsFormsFieldSets :array-data-pop="settings[0].categories" :fieldset-group="'categories'"
        :legend-label="$t('RestaurantMenu.category')" @array-updated="(data) => updateCategories(data)"
        @remove-fieldset="(object, idx) => removeCategory(idx)">
        <template #default="{ object, idx }">
          <div class="flex flex-col items-start justify-start mt-4">
            <label class="mr-4 font-medium">{{ $t("RestaurantMenu.categoryName") }}*</label>
            <input v-model="object.name[selectedLang]" type="text" placeholder="Category Name"
              :class="sectionsStyle.input" />
            <span v-show="errors.categories[idx]?.name === true && selectedLang === defaultLang"
              class="text-error text-sm pt-2 pl-2">{{
                $t('RestaurantMenu.requiredField') }}</span>
          </div>

          <!-- Category Icon -->
          <div class="mb-4 mt-4">
            <LazyMediasUploadMedia :media-label="$t('RestaurantMenu.categoryIcon')"
              :upload-text="$t('RestaurantMenu.uploadIcon')" :change-text="$t('RestaurantMenu.changeIcon')"
              :seo-tag="$t('RestaurantMenu.seoTag')"
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
      </LazySectionsFormsFieldSets>

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
        <div class="select-style-chooser w-[344px]">
          <gAutoComplete :main-filter="selectedCategoryId" :placeholder="$t('RestaurantMenu.selectCategory')"
            :filter-label-prop="'name'" :reduce="(option) => option.id" :filter-options="getCategoryOptions()"
            :filter-searchable="true" :close-on-select="true" :filter-clearable="true" :track-by="'id'"
            @itemSelected="(val) => { selectedCategoryId = val; }">
          </gAutoComplete>
        </div>
      </div>

      <div v-if="selectedCategoryId" class="w-full">
        <LazySectionsFormsFieldSets :array-data-pop="getMenuItemsByCategory(selectedCategoryId)"
          :fieldset-group="'menuItems'" :legend-label="$t('RestaurantMenu.menuItem')"
          @array-updated="(data) => updateMenuItemsForCategory(selectedCategoryId, data)"
          @remove-fieldset="(object, idx) => removeMenuItem(object.id)">
          <template #default="{ object }" class="w-full">
            <!-- Item Name -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("RestaurantMenu.itemName") }}*</label>
              <input v-model="object.name[selectedLang]" type="text" placeholder="Item Name"
                :class="sectionsStyle.input" />
              <span v-show="getErrorForMenuItem(object.id, 'name') === true && selectedLang === defaultLang"
                class="text-error text-sm pt-2 pl-2">{{
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

            <!-- Item Variants Toggle (NEW) -->
            <div class="flex flex-col items-start justify-start mt-4">
              <label class="mr-4 font-medium">{{ $t("RestaurantMenu.enableVariants") }}</label>
              <div class="flex items-center">
                <input v-model="object.hasVariants" type="checkbox" class="h-5 w-5 mr-2"
                  @change="onVariantsToggle(object.id, object.hasVariants)" />
                <span class="text-xs text-Gray_800">{{ $t("RestaurantMenu.enableVariantsDesc") }}</span>
              </div>
            </div>

            <!-- Item Variants Section (only show if enabled) -->
            <div v-if="object.hasVariants" class="flex flex-col items-start justify-start mt-4 pt-4 border-t w-full">
              <label class="mr-4 font-medium mb-2">{{ $t("RestaurantMenu.itemVariants") }}</label>
              <span class="text-xs text-Gray_800 mb-4">{{ $t("RestaurantMenu.itemVariantsDesc") }}</span>

              <LazySectionsFormsFieldSets :array-data-pop="object.variants || []" :fieldset-group="'variants'"
                :legend-label="$t('RestaurantMenu.variant')" @array-updated="(data) => updateVariants(object.id, data)"
                @remove-fieldset="(variant, vIdx) => removeVariant(object.id, vIdx)" class="w-full">
                <template #default="{ object: variant }">
                  <div class="flex flex-col items-start justify-start mt-4">
                    <label class="mr-4 font-medium">{{ $t("RestaurantMenu.variantName") }}*</label>
                    <input v-model="variant.name[selectedLang]" type="text"
                      :placeholder="$t('RestaurantMenu.variantNamePlaceholder')" :class="sectionsStyle.input" />
                  </div>

                  <div class="flex flex-col items-start justify-start mt-4">
                    <label class="mr-4 font-medium">{{ $t("RestaurantMenu.variantPrice") }}*</label>
                    <input v-model="variant.price" type="number" min="0" step="0.01"
                      :placeholder="$t('RestaurantMenu.itemPrice')" :class="sectionsStyle.input" />
                  </div>
                </template>
              </LazySectionsFormsFieldSets>

              <div class="add-button underline cursor-pointer mt-2" @click="addVariant(object.id)">
                <div class="p3 bold text">{{ $t("RestaurantMenu.addVariant") }}</div>
              </div>
            </div>

            <!-- Item Image -->
            <div class="mb-4 mt-4">
              <LazyMediasUploadMedia :media-label="$t('RestaurantMenu.itemImage')"
                :upload-text="$t('RestaurantMenu.uploadMedia')" :change-text="$t('RestaurantMenu.changeMedia')"
                :seo-tag="$t('RestaurantMenu.seoTag')"
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
        </LazySectionsFormsFieldSets>

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
        <LazyMediasUploadMedia :media-label="$t('RestaurantMenu.restaurantLogo') || 'Restaurant Logo'"
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
        <select v-model="settings[0].currencySymbol" :class="sectionsStyle.input">
          <option value="$">$ (USD)</option>
          <option value="€">€ (EUR)</option>
          <option value="LBP">LBP</option>
        </select>
      </div>
      <div class="flex flex-col items-start justify-start mt-4">
        <div class="flex items-center mb-2">
          <input v-model="settings[0].appearance.shoppingCart" id="appearanceShoppingCart" type="checkbox"
            class="h-5 w-5 mr-2" @change="onShoppingCartChange" />
          <label for="appearanceShoppingCart" class="mr-4 font-medium">
            {{ $t("RestaurantMenu.appearance.shoppingCart") }}
          </label>
        </div>
        <span class="text-xs text-Gray_800 mb-2 text-start">
          {{ $t("RestaurantMenu.appearance.shoppingCartDesc") }}
        </span>
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <div class="flex items-center mb-2">
          <input v-model="settings[0].appearance.itemDetails" id="appearanceItemsDetails" type="checkbox"
            class="h-5 w-5 mr-2" :disabled="settings[0].appearance.shoppingCart" />
          <label for="appearanceItemsDetails" class="mr-4 font-medium"
            :class="{ 'opacity-50 cursor-not-allowed': settings[0].appearance.shoppingCart }">
            {{ $t("RestaurantMenu.appearance.itemsDetails") }}
          </label>
        </div>
        <span class="text-xs text-Gray_800 mb-2">
          {{ $t("RestaurantMenu.appearance.itemsDetailsDesc") }}
        </span>
        <span v-if="settings[0].appearance.shoppingCart" class="text-xs text-blue-600 mt-1">
          Item details must be enabled when shopping cart is enabled
        </span>
      </div>

      <div class="flex flex-col items-start justify-start mt-8 pt-8 border-t">
        <h3 class="text-lg font-semibold mb-4">{{ $t("RestaurantMenu.taxSettings") }}</h3>

        <div class="flex flex-col items-start justify-start mt-4">
          <div class="flex items-center mb-2">
            <input v-model="settings[0].enableTax" id="enableTax" type="checkbox" class="h-5 w-5 mr-2" />
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
            {{ $t("RestaurantMenu.taxRate") }}*
          </label>
          <input id="taxRate" v-model.number="settings[0].taxRate" type="number" min="0" max="100" step="0.01"
            placeholder="Enter tax rate (e.g. 10.00)"
            :class="[sectionsStyle.input, errors.generalSettings.taxRate ? 'error' : '']" />
          <span v-show="errors.generalSettings.taxRate === true" class="text-error text-sm pt-2 pl-2">
            {{ $t('RestaurantMenu.requiredField') }}
          </span>
          <span class="text-xs text-Gray_800">
            {{ $t("RestaurantMenu.taxRateDesc") }}
          </span>
        </div>
      </div>

      <!-- Social Media Section -->
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
              <input v-model="settings[0].showWhatsApp" id="showWhatsApp" type="checkbox" class="h-5 w-5 mr-2" />
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

      <!-- Branches Section -->
      <div class="flex flex-col items-start justify-start mt-8 pt-8 border-t w-full">
        <h3 class="text-lg font-semibold mb-4">{{ $t("RestaurantMenu.branches") }}</h3>
        <span class="text-xs text-Gray_800 mb-4">{{ $t("RestaurantMenu.branchesDesc") }}</span>

        <div class="flex items-center mb-4">
          <input v-model="settings[0].enableBranches" id="enableBranches" type="checkbox" class="h-5 w-5 mr-2" />
          <label for="enableBranches" class="font-medium">
            {{ $t("RestaurantMenu.enableBranches") }}
          </label>
        </div>
        <span class="text-xs text-Gray_800 mb-4">
          {{ $t("RestaurantMenu.enableBranchesDesc") }}
        </span>

        <div v-if="settings[0].enableBranches" class="w-full">
          <LazySectionsFormsFieldSets :array-data-pop="settings[0].branches" :fieldset-group="'branches'"
            :legend-label="$t('RestaurantMenu.branch')" @array-updated="(data) => updateBranches(data)"
            @remove-fieldset="(object, idx) => removeBranch(idx)">
            <template #default="{ object, idx }">
              <div class="flex flex-col items-start justify-start mt-4">
                <label class="mr-4 font-medium">{{ $t("RestaurantMenu.branchName") }}*</label>
                <input v-model="object.name[selectedLang]" type="text" placeholder="Branch Name"
                  :class="sectionsStyle.input" />
                <span v-show="errors.branches[idx]?.name === true && selectedLang === defaultLang"
                  class="text-error text-sm pt-2 pl-2">{{
                    $t('RestaurantMenu.requiredField') }}</span>
              </div>

              <div class="flex flex-col items-start justify-start mt-4">
                <label class="mr-4 font-medium">{{ $t("RestaurantMenu.branchPhone") }}*</label>
                <input v-model="object.phone" type="text" placeholder="+1234567890" :class="sectionsStyle.input" />
                <span v-show="errors.branches[idx]?.phone === true" class="text-error text-sm pt-2 pl-2">{{
                  $t('RestaurantMenu.requiredField') }}</span>
                <span class="text-xs text-Gray_800 mt-1">{{ $t("RestaurantMenu.branchPhoneDesc") }}</span>
              </div>
            </template>
          </LazySectionsFormsFieldSets>

          <div class="add-button underline cursor-pointer mt-2" @click="addBranch()">
            <div class="p3 bold text">{{ $t("RestaurantMenu.addBranch") }}</div>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-start justify-start mt-4">
        <label class="mr-4 font-medium">{{ $t("RestaurantMenu.cssClasses") }}</label>
        <span class="text-xs text-Gray_800">{{ $t("RestaurantMenu.cssClassesDesc") }}</span>
        <input v-model="settings[0].classes" type="text" placeholder="CSS Classes" :class="sectionsStyle.input" />
      </div>
    </div>

    <LazySectionFormErrors :selectedLang="selectedLang" :default-lang="defaultLang" :locales="locales"
      :errors="errors" />

  </div>
</template>

<i18n src="./RestaurantMenu_i18n.json"></i18n>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { sectionsStyle, scrollToFirstError, assignMediaObject } from '@/utils/constants'
import 'vue-select/dist/vue-select.css'

const { t: $t } = useI18n({ useScope: 'local' })

// Props
const props = defineProps({
  selectedLang: {
    type: String,
    default: 'en'
  },
  defaultLang: {
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

// Reactive data
const settings = ref([
  {
    categories: [],
    menuItems: [],
    menuTitle: {},
    menuSubtitle: {},
    currencySymbol: '$',
    classes: '',
    logo: {},
    viewMode: 'list',
    enableTax: false,
    taxRate: '',
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
    whatsappMessage: {},
    enableBranches: false,
    branches: [],
    appearance: {
      shoppingCart: true,
      itemDetails: true,
    }
  }
])

const errors = reactive({
  categories: [],
  menuItems: [],
  branches: [],
  generalSettings: {
    taxRate: false
  }
})

const currentMediaItemId = ref(null)
const currentMediaType = ref(null)
const currentCategoryId = ref(null)
const selectedCategoryId = ref('')

// Methods
const updateCategories = (data) => {
  settings.value[0].categories = data
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

const initializeMediasArray = () => {
  settings.value[0].medias = []

  if (settings.value[0].logo && settings.value[0].logo.media_id) {
    settings.value[0].medias.push(settings.value[0].logo)
  }

  if (settings.value[0].categories) {
    settings.value[0].categories.forEach(category => {
      if (category.icon && category.icon.media_id) {
        settings.value[0].medias.push(category.icon)
      }
    })
  }

  if (settings.value[0].menuItems) {
    settings.value[0].menuItems.forEach(item => {
      if (item.image && item.image.media_id) {
        settings.value[0].medias.push(item.image)
      }
    })
  }
}

const resetMediaState = () => {
  currentMediaItemId.value = null
  currentCategoryId.value = null
  currentMediaType.value = null
}

const openMediaModal = (itemId, mediaId) => {
  emit('openMediaModal', mediaId)
  nextTick(() => {
    currentMediaItemId.value = itemId
    currentMediaType.value = 'menuItem'
  })
}

const openCategoryIconModal = (categoryId, mediaId) => {
  emit('openMediaModal', mediaId)
  nextTick(() => {
    currentCategoryId.value = categoryId
    currentMediaType.value = 'categoryIcon'
  })
}

const openLogoModal = (mediaId) => {
  emit('openMediaModal', mediaId)
  nextTick(() => {
    currentMediaType.value = 'logo'
  })
}

const removeLogo = () => {
  if (settings.value[0].logo && settings.value[0].logo.media_id) {
    removeFromMediasArray(settings.value[0].logo.media_id)
  }
  settings.value[0].logo = {}
}

const removeCategoryIcon = (categoryId) => {
  const categoryIndex = settings.value[0].categories.findIndex(cat => cat.id === categoryId)
  if (categoryIndex !== -1 && settings.value[0].categories[categoryIndex].icon) {
    const mediaId = settings.value[0].categories[categoryIndex].icon.media_id
    if (mediaId) {
      removeFromMediasArray(mediaId)
    }
    settings.value[0].categories[categoryIndex].icon = {}
  }
}

const removeItemImage = (itemId) => {
  const itemIndex = settings.value[0].menuItems.findIndex(item => item.id === itemId)
  if (itemIndex !== -1 && settings.value[0].menuItems[itemIndex].image) {
    const mediaId = settings.value[0].menuItems[itemIndex].image.media_id
    if (mediaId) {
      removeFromMediasArray(mediaId)
    }
    settings.value[0].menuItems[itemIndex].image = {}
  }
}

// Variant Management Functions
const onVariantsToggle = (itemId, isEnabled) => {
  const itemIndex = settings.value[0].menuItems.findIndex(item => item.id === itemId)
  if (itemIndex === -1) return

  if (isEnabled) {
    // Initialize variants array if enabling
    if (!settings.value[0].menuItems[itemIndex].variants) {
      settings.value[0].menuItems[itemIndex].variants = []
    }
  } else {
    // Clear variants array if disabling
    settings.value[0].menuItems[itemIndex].variants = []
  }
}

const addVariant = (itemId) => {
  const itemIndex = settings.value[0].menuItems.findIndex(item => item.id === itemId)
  if (itemIndex === -1) return

  if (!settings.value[0].menuItems[itemIndex].variants) {
    settings.value[0].menuItems[itemIndex].variants = []
  }

  const newVariant = {
    id: `variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: {},
    price: 0
  }

  // Initialize name for all locales
  props.locales.forEach(locale => {
    newVariant.name[locale] = ''
  })

  settings.value[0].menuItems[itemIndex].variants.push(newVariant)
}

const removeVariant = (itemId, variantIndex) => {
  const itemIndex = settings.value[0].menuItems.findIndex(item => item.id === itemId)
  if (itemIndex === -1) return

  settings.value[0].menuItems[itemIndex].variants.splice(variantIndex, 1)
}

const updateVariants = (itemId, updatedVariants) => {
  const itemIndex = settings.value[0].menuItems.findIndex(item => item.id === itemId)
  if (itemIndex === -1) return

  settings.value[0].menuItems[itemIndex].variants = updatedVariants
}

const initializeLocalizedFields = () => {
  if (!settings.value[0].menuTitle) {
    settings.value[0].menuTitle = {}
  }
  if (!settings.value[0].menuSubtitle) {
    settings.value[0].menuSubtitle = {}
  }

  props.locales.forEach(locale => {
    if (!settings.value[0].menuTitle[locale]) {
      settings.value[0].menuTitle[locale] = ''
    }
    if (!settings.value[0].menuSubtitle[locale]) {
      settings.value[0].menuSubtitle[locale] = ''
    }
  })
}

const addCategory = () => {
  const category = {
    id: uuidv4(),
    name: {},
    description: {},
    classes: '',
    icon: {}
  }

  props.locales.forEach(locale => {
    category.name[locale] = ''
    category.description[locale] = ''
  })

  settings.value[0].categories.push(category)
  errors.categories.push({ name: false })

  if (settings.value[0].categories.length === 1) {
    nextTick(() => {
      selectedCategoryId.value = category.id
    })
  }
}

const removeCategory = (idx) => {
  const removedCategory = settings.value[0].categories[idx]

  settings.value[0].categories = settings.value[0].categories.filter((ct, i) => idx !== i)
  errors.categories.splice(idx, 1)

  if (removedCategory && removedCategory.id) {
    const categoryId = removedCategory.id
    settings.value[0].menuItems = settings.value[0].menuItems.filter(item => item.categoryId !== categoryId)

    if (selectedCategoryId.value === categoryId) {
      if (settings.value[0].categories.length > 0) {
        selectedCategoryId.value = settings.value[0].categories[0].id
      } else {
        selectedCategoryId.value = ''
      }
    }
  }
}

const addBranch = () => {
  const branch = {
    id: uuidv4(),
    name: {},
    phone: ''
  }

  props.locales.forEach(locale => {
    branch.name[locale] = ''
  })

  settings.value[0].branches.push(branch)
  errors.branches.push({ name: false, phone: false })
}

const removeBranch = (idx) => {
  settings.value[0].branches = settings.value[0].branches.filter((br, i) => idx !== i)
  errors.branches.splice(idx, 1)
}

const updateBranches = (data) => {
  settings.value[0].branches = data
}

const addMenuItem = (categoryId) => {
  if (!categoryId) return

  const menuItem = {
    id: uuidv4(),
    categoryId,
    name: {},
    description: {},
    price: '',
    image: {},
    featured: false,
    classes: '',
    hasVariants: false,
    variants: []
  }

  props.locales.forEach(locale => {
    menuItem.name[locale] = ''
    menuItem.description[locale] = ''
  })

  settings.value[0].menuItems.push(menuItem)
  errors.menuItems.push({
    id: menuItem.id,
    name: false,
    price: false
  })
}

const removeMenuItem = (itemId) => {
  const idx = settings.value[0].menuItems.findIndex(item => item.id === itemId)
  if (idx === -1) return

  const mediaId = settings.value[0].menuItems[idx].image && settings.value[0].menuItems[idx].image.media_id
  if (mediaId) {
    removeFromMediasArray(mediaId)
  }

  settings.value[0].menuItems.splice(idx, 1)

  const errorIdx = errors.menuItems.findIndex(err => err.id === itemId)
  if (errorIdx !== -1) {
    errors.menuItems.splice(errorIdx, 1)
  }
}

const onShoppingCartChange = () => {
  // When shopping cart is enabled, force itemDetails to be true
  if (settings.value[0].appearance.shoppingCart) {
    settings.value[0].appearance.itemDetails = true
  }
}

const getCategoryOptions = () => {
  if (!settings.value[0].categories || settings.value[0].categories.length === 0) return []

  return settings.value[0].categories.map(category => {
    // Get the category name in the selected language, fall back to English if not available
    const nameInSelectedLang = category.name[props.selectedLang]?.trim()
    const nameInEnglish = category.name.en?.trim()

    // Check if we have any actual name content (not just empty strings)
    const hasValidName = nameInSelectedLang || nameInEnglish

    const displayName = hasValidName
      ? (nameInSelectedLang || nameInEnglish)
      : `New Category`

    return {
      id: category.id,
      name: displayName  // This is what filter-label-prop="'name'" will display
    }
  })
}

const getMenuItemsByCategory = (categoryId) => {
  if (!categoryId || !settings.value[0].menuItems) return []
  return settings.value[0].menuItems.filter(item => item.categoryId === categoryId)
}

const updateMenuItemsForCategory = (categoryId, updatedItems) => {
  if (!categoryId) return

  const otherItems = settings.value[0].menuItems.filter(item => item.categoryId !== categoryId)
  settings.value[0].menuItems = [...otherItems, ...updatedItems]
}

const getErrorForMenuItem = (itemId, field) => {
  const error = errors.menuItems.find(err => err.id === itemId)
  return error ? error[field] : false
}

const validate = () => {
  let valid = true

  errors.generalSettings = errors.generalSettings || {}
  errors.generalSettings.taxRate = false

  settings.value[0].categories.forEach((category, idx) => {
    if (!errors.categories[idx]) {
      errors.categories[idx] = { name: false }
    }
    errors.categories[idx].name = false

    if (!category.name[props.defaultLang]) {
      errors.categories[idx].name = true
      valid = false
    }
  })

  settings.value[0].menuItems.forEach(item => {
    const errorIdx = errors.menuItems.findIndex(err => err.id === item.id)
    if (errorIdx === -1) return

    errors.menuItems[errorIdx].name = false
    errors.menuItems[errorIdx].price = false

    if (!item.name[props.defaultLang]) {
      errors.menuItems[errorIdx].name = true
      valid = false
    }

    if (!item.price && item.price !== 0) {
      errors.menuItems[errorIdx].price = true
      valid = false
    }
  })

  if (settings.value[0].enableTax && (!settings.value[0].taxRate && settings.value[0].taxRate !== 0)) {
    errors.generalSettings.taxRate = true
    valid = false
  }

  // Branch validation
  if (settings.value[0].enableBranches) {
    settings.value[0].branches.forEach((branch, idx) => {
      if (!errors.branches[idx]) {
        errors.branches[idx] = { name: false, phone: false }
      }
      errors.branches[idx].name = false
      errors.branches[idx].phone = false

      if (!branch.name[props.defaultLang]) {
        errors.branches[idx].name = true
        valid = false
      }

      if (!branch.phone || branch.phone.trim() === '') {
        errors.branches[idx].phone = true
        valid = false
      }
    })
  }

  settings.value[0].menuItems.forEach(item => {
    if (item.image && (Object.keys(item.image).length === 0 || !item.image.media_id || !item.image.url)) {
      delete item.image
    }
  })

  settings.value[0].categories.forEach(category => {
    if (category.icon && (Object.keys(category.icon).length === 0 || !category.icon.media_id || !category.icon.url)) {
      delete category.icon
    }
  })

  if (settings.value[0].logo && (Object.keys(settings.value[0].logo).length === 0 || !settings.value[0].logo.media_id || !settings.value[0].logo.url)) {
    delete settings.value[0].logo
  }

  if (!valid) {
    // Note: You'll need to handle this toast notification in your Nuxt 3 app
    if (scrollToFirstError) {
      scrollToFirstError(errors)
    }
  }

  return valid
}

// Watchers
watch(() => props.selectedMedia, (mediaObject) => {
  if (!mediaObject) return

  let media = {}
  media = assignMediaObject(mediaObject)

  if (currentMediaType.value === 'logo') {
    settings.value[0].logo = media
  } else if (currentMediaType.value === 'categoryIcon') {
    const categoryIndex = settings.value[0].categories.findIndex(cat => cat.id === currentCategoryId.value)
    if (categoryIndex !== -1) {
      settings.value[0].categories[categoryIndex].icon = media
    }
  } else if (currentMediaType.value === 'menuItem') {
    const itemIndex = settings.value[0].menuItems.findIndex(item => item.id === currentMediaItemId.value)
    if (itemIndex !== -1) {
      settings.value[0].menuItems[itemIndex].image = media
    }
  }

  updateMediasArray(media)
  emit('closeMediaModal')
  resetMediaState()
})

watch(() => settings.value, (value) => {
  if (value[0].categories) {
    errors.categories = value[0].categories.map(() => ({ name: false }))

    if (!selectedCategoryId.value && value[0].categories.length > 0) {
      selectedCategoryId.value = value[0].categories[0].id
    }
  }

  if (value[0].menuItems) {
    errors.menuItems = value[0].menuItems.map(item => ({
      id: item.id,
      name: false,
      price: false
    }))
  }

  if (value[0].branches) {
    errors.branches = value[0].branches.map(() => ({ name: false, phone: false }))
  }
}, { deep: true, immediate: true })

// Lifecycle
onMounted(() => {
  initializeLocalizedFields()
  initializeMediasArray()

  if (!settings.value[0].appearance) {
    settings.value[0].appearance = {
      shoppingCart: true,
      itemDetails: true
    }
  } else {
    if (typeof settings.value[0].appearance.shoppingCart === 'undefined') {
      settings.value[0].appearance.shoppingCart = true
    }
    if (typeof settings.value[0].appearance.itemDetails === 'undefined') {
      settings.value[0].appearance.itemDetails = true
    }
    // Enforce rule: if shoppingCart is true, itemDetails must be true
    if (settings.value[0].appearance.shoppingCart) {
      settings.value[0].appearance.itemDetails = true
    }
  }

  if (!settings.value[0].socialMedia) {
    settings.value[0].socialMedia = {
      instagram: '',
      facebook: '',
      tiktok: '',
      twitter: '',
      youtube: ''
    }
  } else {
    const platforms = ['instagram', 'facebook', 'tiktok', 'twitter', 'youtube']
    platforms.forEach(platform => {
      if (typeof settings.value[0].socialMedia[platform] === 'undefined') {
        settings.value[0].socialMedia[platform] = ''
      }
    })
  }

  if (typeof settings.value[0].showWhatsApp === 'undefined') {
    settings.value[0].showWhatsApp = false
  }

  settings.value[0].menuItems.forEach(item => {
    if (typeof item.hasVariants === 'undefined') {
      item.hasVariants = false
    }
    if (!item.variants) {
      item.variants = []
    }
  })

  if (!settings.value[0].whatsappNumber) {
    settings.value[0].whatsappNumber = ''
  }

  if (!settings.value[0].whatsappMessage) {
    settings.value[0].whatsappMessage = {}
  }

  props.locales.forEach(locale => {
    if (!settings.value[0].whatsappMessage[locale]) {
      settings.value[0].whatsappMessage[locale] = 'Hello! I would like to reserve a table.'
    }
  })

  // Initialize branches
  if (typeof settings.value[0].enableBranches === 'undefined') {
    settings.value[0].enableBranches = false
  }

  if (!settings.value[0].branches) {
    settings.value[0].branches = []
  }
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
</style>