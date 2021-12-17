let uid = 0;
/* Dep.target是类本身的属性，所以实际上成为了一个全局属性，只要引入Dep即可读取和设置 */
export default class Dep {
  constructor() {
    this.id = uid++;
    // 用数组存储订阅者
    this.subs = [];
  }
  // 添加订阅，即添加一个watcher实例对象
  addSub(sub) {
    this.subs.push(sub);
  }
  // 添加依赖
  depend() {
    // Dep.target实际上是一个全局性质的变量
    if (Dep.target) {
      /* 判断是否是重复依赖，若不做判断，get时候会一直收集重复依赖 */
      if (!this.subs.includes(Dep.target)) {
        this.addSub(Dep.target);
      }
    }
  }
  // 通知所有watcher对象更新视图，即分发消息。
  notify() {
    // 源码中是这么写的，为什么要浅克隆一份？
    const subs = this.subs.slice();
    console.log(subs, 'subs');
    for (let i = 0; i < subs.length; i++) {
      subs[i].update();
    }
  }
}
// 第一次将这个Dep的target属性设置为null
Dep.target = null;
