 

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

// Setup ESM __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Forms translation management
// 👇️ Change this to match your section component names
const sectionForms = [
  'FAQ',
  'Features',
  'GoogleMaps',
  'ImageGallery',
  'InteractiveDisplay',
  'Plans',
  'Redirection',
  'RestaurantMenu',
  'ServicePackages',
  'SimpleCTA',
  'SimpleMenu',
  'TextImage',
  'ZAQWidget',
]

// 👇️ Shared translations (optional, always included if present)
const sharedTranslationFile = path.resolve(
  __dirname,
  'sections/forms/Shared_i18n.json',
)

// Helper: flatten nested keys
function flattenKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, val]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    return typeof val === 'object' && val !== null
      ? flattenKeys(val, fullKey)
      : [fullKey]
  })
}

// Helper: extract all $t() or t() keys from .vue content
function extractUsedKeys(content) {
  const regex = /(?<![\w.])(?:\$t|t)\(\s*(['"`])([^'"`]+)\1\s*\)/g
  const keys = new Set()
  let match
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[2]) // ⬅️ the captured key inside the quotes
  }
  return keys
}

// Load shared translations
let sharedTranslations = {}
try {
  const sharedContent = await fs.readFile(sharedTranslationFile, 'utf-8')
  sharedTranslations = JSON.parse(sharedContent)
} catch (_) {
  // Shared file is optional
}

// Main logic
let hasMissing = false

for (const section of sectionForms) {
  const vueFile = path.resolve(__dirname, `sections/forms/${section}.vue`)
  const i18nFile = path.resolve(
    __dirname,
    `sections/forms/${section}_i18n.json`,
  )

  let vueContent = ''
  try {
    vueContent = await fs.readFile(vueFile, 'utf-8')
  } catch (err) {
    console.error(`❌ Vue file not found for section "${section}": ${vueFile}`)
    hasMissing = true
    continue
  }

  const usedKeys = extractUsedKeys(vueContent)

  // Load translation JSON if exists (fallback to empty)
  let localTranslations = {}
  try {
    const localContent = await fs.readFile(i18nFile, 'utf-8')
    localTranslations = JSON.parse(localContent)
  } catch (_) {
    // File might not exist, fallback to shared only
  }

  // Merge shared + local translations
  const languages = new Set([
    ...Object.keys(sharedTranslations),
    ...Object.keys(localTranslations),
  ])

  for (const lang of languages) {
    const sharedLangKeys = flattenKeys(sharedTranslations[lang] || {})
    const localLangKeys = flattenKeys(localTranslations[lang] || {})
    const availableKeys = new Set([...sharedLangKeys, ...localLangKeys])

    const missing = [...usedKeys].filter((k) => !availableKeys.has(k))
    if (missing.length > 0) {
      hasMissing = true
      const relativeVuePath = path.relative(__dirname, vueFile)
      console.error(
        `❌ Missing keys in file "${relativeVuePath}" for language "${lang}":`,
      )
      missing.forEach((k) => console.error(`  - ${k}`))
    }
  }
}

if (!hasMissing) {
  console.log(
    '✅ All translation keys are present in all sections forms and languages.',
  )
}

let hasMissingViews = false

// Views translation management
const sectionViews = [
  'FAQ_static',
  'Features_static',
  'GoogleMaps_static',
  'ImageGallery_static',
  'InteractiveDisplay_static',
  'Plans_static',
  'Redirection_static',
  'RestaurantMenu_static',
  'ServicePackages_static',
  'SimpleCTA_static',
  'SimpleMenu_static',
  'TextImage_static',
  'ZAQWidget_static',
]

for (const section of sectionViews) {
  const vueFile = path.resolve(__dirname, `sections/views/${section}.vue`)
  const i18nFile = path.resolve(
    __dirname,
    `sections/forms/${section.replace('_static', '')}_i18n.json`,
  )

  let vueContent = ''
  try {
    vueContent = await fs.readFile(vueFile, 'utf-8')
  } catch (err) {
    console.error(`❌ Vue file not found for section "${section}": ${vueFile}`)
    hasMissingViews = true
    continue
  }

  const usedKeys = extractUsedKeys(vueContent)

  // Load translation JSON if exists (fallback to empty)
  let localTranslations = {}
  try {
    const localContent = await fs.readFile(i18nFile, 'utf-8')
    localTranslations = JSON.parse(localContent)
  } catch (_) {
    // File might not exist, fallback to shared only
  }

  // Merge shared + local translations
  const languages = new Set([
    ...Object.keys(sharedTranslations),
    ...Object.keys(localTranslations),
  ])

  for (const lang of languages) {
    const sharedLangKeys = flattenKeys(sharedTranslations[lang] || {})
    const localLangKeys = flattenKeys(localTranslations[lang] || {})
    const availableKeys = new Set([...sharedLangKeys, ...localLangKeys])

    const missing = [...usedKeys].filter((k) => !availableKeys.has(k))
    if (missing.length > 0) {
      hasMissingViews = true
      const relativeVuePath = path.relative(__dirname, vueFile)
      console.error(
        `❌ Missing keys in file "${relativeVuePath}" for language "${lang}":`,
      )
      missing.forEach((k) => console.error(`  - ${k}`))
    }
  }
}

if (!hasMissingViews) {
  console.log(
    '✅ All translation keys are present in all sections views and languages.',
  )
}

// Components validation
// 👇️ Configurable: map each .vue file to its translation file
let componentsHasMissing = false

const componentTranslations = {
  'components/Blogs/ArticleButton.vue': 'sections/forms/Blogs_i18n.json',
  'components/Blogs/ArticlesCategories.vue': 'sections/forms/Blogs_i18n.json',
  'components/Blogs/AuthorView.vue': 'sections/forms/Blogs_i18n.json',
  'components/Blogs/FullArticle.vue': 'sections/forms/Blogs_i18n.json',
  'components/UnifiedMenu/CategoryList.vue': [
    'sections/forms/ServicePackages_i18n.json',
    'sections/forms/RestaurantMenu_i18n.json',
  ],
  'components/UnifiedMenu/ItemModal.vue': [
    'sections/forms/ServicePackages_i18n.json',
    'sections/forms/RestaurantMenu_i18n.json',
  ],
  'components/UnifiedMenu/ItemsGrid.vue': [
    'sections/forms/ServicePackages_i18n.json',
    'sections/forms/RestaurantMenu_i18n.json',
  ],
  'components/UnifiedMenu/ShoppingCart.vue': [
    'sections/forms/ServicePackages_i18n.json',
    'sections/forms/RestaurantMenu_i18n.json',
  ],
  'components/LinkDescription.vue': 'sections/forms/Shared_i18n.json',
  'components/ListPagination.vue': 'sections/forms/Blogs_i18n.json',
}

// Logic for components directory
for (const [vueRelativePath, i18nPaths] of Object.entries(
  componentTranslations,
)) {
  const vueFile = path.resolve(__dirname, vueRelativePath)

  // Normalize to array for easier processing
  const translationFiles = Array.isArray(i18nPaths) ? i18nPaths : [i18nPaths]

  let vueContent = ''
  try {
    vueContent = await fs.readFile(vueFile, 'utf-8')
  } catch (err) {
    console.error(`❌ Vue file not found: ${vueRelativePath}`)
    componentsHasMissing = true
    continue
  }

  const usedKeys = extractUsedKeys(vueContent)

  // Merge all translation files for this component
  const mergedTranslations = {}

  for (const relativePath of translationFiles) {
    const i18nFile = path.resolve(__dirname, relativePath)
    try {
      const localContent = await fs.readFile(i18nFile, 'utf-8')
      const localTranslations = JSON.parse(localContent)

      for (const [lang, messages] of Object.entries(localTranslations)) {
        if (!mergedTranslations[lang]) mergedTranslations[lang] = {}
        // Deep merge messages (shallow is okay if no nesting overlap)
        mergedTranslations[lang] = {
          ...mergedTranslations[lang],
          ...messages,
        }
      }
    } catch (_) {
      console.warn(
        `⚠️  Translation file not found for ${vueRelativePath}: ${relativePath}`,
      )
      // Continue with what we have
    }
  }

  const languages = Object.keys(mergedTranslations)

  for (const lang of languages) {
    const langKeys = flattenKeys(mergedTranslations[lang] || {})
    const availableKeys = new Set(langKeys)

    const missing = [...usedKeys].filter((k) => !availableKeys.has(k))
    if (missing.length > 0) {
      componentsHasMissing = true
      const relativeVuePath = path.relative(__dirname, vueFile)
      console.error(
        `❌ Missing keys in file "${relativeVuePath}" for language "${lang}":`,
      )
      missing.forEach((k) => console.error(`  - ${k}`))
    }
  }
}

if (!componentsHasMissing) {
  console.log(
    '✅ All translation keys are present in all components and languages.',
  )
}

if (hasMissing || componentsHasMissing || hasMissingViews) {
  process.exit(1)
}
