/**
 * 1. 为 vscode eslint 插件提供配置
 * 2. 为 eslint 包提供配置
 * 3. vscode 插件和 'Vue 3 Support - All In One' 插件冲突时去 .vscode/settings.json 配置解决冲突
 */

/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

/** @type { import('eslint').Linter.Config } */
module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    // 解决js文件中 prettier-vscode 插件和eslint配置的冲突问题, 冲突时vscode会出现黄色(warn)/红色(error)波浪线提示
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
      },
    ],
  },
}
