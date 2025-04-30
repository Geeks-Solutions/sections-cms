<template>
  <div class="cart-icon fixed top-4 right-4 z-50" @click="$emit('click')">
    <div class="relative">
      <div class="cart-button p-3 rounded-full shadow-md hover:cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          width="24" height="24">
          <path v-if="cartType === 'shopping'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <div v-if="totalItems > 0"
        class="cart-item-count absolute -top-2 -right-2 rounded-full h-6 w-6 flex items-center justify-center text-xs"
        :class="cartType === 'shopping' ? 'cart-count-restaurant' : 'cart-count-service'">
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
    },
    cartType: {
      type: String,
      default: 'shopping', // 'shopping' or 'service'
      validator: value => ['shopping', 'service'].includes(value)
    }
  }
}
</script>