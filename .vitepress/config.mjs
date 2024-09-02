import { defineConfig } from 'vitepress'
import { set_sidebar } from "./utils/auto_sidebar.mjs";	// 改成自己的路径

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // base: "/vitepress2.0",
  title: "星梦启航",
  description: "A VitePress Site",
  head: [
    ['link', { rel: 'icon', href: '/lin.png' }]
  ],
  themeConfig: {

    // logo: 'https://iconfont.alicdn.com/p/illus_3d/file/CfQEcKFxiKhC/d0f30eb9-1cbe-40e4-9002-38550a8ed7e7.png',
    logo: '/lin.png',
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
      {
        icon: { svg: '<svg t="1724502550766" class="icon" style="width: 1.5em;height: 1.5em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9195"><path d="M946 528.156a18 18 0 0 1-18-18V102a18 18 0 0 1 36 0v408.156a18 18 0 0 1-18 18zM70 527.064a18.004 18.004 0 0 1-18-18V102a18 18 0 0 1 36 0v407.06a18.004 18.004 0 0 1-18 18.004z" fill="#6E6E96" p-id="9196"></path><path d="M27.016 680.908c0 30.928 25.072 56 56 56H930c30.928 0 56-25.072 56-56v-115.844c0-30.928-25.072-56-56-56H83.016c-30.928 0-56 25.072-56 56v115.844z" fill="#54BCE8" p-id="9197"></path><path d="M930 754.916H83.016c-40.804 0-74-33.196-74-74v-115.852c0-40.804 33.196-74 74-74H930c40.804 0 74 33.192 74 74v115.852c0 40.804-33.196 74-74 74zM83.016 527.064c-20.952 0-38 17.048-38 38v115.852c0 20.948 17.048 38 38 38H930c20.952 0 38-17.052 38-38v-115.852c0-20.952-17.048-38-38-38H83.016z" fill="#6E6E96" p-id="9198"></path><path d="M930 663.208H83.016c-30.928 0-56-25.072-56-56v80.128c0 30.928 25.072 56 56 56H930c30.928 0 56-25.072 56-56v-80.128c0 30.928-25.072 56-56 56z" fill="#6E6E96" opacity=".2" p-id="9199"></path><path d="M881.236 835.864c0 68.1-55.716 123.816-123.812 123.816H258.612c-68.1 0-123.816-55.716-123.816-123.816v-425.76c0-68.1 55.716-123.816 123.816-123.816h498.804c68.1 0 123.82 55.716 123.82 123.816v425.76z" fill="#7FDDFF" p-id="9200"></path><path d="M810.496 312.544a118.852 118.852 0 0 1 13.768 55.564v412.344c0 65.952-53.964 119.916-119.916 119.916H221.26c-20.024 0-38.924-5-55.564-13.764 20.12 38.164 60.212 64.356 106.148 64.356h483.092c65.952 0 119.916-53.964 119.916-119.916V418.692c0-45.936-26.188-86.024-64.356-106.148z" fill="#6E6E96" opacity=".2" p-id="9201"></path><path d="M190.524 859.684V454.52c0-64.804 53.024-117.828 117.828-117.828h474.68c19.04 0 40.796 2.576 40.796 2.576-14.02-44.088-47.132-54.68-92.9-54.68H256.252c-64.804 0-117.828 53.024-117.828 117.828v405.164c0 45.764 13.888 74.564 58.528 90.248-8.112-15.956-6.428-19.1-6.428-38.144z" fill="#B2EBFF" p-id="9202"></path><path d="M345.284 575.208m-114.972 0a114.972 114.972 0 1 0 229.944 0 114.972 114.972 0 1 0-229.944 0Z" fill="#E6E8F3" p-id="9203"></path><path d="M345.284 707.184c-72.772 0-131.976-59.204-131.976-131.98 0-72.772 59.204-131.976 131.976-131.976 72.776 0 131.98 59.204 131.98 131.976 0 72.776-59.204 131.98-131.98 131.98z m0-229.944c-54.02 0-97.968 43.948-97.968 97.968s43.948 97.972 97.968 97.972 97.972-43.952 97.972-97.972-43.948-97.968-97.972-97.968z" fill="#6E6E96" p-id="9204"></path><path d="M672.08 575.208m-114.972 0a114.972 114.972 0 1 0 229.944 0 114.972 114.972 0 1 0-229.944 0Z" fill="#E6E8F3" p-id="9205"></path><path d="M672.08 707.184c-72.768 0-131.976-59.204-131.976-131.98 0-72.772 59.208-131.976 131.976-131.976 72.776 0 131.984 59.204 131.984 131.976-0.008 72.776-59.208 131.98-131.984 131.98z m0-229.944c-54.016 0-97.968 43.948-97.968 97.968s43.952 97.972 97.968 97.972c54.024 0 97.976-43.952 97.976-97.972s-43.956-97.968-97.976-97.968z" fill="#6E6E96" p-id="9206"></path><path d="M346.792 508.436c48.724 0 89.536 33.76 100.396 79.16a103.4 103.4 0 0 0 2.856-24.1c0-57.024-46.228-103.256-103.252-103.256-57.024 0-103.256 46.228-103.256 103.256 0 8.3 1.004 16.364 2.856 24.1 10.864-45.4 51.68-79.16 100.4-79.16zM672.08 508.436c48.728 0 89.54 33.76 100.4 79.16a103.4 103.4 0 0 0 2.856-24.1c0-57.024-46.232-103.256-103.252-103.256s-103.252 46.228-103.252 103.256c0 8.3 1.004 16.364 2.856 24.1 10.86-45.4 51.668-79.16 100.392-79.16z" fill="#6E6E96" opacity=".2" p-id="9207"></path><path d="M757.416 977.684H258.612c-78.196 0-141.816-63.62-141.816-141.82v-425.76c0-78.196 63.62-141.816 141.816-141.816h498.804c78.204 0 141.82 63.62 141.82 141.816v425.756c0 78.204-63.62 141.824-141.82 141.824zM258.612 304.288c-58.348 0-105.816 47.468-105.816 105.816v425.756c0 58.348 47.468 105.82 105.816 105.82h498.804c58.352 0 105.82-47.472 105.82-105.82V410.104c0-58.348-47.468-105.816-105.82-105.816H258.612z" fill="#6E6E96" p-id="9208"></path><path d="M320 555.208h48.792V604H320zM647.688 555.208h48.792V604h-48.792zM374.76 782h274.484v36H374.76z" fill="#6E6E96" p-id="9209"></path></svg>' },
        link: 'https://www.linxu.us.kg/'
      },
      { icon: 'github', link: 'https://github.com/linchuxu/vitepress2.0' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present lcx'
    }
  }
})
