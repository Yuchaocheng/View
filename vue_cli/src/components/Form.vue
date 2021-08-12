

<script>
const hasProperty = (obj, property) => {
  return Object.prototype.hasOwnProperty.call(obj, property);
};
const oTypeMap = {
  input: {
    tagName: "el-input",
  },
  select: {
    tagName: "el-select",
  },
  radio: {
    tagName: "el-radio",
  },
  // 推荐使用radioGroup，因为每一项都会生成一个el-form-item，多个radio是换行状态
  radioGroup: {
    tagName: "el-radio-group",
  },
  inputNumber: {
    tagName: "el-input-number",
    defaultValue: 0,
  },
  cascader: {
    tagName: "el-cascader",
    defaultValue: [],
  },
  switch: {
    tagName: "el-switch",
    defaultValue: false,
  },
  slider: {
    tagName: "el-slider",
    defaultValue: 0,
  },
  timeSelect: {
    tagName: "el-time-select",
  },
  timePicker: {
    tagName: "el-time-picker",
    defaultValue: [new Date(), new Date()],
  },
};
/* 
cus-form的优点：form表单快速成型，开发者只需传入数据即可
               父组件中不再需要定义form对象
          缺点：动态改变fields的传参会比较麻烦，比如说defaultValue基本上是通过协议获取到的。
*/
/* 采用渲染函数时是不能写template的，有tempalte默认就不走render函数了 */
export default {
  name: "com-form",
  /* 
    {
        type:""
        key:""
    }
    
    */
  props: {
    fields: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      form: {},
      rules: {},
      // 避免重复
      elFormRef: Date.now(),
    };
  },
  created() {
    this.initForm();
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
          throw new Error("type is invalid");
        }
        const oCurrentTypeInfo = oTypeMap[item.type];
        let defaultValue = "";
        // 如果映射对象中定义了默认值，则使用，一般来说如果默认值不是空字符串，建议定义
        if (hasProperty(oCurrentTypeInfo, "defaultValue")) {
          defaultValue = oCurrentTypeInfo.defaultValue;
        }
        this.$set(this.form, item.key, defaultValue);
        // 绑定校验规则
        if (item.rule) {
          this.$set(this.rules, item.key, item.rule);
        }
      });
      this.$emit("afterInit", this.form);
    },
    //
    setForm() {
      this.fields.forEach((item) => {
        if (hasProperty(item, "defaultValue")) {
          this.form[item.key] = item.defaultValue;
        }
      });
    },
    generateAll(h) {
      const { fields } = this;
      let formItem = null;
      const result = fields.map((item) => {
        let isShow = true;
        let isSelfRender = !!item.selfRender;
        if (Object.prototype.hasOwnProperty.call(item, "show")) {
          isShow = item.show;
        }
        if (isShow) {
          const itemMain = isSelfRender
            ? item.selfRender()
            : this.generateItemMain(h, item);
            console.log(itemMain,1);
          formItem = h(
            "el-form-item",
            {
              props: {
                label: item.name,
                prop: item.key,
              },
            },
            // [this[method](h, item)]
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
            // console.log(value, "value");
            self.form[key] = value;
            if (param.on && param.on.input) {
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
      this.addtionalHparams({ h, param, type, options, children });
      if (!children.length) {
        children = null;
      }
      if (param.type === "timePicker") {
        // console.log(options, "options");
        // console.log(children, "children");
      }
      return h(tagName, options, children);
    },
    // 不同项添加额外的params
    addtionalHparams({ h, param, type, options, children }) {
      if (type === "select") {
        children.push(
          h(
            "template",
            { slot: "default" },
            param.options.map((item) => {
              return h("el-option", {
                props: {
                  key: item.value,
                  label: item.label,
                  value: item.value,
                },
              });
            })
          )
        );
      } else if (type === "radioGroup") {
        children.push(
          h(
            "template",
            { slot: "default" },
            param.options.map((item) => {
              return h(
                "el-radio",
                {
                  props: {
                    // elment 单选组时，label就是value，而显示的lable确实slot里的
                    label: item.value,
                  },
                },
                h(["template", { slot: "default" }, [item.label]])
              );
            })
          )
        );
      }
    },
    // 最终提交，也可外部自己调用
    submit() {
      const elForm = this.getRef(this.elFormRef);
      return new Promise((resolve, reject) => {
        elForm.validate((valid) => {
          if (valid) {
            resolve(this.form);
          } else {
            reject("校验失败");
            return false;
          }
        });
      });
    },
    getRef(key) {
      const ref = this.$refs[key] || null;
      return ref;
    },
  },
  render(h) {
    return h("div", { class: "cus-form" }, [
      h(
        "el-form",
        {
          props: {
            model: this.form,
            rules: this.rules,
            labelWidth: "150px",
          },
          ref: this.elFormRef,
        },
        [this.generateAll(h)]
      ),
    ]);
  },
};
</script>

<style lang="scss" scoped>
</style>