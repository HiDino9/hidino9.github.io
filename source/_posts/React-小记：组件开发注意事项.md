---
title: React-小记：组件开发注意事项
date: 2017-03-27 22:12:01
subtitle: 一些 React 组件开发过程中遇到的小问题
categories: JavaScript
tags: [JavaScript, React]
cover: react.png
---
组件（`Component`）是`React`中非常重要的概念，`React`组件基于`jsx`语法开发，也就是把`HTML`写在`JS`中，刚开始接触的时候还是蛮抵触的，什么都搅在一起感觉挺乱的。不过真正开发起来会发现，只要颗粒度划分合理，一个完整的组件，所有内容都在一个文件中维护是多么方便！
<!-- more -->

___
### 基本使用方法
#### 直接引用
```
import React from 'react';
import ReactDOM from 'react-dom';
import Button from './component/button.jsx';

ReactDOM.render(
    <Button name='Click Me' />,
    document.getElementById('index')
);
```
>首先组件`import`时首字母必须大写，然后通过`<组件名 [参数1=值1, 参数2=值2...]/>`引用，参数会传入组件的构造函数中
>不能在组件**引用**上绑定事件，即`<Button onClick={ clickHandler } />`，因为组件引用中除了组件名，其他部分都应该是组件入参。不过可以通过参数的形式将回调函数传到组件内部，然后进行绑定。

#### 组件嵌套
```js
import { Component } from 'react';
import Button from './component/botton.jsx';

class DefaultBtn extends Component {
    render() {
        return <Button name='Default' />;
    }
}

export default DefaultBtn;
```
>这里定义了一个新组件`DefaultBtn`，该组件有引用了一个`Button`组件，并传入了参数`name`为`Default`

---
### 基本写法
无状态的静态组件是最简单的，这里把常用的写法都写下了
```
import { Component } from 'react';

class Button extends Component {
    constructor(props) {
        super(props);

        console.log(this.props.name);
    }

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
                        { this.props.name }
                </button>
            );
    }
}

export default Button;
```
#### 不痛不痒的提示
1. 组件名首字母必须大写
2. 样式类的属性名是`className`不是`class`
3. 事件绑定通过`on`+`eventType`小驼峰写法
    >`JSX`描述`DOM`时，所有属性都采用小驼峰写法
    >这点很棒，一直对`DOM`中各种方法名时而大写时而小写感到不解，这里全规定为小驼峰写法，顿时顺眼多了
4. 元素内嵌样式使用对象来描述，样式属性名同样使用小驼峰写法，如`backgroundColor`
5. `JSX`中可以使用`{}`来写`JS`语句

---

几点踩坑点：
### React 引入名
在组件中如果引入`React`，则首字母须大写，也就是说引入`React`时不可以写成
```js
import react form 'react';
```
>在实际项目中，只要入口文件下所依赖的文件有一个进行了正确的`import`就可以嘞，毕竟`webpack`最后会把依赖去重。

原因：在编译过程中，组件的许多部分都会转成对`React`中各个方法的引用，比如：`render()`的`return`被编译后，实质上返回的是`React.createElement()`，上文`return`语句编译后：
```
return React.createElement(
    'botton',
    {
        className: 'buttonClass',
        onClick: this.buttonClick.bind(this)
        style: buttonStyle,
    },
    this.props.name
)
```

---
### 唯一根节点
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

---
### 事件回调中的 this
在`JSX`中给`DOM`绑定事件时，回调函数默认情况下无法访问当前组件，即回调函数中`this`不可用，一般情况下我们可以通过`bind()`来改变函数的上下文来使其可用：
```
onClick = { this.buttonClick.bind(this) }
```
或者在组件的构造函数中：
```
class Button extends React.Component {
    constructor(props) {
        super(props);

        this.buttonClick = this.buttonClick.bind(this);
    }
    //buttonClick(), render()...
}
```
或者将事件回调放在一个上下文中：
```
<button onClick = { () => this.buttonClick() } >
    ButtonName
</button>
```
>比较倾向使用第一种方法，毕竟有时候访问`this`并不是必须的，随用随绑~

---
### 事件回调处理
在`React`事件回调函数中，可以显式传入一个合成事件（`SyntheticEvent`）的实例，他有如下属性与方法：
```
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
DOMEventTarget target
number timeStamp
string type
```
对于大多数常用事件的处理来说并不会感到有什么不同。不过在开发时还是需要注意，这个实例中封装了一些`React`特有的事件类型，可能与[传统事件](https://developer.mozilla.org/en-US/docs/Web/API/Event)的属性与方法并不一一对应。

事件回调需要注意：

1. #### 显式传入 Event
回调函数中须**显式**传入`event`参数：
```
    buttonClick() {
        // It doesn't work.
        event.preventDefault();
        console.log(event.type); // => 'react-click'
    }
    buttonClick(event) {
        event.preventDefault();
        console.log(event.type); // => 'click'
    }
```
2. #### 默认事件处理
从 v0.14 开始，在事件回调函数中`return false;`将不再阻止事件的传递与元素的默认事件，需要在事件处理函数中手动写上`e.stopPropagation()`或`e.preventDefault()`。
3. #### 合成事件无法异步
为了提高性能，合成事件（`SyntheticEvent`）是全局的，也就是说实质上只有一个合成事件，默认情况下当回调执行完毕后，所有属性都会被重置以便复用，回调函数中传入的`event`参数可以看做是他的一个状态，当回调执行完后就会被立刻重置，所以在异步函数中只能访问到被重置后的默认合成事件，而无法访问事件发生时的合成事件。
```
buttonClick(event) {
    console.log(event.type); // => 'click'
    setTimeout(() => console.log(event.type), 0); // => null
}
```

>不过出于特殊考虑，`React`提供了`event.persist()`方法使当前事件不被重置，效果类似于深度拷贝了一个对象。
>关于事件的其他细节可以参考[SyntheticEvent - React](https://facebook.github.io/react/docs/events.html)

先写这些吧，想起来再补充
