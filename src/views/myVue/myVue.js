import Compile from './Compile';
const el = document.querySelector('#myVue');
console.log(el, 11);

/* 对vue的测试，要用一个不被Vue编译的DOM节点 */
class Vue {
  constructor(options = {}) {
    this.$options = options;
    this._data = options.data;
    // 数据需要变为响应式

    //模板编译
    new Compile(options.el, this);
  }
}

new Vue({});
