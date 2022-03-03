<!--
 * @Descripttion: 
 * @Author: ycc
 * @Date: 2022-03-02 14:36:10
 * @LastEditTime: 2022-03-02 14:36:11
-->
<script>
import i18n from "@/Common/static/i18n";
import ElDivider from '@/Common/vue/components/Divider';
import { isFunc } from '../DialogForm/DialogForm.vue';

const getPrefix = (tag) => {
  let elementMap = {
    'form': 'el-form',
    'form-item': 'el-form-item',
    'input': 'el-input',
    'select': 'el-select',
    'option': 'el-option',
    'checkbox': 'el-checkbox',
    'checkbox-group': 'el-checkbox-group',
    'date-picker': 'el-date-picker',
    'time-picker': 'el-time-picker',
    'radio': 'el-radio',
    'radio-group': 'el-radio-group',
    'slider': 'el-slider',
    'button': 'el-button',
    'row': 'el-row',
    'col': 'el-col',
    'cascader': 'el-cascader',
    'input-number': 'el-input-number',
    'input-number-extend': 'input-number-extend',
    "color": 'h-color-picker',
    'switch': 'el-switch'
  };

  return elementMap[tag];
};
// 填充默认数据 defaultValue
const fillData = (list, fields) => {
  fields.forEach(item => {
    let temp = { ...item };
    if (temp.type === 'date') {
      temp.defaultValue = temp.defaultValue || '';
    }
    list.push(temp);
  });
};
// 根据order字段排序
const sortFields = (fields) => {
  if (!fields.some(item => item.order)) {
    return fields;
  }
  return fields.sort((a, b) => {
    return (a.order || 0) - (b.order || 0);
  });
};
// 获取feild字段text
const getTextNode = (h, item, form) => {
  let text = '';
  if (item.type) {
    switch (item.type) {
      case 'input-number':
      case 'input-number-extend':
        text = (form[item.key] || 0) + item.props['unit'];
        break;

      //日期部分暂未完善
      case 'date':
        text = '-';
        break;
      case 'daterange':
        if (form[item.key][0]) {
          text = '';
        }
        break;
      case 'datetimerange':
        if (form[item.key][0]) {
          text = '';
        }
        break;

      case 'checkbox-group':
        return form;
      case 'cascader':
      case 'radio-group':
      case 'select':
        text = item.options.find(option => option.value === form[item.key]) ? item.options.find(option => option.value === form[item.key]).label : '';
        break;
      case 'color':
        text = form[item.key];
        break;
      case 'switch':
        text = form[item.key];
        break;
      default:
        text = form[item.key];
        break;
    }
  } else {
    if (item.options) {
      let target = item.options.find(option => option.value === form[item.key]);
      text = target ? target.label : '';
    } else {
      text = form[item.key];
    }
  }
  return text;
};
// 设置默认类型
const setDefaultType = (list, isText = true) => {
  list.forEach(item => {
    if (isText || item.isText || item.type === 'text') {
      if (['switch', 'checkbox-group', 'radio', 'radio-group'].includes(item.type)) {
        item.disabled = true;
      } else if (!item.renderContent) {
        item._noDefaultRenderContent = true;
        item.renderContent = (h, item, form) => {
          let content = getTextNode(h, item, form);
          return <p class="form-text ellipsis" title={ content }>{ content }</p>;
        };
      }
    } else {
      if (item._noDefaultRenderContent) {
        delete item.renderContent;
      }
      if (item.type === 'password' || item.type === 'textarea') {
        item.props = {
          ...item.props,
          type: item.type
        };
        if (item.type === 'textarea') {
          item.props['show-word-limit'] = true;
        }
        item.type = 'input';
      }
    }
  });
};
// placeholder
const fillPlaceholder = (list, hasPrefix = true) => {
  list.forEach(item => {
    let placeholder = (item.props && item.props.placeholder)
            || (hasPrefix ? `${i18n.t('please')}${item.type === 'input' ? i18n.t('input') : i18n.t('select')}` : '') + (item.title || '');
    let props = item.props || {};
    if (item.type === 'datetimerange' || item.type === 'daterange') {
      props['start-placeholder'] = i18n.t('startDate');
      props['end-placeholder'] = i18n.t('endDate');
    } else {
      props.placeholder = placeholder;
    }
    item.props = props;
  });
};
// 验证 daterange
const validateDate = (rule, value, callback) => {
  if (!value[0] || !value[1]) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};

