import defineReactive from './defineReactive';
import { def } from './util'; //def方法就是使用defineProperty去增加一个属性，并且传入配置项。
import { arrayMethods } from './array';
import observe from './observe';
import Dep from './Dep';

// 将一个普通Object对象转换为每个层级的属性都是响应式（可以被侦测的）的Object。
class Observer {
  constructor(value) {
    // 每一个Observer实例身上都有一个Dep实例，所以每一层（对象），都有一个Dep。
    this.dep = new Dep();
    // __ob__属性，值是Observer实例对象，取名__ob__，是防止属性重名
    def(value, '__ob__', this, { enumerable: false });
    
    if (Array.isArray(value)) {
      // 如果是数组就强行将该数组的原型指向我们创建的以Array的Prototype为原型的对象。
      // 所以当下的关系是，  代码中的数组  =>  Vue创建的数组监测对象（arrayMethods）  => 数组的原型对象
      /* 
      /这里比较精妙的点是创造了一个中间对象来监听，我之前一直认为是直接在Array的原型上改写，
      所以存在疑惑，直接在原型岂不是所有数组都是响应式的了？浪费性能了？ 实际上并不是。
      */
      Object.setPrototypeOf(value, arrayMethods);
      /* 上一步监听了数组的特定的变化函数，而下面是遍历数组，观察每一项的值 */
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  // 遍历对象属性
  walk(obj) {
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        defineReactive(obj, key);
      }
    }
  }
  // 遍历数组项
  observeArray(arr) {
    for (let i = 0, l = arr.length; i < l; i++) {
      observe(arr[i]);
    }
  }
}

export default Observer;
