### 渲染函数 与 jsx
Vue 推荐在绝大多数情况下使用模板来创建你的 HTML。然而在一些复杂场景中，你真的需要 JavaScript 的完全编程的能力。这时你可以用渲染函数，它比模板更接近编译器。
举个很简单的例子。想要渲染一个通过属性来动态渲染h1、h2

```javascript
<template>
  <h1 v-if="level === 1">
    <slot></slot>
  </h1>
  <h2 v-else-if="level === 2">
    <slot></slot>
  </h2>
  <h3 v-else-if="level === 3">
    <slot></slot>
  </h3>
  <h4 v-else-if="level === 4">
    <slot></slot>
  </h4>
  <h5 v-else-if="level === 5">
    <slot></slot>
  </h5>
  <h6 v-else-if="level === 6">
    <slot></slot>
  </h6>
</template>
```
用到大量的if判断，写起来很冗余，写法不灵活。
用render函数怎么写？
```javascript
props: {
  level: {
    type: Number,
    default: 1
  }
},
render: function (h) {
    return h(
      'h' + this.level,   // 标签名称
      this.$slots.default // 子节点数组
    )
  }
```
是不是很简单。
jsx写法
```javascript
render: () => {
	const CustomTag = `h${this.level}`;
	return <CustomTag>{this.$slots.default}</CustomTag>;
}
```
vue template语法简单明了，数据操作与视图分离，开发体验友好。但是在某些特定场合中，会限制一些功能的扩展，扩展难度大，不易扩展。可能会造成逻辑冗余，如解析字符串类型的模板文件等。以上功能的实现可以借助vue的render语法，render语法比template更偏底层，允许在HTML中使用js语法，可以极大的扩展HTML的能力。
render函数注入了一个参数createElement,用来创建我们所需要的标签内容，有三个参数：HTML标签（elementTag），标签属性（option），子元素（children）;从createElement的参数列表里面可以看出，如果组件内部结构嵌套比较深，render的语法写起来会比较繁琐，需要不断的调用createElement，jsx也是一种很好的选择，区别在于jsx可以像我们写HTML文件一样写业务代码，借助于babel，会将jsx语法转换成render语法。
总结：
 1、render渲染方式可以让我们将js发挥到极致，因为render的方式其实是通过createElement()进行虚拟DOM的创建。逻辑性比较强，适合复杂的组件封装。
 2、template是类似于html一样的模板来进行组件的封装。
 3、render的性能比template的性能好很多
 4、render函数优先级大于templatea