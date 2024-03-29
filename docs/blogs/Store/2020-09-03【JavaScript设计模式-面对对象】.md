---
title: 《JavaScript设计模式》笔记之面对对象
date: 2020-09-03
tags: 
  - 读书笔记
  - JavaScript
categories: 
  - 读书笔记 
---

书籍是人类进步的阶梯，这本是电梯。

<!-- more -->

<img src="/blog/images/blog/JavaScript设计模式.png" style="width:200px;margin:0 auto;display:block;">

> 此片只包含了书籍前半部分，不推荐阅读  
> 请看新篇  

## 灵活的语言——JavaScript

 > JavaScript中，一切皆对象，这不仅仅是一个概念，还表示了一种思路。过去的我并没有真切的运用到代码中，直到这里，我才明白：为什么要使用这个；如何去使用这个。

- 在企业应用中，由于js库的特性，我们尽量不要重复使用全局变量，因为很有可能大家对变量的声明含义会使变量重复。
- 全局变量并不仅仅是在函数外部声明的`var a = 0;`，还包含了`var move = function(){}`这样声明的函数。
- 尽量少使用全局变量，因为全局变量在使用完之后不会自动销毁，不但占据多余的内存，还有可能干扰后续代码的使用。

**第一类型**：

```javascript
//第一种，最普通的函数结构，也是干扰力度最大的一种，bad choice
function name(){
 //name函数
}
function age(){
 //age函数
}

//第二种，上一种的变形，先声明，但还是声明了多余变量，还不是好选择
var name = function(){
 //name函数
}
var age = function(){
 //age函数
}
```

**第二类型**：

```javascript
//第三种，把函数声明在对象里，作为对象的方法
var box = {
 name : function(){
  //name函数
 }
 age : function(){
  //age函数
 }
}

//第四种，上一种的变形，足够满足需求，但是这样的对象并不能重复使用
var box = function(){
 box.name = function(){
  //name函数
 }
 box.age = function(){
  //age函数
 }
}
```

**第三类型**：

```javascript
//第五种，通过新声明对象的返回来确定函数的使用，不错的选择
var box = function(){
 return {
  box.name : function(){
   //name函数
  }
  box.age : function(){
   //age函数
  }
 }
}

//第六种，这个是我的接受度最高的，但是使用时一定要new
var box = function(){
 this.name = function(){
  //name函数
 }
 this.age = function(){
  //age函数
 }
}
var a = new box();
a.name();
```

**第四类型**：

```javascript
//第七种，这个是我之前学习“爱心鱼游戏”所使用的方法，是非常完善的一种
var box = function(){};
box.prototype.name = function(){
 //name函数
}
box.prototype.age = function(){
 //age函数
}

//第八种，上一种的变形。但不能与上一种混用，否则会覆盖
var box = function(){}
box.prototype = {
 box.name : function(){
     //name函数
    }
    box.age : function(){
       //age函数
    }
}
var a = new box();
a.name();
```

**第五类型**：

```javascript
//第九种，高级的、链式的、简洁的调用方式
var box = function(){}
box.prototype = {
 box.name : function(){
     return this;
        //name函数
    }
    box.age : function(){
       return this;
       //age函数
    }
}
var a = new box();
a.name().age();
```

 > 终于明白了JavaScript的灵活到底是个什么意思，这让我更加爱上了这门语言。

## 写到的都是看到的——面对对象编程

### 面向过程与面向对象

JavaScript是面向对象的语言，不像其他面向对象语言那么拘束，JavaScript有着得天独到的优势——自由。

面向过程的语言，是C。（我的编程思想就是从C学来的。）

### 封装

意义就是把需要的东西作为个体表示出来，不是平摊开来的。

要把所有与之有关联的都放在一起，就是把变量、函数等放在相关的对象内，这样变量就不会相互污染。

```javascript
//这种，是可以被其他的调用的
book.prototype = {
 a : true,
    b : function(){}
}
//这种，是不可以的，undefined
book.aaa = 1;
```

### 继承

#### 类式继承

JavaScript中没有现成的机制，但是可以通过【第一个类的实例赋值给第二个类的原型】来实现具体继承机制。

继承后，子类可以使用父类的方法，如果方法名重复，则优先用子类的方法。

```javascript
//父
function SuperClass() {
 this.superValue = true;
}
SuperClass.prototype.getsuperValue = function() {
 return this.superValue;
};

//子
function SubClass() {
 this.subValue = false;
}
SubClass.prototype.getsubValue = function() {
 // body...
 return this.subValue;
};

//继承
SubClass.prototype = new SuperClass();

//使用
var instance = new SubClass();
console.log(instance.getsuperValue); //true
console.log(instance.getsubValue); //false
```

 > 问题：如果push值进去会影响父类，导致其他实例化对象也会出现这个值。解决办法：用构造函数继承。

