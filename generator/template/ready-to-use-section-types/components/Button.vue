<template>
  <button
    class="flex flex-row rounded-lg justify-center items-center m-0"
    :class="[
      {[buttonStyle.disabledWrapper] : disabled === true},
      {[buttonStyle.wrapper] : disabled === false},
      buttonSize.wrapper
    ]"
    :type="submitType"
    :disabled="disabled"
    @click="$emit('button-clicked')"
  >
    <div v-if="paddingSurround" :class="buttonSize.dotWrapper"></div>
    <slot name="leading"></slot>
    <div
         :class="[
            {[buttonStyle.disabledText] : disabled === true},
            {[buttonStyle.text] : disabled === false},
            buttonSize.text
          ]">{{ label }}</div>
    <slot name="trailing"></slot>
    <div v-if="paddingSurround" :class="buttonSize.dotWrapper"></div>
  </button>
</template>

<script>
export default {
  name: "Button",
  props: {
    label: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "primary",
    },
    size: {
      type: String,
      default: "sm",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    paddingSurround: {
      type: Boolean,
      default: false,
    },
    submitType: {
      type: String,
      default: "button",
    }
  },
  computed: {
    buttonStyle() {
      switch (this.type) {
        case 'primary':
          return {
            wrapper: 'shadow-sm border bg-Primary_Color_600 border-Primary_Color_600 hover:bg-Primary_Color_400 hover:border-Primary_Color_400 buttonPrimaryFocused',
            text: 'text-white',
            disabledWrapper: 'border bg-Primary_Color_10 border-Primary_Color_10',
            disabledText: 'text-white'
          }
        case 'outlined':
          return {
            wrapper: 'shadow-sm border border-Gray_300 hover:bg-Gray_50 hover:border-Gray_300 buttonOutlinedFocused',
            text: 'text-Gray_700 hover:text-Gray_800',
            disabledWrapper: 'border bg-white border-Gray_200',
            disabledText: 'text-Gray_300'
          }
        case 'secondary':
          return {
            wrapper: 'shadow-sm border bg-Primary_Color_50 border-Primary_Color_50 hover:bg-Gray_1000 hover:border-Gray_1000 buttonSecondaryFocused',
            text: 'text-Primary_700 hover:text-Primary_Color_800',
            disabledWrapper: 'border bg-Primary_Color_25 border-Primary_Color_25',
            disabledText: 'text-Primary_Color_300'
          }
        case 'tertiary-gray':
          return {
            wrapper: 'hover:bg-Gray_50',
            text: 'text-Gray_600 hover:text-Gray_700',
            disabledWrapper: '',
            disabledText: 'text-Gray_300'
          }
        case 'destructive':
          return {
            wrapper: 'shadow-sm border bg-Error_600 border-Error_600 hover:bg-Error_700 hover:border-Error_700 buttonDestructiveFocused',
            text: 'text-white',
            disabledWrapper: 'border bg-Error_200 border-Error_200',
            disabledText: 'text-white'
          }
        default:
          return {
            wrapper: 'shadow-sm border bg-Primary_Color_600 border-Primary_Color_600 hover:bg-Primary_Color_400 hover:border-Primary_Color_400 buttonPrimaryFocused',
            text: 'text-white',
            disabledWrapper: 'border bg-Primary_Color_10 border-Primary_Color_10',
            disabledText: 'text-white'
          }
      }
    },
    buttonSize() {
      switch(this.size) {
        case 'sm':
          return {
            wrapper: 'px-3.5 py-2 gap-2',
            text: 'text-sm font-semibold',
            dotWrapper: 'w-20px h-20px'
          }
        case 'md':
          return {
            wrapper: 'px-4 py-2.5 gap-2',
            text: 'text-sm font-semibold',
            dotWrapper: 'w-20px h-20px'
          }
        case 'lg':
          return {
            wrapper: 'px-4 py-2.5 gap-2',
            text: 'text-base font-semibold',
            dotWrapper: 'w-21px h-21px'
        }
        case 'xl':
          return {
            wrapper: 'px-5 py-3 gap-2',
            text: 'text-base font-semibold',
            dotWrapper: 'w-20px h-20px'
        }
        case '2xl':
          return {
            wrapper: 'px-7 py-4 gap-3',
            text: 'text-lg font-bold',
            dotWrapper: 'w-24px h-24px'
        }
        default:
          return {
            wrapper: 'px-3.5 py-2 gap-2',
            text: 'text-sm font-semibold',
            dotWrapper: 'w-20px h-20px'
          }
      }
    }
  },
};
</script>

<style>
.buttonPrimaryFocused:focus {
  box-shadow: 0 0 0 4px rgba(244, 235, 255, 1),
   0 1px 2px 0 rgba(16, 24, 40, 0.05) !important;
}
.buttonOutlinedFocused:focus {
  box-shadow: 0 0 0 4px rgba(242, 244, 247, 1),
   0 1px 2px 0 rgba(16, 24, 40, 0.05) !important;
}
.buttonSecondaryFocused:focus {
  box-shadow: 0 0 0 4px #F4EBFF,
  0 1px 2px 0 #1018280D !important;
}
.buttonDestructiveFocused:focus {
  box-shadow: 0 0 0 4px #FEE4E2,
  0 1px 2px 0 #1018280D !important;
}
</style>
