---
title: 深入理解JavaScript继承
date: 2022-02-06
tags: 
  - JavaScript
categories: 
  - JavaScript
---

JavaScript的6种继承，划重点！要考的···

《JavaScript高级程序设计》 238 ~ 249 页。

<!-- more -->

**预定义**：在后面的继承方案中，ClassA作为被继承的父类。

```javascript
function ClassA(option){
  this.color = option.color
  this.logData = ()=>{console.log(option)} // 一般写在 proptotype 那边，这里做测试用
}
ClassA.prototype.show = 0
ClassA.prototype.sayColor = function () {  // 一般写在 this 那边，这里做测试用
  console.log(this, this.show, this.color);
};

var a = new ClassA({color: 'red'})
console.log(a); // ClassA {color: 'red', logData: ƒ}
```

> 前置知识点：  
>
> function的this赋值和prototype有什么区别？按照使用的维度来看，没有区别；但是按照性能的角度看：
>
> - this在内部定义，在书上叫特权方法，需要在每个实例化对象中存放一遍，相对内存占用大，所以一般把只属性放在里面；
> - prototype在外部定义，只是不能访问function的私有属性（例子中的data），但由于绑定在原型链上，不会多次实例化，节约内存；
>
> 所有的对象的原型最顶部是Object，原型链的继承实际上时破坏原有的原型链，修改为目标对象
>
> - ClassA instanceof Object // true

## 原型链继承

> 《JavaScript高级程序设计》 8.3.1：其基本思想就是通过原型继承多个引用 类型的属性和方法。

思路：prototype 对象的任何属性和方法都被传递给那个类的所有实例。

```javascript
// 原型链继承
function ClassB(size){}
ClassB.prototype.testa = '1' // undefined // 在给ClassB的原型链上绑定属性是需要在初始化构造函数之后的，否则会被覆盖哦
ClassB.prototype = new ClassA({color: 'green'}); // 破坏原有的原型链
ClassB.prototype.testb = '2' // 2

var b = new ClassB('xl') // b.color = 'green'
console.log(b, b instanceof ClassA); // ClassB {} true
```

特点：

- 不支持多重继承，最后一个继承会覆盖前面的所有包括继承、属性、函数等；
- 继承的父类（ClassA）中如果有属性改变，ClassB的实例化对象会取到同样的值

---

```javascript
// 特点2的例子
var _b = new ClassB('m') // b.color = 'green'
// 修改了继承自ClassA的属性再被修改，实例化对象中的对应数据都会修改，因为修改的原型链上的，而不是原型中的
_b.color = 'white' // _b.color == 'white' 且 b.color == 'white'
```

这种特性(特性2)，其实可以做某个全局组件的公共互斥属性的修改。例如，假设有需求：全局弹窗只能保留一个，那么这块就可以设定一个是否有弹窗打开的判断，但是就要多写一层。

## 盗用构造函数（借用继承）

> 《JavaScript高级程序设计》 8.3.2：解决原型包含引用值导致的继承问题

思路：

- 写法1，在ClassB中先在this上绑定一个对象等于ClassA，然后实例化对象（此时会把ClassA的属性绑定在ClassB上），然后删除实例化对象（防止后面再次调用产生异常）
- 写法2 / 3，官方的call() 或者 apply()实现对象冒充，所以ClassB中直接替换这三句即可。  

---

```javascript
function ClassB(color, size){
  // 写法1: 便于理解
  this.newOpt = ClassA // 继承类 // 这里不可以直接在newOpt上直接赋值实例化后的对象，这样无法继承，仅为赋值一个实例化对象
  this.newOpt({color, size}) // 实例化
  delete this.newOpt // 清理，防止多次调用产生异常
  // 写法2: call
  // ClassA.call(this, {color, size})
  // 写法3: apply
  // ClassA.apply(this, [{color, size}])
}
var b = new ClassB('red','xl')
var _b = new ClassB('yelow','m')
_b.color = 'white' // _b.color == 'white' 且 b.color == 'red'
console.log(b instanceof ClassA); // false
console.log(b.show, b.sayColor());// Uncaught TypeError: b.sayColor is not a function 没有继承prototype上的方法
console.log(_b.logData()) // {color: 'yelow', size: 'm'} m没有继承父类属性
```

特点：

- 相比于使用原型链，优点是可以在子类构造函数中向父类构造函数传参；
- 可以继承多个类，但多个类中有重名属性，后面的会覆盖前面的；
- 因为实际是复制，所以没有继承父类原型的属性，属性是私有的；
- 没有继承父类原型上定义的方法（sayColor），无法复用；复制来的会占用内存；

