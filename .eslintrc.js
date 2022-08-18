module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    'eslint:recommended',
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/strongly-recommended',
  ],
  // required to lint *.vue files
  plugins: [
    'vue',
  ],
  globals: {
    $: true,
    Vue: true,
    moment: true,
  },
  // add your custom rules here
  rules: {
    'semi': [2, 'never'],
    'no-prototype-builtins': 0,
    'vue/max-attributes-per-line': 'off',
    'vue/require-prop-types': 'off',
    'vue/require-default-prop': 'off',
    'no-console': ['error', { allow: ['log', 'warn', 'error'] }],
    'vue/html-self-closing': ['error', {
      'html': {
        'void': 'always',
        'normal': 'never',
      },
      'svg': 'always',
      'math': 'always',
    }],
    'vue/html-closing-bracket-newline': ['error', {
      'multiline': 'always',
    }],
    'vue/multiline-html-element-content-newline': ['error', {
      'ignoreWhenEmpty': true,
      'ignores': ['pre', 'textarea'],
      'allowEmptyLines': false,
    }],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/name-property-casing': 'off'
  },
}