#### 构造函数继承

这种方法，避免了父类被污染的深坑。

但是，有产生了一种新的问题：这样每个实例都是单独拥有方法而不能共用，违背了**代码复用原则**。

```javascript
var id;
//声明父类
function SuperClass(id) {
 this.books = ['JavaScript','css','html'];
 this.id = id;
}
SuperClass.prototype.showBooks = function() {
 return this.books;
};

//声明子类
function SubClass() {
 //继承
 SuperClass.call(this,id);  //这个函数就像替身术一样，替代了push对父类的污染
}

var instance1 = new SubClass(1);
var instance2 = new SubClass(2);

instance1.books.push("设计模式")
console.log(instance1.books); //["JavaScript", "css", "html", "设计模式"]
console.log(instance2.books); //["JavaScript", "css", "html"]
```

#### 组合继承

这种方式结合了前两种的优点。

既保证了父类不被影响，又重复利用了方法。

```javascript
var name,time;
//声明父类
function SuperClass(name) {
 //值类型共有属性
 this.name = name;
 //引用类型红有属性
 this.books = ['JavaScript','css','html'];
}
SuperClass.prototype.getName = function() {
 console.log(this.name);
};

//声明子类
function SubClass(name,time) {
 //构造函数式继承父类name属性
 SuperClass.call(this,name);
 //子类中新郑共有属性
 this.time = time;
}
//类式继承
SubClass.prototype = new SuperClass();
//子类原型方法
SubClass.prototype.getTime = function(first_argument) {
 console.log(this.time);
};

var instance1 = new SubClass("aaa book",2016);
var instance2 = new SubClass("bbb book",2017);
instance1.books.push("设计模式")

console.log(instance1.books);  //["JavaScript", "css", "html", "设计模式"]
instance1.getTime(); //2016
instance1.getName(); //aaa book
console.log(instance2.books);  //VM1217:34 ["JavaScript", "css", "html"]
instance2.getTime(); //2017
instance2.getName(); //bbb book
```

#### More

除了这些个继承方法，还有更多的。

- 原型式继承：根据已有的对象创建一个新的对象，同时不必创建新的自定义对象类型。（在对象内创建）。
- 寄生式继承：原型式继承的拓展。先声明基对象，然后通过原型继承方式创建新对象，然后拓展新对象，最后返回新对象。
- 寄生组合式继承：先创建父类，以及原型方法，然后创建子类，并在构造函数中实现构造函数式继承，然后用寄生式继承父类，随后再添加一些子类的方法。（这个我看不太明白）

### 多继承

原理：通过循环复制出多个父类的属性。（extend方法的延伸）

**单继承**：

```javascript
var extend = function (target,source) {
 //遍历源对象的属性
 for (var property in source) {
  //复制
  target[property] = source[property];
 }
 //返回目标对象
 return target;
}
```

**多继承**：

```javascript
var mix = function () {
 var i = 1,     //从第二个参数开始为被继承对象
  len = arguments.length, //获取参数长度
  target = arguments[0], //第一个对象为目标对象
  arg;     //缓存参数对象
 //遍历
 for (; i < len; i++) {
  //缓存源对象
  arg = arguments[i];
  for (var property in arg) {
   //复制
   target[property] = source[property];
  }
 }
 //返回目标对象
 return target;
}
```

### 多态

多态：同一方法在参数不同的情况下做出不同的效果。

 *相比之下，多态属于一条比较简单的特性，用简单的逻辑即可实现。*

简单的逻辑：就是通过判断的参数的对应位置是否有值，来对该值设置默认值。

```javascript
//有参数时返回参数值，无参数时返回1。
function name(a) {
 var oa = a?a:1;
 return a;
}
```

复杂的逻辑：通过function的默认参数arguments来确定各个参数的值，随之做出不同反应。

```javascript
function arr() {
 function a(){
  //无参时
 }
 function b(){
  //1参时
 }
 function c(){
  //2参时
 }
 this.arr = function(){
  switch(arguments.length){
   case 0: return a();
   case 1: return b();
   case 2: return c();
  }
 }
}
```

## End.总结

> 下载地址 [《JavaScript设计模式》](https://pan.baidu.com/s/1Tm3d0OaZn8lecjRVyzMDeA) 提取码: nn42
