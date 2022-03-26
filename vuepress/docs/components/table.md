# CommonTable 
> 集成el-table功能、集成pagination组件、支持自定义渲染、支持传入Api自动获取表格数据、支持部分自定义fomatter（时间、日期、单位、货币等）、支持自定义枚举值options、支持多种不同的动画展示、支持自动loading、支持自定义tooltip、支持透传属性给pagination和el-table。与Form可共用一个fields<br>
### 组件使用
api填充数据
::: demo
```vue
<template>
  <common-table
    ref="table"
    :fields="fields2"
    :api="getTable"
    row-key="name"
    :animation="true"
    :has-pagination="true"
  >
    <el-button @click="handleRefresh">刷新数据,并重置分页</el-button>
    <el-button @click="handleClearSelection">clearSelection</el-button>
    
  </common-table>
</template>
<script>
  export default {
    data() {
      return {
        fields2: [
          {
            type: 'index'
          },
          {
            type: 'selection'
          },
          {
            title: '名称',
            key: 'name',
            render: (h, {row}) => { // 自定义
              return  <el-tag>{row.name}</el-tag>
            }
          },
          {
            title: '类型',
            key: 'type',
            options: [
              {
                label: '公司',
                value: 1
              },
              {
                label: '人',
                value: 2
              }
            ]
          }
        ]
      }
    },
    methods: {
      getTable() {
        return new Promise((res, rej) => {
          setTimeout(() => {
            res({
              rows: [
                {
                  name: '海康威视',
                  type: 1
                },
                {
                  name: '梅西',
                  type: 2
                },
                {
                  name: '阿里巴巴',
                  type: 1
                },
                {
                  name: 'C罗',
                  type: 2
                },
                {
                  name: '吉利',
                  type: 1
                },
                {
                  name: '武磊',
                  type: 2
                }
              ],
              total: 100
            })
          }, 3000)
        })
      },
      handleRefresh() {
        this.$refs.table.refresh();
      },
      handleClearSelection() {
        this.$refs.table.clearSelection();
      }
    }
  }
</script>
<style>
.common-table table{
  margin: 0;
}
</style>
```
:::

data填充数据
::: demo `fields`：表格各列参数字段，与CommonForm fiedls配置类似，但也有不同，见下文fields参数详解。
```vue
<template>
  animation type: <el-radio-group v-model="radio1">
    <el-radio-button label="vertical"></el-radio-button>
    <el-radio-button label="horizontal"></el-radio-button>
    <el-radio-button label="rollIn"></el-radio-button>
    <el-radio-button label="rotateInUpRight"></el-radio-button>
    <el-radio-button label="rotateInUpLeft"></el-radio-button>
    <el-radio-button label="lightSpeedIn"></el-radio-button>
  </el-radio-group>
  <common-table
    :fields="fields"
    :data="data"
    :autoload="false"
    row-key="id"
    :animation="true"
    :animation-type="radio1"
    :has-pagination="true"
  >
  </common-table>
</template>
<script>
  export default {
    data() {
      return {
        radio1: 'vertical',
        data: [{
          name: '海康威视',
          type: '公司'
        }, {
          name: '海康威视',
          type: '公司'
        }, {
          name: '海康威视',
          type: '公司'
        }, {
          name: '海康威视',
          type: '公司'
        }, {
          name: '海康威视',
          type: '公司'
        }, {
          name: '海康威视',
          type: '公司'
        }],
        fields: [
          {
            id: 1,
            title: '名称',
            key: 'name'
          },
          {
            id: 2,
            title: '类型',
            key: 'type'
          }
        ]
      }
    }
  }
</script>
<style>
.common-table table{
  margin: 0;
}
</style>
```
:::


