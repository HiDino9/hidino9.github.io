---
title: 深度定制团队自己的 Vue template
date: 2017-12-07 21:08:35
subtitle: 深入浅出一步步定制基于 vue-cli 的 Vue template
categories: JavaScript
tags: [JavaScript, Vue.js, vue-cli, vue-template]
cover:
---
众所周知，使用 `vue-cli` 可以快速初始化一个基于 `Vue.js` 的项目，官方提供了 `webpack`、`pwa`、`browserify-simple` 等[常用 templates](https://github.com/vuejs-templates)。

当开发一个独立项目的时候，使用官方提供的 `template` 确实非常方便，省去了繁琐的依赖安装配置、`webpack` 配置，甚至连项目结构也不用多加考虑。

但是，当我们需要开发多个系统，每个系统相对独立但又有一些配置、依赖或逻辑相互通用的时候（例如集群的多后台系统），每次使用官方提供的 `template` 初始化项目之后，都需要进一步调整（添加依赖、修改配置、增加通用组件等等），这显然是十分麻烦的。
本着~~懒惰是第一生产力~~的初衷，我们需要定制一份自己的 `template`，以便我们...额...偷懒哈~
![](hehe.jpg)

<!-- more -->

在开始定制我们自己的 `Vue template` 前，我们需要了解一些前置知识：

### **前置知识**
1. 模板结构
  　　首先我们先来了解模板的主要结构：
  ![](https://placehold.it/200x300)
  　　模板结构很简单，主要包括两个部分：
  - template 该目录用于存放模板文件，初始化项目生成的文件来自于此。
  - meta.js / meta.json 用于描述初始化项目时命令行的交互动作。

2. [Metalsmith](https://github.com/segmentio/metalsmith)
  　　`Metalsmith` 在渲染项目文件流程中角色相当于 `gulp.js`，可以通过添加一些插件对构建文件进行处理，如重命名、合并等。
3. [download-git-repo](https://github.com/flipxfx/download-git-repo)
  　　使用 `vue-cli` 初始化项目时会使用该工具来下载目标仓库。默认的 `webpack` 等模板直接下载 `vue-templates` 中对应的模板仓库。
  　　自定义的模板也可以是一个 GitHub 仓库，使用如下命令来初始化项目：
  ```bash
  vue init username/repo my-project
  ```
  > 其中 `username` 为自定义模板仓库所在的 GitHub 用户或组织名，`repo` 为仓库名。

4. [Inquirer.js](https://github.com/SBoudrias/Inquirer.js#question)
  　　`vue-cli` 在模板仓库下载完成后，将通过 `Inquirer.js` 根据模板仓库中的 `meta.js` 或 `meta.json` 文件中的设置，与用户进行一些简单的交互以确定项目的一些细节，如下图：
  ![](https://placehold.it/300x200)
  > 该交互配置是可选的，当项目中**没有** `meta.js` 或 `meta.json` 文件时，模板仓库下载完成后将直接进入模板构建阶段。

5. [Handlebars.js](https://github.com/wycats/handlebars.js/)
  　　在通过命令行交互确定了项目初始化的细节后，就该进入最后一道工序，按照模板初始化我们的项目啦！\\(≧▽≦)/ 
  　　这里 `vue-cli` 选用的是 `Handlebars.js` —— 一个简单高效的语义化模板构建引擎。

> 定制模板主要围绕着**命令行交互**（`Inquirer.js`）与**模板文件开发**（`Handlebars.js`）这两部分。

### meta.js 配置文件
　　设置都在 `meta.js` 或 `meta.json` 的 `prompts` 字段中配置，推荐使用 `meta.js`，更灵活一些。以下也将以 `meta.js` 进行展开说明。
　　`meta.js` 相当于使用 `vue-cli` 读取 `template` 生成项目时的入口文件，一共可包含如下几个字段，先简单介绍一下各字段功能：
  - `helpers` : 自定义 `Handlebars.js` 的辅助函数
  - `prompts` : 基于 `Inquirer.js` 的命令行交互配置
  - `filters` : 根据命令行交互的结果过滤将要渲染的项目文件
  - `metalsmith` : 配置 `Metalsmith` 插件，文件会像 `gulp.js` 中的 `pipe` 一样依次经过各个插件处理
  - `completeMessage` : 将模板渲染为项目后，输出一些提示信息，取值为字符串
  - `complete` : 与 `completeMessage` 功能相同，二选其一，取值为函数，函数最后需返回输出的字符串

### 命令行交互
　　命令行交互主要是 `meta.js` 中 `prompts` 字段的配置，详细的配置可以阅读 `Inquirer.js` 的 [README.md](https://github.com/SBoudrias/Inquirer.js/#question)，这里说一下常用的交互配置：
```js
// meta.js
module.export = {
  // ...
  "prompts": {
    "isCustomName": {
      "type"   : "confirm",
      "message": "是否自定义系统名称？",
    },
    "sysName": {
      "type"    : "input",
      "when"    : "isCustomName",
      "default" : "默认系统名称",
      "message" : "请输入系统名称:",
      "required": true,
      "validate": function (val) {
        if (!val) return '(✘) 请输入系统名称，该名称将设为 index.html 的 title';
        return true;
      },
    },
    // ...
  },
}
```
字段说明：
  - `isCustomName` 与 `sysName` : 交互字段名称，可在后续条件交互或模板渲染时通过该字段读取到交互结果
  - `type` : 交互类型，有 `input`, `confirm`, `list`, `rawlist`, `expand`, `checkbox`, `password`, `editor` 八种类型
  - `message` : 交互的提示信息
  - `when` : 进行该条件交互的先决条件，在该例子中，`sysName` 这个交互动作只在 `isCustomName` 交互结果为真时才会出现
  - `default` : 默认值，当用户输入为空时，交互结果即为此值
  - `required` : 默认为 `false`，该值是否为必填项
  - `validate` : 输入验证函数

> 注：示例中 `default` `required` `validate` 三个字段存在逻辑问题，为了举例方便放到一起。

### 模板渲染时的辅助函数
　　`vue-cli` 中预置了 `if_eq` 与 `unless_eq` 辅助函数，用于使用交互所得数据来处理模板中是否渲染的两种逻辑关系。
