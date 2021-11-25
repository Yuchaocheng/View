import observe from './observe';

import Dep from './Dep';

/* 
为什么要定义这个函数？原因很简单，如果不使用一个函数封装，就需要一个中间变量中转，才能使getter和setter正常工作。
并且可以复用。0
*/
export default function defineReactive(data, key, value) {
  /* 每一个数据有其自己的dep，因为每一个数据都是单独defineReactive */
  const dep = new Dep();
  if (arguments.length === 2) {
    value = data[key];
  }
  let childObj = observe(value);
  Object.defineProperty(data, key, {
    get() {
      console.log(`你正在访问${key}`);
      // getter时收集依赖
      // 如果现在处于依赖收集阶段
      if (Dep.target) {
        dep.depend();
        if (childObj) {
          childObj.dep.depend();
        }
      }
      return value;
    },
    set(newValue) {
      console.log(`你正在设置${key}`);

      /* 如果设置了一个新值，该值是对象同样需要观察，若不写这句话，当赋值一个对象时，该对象无法成为响应式数据 */
      observe(newValue);
      /* 触发依赖 */
      value = newValue;

      /* 
      以下两种有何区别？
      */
      // const ob = this.__ob__;
      // ob.dep.notify();
      dep.notify();
    }
  });
}
