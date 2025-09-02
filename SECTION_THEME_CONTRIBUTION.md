# Custom CSS Guidelines to support sections theming

This document explains how to create custom CSS for your project using predefined CSS variables. All variables are defined globally and can be overridden per section if needed.

---

## 1. CSS Variables

The project exposes the following global CSS variables:

```css
:root {
  --primary-color: #03B1C7;
  --secondary-color: #00131F;
  --background-color: #00131F;
  --hover-background-color: #00131F;
  --base-font-size: 16px;
  --mobile-base-font-size: 16px;
  --base-font-family: "Ubuntu", sans-serif;

  --h1-color: var(--primary-color);
  --h2-color: var(--secondary-color);
  --h3-color: var(--secondary-color);
  --h4-color: var(--secondary-color);
  --h5-color: var(--secondary-color);
  --h6-color: var(--secondary-color);

  --primary-button-text-color: var(--secondary-color);
  --hover-primary-button-text-color: var(--secondary-color);
  --primary-button-background-color: #FFF;
  --hover-primary-button-background-color: #FFF;
  --primary-button-border-color: transparent;
  --hover-primary-button-border-color: transparent;

  --secondary-button-text-color: var(--primary-color);
  --hover-secondary-button-text-color: var(--primary-color);
  --secondary-button-background-color: transparent;
  --hover-secondary-button-background-color: transparent;
  --secondary-button-border-color: transparent;
  --hover-secondary-button-border-color: transparent;

  --link-text-color: var(--primary-color);
  --hover-link-text-color: var(--primary-color);
  --link-background-color: unset;
  --hover-link-background-color: unset;
  --link-border-color: unset;
  --hover-link-border-color: unset;

  --p-color: var(--secondary-color);

  --menu-text-color: #00131F;
  --hover-menu-text-color: #00131F;

  --cookie-background-color: #00131F;
  --hover-cookie-background-color: #00131F;
  --cookie-p-color: white;

  --lists-color: inherit;
  --hover-lists-color: inherit;
  --lists-marker-color: inherit;
  --hover-lists-marker-color: inherit;
}
````

### Notes:

* Each variable is used **globally**.
* You can create **section-specific overrides** by appending `--section` and a unique section identifier. For example:

    * `--section-primary-color` will override `--primary-color` inside a specific section.

---

## 2. Adding Custom CSS

When adding custom CSS, use the section-specific variables if you want to override the global values for a particular section.
Note that `[section-id]` in the example below can be used as is, and it points to the section that has a `section-id` attribute

### Example:

```css
section[section-id] .button-selector, section[section-id] button {
  font-size: 14px;
  border: 1px solid var(--section-primary-button-border-color, var(--primary-button-border-color));
  border-radius: 6px;
  padding: 8px 16px;
  color: var(--section-primary-button-text-color, var(--primary-button-text-color));
  background: var(--section-primary-button-background-color, var(--primary-button-background-color));
}
section[section-id] .button-selector:hover, section[section-id] button:hover {
  font-size: 14px;
  border: 1px solid var(--section-hover-primary-button-border-color, var(--hover-primary-button-border-color));
  border-radius: 6px;
  padding: 8px 16px;
  color: var(--section-hover-primary-button-text-color, var(--hover-primary-button-text-color));
  background: var(--section-hover-primary-button-background-color, var(--hover-primary-button-background-color));
}
```

**Explanation:**

* `var(--section-primary-button-text-color, var(--primary-button-text-color))`
  This uses the section-specific variable if defined, otherwise falls back to the global variable.
* The same pattern applies to all other variables.

---

## 3. Best Practices

1. **Always use the `var()` syntax** to reference variables.
2. **Avoid hardcoding colors or font sizes** unless necessary.
3. **Use section-specific variables** to customize specific areas without affecting the entire site.
---

# Creating a Section Theme Form

To add a custom **theme form** for your section, follow these steps:

1. **Create your form component**

  * Go to the `sections/theme` folder.
  * Create a Nuxt 3 form component for your section.
  * Your component **must follow the same structure, data, and approach** as the existing theme forms.
  * Use these examples for reference:

    * [`sections/theme/RestaurantMenu_settings.vue`](generator/template/ready-to-use-section-types/sections/theme/RestaurantMenu_settings.vue)
    * [`sections/theme/ServicePackages_settings.vue`](generator/template/ready-to-use-section-types/sections/theme/ServicePackages_settings.vue)

2. **Understand the `callDynamicFunction` utility**

  * You’ll see the function `callDynamicFunction` being used.
  * **Use it as is** – do not reimplement it.
  * Its purpose is to call a CMS Cloud function that applies your form values directly to the section preview.

   For context (not for implementation inside the CMS), here’s what happens internally when `applySettingsToCSS` is called:

   ```js
   const applySettingsToCSS = (settings, section, tab, reset, replace) => {
     const styleEl = document.getElementById(`dynamic-section-${tab}-theme-css-vars`)
     if (styleEl) {
       if (reset === true) {
         const regex = new RegExp(
           `section\\[section-id="${section.id}"\\]\\s*\\{[^}]*\\}\\s*`,
           'gm'
         )
         styleEl.innerHTML = styleEl.innerHTML.replaceAll(regex, '')
       } else if (replace === true) {
         const regex = new RegExp(
           `section\\[section-id="${section.id}"\\]\\s*\\{[^}]*\\}\\s*`,
           'gm'
         )
         styleEl.innerHTML = styleEl.innerHTML.replaceAll(
           regex,
           buildSectionCSS(settings, section.id)
         )
       } else {
         styleEl.innerHTML += buildSectionCSS(settings, section.id)
         const regex = new RegExp(
           `section\\[section-id="${section.id}"\\]\\s*\\{[^}]*\\}\\s*`,
           'gm'
         )
         styleEl.innerHTML = styleEl.innerHTML.replaceAll(
           regex,
           buildSectionCSS(settings, section.id)
         )
       }
     } else {
       const style = document.createElement('style')
       style.id = `dynamic-section-${tab}-theme-css-vars`
       document.head.appendChild(style)
     }
   }
   ```

3. **Register your theme form with the section view**

  * After creating your section theme form, you must register it from your section’s view component.
  * Adding the following code will show a **brush icon** next to your section options.
  * Clicking this icon opens the form tabs, which include your new theme component.

   Example inside your `onMounted` hook:

   ```js
   onMounted(() => {
     const sectionsThemeComponents = inject('sectionsThemeComponents')
     sectionsThemeComponents?.(props.section.name, [
       {
         id: 'global',
         name: useI18n().t('sectionsBuilder.globalSettings'),
         path: '/theme/global_settings'
       }, // Keep this as is — it’s automatically handled by CMS Cloud
       {
         id: 'specific',
         name: useI18n().t('sectionsBuilder.specificSettings'),
         path: '/theme/ServicePackages_settings'
       } // Update this to point to your custom theme form component
     ])
   })
   ```