---
title: VueJS 开发常见问题集锦
date: 2017-07-13 17:47:39
subtitle: 汇总一些 VueJS 开发时常遇到的一些问题，持续更新...
categories: JavaScript
tags: [JavaScript, Vue, Vue.js]
cover: vuejs.jpg
---
由于公司的前端开始转向 `VueJS`，最近开始使用这个框架进行开发，遇到一些问题记录下来，以备后用。
主要写一些 **[官方手册](https://cn.vuejs.org/v2/guide/)** 上没有写，但是实际开发中会遇到的问题，需要一定知识基础。

---
### 涉及技术栈
- CLI: [Vue-CLI](https://github.com/vuejs/vue-cli)
- UI: [Element](http://element.eleme.io/)
- HTML: [Pug(Jade)](https://pugjs.org/)
- CSS: [Less](http://lesscss.org/)
- JavaScript: [ES6](https://github.com/lukehoban/es6features)
---
**正文：**
### polyfill 与 transform-runtime
　　首先，`vue-cli` 为我们自动添加了 `babel-plugin-transform-runtime` 这个插件，该插件多数情况下都运作正常，可以转换大部分 `ES6` 语法。
　　但是，存在如下两个问题：

1. **异步加载组件时，会产生 `polyfill` 代码冗余**
2. **不支持对全局函数与实例方法的 `polyfill`**

　　两个问题的原因均归因于 `babel-plugin-transform-runtime` 采用了沙箱机制来编译我们的代码（即：不修改宿主环境的内置对象）。

　　由于异步组件最终会被编译为一个单独的文件，所以即使多个组件中使用了同一个新特性（例如：`Object.keys()`），那么在每个编译后的文件中都会有一份该新特性的 `polyfill` 拷贝。如果项目较小可以考虑不使用异步加载，但是首屏的压力会比较大。
　　不支持全局函数（如：`Promise`、`Set`、`Map`），`Set` 跟 `Map` 这两种数据结构应该大家用的也不多，影响较小。但是 `Promise` 影响可能就比较大了。
　　不支持实例方法（如：`'abc'.include('b')`、`['1', '2', '3'].find((n) => n < 2)` 等等），这个限制几乎废掉了大部分字符串和一半左右数组的新特性。
> 一般情况下 `babel-plugin-transform-runtime` 能满足大部分的需求，当不满足需求时，推荐使用完整的 `babel-polyfill`。

#### 替换 babel-polyfill
　　首先，从项目中移除 `babel-plugin-transform-runtime`
　　卸载该依赖：
```bash
npm un babel-plugin-transform-runtime -D
```
　　修改 `babel` 配置文件
```javascript
// .babelrc
{
  //...
  "plugins": [
    // - "transform-runtime"
  ]
  //...
}
```
　　然后，安装 `babel-polyfill` 依赖：
```bash
npm i babel-polyfill -D
```
　　最后，在入口文件中导入
```javascript
// src/main.js
import 'babel-polyfill'
```

### ES6 import 引用问题
　　在 `ES6` 中，模块系统的导入与导出采用的是引用导出与导入（非简单数据类型），也就是说，如果在一个模块中定义了一个对象并导出，在其他模块中导入使用时，导入的其实是一个变量引用（指针），如果修改了对象中的属性，会影响到其他模块的使用。
　　通常情况下，系统体量不大时，我们可以使用 `JSON.parse(JSON.stringify(str))` 简单粗暴地来生成一个全新的深度拷贝的 **数据对象**。不过当组件较多、数据对象复用程度较高时，很明显会产生性能问题，这时我们可以考虑使用 [Immutable.js](https://facebook.github.io/immutable-js/)。

> 鉴于这个原因，进行复杂数据类型的导出时，需要注意多个组件导入同一个数据对象时修改数据后可能产生的问题。
> 此外，模块定义变量或函数时即便使用 `let` 而不是 `const`，在导入使用时都会变成只读，不能重新赋值，效果等同于用 `const` 声明。

### 在 Vue 中使用 Pug 与 Less
#### 安装依赖
　　`Vue` 中使用 `vue-loader` 根据 `lang` 属性自动判断所需要的 `loader`，所以不用额外配置 `Loader`，但是需要手动安装相关依赖：
```bash
npm i pug -D
npm i less-loader -D
```
还是相当方便的，不用手动修改 `webpack` 的配置文件添加 `loader` 就可以使用了

> 使用 `pug` 还是 `pug-loader`？`sass` 两种语法的 `loader` 如何设置？
> --- 请参考 [预处理器 · vue-loader](https://vue-loader.vuejs.org/zh-cn/configurations/pre-processors.html)

#### 使用
```html
<!-- xxx.vue -->
<style lang="less">
  .action {
    color: #ddd;
      ul {
        overflow: hidden;
        li {
          float: left;
        }
      }
  }
</style>
<template lang="pug">
  .action(v-if='hasRight')
    ul
      li 编辑
      li 删除
</template>
<script>
  export default {
    data () {
      return {
        hasRight: true
      }
    }
  }
</script>
```

### 定义全局函数或变量
　　许多时候我们需要定义一些全局函数或变量，来处理一些频繁的操作（这里拿 `AJAX` 的异常处理举例说明）。但是在 `Vue` 中，每一个单文件组件都有一个独立的上下文（`this`）。通常在异常处理中，需要在视图上有所体现，这个时候我们就需要访问 `this` 对象，但是全局函数的上下文通常是 `window`，这时候就需要一些特殊处理了。
#### 简单粗暴型
　　最简单的方法就是直接在 `window` 对象上定义一个全局方法，在组件内使用的时候用 `bind`、`call` 或 `apply` 来改变上下文。
　　定义一个全局异常处理方法：
```javascript
// errHandler.js
window.errHandler = function () { // 不能使用箭头函数
  if (err.code && err.code !== 200) {
    this.$store.commit('err', true)
  } else {
    // ...
  }
}
```
　　在入口文件中导入：
```javascript
// src/main.js
import 'errHandler.js'
```
　　在组件中使用：
```javascript
// xxx.vue
export default {
  created () {
    this.errHandler = window.errHandler.bind(this)
  },
  method: {
    getXXX () {
      this.$http.get('xxx/xx').then(({ body: result }) => {
        if (result.code === 200) {
          // ...
        } else {
          this.errHandler(result)
        }
      }).catch(this.errHandler)
    }
  }
}
```
#### 优雅安全型
　　在大型多人协作的项目中，污染 `window` 对象还是不太妥当的。特别是一些比较有个人特色的全局方法（可能在你写的组件中几乎处处用到，但是对于其他人来说可能并不需要）。这时候推荐写一个模块，更优雅安全，也比较自然，唯一不足之处就是每个需要使用该函数或方法的组件都需要进行导入。
　　使用方法与前一种大同小异，就不多作介绍了。￣ω￣=

### Moment.JS 与 Webpack
　　在使用 `Moment.js` 遇到一些问题，发现最终打包的文件中将 `Moment.js` 的全部语言包都打包了，导致最终文件徒然增加 100+kB。查了一下，发现可能是 `webpack` 打包或是 `Moment.js` 资源引用问题（?），目前该问题还未被妥善处理，需要通过一些 `trick` 来解决这个问题。
　　在 `webpack` 的生产配置文件中的 `plugins` 字段中添加一个插件，使用内置的方法类 [ContextReplacementPlugin](https://webpack.js.org/plugins/context-replacement-plugin/) 过滤掉 `Moment.js` 中那些用不到的语言包：
```javascript
// build/webpack.prod.conf.js
new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(zh-cn)$/)
```
> 解决方案采自 [oleg-nogin@webpack/webpack#3128](https://github.com/webpack/webpack/issues/3128#issuecomment-291790964)。
> 问题讨论详见 GitHub Issue: [moment/moment#2373](https://github.com/moment/moment/issues/2373)、[webpack/webpack#3128](https://github.com/webpack/webpack/issues/3128)。

### 自定义路径别名
　　可能有些人注意到了，在 `vue-cli` 生成的模板中在导入组件时使用了这样的语法：
```javascript
import Index from '@/components/Index'
```
　　这个 `@` 是什么东西？后来改配置文件的时候发现这个是 `webpack` 的配置选项之一：路径别名。
　　我们也可以在基础配置文件中添加自己的路径别名，比如下面这个就把 `~` 设置为路径 `src/components` 的别名：
```javascript
// build/webpack.base.js
{
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      '~': resolve('src/components')
    }
  }
}
```
　　然后我们导入组件的时候就可以这样写：
```javascript
// import YourComponent from 'YourComponent'
// import YourComponent from './YourComponent'
// import YourComponent from '../YourComponent'
// import YourComponent from '/src/components/YourComponent'
import YourComponent from '~/YourComponent'
```
　　既解决了路径过长的麻烦，又解决了相对路径的烦恼，方便很多吧！ヾ(ﾟ∀ﾟゞ)

### CSS 作用域与模块
#### 组件内样式
　　通常，组件中 `<style></style>` 标签里的样式是全局的，在使用第三方 UI 库（如：`Element`）时，全局样式很可能影响 UI 库的样式。我们可以通过添加 `scoped` 属性来使 `style` 中的样式只作用于当前组件：
```html
<style lang="less" scoped>
  @import 'other.less';
  .title {
    font-size: 1.2rem;
  }
</style>
```
> 在有 `scoped` 属性的 `style` 标签内导入其他样式，同样会受限于作用域，变为组件内样式。复用程度较高的样式不建议这样使用。
> 另，在组件内样式中应避免使用元素选择器，原因在于元素选择器与属性选择器组合时，性能会大大降低。
> --- 两种组合选择器的测试：[classes selector](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=.class%5Bclass%5E%3D%27class%27%5D&body=background%3A+%23CFD&ne=1000)，[elements selector](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=a%5Bclass%5E%3D%27class%27%5D&body=background%3A+%23CFD&ne=1000)

#### 导入样式
　　相对于 `style` 使用 `scoped` 属性时的组件内样式，有时候我们也需要添加一些全局样式。当然我们可以用没有 `scoped` 属性的 `style` 来写全局样式。但是相比较，更推荐下面这种写法：
```css
/* 单独的全局样式文件 */
/* style-global.less */
body {
  font-size: 10px;
}
.title {
  font-size: 1.4rem;
  font-weight: bolder;
}
```
　　然后在入口文件中导入全局样式：
```javascript
// src/main.js
import 'style-global.less'
```
---
**To be continue...**