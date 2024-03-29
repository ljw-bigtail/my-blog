---
title: 《你不知道的JavaScript》笔记
date: 2022-08-29
tags: 
  - 读书笔记
  - JavaScript
categories: 
  - 读书笔记
---
原书分为上、中、下三册，文章末尾有下载链接。

<!-- more -->

<img src="/blog/images/blog/你不知道的JavaScript.png" style="width:200px;margin:0 auto;display:block;">

## 上卷

### 作用域与闭包

文章从 js 的编译原理为入口，解释作用域。

js 语言的解析器是 V8引擎，浏览器中的解析器会实时的分析 js 的代码，相比其他语言，缺少了提前编译成字节码的步骤，所以引擎在解析 js 代码的时候会通过种种方法来对性能进行优化（例如 JIT[^1]、延迟编译、重编译等）

在解析代码的过程中，必不可少的两个操作变量的步骤 LHS 和 RHS[^2]，相对应的一套取赋值规则引出了作用域概念。

![V8引擎的JIT技术简述](/blog/images/blog/V8引擎的JIT技术简述.jpg)

segmentfault文章：[V8引擎是如何工作的](https://segmentfault.com/a/1190000037435824)

#### 作用域

词法作用域就是代码的位置，

**注意**：`eval()` 函数 、`with()` 函数、`new Function()`都会影响识别作用域，并且会使代码性能有损失，所以一般使用较少。

---

函数函数作用域实际上就是两个大括号标签 `{ ... }`中的代码。

当引擎读取到取值操作时，会一次按照大括号的层级，逐层向上查找是否有过定义（定义包含 var / let / const / function 等），直到全局作用域，如果还没有就抛出异常。

代码中需要注意尽量避免隐式的作用域的提升。

---

全局作用域作为所有作用域的根部级别出现。浏览器中是window，Node.js 中是 global。

#### 闭包

概念：当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用 域之外执行。

理解关键字：函数套函数+外部可访问内部变量（一般都是外部函数返回内部函数，操作）=》闭包

闭包的特点：可以使用私有变量、避免过早的释放内存。

**注意**：闭包与内存泄露问题，除了老旧浏览器的bug以外，闭包不是引起内存泄漏的根本，根本问题一般出自开发者。

### this和对象原型

#### this

this的指向需要从**运行时**去理解，而不是编写时，不是代码位置。脑海中模拟代码的执行，查看函数调用时的位置、参数，以便于确认this的指向。

准确获得this指向的步骤如下：

1. 追溯调用栈（学习方法：在浏览器中打一次 debugger 一步步执行）就可以获得**当前函数的调用位置**
2. 查看调用位置使用那种形式绑定this：默认/显式绑定/隐式绑定
   1. 默认绑定：this 指向全局对象 `window`（定义函数为严格模式时：this 指向 undefined，调用时是否严格模式不影响）
   2. 隐式绑定：函数被绑定到对象下调用， this指向上一层（不是对象的根）
      1. 隐式丢失：函数被再次赋值给其他变量，this指向新的调用此变量时的环境
   3. 显式绑定：
      1. API绑定：bind / call / apply
      2. 实例化绑定：function / class => new
3. 绑定类型可能不唯一，显示会覆盖隐式
4. 特殊情况
   1. bind 传入了 `null` `undefined`，实际会应用默认绑定
   2. 软绑定：需要手动实现，如果绑定到了全局，就更改绑定到obj，代码如下
   3. 箭头函数：指向调用时绑定的对象上 且 箭头函数的this无法被修改（任何情况）

**Polyfill例子：**

```JavaScript
// 软绑定
if (!Function.prototype.softBind) { 
  Function.prototype.softBind = function(obj) {
    var fn = this;
    // 捕获所有 curried 参数
    var curried = [].slice.call( arguments, 1 ); var bound = function() {
      return fn.apply((!this || this === (window || global)) ?
        obj : this,
        curried.concat.apply( curried, arguments )
      ); 
    };
    bound.prototype = Object.create( fn.prototype );
    return bound; 
  };
}
```

#### 对象与类

##### 属性描述符[ES5]

对象的属性新增了描述符，通过函数 `Object.defineProperty(object, key, options)`控制，options支持 ：

1. writable：属性是否可编辑
2. configurable：描述符可修改，置为false时delete属性也会失效
3. enumerable：是否在枚举中出现
4. getter setter：操作 读/写 命令时，触发的监测回调

相关API：

- `Object.preventExtensions(obj)` 禁止后面再向对象添加新属性
- `Object.seals(obj)` 执行 Object.preventExtensions 并设置 configurable: false
- `Object.freeze(obj)` 执行 Object.seals 并设置 writable: false

##### 类的继承与钻石问题

继承：子类包含父类的属性、api等，子类修改属性不会影响父类。

由此引出一个问题，如果子类同时继承于多个父类（复杂的结构中继承的层级关系更高）并且多个父类中存在同名但功能不一致的方法，那么字类继承了哪个父类的这个方法？

JavaScript 为了解决这个问题，提出了 **混入** 的方式：

根据代码写法分为显式 / 隐式混入，原理一致，怎么实现都可以

```js
var A = {oh: function(){console.log('aa')}}
var B = {oh: function(){console.log('bb')}}
function mixin( sourceObj, targetObj ) {
  for (var key in sourceObj) {
    if (!(key in targetObj)) { // 只会在不存在的情况下复制 
      targetObj[key] = sourceObj[key];
    }else{
      var func = targetObj[key] // 先存一下，防止调用后死循环
      targetObj[key] = function(){
        sourceObj[key].call( targetObj ) // 执行 source 的部分
        func() // 执行 target 部分
      }
    }
  }
  return targetObj; 
}
var c = mixin(A, B)
c.oh()
// 打印结果：
// VM813:1 aa
// VM813:2 bb
```

关于mixin 可查看文章：[阮一峰 ES6入门 - mixin](https://github.com/ruanyf/es6tutorial/blob/3929f4f21148dcd2a10d2ebc722323a5dbd473f4/docs/mixin.md)

##### 行为委托与类即成的风格区别

首先需要确定的一点是，js中没有真实的类，都是用 `prototype`去模拟实现的，即使到 ES6 中出现了 class ，但 class ，与其他语言中的类并不一致，不是真实的类，实际是 `prototype`的语法糖。

```JavaScript
// js模拟类的继承
function Foo(who) { 
  this.me = who;
}
Foo.prototype.identify = function() {
  return "I am " + this.me; 
};
function Bar(who) { 
  Foo.call( this, who );
}
Bar.prototype = Object.create( Foo.prototype );
Bar.prototype.speak = function() {
  alert( "Hello, " + this.identify() + "." );
};
var b1 = new Bar( "b1" );
var b2 = new Bar( "b2" ); 
b1.speak();
b2.speak();

// 行为委托（对象关联）
Foo = {
  init: function(who) {
    this.me = who; 
  },
  identify: function() {
    return "I am " + this.me;
  } 
};
Bar = Object.create( Foo );
Bar.speak = function() {
  alert( "Hello, " + this.identify() + "." );
};
var b1 = Object.create( Bar );
b1.init( "b1" );
var b2 = Object.create( Bar );
b2.init( "b2" );
b1.speak();
b2.speak();
```

相比于类-继承的实现方式，该书更推荐使用对象-委托的形式来实现同样的功能，相比之下更简洁，更贴合js的设计理念。

当然这里不是否定类的形式，只是说我们还有别的途径去实现对应功能，毕竟类的形式的 ES6 的语法糖 class 也很简洁。

## 中卷

### 类型和语法

#### 类型

js 的内置类型包含：undefined null boolean number string object symbol；

> js 中对变量没有类型的限制，值才有类型（这也就是被大家诟病的一点，所以 TS 的认可度越来越高）

1. API借用：使用A类型数据的 API 处理 B类型数据，但不是所有 api 都可以借用
   1. `Array.prototype.join.call('test', "-")` 可以使用
   2. `Array.prototype.reverse.call('test', "-")` 报错: 不能给对象的只读属性‘0’赋值 (Cannot assign to read only property '0' of object '[objec String]')。 通过解构赋值，转换为数组后可以使用：`Array.prototype.reverse.call([...'test'], "-")`
2. Number：js 的number是浮点数，浮点数存在一些问题
   1. `0.1 + 0.2 != 0.3` 因为浮点数存在一个机器精度\[2^-52\]，所以可以认为 差小于机器精度时看作相等
   2. 存在最大范围，Number.MAX_SAFE_INTEGER = 2^53 - 1, Number.MIN_SAFE_INTEGER = - (2^53 - 1)
   3. `NaN !== NaN`（非自反） Window.isNaN 函数一直有严重缺陷，建议使用 ES6 中的 Number.isNaN 或者利用 **非自反** 特性写ployfill
   4. `-0 === 0` 某些情况下需要判断是否是 -0 需要手动实现
3. `b = a`：分为两种：引用（浅复制） / 赋值
   1. 复合值（object array）使用引用，修改b时会连带修改a
   2. 简单值（number string NaN undefined boolean symbol）使用赋值，修改b不会影响a
4. void：使用 void 加任何值 可取到内置等 undefined
5. 原生函数可以用来作为构造器来创建对应类型的数据，但一般不建议使用，尽量让浏览器根据数据自行推断
6. Symbol（符号） ES6新增，一般使用在创建不重复的属性(即使 Symbol.create 一致)，或者用来代替私有属性，防止被外部调用 注意：`Symbol(1) !== Symbol(1)`
7. 强制类型转换：显式 / 隐式；
   1. 调用类型自带api都属于(JSON.stringify除外)、一元运算符也属于，下面说写不常见的显示：
      1. +new Date()：可以获得时间戳(Date => number)
      2. ~'15' == -16：a 会先 `parseInt(a)` 再计算 `-a - 1`
   2. 隐式 就是很好用，但是别人看的时候容易漏掉，导致被很多人诟病，例如：
      1. 1 + '' (number => string)
      2. if(xx){} (any => boolean)
      3. && / || (any => boolean)
      4. [] + {} ([] => "" ,{} => "[object Object]") => "[object Object]"
      5. {} + [] ({} => 空代码块, + [] => 0) => 0
8. == 与 ===：需要注意 == 会隐式类型转换，可能会导致某些异常

**Polyfill例子：**

```JavaScript
// polyfill
// 忽略机器精度对比两个值是否一致
if (!Number.EPSILON) { // 机器精度
  Number.EPSILON = Math.pow(2,-52);
}
function numbersCloseEnoughToEqual(n1,n2) {
  // 忽略机器精度
  return Math.abs( n1 - n2 ) < Number.EPSILON;
}
// 判断是否是 NaN
 if (!Number.isNaN) {
  Number.isNaN = function(n) {
    // 需要判断类型，因为其他类型中也会存在非自反的现象，例如 Symbol()
    return typeof n === 'number' && n !== n;
  };
}
// 是否是 -0
function isNegZero(n) {
  n = Number( n );
  return (n === 0) && (1 / n === -Infinity);
}
```

#### 语法

1. goto 其他语言中有这个用来表示跳转到某处执行，但js中没有，可以使用下面的方法实现类似效果
   1. `continue XX` 会截止当前代码并继续执行名称为 XX 的代码块，一般XX不填，表示直接进行本该代码块
   2. `break XX` 类似continue，截止名称为XX的循环
2. else if 并不是原生语法，实际是由 else{ if(){} } 简写else后的代码块包裹 产生的一种简写语法
3. 运算符优先级： = > && > || > ?: （实际使用还是建议手动使用小括号标注好组合，加强易读性）
4. 自动分号插入：建议加上分号 [来源：JavaScript 的作者Brendan Eich](http://brendaneich.com/2012/04/the-infernal-semicolon/)

**例子：**

```JavaScript
// 代码跳转 ？X  截止代码执行并从某处继续执行
foo: for (var i=0; i<4; i++) { // 给代码块添加 标签
  for (var j=0; j<4; j++) {
    if (j == i) continue foo; // 结束循环并开始执行标签为 foo的循环
    if ((j * i) % 2 == 1) continue; // 继续执行当前循环
    console.log( i, j );
  }
}
/*
VM6733:12 1 0
VM6733:12 2 0
VM6733:12 2 1
VM6733:12 3 0
VM6733:12 3 2
 */
// else if
if(){}
else{
  if(){}
}
// 简写后演化成了   
if(){
}else if(){
}
```

### 异步和性能

#### 异步

js的程序的执行至少分为两部分 一部分现在运行，一部分将来运行。其中现在运行代码中可以立即得到结果的一般代码，将来运行的是延时代码和大部分异步代码中的回调还有。

setTimeOut、setInterval 函数的第二个参数不是一定准确的，是因为如果运行的代码阻塞了进程，那么时间会随之延长，但是代码可以保证 参数值越大，顺序越靠后（即延长的时间不确定但顺序可以保证）

回调嵌套层级多了就很难理解真正的代码意图（回调地狱），解决办法就是使用Promise。

虽然Promise让代码更完善，但还有一些局限性：例如单一链式可能无法满足更复杂业务的情景；只支持抛出一个异常；理论上性能可能会有微小的损失。

> 除了Promise，ES6还有Generator来执行异步代码：**Generator**（生成器，异步流程控制）

```javascript
var x = 1;
function *foo() { // 定义Generator
  x++;
  yield; // 暂停！
  console.log( "x:", x );
}
function bar() {
  x++;  
}
// 使用
var it = foo() // 初始化Generator
it.next() // 启动Generator, 执行到第一个 yield
console.log( x ); // 2
bar()
console.log( x ); // 3
it.next() // 启动Generator，继续执行后续代码
// x: 3
// 注意 next 会比 yield多一个，是因为执行到第一个 yield 也需要一次 next
```

Generator 可以手动的控制代码的执行、暂停、继续执行的操作，并且可以多次启停，可以暂停后不再执行，打破了原本函数不可暂停的特征。

```javascript
// 异步 Generator
function foo(url) {
  ajax(url, function(err,data){
    if (err) { 
      it.throw(err); // 向*main()抛出一个错误
    } else {
      it.next(data); // 用收到的data恢复*main()
    }
  });
}
function *main() {
  try {
    var text = yield foo(url);
    console.log(text);
  } catch (err) {
    console.error(err);
  }
}
var it = main();
it.next(); // 启动
```

#### 性能

众所周知，js是单线程执行的，但是有了Web Worker，可以把高运算量代码使用 Web Worker 创建一个新的线程执行，通过 message 事件和 postMessage 来进行通信。需要注意的是，这部分js并不能直接操作DOM，一般用于密集型数学计算、数据处理、高流量网络通信等较高资源占用的工作。

> 注意，Web Worker不是虚拟的线程可比拟的，相当于多个可以通信的独立线程！

性能优化：

1. 微观下（类似换个语法）性能差别实际非常小，大部分时候没有优化必要
2. 尾调用优化（TCO）: 直观的表示就是在函数调用时参数重进行计算，不要在函数调用完再计算可以更快更省内存，在递归时尤其明显

## 下卷

### 深入JS

1. == 与 === 什么时候使用？当等式一边出现特定值（true false 0 "" []）时用 ===，其他情况 == 也能满足
2. 严格模式可以不允许 var 隐式全局变量声明，易于引擎优化代码，建议全局打开
3. polyfill 使用旧版js兼容的函数来实现新版js的功能，编译后就可以自动支持旧版浏览器
4. DOM API是浏览器的 不是js的，例如：在支持js的node中，是不包含dom api的

> 因为历史原因，相比传统语言，js的知识点更零散，现在看来 js 这几年处在一个飞速发展的时代，由于js的种种特性使得js在更多平台、更多环境中使用，所以 好好学习吧 骚年

## End.总结

> 下载地址 [《你不知道的JavaScript》上卷](https://cloud.189.cn/t/UfYzu2nqQVRn) 访问码：z4xn
> 下载地址 [《你不知道的JavaScript》中卷](https://cloud.189.cn/t/RfEjMzJJnm2m) 访问码：qki4
> 下载地址 [《你不知道的JavaScript》下卷](https://cloud.189.cn/t/NNB7NfEFzmi2) 访问码：fw4h

[^1]: 全称 Just In Time，可以简单的理解为：代码的解释器和编译器一起执行

[^2]: LHS 和 RHS 分别理解为赋值操作的左侧与右侧，左侧可以理解成取值、右侧可以理解成赋值
