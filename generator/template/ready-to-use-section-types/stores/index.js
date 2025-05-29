import { defineStore } from 'pinia'

export const useSectionsStore = defineStore('sectionsStore', {
  // State: equivalent to Vuex state
  state: () => ({
    packageData: null,
    categoriesTitles: '',
    cookieConsentActivated: false,
    gtmId: null,
  }),

  // Getters: equivalent to Vuex getters
  getters: {
    getCategoriesTitles: (state) => state.categoriesTitles,
    getCookieConsentActivated: (state) => state.cookieConsentActivated,
    getGtmId: (state) => state.gtmId,
  },

  // Actions: equivalent to Vuex mutations and actions
  actions: {
    // In Pinia, mutations are replaced with actions
    setPackageData(packageData) {
      this.packageData = packageData;
    },
    setCategoriesTitles(value) {
      this.categoriesTitles = value;
    },
    setCookieConsentActivated(value) {
      this.cookieConsentActivated = value;
    },
    setGtmId(value) {
      this.gtmId = value;
    }
  }
})