> 前置知识点：
>
> 快速理解call方法：`A.call(B, (parame1, ..., parameN))`
>
> - A表示 对象本体
> - B表示 this的指向对象，即要把B绑到A上
> - 后面的参数表示 传递的参数，数量可以从0到任意长，在A中接收
> - 总结就是：A 中的关键字 this 等于 B 对象 `**在B上使用A的参数方法**`
>
> 快速理解apply方法：`A.apply(B, [parame1, ..., parameN])`
>
> - 指向与call类似，只是传参改成数组

## 组合继承

> 《JavaScript高级程序设计》 8.3.3

思路：混用上面两种方式，使用原型链继承原型上的属性和方法，通过盗用构造函数继承实例属性。

```javascript
function ClassB(sColor, sName) {
  ClassA.call(this, {color: sColor}); // 继承属性 第二次调用ClassA
  this.name = sName;
}
ClassB.prototype = new ClassA({color: 'green'}); // 继承方法 第一次调用ClassA
var b = new ClassB('red','xl') // 这里的参数纯粹没用，只是为了不传参导致的报错：Cannot read properties of undefined，但实际值是在call内传递
console.log(b instanceof ClassA); // true  
```

特点：合并了两种方案的优点，现在原型上的属性和方法和实例属性都可以使用了；instanceof可以使用了；

缺点：因为调用了两次构造函数（ClassA.call 和 new ClassA），消耗了两次内存

## 原型式继承

> 《JavaScript高级程序设计》 8.3.4：属性中包含的引用值始终会在相关对象间共享，跟使用原型模式是一样的。

思路：通过克隆一个对象，然后再对返回的对象进行二次修改，从而获得一个新的在原型链上的对象

```javascript
function ClassB(obj, color){
  function f(){}
  f.prototype = obj
  f.prototype.color = color
  return new f()
}
var b = ClassB(a, 'green')
console.log(b.color, b instanceof ClassA); // green true
// 等价于
// var b = Object.create(a, {color: {
//   value: 'green'
// }})
```

特点：无法拓展复用，但是继承了原型上的属性

> ECMAScript5上规定了新的方法来规范这一函数：Object.create(obj, _obj)。obj是被复制的对象，_obj是提供新属性的对象。  
> Object.create和Object.assign的区别：首先create的第二个参数的属性需要也是对象否则会抛出异常；assign提供浅复制（仅分配新属性）；而create提供深复制，操作原型链

## 寄生式继承

> 《JavaScript高级程序设计》 8.3.5：寄生构造函数和工厂模式，创建一个实现继承的函数，以某种 方式增强对象，然后返回这个对象。

思路：类似原型式继承，可以拓展为可以传递参数的形态

```javascript
function object(original){
  let clone = Object.create(a, {
    color: {
      value: 'green'
    }
  }); // 通过调用函数创建一个新对象 
  clone.sayHi = function() { // 以某种方式增强这个对象
    console.log("hi" + original.name);
  };
  return clone; // 返回这个对象 
}
var b = object({
  name: 'bb'
})
console.log(b) // hi bb
```

特点：可以传递参数了，但是还是无法复用

## 寄生组合式继承

截止到此，继承中实际可用的只有组合式继承，但效率问题（两次使用ClassA）还未解决。

> 《JavaScript高级程序设计》 8.3.6：本质上，子类原型最终是要包含超类对象的所 有实例属性，子类构造函数只要在执行时重写自己的原型就行了。

思路：不通过调用父类构造函数的方式去给子类原型赋值，而是去的一个副本。即：使用寄生式继承来继承父类原型，将新值返回给子类原型。

```javascript
function object(original){ // 寄生函数
  let clone = Object.create(a, {
    color: {
      value: 'green'
    }
  }); // 通过调用函数创建一个新对象 
  clone.sayHi = function() { // 以某种方式增强这个对象
    console.log("hi" + original.name);
  };
  return clone; // 返回这个对象 
}
function ClassB(color){ // 使用组合继承
  ClassA.call(this, {color}) // 只用到一次
}
function extendTo(B_sub, A_super){ // 关键函数，用来把b的原型链覆盖为 从A（提供属性）和B（作为主构造函数）复制下来的新对象
  var _b = object(A_super.prototype) // 创建 寄生原型副本
  _b.constructor = B_sub // 增强 修复实例
  B_sub.prototype = _b // 赋值 原型继承原型的实例
}
extendTo(ClassB, ClassA)
ClassB.prototype.sayHi = function(){

}
var b = new ClassB('blue')
console.log(b instanceof ClassA); // true
```

特点：**通过借用构造函数来继承属性；**、**通过原型链来继承方法。**；保证了实例化后的对象没有多余参数，切只用到一次ClassA构造函数

## 总结

推荐看下阮一峰大神关于js继承的博客，里面讲了继承的由来以及实现。[传送门](http://www.ruanyifeng.com/blog/2011/06/designing_ideas_of_inheritance_mechanism_in_javascript.html)
