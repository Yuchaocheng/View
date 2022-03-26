/*
 * @Author: XuChenzhi
 * @Date: 2021-06-17 10:29:56
 * @Last Modified by: XuChenzhi
 * @Last Modified time: 2021-07-26 16:52:55
 */

<script>
import moment from 'moment';
import CommonPagination from '../CommonPagination';
import oUtils from '@/Common/vue/utils/utils';
// eslint-disable-next-line
// import { formatDate, formatDateTime, formatTime, formatFullDateTime } from '@/Common/vue/service/utils/utils';
/**
 * 是否是方法
 * @param func Any 判断对象
 * @returns Boolean 是否是方法
 */
const isFunc = (func) => {
  return typeof func === 'function';
};

// const getShow = (key) => {
//   return isFunc(key) ? key.isShow() : key.isShow !== false;
// };
const fillData = (list, fileds) => {
  fileds.filter(item => {
    return item.table ? item.table.isShow !== false : true;
  }).forEach(item => {
    let temp = {
      title: item.title,
      key: item.key || '',
      columnKey: item.key || '',
      ...item,
      ...item.table
    };
    if ((temp.tooltip) && !temp.render) { // table tooltip
      temp.render = (h, { row }) => {
        return <el-tooltip placement="top-start">
          <div slot="content">{row[temp.key]}</div>
          <div class="ellipsis common-search-table-tooltip-label">{ row[temp.key] }</div>
        </el-tooltip>;
      };
    }
    list.push(temp);
  });
};

const sortFields = (fields) => {
  if (!fields.some(item => item.order)) {
    return fields;
  }
  return fields.sort((a, b) => {
    return (a.order || 0) - (b.order || 0);
  });
};

/**
 * columns translate props
 * @param props Object
 * @param key String
 * @param translateKey String
 */
const translateProp = (props, key, translateKey) => {
  if (props[key]) {
    props[translateKey] = props[key];
    delete props[key];
  }
};

/**
 * columns render function support
 * @param h $createElement
 * @param columnProps Object
 */
const useRenderFunc = (h, columnProps) => {
  let { props } = columnProps;
  if (typeof props.render === 'function') {
    columnProps.scopedSlots = {
      default: scope => props.render(h, scope, props) // scopedSlot 插入表单内容区
    };
  }
};
// eslint-disable-next-line
const currency = (value) => {
  return Math.floor(value * 100) / 100;
};

/**
 * columns format support
 * @param props Object
 */
const useFormat = (props) => {
  let { format } = props;
  if (!format || typeof format !== 'string') {
    return false;
  }
  // console.log(moment.parseZone('2021-09-24T16:47:15+02:00').local().format('YYYY-MM-DD HH:mm:ss'));
  switch (format) {
    case 'utcDate':
      props.formatter = (row, column, cellValue) => cellValue ? moment.parseZone(cellValue).local().format('YYYY-MM-DD HH:mm:ss') : '';
      break;
    case 'date':
      props.formatter = (row, column, cellValue) => cellValue ? oUtils.convertToLocalTime(cellValue) : '';
      break;
    case 'time':
      props.formatter = (row, column, cellValue) => cellValue ? oUtils.dateFormat(cellValue, 'hh:mm:ss') : '';
      break;
    case 'currency':
      props.formatter = (row, column, cellValue) => cellValue ? currency(cellValue * 100) : 0;
      break;
    default:
      return false;
  }
};

/**
 * columns use option format
 * @param props Object
 */
const useOption = (props) => {
  if (props.isFilter) {
    let options = isFunc(props.options) ? props.options() : props.options;
    props.filters = options.map(item => {
      return {
        // label: item.label,
        text: item.label,
        value: item.value
      };
    });
  }
  if (props.options && !isFunc(props.render)) {
    props.render = (h, { row }) => {
      let value = row[props.prop];
      let options = isFunc(props.options) ? props.options() : props.options;
      let item = options.find(item => item.value === value) || {};
      return (<span>{ item.label }</span>);
    };
  }
};

/**
 * return table columns
 * @param h $createElement
 * @param columns Array
 */
