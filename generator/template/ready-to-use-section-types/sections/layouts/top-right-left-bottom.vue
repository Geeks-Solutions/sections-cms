<template>
  <div>
    <div class="top-wrapper">
      <slot name="top"></slot>
    </div>
    <div class="flex flex-col px-2.5 md:px-24 md:pb-16 bg-Gray_50 mt-8 md:mt-0">
      <div class="flex flex-col md:flex-row justify-between gap-4 md:gap-10">
        <div class="left-wrapper">
          <slot name="left"></slot>
        </div>
        <div class="right-wrapper">
          <slot name="right"></slot>
        </div>
      </div>
    </div>
    <div class="bottom-wrapper">
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

<style>
.left-wrapper {
  width: 100%;
}
.right-wrapper {
  width: 100%;
}
@media (min-width: 768px) {
  .left-wrapper {
    width: 50%;
  }
  .right-wrapper {
    width: 50%;
  }
}
</style>
