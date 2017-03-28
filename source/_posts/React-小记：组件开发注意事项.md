---
title: React-小记：组件开发注意事项
date: 2017-03-27 22:12:01
subtitle:
categories:
tags:
cover:
---
组件（`Component`）是`React`中非常重要的概念，`React`组件基于`jsx`语法开发，也就是把`HTML`写在`JS`中，刚开始接触的时候还是蛮抵触的，什么都搅在一起感觉挺乱的。不过真正开发起来会发现，只要颗粒度划分合理，一个完整的组件，所有内容都在一个文件中维护是多么方便！
___
无状态的静态组件是最简单的，这里把常用的写法都写下了，再写下这部分踩到的几个坑
```
import React from 'react';

class Button extends React.Component {
    buttonClick(e) {
        e.preventDefault();
        console.log('button clicked!');
    }

    render() {
        let buttonStyle = {
            backgroundColor: '#03A9F4',
            padding: '3px 20px'
        }

        return (
                <button
                    className = 'buttonClass'
                    onClick = { this.buttonClick.bind(this) }
                    style = { buttonStyle }
                    >
                        ButtonName
                </button>
            );
    }
}

export default Button;
```
几点踩坑点：
1. ### 必须引入 React
    刚开写组件的时候发现，诶，这个引入的`React`我只用了他的`Compontent`方法，其他地方都没用到，那我只引入他的`Compontent`方法不就好了，于是：
    ```
    import { Component } from 'react';
    ```
    然鹅，编译器不干了，报错了！仔细看了报错信息晓得：组件必须引入`React`（即使组件上下文没用调用），且引入名必须是`React`，也就是说`import React from 'react';`这句是必须的，**且大小敏感**。
    >不过实际项目中，只要入口文件下所依赖的文件有一个进行了正确的`import`就可以嘞，毕竟`webpack`最后会把依赖去重。

    原因：`render()`的`return`被编译后，实质上返回的是`React.createElement()`方法，例如上文`return`语句编译后：
    ```
    return React.createElement(
        'botton',
        {
            className: 'buttonClass',
            onClick: this.buttonClick.bind(this)
            style: buttonStyle,
        }
        'ButtonName'
    )
    ```
2. ### React 元素只能有一个根节点
    如果上文你想返回两个`button`，你可能会这样写：
    ```
    render() {
        return (<button>Button1</button>
                <button>Button2</button>);
    }
    ```
    **BUT**，这是不行的，在`render()`中返回的`React`元素只能有一个根节点（原因看上文中的`React.createElement()`），也就是说，你只能这样写：
    ```
    render () {
        return (<div>
                     <button>Button1</button>
                     <button>Button2</button>
                </div>);
    }
    ```
    >莫名其妙多了一层，我也很绝望啊 (。﹏。*)

3. 驼峰法写属性
    