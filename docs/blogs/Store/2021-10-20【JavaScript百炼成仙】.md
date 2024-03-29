---
title: 《JavaScript百炼成仙》笔记
date: 2021-10-20
tags: 
  - 读书笔记
  - JavaScript
categories: 
  - 读书笔记
---

这本书通过武侠小说的语境，适合入门者。

包含了JS、dom、css、jq、Vue、还有ES6的基础知识。

我主要记录了下js和es6相关的知识，其他的建议去看官方文档。

<!-- more -->

<img src="/blog/images/blog/JavaScript百炼成仙.png" style="width:200px;margin:0 auto;display:block;">

## JavaScript基础

最基本的变量声明与循环就不写了。

### 自增运算符 自减运算符

- a++ 本句执行完毕 再执行 a = a + 1
- ++a 本句执行之前 执行 a = a + 1

```javascript
function func(){
  var a = 1;
  var b;
  var sum = (b = a+++--a) + a-- + b++;
  return sum
}
func() // return 5
```

按步骤，所有变量的值如下所示
|sum|a|b|
|-|-|-|
|(b = a++ + --a) + a-- + b++|1|undefined|
|(b = 1 + --a) + a-- + b++|2|undefined|
|(b = 1 + 1) + a-- + b++|1|undefined|
|2 + 1 + b++|0|2|
|2 + 1 + 2|0|3|
|5|0|3|

### 函数特性

受编译步骤的影响，函数有了自己的特性，编译的过程如下：

1. 分词（把语句按词划分成独立部分）
2. 解析（解析刚才的词语，生成抽象的语法树）（相当于 词组会被解析成一个个编译后的方法，执行对应的功能）
3. 执行编译后的语句（机器可以执行的语句）

#### 变量提升 与 函数提升

```javascript
function func(){
  console.log(a) // undefined
  var a = 1
  console.log(a) // 1
}
```

JavaScript的执行机制会把作用域内的`变量定义`与`变量赋值`分成两个步骤（如下所示）。

```javascript
function func(){
  var a
  console.log(a) // undefined
  a = 1
  console.log(a) // 1
}
```

再看一个稍微复杂一点的题目（变量重名）：

```javascript
console.log(a) // undefined
var a = 100
function func(){
  console.log(a) // undefined
  var a = 1
  console.log(a) // 1
}
func()
console.log(a) // 100
// 第1、2个结果，是由于各自作用域内都有a但是都是在log之后赋值的，所以此时仅声明变量
// 最后的结果是100，是由于两个作用域使用的变量并不是同一个，所以会打印外层作用域的值
```

再说变量提升：

```javascript
// 函数声明式
console.log(func1)
function func1(){
  console.log(1)
}
/* 
打印：
ƒ func1(){
  console.log(1)
}
由于函数会提升到当前作用域的最前面运行
*/

// 函数字面量式 => 等于变量提升
var func1 = function(){}
```

#### 作用域

作用域的表现就是代码中的 `{ .. }`，作用域分为全局作用域和局部作用域，函数中访问变量的时候，如果本层找不到 就向上找（像冒泡一样），如果在最外的全局作用域中也找不到，就会报错：`Uncaught ReferenceError: XX is not defined`

```javascript
var a = 1
function b(){
  var a;
  var c = function(){
    console.log(a) // undefined
  }
  c()
}
b()
console.log(a) // 1
```

#### 函数的参数

`arguments`是代替函数外部传递进来的所有值构成的数组，默认值是[]

```javascript
function a(aa, bb, cc, dd){
  console.log(aa, bb, cc, dd) // 1 '2' true undefined
  console.log(arguments) // [1, '2', true]
}
a(1,'2',true)
```

#### 闭包

函数返回了一个匿名函数，且匿名函数用到了外层函数中定义的变量。

功能环境：需要使用全局变量，防止全局变量过多管理混乱的问题

```javascript
function a(){
  var num = 0
  return function(add){
    num+=add
    console.log(num)
  }
}
var b = a()
a(1) // 1
a(2) // 3
a(3) // 6
```

#### 自执行函数

声明并立即执行一次函数的写法，和闭包一起使用时，语句更简单明了。

```javascript
var a = (function(){
  var b = 0
  return function(){
    b++
    console.log(b)
  }
})()
a() // 1
a() // 2
```

