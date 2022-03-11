/*
 * @Descripttion:
 * @Author: ycc
 * @Date: 2022-02-25 10:01:28
 * @LastEditTime: 2022-03-11 11:18:41
 */
const path = require('path');

module.exports = {
  title: 'DreamFish Shows',
  head: [
    // 注入到当前页面的 HTML <head> 中的标签
    // ['link', { rel: 'icon', href: '/avatar.png' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  configureWebpack: {
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        '@': path.resolve(__dirname, '../../src'),
      },
    },
  },
  themeConfig: {
    nav: [
      // 以/结尾的路径，默认链接到/README.md
      { text: '首页', link: '/' },
      { text: '组件', link: '/components/CommonForm/' },
    ],
    sidebar: [
      ['/components/CommonForm', 'CommonForm公共表单'],
      ['/components/CustomDraw', 'selfDraw绘图组件'],
    ],
  },
  plugins: ['demo-container'],
};
