---
title: React-小记：开发环境准备
date: 2017-03-27 21:37:06
subtitle:
categories: JavaScript
tags: [React, Webpack]
cover:
---
写下这个标题之后我愣了几分钟，突然发现无从下笔。随后想了想，就当是学习`React`过程中的随笔吧，写点简单的开发过程顺便记一些刚接触时踩到的坑。最后写完感觉太长了，拆成几个部分吧，选择性阅读。
<!-- more -->
___
### 准备工作
#### React Developer Tools
首先需要准备的就是`React`提供的`Chrome`拓展工具了，这个扩展在检测到开发状态的`React`程序时会在控制台添加一个`React`工具栏。在这里可以很方便的查看到组件间结构、属性、状态跟事件，可以很方便地进行调试：
![React Developer Tools](http://placehold.it/350x150)
下载地址：[React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

#### Webpack
由于`React`无法直接在浏览器环境中运行，需要使用`Webpack`进行通过`Babel`编译打包。
>当然你也可以直接引入`react.js`跟`react-dom.js`直接在浏览器中跑，不过很卡就是了。。。

下面是`webpack`的低配：
```
var path = require('path'),
    root = path.resolve(__dirname),
    src  = path.resolve(root, 'js'),
    dist = path.resolve(root, '../js');

module.exports = {
    entry: path.resolve(src, 'index.jsx'),
    output: {
        path: dist,
        filename: 'index.js'
    },
    devtool: 'cheap-module-eval-source-map',
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'babel'
            }
        ]
    }
}
```
>简单说明：
>1. `entry`：入口文件，`webpack`说白了就是从入口文件一层层地查找代码中使用了`require(xxx)`或`import x from x`语句，把所有依赖的文件全都写到一个文件里。对，就这么简单！
>2. `output`：指定最终打包好的文件输出到哪里，没什么可说的
>3. `devtool`：指定开发时生成`sourceMap`的格式，绝大多数直接用`cheap-module-eval-source-map`就OK，想深入了解的[点这里](https://webpack.github.io/docs/configuration.html#devtool)
>4. `module.loaders`：一系列的加载器，`test`用来匹配`require(xxx)`中的`xxx`来确定是否用这个加载器处理所识别到的文件。`loader`用来指定加载器，这里指定的`babel`需要安装依赖`npm i -D babel-loader`

#### Babel
`Babel`的使用参考：[从零开始：现在开始用ES6写代码](http://blog.beard.ink/JavaScript/%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%EF%BC%9A%E7%8E%B0%E5%9C%A8%E5%BC%80%E5%A7%8B%E7%94%A8ES6%E5%86%99%E4%BB%A3%E7%A0%81/)
这里的额外配置就是加一个`react`的转码包：
1. 安装预置转码包`npm i -D babel-preset-react`
2. 修改配置文件`.babelrc`
```
{
    "presets": ["react", "es2015"]
}
```
___
### 项目入口
#### 访问入口 index.html
首先我们要准备一个近乎空白的`HTML`文档：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>React Demo</title>
</head>
<body>
    <div id="root"></div>
    <script src="js/index.js"></script>
</body>
</html>
```
>1. 这个`HTML`文件`head`按需设置，或引入样式表，或设置`meta`，随你喜欢，`body`节点中`ID`为`root`的节点则是我们`react`所有`DOM`渲染的的目标节点，
一般情况下**不要直接渲染到`body`节点中**，虽然可以正常加载，但是控制台会弹出警告，这是因为许多工具或插件（譬如弹窗）也会渲染`DOM`到`body`节点中，这会影响`React`的正常运行
>2. 下面就是一个脚本引用，引用`webpack`配置中`output`所指的输出文件。

#### 逻辑入口 index.js
这个入口其实就是`webpack`配置中的`entry`所指向的文件，也就是上文访问入口中引用的脚本文件，`webpack`将从这个文件开始查找依赖
```
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import Index from './component/index.jsx';

ReactDOM.render(<Index />, document.getElementById('index'));
```
>1. 引入三个依赖，其中前两个为`React`基础依赖，必须引入，最后一个为我们自己写的一个组件。
`webpack`编译时将从这三条语句出发，按顺序查找依赖（按树查找，即：如果依赖中还有其他依赖，则一直查找下去，直到依赖树的末端为止），最后读取查找到的全部文件内容后，按照依赖顺序写入到当前文件中，最终输出到`output`中指定的位置
>2. `ReactDOM.render()`第一个参数为将要渲染的`React`元素，这里的`<Index />`则是直接把第三行引入的组件直接放到这里进行渲染，第二个参数是指把这个组件渲染到页面的哪个`DOM`节点中。

