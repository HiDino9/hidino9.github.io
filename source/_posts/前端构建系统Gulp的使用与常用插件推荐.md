---
title: 前端构建系统Gulp的使用与常用插件推荐
date: 2017-01-19 19:01:15
subtitle: 玩转 Gulp 前端构建系统，为静态文件添加 MD5 指纹、生成 Source Map、静态文件合并与压缩、自动合并雪碧图、小图标转码为内联 base64、ect.
categories: JavaScript
tags: [JS, Gulp, Babel, SourceMap]
cover: cover-use-gulp.png
description: 随着 Web 前端发展，前端项目变得越来越复杂，随之而来的是各种方便的工具：打包工具、转码工具、JS 与 CSS 的合并压缩工具等等。这些工具极大的提高了我们前端的代码质量，但问题也随之而来：这么多工具到底该怎么使用，难道一个个在各个工具中来回切换复制粘贴？或是在 CLI 里一条条地敲命里吗？敲完代码还要敲一堆的构建命令，说不准顺序搞错了还要功亏一篑重来一遍？纳尼？！！于是构建系统应运而生，Gulp, Grunt, Browserify, etc.使用构建系统的好处显而易见，就是一次配置，自动构建，省心省力妙不可言（怎么像广告词 orz）。此外因为配置文件的高度统一，这个配置文件几乎可以多个项目之间随便复制粘贴修修改改就可以重复使用！
---
随着`Web`前端发展，前端项目变得越来越复杂，随之而来的是各种方便的工具：打包工具、转码工具、JS 与`CSS`的合并压缩工具等等。这些工具极大的提高了我们前端的代码质量，但问题也随之而来：

这么多工具到底该怎么使用，难道一个个在各个工具中来回切换复制粘贴？或是在`CLI`里一条条地敲命里吗？**敲完代码还要敲一堆的构建命令**，说不准顺序搞错了还要功亏一篑**重来一遍**？纳尼？！！

于是构建系统应运而生，`Gulp`, `Grunt`, `Browserify`, etc. 

使用构建系统的好处显而易见，就是一次配置，自动构建，省心省力妙不可言（怎么像广告词 orz）

此外因为配置文件的高度统一，这个配置文件几乎可以多个项目之间随便复制粘贴修修改改就可以**重复使用**！
<!-- more -->

不过可用的构建系统有很多，为避免引起圣战这里不做讨论\_(:зゝ∠)\_，我就用`Gulp`~

好嘞，废话说了这么多，下面进入正文：



