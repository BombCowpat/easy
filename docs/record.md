## 流程
### 登陆并获取菜单信息
1. 简易axios封装，后续逐渐完善
2. 直接迁移api目录，并使用 pnpm run lint 格式化迁移过来的代码
3. 迁移登陆页面
4. 登陆获取token保存，跳转首页
5. 拦截路由跳转，获取用户权限信息并保存
6. 处理布局，根据权限信息渲染菜单
### 根据菜单信息处理布局
1. 依次处理对应布局模块
### 处理具体模块
1. 迁移每个模块，并完善入口文件


### 样式处理
1. 集成 [unocss](https://github.com/unocss/unocss)
2. 使用`unocss`提供的样式重置方案
3. 全局样式

### vscode 插件
1. unocss插件
2. eslint prettier
3. vue

### 关于不使用相关最新语法糖
1. 自动导入API和组件，代码可读性降低
2. script setup 和eslint冲突
3. unocss 外置class属性，相关写法会导致编译器和格式化插件无法正常工作，统一卸载class属性中

### 关于包管理
1. 使用pnpm包管理工具
2. 设置淘宝源 npm config set registry https://registry.npm.taobao.org/
3. 官方源 npm config set registry https://registry.npmjs.org/
4. 查看源 npm config get registry
5. 若使用淘宝源安装出现某些包找不到，请使用官方源

### 关于图标
1. element-plus 图标自动导入方案
2. svgicon

### 模块化vite配置
