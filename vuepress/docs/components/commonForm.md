<!--
 * @Descripttion:
 * @Author: ycc
 * @Date: 2022-02-25 10:51:22
 * @LastEditTime: 2022-03-11 09:37:53
-->

# Common-Form 公共表单

- 和 Element-ui Form 表单组件完全相同的功能，极大减少模板代码
- js 代码虽然看上去较多，但逻辑更加清晰，且 js 代码有很多灵活处理方式

### 典型表单

各种表单项；内置按钮、初始赋值、手动校验等

::: demo

```vue
<template>
  <common-form
    :fields="fields"
    label-width="80px"
    save-btn="立即创建"
    reset-btn
    @submit="submit"
    @reset="reset"
    ref="form"
    :rules="rules"
  ></common-form>
</template>
<script>
export default {
  data() {
    var checkDesc = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('活动形式不能为空'));
      }
      setTimeout(() => {
        if (value.length > 100) {
          callback(new Error('最多输入100个字符'));
        } else {
          callback();
        }
      }, 1000);
    };
    return {
      fields: [
        {
          label: '名称',
          key: 'name',
          type: 'input',
        },
        {
          label: '活动区域',
          key: 'region',
          type: 'select',
          options: [
            { label: '区域一', value: 'shanghai' },
            { label: '区域二', value: 'beijing' },
          ],
          on: {
            change: this.changeRegion,
          },
          nativeOn: {
            click: this.clickRegion,
          },
        },
        {
          label: '活动时间',
          key: 'date',
          type: 'datePicker',
          // 设置el-date-picker自身的props
          props: {
            type: 'datetime',
          },
        },
        {
          label: '即时配送',
          key: 'delivery',
          type: 'switch',
        },
        {
          label: '活动性质',
          key: 'type',
          type: 'checkboxGroup',
          options: [
            { label: '美食/餐厅线上活动' },
            { label: '地推活动' },
            { label: '线下主题活动' },
            { label: '单纯品牌曝光' },
          ],
        },
        {
          label: '特殊资源',
          key: 'resource',
          type: 'radioGroup',
          options: [{ label: '线上品牌商赞助' }, { label: '线下场地免费' }],
        },
        {
          label: '活动形式',
          key: 'desc',
          type: 'input',
          props: {
            type: 'textarea',
          },
          rule: (form) => {
            return { validator: checkDesc, trigger: 'blur' };
          },
        },
      ],
      /* 可通过form 对象传入，也在在fileds项中具体传入，见“活动形式”项 */
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
      },
    };
  },
  mounted() {
    const formData = {
      name: '组件开发',
      region: 'shanghai',
      date: new Date(),
    };
    // 传入对象对form设置初始值
    this.$refs.form.setForm(formData);

    // 也可传入key，value设置单个表单项
    this.$refs.form.setForm('delivery', true);
  },
  methods: {
    // 提交
    submit(form) {
      console.log(form, 'form');
    },
    // 重置
    reset() {
      console.log('重置表单');
    },
    changeRegion(val) {
      console.log(val);
    },
    clickRegion(event) {
      console.log(event);
    },
  },
};
</script>
```

:::

### 其他功能

自定义渲染表单项、表单项 slot、显示控制等

::: demo

```vue
<template>
  <common-form :fields="fields" save-btn reset-btn ref="form"></common-form>
</template>
<script>
export default {
  data() {
    return {
      fields: [
        {
          label: '名称',
          key: 'name',
          type: 'input',
          width: 400,
          renderSlot(h, field, form) {
            return <template slot="prepend">请输入：</template>;
          },
        },
        {
          label: '活动区域',
          key: 'region',
          type: 'select',
          defaultValue: 'shanghai',
          options: [
            { label: '上海', value: 'shanghai' },
            { label: '北京', value: 'beijing' },
          ],
        },
        // 自定义渲染表单项内容部分
        {
          label: '活动图片',
          renderContent(h, field, form) {
            const imgSrc =
              form.region === 'shanghai'
                ? require('@/assets/images/shanghai.jpeg')
                : require('@/assets/images/beijing.jpeg');
            return <img src={imgSrc} />;
          },
        },
        // 自定义渲染整个表单项
        {
          render() {
            return <el-divider>华丽的分割线</el-divider>;
          },
        },
        {
          label: '特殊资源',
          key: 'resource',
          type: 'radioGroup',
          options: [{ label: '线上品牌商赞助' }, { label: '线下场地免费' }],
          defaultValue: '线上品牌商赞助',
        },
        {
          label: '赞助商',
          // text类型无需key值，展示text字段内容
          type: 'text',
          text: 'A赞助商',
          // 支持布尔和函数类型
          isShow: (form) => form.resource === '线上品牌商赞助',
        },
        {
          label: '线下场地',
          type: 'text',
          text: 'B场地',
          // 支持布尔和函数类型
          isShow: (form) => form.resource === '线下场地免费',
        },
        {
          label: '颜色',
          type: 'color',
        },
      ],
    };
  },
};
</script>
```

