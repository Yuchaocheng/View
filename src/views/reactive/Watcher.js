import Dep from './Dep';
var uid = 0;

/* 
   为什么引入Watcher？
   当属性发生变化时，我们要通知用到此数据属性的地方，而使用此数据的地方很多且类型不一样，需要抽象出一个类集中处理
   这些情况，然后再依赖收集阶段只收集这个封装好的实例，通知也只需要通知这一个，然后它在负责通知其他的地方。
*/

const parsePath = str => {
  let segments = str.split('.');
  return obj => {
    /* 为什么不直接读取一个对象的a.b.c，而是要一层一层读？原因在于想要触发defineReactive每一层的getter
       此时读取每一层的getter时，就会将依赖收集到Dep中
    */
    segments.forEach(segment => {
      obj = obj[segment];
    });
    return obj;
  };
};
export default class Watcher {
  constructor(target, expression, callback) {
    this.id = uid++;
    this.target = target;
    this.getter = parsePath(expression);
    this.callback = callback;
    this.value = this.get();
  }
  update() {
    this.run();
  }
  run() {
    this.getAndInvoke(this.callback);
  }
  // 得到并且唤起
  getAndInvoke(cb) {
    debugger
    const value = this.get();
    // 当值发生改变时
    if (value !== this.value || typeof value === 'object') {
      const oldValue = this.value;
      this.value = value;
      cb.call(this.target, value, oldValue);
    }
  }
  get() {
    // 进入依赖收集阶段，让全局的Dep.target设置为wathcer实例本身，那么就是进入依赖收集阶段。
    Dep.target = this;
    const obj = this.target;
    let value;
    // 只要能找，就一直找
    try {
      value = this.getter(obj);
    } finally {
      Dep.target = null;
    }
    return value;
  }
}
