module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'prettier'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    "no-console": 2,
    'no-debugger': 'error',
    'no-useless-escape': 'off',
    'vue/no-v-html': 'off',
    'vue/no-use-v-if-with-v-for': 'off'
  }
}
