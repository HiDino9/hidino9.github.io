---
title: VueJS 开发常见问题集锦
date: 2017-07-13 17:47:39
subtitle: 汇总一些 VueJS 开发时常遇到的一些问题，持续更新...
categories: JavaScript
tags: [JavaScript, Vue, Vue.js]
cover: vuejs.jpg
---
由于公司的前端开始转向 `VueJS`，最近开始使用这个框架进行开发，遇到一些问题记录下来，以备后用。

---
### 涉及技术栈
- CLI: [vue-cli](https://github.com/vuejs/vue-cli)
- HTML: [Pug(Jade)](https://github.com/pugjs/pug)
- CSS: [Less](https://github.com/less/less.js)
- JavaScript: [ES6](https://github.com/lukehoban/es6features)
---
**正文：**
### babel-polyfill 与 babel-runtime
　　首先，`vue-cli` 为我们自动添加了 `babel-runtime` 这个插件，该插件多数情况下都运作正常，可以转换大部分 `ES6` 语法。
　　但是，存在如下两个问题：

1. 异步加载组件时，会产生 `polyfill` 代码冗余
2. 不支持对全局函数与实例方法的 `polyfill`

　　两个问题的原因均归因于 `babel-runtime` 采用了沙箱机制来编译我们的代码（即：不修改宿主环境的内置对象）。

>　　由于异步组件最终会被编译为一个单独的文件，所以即使多个组件中使用了同一个新特性（例如：`Object.keys()`），那么在每个编译后的文件中都会有一份该新特性的 `polyfill` 拷贝。如果项目较小可以考虑不使用异步加载，但是首屏的压力会比较大。
>　　不支持全局函数（如：`Promise`、`Set`、`Map`），`Set` 跟 `Map` 这两种数据结构应该大家用的也不多，影响较小。但是 `Promise` 影响可能就比较大了。
>　　不支持实例方法（如：`'abc'.include('b')`、`['1', '2', '3'].find((n) => n < 2)` 等等），这个限制几乎废掉了大部分字符串和一半左右数组的新特性。

### ES6 import 引用问题

　　在 `ES6` 中，模块系统的导入与导出采用的是引用导出与导入（非简单数据类型），也就是说，如果在一个模块中定义了一个对象并导出，在其他模块中导入使用时，导入的其实是一个变量引用（指针），如果修改了对象中的属性，会影响到其他模块的使用。

> 鉴于这个原因，不建议进行复杂数据类型的导出，只使用功能性（ `function`、`class` ）或简单数据类型的常量导出