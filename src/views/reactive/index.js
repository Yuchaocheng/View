import observe from './observe';
import Watcher from './Watcher';
class Reactive {
  constructor() {
    this.testObj = {
      a: {
        a1: 1,
        a2: 2
      },
      b: 2,
      /* c作为testObj对象的一个属性，修改它时是响应式的；但是c的值是一个数组，修改数组的值并不是响应式的
         即直接对c进行赋值时，响应式操作；而对c的值进行赋值获取其他操作时，不是响应式的。

         还有一个问题，数组内有对象或者数组时怎么处理？
      */
      c: [2, 3, { c1: 'c1' }]
    };
    //
  }
  init() {
    const { testObj } = this;
    observe(testObj);
    console.log(testObj, 22);
    setTimeout(() => {
      testObj.b = 22
    }, 5000);
    new Watcher(testObj, 'b', () => {
      console.log('Watcher 回调执行');
    });
  }
  changeArray() {
    const { testObj } = this;
    testObj.c.push(1);
    /* 这个时候要保证push进去的c1也是响应式的 */
    testObj.c.push({ c11: 'c11' });
    // testObj.c.sort()
    console.log(testObj.c);
  }
}

export default new Reactive();
