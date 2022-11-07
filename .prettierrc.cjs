/**
 * 1. 为 prettier-vscode 插件提供配置
 * 2. 为 pretter 包提供配置
 * 3. 本项目 .js/.cjs文件采用 prettier 插件进行格式化， .vue 文件采用 'Vue 3 Support - All In One' 插件进行格式化
 */

/** @type { import('prettier').RequiredOptions } */
const prettierConfig = {
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 100,
  arrowParens: 'avoid',
}

module.exports = prettierConfig
