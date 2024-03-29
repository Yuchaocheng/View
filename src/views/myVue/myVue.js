import Compile from './Compile';
import observe from '../reactive/observe';

/* 对vue的测试，要用一个不被Vue编译的DOM节点 */
class MyVue {
  constructor(options = {}) {
    this.$options = options;
    this._data = options.data;
    // 将数据变为响应式
    observe(this._data);
    this._initData();
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
}
export default MyVue;