#### 构造函数

生成一个对象模板，在new的时候，生成独立对象的写法

```javascript
function a(b){
  this.b = b
}
var a1 = new a(1)
console.log(a1.b) // 1
var a2 = new a(2)
console.log(a2.b) // 2
```

#### 回调函数

在函数内部调用参数中的方法并传参到外部的方法

```javascript
 function a(callback){
   callback(123)
 }
 a(function(res){
   console.log(res) // 123
 })
```

### 浮点数精度

浮点数的加减乘除法都有可能出现异常：

0.1+0.2 = 0.300000...00004

1.001*1000 = 1000.999999...9999

思路： 浮点数转换成整数进行计算后再按照比例获得正确结果

1. 根据两个数，获取小数部分的长度差，
2. 根据差，以字符串类型补全长度，parseInt获得整数
3. 相加，然后用`Math.pow`获取倍数
4. 相除得到结果

>

```javascript
function add(num1, num2){
  num1 = num1.toString()
  num2 = num2.toString()

  var weishu1 = num1.indexOf('.') != -1 ? num1.split(".")[1].length : 0
  var weishu2 = num2.indexOf('.') != -1 ? num2.split(".")[1].length : 0

  num1 = num1.replace('.','')
  num2 = num2.replace('.','')

  var bigger = weishu1 > weishu2 ? weishu1 : weishu2,
      smaller = weishu1 < weishu2 ? weishu1 : weishu2
  var zeroCount = bigger - smaller

  if(weishu1 == smaller){
    for(var i = 0;i<zeroCount; i++){
      num1 += '0'
    }
  }else{
    for(var i = 0;i<zeroCount; i++){
      num2 += '0'
    }
  }
  return (parseInt(num1) + parseInt(num2)) / Math.pow(10, bigger)
}
```

## jQuery和Dom

这一章讲基础的html、css部分就不写了。

jQuery部分主要讲了 选择器和链式调用，熟悉api的情况下，只需要知道链式调用的原理：
函数末尾返回this，jq中返回的是jq对象

## Vue

Vue的基础部分包含：数据绑定、事件、一般语法、组件、计算属性、监听器、过滤器

通过这章节，看懂各种功能需要什么时候使用即可，具体的功能，建议看看官方文档，那个更新比较及时。

### Vue-cli

这个是Vue的脚手架，用来快速搭建Vue项目模版，包含了入口文件main.js、主要资源文件夹src、存放页面静态资源的文件夹public等。

## ES6

### 解构赋值

```javascript
var {a,b,c} = obj
// 等价
var a = obj.a
var b = obj.b
var c = obj.c
```

同理，在函数传参时也可以使用，实现赋默认值的方法

```javascript
function a (parame = {
  a: 1,
  b: ''
}){
  var {a,b} = parame
}
// 等价
function a (parame){
  var a = parame.a == undefined ? 1 : parame.a
  var b = parame.b == undefined ? '' : parame.b
}
```

### 对象升级

#### String

1. 支持for..of存换字符
2. 模版字符串
3. padStart(length, str) padEnd(length, str) 字符串长度不足length的，使用str补足

#### Array

1. Array.form 把对象转换成数组
2. [...arr1] 复制数组
3. find/findIndex 查找符合条件的item/index
4. fill 填充数组
5. copyWithin(target, start, end) 把数组中第start到end的元素，复制到targrt（覆盖不是插入）

#### Objext

1. 支持 {[key]: value}

#### Function

1. 箭头函数 ()=>{},(会丢失this)

#### Proxy

实现了对象的get、set等事件的代理。

这也是Vue3.0的实现原理

#### Promise

异步编程，解决了原来callback的回调地狱

```javascript
function a(){
  return new Promise((res, rej)=>{
    res(right)
    rej(wrong)
  })
}
a().then().catch()
```

## 总结

这是一本很基础的书，除了后面的es6么有写对应功能解决了什么痛点，比较有意思，可以在知道了这些技术的前提下，用来在概念上入门，但是对应的语法、api等还需要看官方文档，这里只找了部分常用的说明。

> 下载地址 [《JavaScript百炼成仙》](https://cloud.189.cn/t/bea632EJbuqy) 访问码：es9c
