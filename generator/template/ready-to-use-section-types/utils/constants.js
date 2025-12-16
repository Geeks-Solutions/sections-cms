import { useFetch, useNuxtApp } from '#app'
import { useRouter, useRoute } from '#imports'

export const BLOGS_LIST_SIZE = 12

export const BLOGS_SECTION_PAGE_PATH = '/blogs'

export function getTranslation(settings, lang, primaryKey, frKey) {
  if (settings[lang]) {
    if (lang === 'fr') {
      return settings[lang][primaryKey] === ''
        ? settings[frKey]
        : settings[lang][primaryKey]
    } else
      return settings[lang][primaryKey] === ''
        ? settings[primaryKey]
        : settings[lang][primaryKey]
  } else return lang === 'fr' ? settings[frKey] : settings[primaryKey]
}

export function getArray(settings, lang, primaryKey, frKey) {
  if (settings[lang]) {
    if (lang === 'fr') {
      if (settings[lang][primaryKey] != null) {
        return settings[lang][primaryKey] === ''
          ? settings[frKey] === ''
            ? []
            : settings[frKey].split('-')
          : settings[lang][primaryKey].split('-')
      }
    } else
      return settings[lang][primaryKey] === ''
        ? settings[primaryKey] === ''
          ? []
          : settings[primaryKey].split('-')
        : settings[lang][primaryKey].split('-')
  } else
    return lang === 'fr'
      ? settings[frKey] && settings[frKey] !== ''
        ? settings[frKey].split('-')
        : []
      : settings[primaryKey] && settings[primaryKey] !== ''
        ? settings[primaryKey].split('-')
        : []
}

export function getFormsKeysTranslation(val) {
  if (val.en) {
    for (let i = 0; i < Object.keys(val.en).length; i++) {
      if (val.en[Object.keys(val.en)[i]] === '')
        val.en[Object.keys(val.en)[i]] = val[Object.keys(val.en)[i]]
    }
  }
  if (val.fr) {
    for (let i = 0; i < Object.keys(val.fr).length; i++) {
      if (val.fr[Object.keys(val.fr)[i]] === '')
        val.fr[Object.keys(val.fr)[i]] = val[Object.keys(val.fr)[i] + '_fr']
    }
  }
}

// Function to extract query string values from url path
export function extractQsValue(key, path, ctTitles = false) {
  let finalPath = ''
  if (path) {
    finalPath = path
  } else {
    const route = useRoute()
    finalPath = route.path
  }
  if (
    finalPath &&
    finalPath.includes('categories_titles') &&
    ctTitles === true
  ) {
    return decodeURIComponent(
      finalPath.substring(
        finalPath.indexOf('categories_titles[]=') + 20,
        finalPath.length,
      ),
    )
  } else if (finalPath && finalPath.includes(key)) {
    return decodeURIComponent(
      finalPath.match(new RegExp(`${key}=([^/]+)`))?.[1],
    )
  } else return ''
}

