<template>
  <div>
    <div>
      <slot name="region1" class="region1"></slot>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 region2-wrapper">
      <div class="region21-wrapper">
        <slot name="region2-1" class="region21"></slot>
      </div>
      <div class="region22-wrapper">
        <slot name="region2-2" class="region22"></slot>
      </div>
      <div class="region23-wrapper">
        <slot name="region2-3" class="region23"></slot>
      </div>
      <div class="region24-wrapper">
        <slot name="region2-4" class="region24"></slot>
      </div>
    </div>
    <div>
      <slot name="region3" class="region3"></slot>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 region4-wrapper">
      <div class="region41-wrapper">
        <slot name="region4-1" class="region41"></slot>
      </div>
      <div class="region42-wrapper">
        <slot name="region4-2" class="region42"></slot>
      </div>
    </div>
    <div>
      <slot name="region5" class="region5"></slot>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 region6-wrapper">
      <div class="region61-wrapper">
        <slot name="region6-1" class="region61"></slot>
      </div>
      <div class="region62-wrapper">
        <slot name="region6-2" class="region62"></slot>
      </div>
      <div class="region63-wrapper">
        <slot name="region6-3" class="region63"></slot>
      </div>
    </div>
    <div>
      <slot name="region7" class="region7"></slot>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    slotNames: {
      type: Array,
      default() {
        return [
          'region1',
          'region2-1',
          'region2-2',
          'region2-3',
          'region2-4',
          'region3',
          'region4-1',
          'region4-2',
          'region5',
          'region6-1',
          'region6-2',
          'region6-3',
          'region7'
        ]
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
