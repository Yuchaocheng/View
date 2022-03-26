import Dep from './Dep';
var uid = 0;

const TargetStack = [];
/* 
用栈结构保存依赖，这么做的目的是在有组件嵌套时，如果父组件渲染到一半时，渲染子组件。
target移向子组件，子组件渲染完后，target就会指向null。而父组件实际并未渲染结束
*/
function pushTarget(_target) {
  TargetStack.push(Dep.target);
  Dep.target = _target;
}

function popTarget() {
  Dep.target = TargetStack.pop();
}

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
/* 
   为什么引入Watcher？
   当属性发生变化时，我们要通知用到此数据属性的地方，而使用此数据的地方很多且类型不一样，需要抽象出一个类集中处理
   这些情况，然后再依赖收集阶段只收集这个封装好的实例，通知也只需要通知这一个，然后它在负责通知其他的地方。
*/
export default class Watcher {
  constructor(vm, expression, callback) {
    this.id = uid++;
    this.vm = vm;
    this.getter = parsePath(expression);
    this.callback = callback;
    this.value = this.get();
  }
  update() {
    this.run();
  }
  run() {
    const value = this.get();
    // 当值发生改变时
    if (value !== this.value || typeof value === 'object') {
      const oldValue = this.value;
      this.value = value;
      this.callback.call(this.vm, value, oldValue);
    }
  }
  get() {
    // 进入依赖收集阶段，让全局的Dep.target设置为wathcer实例本身。
    pushTarget(this)
    const vm = this.vm;
    let value;
    // 只要能找，就一直找
    try {
      value = this.getter(vm);
    } finally {
      // 依赖收集结束
      Dep.target = null;
    }
    popTarget()
    return value;
  }
}
