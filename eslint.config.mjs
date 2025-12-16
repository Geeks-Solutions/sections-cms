import globals from 'globals'
import vuePlugin from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  { files: ['**/*.{js,mjs,cjs,vue}'] },
  { languageOptions: { globals: globals.browser } },
  ...vuePlugin.configs['flat/essential'],
  { rules: { 'vue/multi-word-component-names': 'off' } },
  eslintConfigPrettier,
]