:::

### CommonForm Attributes

| 参数      | 说明                             | 类型             | 可选值 | 默认值 |
| --------- | -------------------------------- | ---------------- | ------ | ------ |
| fields    | 表单项字段，详细配置见下文 field | Array            | -      | []     |
| save-btn  | 保存按钮展示以及按钮文字         | [Boolean,String] | -      | true   |
| reset-btn | 是否拥有重置按钮                 | [Boolean,String] | -      | false  |

### CommonForm Attributes 补充

支持 elementUI el-form 组件 所有的 props 属性，这里不再列举

### CommonForm Methods

| 方法名  | 说明                | 参数                   |
| ------- | ------------------- | ---------------------- |
| setForm | 设置 form 数据      | -                      |
| getForm | 获取 form 数据      | Function(prop: string) |
| clear   | 清空验证            | -                      |
| reset   | 手动 reset 表单数据 | -                      |

### CommonForm Events

| 事件名称 | 说明           | 回调参数                               |
| -------- | -------------- | -------------------------------------- |
| submit   | 保存的回调事件 | Object: Form 参数;Boolean:表单验证结果 |

### Field Attributes

| 参数          | 说明                                                                              | 类型                            | 可选值                                                                                                                                   | 默认值                                 |
| ------------- | --------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --- |
| label         | 表单项目 label                                                                    | Sting                           | -                                                                                                                                        | -                                      |
| type          | 表单子组件的类型                                                                  | Sting                           | input、select、checkbox、checkbox-group、、radio、radio-group、cascader、color、switch、slider、timeSelect、timePicker、datePicker、text | -                                      |
| isShow        | 表单项是否显示                                                                    | [Boolean,Function(form, item)]  | -                                                                                                                                        | true                                   |
| key           | 表单项 key 值                                                                     | String                          | -                                                                                                                                        | -                                      |
| options       | 仅用于 select、checckbox-group、radio-group 等的枚举项                            | [Array,Function(form)]          |                                                                                                                                          | -                                      |     |
| rule          | 表单校验规则                                                                      | [Array, Function(item)]         | -                                                                                                                                        | -                                      |
| defaultValue  | 表单项默认值                                                                      | [Number, String, Array, Object] | -                                                                                                                                        | 不固定，按照不同 type 默认给不同默认值 |
| render        | 自定义渲染整个表单项区域                                                          | Function(h, field, form)-       | -                                                                                                                                        |
| renderContent | 自定义渲染表单项内容区域                                                          | Function(h, field, form)        | -                                                                                                                                        | -                                      |
| renderSlot    | 自定义渲染 input 等类型的 slot                                                    | Function(h,field,form)          | -                                                                                                                                        | -                                      |
| props         | 支持通过 props 传入对应属性，（例如 slider 的 min、max）                          | Object                          | -                                                                                                                                        | {}                                     |
| text          | 仅用于 type 为'text'的类型                                                        | [String, Number]                | -                                                                                                                                        | -                                      |
| on            | 监听子组件 emit 的事件                                                            | Object                          | -                                                                                                                                        | {}                                     |
| nativeOn      | 监听原生事件                                                                      | Object                          | -                                                                                                                                        | {}                                     |
| directives      | 自定义指令件                                                                      | Array                          | -                                                                                                                                        | []                                     |
| width         | 定义除自定义 render 外的内容区宽度（默认没有，按照 CommonForm 的默认占父元素 100% | Number                          | -                                                                                                                                        | -                                      |
| ref           | 绑定 ref                                                                          | String                          | -                                                                                                                                        | -                                      |
