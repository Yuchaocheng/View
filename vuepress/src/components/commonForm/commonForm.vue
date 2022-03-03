<script>
import { isFun, isObj } from '@/common/utils.js';

const hasProperty = (obj, property) => {
  return Object.prototype.hasOwnProperty.call(obj, property);
};
const oTypeMap = {
  input: {
    tagName: 'el-input',
  },
  select: {
    tagName: 'el-select',
  },
  radio: {
    tagName: 'el-radio',
  },
  checkbox: {
    tagName: 'el-checkbox',
  },
  checkboxGroup: {
    tagName: 'el-checkbox-group',
    defaultValue: [],
  },

  // 推荐使用radioGroup，因为每一项都会生成一个el-form-item，多个radio是换行状态
  radioGroup: {
    tagName: 'el-radio-group',
  },
  inputNumber: {
    tagName: 'el-input-number',
    defaultValue: 0,
  },
  cascader: {
    tagName: 'el-cascader',
    defaultValue: [],
  },
  switch: {
    tagName: 'el-switch',
    defaultValue: false,
  },
  slider: {
    tagName: 'el-slider',
    defaultValue: 0,
  },
  timeSelect: {
    tagName: 'el-time-select',
  },
  timePicker: {
    tagName: 'el-time-picker',
    defaultValue: [new Date(), new Date()],
  },
  datePicker: {
    tagName: 'el-date-picker',
  },
};
/*
cus-form的优点：form表单快速成型，开发者只需传入数据即可
               父组件中不再需要定义form对象
*/
/* 采用渲染函数时是不能写template的，有tempalte默认就不走render函数了 */
export default {
  name: 'CommonForm',
  props: {
    fields: {
      type: Array,
      default() {
        return [];
      },
    },
    // 是否显示保存按钮，默认不显示，传入true或者字符串则显示，传入字符串替换默认“保存”文字
    hasCtrl: {
      type: [Boolean, String],
    },
    // 是否显示取消按钮，同hasCtrl
    hasReset: {
      type: [Boolean, String],
    },
    rules: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      form: {},
      // 避免重复
      elFormRef: Date.now(),
      firstInit: true,
    };
  },
  created() {
    this.initForm();
    this.firstInit = false;
  },
  methods: {
    initForm() {
      this.fields.forEach((item) => {
        // 无key值的不需要初始化
        if (!item.key) {
          return;
        }
        /* ****    注意        **** */
        /* data中未定义的数据，必须使用$set赋初始值，否则是没有响应式的 */
        if (!hasProperty(oTypeMap, item.type)) {
          throw new Error('type is invalid');
        }
        const oCurrentTypeInfo = oTypeMap[item.type];
        let defaultValue = '';
        // 如果映射对象中定义了默认值，则使用，一般来说如果默认值不是空字符串，建议定义
        if (hasProperty(oCurrentTypeInfo, 'defaultValue')) {
          defaultValue = oCurrentTypeInfo.defaultValue;
        }
        if (this.firstInit) {
          this.$set(this.form, item.key, defaultValue);
          // 绑定校验规则
          if (item.rule) {
            let rule = item.rule;
            if (isFun(rule)) {
              rule = rule(this.form);
            }
            this.$set(this.rules, item.key, rule);
          }
          this.$emit('initFinsh', this.form);
        } else {
          this.form[item.key] = defaultValue;
        }
      });
    },
    // 表单赋值
    setForm(formData, value) {
      if (typeof formData === 'string') {
        if (hasProperty(this.form, formData)) {
          this.form[formData] = value;
        }
      } else if (isObj(formData)) {
        for (const key in formData) {
          if (hasProperty(this.form, key)) {
            this.form[key] = formData[key];
          }
        }
      }
    },
    generateAll(h) {
      const { fields } = this;
      let formItem = null;
      const result = fields.map((field) => {
        let isShow = true;
        let isSelfRender = isFun(field.render);
        if (field.hasOwnProperty('show')) {
          // field.show支持函数动态判断表单项是否展示
          isShow = isFun(field.show) ? field.show(field, form) : field.show;
        }
        if (isShow) {
          const itemMain = isSelfRender ? field.render() : this.generateItemMain(h, field);
          formItem = h(
            'el-form-item',
            {
              props: {
                label: field.label,
                prop: field.key,
              },
            },
            // [this[method](h, field)]
            [itemMain]
          );
        }
        return formItem;
      });
      return result;
    },
    // 生成一项表单项的虚拟dom
    generateItemMain(h, param) {
      const self = this;
      const { key, type } = param;

      const oCurrentItemType = oTypeMap[type];
      const { tagName } = oCurrentItemType;
      const options = {
        /* render函数中的属性都是一样的，如果是字符串格式，就直接等于，否则相当于绑定 */
        props: {
          // 这里有个注意点，如果props中传了value是无效的，被后面定义的value覆盖
          ...param.props,
          value: self.form[key],
        },
        on: {
          // 同样的，on监听在自用监听之上，这样才不会被覆盖
          ...param.on,
          input(value) {
            self.form[key] = value;
            if (param.on && isFun(param.on.input)) {
              param.on.input(value);
            }
          },
        },
      };
      if (param.ref) {
        options.ref = param.ref;
      }
      let children = [];
      // 如果该项有默认插槽
      // 不同类型的表单项在options和data内自由补充
      this.addtionalParams({ h, param, type, options, children }, options);
      if (!children.length) {
        children = null;
      }
      return h(tagName, options, children);
    },
    // 不同类型添加额外的、自身的options
    addtionalParams({ h, param, type, children }, options) {
      /* 即除了双向绑定，还需要其他内置功能的渲染项，在这里补充 */
      const oAddMap = {
        select: this.selectAddtion,
        radioGroup: this.radioGroupAddtion,
        checkboxGroup: this.checkboxGroupAddtion,
      };
      if (oAddMap.hasOwnProperty(type)) {
        oAddMap[type].call(this, { h, param, children, options });
      }
    },
    // select渲染补充
    selectAddtion({ h, param, children }) {
      children.push(
        h(
          'template',
          { slot: 'default' },
          param.options.map((item) => {
            return h('el-option', {
              props: {
                key: item.value,
                label: item.label,
                value: item.value,
              },
            });
          })
        )
      );
    },
    // radioGroup渲染补充
    radioGroupAddtion({ h, param, children }) {
      // 渲染checkbox
      children.push(
        h(
          'template',
          { slot: 'default' },
          param.options.map((item) => {
            let value = item.label;
            if (item.hasOwnProperty('value')) {
              value = item.value;
            }
            return h(
              'el-radio',
              {
                props: {
                  // elment 单选组时，label就是value，而显示的lable是在slot里
                  label: value,
                },
              },
              h('template', { slot: 'default' }, [item.label])
            );
          })
        )
      );
    },
    checkboxGroupAddtion({ h, param, children, options }) {
      param.options.forEach((item) => {
        let value = item.label;
        if (item.hasOwnProperty('value')) {
          value = item.value;
        }
        children.push(
          h(
            'el-checkbox',
            {
              props: {
                label: value,
              },
            },
            [item.label]
          )
        );
      });
    },
    // 内置按钮
    generateInternalBtn(h) {
      const btnVnodes = [];
      var vm = this;
      function createBtn(text, props, callback) {
        return h(
          'el-button',
          {
            on: {
              click: callback,
            },
            props,
          },
          text
        );
      }
      if (this.hasCtrl || this.hasCtrl === '') {
        let ctrlText = typeof this.hasCtrl === 'string' ? this.hasCtrl : '保存';
        const props = {
          type: 'primary',
        };
        const ctrlCB = function () {
          vm.$emit('beforeSubmit');
          vm.submit();
        };
        btnVnodes.push(createBtn(ctrlText, props, ctrlCB));
      }
      if (this.hasReset || this.hasReset === '') {
        let ctrlText = typeof this.hasReset === 'string' ? this.hasReset : '重置';
        btnVnodes.push(createBtn(ctrlText, null, this.reset));
      }
      return h('el-form-item', { props: { label: '' } }, btnVnodes);
    },
    // 最终提交，也可外部调用
    submit() {
      const elForm = this.getRef(this.elFormRef);
      return new Promise((resolve, reject) => {
        elForm.validate((valid) => {
          this.$emit('submit', this.getForm(), valid);
          if (valid) {
            resolve(this.form);
          } else {
            reject('valid failed');
          }
        });
      });
    },
    // 重置表单
    reset() {
      const elForm = this.getRef(this.elFormRef);
      elForm.resetFields();
    },
    getRef(key) {
      const ref = this.$refs[key] || null;
      return ref;
    },
    getForm() {
      return this.form;
    },
    // 清空验证
    clear() {
      const elForm = this.getRef(this.elFormRef);
      elForm.clearValidate && elForm.clearValidate();
    },
  },
  render(h) {
    return h('div', { class: 'common-form' }, [
      h(
        'el-form',
        {
          props: {
            model: this.form,
            rules: this.rules,
            'label-width': '120px', //labelWidth默认值120px
            ...this.$attrs,
          },
          ref: this.elFormRef,
        },
        [...this.generateAll(h), this.generateInternalBtn(h)]
      ),
    ]);
  },
};
</script>

<style lang="scss" scoped></style>
