---
title: '[笔记] 当在 Vue 中不得不用全局样式时...'
date: 2018-03-10 11:06:20
subtitle: 有时候基于 Vue 的单文件组件开发项目时, 不得不使用全局样式, 这时有一些地方需要注意.
categories: Note
tags: [JavaScript, Vue.js, CSS, scoped]
description: 有时候基于 Vue 的单文件组件开发项目时, 不得不使用全局样式, 这时有一些地方需要注意.
---

有时候基于 Vue 的单文件组件开发项目时, 不得不使用全局样式, 这时有一些需要注意的地方.

<!-- more -->

当遇到需要使用全局样式时, 下列几种情况

* 样式在项目各处均有使用;
* 样式只在当前组件内的 DOM 上使用;
* 样式需要应用到当前组件 DOM 的外部 DOM;

下面详细记录一下需要注意的问题:

### 样式在项目各处均有使用

如果样式需要在项目各处均有使用, 例如: [reset.css](http://meyerweb.com/eric/tools/css/reset/), [tiny-trim.css](https://github.com/BearD01001/tiny-trim.css) 等等.
这时推荐在项目入口文件中直接导入样式文件:

```js
// src/main.js
import 'tiny-trim.css'
import 'asset/reset.css'
import 'asset/global.css'
```

当然, 也可以在顶层组件中没有设置 `scoped` 属性的 `style` 标签中导入:

```css
@import url(asset/reset.css);
@import url(asset/global.css);
```

### 样式只在当前组件内的 DOM 上使用

当使用一些第三方 UI 库时, 有一些 UI 库生成的 DOM 在 `template` 中并不能直接添加 `class` 或 `style` 来修改第三方 UI 库的组件样式, 这时我们可以通过当前组件没有 `scoped` 属性的 `style` 标签来添加全局样式.

但此时需要考虑一些问题:

* 这个样式应该只影响**当前组件**内第三方 UI 库渲染出来的 DOM
* 因为 DOM 不在 `template` 标签里 (DOM 由第三方 UI 库的 JS 在浏览器加载时构建或在编译打包过程中生成), 不能直接设置 `class` 或 `style` 来修改样式, 故只能使用没有 `scoped` 属性的 `style` 标签

可以看出两点是有一定矛盾的. 不过可以采用如下方法解决或缓解:

1.  为当前组件根元素设置自定义 `data` 属性
  ```html
  <!-- src/components/MyComponent.vue -->
  <template>
    <div class="my-component" data-custom-mycomponent>
      <!-- ... -->
    </div>
  </tempalte>
  ```

2.  在没有 `scoped` 属性的 `style` 标签中使用自定义 `data` 属性限定样式作用域
  ```css
    .my-component[data-custom-mycomponent] {
      // ...
    }
  ```
  > 这里推荐使用 `Less` 或 `Sass`, 嵌套语法能减少许多代码冗余.

### 样式需要应用到当前组件 DOM 的外部 DOM

这种情况主要是针对上一种情况的补充, 有时候第三方 UI 库生成的 DOM 节点并不在当前组件的 DOM 内, 可能渲染到 `body` 中 (如 `dialog`, `tooltip`, `message` 等).

这些渲染到当前组件 `DOM` 之外的组件, 需要在上一种情况的处理基础上, 为它们的顶层元素再设置一个自定义的 `data` 属性:

```html
  <!-- src/components/MyComponent.vue -->
  <template>
    <div class="my-component" data-custom-mycomponent>
      <!-- message 组件的 DOM 将被渲染到 body 中, 而不是当前组件 .my-component 中 -->
      <message
        class="my-component-message"
        msg="You got a message! "
        data-custom-mycomponent-message />
    </div>
  </tempalte>
```
```css
  .my-component[data-custom-mycomponent] {
    // ...
  }
  .my-component-message[data-custom-mycomponent-message] {
    // ...
  }
```

-EOF