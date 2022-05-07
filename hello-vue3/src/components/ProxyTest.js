function proxyTest() {
  let person = {
    name: 'ycc',
    age: 18,
    home: {
      addr: 'aaa',
    },
  };
  console.log(1111111111);
  let P = new Proxy(person, {
    // 读取p的某个属性时调用，即使属性未被定义到对象上过
    /* 第一个参数为源对象，第二个为属性名，如果属性又是一个对象，属性名也只是当下层的，
         也就是说读取P.home.addr，属性名也是home，而不是home.addr  */
    get(target, propName) {
      // console.log(`读取了P的${propName}属性`);
      /* Vue3使用Reflect读取设置删除属性 */
      return Reflect.get(target, propName);
      // return target[propName];
    },
    // 修改或者追加某个属性时调用
    set(target, propName, newValue) {
      // console.log(`设置了P的${propName}属性`);
      // target[propName] = newValue;
      Reflect.set(target, propName, newValue);
    },
    // 删除某个属性时调用
    deleteProperty(target, propName) {
      return Reflect.deleteProperty(target, propName);
      // return delete target[propName];
    },
  });
  setTimeout(() => {
    //   console.log(P.test, 'home.addr');
    P.test = 3;
    delete P.age;
    console.log(P, 'P');
    console.log(person, 'person');
  }, 1000);
}

//Reflect 反射
function ReflectTest() {
  let obj = {
    a: 1,
    b: 2,
    c: 4,
  };
  console.log(Reflect.get(obj, 'a'));
  Reflect.set(obj, 'b', 3);
  Reflect.deleteProperty(obj, 'c', 4);
  console.log(obj);
}
// ReflectTest();



var obj = { a: 1 }
// Proxy的第二个属性，就是用来决定拦截操作类型，基础的是get还是set还是deleteProperty
new Proxy(obj, {
  get(target, propName) {
    return Reflect.get(target, propName)
  },
  // 新增和修改都在set中
  set(target, propName, newValue) {
    Reflect.set(target, propName, newValue)
  },
  deleteProperty(target, propName) {
    // 可以使用这种形式代替delete关键字，更好的可读性
    return Reflect.deleteProperty(target, propName)
  },
  // 监听HasProperty操作，比方说in
  has(target, propName) {
    // 可以用Reflect.has的方式判断属性是否存在于对象中，比in具有更好的可读性
    return Reflect.has(target, propName)
  }
})

// 还有像has