<template>
  <div>
    <Sections
        :admin="admin"
        :page-name="pageName"
        :lang="lang"
        :variations="[]"
    />
  </div>
</template>

<script>
export default {
  name: "dynamicSectionsPage",
  data() {
    return {
      pageName: this.$route.params.url
    };
  },
  computed: {
    lang() {
      return this.$i18n.locale.toString()
    },
    admin() {
      return !!this.$cookies.get("sections-auth-token")
    }
  }
};
</script>
