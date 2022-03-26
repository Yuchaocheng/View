# TimePlan 时间计划

---
时间计划组件

| 序号 | 组件名称 | 修订人员 | 修订时间 | 修订说明 |
| ------ | ------ | ------ | ------ | ------ |
| 1 | TimePlan | 陈子昕 | 2022-02-10 |新增|

::: tip
1. `TimePlan` 组件提供两种工作模式，分为 <b>编辑模式</b> 和 <b>展示模式</b>，默认为编辑模式，同时时间计划提供三种形式，分别为 <b>日计划</b>，<b>周计划</b>，<b>假日计划</b> 和 <b>年计划</b>，默认为周计划。
2. 若想将已有时间计划导入组件展示或再编辑，请检查导入数据格式与本 demo 中的数据格式是否一致。（若传入数据长度大于此时时间计划最大长度，则会对传入数据进行裁剪。）
3. 组件支持对笔刷颜色，笔刷名称，笔刷图标以及各类时间计划的名称集合进行自定义，详情请参考 api 文档或 demo 示例。
4. 组件对输入参数的格式错误提示做了一层报错封装，详细可参考下文关于 <b>常见错误提示</b> 的说明。
5. 修改传入数据后组件未重新渲染时，检查数据修改的方式是否未触发响应式更新，可参考<a>https://cn.vuejs.org/v2/guide/reactivity.html</a>, 或通过`refresh`方法重新刷新组件以更新。
:::

## 结构说明

```js      

      └─ TimePlan
          └─ TimePlan.vue // entrance
          └─ utils
          └─ planTime // 时间微调组件
          └─ planHeader // 笔刷组件
          └─ hcp  
              │ hcpPlan.vue
              │ editMode.vue // 编辑模式
              │ showMode.vue // 展示模式
              │ slotMode.vue // 插槽模式
```

## 编辑模式

::: demo 

``` vue
<template>
  <time-plan
    ref="timePlan"
    v-model="planData"
    :btn-label="btnLabels"
    support-week-plan
    support-empty
  ></time-plan>
</template>

<script>
export default {
  data() {
    return {
      planData: [],
      btnLabels: [
        {type: 0, name: "计划一"}, 
        {type: 1, name: "计划二"}, 
        {type: 2, name: "计划三"}, 
        {type: 3, name: "计划四"}, 
        {type: 4, name: "计划五"}
      ]
    }
  },
  mounted() {
    this.planData = [
      {
        key: "key1",
        TimeSpan: [
          {
            RecordType: 0,
            BeginTime: "08:00:00",
            EndTime: "15:00:00"
          },
          {
            RecordType: 1,
            BeginTime: "13:00:00",
            EndTime: "17:30:00"
          }
        ]
      },
      {
        key: "key2",
        TimeSpan: [
          {
            RecordType: 3,
            BeginTime: "00:00:00",
            EndTime: "10:30:00"
          }
        ]
      },
      {
        key: "key3",
        TimeSpan: [
          {
            RecordType: 0,
            BeginTime: "02:00:00",
            EndTime: "11:00:00"
          }
        ]
      },
      {
        key: "key4",
        TimeSpan: [
          {
            RecordType: 1,
            BeginTime: "02:00:00",
            EndTime: "11:00:00"
          }
        ]
      },
      {
        key: "key5",
        TimeSpan: [
          {
            RecordType: 2,
            BeginTime: "02:00:00",
            EndTime: "11:00:00"
          }
        ]
      },
      {
        key: "key6",
        TimeSpan: [
          {
            RecordType: 4,
            BeginTime: "02:00:00",
            EndTime: "11:00:00"
          }
        ]
      },
      {
        key: "key7",
        TimeSpan: [
          {
            RecordType: 4,
            BeginTime: "02:00:00",
            EndTime: "11:00:00"
          }
        ]
      }
    ]
  }
};
</script>
```

:::

## 展示模式

::: demo 

