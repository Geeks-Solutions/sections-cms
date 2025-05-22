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

export {
  page_pre_load,
  update_section_name
};
