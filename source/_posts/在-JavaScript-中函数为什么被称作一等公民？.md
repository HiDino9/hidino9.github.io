---
title: 在 JavaScript 中函数为什么被称作一等公民？
date: 2017-04-06 16:58:16
subtitle:
categories: JavaScript
tags: [JavaScript, 函数, function]
cover:
---
如果读过`MDN`的话，应该会注意到`MDN`上对`JavaScript`的[定义部分](https://developer.mozilla.org/en-US/docs/Web/JavaScript)是这样写的：
>JavaScript (JS) is a lightweight interpreted or JIT-compiled programming language with **first-class functions**. While it is most well-known as the scripting language for Web pages, many non-browser environments also use it, such as node.js and Apache CouchDB. JavaScript is a prototype-based, multi-paradigm, dynamic language, supporting object-oriented, imperative, and declarative (e.g. functional programming) styles. Read more about JavaScript.

开篇定义中便提到了函数优先（First-class Function），也即通常所说的`JavaScript`中的一等公民`Funciton`。
那问题来了：这个一等公民为什么会被称作一等公民呢？哪些特征让函数在`JavaScript`中成为了一等公民？
<!-- more -->

### 其他语言中的函数
在许多其他语言中（例如我们熟知的`C`、`C#`、`Java`等）中，只能用语言规定的关键字去声明一个函数，也必须使用声明的函数名调用，如果需要将函数本身进行传递、赋值等操作就只能借用函数指针（即引用地址）来操作，本质上还是操作原来的那个函数，也就是必须声明了一个函数，才能进行引用等操作。
### JavaScript 中的函数
在`JavaScript`中，函数作为一等公民，他不仅拥有其他语言中函数的一切声明和调用方式，更可以像普通变量一样赋值、传递、反参。此外，在`JavaScript`中函数还可以通过`new`关键字拥有构造函数的功能。

---
下面这些使用方法在`JavaScript`中很常见，但是，现在我们在使用时应该知道，正是因为在`JavaScript`中函数是一等公民，所以才有这些用法：
### 函数表达式
```js
function [name]([param] [, param] [..., param]) { statements }
```
两种常见使用方式：
#### 自运行匿名函数
```js
(function() {
    // everything
}())
```
#### 匿名函数赋值
```js
var func = function() {}
```
---
### 函数嵌套
#### 普通嵌套
```js
function a() {
    console.log(1);

    // 在函数 a 中声明一个函数 b
    function b() {
        console.log(2);
    }
    b();
}
a(); // => 1 => 2
```
#### 匿名嵌套
匿名嵌套主要用于防止全局变量污染
```js
;(function() {
    function a() {
        console.log(1);
    }
    a(); // => 1
}())
a(); // => ReferenceError: a is not defined
```
---
### 高阶函数
如果函数作为参数或返回值使用时，就称为[高阶函数](https://zh.wikipedia.org/wiki/%E9%AB%98%E9%98%B6%E5%87%BD%E6%95%B0)。
#### 函数传递
将一个函数作为另一函数的参数进行传递
```js
// 声明一个函数 a
function a() {
    console.log(1);
}
// 声明一个带参函数 b
function b(callback) {
    console.log(2);
    // 执行作为参数传递进来的函数
    callback && callback();
}
b(a); // => 2 => 1
```

#### 反参函数
将一个函数作为另一函数的反参输出
```js
function a() {
    var v = 0;

    function b() {
        console.log(v + 1);
    }

    return b;
}
a()(); // => 1
```
---
### 构造函数
```js
function a() {
    console.log(1);
}
a.prototype.b = 2;
a.prototype.c = function() {
    console.log(this.b);
    console.log(3);
    this.d = 4;
    console.log(this.d);
    var e = 5;
    console.log(5);
}
new a().c(); // => 1 => 2 => 3 => 4 => 5
```
---
最后附上`MDN`上对于`First-class Function`的解释：
>A programming language is said to have First-class functions when functions in that language are treated like any other variable. For example, in such a language, a function can be passed as an argument to other functions, can be returned by another function and can be assigned as a value to a variable.
