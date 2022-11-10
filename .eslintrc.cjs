/**
 * 1. 为 vscode eslint 插件提供配置
 * 2. 为 eslint 包提供配置
 * 3. vscode eslint 插件和 'Vue 3 Support - All In One' 插件冲突时去 .vscode/settings.json 配置解决冲突
 * 4. vscode eslint 插件和 'Prettier - Code formatter' 插件冲突时去 .prettierrc.cjs 配置解决冲突
 * 原理 eslint 插件读取此配置进行代码校验，上述两格式化插件读取各自配置文件对文件进行格式化，如果出现冲突，需保持配置一致，也就是格式化插件的配置和
 * 下面 'rules.prettier/prettier' 的配置保持一致即可，最好做到三者保持一致🦔
 */

/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

/** @type { import('eslint').Linter.Config } */
module.exports = {
  root: true,
  // eslint-disable-next-line prettier/prettier
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-prettier', './.eslintrc-auto-import.json'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    // 解决文件中 格式化插件(prettier-vscode, Vue 3 Support - All In One)和格式化后的代码和 eslint 插件规则的冲突问题,
    // 冲突时vscode会出现黄色(warn)/ 红色(error)波浪线提示
    'prettier/prettier': [
      'warn',
      {
        // 配置项 https://prettier.io/docs/en/options.html
        singleQuote: true,
        arrowParens: 'avoid',
        printWidth: 120, // 需要和vue组件格式化插件'Vue 3 Support - All In One'的设置保持一致，不然会产生冲突导致黄色下波浪线
      },
    ],
    'vue/multi-word-component-names': 'off',
    'vue/require-valid-default-prop': 'off',
    'vue/no-mutating-props': 'off',
  },
}
