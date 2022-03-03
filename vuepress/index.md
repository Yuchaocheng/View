<!-- vuepress使用经验
 * @Descripttion:
 * @Author: ycc
 * @Date: 2022-03-02 10:35:10
 * @LastEditTime: 2022-03-02 10:35:10
-->

## 组件文档搭建记录

1. 可以直接在 vuepress 中使用组件
2. 1 带来的问题是 组件 和 组件展示的代码要重复写两遍
3. 所以可以利用 vuepress-plugin-demo-container 插件解决这个问题
4. vuepress-plugin-demo-container 插件还能解决 Vuepress 无法渲染 Markdown 中多个 export default {} 代码块，

## common-form 研发记录

1. el-form 自身的属性和方法通过$attrs和$listener 接收
2. 默认值问题，要根据v-mdoel绑定的值类型赋默认值，比方说el-check-box需要一个数组，如果
