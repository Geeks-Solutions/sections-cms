<template>
  <div>
    <div>
      <slot name="top"></slot>
    </div>
    <div class="flex flex-col px-2.5 md:px-24 md:pb-16 bg-Gray_50 mt-8 md:mt-0">
      <div class="flex flex-col md:flex-row justify-between gap-4 md:gap-10">
        <slot name="left"></slot>
        <slot name="right"></slot>
      </div>
    </div>
    <div>
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    slotNames: {
      type: Array,
      default() {
        return ['top', 'left', 'right', 'bottom']
      },
    },
    lang: {
      type: String,
      default: ''
    },
    locales: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>