const getColumns = (h, fields) => {
  let columns = fields.filter((item) => {
    if (item.table) {
      if (isFunc(item.table.isShow)) {
        return item.table.isShow();
      }
      return item.table.isShow !== false;
    }
    return true;
  });
  return columns.map(column => {
    let props = { ...column };
    // 转换props名
    // translate key to prop
    translateProp(props, 'key', 'prop');
    // translate title to label
    translateProp(props, 'title', 'label');
    // simple formatter support
    useFormat(props);
    // option options when support [{label: '1', value: 1}]
    useOption(props);
    // column porps
    props.key = props.prop;
    let columnProps = { props,
      attrs: {
        key: props.prop
      }
    };
    // render function support
    useRenderFunc(h, columnProps, props);

    if (column.children && column.children.length) {
      let children = getColumns(h, column.children);
      return (
        <el-table-column { ...columnProps } >
          { children }
        </el-table-column>
      );
    }
    return (
      <el-table-column { ...columnProps } />
    );
  });
};

export default {
  name: 'CommonTable',
  components: {
    CommonPagination
  },
  props: {
    // table columns filed
    fields: {
      type: Array,
      default: () => []
    },
    // table api
    // eslint-disable-next-line
    api: {
      type: Function
    },
    // table height
    // eslint-disable-next-line
    height: {
      type: Number
    },
    // table default data
    data: {
      type: Array,
      default: () => []
    },
    // table row key
    rowKey: {
      type: String,
      default: 'id'
    },
    // table has pagination
    hasPagination: {
      type: Boolean,
      default: false
    },
    // table animation
    animation: {
      type: Boolean,
      default: false
    },
    animationType: {
      type: String,
      default: 'vertical'
    },
    hasTip: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: false
    },
    // eslint-disable-next-line
    filterData: {
      type: Function
    },
    autoload: {
      type: Boolean,
      default: true
    },
    showTime: {
      type: Boolean,
      default: false
    },
    paginationProps: {
      type: Object,
      default: () => {
        return {};
      }
    },
    width: {
      type: [Number, String],
      default: '100%'
    }
  },
  data () {
    return {
      status: 'pass', // table status：'pass' 'loading'
      pageNumber: 1, // page number
      pageSize: 10, // page size
      total: 0, // page total item
      time: '', // refresh time
      tableData: this.data, // table data
      selection: [],
      filtersParams: {} // filter
    };
  },
  computed: {
    /**
         * table is loading?
         * @returns isLoading Boolean
         */
    isLoading () {
      return this.status === 'loading';
    },
    /**
         * table column fileds
         * @returns currFields Array (columns list)
         */
    currFields () {
      let { fields } = this;
      let list = [];
      fillData(list, fields);
      sortFields(list);
      return list;
    },
    /**
         * has table selection ？
         * @returns hasSelection Boolean
         */
    hasSelection () {
      return this.currFields.some(item => item.type === 'selection');
    },
    // 由于有expand的情况下动画会有问题，暂定有Expand的时候不启用动画
    hasExpand () {
      let { currFields } = this;
      return currFields.some((item) => item.type === 'expand');
    },
    tableStyle () {
      const {width} = this;
      return {
        width: typeof width === 'number' ? `${width}px` : width
      };
    }
  },
  watch: {
    data () {
      this.tableData = this.data;
    }
  },
  mounted () {
    this.loadFilterParams();
    this.autoload && this.getData();
  },
  methods: {
    // load filter params
    loadFilterParams () {
      let { fields, filtersParams } = this;
      fields
        .filter(field => field['filtered-value'] !== undefined)
        .forEach(field => {
          filtersParams[field.key] = field['filtered-value'][0];
        });
    },
    // get data
    getData () {
      let { api, filterData, hasPagination, pageSize, pageNumber, filtersParams } = this;
      if (!api) {
        return;
      }
     
      this.status = 'loading';
      let pageParams = {};
      if (hasPagination) {
        pageParams.pageNumber = pageNumber;
        pageParams.pageSize = pageSize;
      }
      pageParams.filterParams = filtersParams;

      api(pageParams).then(data => {
        this.tableData = filterData ? filterData(data.rows) : data.rows;
        this.total = data.total;
        this.time = new Date();
        this.$emit('load', this.tableData);
        this.$emit('total-change', this.total);
      }).catch(() => {
        this.tableData = [];
        this.total = 0;
        this.time = new Date();
        this.$emit('load', this.tableData);
        this.$emit('total-change', this.total);
      }).finally(() => {
        this.status = 'pass';
      });
    },
    // refresh table
    refresh (isReset = true) {
      if (isReset) {
        this.pageNumber = 1;
      }
      this.$nextTick(() => {
        this.getData();
      });
    },
    /**
         * handle table pageSize or pageNumber change
         * @params pramas Object
         * @params pageNumber Number
         * @params pageSize Number
         */
    handlePageChange ({ pageNumber, pageSize }) {
      this.pageNumber = pageNumber;
      this.pageSize = pageSize;
      this.getData();
    },
    /**
     * return table selections
     * @returns selection Array
     */
    getSelection () {
      return this.selection;
    },
    // toggle table selection
    toggleRowSelection (row, selected) {
      this.$refs.table.toggleRowSelection(row, selected);
    },
    // clear table selection
    clearSelection () {
      this.$refs.table.clearSelection();
    },
    handleFilterChange (filters) {
      // let params = {}
      for (let key in filters) {
        // params[key] = filters[key].join(',')
        this.filtersParams[key] = filters[key].join(',');
      }
      // this.filtersParams = params
      this.pageNumber = 1;
      this.getData();
    },
    doLayout () {
      this.$refs.table.doLayout();
    }
  },
  /**
     * table render function
     * @returns jsx table
     *  .common-table
     *      .common-table-header
     *       el-table
     *      .common-table-footer
     *          .common-table-info
     *              time tip
     *              selection tip
     *          common-page
     */
  render (h) {
    const {
      currFields, tableData, rowKey, height, time, isLoading, hasSelection, selection, hasTip,
      hasPagination, total, pageSize, pageNumber, handlePageChange, $slots, animation,
      animationType, border, handleFilterChange, hasExpand, showTime, tableStyle, $attrs
    } = this;
    
    let tableProps = {
      props: {
        border: border,
        stripe: true,
        height,
        rowKey,
        data: tableData,
        ...$attrs
      },
      style: {
        ...tableStyle
      },
      on: {
        'selection-change': (selection) => {
          this.selection = selection;
          !isLoading && this.$emit('selection-change', selection, tableData);
        },
        'filter-change': handleFilterChange,
        ...this.$listeners
      },
      ref: 'table',
      directives: [
        { name: 'loading', value: isLoading }
      ]
    };
    
    //<common-empty slot="empty"></common-empty>
    
    return (
      <div class={ (animation && !hasExpand ? 'animation animation-' + animationType : '') + ' common-table'} >
        {
          $slots.default && <div class="common-table-header">{ $slots.default }</div>
        }
        <el-table { ...tableProps }>
          { getColumns(h, currFields) }
        </el-table>
        
        <div class="common-table-footer">
          {
            (hasTip) ? <div class="common-table-info">
              <span v-show={ time && showTime }>刷新时间：</span>
              <time v-show={ showTime }>{ oUtils.dateFormat(time, 'yyyy-MM-dd hh:mm:ss') }</time>
              <span class="ml" v-show={ hasSelection }>已选择 { selection.length } 个</span>
            </div> : <div class="common-table-info"></div>
          }

          {
            (hasPagination) && <common-pagination
              
              {...{
                props: {
                  total: total,
                  pageSize: pageSize,
                  pageNumber: pageNumber,
                  layout: this.paginationProps.layout || '',
                  direction: this.paginationProps.direction || 'left'
                },
                attrs: {
                  ...this.paginationProps
                },
                on: {
                  change: handlePageChange
                }
              }}
            />
          }
        </div>
      </div>
    );
  }
};
</script>

