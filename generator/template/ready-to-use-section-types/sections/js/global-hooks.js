// eslint-disable-next-line camelcase
const page_pre_render = (payload, sections, websiteDomain, $sections, $config) => {
  let packageName = ''
  if (payload.metadata && payload.metadata.package && payload.metadata.package.name) {
    packageName = payload.metadata.package.name
  }
  if ($config.SIGNATURE_PACKAGES && $config.SIGNATURE_PACKAGES.split(',').includes(packageName)) {
    if (sections && Array.isArray(sections)) {
      sections.push({
        "error": null,
        "id": "676356813893640006f2acfe",
        "name": "wysiwyg",
        "type": "static",
        "settings": [
          {
            "fr": `<p style="text-align: center;">${packageName === 'free' ? 'Obtenez votre page gratuite avec' : 'Propulsé par'} <a href="${$config && $config.sections.environment === 'testing' ? 'https://sections.k8s-dev.geeks.solutions' : 'https://sections.geeks.solutions'}" target="_blank" class="text-Blue">⚡️Sections</a></p>`,
            "en": `<p style="text-align: center;">${packageName === 'free' ? 'Get your free page with' : 'Powered by'} <a href="${$config && $config.sections.environment === 'testing' ? 'https://sections.k8s-dev.geeks.solutions' : 'https://sections.geeks.solutions'}" target="_blank" class="text-Blue">⚡️Sections</a></p>`
          }
        ],
        "status_code": null,
        "region": {},
        "query_string_keys": null,
        "render_data": "",
        "linked_to": "",
        "weight": 100,
        "altered": true
      })
    }
    if (sections.bottom) {
      sections.bottom.push({
        "error": null,
        "id": "676356813893640006f2acfe",
        "name": "wysiwyg",
        "type": "static",
        "settings": [
          {
            "fr": `<p style="text-align: center;">${packageName === 'free' ? 'Obtenez votre page gratuite avec' : 'Propulsé par'} <a href="${$config && $config.sections.environment === 'testing' ? 'https://sections.k8s-dev.geeks.solutions' : 'https://sections.geeks.solutions'}" target="_blank" class="text-Blue">⚡️Sections</a></p>`,
            "en": `<p style="text-align: center;">${packageName === 'free' ? 'Get your free page with' : 'Powered by'} <a href="${$config && $config.sections.environment === 'testing' ? 'https://sections.k8s-dev.geeks.solutions' : 'https://sections.geeks.solutions'}" target="_blank" class="text-Blue">⚡️Sections</a></p>`
          }
        ],
        "status_code": null,
        "region": {
          "top-right-left-bottom": {
            "slot": "bottom",
            "weight": 100
          }
        },
        "query_string_keys": null,
        "render_data": "",
        "linked_to": "",
        "weight": 100,
        "altered": true
      })
    }
    if (sections.region7) {
      sections.region7.push({
        "error": null,
        "id": "676356813893640006f2acfe",
        "name": "wysiwyg",
        "type": "static",
        "settings": [
          {
            "fr": `<p style="text-align: center;">${packageName === 'free' ? 'Obtenez votre page gratuite avec' : 'Propulsé par'} <a href="${$config && $config.sections.environment === 'testing' ? 'https://sections.k8s-dev.geeks.solutions' : 'https://sections.geeks.solutions'}" target="_blank" class="text-Blue">⚡️Sections</a></p>`,
            "en": `<p style="text-align: center;">${packageName === 'free' ? 'Get your free page with' : 'Powered by'} <a href="${$config && $config.sections.environment === 'testing' ? 'https://sections.k8s-dev.geeks.solutions' : 'https://sections.geeks.solutions'}" target="_blank" class="text-Blue">⚡️Sections</a></p>`
          }
        ],
        "status_code": null,
        "region": {
          "extended-layout": {
            "slot": "region7",
            "weight": 100
          }
        },
        "query_string_keys": null,
        "render_data": "",
        "linked_to": "",
        "weight": 100,
        "altered": true
      })
    }
    return sections
  } else return null
}

// eslint-disable-next-line camelcase
const page_pre_load = (payload) => {
  if (payload.query_string && !payload.query_string.categories_titles) {
    payload.query_string = {
      ...payload.query_string,
      categories_titles: null
    }
  }
  return payload
}

// eslint-disable-next-line camelcase
const update_section_name = (name) => {
  if (name === 'TextImage') {
    return 'TextMedia'
  } else return name
}

module.exports = {
  page_pre_render,
  page_pre_load,
  update_section_name
};