export function parseTime(timestamp) {
  const timestampInMs = timestamp * 1000
  const date = new Date(timestampInMs)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function copyText(text) {
  try {
    navigator.clipboard.writeText(text)
  } catch {}
}

// Function to update the query string value of a specific key
export function updateQueryStringValue(path, params, autoRedirect = true) {
  try {
    let newPath = decodeURIComponent(path)
    Object.keys(params).forEach((key) => {
      const newValue = params[key]
      const regex = new RegExp(`(/${key}=)[^/]*`)
      if (newValue === null) {
        newPath = newPath.replace(regex, ``)
      } else if (newPath.match(regex)) {
        newPath = newPath.replace(regex, `/${key}=${newValue}`)
      } else if (newPath.includes('categories_titles')) {
        newPath = newPath.replace(
          newPath.substring(
            newPath.indexOf('categories_titles'),
            newPath.length,
          ),
          `${key}=${newValue}`,
        )
      } else {
        newPath += `/${key}=${newValue}`
      }
    })
    window.history.replaceState(null, '', newPath)
    if (autoRedirect && autoRedirect === true) {
      const router = useRouter()
      router.push(newPath)
    }
    return newPath
  } catch {
    return path
  }
}

export async function getSectionsPages(sectionHeader) {
  const app = useNuxtApp()
  try {
    const pagesResponse = await useFetch(
      `${app.$sections.serverUrl}/project/${app.$sections.projectId}/pages`,
      {
        method: 'GET',
        headers: sectionHeader,
      },
    )
    if (
      pagesResponse &&
      pagesResponse.data &&
      pagesResponse.status.value &&
      pagesResponse.status.value === 'success'
    ) {
      return pagesResponse.data
    } else return []
  } catch {
    return []
  }
}

export function scrollToFirstError(errors) {
  for (const key of Object.keys(errors)) {
    if (errors[key] && !Array.isArray(errors[key])) {
      const targetElement = document.getElementById(key)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
      break
    }
  }
}

export const sectionsStyle = {
  input:
    'py-4 pl-6 border border-FieldGray rounded-xl h-[48px] w-full focus:outline-none',
  textarea:
    'py-4 pl-6 border border-FieldGray rounded-xl w-full focus:outline-none resize-none h-32',
  fieldLabel: 'font-bold',
  wysiwygHtml: 'ql-editor ql-snow h-auto',
  pageSectionStyle: 'md:mx-auto max-w-7xl md:px-2 sm:px-6 lg:px-8 mx-4',
  sectionsPagePad: 'md:mx-auto max-w-[1440px] md:pl-[15px] md:pr-[15px]',
}

export function openLink(link) {
  window.open(
    link,
    link[0] === '#' ? '_self' : link.includes('https://') ? '_blank' : '_self',
  )
}

export function linkSanitizer(link) {
  if (link.startsWith('//')) {
    link = link.substring(1)
  }
  return link
}

export function fallBackLink(link, lang) {
  if (typeof link === 'string') {
    link = {
      [lang]: link,
    }
  }
  if (link && !link[lang]) {
    return linkSanitizer(link.en ? link.en.trim() : '')
  } else {
    return linkSanitizer(link[lang] ? link[lang].trim() : '')
  }
}

export function linkTarget(link) {
  if (link && link[0] === '#') {
    return '_self'
  } else if (link && link.includes('http')) {
    return '_blank'
  } else {
    return '_self'
  }
}

export function isAnchorOrExternalLink(link) {
  if (link && link[0] === '#') {
    return true
  } else return link && link.includes('http')
}

export function emitGlobalEvent(link, target, event) {
  try {
    event.preventDefault()
  } catch {}
  if (isGlobalEvent(link)) {
    const { $event } = useNuxtApp()
    $event(link)
  } else window.open(link, target || linkTarget(link))
}

export function isGlobalEvent(link) {
    return globalEvents.includes(link)
}

export const globalEvents = []

export function formatPrice(price, currency = '$') {
  const numPrice = parseFloat(price)
  if (isNaN(numPrice)) return '0'
  
  // For LBP, no decimals and add thousand separators
  if (currency === 'LBP') {
    return Math.round(numPrice).toLocaleString('en-US')
  }
  
  // For other currencies, show 2 decimals
  return numPrice.toFixed(2)
}

export function generateWhatsAppMessage(
  cart,
  type,
  lang,
  i18n,
  currencySymbol = '$',
  total = 0,
) {
  const isService = type === 'service'

  // If cart is empty, return a default message
  if (!cart || cart.length === 0) {
    return isService
      ? i18n('whatsapp.defaultServiceMessage') ||
          'Hello! I would like to book a service.'
      : i18n('whatsapp.defaultOrderMessage') ||
          'Hello! I would like to place an order.'
  }

  // Create header message
  const headerMessage = isService
    ? i18n('whatsapp.serviceCartHeader') ||
      'Hello! I would like to book the following services:'
    : i18n('whatsapp.orderCartHeader') ||
      'Hello! I would like to order the following items:'

  let message = `${headerMessage}\n\n`

  // Add each item to the message
  cart.forEach((item, index) => {
    const itemName =
      typeof item.name === 'object'
        ? item.name[lang] || item.name.en
        : item.name
    message += `${index + 1}. ${itemName}`

    if (item.quantity > 1) {
      message += ` (${i18n('whatsapp.quantity') || 'Qty'}: ${item.quantity})`
    }

    if (item.notes) {
      message += ` - ${i18n('whatsapp.notes') || 'Notes'}: ${item.notes}`
    }

    message += '\n'
  })

  // Add total if provided
  if (total > 0) {
    message += `\n${i18n('whatsapp.total') || 'Total'}: ${currencySymbol}${formatPrice(total,currencySymbol)}`
  }

  // Add closing message
  message += `\n\n${i18n('whatsapp.thankYou') || 'Thank you!'}`

  return message
}

export const importAsset = (path) => {
  try {
    const images = import.meta.glob("/assets/icons/**/*", {eager: true});
    return images[path].default;
  } catch {
    return ''
  }
}

export const parseHtml = (html) => {
  try {
    let parsedHtml = ''
    if (process.client) {
      const doc = new DOMParser().parseFromString(html, 'text/html')
      parsedHtml = doc.body.textContent || ''
    } else {
      // Simple fallback for SSR
      parsedHtml = html.replace(/<[^>]*>?/gm, '').trim()
    }
    return parsedHtml
  } catch {
    return ''
  }
}

export const assignMediaObject = (mediaObject) => {
  const media = {
    media_id: '',
    url: '',
    thumbnail_url: '',
    seo_tag: '',
    metadata: '',
    filename: '',
    headers: {},
  }
  media.media_id = mediaObject.id
  media.url = mediaObject.files[0].url
  media.thumbnail_url = mediaObject.files[0].thumbnail_url
  media.seo_tag = mediaObject.seo_tag
  media.filename = mediaObject.files[0].filename
  if (mediaObject.files[0].headers) {
    media.headers = mediaObject.files[0].headers
  }
  media.metadata = mediaObject.metadata
  return media
}

export async function callDynamicFunction(filePath, fnName, ...args) {
  try {
    const builderHooksJavascript = importJs(filePath)
    if (
      builderHooksJavascript &&
      typeof builderHooksJavascript[fnName] === 'function'
    ) {
      return builderHooksJavascript[fnName](...args)
    } else {
      return null
    }
  } catch {
    return null
  }
}
