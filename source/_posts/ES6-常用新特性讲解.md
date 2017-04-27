---
title: ES6 常用新特性讲解
date: 2017-04-25 20:50:49
subtitle: 针对常用新特性的讲解，包括函数默认值、解构复制、箭头函数、类与继承等等
categories: JavaScript
tags: [JavaScript, ES6, ECMAScript2015]
cover: ecmascript6.jpg
---
> **！干货长文预警！**

上周在公司组织了 `ES6` 新特性的分享会，主要讲了工程化简介、`ES6` 的新特性与前端常用的几种构建工具的配合使用。`ES6` 这块主要讲了一些我们平时开发中经常会用到的新特性。在这里整理一下关于 `ES6` 的部分。
<!--more-->
一共讲解了 8 个常用的 `ES6` 新特性，讲解过程也是由浅入深。废话不多说，下面进入正文。


---
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
* 设定了默认值的入参，应该放在没有设置默认值的参数之后，也就是我们**不应该**这样写：`function decimal(fix = 2, num){}`，虽然通过变通手段也可以正常运行，但**不符合规范**。


---
### 模板字符串
#### 特性 & 语法
```js
// Before
// Before.1
var type = 'simple';
'This is a ' + type + ' string join.'

// Before.2
var type = 'multiline';
'This \nis \na \n' + type + '\nstring.'

// Before.3
var type = 'pretty singleline';
'This \
is \
a \
' + type + '\
string.'
// OR
// Before.4
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
　　我们之前在对字符串和变量进行拼接的时候，通常都是反复一段一段使用引号包裹的字符串，再反复使用加号进行拼接（Before.1）。多行字符串的时候我们还要写上蹩脚的 `\n` 来换行以得到一个多行的字符串（Before.2）。

　　在字符串过长的时候可能会使用 `\` 在编辑器中书写多行字符串来表示单行字符串，用来方便较长的字符串在编辑器中的阅读（Before.3），或者简单粗暴的反复引号加号这样多行拼接（Before.4）。

　　`ES6` 中我们可以使用反引号（\`，位于 `TAB` 上方）来输入一段简单明了的多行字符串，还可以在字符串中通过 `${变量名}` 的形式方便地插入一个变量，是不是方便多了！


---
### 解构赋值
#### 数组解构
```js
var [a, ,b] = [1, 2, 3, 4, 5];
console.log(a); // => 1
console.log(a); // => 3
```
　　数组解构，使用变量声明关键字声明一个形参数组（`[a, , b]`），等号后跟一个待解构目标数组（`[1, 2, 3]`），解构时可以通过留空的方式跳过数组中间的个别元素，但是在形参数组中**必须留有相应空位**才可以继续解构之后的元素，如果要跳过的元素处于**数组末端**，则在形参数组中**可以不予留空**。


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
　　函数的入参解构也是对象解构的一种延伸用法，我们可以通过改写入参对象目标值为变量名的方式，在函数内部直接获取到入参对象中某个属性或方法的值。


#### 函数入参默认值解构
```js
function example({x, y, z = 0}) {
    return x + y + z;
}
console.log(example({x: 1, y: 2}));       // => 3
console.log(example({x: 1, y: 2, z: 3})); // => 6
```
　　这是入参解构的另一种用法，我们可以在入参对象的形参属性或方法中使用等号的方式给入参对象的某些属性或方法设定默认值。


---
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
　　使用 `var` 声明的变量会自动提升到当前作用域的顶部，如果声明位置与作用域顶部之间有另一个同名变量，很容易引起难以预知的错误。使用 `let` 声明的变量则不会进行变成提升，规避了这个隐患。
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
　　`let` 声明的变量只能在当前块级作用域中使用，最常见的应用大概就是 `for(let i = 0, i < 10; i++) {}`，相信许多小伙伴在面试题中见过，哈哈。
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
　　`var` 声明的变量可以重复声明，而且不会有任何警告或者提示，就这样悄悄的覆盖了一个值，隐患如变量提升一样让人担忧。(￣┰￣\*)

　　而 `let` 声明的变量如果进行重复声明，则会直接抛出一个**语法错误**（是的，就是直接明确地告诉你：你犯了一个相当低级的**语法错误**哦）


#### Const
* 无变量提升
* 有块级作用域
* 禁止重复声明

> 前 3 点跟 `let` 一个套路，就不多说了

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
　　也是基于定义，`const` 声明的常量既然一经声明便不能再更改其值，那声明的时候没有附初始值显然是不合理的，一个没有任何值的常量是没有意义的，浪费内存。


---
### 新增库函数
　　`ES6` 新增了许多（相当多）的库函数，这里只介绍一些比较常用的。

> 题外话：多了解一下内建函数与方法有时候可以很方便高效地解决问题。有时候绞尽脑汁写好的一个算法，没准已经有内建函数实现了！而且内建函数经过四海八荒众神的考验，性能一定不错，哈哈。

#### Number
```js
Number.EPSILON
Number.isInteger(Infinity); // => false
Number.isNaN('NaN');        // => false
```
　　首先是 ᶓ 这个常量属性，表示小数的极小值，主要用来判断浮点数计算是否精确，如果计算误差小于该阈值，则可以认为计算结果是正确的。

　　然后是 `isInteger()` 这个方法用来判断一个数是否为整数，返回布尔值。

　　最后是 `isNaN()` 用来判断入参是否为 `NaN`。是的，我们再也不用通过 `NaN` 不等于 `NaN` 才能确定一个 `NaN` 就是 `NaN` 这种反人类的逻辑来判断一个 `NaN` 值了！
```js
if(NaN !== NaN) {
    console.log("Yes! This is actually the NaN!");
}
```
　　另外还有两个小改动：两个全局函数 `parseInt()` 与 `parseFloat()` 被移植到 `Number` 中，入参反参保持不变。这样所有数字处理相关的都在 `Number` 对象上嘞！规范多了。

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
* `endsWith()` 与 `startsWith()` 方法相反

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
　　首先是 `from()` 方法，该方法可以将一个类数组对象转换成一个**真正的数组**。还记得我们之前常写的 `Array.prototype.slice.call(arguments)` 吗？现在可以跟他说拜拜了~

　　之后的 `fill()` 方法，用来填充一个数组，第一个参数为将要被填充到数组中的值，可选第二个参数为填充起始索引（默认为 0），可选第三参数为填充终止索引（默认填充到数组末端）。

　　`findIndex()` 用来查找指定元素的索引值，入参为函数，函数形参跟 `map()` 方法一致，不多说。最终输出符合该条件的元素的索引值。

　　`entries()`、`keys()`、`values()` 三个方法各自返回对应键值对、键、值的遍历器，可供循环结构使用。

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
　　`assign()` 方法用于合并两个对象，不过需要注意的是这种合并是**浅拷贝**。可能看到这个方法我们还比较陌生，不过了解过 `jQuery` 源码的应该知道 `$.extend()` 这个方法，例如在下面这个粗糙的 `$.ajax()` 模型中的应用：
```js
$.ajax = function(opts) {
    var defaultOpts = {
        method: 'GET',
        async: true,
        //...
    };
    opts = $.extend(defaultOpts, opts);
}
```
　　从这我们可以看到 `TC39` 也是在慢慢吸收百家所长，努力让 `JavaScript` 变得更好，更方便开发者的使用。

> `Object` 新增的特性当然不止这一个 `assign()` 方法，一共增加了十多个新特性，特别是对属性或方法名字面量定义的增强方面，很值得一看，感兴趣的自行查找资料进行了解哈，印象会更深刻！

#### Math
　　`Math` 对象上同样增加了许多新特性，大部分都是数学计算方法，这里只介绍两个常用的
```js
Math.sign(5);     // => +1
Math.sign(0);     // => 0
Math.sign(-5);    // => -1

