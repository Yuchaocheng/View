import observe from './observe';
import Watcher from './Watcher';
class Reactive {
  constructor() {
    this.testObj = {
      a: {
        a1: 1
      },
      b: 2,
      /* c作为testObj对象的一个属性，修改它时是响应式的；但是c的值是一个数组，修改数组的值并不是响应式的
         即直接对c进行赋值时，响应式操作；而对c的值进行修改，不是响应式的。
      */
      c: [2, 3]
    };
    //
  }
  init() {
    const { testObj } = this;
    observe(this.testObj);
    this.testObj.b = 20;
    new Watcher(this.testObj, 'b', () => {
      console.log('b被改变了');
    });
    this.testObj.a.a1 = 10;
    new Watcher(this.testObj, 'a.a1', () => {
      console.log('a1被改变了');
    });
    this.testObj.c.push(3);
    new Watcher(this.testObj, 'c', () => {
      console.log('c被改变了');
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
