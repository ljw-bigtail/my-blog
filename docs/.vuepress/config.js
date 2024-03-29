module.exports = {
  title: "鹿酒的博客",
  description: '思绪不停，记录不止',
  head:[
    ['link', {rel:'icon', href:'/favicon.ico'}],
    //  manifest add
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#ABC4AA' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }], // 删除默认的苹果工具栏和菜单栏
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }], // 控制状态栏显示样式
    ['link', { rel: 'apple-touch-icon', href: '/images/avatar.jpg' }], //苹果收藏书签图标
    ['link', { rel: 'mask-icon', href: '/favicon.ico', color: '#000000' }],
    ['meta', { name: 'msapplication-TileImage', content: '/images/avatar.jpg' }], // windows 磁贴图
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }], // windows 磁贴文字颜色
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no' }] // 禁止缩放
  ],
  base: "/blog/",
  markdown: {
    lineNumbers: true
  },
  // evergreen: true, // 不用支持老的浏览器
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  theme: 'reco',
  themeConfig: { // 博客配置
    type: 'blog',
    mode: 'dark', // 默认 auto，auto 跟随系统，dark 暗色模式，light 亮色模式
    modePicker: false, // 默认 true，false 不显示模式调节按钮，true 则显示
    logo: '/images/avatar.jpg',
    author: '鹿酒',
    authorAvatar: '/images/avatar.webp',
    // friendLink: [
    //   {
    //     title: 'vuepress-theme-reco',
    //     desc: 'A simple and beautiful vuepress Blog & Doc theme.',
    //     logo: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
    //     link: 'https://vuepress-theme-reco.recoluan.com'
    //   },
    // ],
    noFoundPageByTencent: false, // 404 公益
    startYear: '2016',
    sidebar: 'auto',
    // navbar: true,
    subSidebar: 'auto',
    nav: [
      { 
        text: '时间轴', 
        link: '/timeline/', 
        // icon: 'reco-date' 
      },
      { 
        text: '鹿酒的院子', 
        link: 'https://www.numplanet.com/', 
        // icon: 'reco-home' 
      },
    ],
    blogConfig: {
      // category: {
      //   // location: 3, // 在导航栏菜单中所占的位置，默认2
      //   text: '分类', // 默认文案 “分类”
      // },
      tag: {
        location: 1, // 在导航栏菜单中所占的位置，默认3
        text: '标签', // 默认文案 “标签”
      },
      // socialLinks: [ // 信息栏展示社交信息
      //   {
      //     icon: 'reco-home',
      //     link: 'https://www.numplanet.com/'
      //   },
      //   {
      //     icon: 'reco-github',
      //     link: 'https://github.com/ljw-bigtail'
      //   },
      // ]
    },
    // 备案
    // record: 'ICP 备案文案',
    // recordLink: 'ICP 备案指向链接',
    // cyberSecurityRecord: '公安部备案文案',
    // cyberSecurityLink: '公安部备案指向链接',
  },
  // 插件
  plugins: [
    ['vuepress-plugin-mermaidjs'],
    ['@vuepress/medium-zoom']
    // 更新刷新插件
    ['@vuepress/pwa', {
      serviceWorker: true,
      updatePopup: {
        message: "发现新内容可用",
        buttonText: "刷新"
      }
    }],
    // 代码复制弹窗插件
    ["vuepress-plugin-nuggets-style-copy", {
      copyText: "复制代码",
      tip: {
        content: "复制成功!"
      }
    }],
    // 动态标题
    ["dynamic-title",
      {
        showIcon: "/favicon.ico",
        showText: "(/≧▽≦/)Hi~！",
        hideIcon: "/favicon.ico",
        hideText: "(●—●)看这里～看这里！",
        recoverTime: 2000
      }
    ],
    // Mini Sandbox
    // https://buuing.github.io/mini-sandbox/#/
    ['vuepress-plugin-mini-sandbox'],
  ],
}