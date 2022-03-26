<template>
  <div class="plan-content">
    <!-- 底图已做渲染，这里不做处理 -->
    <div class="plan-timelist" v-if="!isNoLabel"></div>
    <div class="plan-time-table">
      <div class="popover-box" :style="popoverStyle" ref="popoverBox" v-if="isShowPopover">
        <slot name="range" :range="oRangeData"></slot>
        <div class="box-arrow" :style="arrowStyle"></div>
      </div>
      <!-- 每一行 -->
      <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="slot-wrapper" @mouseenter="handleEnterRow(row, rowIndex)" @mouseleave="handleLeaveRow(row, rowIndex)" @click="handleClickRow(row, rowIndex)">
        <!-- 悬浮滑块 -->
        <div
          class="slot-ranger"
          v-for="(range, rangeIndex) in row.range"
          :key="rangeIndex"
          @click="(e) => {handleClickRange(e, row, rangeIndex)}"
          :style="{
            'left': range.left + 'px',
            'width': range.width + 'px',
            'background': range.background,
            'opacity': range.opacity,
            'display': range.visible ? 'block' : 'none'
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  timeToSecond
} from "../utils";
export default {
  name: 'SlotMode',
  props: {
    planType: {
      type: String,
      default: "day"
    },
    value: {
      type: Array,
      default: () => []
    },
    isNoLabel: {
      type: Boolean,
      default: false
    },
    colors: {
      type: Array,
      default: () => []
    },
    dayLabel: {
      type: String,
      default: ""
    },
    weekLabel: {
      type: Array,
      default: () => []
    },
    holidayLabel: {
      type: Array,
      default: () => []
    },
    yearLabel: {
      type: Array,
      default: () => []
    },
    btnOpts: {
      type: Object,
      default: null
    },
    slotBtnLabel: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 鼠标悬在行
      activeRow: null,
      // 需要传递的数据集合
      rows: [],
      // 鼠标点选的range
      oRange: {},
      // 传递的数据
      oRangeData: {},
      // 是否显示 popover
      isShowPopover: false
    };
  },
  computed: {
    // 时间集合（行集合）
    timeArr() {
      let timeStrArr = null;
      // TODO:暂不支持老版本和自定义模式
      if (this.isOldVersion) {
        // TODO：老版本
      } else if (this.planType === "day") {
        timeStrArr = this.dayLabel;
      } else if (this.planType === "week") {
        timeStrArr = this.weekLabel;
      } else if (this.planType === "holiday") {
        timeStrArr = this.holidayLabel;
      } else if (this.planType === "year") {
        timeStrArr = this.yearLabel;
      } else if (this.planType === "custom") {
        // TODO：自定义模式
      }
      return timeStrArr;
    },
    popoverStyle() {
      // eslint-disable-next-line no-unused-vars
      let { left, top } = this.oRange;
      return {
        left,
        top
      };
    },
    arrowStyle() {
      let { eleW } = this.oRange;
      return {
        left: `${Math.ceil(eleW / 2, 10) }px`
      };
    }
  },
  watch: {
    value: {
      // this.handleValueChange(val);
      handler(val) {
        this.handleValueChange(val);
      },
      immediate: true
    }
  },
  mounted() {
    // console.log(this.rows);
    // 由于刚进来无法触发 value 的 watch，所以手动触发一次
    // this.handleValueChange(this.value);
    // 初始由于传进来的数据有可能长度不足，需要补足后回传一次
    // eslint-disable-next-line no-unused-vars
    // this.$emit('input', this.rows.map(({row, slot, range, ...rest}) =>({
    //   row,
    //   slot,
    //   ...rest
    // })));
  },
  methods: {
    // 进入行
    handleEnterRow(row) {
      // 如果当前行无slot， 且已选择slot按钮，则显示虚影
      if (!row.slot && this.btnOpts && row.slot !== 0) {
        let background = this.btnOpts.color;
        // 通过数据中的 slot 找到对应 slotBtnLabel 中 type 相同的那一项
        let _index = this.slotBtnLabel.findIndex(btn => {
          return btn.type === this.btnOpts.id;
        });
        let { timeSpan } = this.slotBtnLabel[_index];
        let _range = [];
        // timeSpan 有多段
        timeSpan.forEach(time => {
          let { BeginTime, EndTime } = time;
          let beginS = timeToSecond(BeginTime);
          let endS = timeToSecond(EndTime);
          let left = Math.ceil((beginS / 86400) * 577, 10);
          let width = Math.ceil((endS - beginS) / 86400 * 577, 10);
          _range.push({
            left,
            width,
            background,
            visible: true,
            opacity: 0.5
          });
        });
        this.$set(this.rows, +row.row, {
          ...this.rows[+row.row],
          range: _range
        });
      }
    },
    // 离开行
    handleLeaveRow(row) {
      // 只清除虚影，不清楚已有数据
      if (!row.slot && row.slot !== 0) {
        this.$set(this.rows, +row.row, {
          ...this.rows[+row.row],
          range: []
        });
      }
    },
    // 点击行
    handleClickRow(row) {
      if (this.btnOpts) {
        let background = this.btnOpts.color;
        // 通过数据中的 slot 找到对应 slotBtnLabel 中 type 相同的那一项
        let _index = this.slotBtnLabel.findIndex(btn => {
          return btn.type === this.btnOpts.id;
        });
        let { timeSpan } = this.slotBtnLabel[_index];
        let _range = [];
        // timeSpan 有多段
        timeSpan.forEach(time => {
          let { BeginTime, EndTime } = time;
          let beginS = timeToSecond(BeginTime);
          let endS = timeToSecond(EndTime);
          let left = Math.ceil((beginS / 86400) * 577, 10);
          let width = Math.ceil((endS - beginS) / 86400 * 577, 10);
          _range.push({
            left,
            width,
            background,
            visible: true,
            opacity: 1
          });
        });
        this.$set(this.rows, +row.row, {
          ...this.rows[+row.row],
          slot: this.btnOpts.id,
          range: _range
        });
      }
      // eslint-disable-next-line no-unused-vars
      this.$emit('input', this.rows.map(({row, slot, range, ...rest}) =>({
        row,
        slot,
        ...rest
      })));
    },
    // 处理 value 变化
    handleValueChange(val) { // { row: 0, slot: 1 }
      // 传了一个空数组进来
      this.rows = this.timeArr.map((row, rowIndex) => {
        return {
          row: rowIndex, // 行 key
          slot: null, // 行计划段类型
          range: [] // 滑块集合
        };
      });
      // debugger;
      // 如果传入数据不为空，则需要对创建的初始 rows 进行赋值
      if (val.length) {
        // 创建每一项空项
        val.forEach(item => {
          let { row, slot, ...rest } = item;
          if (slot || slot === 0) {
            // 通过数据中的 slot 找到对应 slotBtnLabel 中 type 相同的那一项
            let _index = this.slotBtnLabel.findIndex(btn => {
              return btn.type === slot;
            });
            let background = this.colors[_index];
            let { timeSpan } = this.slotBtnLabel[_index];
            let _range = [];
            // timeSpan 有多段
            timeSpan.forEach(time => {
              let { BeginTime, EndTime } = time;
              let beginS = timeToSecond(BeginTime);
              let endS = timeToSecond(EndTime);
              let left = Math.ceil((beginS / 86400) * 577, 10);
              let width = Math.ceil((endS - beginS) / 86400 * 577, 10);
              _range.push({
                left,
                width,
                background,
                visible: true,
                opacity: 1
              });
            });
            
            this.$set(this.rows, +row, {
              ...this.rows[+row], // 指 row
              ...rest, // 用户自定义属性
              slot,
              range: _range
            });
          } else {
            this.$set(this.rows, +row, {
              ...this.rows[+row], // 指 row 和 range
              ...rest,
              slot: null
            });
          }
        });
      }
    },
    // 手动刷新
    refresh() {
      this.handleValueChange(this.value);
    },
    // 点击滑块
    handleClickRange(e, rowData, rangeIndex) {
      e.stopPropagation();
      let {row, range, slot, ...rest} = rowData;
      // 如果点在虚影上
      if (!slot) {
        return this.handleClickRow(rowData);
      }
      this.isShowPopover = true;
      this.$nextTick(() => {
        let ele = this.$refs.popoverBox;
        let eleW = parseInt(window.getComputedStyle(ele).width, 10);
        let eleH = parseInt(window.getComputedStyle(ele).height, 10);
        this.oRange = {
          left: `${range[rangeIndex].left + Math.ceil(range[rangeIndex].width / 2, 10) - Math.ceil(eleW / 2, 10) }px`,
          top: `${row * 28 - eleH - 5 }px`,
          eleW
        };
        this.oRangeData = {
          slot,
          close: () => {
            this.isShowPopover = false;
          },
          delete: () => {
            this.isShowPopover = false;
            this.$set(this.rows, +row, {
              ...this.rows[+row],
              slot: null,
              range: []
            });
            // eslint-disable-next-line no-unused-vars
            this.$emit('input', this.rows.map(({row, slot, range, ...rest}) =>({
              row,
              slot,
              ...rest
            })));
          },
          ...rest
        };
      });
    }
  }
};
</script>

<style scoped>
.plan-content {
  height: 100%;
  display: flex;
  position: relative;
}

.plan-timelist {
  height: 100%;
  width: 99px;
}

.plan-time-table {
  height: 100%;
  flex: 1;
  border-top: 0px;
  border-bottom: 0px;
  border-left: 0px;
  position: relative;
}

.slot-wrapper {
  position: relative;
  height: 28px;
  cursor: pointer;
}

.slot-ranger {
  position: absolute;
  top: 50%;
  height: 80%;
  transform: translateY(-50%);
}

.popover-box {
  position: absolute;
  top: 0px;
  left: 0px;
  box-shadow: 0 0 5px #cccccc;
  background: #ffffff;
  z-index: 9;
}

.box-arrow {
    position: absolute;
    width: 0px;
    height: 0px;
    bottom: -2px;
    left: 0px;
    border: 4px solid #ffffff;
    -webkit-box-shadow: 1px 1px 1px #cccccc;
    box-shadow: 1px 1px 1px #cccccc;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
}
</style>