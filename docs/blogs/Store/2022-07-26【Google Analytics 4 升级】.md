---
title: Google Analytics 4 升级
date: 2022-07-26
tags: 
  - JavaScript
  - 统计监测
categories: 
  - JavaScript
---

Universal Analytics To Google Analytics（分析）4

<!-- more -->

## 版本说明

1. Universal Analytics **[UA]**
   1. analytics.js
   2. gtag.js
2. Google Analytics（分析）4 **[GA4]**
   1. gtag.js

UA版本中 analytics.js 是更老的版本，官方曾经有过一次升级到 gtag.js 的说明，如果这次想从 UA 的 analytics.js 直接升级到 GA4 可以直接[看这里：[UA→GA4] 向 Google Analytics（分析）4 发送 analytics.js 事件、计时和异常命中](https://support.google.com/analytics/answer/11150547)

如果 UA版本中使用的是 gtag.js 那么就可以做到直接升级。有两种做法：

1. 将 Google Analytics（分析）4 媒体资源与 Universal Analytics 媒体资源进行关联。官方文档看这里：[设置助理 [GA4]](https://support.google.com/analytics/answer/10312255)
2. 添加代码 `gtag('config', 'G-XXXXXXXX');`。官方文档看这里：[[UA→GA4] UA 的 gtag.js 与 GA4 之间对应关系 - 基本数据收集](https://support.google.com/analytics/answer/9310895#gtagjs-enable-basic)

## 详细说明

> 我们是从 UA gtag.js 升级到 GA4 ，且需要两个版本同时运行

只需要两步：

1. 手动添加包含 GA4 衡量 ID (G-XXXXXXXX) 的新“config”指令
2. 根据需求调整参数

[[UA→GA4] 将事件同时发送到您的 UA 媒体资源和 GA4 媒体资源](https://support.google.com/analytics/answer/11091026)

## 其他

> 只说网站相关

1. 默认的转化事件：**purchase** [来源：[GA4] 设置和管理转化事件](https://support.google.com/analytics/answer/9267568)
2. 自动收集的事件：[来源：[GA4] 自动收集的事件](https://support.google.com/analytics/answer/9234069)
   1. 点击 每当用户点击会将他们带离当前网域的链接时触发
   2. file_download 当用户点击指向以下类型的文件（带有常见文件扩展名）的链接时触发
   3. first_visit 当用户首次访问/启动启用了 Analytics（分析）的网站
   4. page_view 当网页加载或处于活动状态的网站更改浏览器历史记录状态时触发
   5. scroll 当用户首次到达每个页面的底部时（即，当页面 90% 的垂直深度可见时）触发
   6. session_start 当用户与应用或网站互动时触发
   7. user_engagement 当应用在前台运行或网页在浏览器活动窗口中显示至少 1 秒时触发
   8. video_complete 当视频播放完毕时触发（启用 JS API 支持 的嵌入式YouTube）
   9. video_progress 当视频播放完毕时触发（启用 JS API 支持 的嵌入式YouTube）
   10. video_start 当视频播放时长超过 10%、25%、50% 和 75% 时触发（启用 JS API 支持 的嵌入式YouTube）
   11. view_search_results 当用户执行网站搜索时触发，此类事件以网址查询参数表示

## 官方文档

1. [改用 Google Analytics（分析）4](https://support.google.com/analytics/answer/10759417?hl=zh-Hans&ref_topic=10737980)
2. [[UA→GA4] 将电子商务数据收集功能从 UA 迁移到 GA4](https://support.google.com/analytics/answer/10119380?hl=zh-Hans&ref_topic=11053132)
3. [**GA4 API 文档**](https://developers.google.com/analytics/devguides/collection/ga4/reference/config#client_id)