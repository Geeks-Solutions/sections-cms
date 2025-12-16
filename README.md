# vue-cli-plugin-sections

A Vue CLI plugin to automate the installation and configuration of **[@geeks.solutions/nuxt-sections](https://www.npmjs.com/package/@geeks.solutions/nuxt-sections)** (Nuxt 3) and **[@geeks.solutions/vue-sections](https://www.npmjs.com/package/@geeks.solutions/vue-sections)** (Vue 2 - _Deprecated_).

## Quick Start

### 1. Prerequisites

- Node.js version `22.16.0` or higher.
- A Nuxt 3 project. (e.g. `npm create nuxt <your-project-name> -- -t v3`)

### 2. Installation

Run the following commands in your project root:

```bash
# 1. Install the plugin
npm install @geeks.solutions/vue-cli-plugin-sections

# 2. Install Vue CLI globally (required for 'invoke')
npm install -g @vue/cli

# 3. Configure the library
vue invoke '@geeks.solutions/vue-cli-plugin-sections'
```

### 3. Configuration Wizard

The plugin will prompt you for:

- **Version**: Choose "Nuxt js" (Recommended) or "Vue js" (Deprecated).
- **Project Details**: Your project URL (e.g., `http://localhost:8000`) and Project ID.
- **Content**: Option to add ready-to-use section types and a configured landing page.

---

## Features

When selecting **NuxtJS**, the plugin automatically handles:

- **Dependencies**: Installs `@geeks.solutions/nuxt-sections`, `@nuxtjs/tailwindcss`, `@nuxtjs/i18n`, `@nuxt/image`, and other essentials.
- **Configuration**: Updates `nuxt.config.ts` (modules, runtimeConfig) and enables gzip/brotli compression in Nitro.
- **Scaffolding**:
  - Creates a dynamic page at `/pages/_url.vue`.
  - Generates i18n configuration files in `/i18n/lang/`.
  - (Optional) Adds 13 fully customizable section components to your project.

## Legacy Support (Vue 2)

Installation for Vue 2 is supported but deprecated. It installs `bootstrap-vue`, `nuxt-i18n`, and scaffolds `plugins/sections.js`.

- **Note**: If adding section components in Vue 2, you must manually update imports in `wysiwyg.vue` and `nftSection.vue` to point to `@geeks.solutions/vue-sections`.

## Contributing

- [General Contribution Guidelines](https://github.com/Geeks-Solutions/vue-cli-plugin-sections/wiki/contributors-guidelines)
- [Creating New Section Components](CONTRIBUTING_SECTIONS.md)
- [Creating New themes](SECTION_THEME_CONTRIBUTION.md)