## Node 与 Gulp 的安装
参考：[从零开始：现在开始用ES6写代码](http://blog.vsv.io/JavaScript/从零开始：现在开始用ES6写代码/)，使用`Babel`对`ES6`进行转码也就不在这里啰嗦嘞~



## 为静态文件添加 MD5 指纹
使用`Gulp`自动对`HTML`中引用的静态文件添加`MD5`指纹戳，有效解决旧文件缓存，新文件无法更新的问题。

这部分有两种解决方案

### 将`MD5`指纹写入文件名
- 效果：`<script src='BearD01001-366dc531e1.min.js'></script>`
- 优点：几乎可完美规避**更新时短时间内客户端请求结果不一致**的问题
- 缺点：每次修改文件都会产生一个新文件，易造成文件冗余
- 建议：推荐流量大、或没有绝对高峰期只有相对高峰期的大型`Web`系统使用
- 插件：[gulp-rev](https://www.npmjs.com/package/gulp-rev)

### 写至文件引用`URI`的`query`中
- 效果：`<script src='BearD01001.min.js?rev=366dc531e1'></script>`
- 优点：每次更新不会产生新文件，有效避免文件冗余
- 缺点：更新时短时间内，客户端请求到的静态文件可能不一致，**造成非预期结果**
- 建议：推荐流量小、或可规避高峰期更新的`Web`系统使用
- 插件：[gulp-rev-append](https://www.npmjs.com/package/gulp-rev-append)

>两种解决方案优缺点已经说明，两个插件的使用方法也很简单，直接`pipe`到插件中就 OK ，这里不多废话嘞~


```js
    var gulp = require('gulp');
    var rev  = require('gulp-rev');
    // var revAppend = require('gulp-rev-append');
    gulp.task('html', () => {
        gulp.src('*.html')
            .pipe(rev())
            // .pipe(revAppend())
            .pipe(gulp.dest('./'));
    });
```



## 生成 Source Map
说到`Source Map`可能会有些小伙伴儿有些陌生，说白了这货就是在转码编译之前的文件与之后的文件生成一个字符对照表（深入了解参考 >> [JavaScript Source Map 详解](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)）。

这样在浏览器开发者工具中，只要开启`sourcemaps`，调试过程中就可以在开发者工具中**直接看到编译前的源文件，而不是编译后的文件**。

如果出现问题也是直接报出问题出在源文件的哪行哪列，`Debug`起来相当方便！
### 插件
- [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps)

### 简介
额(⊙\_⊙)...上边好像说的差不多了
### 使用
一般使用方法（**不推荐**）

```js
    gulp.task('javascript', () => {
        gulp.src('src/**/*.js')
            .pipe(sourcemaps.init())
                .pipe(plugin1())
                .pipe(plugin2())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('dist'));
    });
```
>不推荐的原因是`gulp-sourcemaps`插件默认会将文件对照表信息**全部写入转码编译后的文件末端**。
>
>一般这个对照表的信息量还是很大的，这对生产线上浏览器请求加载文件无疑是无用额外的开销，手动去除也是一件很低效费时的工作。


指定输出路径（**推荐**）

```js
    gulp.task('javascript', () => {
        gulp.src('src/**/*.js')
            .pipe(sourcemaps.init())
                .pipe(plugin1())
                .pipe(plugin2())
            .pipe(sourcemaps.write('_srcmap'))
            .pipe(gulp.dest('dist'));
    });
```
这里在`sourcemaps.write()`中传入了一个字符串`_srcmap`，用来指定`Source Map`即对照表的存储路径。

这样指定输出路径之后，文件编译转码完只会在最后一行只会写入对`Source Map`的文件引用，而`Source Map`对照表本身会被输出到指定的路径下：

```
//@ sourceMappingURL=_srcmap/BearD01001.js.map
```

这样在开启浏览器开发者工具后，开发者工具就会自动去匹配`Source Map`了。

而生产线上则完全不用担心

1. 谁会把`Source Map`文件放到生产线上？
2. 即使真的放上了，如果开发者工具未打开，浏览器也不会去加载这个文件。



## 静态文件的合并与压缩
`JS`、`CSS`文件的合并压缩应该是产品上线前最常见的需求了。

不再需要你在各个`JS`/`CSS`压缩合并的工具中切来切去，也不需要你在各个`IDE`或是`Editor`中复制粘贴手动拼接合并，这些**繁琐低效**的工作正是`Build System`要帮你解决的！

>接下来要介绍的这几个插件都非常常用，也有许多文章介绍了使用方法，就不多加说明了，动动手搜一搜吧！


### JS 的压缩
#### 插件
- [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)

#### 简介
使用`UglifyJS`压缩`JS`文件

### CSS 的压缩
#### 插件
- [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css)

> **！注意！** 搜索`CSS`压缩工具的时候极有可能搜到`gulp-minify-css`，**该插件已被弃用**

#### 简介
使用`clean-css`压缩`CSS`文件

### JS / CSS 的合并
>`JS`或`CSS`文件的合并都是使用同一款插件`gulp-concat`。

#### 插件
- [gulp-concat](https://www.npmjs.com/package/gulp-concat)

#### 简介
合并`JS`或`CSS`文件



## 文件重命名
上边介绍了静态文件的合并与压缩，通常合并或压缩之后我们都会给文件重命名一下，压缩后习惯重命名为`FILENAME.min.js`，合并后习惯重命名为`all.js`、`main.css`等等，这时就需要重命名插件来帮帮嘞~

### 插件
- [gulp-rename](https://www.npmjs.com/package/gulp-rename)

### 简介
文件重命名
### 使用
```js
    var gulp   = require('gulp');
    var rename = require('gulp-rename');
    
    // 可以这样简单粗暴的直接改名
    gulp.src('BearD01001.txt')
        .pipe(rename('BearD01010.md'))
        .pipe(gulp.dest('./')); // ./BearD01010.md
    
    // 也可以指定各种参数
    gulp.src('BearD01001.txt')
        .pipe(rename({
            dirname:  'text/markdown',
            basename: 'myself',
            prefix:   'introduce-',
            suffix:   '-life',
            extname:  '.md'
        }))
        .pipe(gulp.dest('./')); // ./text/markdown/introduce-myself-life.md 
```



## 自动合并雪碧图
### 插件
- [gulp-spriter](https://www.npmjs.com/package/gulp-spriter)

### 简介
帮助前端工程师将`css`代码中的切片图片合并成雪碧图，支持`retina`图片。
>NPM上有详细的中文使用介绍，不多介绍，简单好用



## 小图标转码为内联 base64
### 插件
- [gulp-base64](https://www.npmjs.com/package/gulp-base64)

### 简介
将`CSS`中引用的小图标转码为`base64`编码的`data URI`字符串，减少额外的`http`请求数。

### 使用
插件的使用非常简单，什么都不指定直接`pipe`到插件就OK了

```js
    // 基础示例
    gulp.task('build', () => {
        gulp.src('./css/*.css')
            .pipe(base64())
            .pipe(concat('main.css'))
            .pipe(gulp.dest('./public/css'));
    });
```
当然也有简单但是十分好用的几个可选参数：
```js
    gulp.task('build', () => {
        gulp.src('./css/*.css')
            .pipe(base64({
                baseDir:        'public',
                extensions:     ['svg', 'png'],
                exclude:        [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
                maxImageSize:   8*1024, // bytes 
                debug:          true
            }))
            .pipe(concat('main.css'))
            .pipe(gulp.dest('./public/css'));
    });
```
>相信大家伙儿的英文都 OK，参数名称也很直观，就不加以说明啦
>Tips：在`extensions`参数中可以使用正则（例如：/\\\.jpg#datauri$/i）匹配带有指定 hash 的引用文件，
>这样在开发过程中就可以通过在文件末尾加上对应的`hash`（例如：`background-image: url(./images/icon.jpg#datauri);`）手动指定哪些文件转码成`data URI`嘞！



## 构建异常捕获
使用`Gulp`构建过程中一般会有`JS`、`Less`/`SCSS`编译转码的过程，这个过程是比较容易发生错误的，然鹅`Gulp`的默认做法是只要有插件抛出异常，那么整个`Gulp`的构建进程即停止运行。

也就是说即使出错后及时修正了错误并且保存了，还需要重新启动构建系统（即需要在`CLI`中重新输入`gulp [TASKNAME]`），这显然是很多余的一个步骤。

有没有什么方法在构建出错的时候不让构建进程`break down`呢？当然有！这就是`Gulp`官方推荐的构建插件之一`gulp-plumber`来做的事情，水管工，名字很贴切吧，哈哈~

还有一个问题，如果`Terminal`窗口没在屏幕的可视范围内，构建出错了我不知道怎么办？傻傻地等着以为构建会完成等了半天发现没有任何反应？调出终端才发现构建失败了？这里就用到了另一个辅助插件`gulp-util`，可以用它在构建出错的时候让电脑 __*哔 ~*__ 的响一声，提示咱构建失败了赶紧`debug`！

### 插件
1. [gulp-plumber](https://www.npmjs.com/package/gulp-plumber)
2. [gulp-util](https://www.npmjs.com/package/gulp-util)

### 简介
1. `gulp-plumber`：构建异常捕获，防止构建进程崩掉
2. `gulp-util`：这个插件其实很强大哈，集合了许多`Gulp`中常用的小工具，例如`log()`、`colors`等等，这里只用到了`beep()`&`log`，就是让电脑 __*哔 ~*__ 的响一声然后抛出异常，哈哈

### 使用
```js
    var gulp    = require('gulp'),
        gutil   = require('gulp-util'),
        babel   = require('gulp-babel'),
        concat  = require('gulp-concat'),
        plumber = require('gulp-plumber');
    
    gulp.task('build', () => {
        gulp.src('./_src/js/*.js')
            // 最先 pipe 到 plumber 中，以便出现异常前准备捕获
            .pipe(plumber({ errHandler: e => {
                gutil.beep(); // 哔~ 的响一声
                gutil.log(e); // 抛出异常
            }}))
            .pipe(babel())
            .pipe(concat('all.js'))
            .pipe(gulp.dest('./public/js'));
    });
```



## 使用 watch 插件提高构建效率
`gulp.src`这个方法相信大伙儿都特别熟悉了，传入`Glob`来匹配并读取文档流，但是这个方法的缺点也很明显，就是会读取全部匹配的文件（即使文件未作修改），这样导致的一个明显问题就是：

**随着项目的开发，文件越来越多，构建速度越来越慢。**

当然，我们可以使用`Gulp`内置的`watch`方法来规避这个问题，不过这个方法有一个小问题不知道大家有没有发现，就是它**检测不到新建文件的事件**，感觉蛮不合理的。所以现在一般使用`gulp-watch`这个插件，这个插件可以自定义触发事件，而且通过插件提供回调机制配合大家熟悉的`console`可以很方便的观察到构建流程。
### 插件
- [gulp-watch](https://www.npmjs.com/package/gulp-watch)

### 简介
实时监测文件变化（可自定义触发事件与回调方法）
### 使用
```js
    var gulp    = require('gulp'),
        watch   = require('gulp-watch'),
        gutil   = require('gulp-util'),
        moment  = require('moment'),
        colors  = require('colors');
    
    gulp.task('js', () => {
        watch('./_src/js/*.js', (vinyl) => {
                console.log(`[${ moment().format('HH:mm:ss').gray }] ${ vinyl.basename.yellow } rebuilding.`);
            })
            .pipe(plugin1())
            .pipe(plugin2())
            .pipe(gulp.dest('./public/js'));
    });
```

>通常的使用方法就是这样了，默认监测`['add', 'change', 'unlink']`通常是够用的，可以使用`options.events`来手动设置监测的事件类型。
>回调函数会在每次监测到事件时触发，可以通过参数`vinyl`对象取得文件的详细信息。
>前面的`watch`回调中实现了一个简单的构建流程监控，更完善的解决方案推荐使用 [gulp-notify](https://www.npmjs.com/package/gulp-notify) 



## 其他提高构建体验的插件
上边大伙儿可能注意到了，使用了`gulp-moment`与`gulp-colors`，这两个插件无关项目，纯属为了更好的监控构建状态引入的两个插件，下面简单介绍一下
### 插件
1. [gulp-moment](https://www.npmjs.com/package/gulp-moment)
2. [gulp-colors](https://www.npmjs.com/package/gulp-colors)

### 简介
1. `gulp-moment`：相信不少小伙伴儿在`browser-side`用过`moment.js`这个工具，主要是进行时间方面的计算与格式化，[官网](http://momentjs.com/)有详细的介绍，使用起来很方便！
2. `gulp-colors`：这个是用来设置`CLI`输出文字的颜色的，只要在任意字符串后面使用，就可以改变输出到终端的文字颜色、样式。

### 使用
1. `gulp-moment`：`moment().format('HH:mm:ss')`格式化当前时间格式，其他参考[官网](http://momentjs.com/)文档；
2. `gulp-colors`：`'*.html'.yellow`，任意字符串后面加上`.`\+`COLOR`，即可改变颜色，[项目主页](https://github.com/Marak/colors.js)有多种配色与样式可供选择。

___
好嘞，终于写完了，上边就是使用`Gulp`进行前端构建的常用方法与插件了，希望对你有所帮助。

如有问题，欢迎提出指正

就酱~

-END

___