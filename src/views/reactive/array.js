import { def } from './util';

const methodsNeedChange = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
const arrayPrototype = Array.prototype;

/*
 Object.create是以某个对象为原型创造一个对象，重点在于创建
 Object.setPrototypeOf 是对象已经存在，将这个对象的原型强行指向另外一个对象
 */
const arrayMethods = Object.create(arrayPrototype);
methodsNeedChange.forEach(methodName => {
  /* 定义arrayMethods自己的方法，在原型链查找时就优先调用自身方法 */
  def(
    arrayMethods,
    methodName,
    /* 这里不能写箭头函数，该属性（方法）最终被谁调用，this就会指向谁。在这里数组方法一般会被Vue中定义的数组数据调用
    最终就会指向该数组，这是期望的结果，如果改成箭头函数就会往作用域的上一级查找,就出问题了。
    */
    function() {
      /* arguments是不管形参的，只管最终传入了多少实参.
      this必须要正确，因为像push等方法，它的目的就是去改变this数据的值的 */

      const result = arrayPrototype[methodName].apply(this, arguments);
      /* 以下三种方式会在数组中加入项，要保证加入的项也是响应式的 */
      let inserted = [];
      if (methodName === 'push' || methodName === 'unshift') {
        inserted = [...arguments];
      } else if (methodName === 'splice') {
        inserted = [...arguments].slice(2);
      }
      if (inserted.length) {
        this.__ob__.observeArray(inserted);
      }
      console.log(`你调用了数组${methodName} 方法`);
      this.__ob__.Dep.notify();

      return result;
    },
    { enumerable: false }
  );
});

export { arrayMethods };
