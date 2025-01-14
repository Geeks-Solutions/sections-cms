export const BLOGS_LIST_SIZE = 12

export const BLOGS_SECTION_PAGE_PATH = '/blogs'

export function getTranslation(settings, lang, primaryKey, frKey) {
  if(settings[lang]) {
    if(lang === 'fr') {
      return settings[lang][primaryKey] === '' ? settings[frKey] : settings[lang][primaryKey]
    } else return settings[lang][primaryKey] === '' ? settings[primaryKey] : settings[lang][primaryKey]
  } else return lang === 'fr' ? settings[frKey] : settings[primaryKey]
}

export function getArray(settings, lang, primaryKey, frKey) {
    if(settings[lang]) {
        if(lang === 'fr') {
            if(settings[lang][primaryKey] != null) {
                return settings[lang][primaryKey] === '' ? settings[frKey] === '' ? [] : settings[frKey].split('-') : settings[lang][primaryKey].split('-')
            }
        } else return settings[lang][primaryKey] === '' ? settings[primaryKey] === '' ? [] : settings[primaryKey].split('-') : settings[lang][primaryKey].split('-')
    } else return lang === 'fr' ? (settings[frKey] && settings[frKey] !== '') ? settings[frKey].split('-') : [] : (settings[primaryKey] && settings[primaryKey] !== '') ? settings[primaryKey].split('-') : []
}

export function getFormsKeysTranslation(val) {
    if(val.en) {
        for(let i = 0; i < Object.keys(val.en).length; i++) {
            if(val.en[Object.keys(val.en)[i]] === '') val.en[Object.keys(val.en)[i]] = val[Object.keys(val.en)[i]]
        }
    }
    if(val.fr) {
        for(let i = 0; i < Object.keys(val.fr).length; i++) {
            if(val.fr[Object.keys(val.fr)[i]] === '') val.fr[Object.keys(val.fr)[i]] = val[Object.keys(val.fr)[i]+'_fr']
        }
    }
}

export function showToast($toast, variant, message) {
  $toast[variant](message, {
      position: "top-right",
      timeout: 5000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: "button",
      icon: false,
      rtl: false
    })
}

// Function to extract query string values from url path
export function extractQsValue(key, path, ctTitles = false) {
    let finalPath = ''
    if (path) {
        finalPath = path
    } else if (window.$nuxt) {
        finalPath = window.$nuxt.$route.path;
    }
    if (finalPath && finalPath.includes('categories_titles') && ctTitles === true) {
        return decodeURIComponent(finalPath.substring(finalPath.indexOf('categories_titles[]=') + 20, finalPath.length))
    } else if (finalPath && finalPath.includes(key)) {
        return decodeURIComponent(finalPath.match(new RegExp(`${key}=([^/]+)`))?.[1])
    } else return ''
}

export function parseTime(timestamp) {
    const timestampInMs = timestamp * 1000;
    const date = new Date(timestampInMs);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

export function copyText(text) {
    try {
        navigator.clipboard.writeText(text)
    } catch {
    }
}

// Function to update the query string value of a specific key
export function updateQueryStringValue(path, params, autoRedirect = true) {
    try {
        let newPath = decodeURIComponent(path);
        Object.keys(params).forEach(key => {
            const newValue = params[key];
            const regex = new RegExp(`(/${key}=)[^/]*`);
            if (newValue === null) {
                newPath = newPath.replace(regex, ``);
            } else if (newPath.match(regex)) {
                newPath = newPath.replace(regex, `/${key}=${newValue}`);
            } else if (newPath.includes('categories_titles')) {
                newPath = newPath.replace(newPath.substring(newPath.indexOf('categories_titles'), newPath.length), `${key}=${newValue}`);
            } else {
                newPath += `/${key}=${newValue}`;
            }
        });
        window.history.replaceState(null, '', newPath);
        if (autoRedirect && autoRedirect === true) {
            window.$nuxt.$router.push(newPath)
        }
        return newPath
    } catch {
        return path
    }
}

export async function getSectionsPages(sectionHeader) {
    try {
        const pagesResponse = await window.$nuxt.$axios.get(
            `${window.$nuxt.$sections.serverUrl}/project/${window.$nuxt.$sections.projectId}/pages`,
            {
                headers: sectionHeader
            }
        )
        if (pagesResponse && pagesResponse.data) {
            return pagesResponse.data
        } else return []
    } catch {
        return []
    }
}

export function scrollToFirstError(errors) {
    for (const key of Object.keys(errors)) {
        if (errors[key] && !Array.isArray(errors[key])) {
            const targetElement = document.getElementById(key);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
            break;
        }
    }
}

export const sectionsStyle = {
    input: 'py-4 pl-6 border border-FieldGray rounded-xl h-48px w-full focus:outline-none',
    fieldLabel: 'font-bold',
    wysiwygHtml: 'ql-editor ql-snow h-auto',
    pageSectionStyle: 'md:mx-auto max-w-7xl md:px-2 sm:px-6 lg:px-8 mx-4',
    sectionsPagePad: 'md:mx-auto max-w-[1440px] md:pl-[15px] md:pr-[15px]'
}

export function openLink(link) {
    window.open(link, link[0] === "#" ? '_self' : link.includes('https://') ? '_blank' : '_self')
}

export function fallBackLink(link, lang) {
    if (link && !link[lang]) {
        return link.en ? link.en.trim() : ''
    } else {
        return link[lang] ? link[lang].trim() : ''
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
    } else return (link && link.includes('http'));
}

export function emitGlobalEvent(link, target) {
    if (isGlobalEvent(link)) {
        if (link === '#loginRegister') {
            window.$nuxt.$emit(link)
        } else {
            window.$nuxt.$emit(link)
        }
    } else window.open(link, target || linkTarget(link))
}

export function isGlobalEvent(link) {
    return globalEvents.includes(link)
}

export const globalEvents = []
