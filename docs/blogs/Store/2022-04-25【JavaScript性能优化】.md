---
title: 《JavaScript性能优化》笔记
date: 2022-04-25
tags: 
  - 读书笔记
  - JavaScript
categories: 
  - 读书笔记
---

文章末尾有下载链接。

<!-- more -->

<img src="/blog/images/blog/JavaScript性能优化.png" style="width:200px;margin:0 auto;display:block;">

## 如何测试性能

### 工具、插件

常用工具如下：（因为书的时间比较老，部分工具现在很少有人在用）

- Firebug：火狐官方的
- Performance：Chrome自带的
- Lighthouse：Google的在线工具[在线测试](https://pagespeed.web.dev/?utm_source=psi&utm_medium=redirect)，还有插件版[谷歌商店下载地址](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)
- WebPageTest：可以模拟使用环境、不同地区的访问性能[官方网站](https://www.webpagetest.org/)

### 可视化

为了让数据更直观，可以手动获取页面渲染各节点的事件戳，进行计算后，发送给服务端；服务端统计数据后，使用各种方法来处理渲染图表即可。

文章中使用的是 **R语言** 其实用什么语言都一样，哪个方便用那个。比如前端来处理的话，肯定会使用 echart 来处理数据，只是熟悉R语言可能会觉着这个更快捷方便。

## 自动测试

### 付费API

WebPageTest[价格表](https://product.webpagetest.org/api)，API文档[地址](https://docs.webpagetest.org/api/)。

文章中使用php来调用这个api，但使用啥语言调用都可以，例如使用node也可以。

### 简单的性能分析

思路：数据源 window.performance，经过计算的数据在何时的时候发送数据给后端，后端收集数据后，绘制性能分析图

参数详解：

```javascript

window.performance = {
  "memory": { // MemoryInfo
    "jsHeapSizeLimit": 4294705152 // 所有被使用的js堆栈内存
    "totalJSHeapSize": 21986314 // 当前js堆栈内存总大小
    "usedJSHeapSize": 20497006 // 已使用的 小于 totalJSHeapSize 否则内存泄漏
  },
  "eventCounts": { // EventCounts
    "size": 36 //所有已经分发过的 Event
  },
  "timeOrigin": 1650954287770.1, // 性能测量开始时的时间的高精度时间戳
  "timing": {
    "navigationStart": 1650954287770, // 从同一个浏览器上下文的上一个文档卸载(unload)结束时
    "fetchStart": 1650954287770, // 浏览器准备好使用HTTP请求
    "secureConnectionStart": 1650954287815, // 返回浏览器与服务器开始安全链接的握手时

    "connectStart": 1650954287785, // HTTP请求开始向服务器发送时
    "connectEnd": 1650954287851 // 返回浏览器与服务器之间的连接建立时
    
    "requestStart": 1650954287851, // 浏览器向服务器发出HTTP请求时
    "responseStart": 1650954287924, // 返回浏览器从服务器收到（或从本地缓存读取）第一个字节时
    "responseEnd": 1650954288370, // 返回浏览器从服务器收到（或从本地缓存读取，或从本地资源读取）最后一个字节时

    "redirectStart": 0, // 第一个HTTP重定向开始时
    "redirectEnd": 0, // 最后一个HTTP重定向完成时

    "unloadEventEnd": 0, // unload事件处理完时
    "unloadEventStart": 0, // unload事件抛出时

    "domContentLoadedEventStart": 1650954288497, // 解析器发送DOMContentLoaded (en-US) 事件
    "domContentLoadedEventEnd": 1650954288518, // 解析器发送DOMContentLoaded (en-US) 事件处理完毕

    "domLoading": 1650954287953, // DOM结构开始解析
    "domComplete": 1650954288621, // 当前文档解析完成
    "domInteractive": 1650954288488, // 当前网页DOM结构结束解析、开始加载内嵌资源时

    "domainLookupStart": 1650954287774, // 域名查询开始
    "domainLookupEnd": 1650954287785, // 域名查询结束

    "loadEventStart": 1650954288621, // load (en-US)事件被发送时
    "loadEventEnd": 1650954288622, // load (en-US)事件处理完毕时
  },
  "navigation": {
    "type": 0, // 进入方式
    // 0 通过点击链接，书签和表单提交，或者脚本操作，或者在url中直接输入地址;
    // 1 点击刷新页面按钮或者通过Location.reload()
    // 2 通过历史记录和前进后退访问时
    // 255 任何其他方式
    "redirectCount": 0 // 表示在到达这个页面之前重定向了多少次。
  }
}
```

## 性能优化

书中实际测试过，根据实际情况，适当的遵循以下规则可以提升加载时间

1. 使用`script` 标签的 `async` 属性
2. 惰性加载：在onload里或者在调用时去实例化；异步动态插入js/css文件；
3. 缓存作用域链：例如在循环里取值的性能远差于在外部定义好后在循环村调用（注意 循环次数过少时会有反作用）
4. jq的性能差于js：框架中使用性能会差；建议遵循 **DRY准则**
5. 减少操作dom：循环调用操作dom性能差于缓存需要操作的文件再批量操作dom
6. 减少循环套循环：实际2、3层还勉强能接受，再多就坚决不行

> DRY准则：不要重复做自己做过的事

## End.总结

性能的提升往往要付出更大的代价：需要在可读性、模块化与性能之间做平衡，寻找适合的平衡点能使团队协作更容易

> 下载地址 [《JavaScript性能优化》](https://cloud.189.cn/t/VfM3quqMzIBn) 访问码：d5cb
