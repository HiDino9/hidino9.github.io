---
title: 从零开始：现在开始用ES6写代码
date: 2016-09-30 18:46:45
categories: JavaScript
tags: [JS,JavaScript,ES6,ECMAScript6,ES2015,Babel,Gulp,NodeJs]
cover: banner-write-in-es6.jpg
description: ES6（ECMAScript6.0）早在2015年便发布了第一个版本，所以又被称作 ECMAScript2015。作为已经正式发布的新版本，取代 ES5 是毋庸置疑的趋势，但鉴于浏览器的历史遗留问题，在生产线上我们还是需要一些工具来转换成 ES5 使其兼容旧版本的浏览器。
---

`ES6`（`ECMAScript6.0`）早在2015年便发布了第一个版本，所以又被称作`ECMAScript2015`。

作为已经正式发布的新版本，取代ES5是毋庸置疑的趋势，但鉴于浏览器的历史遗留问题，在生产线上我们还是需要一些工具来转换成`ES5`使其兼容旧版本的浏览器。
<!-- more -->
下面来介绍一下使用`Gulp`+`Babel`进行`ES6`开发环境的部署：

（操作很简单，写的比较详细所以字数比较多，别被吓退了哈，而且大部分配置都是一劳永逸，多个项目都可以通用，哈哈）

1. ### 安装 NodeJS
    既然使用`Gulp`跟`Babel`肯定少不了`NodeJS`，`NodeJS`各个平台均有对应的一键安装包，简单方便又省心！
    ![安装NodeJs](nodejs-installation.jpg)
    安装完成后打开命令行，分别输入
    ```
        $ npm -v

        $ node -v
    ```
    出现如下输出就代表安装成功了（这里我用的是`Git Bash`，推荐使用，安装`Git`自带）
    ![NodeJS安装成功](nodejs-installed.jpg)

2. ### 初始化NPM配置
    在项目文件夹根目录，执行
    ```
        $ npm init
    ```
    ![初始化NPM](npm-initialization.jpg)
    按照提示填好，除了`name`和`version`字段其他都是选填项，一路回车就OK了
    最后项目根目录会出现一个`package.json`的配置文件，多数情况不会手动去修改，安装依赖时`NodeJS`会自动读写这个配置文件。
    > 国内由于众所周知的原因NPM安装源访问的速度十分缓慢，建议使用如下命令更改为某宝的NPM镜像：
    > ` $ npm config set registry https://registry.npm.taobao.org/ `

3. ### 安装 Gulp
    1. #### 首先 **全局** 安装`Gulp`
        ```
            $ npm install -g gulp
        ```
        安装过程可能出现一些警告，不用理他，最后执行
        ```
            $ gulp -v
        ```
        ![安装Gulp](install-gulp.jpg)
        只要正确输出了版本号就OK了。
    2. #### 然后在项目根目录安装 **开发依赖**：
        ```
            $ npm install --save-dev gulp
        ```
    > 许多小伙伴会疑惑这两种安装方法有什么差别，其实很简单，全局安装的一般是需要直接在命令行中使用的命令，比如这里的gulp：
    > ` $ gulp taskName `
    > 全局安装之后就可以直接在命令行中使用这样的命令来执行`Gulp`任务。
    > 而在项目根目录安装的开发依赖则是在项目根目录中的 `node_modules` 目录中放入模块的文件，可以直接在项目中通过`require()`来引入的模块。

4. ### 安装 Gulp & Babel 相关插件
    1. #### 首先安装 `gulp-babel` ：
        ```
            $ npm install --save-dev gulp-babel
        ```
    2. #### 安装转码包：
        ```
            $ npm install --save-dev babel-preset-latest
        ```
        > 我这里安装了最新版本的转码包，这个转码包支持`ES2017（Stage3）&ES2016&ES2015`语法的转换。
        > 如果你只想使用正式推出的`ES6（ES2015）`，则可以仅安装`ES6`的转码包：
        > ` $ npm install --save-dev babel-preset-es2015 `
        
        Babel转码配置：
        ```
            $ echo '{ "presets": ["latest"] }' > .babelrc
        ```
        > 也可以手动在项目根目录创建 `.babelrc` 文件进行配置；
        > 仅转换`ES6`的小伙伴将命令中的 `latest` 换成 `es2015` 就OK了。
    3. #### 安装 `gulp-watch`：
        ```
            $ npm install --save-dev gulp-watch
        ```
        > `gulp-watch` 用于实时监控文件变化实时编译文件，这样就不用每次写完代码再去手动运行`gulp`任务编译文件了，也是懒人必备！

5. ### 配置 Gulp
    终于到最后一步了，哈哈，具体配置如下图，写了比较详细的注释了：
    ![配置Gulp](configure-gulp.jpg)
    保存到项目根目录的 `gulpfile.js` 文件就好了。
    最后在项目根目录执行：
    ```
        $ gulp 
    ```
    即可运行默认任务（任务名为 `default`）


赶快写个ES6语法试试吧~↖(^ω^)↗

初入前端，粗写几字，如有不足，还望指正，谢谢。

共勉。

-END