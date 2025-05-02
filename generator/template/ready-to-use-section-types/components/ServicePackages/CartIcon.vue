<template>
  <div class="cart-icon fixed top-4 right-4 z-50" @click="$emit('click')">
    <div class="relative">
      <div class="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <div v-if="totalItems > 0"
        class="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
        {{ totalItems }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartIcon',
  props: {
    totalItems: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
/* Minimal required styling */
</style>