多级表头
::: demo
```vue
<template>
  <common-table
    :fields="fields3"
    :data="data3"
  >
  </common-table>
</template>
<script>
export default {
  data () {
    return {
      fields3: [
        {
          title: '父1',
          children: [
            {
              title: '父2-子1',
              key: 'son1'
            },
            {
              title: '父2-子2',
              key: 'son2'
            }
          ]
        },
        {
          title: '父2',
          children: [
            {
              title: '父2-子1',
              key: 'son3'
            },
            {
              title: '父2-子2',
              key: 'son4'
            },
            {
              title: '父2-子3',
              key: 'son5'
            }
          ]
        }
      ],
      data3: [{
        son1: 1,
        son2: 2,
        son3: 3,
        son4: 4,
        son5: 5
      },
      {
        son1: 1,
        son2: 2,
        son3: 3,
        son4: 4,
        son5: 5
      },
      {
        son1: 1,
        son2: 2,
        son3: 3,
        son4: 4,
        son5: 5
      }]
    }
  }
}
</script>
```

:::
###	CommonTable Attributes
|参数|说明|类型|可选值|默认值|
| ------ | ------ | ------ | ------ | ------ |
|api|获取表格的数据的promise函数，返回数据对象中必须含rows和total|Function|-|-|
|height|表格高度，默认自适应|Number|-|-
|fields|表格各列参数字段，与CommonForm fiedls配置类似，但也有不同，见下文fields参数详解|Array|-|[]|
|data|表格数据|Array|-|[]|
|row-key|行数据的 Key，用来优化 Table 的渲染|String|-|id|
|has-pagination|是否显示分页器|Boolean|-|false|
|animation|是否显示行动画效果|Boolean|-|true|
|animation-type|动画类型，目前内置6种类型的动画|String|vertical、 horizontal、rollIn、rotateInUpRight、rotateInUpLeft、lightSpeedIn|vertical|
|has-tip|显示表格刷新时间和已选择个数（若有selction）|Boolean|-|true|
|border|是否带有纵向边框|Boolean|-|true|
|filter-data|自定义过滤函数,返回值是数组数据|Function(rows)|-|-|
|autoload|是否自动加载数据|Boolean|-|true|
|show-time|是否展示刷新数据的时间|Boolean|-|false|
|paginationProps|分页props选项|Object|-|{}|


###	CommonTable Methods
|方法名|说明|参数|
| ------ | ------ | ------ |
|refresh|有api的情况，刷新表格数据，|-|
|getSelection|用于多选表格，获取selection|-|
|toggleRowSelection|用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）|row, selected
|clearSelection|用于多选表格，清空已选|-|
|doLayout|对Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法|-|

### CommonTable Events
|事件名称|说明|回调参数|
| ------ | ------ | ------ |
|selection-change|当选择项发生变化时会触发该事件|selection, data|
|load|回调table data|data|
|total-change|触发total回调|total|

###	CommonTable Slot
|名称|说明|
| ------ | ------ |
|-|插入到表格之前的内容，常用于放置表格按钮|

### Fields Attributes

|参数|说明|类型|可选值|默认值|
| ------ | ------ | ------ | ------ | ------ |
|title|表格项目label|Sting|-|-|
|table|若fiedls,同时被dialogForm,CommonForm等使用，外层属性是公共属性，该属性下的属性为table的私有属性。（兼容性API）|Object|-|{}|
|isShow|Table下属性，是否显示表格项，默认全显示|Boolean|-|true|
|key|表格key值|String|-|-|
|order|排序||||
|options|按options显示表格数据|[Array, Function]|-|[]|
|type|一些特殊的表单项,selection、expand等|String|Selection expand -|
|tooltip|是否开始tooltip，在render情况下无效|Boolean|-|false|
|render|render表格内容区单元格的函数|Function(h, scope,props)|-|-|
|formatter|转换显示|String|Date、time、currency|-|
|isFilter|是否开启过滤，若开启，options属性也要有值|Boolean||false|

### 修订记录
| 序号 | 组件名称 | 修订人员 | 修订时间 | 修订说明 |
| ------ | ------ | ------ | ------ | ------ |
| 1 | CommonTable | 徐晨智 | 2022-02-12 |  新增|