``` vue
<template>
  <time-plan
    ref="timePlan"
    plan-mode="show"
    v-model="planData"
  ></time-plan>
</template>

<script>
export default {
  data() {
    return {
      planData: []
    }
  },
  mounted() {
    this.planData = [
      {
        key: "key1",
        TimeSpan: [
          {
            RecordType: 0,
            BeginTime: "08:00:00",
            EndTime: "13:00:00"
          },
          {
            RecordType: 1,
            BeginTime: "13:00:00",
            EndTime: "17:30:00"
          }
        ]
      },
      {
        key: "key2",
        TimeSpan: [
          {
            RecordType: 3,
            BeginTime: "00:00:00",
            EndTime: "10:30:00"
          }
        ]
      },
      {
        key: "key3",
        TimeSpan: [
          {
            RecordType: 0,
            BeginTime: "02:00:00",
            EndTime: "11:00:00"
          }
        ]
      },
      {
        key: "key4",
        TimeSpan: [
          {
            RecordType: 1,
            BeginTime: "02:00:00",
            EndTime: "11:00:00"
          }
        ]
      },
      {
        key: "key5",
        TimeSpan: [
          {
            RecordType: 2,
            BeginTime: "02:00:00",
            EndTime: "11:00:00"
          }
        ]
      },
      {
        key: "key6",
        TimeSpan: [
          {
            RecordType: 4,
            BeginTime: "02:00:00",
            EndTime: "11:00:00"
          }
        ]
      },
      {
        key: "key7",
        TimeSpan: [
          {
            RecordType: 4,
            BeginTime: "02:00:00",
            EndTime: "11:00:00"
          }
        ]
      }
    ]
  }
};
</script>
```

:::

## 插槽模式

::: tip
1. 每一行至多只能有一种时间段计划
2. 插槽模式需要定义每种插槽时间段的代表时间段（支持多段）、插槽名称、插槽标识符（type）
3. 该模式下可以通过 `range` slot自定义点击时间段后的信息面板，该slot暴露出一个对象，包含了该时间段的信息和两个方法`close`、`delete`，分别用以关闭信息块和删除该行的时间段
:::

::: demo 

``` vue
<template>
  <time-plan
    ref="timePlan"
    plan-mode="slot"
    :slot-btn-label="slotBtnLabels"
    v-model="planData"
  >
    <template #range="{range}">
      <div class="demo-popover">
        {{ JSON.stringify(range) }}
        <button @click="()=>{range.close()}">close</button>
        <button @click="()=>{range.delete()}">delete</button>
      </div>
    </template>
  </time-plan>
</template>

<script>
export default {
  data() {
    return {
      slotBtnLabels: [
        {type: 0, name: "时间段1", timeSpan: [{BeginTime: "08:00:00", EndTime: "12:00:00"}]},
        {type: 1, name: "时间段2", timeSpan: [{BeginTime: "08:00:00", EndTime: "12:00:00"}]},
        {type: 2, name: "时间段3", timeSpan: [{BeginTime: "08:00:00", EndTime: "12:00:00"}, {BeginTime: "15:00:00", EndTime: "20:00:00"}]},
        {type: 3, name: "时间段4", timeSpan: [{BeginTime: "08:00:00", EndTime: "12:00:00"}]},
        {type: 4, name: "时间段5", timeSpan: [{BeginTime: "08:00:00", EndTime: "12:00:00"}]}
      ],
      planData: [
        { 
          row: 2, // row 表示第几行(从 0 开始)
          slot: 2, // slot 与 slotBtnLabel 中的 type 对应
          week: 'Tuesday' // 其余为自定义属性，输出时会一起带出
        },
        { row: 4, slot: 1, week: 'Thursday' }
      ]
    }
  }
};
</script>

<style>
.demo-popover {
  width: 200px;
  height: 50px;
}
</style>
```

:::

## 数据格式

```js
  // 可传入如下数据格式的数据作为初始值进行渲染
  // 1. edit 模式
  [
    {
      key: "key1", // key 值作为输入数据中该行的标识符，可自定义
      TimeSpan: [
        {
          RecordType: 0, // RecordType 对应 btnLabels 中的 type，指哪一种计划（笔刷）类型
          BeginTime: "08:00:00",
          EndTime: "13:00:00"
        },
        {
          RecordType: 1,
          BeginTime: "13:00:00",
          EndTime: "17:30:00"
        }
      ]
    },
    ...
  ]

  // 2. show 模式的数据类型与 edit 模式一致
  
  // 3. slot 模式
  // 3.1 slot 模式的数据格式
  [
    { 
      row: 2, // row 表示第几行(从 0 开始)
      slot: 2, // slot 与 slotBtnLabel 中的 type 对应
      week: 'Tuesday' // 其余为自定义属性，输出时会一起带出
    },
    ...
  ]
  // 3.2 slot 模式的 slotBtnLabel 格式
  [
    {type: 0, name: "时间段1", timeSpan: [{BeginTime: "08:00:00", EndTime: "12:00:00"}]},
    {type: 1, name: "时间段2", timeSpan: [{BeginTime: "08:00:00", EndTime: "12:00:00"}]},
    {type: 2, name: "时间段3", timeSpan: [
      // 每一种插槽可以是多段时间的格式
      {BeginTime: "08:00:00", EndTime: "12:00:00"}, {BeginTime: "15:00:00", EndTime: "20:00:00"}
    ]},
    ...
  ]
```

## 工具类

可以通过`support-week-plan`、`support-empty`、`show-tool`属性打开全周计划、一键清空、行复制。

