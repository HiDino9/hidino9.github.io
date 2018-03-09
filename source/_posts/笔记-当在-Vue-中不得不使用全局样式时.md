---
title: '[笔记] 当在 Vue 中不得不用全局样式时...'
date: 2018-03-09 15:26:20
subtitle: 有时候基于 Vue 的单文件组件开发项目时, 不得不使用全局样式, 这时有一些地方需要注意.
categories: Note
tags: [JavaScript, Vue.js, CSS, scoped]
cover:
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
