<template>
  <div>
    <!-- ref 与 toRef 测试 -->
    <li v-show="false">
      obj1:{{ obj1 }} <br />
      obj2:{{ obj2 }} <br />
      c:{{ c }} <br />
      <button @click="changeUI">更改</button>
    </li>
    <!-- shallowReactive 与 shallowRef -->
    <li v-if="false">
      s1:{{ s1.a.b }} <br />
      <!-- TODO 纳尼，视图居然更新了，苍了天了。 -->
      s2:{{ s2.a.b.c.d }} <br />
      state:{{ state.nested.bar }} <br />
      <button @click="changeShallow">更改</button>
    </li>
    <!-- readonly 与 shallowReadonly测试 -->
    <li v-if="false">
      readonly:{{ r1 }} <br />
      shallowReadonly:{{ r2 }}
      <button @click="changeReadonly">更改</button>
    </li>
    <!-- toRaw 与 markRow -->
    <li v-if="false">
      rawToReac:{{ rawToReac }} <br />
      <!-- 虽然rawToReac2不是响应式的，但是又能更新视图，why？ -->
      rawToReac2:{{ rawToReac2 }}
      <button @click="changeRaw">更改</button>
    </li>
    <li>
      customRefValue： {{ customRefValue }} <br />
      <input type="text" v-model="customRefValue" /> <br />
      farCar : {{ farCar }}
    </li>
  </div>
</template>

<script>
import {
  ref,
  toRef,
  toRefs,
  reactive,
  shallowReactive,
  isReactive,
  watch,
  readonly,
  shallowReadonly,
  toRaw,
  markRaw,
  customRef,
  inject,
} from 'vue';
export default {
  setup() {
    // #region
    /* ref 与 toRef 测试   */
    const data1 = { a: 1, b: { c: 1 } };
    const data2 = { a: 1, b: { c: 1 } };
    const obj1 = ref(data1);
    const obj2 = ref(data2);

    const refObj1 = ref(obj1.value.a);
    const refObj2 = toRef(obj2.value, 'a');
    const refObj10 = ref(obj1.value.b.c);
    const refObj20 = toRef(obj2.value.b, 'c');
    const changeUI = () => {
      // 对于refObj1来说，修改了refObj1.value的值就只是修改了它本身生成的ref对象的值
      refObj1.value = 2;
      // 对于refObj2来说，修改了refObj2.value的值就，obj2的a属性同样检测到并同步修改了
      refObj2.value = 2;

      refObj10.value = 2;
      refObj20.value = 2;

      console.log(data1, 'data1');
      console.log(data2, 'data2');
    };
    // #endregion
    // #region
    /* shallowReactive & shallowRef 测试 */
    const s1 = reactive({
      a: {
        b: 1,
      },
    });
    const s2 = shallowReactive({
      a: {
        b: { c: { d: 1 } },
      },
    });
    console.log(s1, 's1');
    console.log(s2, 's2');
    console.log(isReactive(s1));
    console.log(isReactive(s1.a));
    console.log(isReactive(s2));
    console.log(isReactive(s2.a));
    const state = shallowReactive({
      foo: 1,
      nested: {
        bar: 2,
      },
    });

    // 改变 state 本身的性质是响应式的
    state.foo++;
    // ...但是不转换嵌套对象
    isReactive(state.nested); // false
    state.nested.bar++; // 非响应式
    const changeShallow = () => {
      s1.a.b++;
      s2.a.b.c.d++;
      state.nested.bar++; // 非响应式
    };
    watch(s1, () => {
      console.log(111111);
    });
    watch(s2, () => {
      console.log(222222);
    });
    // #endregion

    // #region
    const r1 = readonly(reactive({ a: 1, b: { c: 1 } }));
    const r2 = shallowReadonly(reactive({ a: 1, b: { c: 1 } }));
    const changeReadonly = () => {
      r1.a = 2;
      r1.b.c = 2;
      r2.a = 2;
      r2.b.c = 2;
    };
    // #endregion

    // #region
    const rawObj = { a: 1, b: { c: 1 } };
    const rawObj2 = markRaw({ a: 1, b: { c: 1 } });
    console.log(rawObj, 'rawObj');
    console.log(rawObj2, 'rawObj2');
    const rawToReac = reactive(rawObj);
    const rawToReac2 = reactive(rawObj2);
    const changeRaw = () => {
      rawToReac.a = 2;
      rawToReac.b.c = 2;
      console.log(rawObj, 'rawObj');
      console.log(toRaw(rawToReac), 'rawToReac');
      console.log(toRaw(rawToReac) === rawObj, 'toRaw后是否等于原始对象');

      rawToReac2.a = 2;
      rawToReac2.b.c = 2;
      console.log(isReactive(rawToReac2), 'isReactive rawToReac2');
      console.log(isReactive(rawToReac), 'isReactive rawToReac');
      console.log(rawObj2, 'rawObj2');
    };
    // #endregion

    // #region

    const customRefFun = (value, t = 1000) => {
      let timer = null;
      return customRef((track, trigger) => {
        return {
          get() {
            track();
            return value;
          },
          set(newValue) {
            value = newValue;
            clearTimeout(timer);
            timer = setTimeout(() => {
              // 延时渲染视图
              trigger();
            }, t);
          },
        };
      });
    };
    console.log(customRefFun, 'customRefFun');
    // const customRefValue = ref('哈哈哈');
    const customRefValue = customRefFun('哈哈哈');
    // #endregion
    const farCar = inject('car');
    setTimeout(() => {
      farCar.name = 123123123;
    }, 2000);
    console.log(farCar, 'farCar');
    return {
      changeUI,
      obj1,
      obj2,
      c: toRef(obj2.value.b, 'c'),
      s1,
      s2,
      changeShallow,
      state,
      r1,
      r2,
      changeReadonly,
      rawToReac,
      rawToReac2,
      changeRaw,
      customRefValue,
      farCar,
    };
  },
};
</script>
