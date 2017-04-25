---
title: ES6 常用新特性讲解
date: 2017-04-25 20:50:49
subtitle: 针对常用新特性的讲解，包括函数默认值、解构复制、箭头函数、类与继承等等
categories: JavaScript
tags: [JavaScript, ES6, ECMAScript2015]
cover:
---
上周在公司组织了 `ES6` 新特性的分享会，主要讲了 `ES6` 的新特性与前端常用的几种构建工具的配合使用。`ES6` 这块主要讲了一些我们平时开发中经常会用到的新特性。在这里整理一下关于 `ES6` 的部分。
<!--more-->
一共讲解了 8 个常用的 `ES6` 新特性，讲解过程也是由浅入深。废话不多说，下面进入正文。



### 函数默认值
#### 特性 & 语法
```js
// Before
function decimal(num, fix) {
    fix = fix === void(0) ? 2 : fix;

    return +num.toFixed(fix);
}
```
```js
// After
function decimal(num, fix = 2) {
    return +num.toFixed(fix);
}
```
　　首先，我们看一下之前我们是怎么写函数默认值的：我们通常会使用三元运算符来判断入参是否有值，然后决定是否使用默认值运行函数（如示例中 `fix = fix === void(0) ? 2 : fix`）

　　而在 `ES6` 中，我们可以直接在函数的显示入参中指定函数默认值（`function decimal(num, fix = 2){}`），很明显，这种写法更自然易懂，也更加方便，不过有一点需要注意：
* 设定了默认值的入参，应该放在没有设置默认值的参数之后，也就是 `function decimal(fix = 2, num){}`，虽然通过变通手段也可以正常运行，但**不符合规范**



### 模板字符串
#### 特性 & 语法
```js
// Before
var type = 'simple';
'This is a ' + type + ' string join.'

var type = 'multiline';
'This \nis \na \n' + type + '\nstring.'

var type = 'pretty singleline';
'This \
is \
a \
' + type + '\
string.'
// OR
'This ' +
'is' +
'a' +
type +
'string.'
```
```js
// After
var type = 'singleline';
`This is a ${type} string.`

var type = 'multiline';
`This
is
a
${type}
string.`

var type = 'pretty singleline';
`This \
is \
a \
${type} \
string.`
```
　　我们之前在对字符串和变量进行拼接的时候，通常都是反复一段一段使用引号包裹的字符串，再反复使用加号进行拼接。多行字符串的时候我们还要写上蹩脚 `\n` 来换行以得到一个多行的字符串。在字符串过长的时候可能会使用 `\` 在编辑器中书写多行字符串来表示单行字符串，用来方便较长的字符串在编辑器中的阅读，或者简单粗暴的反复引号加号这样多行拼接。

　　`ES6` 中我们可以使用反引号（\`，位于 `TAB` 上方）来输入一段简单明了的多行字符串，还可以在字符串中通过 `${变量名}` 的形式方便地插入一个变量，是不是方便多了！



### 解构赋值
#### 数组解构
```js
var [a, ,b] = [1, 2, 3, 4, 5];
console.log(a); // => 1
console.log(a); // => 3
```
　　数组解构，使用变量声明关键字声明一个形参数组（`[a, , b]`），等号后跟一个待解构目标数组（`[1, 2, 3]`），解构时可以通过留空的方式跳过数组中的个别元素，但是在形参数组中**必须留有相应空位**才可以继续解构之后的数组元素，如果要跳过的元素处于**数组末端**，则在形参数组中**可以不予留空**。


#### 对象解构
```js
var {b, c} = {a: 1, b: 2, c: 3};
console.log(b); // => 2
console.log(c); // => 3
```
　　对象解构与数组解构大体相同，不过需要注意一点
* 形参对象（`{b, c}`）的属性或方法名必须与待解构的目标对象中的属性或方法名完全相同才能解构到对应的属性或方法


#### 对象匹配解构
```js
var example = function() {
    return {a: 1, b: 2, c: 3};
}
var {a: d, b: e, c: f} = example();
console.log(d, e, f); // => 1, 2, 3
```
　　对象匹配解构是对象解构的一种延伸用法，我们可以在形参对象中使用`:`来更改解构后的变量名。


#### 函数入参解构
```js
function example({param: value}) {
    return value;
}
console.log(example(5)); // => 5
```
　　函数的入参解构也是对象解构的一种延伸用法，我们可以通过改写入参对象目标值为变量名的方式在函数内部直接获取到对象中某个属性或方法的值。


#### 函数入参默认值解构
```js
function example({x, y, z = 0}) {
    return x + y + z;
}
console.log(example({x: 1, y: 2}));       // => 3
console.log(example({x: 1, y: 2, z: 3})); // => 6
```
　　这是入参解构的另一种用法，我们可以在入参对象的形参属性或方法中使用等号的方式给入参对象的某些属性或方法设定默认值。



### Let & Const
#### Let
* **无**变量提升

```js
// Before
console.log(num); // => undefined
var num = 1;
```
```js
// After
console.log(num); // => ReferenceError
let num = 1;
```
　　使用 `var` 声明的变量会自动提升到当前作用域的顶部，如果声明位置与作用域顶部有另一个同名变量，很容易引起难以预知的错误。使用 `let` 声明的变量没有变成提升，完全规避了这个隐患。
> 注意：`var` 声明的变量提升后虽然在声明语句之前输出为 `undefined`，但这**并不代表** `num` 变量还没有被声明，此时 `num` 变量**已经完成声明并分配了相应内存**，只不过该变量**目前的值**为 `undefined`，并不是我们声明语句中赋的初始值 `1`。

* **有**块级作用域
```js
// Before
{
    var num = 1;

    console.log(num); // => 1
}
console.log(num);     // => 1
```
```js
// After
{
    let num = 1;
    
    console.log(num); // => 1
}
console.log(num);     // => ReferenceError
```
　　`let` 声明的变量只能在当前块级作用域中使用，最常见的应用大概就是`for(let i = 0, i < 10; i++) {}`，相信许多小伙伴在面试题中见过，哈哈。
* **禁止**重复声明
```js
// Before
var dev = true;
var dev = false;

