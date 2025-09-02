# Contributing New Sections Guidelines

This document provides guidelines for contributors on how to create new sections for the Vue CLI Plugin Sections. Adhering to these guidelines will ensure consistency and maintainability across all sections.

## Table of Contents

1.  [File Structure and Naming Conventions](#file-structure-and-naming-conventions)
2.  [Form Component (`MySection.vue`)](#form-component-mysectionvue)
    *   [Props](#props-form)
    *   [Data Structure (`settings`)](#data-structure-settings)
    *   [Using Core Form Components](#using-core-form-components)
    *   [Localization](#localization-form)
    *   [Media Handling](#media-handling)
    *   [Validation](#validation)
    *   [Emitting Events](#emitting-events)
3.  [View Component (`MySection_static.vue` / `MySection_dynamic.vue`)](#view-component-mysection_staticvue--mysection_dynamicvue)
    *   [Props](#props-view)
    *   [Computed Properties](#computed-properties-view)
    *   [Displaying Content](#displaying-content)
    *   [Styling Guidelines](#styling-guidelines)
4.  [General Best Practices](#general-best-practices)
    *   [DRY (Don't Repeat Yourself)](#dry-dont-repeat-yourself)
    *   [Translations / Internationalization (i18n)](#translations--internationalization-i18n)
    *   [Code Clarity](#code-clarity)

## 1. File Structure and Naming Conventions

*   **Form Components:**
    *   Location: [`generator/template/ready-to-use-section-types/sections/forms/`](generator/template/ready-to-use-section-types/sections/forms/:0)
    *   Naming: `MySectionName.vue` (e.g., `HeroBanner.vue`)
*   **View Components:**
    *   Location: [`generator/template/ready-to-use-section-types/sections/views/`](generator/template/ready-to-use-section-types/sections/views/:0)
    *   Naming:
        *   `MySectionName_static.vue` for sections with content managed directly via the form (e.g., `FAQ_static.vue`).
        *   `MySectionName_dynamic.vue` for sections that fetch data from APIs based on form configuration (e.g., `LatestArticles_dynamic.vue`).
*   **CSS Presets:**
    *   Location: [`css-presets/`](css-presets/:0)
    *   Naming: `preset-name.css` (e.g., `sober.css`)

## 2. Form Component (`MySection.vue`)

The form component is responsible for providing an interface to configure the section's content and appearance.

### Props (Form)

Standard props for form components:

*   `selectedLang: String`: The currently active language (e.g., 'en', 'fr').
*   `selectedMedia: Object`: An object containing details of the media item selected from the global media library. This is populated when a media item is chosen.
*   `locales: Array`: An array of available locale objects (e.g., `[{ code: 'en', name: 'English' }, { code: 'fr', name: 'French' }]`).
*   `mediaFields: Array` (Optional but Recommended): An array defining the types and names of media fields used within the form. This helps in managing media selection and assignment.
    ```javascript
    // Example:
    mediaFields: [
      { type: 'image', name: 'backgroundImage' }, // For a single media item
      { type: 'image', name: 'galleryImages' }    // For multiple media items (e.g., in a FieldSet)
    ]
    ```

### Data Structure (`settings`)

The core of the form's data is the `settings` object (typically an array containing a single object). This object holds all configurations for the section and must be structured to support localization.

```javascript
// Example data() structure:
data() {
  return {
    settings: [
      {
        // Language-specific fields
        en: {
          title: 'Frequently Asked Questions',
          description: 'Find answers to common questions.'
        },
        fr: {
          title: 'Questions Fréquemment Posées',
          description: 'Trouvez les réponses aux questions courantes.'
        },
        // Non-localizable fields
        imagePosition: 'left', // e.g., 'left', 'right', 'none'
        backgroundColor: '#FFFFFF',
        // Repeatable fieldsets (e.g., Q&A items, features)
        QAs: [
          // Initial structure for a repeatable item, supporting localization
          // { en: { question: '', answer: '' }, fr: { question: '', answer: '' }, classes: '' }
        ],
        // Media objects
        featuredImage: { media_id: "", url: "", seo_tag: "" }
      }
    ],
    siteLang: 'en', // Derived from selectedLang prop
    errors: {
      title: false // For validation feedback
    },
    selectedMediaIndex: 0 // To track which media field is being populated
  };
}
```

### Using Core Form Components

Leverage components from `@geeks.solutions/nuxt-sections/lib/src/components` for common form functionalities:

*   **`UploadMedia`**: For image/video selection.
    *   Key Props: `:media-label`, `:upload-text`, `:change-text`, `:seo-tag`, `:media` (bind to the media object in your `settings`).
    *   Key Events: `@uploadContainerClicked` (emit `openMediaModal`), `@removeUploadedImage`.
    *   Example:
        ```vue
        <UploadMedia
          :media-label="$t('forms.featuredImage')"
          :media="settings[0].featuredImage"
          @uploadContainerClicked="selectedMediaIndex = 'featuredImage'; $emit('openMediaModal', settings[0].featuredImage ? settings[0].featuredImage.media_id : null)"
          @removeUploadedImage="settings[0].featuredImage = {}"
        />
        ```

*   **`wysiwyg`**: For rich text editing.
    *   Key Props: `:quill-key` (unique key for the editor instance), `:html` (bind to the HTML content in your `settings`), `:css-classes-prop`.
    *   Key Events: `@cssClassesChanged`, `@wysiwygMedia` (for media added via editor), `@settingsUpdate` (to update your `settings` with new HTML content).
    *   Example:
        ```vue
        <wysiwyg
          :quill-key="`description-${idx}`"
          :html="item[siteLang].description"
          @settingsUpdate="(content) => item[siteLang].description = content"
        />
        ```

*   **`FieldSets`**: For managing repeatable groups of fields (e.g., a list of features, FAQs, slides).
    *   Key Props: `:array-data-pop` (bind to the array in your `settings`), `:fieldset-group` (a unique name), `:legend-label`.
    *   Key Events: `@array-updated` (update your `settings` array), `@remove-fieldset`.
    *   Uses a scoped slot for defining the fields within each set.
    *   Example:
        ```vue
        <FieldSets
          :array-data-pop="settings[0].QAs"
          :fieldset-group="'qa_items'"
          :legend-label="$t('forms.qaItem')"
          @array-updated="(data) => $set(settings[0], 'QAs', data)"
          @remove-fieldset="(object, idx) => settings[0].QAs.splice(idx, 1)"
        >
          <template #default="{ object, idx }">
            <input v-model="object[siteLang].question" :placeholder="$t('forms.question')" />
            <wysiwyg :html="object[siteLang].answer" @settingsUpdate="(content) => object[siteLang].answer = content" />
          </template>
        </FieldSets>
        <button @click="addQAItem">Add QA Item</button>
        ```
        ```javascript
        // In methods:
        addQAItem() {
          this.settings[0].QAs.push({
            en: { question: '', answer: '' },
            fr: { question: '', answer: '' },
            // any other default fields for a new item
          });
        }
        ```

### Localization (Form)

*   Ensure all user-configurable text fields in `settings` are structured per language (e.g., `settings[0].en.title`, `settings[0].fr.title`).
*   Use the `siteLang` data property (derived from the `selectedLang` prop) to bind inputs to the correct language fields: `v-model="settings[0][siteLang].title"`.
*   Initialize all supported languages within the `settings` data structure.

### Media Handling

*   When using `UploadMedia`, the `selectedMedia` prop will be populated when a user selects an item from the media library.
*   Implement a watcher for `selectedMedia` to update the appropriate media object within your `settings`.
    ```javascript
    watch: {
      selectedLang: {
        handler(val) { this.siteLang = val; },
        immediate: true
      },
      selectedMedia(mediaObject) {
        if (!mediaObject || !mediaObject.id) return; // Guard clause

        const mediaData = {
          media_id: mediaObject.id,
          url: mediaObject.files[0].url,
          seo_tag: mediaObject.seo_tag || '',
          filename: mediaObject.files[0].filename,
          headers: mediaObject.files[0].headers || {}
        };

        // Example: if selectedMediaIndex holds the key for the media object
        if (typeof this.selectedMediaIndex === 'string' && this.settings[0][this.selectedMediaIndex]) {
          this.$set(this.settings[0], this.selectedMediaIndex, mediaData);
        }
        // Example: if selectedMediaIndex is an actual index for an array item
        // else if (typeof this.selectedMediaIndex === 'number' && this.settings[0].items[this.selectedMediaIndex]) {
        //   this.$set(this.settings[0].items[this.selectedMediaIndex], 'media', mediaData);
        // }

        this.$emit('closeMediaModal'); // Important to close the modal
      }
    }
    ```
*   Use `selectedMediaIndex` (or a similar mechanism) if your form has multiple media fields or media fields within repeatable `FieldSets` to correctly assign the selected media.

### Validation

*   Implement a `validate()` method. This method is called by the host application before saving.
*   It should check for required fields and set flags in an `errors` data object for visual feedback.
*   If validation fails, emit a toast message using `this.$root.$emit("toast", { type: "Error", message: this.$t("fill-required-fields") });`.
*   Return `true` if valid, `false` otherwise.
    ```javascript
    validate() {
      let isValid = true;
      this.errors.title = false; // Reset errors

      if (!this.settings[0][this.siteLang].title) {
        this.errors.title = true;
        isValid = false;
      }
      // Add more validation rules as needed

      if (!isValid) {
        this.$root.$emit("toast", {
          type: "Error",
          message: this.$t("forms.fillRequiredFields") // Ensure this key exists in lang files
        });
      }
      return isValid;
    }
    ```

### Emitting Events

*   `$emit('openMediaModal', existingMediaId)`: To open the global media library. Pass the ID of an existing media item if one is already selected for that field.
*   `$emit('closeMediaModal')`: After media selection logic in the `selectedMedia` watcher.

## 3. View Component (`MySection_static.vue` / `MySection_dynamic.vue`)

The view component is responsible for rendering the section on the frontend based on the `settings` configured via the form.

### Props (View)

Standard props for view components:

*   `section: Object`: The section object from the database/store, containing `settings`, `weight`, `type`, etc.
*   `lang: String`: The currently active language (e.g., 'en', 'fr').
*   `viewStructure: Object` (Optional but good for documentation): An object defining the expected structure of `section.settings`. This serves as an internal reference to show a preview of the section in the section types list.

### Computed Properties (View)

*   `settings`: A computed property to safely access `this.section.settings`. Often, form settings are stored as an array, so you might need `this.section.settings[0]`.
    ```javascript
    computed: {
      settings() {
        if (this.section && this.section.settings) {
          return Array.isArray(this.section.settings) ? this.section.settings[0] : this.section.settings;
        }
        return null; // Or a default settings object
      }
    }
    ```

### Displaying Content

*   Access localized content using `settings[this.lang].fieldName` (e.g., `settings[lang].title`).
*   Render WYSIWYG content using the `gWysiwygContent` component (if available globally) or `v-html` (ensure content is sanitized if using `v-html`).
    ```vue
    <div v-if="settings && settings[lang]" class="my-section">
      <h1>{{ settings[lang].title }}</h1>
      <img v-if="settings.featuredImage && settings.featuredImage.url" :src="settings.featuredImage.url" :alt="settings.featuredImage.seo_tag" loading="lazy" />
      <gWysiwygContent v-if="settings[lang].description" tag="div" :html-content="settings[lang].description" />
    </div>
    ```

### Styling Guidelines

*   **No Hardcoded Styles:** Avoid using specific colors, font sizes, font weights, or backgrounds directly in the component's `<style>` block unless absolutely necessary for structural layout. Styling should primarily be controlled by the host Nuxt project's global styles or theme. Use classes for your html elements and wrappers to easily target them inside the css preset file. You can also use the below default vars in your sections which can be overwritten by the preset css
```css
:root {
    --primary-color: #4B5563;
    --secondary-color: #9CA3AF;
    --bg-color: #F9FAFB;
}
```
*   **Utility Classes:** Prefer using utility CSS classes (e.g., Tailwind CSS if the project uses it) for layout and basic styling.
*   **Custom CSS Presets:**
    *   If a section requires unique, complex styling that cannot be achieved with utility classes, create a dedicated CSS file in the [`css-presets/`](css-presets/:0) directory (e.g., `css-presets/my-section.css`).
    *   This file can then be optionally imported by the host project.
    *   Inside this CSS file, scope styles to your section's main class (e.g., `.my-section-view .title { ... }`).
*   **Responsive Design with Container Queries:**
    *   **Use `@container` queries instead of traditional `@media` queries** for component-based responsiveness. This makes sections adapt to their allocated space rather than the viewport size.
    *   Define a container context on a parent element of your section if not already present on `section` tag.
    ```css
    /* In your component's <style> or a css-presets/my-section.css file */
    .my-section-container-wrapper { /* This element wraps your section's content */
      container-type: inline-size; /* or size, or normal */
      container-name: my-section-layout; /* Optional: name the container */
    }

    .my-section-content {
      /* Default styles */
    }

    /* Apply styles when the container 'my-section-layout' is narrower than 600px */
    @container my-section-layout (max-width: 600px) {
      .my-section-content .title {
        font-size: 1.5rem;
      }
      .my-section-content .grid {
        grid-template-columns: 1fr; /* Example: stack items */
      }
    }
    ```

## 4. General Best Practices

### DRY (Don't Repeat Yourself)

*   If you find yourself writing the same function or logic in multiple section components (forms or views), consider extracting it into a reusable utility function.
*   Utility functions can be placed in a shared directory like [`generator/template/ready-to-use-section-types/utils/`](generator/template/ready-to-use-section-types/utils/:0) or a more global `utils` folder if the function is broadly applicable.

### Translations / Internationalization (i18n)

*   All user-facing strings in both form and view components (labels, placeholders, button texts, default content) **must** be translatable.
*   Use the `$t('keyName')` syntax for translations.
*   Add new translation keys to the language files located in [`generator/template/ready-to-use-section-types/lang/`](generator/template/ready-to-use-section-types/i18n/lang/:0) (e.g., `en.js`, `fr.js`).
    ```javascript
    // Example in en.js
    export default {
      forms: {
        mySectionTitle: 'My Section Title',
        // ...
      },
      sections: {
        mySection: {
          readMore: 'Read More'
        }
      }
    }
    ```

### Code Clarity

*   Write clean, well-commented, and easy-to-understand Vue components.
*   Use meaningful names for variables, methods, and props.
*   Follow Vue.js style guide recommendations.
*   Props Naming: `camelCase` in JavaScript, `kebab-case` in templates.
*   Component Naming: `PascalCase` for file names and registration.

By following these guidelines, you'll help create high-quality, consistent, and maintainable sections for the project.

### Section Theming

* You can also contribute to section theming feature to create custom theme forms for your section following [this guide](./SECTION_THEME_CONTRIBUTION.md)