Math.trunc(4.1);  // => 4
Math.trunc(-4.1); // => -4
```
　　`sign()` 方法用来判断一个函数的正负，使用与对应返回值如上。

　　`trunc()` 用来取数值的整数部分，我们之前可能经常使用 `floor()` 方法进行取整操作，不过这个方法有一个问题就是：它本身是向下取整，当被取整值为正数的时候计算结果完全 OK，但是当被取整值为负数的时候：
```js
Math.floor(-4.1); // => -5
```
> 插播一个小 Tip：使用位操作符也可以很方便的进行取整操作，例如：`~~3.14` or `3.14 | 0`，也许这更加方便 : )


---
### 箭头函数
　　箭头函数无疑是 `ES6` 中一个相当重要的新特性。

#### 特性
* 共享父级 `this` 对象
* 共享父级 `arguments`
* 不能当做构造函数

#### 语法
##### 最简表达式
```js
var arr = [1, 2, 3, 4, 5, 6];

// Before
arr.filter(function(v) {
    return v > 3;
});
// After
arr.filter(v => v > 3); // => [4, 5, 6]
```
　　前后对比很容易理解，可以明显看出箭头函数极大地减少了代码量。

##### 完整语法
```js
var arr = [1, 2, 3, 4, 5, 6];

arr.map((v, k, thisArr) => {
    return thisArr.reverse()[k] * v;
})  // => [6, 10, 12, 12, 10, 6]
```
　　一个简单的首尾相乘的算法，对比最简表达式我们可以发现，函数的前边都省略了 `function` 关键字，但是多个入参时需用括号包裹入参，单个入参是时可省略括号，入参写法保持一致。后面使用胖箭头 `=>` 连接函数名与函数体，函数体的写法保持不变。

##### 函数上下文 this
```js
// Before
var obj = {
    arr: [1, 2, 3, 4, 5, 6],
    getMaxPow2: function() {
        var that = this,
            getMax = function() {
                return Math.max.apply({}, that.arr);
            };
        
        return Math.pow(getMax(), 2);
    }
}
// After
var obj = {
    arr: [1, 2, 3, 4, 5, 6],
    getMaxPow2: function() {
        var getMax = () => {
            return Math.max.apply({}, this.arr);
        }

        return Math.pow(getMax(), 2);
    }
}
```
　　注意看中第 5 行 `var that = this` 这里声明的一个**临时变量 `that`**。在对象或者原型链中，我们以前经常会写这样一个临时变量，或 `that` 或 `_this`，诸如此类，以达到在一个函数内部访问到父级或者祖先级 `this` 对象的目的。

　　如今在箭头函数中，函数体内部没有自己的 `this`，默认在其内部调用 `this` 的时候，会自动查找其**父级**上下文的 `this` 对象（如果父级同样是箭头函数，则会按照作用域链继续向上查找），这无疑方便了许多，我们无需在多余地声明一个临时变量来做这件事了。

　　**注意**：
1. 某些情况下我们可能需要函数有自己的 `this`，例如 `DOM` 事件绑定时事件回调函数中，我们往往需要使用 `this` 来操作当前的 `DOM`，这时候就需要使用传统匿名函数而非箭头函数。
2. 在严格模式下，如果箭头函数的上层函数均为箭头函数，那么 `this` 对象将不可用。

> 另，由于箭头函数没有自己的 `this` 对象，所以箭头函数不能当做构造函数。

##### 父级函数 arguments
　　我们知道在函数体中有 `arguments` 这样一个伪数组对象，该对象中包含该函数所有的入参（显示入参 + 隐式入参），当函数体中有另外一个函数，并且该函数为箭头函数时，该箭头函数的函数体中可以直接访问父级函数的 `arguments` 对象。
```js
function getSum() {
    var example = () => {
        return Array
            .prototype
            .reduce
            .call(arguments, (pre, cur) => pre + cur);
    }

    return example();
}
getSum(1, 2, 3); // => 6
```
> 由于箭头函数本身没有 `arguments` 对象，所以如果他的上层函数都是箭头函数的话，那么 `arguments` 对象将不可用。

　　最后再巩固一下箭头函数的语法：
1. 当箭头函数入参只有一个时可以省略入参括号；
2. 当入参多余一个或**没有入参**时必须写括号；
3. 当函数体只有一个 `return` 语句时可以省略函数体的花括号与 `return` 关键字。


---
### 类 & 继承
　　类也是 `ES6` 一个不可忽视的新特性，虽然只是句法上的语法糖，但是相对于 `ES5`，学习 `ES6` 的类之后对原型链会有更加清晰的认识。

#### 特性
* 本质为对原型链的二次包装
* 类没有提升
* 不能使用字面量定义属性
* 动态继承类的构造方法中 `super` 优先 `this`

#### 类的定义
```js
/* 类不会被提升 */
let puppy = new Animal('puppy'); // => ReferenceError

