import globals from 'globals'
import vuePlugin from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  { files: ['**/*.{js,mjs,cjs,vue}'] },
  { languageOptions: { globals: globals.browser } },
  ...vuePlugin.configs['flat/essential'],
  {
    rules: {
      'no-console': 'error',
      'no-debugger': 'error',
      'vue/multi-word-component-names': 'off',
      'local-rules/no-multiline-v-on': 'error',
    },
  },
  {
    plugins: {
      'local-rules': {
        rules: {
          'no-multiline-v-on': {
            meta: {
              type: 'problem',
              docs: {
                description: 'vn-on directives must be single-line to avoid build crashes',
              },
              schema: [],
            },
            create(context) {
              const parserServices = context.sourceCode.parserServices || context.parserServices
              if (!parserServices || !parserServices.defineTemplateBodyVisitor) return {}

              const unwrap = (expr) => {
                while (expr && expr.type === 'ChainExpression') expr = expr.expression
                return expr
              }

              // Multiline is allowed if it's exactly ONE statement/expression (no "a(); b()")
              // and that expression is not a SequenceExpression (no "a(), b()")
              const isSingleStatementHandler = (expr) => {
                expr = unwrap(expr)
                if (!expr) return false

                // vue-eslint-parser usually uses this for multiline v-on handlers
                if (expr.type === 'VOnExpression') {
                  if (expr.body.length !== 1) return false
                  const stmt = expr.body[0]
                  if (stmt.type !== 'ExpressionStatement') return false
                  const inner = unwrap(stmt.expression)
                  return inner && inner.type !== 'SequenceExpression'
                }

                // Non-VOnExpression case (single expression)
                return expr.type !== 'SequenceExpression'
              }

              return parserServices.defineTemplateBodyVisitor({
                "VAttribute[directive=true][key.name.name='on']"(node) {
                  if (!node.value) return
                  if (node.value.loc.start.line === node.value.loc.end.line) return

                  const expr = unwrap(node.value.expression)

                  // Allow arrow functions (existing exception)
                  if (expr?.type === 'ArrowFunctionExpression') return

                  // Allow multiline if it's a single statement/expression
                  if (isSingleStatementHandler(expr)) return

                  context.report({
                    node,
                    message:
                      'Multiline v-on handlers are only allowed when they contain a single statement/expression. Move logic to a method to avoid build crash with unplugin-vue-i18n.',
                  })
                },
              })
            },
          },
        },
      },
    },
  },
  eslintConfigPrettier,
]
