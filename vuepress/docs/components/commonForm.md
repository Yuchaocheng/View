<!--
 * @Descripttion:
 * @Author: ycc
 * @Date: 2022-02-25 10:51:22
 * @LastEditTime: 2022-03-03 16:35:27
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
    hasCtrl="立即创建"
    hasReset
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
  },
};
</script>
```

:::

### 其他功能
自定义渲染、显示控制等

::: demo2

```vue
<template>
  <common-form :fields="fields" hasCtrl hasReset ref="form"></common-form>
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
        },
      ],
    };
  },
};
</script>
```