class Animal {
    constructor(name) {
        this.name = name;
    }

    sleep() {
        console.log(`The ${this.name} is sleeping...`);
    }

    static type() {
        console.log('This is an Animal class.');
    }
}

let puppy = new Animal('puppy');

puppy.sleep();    // => The puppy is sleeping...

/* 实例化后无法访问静态方法 */
puppy.type();     // => TypeError

Animal.type();    // => This is an Animal class.

/* 实例化前无法访问动态方法 */
Animal.sleep();   // => TypeError

/* 类不能重复定义 */
class Animal() {} // => SyntaxError
```
　　以上我们使用 `class` 关键字声明了一个名为 `Animal` 的类。

> 虽然类的定义中并未要求类名的大小写，但鉴于代码规范，推荐类名的首字母大写。

　　两点注意事项：
1. 在类的定义中有一个特殊方法 `constructor()`，该方法名固定，表示该类的构造函数（方法），在类的实例化过程中会被调用（`new Animal('puppy')`）；
2. 类中无法像对象一样使用 `prop: value` 或者 `prop = value` 的形式定义一个类的属性，我们只能在类的构造方法或其他方法中使用 `this.prop = value` 的形式为类添加属性。

　　最后对比一下我们之前是怎样写类的：
```js
function Animal(name) {
    this.name = name;
}

