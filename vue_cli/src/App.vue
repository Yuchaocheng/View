<template>
  <div id="app">
    <el-button type="primary" size="small" @click="tip">提示</el-button>
    <el-button type="primary" size="small" @click="toogle('header')">切换header</el-button>
    <el-button type="primary" size="small" @click="toogle('default')">切换default</el-button>
    <el-button type="primary" size="small" @click="submit">提交</el-button>

    <HelloWorld msg="Welcome to Your Vue.js App" :level="3">
      <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949">
      </el-switch>
    </HelloWorld>
    <!-- test组件在模板字符串中的的运用 -->
    <test v-show="false">
      <!-- 任何不写v-slot的地方都认为是default，最终渲染的位置是组件中vslot的位置 -->
      <p>default2</p>
      <!-- 这个括号内就是父组件绑定的属性名，可以绑定多个，直接用结构赋值解出来 -->
      <template v-slot:header=" {far,test} ">
        <h3>{{far.header}}{{test}}</h3>
      </template>

      <p>default1</p>

      <!-- 从清晰的角度看，推荐default也写上 (如果有多个插槽，前面的被忽略)-->
      <!-- <template v-slot:default>
        <h5>default</h5>
      </template> -->

      <!-- 默认插槽的作用域插槽可简写，v-slot="slotProps"  但是如果有多个作用域插槽，建议不简写，还是写成 v-slot:default="slotProps" -->
      <template v-slot="{content}">
        <h5>{{content}}</h5>
      </template>

      <!-- 
        具名插槽的缩写(v-slot:) 替换为字符 #
       -->
      <template #footer>
        <h3>footer</h3>
      </template>

      <!-- 动态插槽，它的使用场景估计比较少 -->
      <template v-slot:[dynamicSlotName]>
        dynamicSlotName
      </template>
    </test>
    <com-form :fields="fields" ref="form" style="width:800px"></com-form>
  </div>
</template>

<script>
import Test from "./components/test.vue";
import HelloWorld from "./components/HelloWorld.vue";

import ComForm from "./components/Form.vue";
export default {
  name: "App",

  components: {
    HelloWorld,
    Test,
    ComForm,
  },

  data() {
    return {
      color1: "#409EFF",
      value1: "",
      x: 20,
      value: true,
      dynamicSlotName: "footer",
      fields: [
        {
          type: "input",
          key: "input",
          name: "输入框",
          ref: "input",
          defaultValue: "默认的值",
          props: {
            clearable: true,
            prefixIcon: "el-icon-date",
          },
          on: {
            input: this.inputChange,
          },
          rule: [
            { required: true, message: "请输入活动名称", trigger: "blur" },
            {
              min: 3,
              max: 5,
              message: "长度在 3 到 5 个字符",
              trigger: "blur",
            },
          ],
        },
        {
          type: "select",
          key: "select",
          name: "选择框",
          defaultValue: "1",
          options: [
            {
              label: "jack",
              value: "1",
            },
            {
              label: "Tom",
              value: "2",
            },
          ],
        },
        {
          type: "radio",
          key: "radio",
          props: {
            label: 3,
          },
          name: "单选框",
        },
        {
          type: "radioGroup",
          key: "radioGroup",
          defaultValue: "3",
          props: {
            disabled: true,
          },
          options: [
            {
              label: "3",
              value: "3",
            },
            {
              label: "备选项",
              value: "6",
            },
            {
              label: "备选项",
              value: "9",
            },
          ],
        },
        {
          name: "计数器",
          key: "inputNumber",
          type: "inputNumber",
          props: {
            min: 1,
            max: 100,
          },
        },
        {
          name: "级联选择器",
          key: "cascader",
          type: "cascader",
          props: {
            options: [
              {
                value: "zhinan",
                label: "指南",
                children: [
                  {
                    value: "shejiyuanze",
                    label: "设计原则",
                    children: [
                      {
                        value: "yizhi",
                        label: "一致",
                      },
                      {
                        value: "fankui",
                        label: "反馈",
                      },
                      {
                        value: "xiaolv",
                        label: "效率",
                      },
                      {
                        value: "kekong",
                        label: "可控",
                      },
                    ],
                  },
                  {
                    value: "daohang",
                    label: "导航",
                    children: [
                      {
                        value: "cexiangdaohang",
                        label: "侧向导航",
                      },
                      {
                        value: "dingbudaohang",
                        label: "顶部导航",
                      },
                    ],
                  },
                ],
              },
              {
                value: "zujian",
                label: "组件",
                children: [
                  {
                    value: "basic",
                    label: "Basic",
                    children: [
                      {
                        value: "layout",
                        label: "Layout 布局",
                      },
                      {
                        value: "color",
                        label: "Color 色彩",
                      },
                    ],
                  },
                  {
                    value: "form",
                    label: "Form",
                    children: [
                      {
                        value: "radio",
                        label: "Radio 单选框",
                      },
                      {
                        value: "checkbox",
                        label: "Checkbox 多选框",
                      },
                      {
                        value: "input",
                        label: "Input 输入框",
                      },
                    ],
                  },
                ],
              },
              {
                value: "ziyuan",
                label: "资源",
                children: [
                  {
                    value: "axure",
                    label: "Axure Components",
                  },
                  {
                    value: "sketch",
                    label: "Sketch Templates",
                  },
                  {
                    value: "jiaohu",
                    label: "组件交互文档",
                  },
                ],
                selfRender() {
                  return  <el-radio v-model={this.radioModel}> {data.label} </el-radio>
                  // return (
                  //   <el-color-picker v-model="{this.color1}"></el-color-picker>
                  // );
                },
              },
            ],
          },
        },
        {
          type: "switch",
          name: "switch开关",
          key: "switch",
          props: {
            activeColor: "#13ce66",
            inactiveColor: "#ff4949",
          },
        },
        {
          type: "slider",
          name: "slider滑块",
          key: "slider",
          defaultValue: 10,
          props: {
            min: 1,
            max: 20,
          },
        },
        {
          type: "timeSelect",
          name: "步长时间选择器",
          key: "timeSelect",
          props: {
            placeholder: "选择时间",
            pickerOptions: {
              start: "08:30",
              step: "00:15",
              end: "18:30",
            },
          },
        },
        {
          type: "timePicker",
          name: "任意时间选择器",
          key: "timePicker",
          props: {
            placeholder: "任意时间点",
            isRange: true,
          },
        },
      ],
    };
  },

  methods: {
    tip() {
      x += 2;
      this.$message({
        message: (
          <div>
            学习<span style="color:red">Vue JSX</span>场景一?
          </div>
        ),
        type: "warning",
      });
    },
    toogle(name) {
      this.dynamicSlotName = name;
    },
    async submit() {
      // 获得form对象参数，并且可以进行校验
      const params = await this.$refs.form.submit().catch((err) => {
        console.log(err, "err");
      });
      // 校验通过
      if (params) {
        // 自行做提交逻辑
      }

      /* 实现form子项的方法调用 */
      const inputRef = this.$refs.form.getRef("input");
      inputRef.select();
    },
    //
    inputChange(value) {
      console.log(value, "value");
    },
  },

  created() {
    setTimeout(() => {
      /* defaultValue如何处理 */
      // this.fields[0].defaultValue = "更改后的默认值";
      // this.$refs.form.setForm();
    }, 100);
  },
};
</script> 

<style>
</style>