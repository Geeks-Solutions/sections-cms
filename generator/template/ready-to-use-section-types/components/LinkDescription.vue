<template>
  <div class="flex flex-col text-start gap-1">
    <span class="text-xs text-Gray_800">{{
      $t('forms.linksDescription1')
    }}</span>
    <span class="text-xs text-Gray_800">{{
      $t('forms.linksDescription2')
    }}</span>
    <span class="text-xs text-Gray_800">{{
      $t('forms.linksDescription3')
    }}</span>
  </div>
</template>

<i18n src="../sections/forms/Shared_i18n.json"></i18n>

<script>
export default {
  name: 'LinkDescription',
  setup() {
    const { t } = useI18n({
      useScope: 'local',
    })

    return {
      $t: t,
    }
  },
}
</script>
