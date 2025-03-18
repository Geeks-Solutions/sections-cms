export const state = () => ({
    packageData: null,
    categoriesTitles: '',
});

export const mutations = {
    setPackageData(state, packageData) {
        state.packageData = packageData;
    },
    setCategoriesTitles(state, value) {
      state.categoriesTitles = value;
    }
};

export const getters = {
  getCategoriesTitles: state => state.categoriesTitles,
}
