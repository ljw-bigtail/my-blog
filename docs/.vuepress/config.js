module.exports = {
  title: 'Leo\'s Blog',
  description: '一枚程序员的日常',
  head:[
    ['link', {rel:'icon', href:'/images/favicon.ico'}]
  ],
  markdown: {
    lineNumbers: true
  },
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  theme: 'reco',
  themeConfig: { // 博客配置
    type: 'blog',
    // logo: '/images/avatar.jpg',
    author: 'Leo',
    authorAvatar: '/images/avatar.jpg',
    friendLink: [
      // {
      //   title: 'vuepress-theme-reco',
      //   desc: 'A simple and beautiful vuepress Blog & Doc theme.',
      //   logo: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
      //   link: 'https://vuepress-theme-reco.recoluan.com'
      // },
    ],
    noFoundPageByTencent: false, // 404 公益
    startYear: '2016',
    sidebar: 'auto',
    // navbar: true,
    subSidebar: 'auto',
    nav: [
      { text: '时间轴', link: '/timeline/', icon: 'reco-date' }
    ],
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: '分类' // 默认文案 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: '标签' // 默认文案 “标签”
      },
      socialLinks: [ // 信息栏展示社交信息
        {
          icon: 'reco-github',
          link: 'https://github.com/ljw-bigtail'
        },
      ]
    },
  },
  // 插件
  plugins: [
    ['vuepress-plugin-mermaidjs'],
  ],
}