<style lang="less">
.common-table {
    padding: 12px;
    background-color: #fff;
    flex: 1;
    .common-table-header {
        margin-bottom: 8px;
    }
    .common-table-footer {
        margin-top: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .common-table-info {
      .ml {
        margin-left: 8px;
      }
        color: #999;
    }
    .common-pagination {
      min-width: 480px;
    }
    .el-table__empty-block {
      min-height: 360px;
    }
    &.animation {
      .loop(@n) when (@n < 200) {
          &.animation-horizontal {
            .el-table__body {
              .el-table__row {
                  &:nth-child(@{n}) {
                    opacity: 0;
                    animation: table-show-horizontal 500ms @n * 100ms forwards ease-out;
                  }
              }
            }
          }
          &.animation-vertical {
            .el-table__body {
              .el-table__row {
                  &:nth-child(@{n}) {
                    opacity: 0;
                    animation: table-show-vertical 300ms @n * 50ms forwards ease-out;
                  }
              }
            }
          }
          &.animation-rollIn {
            .el-table__body {
              .el-table__row {
                  &:nth-child(@{n}) {
                    opacity: 0;
                    animation: table-show-rollin 200ms @n * 100ms forwards ease-out;
                  }
              }
            }
          }
          &.animation-rotateInUpRight {
            .el-table__body {
              .el-table__row {
                  &:nth-child(@{n}) {
                    opacity: 0;
                    animation: rotateInUpRight 300ms @n * 50ms forwards ease-out;
                  }
              }
            }
          }
          &.animation-rotateInUpLeft {
            .el-table__body {
              .el-table__row {
                  &:nth-child(@{n}) {
                    opacity: 0;
                    animation: rotateInUpLeft 300ms @n * 50ms forwards ease-out;
                  }
              }
            }
          }
          &.animation-lightSpeedIn {
            .el-table__body {
              .el-table__row {
                  &:nth-child(@{n}) {
                    opacity: 0;
                    animation: lightSpeedIn 500ms @n * 100ms forwards ease-out;
                  }
              }
            }
          }
          .loop((@n + 1));
      }
      .loop(1);
    }

    @keyframes table-show-horizontal {
        0% { transform: translateX(100%); opacity: .5; }
        100% { transform: translateX(0); opacity: 1; }
    }
    @keyframes table-show-vertical {
        0% { transform: translateY(100%); opacity: .5; }
        100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes table-show-rollin {
        0% {
            opacity: 0;
            -webkit-transform: translateY(100%) rotate(120deg);
            -ms-transform: translateY(100%) rotate(120deg);
            transform: translateY(100%) rotate(120deg);
        }
        100% {
            opacity: 1;
            -webkit-transform: translateX(0px) rotate(0deg);
            -ms-transform: translateX(0px) rotate(0deg);
            transform: translateX(0px) rotate(0deg);
        }
    }
    @keyframes rotateInUpRight {
      0% {
          -webkit-transform-origin: right bottom;
          -ms-transform-origin: right bottom;
          transform-origin: right bottom;
          -webkit-transform: rotate(-90deg);
          -ms-transform: rotate(-90deg);
          transform: rotate(-90deg);
          opacity: 0;
      }
      100% {
          -webkit-transform-origin: right bottom;
          -ms-transform-origin: right bottom;
          transform-origin: right bottom;
          -webkit-transform: rotate(0);
          -ms-transform: rotate(0);
          transform: rotate(0);
          opacity: 1;
      }
    }
    @keyframes rotateInUpLeft {
      0% {
          -webkit-transform-origin: left bottom;
          -ms-transform-origin: left bottom;
          transform-origin: left bottom;
          -webkit-transform: rotate(90deg);
          -ms-transform: rotate(90deg);
          transform: rotate(90deg);
          opacity: 0;
      }
      100% {
          -webkit-transform-origin: left bottom;
          -ms-transform-origin: left bottom;
          transform-origin: left bottom;
          -webkit-transform: rotate(0);
          -ms-transform: rotate(0);
          transform: rotate(0);
          opacity: 1;
      }
    }
    @keyframes lightSpeedIn {
      0% {
        -webkit-transform: translateX(100%) skewX(-30deg);
        -ms-transform: translateX(100%) skewX(-30deg);
        transform: translateX(100%) skewX(-30deg);
        opacity: 0;
      }

      60% {
        -webkit-transform: translateX(-20%) skewX(30deg);
        -ms-transform: translateX(-20%) skewX(30deg);
        transform: translateX(-20%) skewX(30deg);
        opacity: 1;
      }
      80% {
        -webkit-transform: translateX(0%) skewX(-15deg);
        -ms-transform: translateX(0%) skewX(-15deg);
        transform: translateX(0%) skewX(-15deg);
        opacity: 1;
      }
      100% {
        -webkit-transform: translateX(0%) skewX(0deg);
        -ms-transform: translateX(0%) skewX(0deg);
        transform: translateX(0%) skewX(0deg);
        opacity: 1;
      }
    }
}
</style>