console.log(dev); // => false
```
```js
// After
let dev = true;
let dev = false; // => SyntaxError
```
　　`var` 声明的变量可以重复声明，而且不会有任何警告或者提示，就这样悄悄的覆盖了一个值，隐患如果变量提升一样让人担忧。

　　而 `let` 声明的变量如果进行重复声明，则会直接抛出一个**语法错误**（是的，就是直接明确地告诉你：你犯了一个相当低级的**语法错误**哦）


#### Const
* 无变量提升
* 有块级作用域
* 禁止重复声明

> 前三点跟 `let` 一个套路，就不多说了

* 禁止重复赋值
```js
const DEV = true;
DEV = false; // => TypeError
```
　　基于静态常量的定义我们可以很明显知道，`const` 声明的常量一经声明便不能再更改其值，无需多说。

* 必须附初始值
```js
const DEV; // => SyntaxError
```
　　也是基于定义，`const`声明的常量既然一经声明便不能再更改其值，那声明的时候没有附初始值显然是不合理的，一个没有任何值的常量是没有意义的，浪费内存。



### 新增库函数
　　`ES6` 新增了许多（相当多）的库函数，这里只介绍一些比较常用的。
#### Number
```js
Number.EPSILON
Number.isInteger(Infinity); // => false
Number.isNaN('NaN');        // => false
```
　　首先是 ᶓ 这个常量属性，表示小数的极小值，主要用来判断浮点数计算是否精确，如果计算误差小于该阈值，则可以认为计算结果是正确的。

　　然后是 `isInteger()` 这个方法用来判断一个数是否为整数，返回布尔值。
　　最后是 `isNaN()` 用来判断入参是否为 `NaN`，是的，我们再也不用通过 `NaN` 不等于 `NaN` 才能确定一个 `NaN` 就是 `NaN` 这种反人类的逻辑来判断一个 `NaN` 值了！
```js
if(NaN !== NaN) {
    console.log("Yes! This is actually the NaN!");
}
```
　　另外还有两个小改动：两个全局函数 `parseInt()` 与 `parseFloat()` 被移植到 `Number` 中，这样所有数字处理相关的都在 `Number` 对象上嘞！规范多了。

#### String
```js
'abcde'.includes('cd'); // => true
'abc'.repeat(3);        // => 'abcabcabc'
'abc'.startsWith('a');  // => true
'abc'.endsWith('c');    // => true
```
* `inclueds()` 方法用来判断一个字符串中是否存在指定字符串
* `repeat()` 方法用来重复一个字符串生成一个新的字符串
* `startsWith()` 方法用来判断一个字符串是否以指定字符串开头，可以传入一个整数作为第二个参数，用来设置查找的起点，默认为 `0`，即从字符串第一位开始查找
* `endsWith()` 与 `startsWith()`方法相反

#### Array
```js
Array.from(document.querySelectorAll('*')); // => returns a real array.
[0, 0, 0].fill(7, 1); // => [0, 7, 7]
[1, 2, 3].findIndex(function(x) {
    return x === 2;
}); // => 1
['a', 'b', 'c'].entries(); // => Iterator [0: 'a'], [1: 'b'], [2: 'c']
['a', 'b', 'c'].keys();    // => Iterator 0, 1, 2
['a', 'b', 'c'].values();  // => Iterator 'a', 'b', 'c'
// Before
new Array();        // => []
new Array(4);       // => [,,,]
new Array(4, 5, 6); // => [4, 5, 6]
// After
Array.of();         // => []
Array.of(4);        // => [4]
Array.of(4, 5, 6);  // => [4, 5, 6]
```
　　首先是 `from()` 方法，该方法可以将一个类数组对象转换成一个真正的数组，我们再也不需要调用 `Array` 原型上方法的形式让一个类数组使用数组对象上的方法了，现在我们可以很方便的把它转换成一个真正的数组从而拥有 `Array` 上的所有方法与属性。还记得我们之前常写的 `Array.prototype.slice.call(arguments)` 吗？现在可以跟他说拜拜了~

　　然后的 `fill()`，用来填充一个数组，第一个参数为将要被填充到数组中的值，可选第二个参数为填充起始索引（默认为 0），可选第三参数为填充终止索引（默认填充到数组末端）。

　　`findIndex()` 用来查找指定元素的索引值，入参为函数，函数形参跟 `map()` 方法一致，不多说。函数返回一个布尔值，最终输出符合该条件的元素的索引值。

　　`entries()`、`keys()`、`values()` 三个方法各自返回对应键值对、键、值的遍历器，可供遍历。

　　最后一个新增的 `of()` 方法主要是为了弥补 `Array` 当做构造函数使用时产生的怪异结果。


#### Object
```js
let target = {
    a: 1,
    b: 3
};
let source = {
    b: 2,
    c: 3
};

Object.assign(target, source); // => { a: 1, b: 2, c: 3}
```
　　`assign()` 方法用于合并两个对象，不过需要注意的是这种合并是**浅拷贝**，可能看到这个方法我们还比较默认，不过了解过 `jQuery` 源码的应该知道 `$.extend()` 这个方法，例如在 `$.ajax()` 中的应用：
```js
$.ajax = function(opts) {
    var defaultOpts = {
        method: 'GET'
    }
}
```
> `Array` 对象上新增的方法不止这些，需要的可以自行查找资料进行了了解，印象会更深刻！