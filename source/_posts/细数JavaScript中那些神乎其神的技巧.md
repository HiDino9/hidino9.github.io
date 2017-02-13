---
title: 细数JavaScript中那些神乎其神的技巧
date: 2016-07-15 15:10:02
categories: JavaScript
tags: [JS,JavaScript,技巧]
description: 闲来无事，整理一下 JavaScript 中那些神乎其神的技巧，假装大牛的样子
---
**闲来无事，整理一下JavaScript中那些神乎其神的技巧，假装大牛的样子**

## 1. 字符串转换为数字
```
    var a = "123";
    console.log(+a);         // 123
    console.log(typeof +a);  // number

    // 同样可用于日期转换为数值：
    var b = +new Date();     // 1468545682168
```

## 2. 数值向下取整
```
    var a = ~~3.14;   // 3
    var b = 3.14>>0;  // 3
    var c = 3.14|0;   // 3
```

## 3. 字符串转换为数值并取整<!-- more -->
```
    var a = "3.14"|0;  // 3
    var b = "3.14"^0;  // 3
```
> 谢谢 @开始学习前端[kaishixuexiqianduan] 指正，**该取整直接去除小数点后数字，仅对正数有效**

## 4. 函数设置默认值
```
    function func(arg){
        var arg = arg || "default"; 
        // arg 为 undefined, null, "", 0, false, NaN 时最后都得到"default"
    }
```
## 5. 变量值交换
```
    var a = 1,
        b = 2;
    a = [b, b = a][0];
    console.log(a);  // 2
    console.log(b);  // 1
```
## 6. 使用`for in`遍历对象取到属性名与属性
```
    var obj = {
        a: 1,
        b: 2
    }
    for(var i in obj) {
        console.log("obj." + i + " = " + obj[i]);
    }
    // output: obj.a = 1
    //         obj.b = 2
```
## 7. 截断数组
```
    var arr = [1, 2, 3, 4, 5, 6];
    arr.length = 3;
    console.log(arr);  // [1, 2, 3]
```
## 8. 提高遍历较大Enumerable数据的性能
```
    var arr = [1, 2, 3, 4, 5, 6, ...];
    var len = arr.length;  // 缓存arr.length
    for(var i = 0; i < len; i++) {
        console.log(arr[i]);
    }
    
    // 也可将缓存写在for的声明中
    for(var i = 0, len = a.length; i < len; i++) {
        console.log(arr[i]);
    }

    // 或者（！注意：若数组中键值存在undefined、null、0、false等数据时会中断遍历）
    for(var i = 0, a; a = arr[i++];) {
        console.log(a);
    }
```
## 9. 使用 `&&` 替代单一条件判断
```
    // 你可能这样写过
    if(!token) {
        login();
    }
    // 其实这样也可以
    !token && login();
    // 或
    token || login();
```
## 10. 检测 对象/数组 中是否有指定 属性/元素
```
    var CURD = {
        add: function() {},
        delete: function() {},
        edit: function() {}
    }
    console.log("add" in CURD);   // true
    console.log("find" in CURD);  // false

    /* 误 */
    // var arr = [1, 2, 3];
    // console.log(1 in arr);  // true
    // console.log(6 in arr);  // false
```
> 谢谢 @zaaack[zaaack] 指正，**数组的存在检测实质上是检测的是数组下标**

## 11. 通过闭包调用setTimeout
```
    for(var i = 0; i < 10; i++) {
        setTimeout(function(){
            console.log(i);  // 10 10 10 ...
        },500);
    }

    for(var i = 0; i < 10; i++) {
        (function(i){
            setTimeout(function(){
                console.log(i);  // 0 1 2 3 ...
            },500)
        })(i);
    }
```
## 12. To be continue...