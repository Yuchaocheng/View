<template>
  <div class="son">
    <h2>儿子组件</h2>
    <slot name="head"></slot>
    <!-- 展示default传入的值 -->
    <slot></slot>
    <ul>
      <!-- props可以直接用 -->
      <li>姓名: {{ name }}</li>
      <li>allProps: {{ data.allProps }}</li>
      <li>
        <!-- 原始使用data对象一层一层寻找 -->
        <!-- <span>父亲：{{ data.home.far }}</span> <button @click="changeFar">改变</button>
        <span>妻子：{{ data.home.wife.school }}</span> <button @click="changeWife">改变</button> -->
        <!-- <span>父亲：{{ home.far }}</span> <button @click="changeFar">改变</button> -->
        <span>测试：{{ test1 }} <input type="text" v-model="test1" /></span> <br />
        <!--   <span>妻子：{{ home.wife.school }}</span> <button @click="changeWife">改变</button> -->
        <span>父亲：{{ far }}</span> <button @click="changeFar">改变</button> <span>妻子：{{ wife.school }}</span>
        <button @click="changeWife">改变</button>
      </li>
    </ul>
    <button @click="emitSome">触发emit</button>

    <h3>鼠标点击的位置是x：{{ point.x }},y：{{ point.y }}</h3>
    <h3>鼠标类型：{{ pointType }}</h3>
  </div>
</template>

<script>
import { computed, watch, reactive, watchEffect, toRef, toRefs } from 'vue';

import usePoint from '../hooks/usePoint';
import { pointType } from '../hooks/usePoint';
export default {
  // props还是要显示定义
  props: ['name', 'age', 'sex'],
  // setup中传入这些参数，只是为了让内部可用。props、attrs、slots都是为了取到外部传入的内容，emit是为了内部触发自定义事件
  // 这个context可能后续还会往里面扩展，所以定义成一个对象形式
  setup(props, { attrs, slots, emit, expose }) {
    const data = {
      test1: 1,
      test2: 2,
      home: reactive({
        far: 'yu',
        mon: 'cai',
        wife: {
          school: 'shi',
          job: 'student',
        },
      }),
    };
    const emitSome = () => {
      emit('sonEvent', 'test');
    };
    const paramsTest = () => {
      // attrs说白了就是props不接受的DOM属性
      console.log(attrs, 'attrs');
      // 表明slots的接收和使用是两码事，slots只要组件被调用，并且父组件在子组件结构内写了其他内容，就会有slots。用不用是组件内部的事
      console.log(slots, 'slots');

      console.log(emit, 'emit');
    };

    const computedTest = () => {
      // setup中 computed测试，用法和Vue2是一样的
      data.allProps = computed(() => {
        return props.name + props.age;
      });
    };

    /* watch是不能监听普通对象的，它只能监听被ref函数或者reactive函数处理过的数据，或者是放置了他们两者的数组 */
    const watchTest = () => {
      /* 如果监听的是一个Proxy实例对象，是获取不到它的oldValue的。我个人认为是引用类型的原因，对于引用类型来说，变化后两者都相同了
         并且对于proxy对象的监听来说，默认开启了深度监听。并且是无法关闭的。
         但是如果监听的是reactive定义的数据中的某一个属性，该属性又是对象。这个时候如果想对这个属性对象进行深度监听，必须手动开启deep。
         什么意思呢？总结来说对于直接由reactive生成的Proxy实例对象，自动并强制开启deep。对于其他对象，深度监听需要手动开启deep。
      */
      console.log(data.home, 222);
      watch(data.home, (newVal, oldVal) => {
        console.log(newVal, 'newVal');
        console.log(oldVal, 'oldVal');
      });
    };
    const changeFar = () => {
      console.log(data, 'data');
      data.home.far += '!';
    };
    const changeWife = () => {
      data.home.wife.school += '!';
    };
    watchTest();

    //watchEffect所指定的回调中用到的数据只要发生变化，则直接重新执行回调。
    /* 我个人觉得怎么和computed类似呢，但是它可以只执行逻辑，注重执行过程，而不是生成一个有用的变量（computed注重结果0）
       所以它的命名为watchEffect是更正确的。
    */
    watchEffect(() => {
      console.log(data.home.far, 1);
      console.log(data.home.wife.school, 2);
    });

    /* hook和mixin非常像，不过我们不需要像mixin那样写定死的结构了。比如data、methods啥的，可以说是比较纯粹的js了
     */
    const point = usePoint();
    console.log(data.home, 1111);
    /* toRef将一个对象（可以是普通对象，也可以是ref对象）的属性变为响应式属性，并且可以映射到原对象，
     也就是说toRefs在原对象和新生成的对象间做了一层代理，这样就可以简化模板中的书写，非常巧妙 
     它和ref的区别也在这里，ref是生成的响应式对象和原对象是没有任何关系的 
     */
    const home = toRef(data, 'home');
    let test1 = toRef(data, 'test1');

    const far = '1111';
    /* Vue3.2新增的 expose 函数，允许自己定义组件向外暴露的参数，如果不定义默认为整个vue实例。一旦定义后就为expose传入的对象
       它的使用场景主要是二个，第一个想要暴露不在setup中返回的属性或方法（特别是当setup返回渲染函数时，若不用expose，将无法暴露组件任何属性和方法），第二个组件隐藏，不希望外部看到组件内部过多的内容。 
    */
    expose({
      emitSome,
    });
    return {
      emitSome,
      data,
      test1,
      /* toRefs的作用，就是将原对象的每个属性变成响应式的，这样写方便是方便，但是容易造成一个问题。就是说写多了可能会有变量重复的问题
         因为toRefs结构赋值后，第一时间不知道到底对外暴露了什么属性。如果真的重复了，以后定义的属性为准。
      */
      ...toRefs(data.home),
      changeFar,
      changeWife,
      point,
      pointType,
    };
  },
};
</script>

<style scoped>
.son {
  margin-top: 60px;
  background: darkkhaki;
}
</style>