Animal.prototype = {
    sleep: function(){
        console.log('The ' + this.name + 'is sleeping...');
    }
};

Animal.type = function() {
    console.log('This is an Animal class.');
}
```
> `class` 关键字真真让这一切变得清晰易懂了~

#### 类的继承
```js
class Programmer extends Animal {
    constructor(name) {
        /* 在 super 方法之前 this 不可用 */
        console.log(this); // => ReferenceError
        super(name);
        console.log(this); // Right!
    }
    
    program() {
        console.log("I'm coding...");
    }

    sleep() {
        console.log('Save all files.');
        console.log('Get into bed.');
        super.sleep();
    }
}

let coder = new Programmer('coder');
coder.program(); // => I'm coding...
coder.sleep();   // => Save all files. => Get into bed. => The coder is sleeping.
```
　　这里我们使用 `class` 定义了一个类 `Programmer`，使用 `extends` 关键字让该类继承于另一个类 `Animal`。

　　如果子类有构造方法，那么在子类构造方法中使用 `this` 对象之前必须使用 `super()` 方法运行父类的构造方法以对父类进行初始化。

　　在子类方法中我们也可以使用 `super` 对象来调用父类上的方法。如示例代码中子类的 `sleep()` 方法：在这里我们重写了父类中的 `sleep()` 方法，添加了两条语句，并在方法末尾使用 `super` 对象调用了父类上的 `sleep()` 方法。

　　俗话讲：没有对比就没有伤害 (\*゜ー゜\*)，我们最后来看一下以前我们是怎么来写继承的：
```js
function Programmer(name) {
    Animal.call(this, name);
}

Programmer.prototype = Object.create(Animal.prototype, {
    program: {
        value: function() {
            console.log("I'm coding...");
        }
    },
    sleep: {
        value: function() {
            console.log('Save all files.');
            console.log('Get into bed.');
            Animal.prototype.sleep.apply(this, arguments);
        }
    }
});

