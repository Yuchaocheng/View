import observe from './observe';

import Dep from './Dep';

/* 
为什么要定义这个函数？原因很简单，如果不使用一个函数封装，就需要一个中间变量中转，才能使getter和setter正常工作。
并且可以复用
*/
export default function defineReactive(data, key, value) {
  /* 每一个属性有其自己的dep，因为每一个属性都有可能会被多个vue调用，需要将其收集起来 */
  const dep = new Dep();
  if (arguments.length === 2) {
    value = data[key];
  }
  // 判断该属性值是否是复杂数据类型，如果是就调用observe继续监听。
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

      /* 如果设置了一个新值，该值是对象同样需要观察，若不做这个处理，当赋值一个对象时，该对象无法成为响应式数据 */
      observe(newValue);
      /* setter时触发依赖 */
      value = newValue;
      dep.notify();
    }
  });
}
