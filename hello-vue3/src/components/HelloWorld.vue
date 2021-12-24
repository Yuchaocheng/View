<template>
  <!-- Vue3 tempplate中允许没有根标签 -->
  <h1 class="hello">setUp</h1>
  <div>msg:{{ msg }}</div>
  <div>arr:{{ arr }}</div>
  <hello-son name="wsy" :age="18" testAttr="test" @sonEvent="sonEvent">
    <span>default</span>
    <template v-slot:head>
      <div>headSlot</div>
    </template>
  </hello-son>
</template>

<script>
import './ProxyTest';
import HelloSon from './HelloSon.vue';
import { onMounted, ref, watch, reactive } from 'vue';
export default {
  name: 'HelloWorld',
  components: {
    HelloSon,
  },
  data() {
    return {
      x: 'x',
    };
  },
  /* 
  setup:组合式API，每一个选项都需要引入使用
  新的 setup 选项在组件创建之前执行,setup 避免使用 this，因为它不会找到组件实例。
  setup 的调用发生在 data property、computed property 或 methods 被解析之前，所以它们无法在 setup 中被获取。
  */

  /* 
  父组件在子组件上写的属性，如果子组件没有通过props接收，那么vue2就保存在了$atts里，如果接收了，就直接放在vc实例上 */
  /* 父组件给子组件传递的slot，统一放到了子组件的$slots上
   */
  setup(props, context) {
    const { attrs, slots, emit } = context;
    /* ref函数麻烦的地方在于不管是什么类型的数据，必须使用value访问 */
    /* 基本类型被ref函数调用后，封装成了RefImpl实例对象，依旧使用getter、setter做响应式 */
    let msg = ref('setup 返回');
    /* 引用数据类型被ref函数调用后，封装成了RefImpl实例对象，该对象对value的调用是使用proxy监听。实际上它的value就是调用了reactive */
    let arr = ref([]);

    let obj = ref({
      name: 'ycc',
      age: 18,
    });
    // console.log(msg, 'refMsg');
    // console.log(arr, 'arr');
    // console.log(obj, 'obj');

    function mountedTest() {
      arr.value.push('a');
      /* proxy代理可以监听到数组项的改变 */
      setTimeout(() => {
        arr.value[0] = 'c';
      }, 2000);
    }
    // 在mounted时执行传入的回调函数
    onMounted(mountedTest);

    watch(msg, (newValue, oldValue) => {
      console.log('The new msg value is: ' + newValue);
    });

    /* reactive 只能传入引用类型的数据，直接生成一个Proxy实例对象，就不用在.value读取了 */
    let reacObj = reactive({
      name: 'ycc',
      age: 18,
    });

    function sonEvent(value) {
      console.log(value, 'value');
    }
    return {
      msg,
      arr,
      sonEvent,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
