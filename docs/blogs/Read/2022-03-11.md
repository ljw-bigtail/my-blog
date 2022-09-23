---
title: 《JavaScript秘密花园》笔记
date: 2022-03-11
tags: 
  - 读书笔记
  - JavaScript
categories: 
  - 读书笔记
---

主要整理出了js使用中容易被忽略的点，了解了这些，对于代码中的异常解决、性能优化等方面都有一些帮助

<!-- more -->

<img src="/blog/images/blog/JavaScript秘密花园.png" style="width:200px;margin:0 auto;display:block;">

## 对象

### 除了 null 和 undefined，所有的变量都可以作为对象使用

直接使用数组会报错是由于解析异常导致，可以使用 `1..toString()` 或 `1 .toString()` 或 `(1).toString()` 代替

### 获取对象属性时，会逐层向上获取原型链上的属性

使用 `for in` 循环属性时，也会遍历原型链上的所有属性，可能会造成性能问题，所以需要防止原型链过长的问题。

### 不建议直接在内置对象的原型链上绑定方法

使用 `Object.prototype.xx = func` 可以实现，且很多第三方库都是这样兼容新方法（例如ES6的Array.forEach），其他情况一定要禁止修改内置对象的原型链！

### hasOwnProperty 可以在处理属性时不查找原型链

所以在`for...in`时，可以增加个if判断，如果只是`Object.xx`，在属性值为undefined等情况时，可能无法正确处理是真的没有属性 还是属性就为undefined

## 函数

### 函数定义会变量提升

`function XX(){}`会先被解析为函数，所以哪怕先调用后定义也可以；`var a = function(){}`不会，因为解析的是定义变量a，定义变量时不会引起变量提升

### this的五种情况

1. 全局环境中：指向全局对象
2. 函数调用中`func()`：指向全局对象，即使在函数中定义函数，this也指向全局对象
3. 方法调用中`obj.func()`：指向obj对象
4. 构造函数中`new obj()`：指向实例化对象
5. 显示设置中`bind(obj, params)`：指向obj对象

> **全局对象** 在浏览器中执行js，this会指向Window；其他例如Node中，因为全局对象不是Window，所以不会指向Window

### 循环中延时执行闭包会导致循环index丢失，需要使用匿名自执行函数

```javascript
for(var i = 0; i < 10; i++) {
  (function(e) {
    setTimeout(function() {
      console.log(e);
    }, 1000);
  })(i)
}
```

### arguments是长得像数组的Object，所以不能直接使用Array的方法

需要手动创建后再使用

```javascript
Array.prototype.slice.call(arguments);
// 或
Array.from(arguments)
```

### 工厂模式

工厂模式实际上是返回了一个闭包，所以在实例化的时候，如果要在原型链上定义属性，是无法访问到的

```javascript
function A(){
  var val = 1
  return {
    methods: function(){ return val }
  }
}
A.prototype = {
  b: function(){}
}
var _a = new A()
// 或者
var _a = A() 
// _a.b == undefined
```

### 不要使用隐式全局变量，可能导致难以发现的bug

不定义变量直接赋值，会导致隐式的全局变量产生

### 推荐使用匿名函数来创建明明空间，来防止命名冲突增强模块化

```javascript
(function(){
  window.obj = function(){}
})()
```

## 数组

### 不建议使用forin来便利数组

即使js中数组实际也是Object，也可以使用forin来便利，但是由于forin会遍历原型上的所有属性，所以性能相对差很多

### 请在循环前缓存数组的length

相对于循环中访问array.length，循环前缓存length的性能更好

## 类型

### === 的性能优于 ==

由于 == 会执行一次强制类型转换，所以性能开销相对较大

### typeof拿到的值和实际的类型大概率不符

除了 String Number Function Boolean 外，Date Error Array RegExp 等 还有new出来的都会被识别为object，所以如果需要识别完整的正确的类型，还需要手动写方法

```javascript
// Object.prototype.toString => "[object Array]"
return Object.prototype.toString.call(obj).slice(8, -1) // String Array等
```

## 核心

### 尽量不要使用eval

- 安全问题
- 把eval赋值给其他参数的，作用域被提升至全局

### 尽量使用分号，减少解析错误等情况

如果本行代码有前置括号，解析器不会给上一行结尾增加分号，则可能引起解析异常

```javascript
console.log('123')
(a || b).map(e=>e)
// 会被解析为
console.log('123')(a || b).map(e=>e) // 会报错 undefined is not a function
```

## 其他

### setTimeout setInterval中使用this，可能会指向全局

因为等代码执行到此，this会丢失；在前面创建一个变量值为this再去使用，可以解决问题。

### setTimeout setInterval第一个参数尽量不要传递字符串

函数内部使用了eval去执行字符串，会产生种种问题，建议不要这样处理，如果需要使用，建议包在匿名函数内部

## End.总结

> 下载地址 [《JavaScript秘密花园》](https://cloud.189.cn/t/yqiAJjiQjyUj) 访问码：9gpd