Programmer.prototype.constructor = Programmer;
```
　　如果前文类的定义中的前后对比不足为奇，那么这个。。。

　　给你一个眼神，自己去体会 (⊙ˍ⊙)，一脸懵逼.jpg


---
### 模块
> 啊哈，终于写到最后一部分了。

　　模块系统是一切模块化的前提，在未推出 `ES6 Module` 标准之前，相信大伙儿已经被满世界飞的 `AMD`、`CMD`、`UMD`、`CommonJS` 等等百花齐放的模块化标准搞的晕头转向了吧。**但是**，现在 `TC39` 在 `ECMAScript2015(ES6)` 版本里**终于推出了正式的模块化规范**，前端模块系统的大一统时代已经到来了！
> OMG，这段话写的好燃 orz

　　废话有点多。。。

　　下面咱们来了解一个这个模块系统的基本规范。

> 为方便描述，下文中**导出对象**指一切可导出的内容（变量、函数、对象、类等），勿与对象（`Object`）混淆。
> **导入对象**同理。

#### 特性
* 封闭的代码块
每个模块都有自己完全独立的代码块，跟作用域类似，但是更加封闭。
* 无限制导出导出
一个模块理论上可以导出无数个变量、函数、对象属性、对象方法，甚至一个完整的类。但是我们应该时刻牢记**单一职责**这一程序设计的基本原则，不要试图去开发一个臃肿的巨大的面面俱到的模块，合理控制代码的颗粒度也是开发可维护系统必不可少的一部分。
* 严格模式下运行
模块默认情况下在严格模式下运行（`'use strict;'`），这时候要注意一些取巧甚至有风险的写法应该避免，这也是保证代码健壮性的前提。

#### 模块的定义与导出
##### 内联导出
```js
export const DEV = true;
export function example() {
    //...
}
export class expClass {
    //...
}
export let obj = {
    DEV,
    example,
    expClass,
    //...
}
```
　　使用 `export` 关键字，后面紧跟声明关键字（`let`、`function` 等）声明一个导出对象，这种声明并同时导出的导出方式称作**内联导出**。
　　未被导出的内容（变量、函数、类等）由于独立代码块的原因，将仅供模块内部使用（可类比成一种闭包）。

##### 对象导出
```js
// module example.js
const DEV = true;
function example() {
    //...
}
class expClass {
    //...
}
let obj = {
    DEV,
    example,
    expClass,
    //...
}
// module example.js
export {DEV, example, expClass, obj};
export {DEV, example as exp, expClass, obj};
```
　　相对于内联导出，上边的这种方式为**对象导出**。我们可以像写普通 `JS` 文件一样写主要的功能逻辑，最后通过 `export` 集中导出。

　　在导出时我们可以使用 `as` 关键字改变导出对象的名称。

##### 默认导出
```js
export default {DEV, example as exp, expClass, obj};
// OR
export default obj;
// OR
export default const DEV = true;
```
　　我们可以在 `export` 关键字后接 `default` 来设置模块的默认导出对象，需要注意的是：**一个模块只能有一个默认导出**。

　　先不多说，后面讲导入的时候再细讲相互之间的关联。

#### 模块的导入与使用
##### 自定义模块
　　前文我们定义了一个名为 `example` 的模块，写在文件 `example.js`中，下面我们来导入并使用这个模块。
```js
import example from './example.js';
// OR 
import default as example from './example.js';
```
　　使用 `import` 关键字导入一个模块，上边这两种写法是等效的。默认导入对象既是模块默认导出对象，即对应模块定义中的 `export default` 所导出的内容。

　　此外我们还可以这样导入一个模块：
```js
import {DEV, example} from './example.js';
import * as exp from './example.js';
import {default as expMod, * as expAll, DEV, example as exp} from './example.js';
```
　　这种导入方式对应模块定义中的 `export {DEV, example, expClass, obj}` 或 `export const DEV = true`。下面我们逐行分析：

　　第一行，我们使用对象导入的方式导入一个模块内容，可能有些人已经发现，这跟**解构赋值**很相似，但也有不同，下面会讲到。需要注意的是形参对象（`{DEV, example}`）与模块定义中导出的名称**必须保持一致**。

　　第二行，导入时可以使用通配符 `*` 配合 `as` 关键字一次性导出模块中所有内容，最终导入的内容放在 `exp` 对象中。

　　第三行，在使用对象导入来导入一个模块的指定内容时，也可以使用 `as` 关键字更改最终导入对象的名称，这里表现出**与解构赋值的一个不同之处**，忘记解构赋值的小伙伴可以翻翻前文对比一下哈~

　　最后，在导入一个模块后我们就可以直接使用模块的函数、变量、类等了，完整的代码示例：
```js
import {DEV, example, expClass as EC} from './example.js';

if(DEV) {
    let exp = new EC();
    // anything you want...
    example();
}
```
---
　　好嘞！到这里，`ES6` 常用的 8 个新特性就讲完了，恭喜你耐心地看完了。当然，还有许多地方没有讲到，有时间的话会考虑继续写一些。

　　好嘞，就这样吧，希望对你有所帮助，拜拜~<(\*￣▽￣\*)/。

> 文中部分专业名词由于未找到合适译文，最后自行翻译，如有不妥，欢迎指正。