::: demo 

``` vue
<template>
  <time-plan
    ref="timePlan"
    v-model="planData"
    support-week-plan
    support-empty
    show-tool
  ></time-plan>
</template>

<script>
export default {
  data() {
    return {
      planData: []
    }
  },
  mounted() {
    this.planData = [
      {
        key: "key1",
        TimeSpan: [
          {
            RecordType: 0,
            BeginTime: "08:00:00",
            EndTime: "13:00:00"
          },
          {
            RecordType: 1,
            BeginTime: "13:00:00",
            EndTime: "17:30:00"
          }
        ]
      },
      {
        key: "key2",
        TimeSpan: [
          {
            RecordType: 3,
            BeginTime: "00:00:00",
            EndTime: "10:30:00"
          }
        ]
      },
      {
        key: "key3",
        TimeSpan: [
          {
            RecordType: 0,
            BeginTime: "02:00:00",
            EndTime: "11:00:00"
          }
        ]
      },
      {
        key: "key4",
        TimeSpan: [
          {
            RecordType: 1,
            BeginTime: "02:00:00",
            EndTime: "11:00:00"
          }
        ]
      },
      {
        key: "key5",
        TimeSpan: [
          {
            RecordType: 2,
            BeginTime: "02:00:00",
            EndTime: "11:00:00"
          }
        ]
      },
      {
        key: "key6",
        TimeSpan: [
          {
            RecordType: 4,
            BeginTime: "02:00:00",
            EndTime: "11:00:00"
          }
        ]
      },
      {
        key: "key7",
        TimeSpan: [
          {
            RecordType: 4,
            BeginTime: "02:00:00",
            EndTime: "11:00:00"
          }
        ]
      }
    ]
  }
};
</script>
```
:::

## TimePlan Attributes

| 参数     | 说明     | 类型   | 可选值 | 默认值 |
| :------- | :------- | :----- | :----- | :----- |
| plan-mode | 组件模式 | String | "show", "edit", "slot" | "edit" |
| plan-type | 时间模式 | String | "day", "week", "holiday", "year" | "week" |
| show-tool | 是否支持行复制功能 | Boolean | - | false |
| v-model | 双向绑定的数据集合 | Array | - | [] |
| colors | 笔刷自定义颜色集合 | Array | - | ["#2196f3", "#ff6942", "#705045", "#16b89b", "#c31ead"] |
| btn-label | 笔刷自定义集合 | Array | - | [{type: 0, name: "计划一"}, <br/>{type: 1, name: "计划二"}, <br/>{type: 2, name: "计划三"}, <br/>{type: 3, name: "计划四"}, <br/>{type: 4, name: "计划五"}] |
| slot-btn-label | 插槽模式插槽自定义集合 | Array | - | - |
| btn-icon | 笔刷自定义icon集合 | Array | - | - |
| day-label | 日计划自定义label名称 | String | - | "" |
| week-label | 周计划自定义label集合 | Array | - | ["周日", "周一", "周二", "周三", "周四", "周五", "周六"] |
| holiday-label | 假期计划自定义label集合 | Array | - | ["周日", "周一", "周二", "周三", "周四", "周五", "周六"，"节假日"] |
| support-week-plan | 是否支持全周计划 | Boolean | - | false |
| support-empty | 是否支持一键清空 | Boolean | - | false |
| limit | 设置每行限制计划段数量 | Number | - | - |
| tiny | edit 模式时间框是否为紧凑模式（在组件放置区域宽度有限时使用）| Boolean | - | false |
| btn-width | 笔刷按钮宽度 | Number | - | 90 |

## TimePlan Methods
| 事件名称 | 说明 | 参数 | 回调 |
| :------- | :------- | :----- | :----- |
| clean | 清空画布 | - | - |
| refresh | 刷新画布 | - | - |

## 常见错误提示
| 序号     | 描述     | 说明   |
| :------- | :------- | :----- |
| 1 | type check failed for prop `'xxx'`: expected `'xxx'`, got `'xxx'` | 参数传入格式错误 |
| 2 | value check failed for prop `'xxx'`: expected `'xxx'`, got `'xxx'` | 参数传入值不在可选范围内 |
| 3 | Color only supports hexadecimal and RGB formats，please check the index `'xxx'` of the prop `'xxx'` | 传入颜色集合某一项不是颜色字符串（支持3或6位16进制，以及rgb字符串） |
| 4 | type check failed for the index `'xxx'` of the prop `'xxx'`: expected `'xxx'`, got `'xxx'`. | 传入的参数集合，集合中某一项格式错误 |
| 5 | Failed to initialize data, please check the format of the prop "value". | v-model 传入的初始数据格式错误 |