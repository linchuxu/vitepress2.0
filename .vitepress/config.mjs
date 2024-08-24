import { defineConfig } from 'vitepress'
import { set_sidebar } from "./utils/auto_sidebar.mjs";	// 改成自己的路径

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // base: "/vitepress2.0",
  title: "星梦启航",
  description: "A VitePress Site",
  head: [
    // ['script', { src: 'https://iconfont.alicdn.com/p/illus_3d/file/CfQEcKFxiKhC/d0f30eb9-1cbe-40e4-9002-38550a8ed7e7.png' }],
    ['link', { rel: 'icon', href: 'https://iconfont.alicdn.com/p/illus_3d/file/CfQEcKFxiKhC/d0f30eb9-1cbe-40e4-9002-38550a8ed7e7.png' }]
  ],
  themeConfig: {

    logo: 'https://iconfont.alicdn.com/p/illus_3d/file/CfQEcKFxiKhC/d0f30eb9-1cbe-40e4-9002-38550a8ed7e7.png',
    nav: [
      {
        text: 'Home',
        items: [
          { text: 'Home', link: '/' },
          { text: '示例', link: '/markdown-examples' }
        ]
      },
      {
        text: '前端学习',
        items: [
          { text: 'TypeScript', link: '/hcj/TypeScript' },
          { text: 'Vue3', link: '/hcj/Vue' },
        ]
      },
      {
        text: '后端学习',
        items: [
          { text: 'Java', link: '/backend/java' },
          { text: 'SpringBoot', link: '/backend/spring' },
          { text: 'Mybatis', link: '/backend/mybatis' },
        ]
      },
      { text: '网络工程', link: '/network' },
      { text: '数据库', link: '/database' },
      { text: '教程', link: '/course' },
      { text: '资源导航', link: 'https://linchuxu.us.kg/#/side' },
    ],
    //本地搜索
    // 设置搜索框的样式
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
    //中英文
    i18nRouting: true,
    outlineTitle: "文章目录",
    outline: {
      level: [2, 6],
      label: '当前页'
    },
    // sidebar: [
    //   {
    //     text: '基础篇',
    //     collapsed: false,
    //     items: [
    //       { text: '基础篇', link: '/basic/index' },
    //       { text: '基础篇1', link: '/basic/basic1' }
    //     ]
    //   },
    //   {
    //     text: 'API 篇',
    //     collapsed: true,
    //     items: [
    //       { text: 'API篇', link: '/api/index' },
    //       { text: 'API篇1', link: '/api/api1' }
    //     ]
    //   },
    //   {
    //     text: '核心篇',
    //     collapsed: false,
    //     items: [
    //       { text: '核心篇', link: '/core/index' },
    //       { text: '核心篇1', link: '/core/core1' }
    //     ]
    //   }
    // ],
    sidebar: {
      "/network": set_sidebar("/network"),
      "/hcj/TypeScript": set_sidebar("/hcj/TypeScript"),
      "/hcj/Vue": set_sidebar("/hcj/Vue"),
      "/backend/java": set_sidebar("/backend/java"),
      "/backend/spring": set_sidebar("/backend/spring"),
      "/backend/mybatis": set_sidebar("/backend/mybatis"),
      "/database": set_sidebar("/database"),
      "/course": set_sidebar("/course"),
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/linchuxu/vitepress2.0' },
      // { icon: "📘", link: 'https://linchuxu.us.kg/#/side' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present lcx'
    }
  }
})