const fillRule = (list) => {
  list.forEach(item => {
    if ((typeof item.isRequired === 'function' && item.isRequired()) || (typeof item.isRequired !== 'function' && item.isRequired)) {
      let message = `${i18n.t('please')}${item.type === 'input' ? i18n.t('input') : i18n.t('select')}${ item.title || ''}`;
      let rule = item.rule || { required: true, message, trigger: item.type === 'input' ? 'blur' : 'change' };
      if (item.type === 'daterange' && !item.rule) {
        rule = { required: true, message, trigger: item.type === 'input' ? 'blur' : 'change', validator: validateDate };
      }
      item.rule = rule;
      delete item.isRequired;
    }
  });
};
// 是否有冒号
const fillColon = (list, hasColon) => {
  if (hasColon) {
    list.forEach(item => {
      if (item.title) {
        item.title += '：';
      }
    });
  }
};
// options选项兼容处理 label text value
const fillOptions = (list, form) => {
  list.forEach(item => {
    if (item.options) {
      let options = typeof item.options === 'function' ? item.options(form) : item.options;
      item.options = options.map(option => {
        return {
          ...option,
          text: option.label
        };
      });
    }
  });
};

export default {
  name: 'CommonForm',
  components: {
    ElDivider
  },
  props: {
    // 是否启用：grid 布局,row col布局
    grid: {
      type: [Array, Number],
      default: 0
    },
    // grid间距：col之间的间距
    gutter: {
      type: Number,
      default: 0
    },
    // 表单项
    fields: {
      type: Array,
      default: () => []
    },
    // 是否开启 input 标签默认提交
    enterSubmit: {
      type: Boolean,
      default: false
    },
    // 默认 ui 库
    lib: {
      type: String,
      default: 'element'
    },
    // 默认标签宽度
    'labelWidth': {
      type: Number,
      default: 160
    },
    // 默认内容宽度
    'contentWidth': {
      type: [Number, String],
      default: 480
    },
    // 是否拥有两个按钮
    hasCtrl: {
      type: Boolean,
      default: false
    },
    // 是否拥有 提交 按钮
    hasSubmitBtn: {
      type: Boolean,
      default: true
    },
    // 是否拥有 重置 按钮
    hasResetBtn: {
      type: Boolean,
      default: false
    },
    // submit 按钮文本
    submitText: {
      type: String,
      default: '保存'
    },
    // 重置按钮文本
    resetText: {
      type: String,
      default: '重置'
    },
    // 原生 form 标签上的 props
    options: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 表单开启全局 clearable
    clearable: {
      type: Boolean,
      default: true
    },

    /**
     * maxlength 和 textareaMaxlength 待定
     */
    // 文本框默认字符个数
    // maxlength: {
    //   type: [Number, String],
    //   default: 20
    // },
    // // 多行文本框默认字符个数
    // textareaMaxlength: {
    //   type: Number,
    //   default: 256
    // },
    // 是否全局 disabled
    disabled: {
      type: Boolean,
      default: false
    },
    // label里面是否需要冒号
    hasColon: {
      type: Boolean,
      default: false
    },
    // 自动填充placerholder
    autofillPlaceholder: {
      type: Boolean,
      default: false
    },
    // placerholder是否携带 请输入/请选择
    hasPrefix: {
      type: Boolean,
      default: true
    },
    // 表单是否是文本模式，默认是常规表单模式
    isText: {
      type: Boolean,
      default: false
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    affixExtend: {
      type: Object,
      default: () => {
        return {};
      }
    },
    affix: {
      type: Boolean,
      default: true
    },
    hasAnchor: {
      type: Boolean,
      default: false
    },
    anchorProps: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data () {
    return {
      form: this.initForm()
    };
  },
  computed: {
    formList () {
      let { fields, isText, hasColon, hasPrefix, autofillPlaceholder } = this;
      let list = [];
      fillData(list, fields);
      setDefaultType(list, isText);
      sortFields(list);
      autofillPlaceholder && fillPlaceholder(list, hasPrefix);
      fillRule(list);
      fillColon(list, hasColon);
      fillOptions(list, this.form);
      return list;
    },
    rules () {
      let rules = {};
      this.formList.forEach(item => {
        if (typeof item.rule !== 'undefined') {
          rules[item.key] = typeof item.rule === 'function' ? item.rule(item, this.form) : item.rule;
        }
      });
      return rules;
    },
    gridNum () {
      return this.grid;
    }
  },
  methods: {
    // 默认值
    initForm (fields) {
      let form = {};
      let map = {
        'input': '',
        'textarea': '',
        'select': '',
        'checkbox': false,
        'checkbox-group': [],
        'date': null,
        'datetime': null,
        'daterange': [],
        'datetimerange': [],
        'time': '',
        'radio': false,
        'radio-group': '',
        'slider': 0,
        'input-number': null,
        'input-number-extend': null,
        'cascader': [],
        'color': '',
        'switch': false
      };
      (fields || this.fields).forEach(item => {
        let defaultValue = '';
        if (typeof item.defaultValue !== 'undefined') {
          defaultValue = item.defaultValue;
        } else {
          defaultValue = map[item.type];
        }
        if (typeof defaultValue === 'object') {
          defaultValue = JSON.parse(JSON.stringify(defaultValue));
        }
        if (item.key) {
          form[item.key] = defaultValue;
        }
      });
      this.$nextTick(() => {
        this.clear();
      });
      return form;
    },
    getHypeScript () {
      return this.$parent.$createElement;
    },
    // 根据是否grid来布局
    renderFormList (h) {
      let list = [];
      let grid = this.grid;
      // 处理 grid 为不同值时
      if (typeof grid === 'number') {
        list = this.getFormListByNumber(h);
      } else if (Array.isArray(grid)) {
        if (grid.every(item => !Array.isArray(item))) {
          list = this.getFormListByArray(h);
        } else {
          list = this.getFormListByGrid(h);
        }
      } else {
        list = this.getFormList(h);
      }
      return list;
    },
    getFormList (h) {
      return this.formList.map(item => {
        return this.getFormItem(h, item, this.getContent(h, item));
      });
    },
    // 当 grid 为数字时
    getFormListByNumber (h) {
      let list = [];
      // 过滤 grid
      let grid = ~~Math.abs(this.grid);
      if (grid < 1) {
        grid = 1;
      }

      for (let i = 0; i < this.formList.length; i += grid) {
        let childrenList = [];
        // 获取当前分成几列 grid 为 number 时
        for (let j = 0; j < grid && i + j < this.formList.length; j++) {
          let children = this.formList[i + j];
          if (!children) {
            break;
          }
          let childrenItem = this.getFormItem(h, children, this.getContent(h, children));
          let childrenParts = h(getPrefix('col'), {
            props: {
              span: 24 / grid
            }
          }, [
            childrenItem
          ]);
          childrenList.push(childrenParts);
        }
        let row = this.getRow(h, childrenList);
        list.push(row);
      }
      return list;
    },
    // 当 grid 为一维数组时
    getFormListByArray (h) {
      let list = [];
      let gridIndex = 0;
      for (let i = 0; i < this.formList.length;) {
        let childrenList = [];
        let grid = this.grid[gridIndex];
        for (let j = 0; j < grid; j++) {
          let children = this.formList[i + j];
          if (!children) {
            break;
          }
          let childrenItem = this.getFormItem(h, children, this.getContent(h, children));
          let childrenParts = h(getPrefix('col'), {
            props: {
              span: 24 / grid
            }
          }, [
            childrenItem
          ]);
          childrenList.push(childrenParts);
        }
        let row = this.getRow(h, childrenList);
        list.push(row);
        gridIndex += 1;
        i += grid;
      }
      return list;
    },
    // 当 grid 为二维数组
    getFormListByGrid (h) {
      let list = [];
      let gridIndex = 0;
      for (let i = 0; i < this.formList.length;) {
        let childrenList = [];
        let grid = this.grid[gridIndex];
        if (!grid) {
          grid = [1];
        }
        for (let j = 0; j < grid.length; j++) {
          let children = this.formList[i + j];
          if (!children) {
            break;
          }
          let childrenItem = this.getFormItem(h, children, this.getContent(h, children));
          let childrenParts = h(getPrefix('col'), {
            props: {
              span: grid[j]
            }
          }, [
            childrenItem
          ]);
          childrenList.push(childrenParts);
        }
        let row = this.getRow(h, childrenList);
        list.push(row);
        gridIndex += 1;
        i += grid.length;
      }
      return list;
    },
    getRow (h, childrenList) {
      return h(getPrefix('row'), {
        props: {
          gutter: this.gutter
        }
      }, childrenList);
    },
    // content 底部的tip
    getTipContent (h, item) {
      let content = isFunc(item.renderTipContent)
        ? [item.renderTipContent(h, item, this.form)]
        : item.tip;
      return h('div', {
        class: 'content__tip'
      }, content);
    },
    getContent (h, item) {
      let content;
      let tip = [];
      if (typeof item.renderContent === 'function') {
        content = item.renderContent(this.getHypeScript(), item, this.form);
      } else {
        tip = (item.renderTipContent || item.tip) ? [this.getTipContent(h, item)] : [];

        switch (item.type) {
          case 'input':
            content = this.renderInput(h, item);
            break;
          case 'select':
            content = this.renderSelect(h, item);
            break;
          case 'checkbox':
            content = this.renderCheckbox(h, item);
            break;
          case 'checkbox-group':
            content = this.renderCheckboxGroup(h, item);
            break;
          case 'date':
            content = this.renderDatePicker(h, item);
            break;
          case 'datetime':
            content = this.renderDatePicker(h, item);
            break;
          case 'daterange':
            content = this.renderDateRange(h, item);
            break;
          case 'datetimerange':
            content = this.renderDateRange(h, item);
            break;
          case 'time':
            content = this.renderTimePicker(h, item);
            break;
          case 'radio':
            content = this.renderRadio(h, item);
            break;
          case 'radio-group':
            content = this.renderRadioGroup(h, item);
            break;
          case 'slider':
            content = this.renderSlider(h, item);
            break;
          case 'input-number':
            content = this.renderInputNumber(h, item);
            break;
          case 'input-number-extend':
            content = this.renderInputNumberExtend(h, item);
            break;
          case 'cascader':
            content = this.renderCascader(h, item);
            break;
          case 'color':
            content = this.renderColor(h, item);
            break;
          case 'switch':
            content = this.renderSwitch(h, item);
            break;
          default:
            break;
        }
      }
      return [content, ...tip];
    },
    getFormItem (h, item, content) {
      if (item.isShow === false) {
        return;
      } else if (typeof item.isShow === 'function') {
        if (item.isShow(this.form, item) === false) {
          return;
        }
      }
      if (typeof item.render === 'function') {
        return item.render(this.getHypeScript(), item, this.form);
      }
      let settings = {
        class: {
          'el-form-item__tip': item.renderTipContent || item.tip
        },
        props: {
          prop: item.key
        },
        style: {
          position: item.suffixUnit ? 'relative' : 'static'
        }
      };
      let itemSettings = isFunc(item.settings) ? item.settings(h, item, this.form) : item.settings;
      if (item.type === 'subTitle') {
        let options = {
          attrs: Object.assign(item.attrs || {}, {
            class: 'form-subTitle'
          }),
          props: item.props || {},
          ...item
        };
        return <el-divider
          contentPosition="left"
        >
          <span {...options}>{item.title}</span>
        </el-divider>;
      }
      return h(getPrefix('form-item'), Object.assign(settings, itemSettings), [
        this.renderTitle(h, item, this.form),
        content,
        item.suffixUnit ? this.renderSuffixUnit(h, item) : '',
        item.introduction ? this.renderIntroduction(h, item) : ''
      ]);
    },
    renderSuffixUnit (h, item) {
      const {contentWidth, labelWidth} = this;
      return h('span', {
        style: {
          position: 'absolute',
          left: `${contentWidth + labelWidth + 8}px`,
          top: 0
        }
      }, isFunc(item.suffixUnit) ? item.suffixUnit(h, item, this.form) : item.suffixUnit);
    },
    renderIntroduction (h, item) {
      return <div slot="introduction">{ item.introduction }</div>;
    },
    // 渲染 title
    renderTitle (h, item) {
      return <span slot="label">
        {
          item.required === true
            ? <span style="color: font">*</span>
            : ''
        }
        {
          typeof item.renderTitle === 'function'
            ? <span>{item.renderTitle(h, item, this.form)}</span>
            : item.title
        }
      </span>;
    },
    // 渲染提交 按钮
    renderSubmit (h) {
      let btns = [];
      if (this.hasSubmitBtn) {
        btns.push(h(getPrefix('button'), {
          props: {
            type: 'primary',
            loading: this.isLoading
          },
          on: {
            click: this.submit
          }
        }, this.submitText));
      }
      if (this.hasResetBtn) {
        btns.push(h(getPrefix('button'), {
          style: {
            'margin-left': '10px'
          },
          on: {
            click: this.reset
          }
        }, this.resetText));
      }
      // 有affix的情况返回affix，无则走默认
      if (this.affix) {
        // this.$nextTick(() => {
        return h('affix', {
          props: {
            offsetBottom: 0,
            ...this.affixExtend
          }
        }, [h(getPrefix('form-item'), {
          style: {
            paddingTop: '24px'
          }
        }, btns)]);
        // });
      }
      
      return h(getPrefix('form-item'), {
        style: {
          paddingTop: '24px'
        }
      }, btns);
    },
    renderAnchor (h) {
      const options = {
        props: {
          scrollBox: 'config-content',
          ...this.anchorProps
        }
      };
      return h('base-anchor', options);
    },
    // 渲染 input
    renderInput (h, item) {
      let props = item.props || {};
      let attrs = item.attrs || {};
      //在 props 里也可以设置 placeholder
      if (props.placeholder) {
        attrs.placeholder = props.placeholder;
      }

      // // 在 props 里也可以设置 maxlength
      // if (props.type !== 'textarea') {
      //   attrs.maxlength = +props.maxlength ;
      // } else {
      //   // textarea 长度
      //   attrs.maxlength = +props.maxlength || +this.textareaMaxlength;
      // }

      item.attrs = attrs;

      let tag = {
        h,
        item,
        tagName: getPrefix('input'),
        props: {
          clearable: this.clearable,
          ...props
        },
        nativeOn: {
          keydown: (e) => {
            if (e.keyCode === 13 && this.enterSubmit && props.type !== 'textarea') {
              this.submit();
            }
          }
        }
      };
      return this.generateTag(tag);
    },
    // 渲染 select
    renderSelect (h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('select'),
        props: {
          clearable: this.clearable,
          clear: this.clearable,
          ...(item.props || {})
        },
        children: item.options.map(option => {
          return h(getPrefix('option'), {
            props: {
              label: option.text,
              value: option.value,
              key: option.value
            }
          }, [
            typeof item.renderOption === 'function'
              ? item.renderOption(h, option, item)
              : item.text
          ]);
        })
      };
      return this.generateTag(tag);
    },
    // 渲染 单个checkbox
    renderCheckbox (h, item) {
      let props = item.props || {};
      if (item.border) {
        props.border = true;
      }
      let tag = {
        h,
        item,
        tagName: getPrefix('checkbox'),
        props,
        children: item.text
      };
      return this.generateTag(tag);
    },
    // 渲染 checkbox group
    renderCheckboxGroup (h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('checkbox-group'),
        props: item.props || {},
        children: item.options.map(option => {
          return h(getPrefix('checkbox'), {
            props: {
              border: item.border,
              label: option.value
            }
          }, option.text);
        })
      };
      return this.generateTag(tag);
    },
    // 渲染 datepicker
    renderDatePicker (h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('date-picker'),
        props: {
          clearable: this.clearable,
          type: item.type,
          ...(item.props || {})
        }
      };
      return this.generateTag(tag);
    },
    // 渲染范围的 daterange
    renderDateRange (h, item) {
      // 处理 datetimerange 可能宽度不够的问题
      if (item.type === 'datetimerange') {
        item.width = item.width || '100%';
      }
      let tag = {
        h,
        item,
        tagName: getPrefix('date-picker'),
        props: {
          clearable: this.clearable,
          type: item.type,
          ...(item.props || {})
        }
      };
      return this.generateTag(tag);
    },
    renderTimePicker (h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('time-picker'),
        props: {
          clearable: this.clearable,
          type: item.type,
          ...(item.props || {})
        }
      };
      return this.generateTag(tag);
    },
    // 渲染 radio
    renderRadio (h, item) {
      let props = item.props || {};
      if (item.border) {
        props.border = true;
      }
      let tag = {
        h,
        item,
        tagName: getPrefix('radio'),
        props,
        children: item.text
      };
      return this.generateTag(tag);
    },
    // 渲染 radio group
    renderRadioGroup (h, item) {
      const introoduction = (option) => (<el-tooltip
        content={option.introduction}
        placement="top-start"
      >
        <icon type="hui" class="h-icon-info vat"></icon>
      </el-tooltip>);
      const renderText = (option) => {
        return [
          <span>{option.text}</span>,
          option.introduction && introoduction(option)
        ];
      };
      let tag = {
        h,
        item,
        tagName: getPrefix('radio-group'),
        class: {
          'el-radio-group--vertical': Boolean(item.vertical) || false
        },
        props: item.props || {},
        children: item.options.map(option => {
          return h(getPrefix('radio'), {
            props: {
              border: item.border,
              label: option.value
            }
          }, renderText(option));
        })
      };
      return this.generateTag(tag);
    },
    // 渲染 slider
    renderSlider (h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('slider'),
        props: item.props || {}
      };
      return this.generateTag(tag);
    },
    // 渲染 input-number
    renderInputNumber (h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('input-number'),
        props: item.props || {}
      };
      return this.generateTag(tag);
    },
    // 渲染 input-number-extend
    renderInputNumberExtend (h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('input-number-extend'),
        props: item.props || {}
      };
      return this.generateTag(tag);
    },
    // 渲染 cascader
    renderCascader (h, item) {
      let props = item.props || {};
      let tag = {
        h,
        item,
        tagName: getPrefix('cascader')
      };
      
      props.options = item.options;
      
      tag.props = props;
      tag.props.clearable = this.clearable;
      return this.generateTag(tag);
    },
    // 转换 cascader options
    getCascaderOptions (options = []) {
      let list = JSON.stringify(options);
      
      list = list.replace(/"text":/g, '"label":');
      return JSON.parse(list);
    },
    //渲染颜色选择器
    renderColor(h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('color'),
        props: item.props || {}
      };
      return this.generateTag(tag);
    },
    // 渲染Switch
    renderSwitch (h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('switch'),
        props: item.props || {}
      };
      return this.generateTag(tag);
    },
    // 生产 tag
    generateTag ({ h, item, tagName, props, children, on = {}, nativeOn = {}, class: className }) {
      let currProps = {
        value: this.form[item.key],
        disabled: this.disabled || isFunc(item.disabled) ? item.disabled(this.form) : item.disabled,
        min: 0,
        max: 99999999,
        ...props
      };
      let attrs = item.attrs || {};
      let width = null;

      let itemOn = item.on || {};
      let itemNativeOn = item.nativeOn || {};
      // let scopedSlots = {};
      // let itemScopedSlots = item.scopedSlots || [];
      
      // itemScopedSlots.forEach((ele) => {
      //   scopedSlots[ele.slotName] = () => ele.renderSlot();
      // });

      // 忽略这些标签的宽度设置
      let ignoreMap = {
        'switch': true,
        'checkbox': true,
        'checkbox-group': true,
        'radio': true,
        'radio-group': true
      };

      if (!ignoreMap[item.type]) {
        let w = item.width || this['contentWidth'];
        if (typeof w === 'string' && (w.indexOf('%') >= 0 || w === 'auto')) {
          width = w;
        } else {
          width = `${w }px`;
        }
      }
      // renderSlot
      if (!children && item.renderSlot) {
        children = [item.renderSlot(h, item, this.form)];
        console.log(children);
      }
      
      return h(tagName, {
        props: currProps,
        attrs,
        class: {
          ...className
        },
        style: {
          width,
          'max-width': '100%'
        },
        on: {
          ...itemOn,
          input: (value) => {
            value = this.formatDateValue(value, item);
            this.form[item.key] = value;
            this.emitInput(value, item);
          },
          ...on
        },
        nativeOn: {
          ...itemNativeOn,
          ...nativeOn
        },
        ref: item.ref ? item.ref : null
      }, children);
    },
    // 格式化日期返回，避免 null 的出现
    formatDateValue (value, item) {
      switch (item.type) {
        case 'date':
        case 'datetitme':
          if (!value) {
            value = '';
          }
          break;
        case 'daterange':
        case 'datetimerange':
          if (!value) {
            value = ['', ''];
          }
          break;
        default: break;
      }
      return value;
    },
    // 触发 item onInput 事件
    emitInput (value, item) {
      if (typeof item.onInput === 'function') {
        item.onInput(value, item, this.form);
      }
    },
    // 提交事件
    submit () {
      let { isLoading } = this;
      if (isLoading) {
        return;
      }
      this.$refs.form.validate(valid => {
        this.$emit('submit', this.getForm(), valid);
      });
    },
    // 清空 form 表单
    reset () {
      this.clear();
      this.form = this.initForm();
      this.$refs.form.resetFields();
    },
    // 清空验证
    clear () {
      this.$refs.form.resetValidates && this.$refs.form.resetValidates();
    },
    // 根据 key 获取 value
    getFormBykey (key) {
      return this.form[key];
    },
    // 获取整个 form
    getForm () {
      return {
        ...this.form
      };
    },
    // 设值
    setForm (form) {
      for (let key in form) {
        this.form[key] = form[key];
      }
      
      this.$nextTick(() => {
        this.clear();
      });
    }
  },
  render (h) {
    return h(getPrefix('form'), {
      props: {
        model: this.form,
        rules: this.rules,
        validateOnRuleChange: false,
        'labelWidth': `${this['labelWidth'] }px`,
        ...this.options,
        'labelPosition': this.labelPosition
      },
      ref: 'form',
      nativeOn: {
        submit (e) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }, [
      this.$slots.prepend,
      this.renderFormList(h),
      this.hasCtrl && this.renderSubmit(h),
      this.$slots.default,
      this.hasAnchor && this.renderAnchor(h)
    ]);
  }
};
</script>
<style lang="less">
  @import "@/Common/vue/assets/less/default.less";
  .el-form {
    .el-divider--horizontal {
      margin: 32px 0;
    }
    .el-divider__text.is-left {
      left: 0
    }
    .el-divider__text {
      padding-left: 0;
    }
    .form-subTitle {
      padding: 16px 0;
      font-size: 18px;
      font-weight: 800;
      color: @form-sub-title;
    }
    .el-slider--with-input {
      .el-slider__input.is-without-controls {
        width: 100px;
      }
    }
    .el-slider__runway.show-input {
      margin-right: 108px;
    }
    .form-text {
      color: @form-text-color;
    }
    .el-switch__label--left {
      margin-right: 0;
    }
    .common-table {
      padding: 0;
    }
    .el-radio-group--vertical .el-radio {
        display: block;
        margin-right: 16px;
        margin-bottom: 0;
        margin-left: 0;
        line-height: 32px;
        
    }
    
    .el-form-item__tip.el-form-item.is-error .content__tip {
      display: none;
      // margin-bottom: 0;
    }
    .el-form-item__tip {
      margin-bottom: 0;
      .content__tip {
        // color: #fa3239;
        font-size: 14px;
        line-height: 20px;
      }
    }

  }
</style>