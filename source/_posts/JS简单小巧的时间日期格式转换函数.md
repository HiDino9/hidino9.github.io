---
title: JS简单小巧的时间日期格式转换函数
date: 2016-09-12 14:53:06
categories: JavaScript
tags: [JS,JavaScript,Date,时间,日期,格式转换]
description: JS 简单小巧的时间日期格式转换函数
---
**JS简单小巧的时间日期格式转换函数**

1. ### 这是实现后的使用方法
    ```
        var now = new Date(); 
        var nowStr = now.format('yyyy-MM-dd hh:mm:ss'); 

        var testDate = new Date(); 
        var testStr = testDate.format('YYYY年MM月dd日hh小时mm分ss秒'); 
        alert(testStr); 

        alert(new Date().format('yyyy年MM月dd日')); 
        alert(new Date().format('MM/dd/yyyy')); 
        alert(new Date().format('yyyyMMdd')); 
        alert(new Date().format('yyyy-MM-dd hh:mm:ss'));
    ```
    <!-- more -->

2. ### 实现方法：在Date原型上添加方法
    ```
        Date.prototype.format = function(format) { 
            var o = {
                'M+': this.getMonth() + 1,                      //month
                'd+': this.getDate(),                           //day
                'h+': this.getHours(),                          //hour
                'm+': this.getMinutes(),                        //minute
                's+': this.getSeconds(),                        //second
                'q+': Math.floor((this.getMonth() + 3) / 3),    //quarter
                'S': this.getMilliseconds()                     //millisecond
            }

            if (/(y+)/.test(format)) {
                format = format.replace(
                    RegExp.$1,
                    (this.getFullYear() + '').substr(4 - RegExp.$1.length)
                );
            }

            for (var k in o) {
                if (new RegExp('(' + k + ')').test(format)) {
                    format = format.replace(
                        RegExp.$1,
                        RegExp.$1.length == 1 ?
                            o[k]: ('00' + o[k]).substr(('' + o[k]).length)
                    );
                }
            }
            return format;
        }
    ```

*(摘自网络，作者不详)*