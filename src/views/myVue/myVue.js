import Compile from './Compile';
import observe from '../reactive/observe';
import Watcher from '../reactive/Watcher';
const el = document.querySelector('#myVue');
// console.log(el, 11);

/* 对vue的测试，要用一个不被Vue编译的DOM节点 */
class Vue {
  constructor(options = {}) {
    this.$options = options;
    this._data = options.data;
    // 将数据变为响应式
    observe(this._data);
    this._initData();
    this._initWatch(options.watch);
    console.log(this, 'myVue');
    //模板编译
    new Compile(options.el, this);
  }
  _initData() {
    /* 将data直接绑定在Vue组件实例上，方便访问，不需要多一层_data */
    Object.keys(this._data).forEach(key => {
      Object.defineProperty(this, key, {
        get: () => {
          return this._data[key];
        },
        set: value => {
          this._data[key] = value;
        }
      });
    });
  }
  _initWatch(watch) {
    if (Object.prototype.toString.call(watch) === '[object Object]') {
      /* 每个属性都设置Watcher */
      Object.keys(watch).forEach(key => {
        new Watcher(this, key, watch[key]);
      });
    }
  }
}

export default new Vue({
  el,
  data: {
    x: -1,
    a: {
      b: 2
    }
  },
  watch: {
    x() {
      console.log(this, 'this');
      console.log(`x改变啦`);
    }
  }
});
