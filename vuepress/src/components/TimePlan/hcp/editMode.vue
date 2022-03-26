/**
* @author chenzixin7(chenzixin7@hikvision.com.cn)
* @desc hcp 业务需求的时间计划组件-edit模式
*/
<template>
  <div class="plan-content">
    <!-- 底图已做渲染，这里不做处理 -->
    <div class="plan-timelist" v-if="!isNoLabel"></div>
    <!-- 网格 -->
    <div
      class="plan-time-table"
      ref="planTable"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseLeaveTable"
    >
      <!-- 时间弹框 -->
      <div
        class="time-box"
        :style="timeBoxStyle"
        @mouseenter="handleEnterTimeBox"
        @mousedown="handleMouseDownTimeBox"
      >
        <div class="plan-popover-time">
          <plan-time v-model="beginTime" :disabled="beginDisabled"></plan-time>
          <span class="plan-popover-divider" />
          <plan-time v-model="endTime" :disabled="endDisabled"></plan-time>
        </div>
        <div class="time-arrow" :style="timeArrowStyle"></div>
      </div>
      <!-- 选择框虚线 -->
      <div
        class="plan-select-box"
        :style="boxStyle"
        :class="isClean ? 'plan-clean-box' : ''"
      ></div>
      <!-- 每一行（一天） -->
      <div
        class="plan-time-table-row"
        v-for="(row, index1) in rows"
        :key="index1"
      >
        <!-- 每一格 (半小时) -->
        <div
          class="plan-time-table-col"
          v-for="(col, index2) in cols[index1]"
          :key="index2"
          :style="col.status ? getSelectedStyle_wrapper(col) : null"
          @mouseenter="handleMouseEnter($event, col)"
          @mouseleave="handleMouseLeaveCell($event, col)"
        >
          <!-- 因为可能存在半格,所以需要两个容器 -->
          <div
            class="plan-time-table-col-container"
            :style="col.status ? getSelectedStyle_container(col) : null"
          ></div>
        </div>
      </div>
    </div>

    <!-- 工具栏(功能：复制) -->
    <div class="plan-tool-box" v-if="showTool && planType !== 'day'">
      <!-- 复制功能详情 -->
      <div class="tool-copy-box" :style="toolPopoverStyle" v-show="showCopyBox">
        <div class="copy-box-title" :title="$t('copyTo').replace('%s', rows[hoverToolRow])">
          {{ $t('take') }}
          <span style="color: #e72528">{{ rows[hoverToolRow] }}</span>
          {{ $t('copyTo') }}
        </div>
        <div class="copy-box-content">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >{{ $t('selectAll') }}</el-checkbox>
          <el-checkbox-group
            v-model="copyList"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="(item, index) in rows"
              :key="index"
              :label="index"
              :disabled="hoverToolRow === index"
            >{{ item }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="copy-box-check-btn">
          <div class="copy-btn" @click="handleCopy">{{ $t('ok') }}</div>
          <div class="copy-btn" @click="closeCopyBox">{{ $t('cancel') }}</div>
        </div>
        <div class="box-arrow"></div>
      </div>
      <div
        v-for="(item, index) in rows"
        :key="index"
        class="tool-area"
        @mouseenter="handleMouseEnterToolBox(index)"
      >
        <i
          class="h-icon-copy plan-tool-icon"
          slot="reference"
          :style="hoverToolRow === index ? 'display: block' : 'display: none'"
          @click="handleCopyBtn(index)"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
import {
  throttle,
  stopPropagation,
  getDateListByPlanType,
  formatOutput,
  timeToSecond,
  editLength,
  getPlanByPlanType
} from "../utils";
import planTime from "../planTime/plan-time";
export default {
  name: "EditMode",
  components: {
    planTime
  },
  props: {
    btnOpts: {
      type: Object,
      default: null
    },
    planType: {
      type: String,
      default: "day"
    },
    value: {
      type: [Object, Array],
      default: null
    },
    showTool: {
      type: Boolean,
      default: false
    },
    isNoLabel: {
      type: Boolean,
      default: false
    },
    isOldVersion: {
      type: Boolean,
      default: false
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
    colors: {
      type: Array,
      default: () => []
    },
    btnLabel: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: null
    },
    tiny: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rows: [],
      cols: [],
      isPressed: false, // 鼠标按住选择状态
      startX: null, // 选择框起始点 距离可视区域左边的距离
      startY: null, // 选择框起始点 距离可视区域上边的距离
      tableX: null, // 网格 距离可视区域左边的距离
      tableY: null, // 网格 距离可视区域上边的距离
      endX: null, // 选择框终点 距离可视区域左边的距离
      endY: null, // 选择框终点 距离可视区域上边的距离
      lastEndX: null, // 上一次选择框终点 距离可视区域左边的距离
      lastEndY: null, // 上一次选择框终点 距离可视区域上边的距离
      canvasW: 577, // 画布宽
      // canvasH: 197, // 画布高
      cellW: 12, // 单元格宽
      cellH: 28, // 单元格高
      startCell: [], // 框选起点块的 index
      endCell: [], // 框选终点块的 index
      lastEndCell: [], // 上一次框选终点块的 index
      drawCount: 1, // 用于记录这是第几次绘制时的cell
      cleanCount: 1, // 用于记录这是第几次擦除时的cell
      showTime: false, // 是否展示时间弹框,
      beginTime: null, // 传入plan-time的beginTime
      endTime: null, // 传入plan-time的endTime
      hoverRow: null, // 鼠标悬停单元格行数i
      hoverCol: null, // 鼠标悬停单元格列数
      planRange: [], // 鼠标悬停的计划段范围(该变量主要用于性能优化)
      planRow: null, // 鼠标悬停的计划段行数(该变量主要用于性能优化)
      hoverToolRow: null, // 鼠标悬停的工具栏行数
      showCopyBox: false, // 是否显示复制box
      copyList: [], // 复制数组
      checkAll: false, // 全选
      isIndeterminate: false,
      cellTimeOut: null, // cell延迟显示计时器
      isPlanTimeEmit: false // 是不是planTime组件触发的emit，如果是，则回传回来以后不进行handleValueChange的
    };
  },
  computed: {
    // // 根据计划类型计算有几行
    // rows() {
    //   return getDateListByPlanType(this.planType);
    // },
    // // cell 状态管理集合
    // cols() {
    //   // 如果没有传入数据
    //   let _cols = [];
    //   if (this.rows.length) {
    //     // 初始数据
    //     this.rows.forEach((item, rowIndex) => {
    //       let _row = [];
    //       for (let i = 0; i < 48; i++) {
    //         _row.push({
    //           rowIndex,
    //           rowName: item,
    //           colIndex: i,
    //           status: false,
    //           beginTime: i * 1800,
    //           endTime: (i + 1) * 1800,
    //           half: {
    //             ishalf: false,
    //             start: null,
    //             end: null,
    //           },
    //         });
    //         if (i !== 0) {
    //           _row[i - 1].next = _row[i];
    //           _row[i].pre = _row[i - 1];
    //         }
    //       }
    //       _cols.push(_row);
    //     });
    //   }
    //   return _cols;
    // },
    // 拉选框样式
    boxStyle() {
      return {
        display: this.isPressed ? "block" : "none",
        top: `${this.minY - this.tableY }px`,
        left: `${this.minX - this.tableX }px`,
        width: `${this.maxX - this.minX }px`,
        height: `${this.maxY - this.minY }px`
      };
    },
    minX() {
      if (this.startX >= this.tableX && this.endX >= this.tableX) {
        return Math.min(this.startX, this.endX);
      }
      return false;
    },
    maxX() {
      const tableMaxX = this.tableX + this.canvasW;
      if (this.startX <= tableMaxX && this.endX <= tableMaxX) {
        return Math.max(this.startX, this.endX);
      }
      return false;
    },
    minY() {
      if (this.startY >= this.tableY && this.endY >= this.tableY) {
        return Math.min(this.startY, this.endY);
      }
      return false;
    },
    maxY() {
      const tableMaxY = this.tableY + this.canvasH;
      if (this.startY <= tableMaxY && this.endY <= tableMaxY) {
        return Math.max(this.startY, this.endY);
      }
      return false;
    },
    // 判断是否是擦除模式
    isClean() {
      if (!this.btnOpts) {
        return false;
      }
      if (this.btnOpts.type === "clean") {
        return true;
      }
      return false;
    },
    // 绘制模式的笔刷颜色
    brushColor() {
      if (!this.btnOpts) {
        return false;
      }
      if (this.btnOpts.type === "plan") {
        return this.btnOpts.color;
      }
      return false;
    },
    // 当前绘制的时间计划
    currentPlan() {
      if (!this.btnOpts) {
        return false;
      }
      if (this.btnOpts.type === "plan") {
        return this.btnOpts.label;
      }
      return false;
    },
    // 当前绘制的时间计划type
    currentPlanType() {
      if (!this.btnOpts) {
        return false;
      }
      if (this.btnOpts.type === "plan") {
        return this.btnOpts.id;
      }
      return false;
    },
    // 时间弹框样式
    timeBoxStyle() {
      let dividerCol = 39;
      if (this.showTool) {
        dividerCol = 43;
      }
      return {
        display: !this.isPressed && this.showTime ? "block" : "none",
        top: `${this.hoverRow * this.cellH - 40 }px`,
        left: this.tiny && this.hoverCol >= (dividerCol + 1) ? `${dividerCol * this.cellW - 100 }px` : `${this.hoverCol * this.cellW - 100 }px`
      };
    },
    // 时间弹框小箭头样式
    timeArrowStyle() {
      let dividerCol = 39;
      return {
        left: this.tiny && this.hoverCol >= (dividerCol + 1) ? this.showTool ? `${100 + (this.hoverCol - dividerCol - 4) * this.cellW }px` : `${100 + (this.hoverCol - dividerCol) * this.cellW }px` : '100px'
      };
    },
    // 画布高度
    canvasH() {
      return this.cellH * parseInt(this.rows.length, 10) + 1;
    },
    // 开始时间禁用add状态
    beginDisabled() {
      if (this.beginTime === this.endTime - 60) {
        return "add";
      }
      return "";
    },
    // 中止时间禁用reduce状态
    endDisabled() {
      if (this.beginTime === this.endTime - 60) {
        return "reduce";
      }
      return "";
    },
    // 复制功能弹出框样式
    toolPopoverStyle() {
      return {
        top: `${(this.hoverToolRow + 0.5) * this.cellH - 90 }px`,
        left: "-280px"
      };
    }
  },
  watch: {
    beginTime(val) {
      // 修改起始时间时,计划段最前的那块cell
      const cell = this.cols[this.planRow][this.planRange[0]];
      cell.beginTime = val;
      // 初始时间值
      const originVal = cell.colIndex * 1800;
      const diff = val - originVal;
      if (diff === 0) {
        // 无偏移
        cell.half.start = null;
      } else {
        cell.half.ishalf = true;
        if (Math.abs(diff) < 1800) {
          // 偏移绝对值小于1800
          if (diff > 0) {
            // 0 < diff < 1800
            cell.half.start = 1;
          } else if (diff < 0) {
            // 0 < -diff < 1800
            cell.half.start = -1;
            // 如果前一格有其他计划段,则清除它
            if (cell.pre.status && cell.pre.currentPlan !== cell.currentPlan) {
              cell.pre.status = false;
              cell.pre.currentPlan = null;
              cell.pre.currentPlanType = null;
              cell.pre.currentColor = null;
              cell.pre.half.ishalf = false;
              cell.pre.half.start = null;
              cell.pre.half.end = null;
            }
          }
        } else if (Math.abs(diff) >= 1800) {
          if (diff > 0) {
            // 单格cell, 当 endtime > begintime > 本格最大时间时,将该格状态转移至下一格
            if (cell.endTime > (cell.colIndex + 1) * 1800) {
              cell.next.status = true;
              cell.next.currentPlan = cell.currentPlan;
              cell.next.currentPlanType = cell.currentPlanType;
              cell.next.currentColor = cell.currentColor;
              cell.next.half.ishalf = true;
              cell.next.half.start = null;
              cell.next.half.end = -1;
              // 修正时间
              cell.next.endTime = cell.endTime;
              // 修正 planRange
              this.planRange[this.planRange.length - 1] += 1;
            }
            // diff > 1800
            cell.status = false;
            cell.half.ishalf = false;
            cell.half.start = null;
            cell.currentPlan = null;
            cell.currentPlanType = null;
            cell.currentColor = null;
            // planRange 进一位
            this.planRange[0] += 1;
          } else if (diff < 0) {
            // 记录当前计划段的计划和颜色
            const _currentPlan = cell.currentPlan;
            const _currentColor = cell.currentColor;
            const _currentPlanType = cell.currentPlanType;
            // planRange 退一位
            this.planRange[0] -= 1;
            // 前一格cell
            const _cell = cell.pre;
            // 重置本格的half和上一格的plan相关属性
            cell.half.start = null;
            _cell.status = true;
            _cell.currentPlan = _currentPlan;
            _cell.currentColor = _currentColor;
            _cell.currentPlanType = _currentPlanType;
            // 如果前前一格存在,且为同种计划,则合并两端计划
            const _beforeIndex = this.planRange[0] - 1; // 前前一格index
            const _beforeCell = _cell.pre; // 前前一格
            if (
              _beforeIndex >= 0
              && _beforeCell.status
              && _beforeCell.currentPlan === _currentPlan
              && _beforeCell.currentColor === _currentColor
            ) {
              // 以前一格作为getTimeRange的对象重新获取range,beginTime,endTime
              const [_beginTime, _endTime] = this.getTimeRange(_cell);
              this.beginTime = _beginTime;
              this.endTime = _endTime;
            }
            // 如果前前一格存在,且为不同种计划,且该计划half.end === 1,则抹平前前一格的half.end，同时修正结束时间
            if (
              _beforeIndex >= 0
              && _beforeCell.status
              && _beforeCell.currentPlan !== _currentPlan
              && _beforeCell.currentColor !== _currentColor
              && _beforeCell.half.end === 1
            ) {
              _beforeCell.half.end = null;
              _beforeCell.endTime = (_beforeIndex + 1) * 1800;
            }
          }
        }
      }
      this.isPlanTimeEmit = true;
      this.$emit("input", formatOutput(this.cols));
    },
    endTime(val) {
      // 修改中止时间时,计划段最后的那块cell
      const cell
        = this.cols[this.planRow][this.planRange[this.planRange.length - 1]];
      cell.endTime = val;
      // 初始时间值
      const originVal = (cell.colIndex + 1) * 1800;
      const diff = val - originVal;
      if (diff === 0) {
        // 无偏移
        cell.half.end = null;
      } else {
        cell.half.ishalf = true;
        if (Math.abs(diff) < 1800) {
          // 偏移绝对值小于1800
          if (diff > 0) {
            // 0 < diff < 1800
            cell.half.end = 1;
            // 如果后一格有其他计划段,则清除它
            if (
              cell.next.status
              && cell.next.currentPlan !== cell.currentPlan
            ) {
              cell.next.status = false;
              cell.next.currentPlan = null;
              cell.next.currentPlanType = null;
              cell.next.currentColor = null;
              cell.next.half.ishalf = false;
              cell.next.half.start = null;
              cell.next.half.end = null;
            }
          } else if (diff < 0) {
            // 0 < -diff < 1800
            cell.half.end = -1;
          }
        } else if (Math.abs(diff) >= 1800) {
          // TODO: 覆盖情况
          if (diff > 0) {
            // diff > 1800
            // 记录当前计划段的计划和颜色
            const _currentPlan = cell.currentPlan;
            const _currentColor = cell.currentColor;
            const _currentPlanType = cell.currentPlanType;
            // planRange 进一位
            this.planRange[1] += 1;
            // 后一格cell
            const _cell = cell.next;
            // 重置本格的half和下一格的plan相关属性
            cell.half.end = null;
            _cell.status = true;
            _cell.currentPlan = _currentPlan;
            _cell.currentPlanType = _currentPlanType;
            _cell.currentColor = _currentColor;
            // 如果后后一格存在,且为同种计划,则合并两端计划
            const _afterIndex = this.planRange[1] + 1; // 后后一格index
            const _afterCell = _cell.next; // 后后一格
            if (
              _afterIndex <= 47
              && _afterCell.status
              && _afterCell.currentPlan === _currentPlan
              && _afterCell.currentColor === _currentColor
            ) {
              // 以后一格作为getTimeRange的对象重新获取range,beginTime,endTime
              const [_beginTime, _endTime] = this.getTimeRange(_cell);
              this.beginTime = _beginTime;
              this.endTime = _endTime;
            }
            // 如果后后一格存在,且为不同种计划,且该计划half.start === -1,则抹平后后一格的half.start，同时修正开始时间
            if (
              _afterCell <= 47
              && _afterCell.status
              && _afterCell.currentPlan !== _currentPlan
              && _afterCell.currentColor !== _currentColor
              && _afterCell.half.start === -1
            ) {
              _afterCell.half.start = null;
              _afterCell.beginTime = _afterIndex * 1800;
            }
          } else if (diff < 0) {
            // 单格cell, 当 begintime < endtime < 本格最小时间时,将该格状态转移至上一格
            if (cell.beginTime < cell.colIndex * 1800) {
              cell.pre.status = true;
              cell.pre.currentPlan = cell.currentPlan;
              cell.pre.currentPlanType = cell.currentPlanType;
              cell.pre.currentColor = cell.currentColor;
              cell.pre.half.ishalf = true;
              cell.pre.half.start = 1;
              cell.pre.half.end = null;
              // 修正时间
              cell.pre.beginTime = cell.beginTime;
              // 修正 planRange
              this.planRange[0] -= 1;
            }
            cell.status = false;
            cell.half.ishalf = false;
            cell.half.end = null;
            cell.currentPlan = null;
            cell.currentPlanType = null;
            cell.currentColor = null;
            // planRange 退一位
            this.planRange[1] -= 1;
          }
        }
      }
      this.isPlanTimeEmit = true;
      this.$emit("input", formatOutput(this.cols));
    },
    value: {
      handler(val) {
        this.handleValueChange(val);
      },
      immediate: false
    },
    planType() {
      // 修改时间模式时触发，用于demo书写用，实际开发中基本用不到
      this.rows = this.getRows();
      this.cols = this.getCols();
      this.handleValueChange(this.value);
    },
    btnLabel() {
      // 异步加载btnLabel时会用到
      this.handleValueChange(this.value);
    },
    isNoLabel() {
      this.$nextTick(() => {
        // 因为 no-label导致的缩进，需要重新计算 tableX，tableY
        this.getInitCoordinate();
      });
    }
  },
  created() {
    // eslint-disable-next-line no-debugger
    // debugger;
    this.rows = this.getRows();
    this.cols = this.getCols();
    // 初始进来时不会触发value的watch，需手动调用
    // this.handleValueChange(this.value);
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.getInitCoordinate();
    // });
    // window.addEventListener("scroll", this.getInitCoordinate, false);
    // window.addEventListener("resize", this.getInitCoordinate, false);
    // this.getInitCoordinate();
  },
  updated() {
    !this.isPressed && this.$refs.popover && this.$refs.popover.updatePopper();
  },
  methods: {
    refresh() {
      // 清空后重绘
      this.handleFuncBtn('empty');
      this.handleValueChange(this.value);
      // 模拟更新，向上提交新数据
      this.$emit("input", formatOutput(this.cols));
    },
    addRow() {
      this.rows = this.getRows();
      this.cols = this.getCols();
      this.$emit("input", formatOutput(this.cols));
    },
    // 处理透传下来的功能按钮
    handleFuncBtn(type) {
      // 全周计划
      if (type === "full") {
        // 未选择笔刷或选择了橡皮擦
        if (!this.btnOpts || this.btnOpts.type === "clean") {
          return;
        }
        this.drawCount += 1;
        // 当前颜色
        const _color = this.getColorByLabel(this.currentPlanType);
        this.cols.forEach((row) => {
          row.forEach((cell) => {
            // 状态修正
            cell.status = true;
            // 计划修正
            cell.currentPlan = this.currentPlan;
            cell.currentPlanType = this.currentPlanType;
            cell.currentColor = _color;
            // 偏移修正
            if (cell.half.ishalf) {
              cell.beginTime = cell.colIndex * 1800;
              cell.endTime = (cell.colIndex + 1) * 1800;
              cell.half.start = null;
              cell.half.end = null;
              cell.half.ishalf = false;
            }
            // drawCount 修正
            cell.drawCount = this.drawCount;
          });
        });
        // 当已有全周计划时，直接覆盖vue检测不到对象深层变化，需要强制刷新
        this.$forceUpdate();
      } else if (type === "empty") {
        // 清空
        this.cleanCount += 1;
        this.cols.forEach((row) => {
          row.forEach((cell) => {
            // 状态修正
            cell.status = false;
            // 计划修正
            cell.currentPlan = null;
            cell.currentPlanType = null;
            cell.currentColor = null;
            // 偏移修正
            if (cell.half.ishalf) {
              cell.beginTime = cell.colIndex * 1800;
              cell.endTime = (cell.colIndex + 1) * 1800;
              cell.half.start = null;
              cell.half.end = null;
              cell.half.ishalf = false;
            }
            // cleanCount 修正
            cell.cleanCount = this.cleanCount;
          });
        });
      }
      this.$emit("input", formatOutput(this.cols));
    },
    // cell 外包被选中的样式
    getSelectedStyle_wrapper(col) {
      let _l_border = "1px dashed rgba(186,200,218,0.3)";
      let _r_border = "1px dashed rgba(186,200,218,0.3)";
      // 左上
      let _br_l_t = "0px";
      //  右上
      let _br_r_t = "0px";
      //  右下
      let _br_r_b = "0px";
      //  左下
      let _br_l_b = "0px";
      // 最后一块
      if (col.next) {
        if (!col.next.status || col.next.currentPlan !== col.currentPlan) {
          _r_border = "1px solid #6b7480";
          _br_r_t = "3px";
          _br_r_b = "3px";
        }
      } else {
        _r_border = "1px solid #6b7480";
        _br_r_t = "3px";
        _br_r_b = "3px";
      }

      // 第一块
      if (col.pre) {
        if (!col.pre.status || col.pre.currentPlan !== col.currentPlan) {
          _l_border = "1px solid #6b7480";
          _br_l_t = "3px";
          _br_l_b = "3px";
        }
      } else {
        _l_border = "1px solid #6b7480";
        _br_l_t = "3px";
        _br_l_b = "3px";
      }

      return {
        "border-top": "1px solid #6b7480",
        "border-right": _r_border,
        "border-bottom": "1px solid #6b7480",
        "border-left": _l_border,
        "border-top-left-radius": _br_l_t,
        "border-top-right-radius": _br_r_t,
        "border-bottom-right-radius": _br_r_b,
        "border-bottom-left-radius": _br_l_b,
        width: "11px",
        margin: "0 -1px 0 0"
      };
    },
    // 传入数据根据label名称返回颜色
    getColorByLabel(targetType) {
      let l = this.btnLabel.length;
      if (l) {
        for (let i = 0; i < l; i++) {
          if (this.btnLabel[i].type === targetType) {
            return this.colors[i];
          }
        }
        return this.colors[0];
      }
    },
    // 通过传递的planType获取初始日期行
    getRows() {
      // 时间名称集合
      let timeStrArr = null;
      if (this.isOldVersion) {
        // 老版本
        timeStrArr = this.value.map((row) => {
          return row.name;
        });
      } else if (this.planType === "day") {
        timeStrArr = this.dayLabel;
      } else if (this.planType === "week") {
        timeStrArr = this.weekLabel;
      } else if (this.planType === "holiday") {
        timeStrArr = this.holidayLabel;
      } else if (this.planType === "year") {
        timeStrArr = this.yearLabel;
      } else if (this.planType === "custom") {
        timeStrArr = this.value.map((row) => {
          return row.name;
        });
      }
      return getDateListByPlanType(this.planType, timeStrArr);
    },
    getCols() {
      // 如果没有传入数据
      let _cols = [];
      if (this.rows.length) {
        // 初始数据
        this.rows.forEach((item, rowIndex) => {
          let _row = [];
          for (let i = 0; i < 48; i++) {
            _row.push({
              key: '',
              rowIndex,
              rowName: item,
              colIndex: i,
              status: false,
              beginTime: i * 1800,
              endTime: (i + 1) * 1800,
              half: {
                ishalf: false,
                start: null,
                end: null
              }
            });
            if (i !== 0) {
              _row[i - 1].next = _row[i];
              _row[i].pre = _row[i - 1];
            }
          }
          _cols.push(_row);
        });
      }
      return _cols;
    },
    // 处理上层传下来的value
    handleValueChange(val) {
      if (this.isPlanTimeEmit) {
        this.isPlanTimeEmit = false;
        return;
      }
      if (this.btnLabel.length === 0) {
        return;
      }
      // 如果有传入数据
      if (val.length) {
        try {
          if (!this.isOldVersion) {
            // 根据时间类型修整数据长度
            editLength(val, this.cols.length, this.btnLabel);
          }
          // 处理传入时间的 half 情况
          val.forEach((row, index1) => {
            // 此时格子已经创建，直接将key插在每行第一格的位置
            this.cols[index1][0].key = row.key;
            // debugger;
            row.TimeSpan.forEach((col) => {
              // debugger;
              // 格式化时间转为秒
              const _beginTime = timeToSecond(col.BeginTime);
              const _endTime = timeToSecond(col.EndTime);
              const _color = this.getColorByLabel(col.RecordType);
              const _currentPlan = getPlanByPlanType(
                col.RecordType,
                this.btnLabel
              );
              // 起始cell index
              const beginCell_index = Math.ceil(_beginTime / 1800, 10);
              // 中止cell index
              const endCell_index = Math.floor(_endTime / 1800, 10) - 1;
              // 修改该段时间在 this.cols 上对应的格子
              this.cols[index1].forEach((cell, index3) => {
                // 每一格中的属性中加上所在行的key
                // timeSpan 为空时没法进赋值逻辑
                // cell.key = row.key;
                if (beginCell_index <= endCell_index) {
                  if (index3 >= beginCell_index && index3 <= endCell_index) {
                    cell.status = true;
                    cell.currentPlan = _currentPlan;
                    cell.currentPlanType = col.RecordType;
                    cell.currentColor = _color;
                    // 首次渲染有数据也要算一次drawCount
                    if (this.drawCount === 1) {
                      cell.drawCount = this.drawCount;
                    }
                    // 起始点存在偏移
                    if (
                      index3 === beginCell_index
                      && beginCell_index * 1800 - _beginTime
                    ) {
                      cell.half.ishalf = true;
                      cell.half.start = -1;
                      cell.beginTime = _beginTime;
                      // 修复：一段计划，begin微调右偏移，再次handlevaluechange的时候，样式不正确
                      cell.pre.status = false;
                      cell.pre.currentPlanType = null;
                      cell.pre.currentPlan = null;
                      cell.pre.currentColor = null;
                      cell.pre.half.ishalf = false;
                      cell.pre.half.end = null;
                      cell.pre.half.start = null;
                    }
                    // 中止点存在偏移
                    if (
                      index3 === endCell_index
                      && _endTime - (endCell_index + 1) * 1800
                    ) {
                      cell.half.ishalf = true;
                      cell.half.end = 1;
                      cell.endTime = _endTime;
                    }
                  }
                } else {
                  // 单格时间 beginCell_index > endCell_index, 且两者只差 1 的情况
                  if (beginCell_index - endCell_index === 1) {
                    const dividerTime = beginCell_index * 1800;
                    if (_beginTime < dividerTime && _endTime > dividerTime) {
                      // 状态归前一格管理
                      if (index3 === endCell_index) {
                        cell.status = true;
                        cell.currentPlan = _currentPlan;
                        cell.currentPlanType = col.RecordType;
                        cell.currentColor = _color;
                        cell.half.ishalf = true;
                        cell.half.start = 1;
                        cell.half.end = 1;
                        cell.beginTime = _beginTime;
                        cell.endTime = _endTime;
                        // 首次渲染有数据也要算一次drawCount
                        if (this.drawCount === 1) {
                          cell.drawCount = this.drawCount;
                        }
                      } else if (index3 === beginCell_index) {
                        cell.status = false;
                        cell.currentPlan = null;
                        cell.currentPlanType = null;
                        cell.currentColor = null;
                        cell.half.ishalf = false;
                        cell.half.start = null;
                        cell.half.end = null;
                        cell.beginTime = index3 * 1800;
                        cell.endTime = (index3 + 1) * 1800;
                      }
                    } else if (
                      _beginTime < dividerTime
                      && _endTime <= dividerTime
                    ) {
                      if (index3 === endCell_index) {
                        // debugger;
                        cell.status = true;
                        cell.currentPlan = _currentPlan;
                        cell.currentPlanType = col.RecordType;
                        cell.currentColor = _color;
                        cell.half.ishalf = true;
                        cell.half.start = 1;
                        cell.half.end = -1;
                        // 修正
                        if (_endTime === dividerTime) {
                          cell.half.ishalf = false;
                          cell.half.start = null;
                          cell.half.end = null;
                        }
                        cell.beginTime = _beginTime;
                        cell.endTime = _endTime;
                      }
                    } else if (
                      _beginTime >= dividerTime
                      && _endTime > dividerTime
                    ) {
                      if (index3 === beginCell_index) {
                        cell.status = true;
                        cell.currentPlan = _currentPlan;
                        cell.currentPlanType = col.RecordType;
                        cell.currentColor = _color;
                        cell.half.ishalf = true;
                        cell.half.start = _beginTime === dividerTime ? null : 1;
                        cell.half.end = -1;
                        cell.beginTime = _beginTime;
                        cell.endTime = _endTime;
                      }
                    }
                  } else if (beginCell_index - endCell_index === 2) {
                    // 前后都缩进，状态归本格管
                    if (index3 === beginCell_index - 1) {
                      cell.status = true;
                      cell.currentPlan = _currentPlan;
                      cell.currentPlanType = col.RecordType;
                      cell.currentColor = _color;
                      cell.half.ishalf = true;
                      cell.half.start = 1;
                      cell.half.end = -1;
                      cell.beginTime = _beginTime;
                      cell.endTime = _endTime;
                    }
                  }
                }
              });
            });
          });
          this.drawCount += 1;
        } catch (err) {
          console.error(
            `[ERROR-5] Failed to initialize data, please check the format of the prop "value".`
          );
        }
      } else {
        // 如果为空，则清空
        this.handleFuncBtn('empty');
      }
    },
    // cell 内容被选中的样式
    getSelectedStyle_container(col) {
      const { ishalf, start, end } = col.half;
      let _width = "12px";
      let _left = "0px";
      let _borderRight = false;
      let _borderLeft = false;
      // 左上
      let _br_l_t = "0px";
      //  右上
      let _br_r_t = "0px";
      //  右下
      let _br_r_b = "0px";
      //  左下
      let _br_l_b = "0px";
      // 最后一块
      if (col.next) {
        if (!col.next.status || col.next.currentPlan !== col.currentPlan) {
          _br_r_t = "3px";
          _br_r_b = "3px";
        }
      } else {
        _br_r_t = "3px";
        _br_r_b = "3px";
      }

      // 第一块
      if (col.pre) {
        if (!col.pre.status || col.pre.currentPlan !== col.currentPlan) {
          _br_l_t = "3px";
          _br_l_b = "3px";
        }
      } else {
        _br_l_t = "3px";
        _br_l_b = "3px";
      }

      if (!ishalf) {
        _width = "12px";
        _left = "0px";
      } else {
        if (start === -1 && end === 1) {
          _width = "20px";
          _left = "-4px";
          _borderRight = true;
          _borderLeft = true;
        } else if (start === 1 && end === -1) {
          _width = "4px";
          _left = "4px";
          _borderRight = true;
          _borderLeft = true;
        } else if (!start && end === -1) {
          _width = "8px";
          _left = "0px";
          _borderRight = true;
          _borderLeft = false;
        } else if (start === 1 && !end) {
          _width = "8px";
          _left = "4px";
          _borderRight = false;
          _borderLeft = true;
        } else if (!start && end === 1) {
          _width = "16px";
          _left = "0px";
          _borderRight = true;
          _borderLeft = false;
        } else if (start === -1 && !end) {
          _width = "16px";
          _left = "-4px";
          _borderRight = false;
          _borderLeft = true;
        } else if (start === -1 && end === -1) {
          _width = "12px";
          _left = "-4px";
          _borderRight = true;
          _borderLeft = true;
        } else if (start === 1 && end === 1) {
          _width = "12px";
          _left = "4px";
          _borderRight = true;
          _borderLeft = true;
        }
      }

      return {
        background: col.currentColor ? col.currentColor : "#ffffff",
        width: _width,
        left: _left,
        top: "0px",
        "border-top": "1px solid #6b7480",
        "border-bottom": "1px solid #6b7480",
        "border-right": _borderRight ? "1px solid #6b7480" : "unset",
        "border-left": _borderLeft ? "1px solid #6b7480" : "unset",
        "border-top-left-radius": _br_l_t,
        "border-top-right-radius": _br_r_t,
        "border-bottom-right-radius": _br_r_b,
        "border-bottom-left-radius": _br_l_b
      };
    },
    // 初始坐标距离计算
    getInitCoordinate() {
      // TODO: 解决一些因图片加载可能导致的初始坐标计算错误
      this.tableX = this.$refs.planTable.getBoundingClientRect().left;
      this.tableY = this.$refs.planTable.getBoundingClientRect().top;
    },
    handleMouseDown(e) {
      // 既不是绘制模式,也不是擦除模式
      if (!this.brushColor && !this.isClean) {
        return;
      }
      // 判断是否有limit限制，有的话先判断是否达到限制
      // 这个判断逻辑放到了绘画完成后去做判断，与hcp逻辑保持一致
      // if (this.limit && this.judgeIsLimited()) {
      //   return;
      // }
      this.beforeDrag(e.clientX, e.clientY);
      document.addEventListener("mousemove", this.draging);
    },
    judgeIsLimited() {
      let rowIndex = this.hoverRow;
      let colIndex = this.hoverCol;
      // 绘制模式
      if (this.brushColor && this.getRowRangeCount(rowIndex) >= this.limit) {
        return true;
      }
      // 擦除模式
      if (this.isClean && this.getRowRangeCount(rowIndex) >= this.limit) {
        // 橡皮擦点下去的那个格子
        let _cell = this.cols[rowIndex][colIndex];
        // 如果橡皮擦落点在某一计划段中部，且此时改行计划数量已达限制，则阻止这次行为，因为这会导致计划段增多
        // 整行的头尾可以擦除，不用做判断
        if (_cell.status && _cell.pre && _cell.next) {
          let _currentPlan = _cell.currentPlan;
          if (_cell.next.status && _cell.next.currentPlan === _currentPlan && _cell.pre.status && _cell.pre.currentPlan === _currentPlan) {
            if (_cell.next.half.start === 1 || _cell.pre.half.end === -1) {
              return false;
            }
            return true;
          }
        }
      }
      return false;
    },
    beforeDrag(x, y) {
      // 设置起点
      this.startX = x;
      this.startY = y;
      // 初始状态，终点即起点
      this.endX = x;
      this.endY = y;

      // 此时再获取坐标，解决一些因window scroll和resize可能带来的坐标偏差问题
      this.getInitCoordinate();
      this.isPressed = true;
      // 起始点对应的cell
      let startCellX = parseInt((this.startX - this.tableX) / this.cellW, 10);
      let startCellY = parseInt((this.startY - this.tableY) / this.cellH, 10);
      // 起始点坐标
      this.startCell = [startCellX, startCellY];
      // 起始格
      const _startCell = this.cols[startCellY][startCellX];
      // console.log(`进入了第${_startCell.rowIndex}行第${_startCell.colIndex}列`);
      this.handleEnterCell(_startCell);
      this.endCell = [startCellX, startCellY];
      this.lastEndCell = [null, null];
    },
    // 拖拽刷新频率为60hz
    draging: throttle(function (e) {
      this.isPressed = true;
      if (this.endX && this.endY) {
        // 记录上一次拖动的点位
        this.lastEndX = this.endX;
        this.lastEndY = this.endY;
      }

      // 本次拖动的点位
      this.endX = e.clientX;
      this.endY = e.clientY;

      // 上一次拖动中止点对应的cell
      if (this.endCell.length) {
        this.lastEndCell = this.endCell;
      }
      // 中止点对应的cell
      let endCellX = parseInt((this.endX - this.tableX) / this.cellW, 10);
      let endCellY = parseInt((this.endY - this.tableY) / this.cellH, 10);
      this.endCell = [endCellX, endCellY];

      // 中止点发生改变才执行draw
      if (
        this.lastEndCell[0] !== this.endCell[0]
        || this.lastEndCell[1] !== this.endCell[1]
      ) {
        this.draw();
      }
    }, 16),
    // 绘制网格
    draw() {
      // TODO: 优化框选逻辑

      // x 轴开始index
      const _startX = Math.min(this.startCell[0], this.endCell[0]);
      // x 轴终止index
      const _endX = Math.max(this.startCell[0], this.endCell[0]);
      // y 轴开始index
      const _startY = Math.min(this.startCell[1], this.endCell[1]);
      // y 轴终止index
      const _endY = Math.max(this.startCell[1], this.endCell[1]);

      // 上一次操作的四个点位
      // x 轴开始index
      const _lastStartX = Math.min(this.startCell[0], this.lastEndCell[0]);
      // x 轴终止index
      const _lastEndX = Math.max(this.startCell[0], this.lastEndCell[0]);
      // y 轴开始index
      const _lastStartY = Math.min(this.startCell[1], this.lastEndCell[1]);
      // y 轴终止index
      const _lastEndY = Math.max(this.startCell[1], this.lastEndCell[1]);

      // 判断选择框x轴是否存缩小
      if (_lastStartX < _startX || _lastEndX > _endX) {
        // 处理缩小区域
        this.cols.forEach((item1, index1) => {
          if (index1 >= _lastStartY && index1 <= _lastEndY) {
            item1.forEach((item2, index2) => {
              if (
                (index2 >= _lastStartX && index2 < _startX)
                || (index2 > _endX && index2 <= _lastEndX)
              ) {
                // console.log(`离开了第${item2.rowIndex}行第${item2.colIndex}列`);
                this.handleLeaveCell(item2);
              }
            });
          }
        });
      }
      if (_lastStartY < _startY || _lastEndY > _endY) {
        // 判断选择框y轴是否存缩小
        this.cols.forEach((item1, index1) => {
          if (
            (index1 >= _lastStartY && index1 < _startY)
            || (index1 > _endY && index1 <= _lastEndY)
          ) {
            item1.forEach((item2, index2) => {
              if (index2 >= _lastStartX && index2 <= _lastEndX) {
                // console.log(`离开了第${item2.rowIndex}行第${item2.colIndex}列`);
                this.handleLeaveCell(item2);
              }
            });
          }
        });
      }
      if (_lastStartX > _startX || _lastEndX < _endX) {
        // 判断选择框x轴是否存在放大
        // 处理放大区域
        this.cols.forEach((item1, index1) => {
          if (index1 >= _startY && index1 <= _endY) {
            item1.forEach((item2, index2) => {
              if (
                (index2 >= _startX && index2 < _lastStartX)
                || (index2 > _lastEndX && index2 <= _endX)
              ) {
                // console.log(`进入了第${item2.rowIndex}行第${item2.colIndex}列`);
                this.handleEnterCell(item2);
              }
            });
          }
        });
      }
      if (_lastStartY > _startY || _lastEndY < _endY) {
        // 判断选择框y轴是否存在放大
        // 处理放大区域
        this.cols.forEach((item1, index1) => {
          if (
            (index1 >= _startY && index1 < _lastStartY)
            || (index1 > _lastEndY && index1 <= _endY)
          ) {
            item1.forEach((item2, index2) => {
              if (index2 >= _startX && index2 <= _endX) {
                // console.log(`进入了第${item2.rowIndex}行第${item2.colIndex}列`);
                this.handleEnterCell(item2);
              }
            });
          }
        });
      }
    },
    // 处理选择框缩小,离开之前选中cell时的情况
    handleLeaveCell(cell) {
      // // 已经离开过的cell不重复leave
      // if(!cell.status) {
      //   return;
      // }
      // 恢复历史 half 记录
      if (
        cell.lastHalf
        && cell.lastHalf.ishalf
        && cell.lastBeginTime
        && cell.lastEndTime
      ) {
        cell.half = cell.lastHalf;
        cell.beginTime = cell.lastBeginTime;
        cell.endTime = cell.lastEndTime;
      }

      // 清除模式下,本次擦除,存在记录plan,则需要恢复被选中的状态
      if (
        this.isClean
        && cell.cleanCount === this.cleanCount
        && cell.lastPlan
        && cell.lastColor
      ) {
        cell.status = true;
        cell.currentColor = cell.lastColor;
        cell.currentPlan = cell.lastPlan;
        cell.currentPlanType = cell.lastPlanType;
        return;
      }
      // 非本次绘制时选中的cell,不取消选中状态
      if (cell.drawCount !== this.drawCount) {
        return;
      }
      // 之前没有填充过计划,则清除为空
      if (!cell.lastPlan || !cell.lastColor) {
        cell.status = false;
        cell.currentPlan = null;
        cell.currentPlanType = null;
        cell.currentColor = null;
      } else {
        // 先绘制一种颜色,再绘制另一种覆盖后缩小
        cell.status = true;
        cell.currentPlan = cell.lastPlan;
        cell.currentPlanType = cell.lastPlanType;
        cell.currentColor = cell.lastColor;
      }
    },
    // 处理选择框变大,进入新cell的情况
    handleEnterCell(cell) {
      if (cell.half.ishalf) {
        // 浅克隆记录half状态,以便在选择框resize事件时恢复状态(只应克隆一次)
        cell.lastHalf = { ...cell.half };
        // 如果存在half，则需记录cell的起始时间，在resize时除了修正half，还要修正起始时间
        cell.lastBeginTime = cell.beginTime;
        cell.lastEndTime = cell.endTime;
      }

      // 擦除模式
      if (this.isClean) {
        if (cell.status) {
          cell.cleanCount = this.cleanCount;
          cell.status = false;
        }
        // 以防首次绘制该格cell时还没有last记录
        if (cell.currentPlan) {
          cell.lastPlan = cell.currentPlan;
          cell.lastPlanType = cell.currentPlanType;
        }
        if (cell.currentColor) {
          cell.lastColor = cell.currentColor;
        }
        // 擦除时偏移情况恢复至默认
        if (cell.half.ishalf) {
          cell.half.ishalf = false;
          cell.half.start = null;
          cell.half.end = null;
          // 时间修正
          cell.beginTime = cell.colIndex * 1800;
          cell.endTime = (cell.colIndex + 1) * 1800;
        }

        cell.currentPlan = null;
        cell.currentPlanType = null;
        cell.currentColor = null;
        return;
      }

      // 绘制模式

      // TODO: cell 如果存在左突出或者右突出,则在覆盖绘制时保留这一突出(凹陷覆盖)
      if (cell.half.ishalf) {
        if (cell.half.start === -1) {
          // 左突出
          cell.half.ishalf = true;
          cell.half.start = -1;
          cell.half.end = null;
          // 时间修正
          cell.endTime = (cell.colIndex + 1) * 1800;
          // 如果左边存在计划，则修正 half.start
          if (cell.pre.status) {
            cell.half.start = null;
            // 由于start和end均已修正，ishalf也要跟着修正
            cell.half.ishalf = false;
            // 时间修正
            cell.beginTime = cell.colIndex * 1800;
          }
        } else if (cell.half.end === 1) {
          // 右突出
          cell.half.ishalf = true;
          cell.half.start = null;
          cell.half.end = 1;
          // 时间修正
          cell.beginTime = cell.colIndex * 1800;
          // 如果右边存在计划，则修正 half.end
          if (cell.next.status) {
            cell.half.end = null;
            // 由于start和end均已修正，ishalf也要跟着修正
            cell.half.ishalf = false;
            // 时间修正
            cell.endTime = (cell.colIndex + 1) * 1800;
          }
        } else {
          // 时间修正
          cell.beginTime = cell.colIndex * 1800;
          cell.endTime = (cell.colIndex + 1) * 1800;
          // 无突出或凹陷直接覆盖
          cell.half.ishalf = false;
          cell.half.start = null;
          cell.half.end = null;
        }
      }
      // 如果之前已绘制该plan的cell,则取消绘制
      if (cell.currentPlan === this.currentPlan) {
        return;
      }
      // 首次绘制
      if (!cell.drawCount) {
        // 给本次绘制的cell标记次序
        cell.drawCount = this.drawCount;
      } else {
        // 非首次绘制
        // 如果该cell之前存在计划,则在覆盖之前记录之前的计划
        if (cell.currentPlan && cell.drawCount !== this.drawCount) {
          cell.lastPlan = cell.currentPlan;
          cell.lastPlanType = cell.currentPlanType;
        }
        if (cell.currentColor && cell.drawCount !== this.drawCount) {
          cell.lastColor = cell.currentColor;
        }
        cell.drawCount = this.drawCount;
      }
      // 解决先绘制,再擦,再绘制缩小,会把擦掉的last记录恢复的bug
      if (!cell.currentPlan && !cell.currentColor) {
        cell.lastPlan = null;
        cell.lastPlanType = null;
        cell.lastColor = null;
      }
      cell.status = true;
      cell.currentPlan = this.currentPlan || null;
      // this.currentPlanType 可能为 0
      cell.currentPlanType
        = this.currentPlanType === 0
          ? this.currentPlanType
          : this.currentPlanType || null;
      cell.currentColor = this.brushColor || null;
    },
    endDrag() {
      // 判断这次绘制/擦除后涉及的行是否超出limit，若超出，还原这行
      if (this.limit) {
        this.judgeRowLimitIsValid();
      }
      // 将相关坐标清除
      this.isPressed = false;
      this.startX = null;
      this.startY = null;
      this.endX = null;
      this.endY = null;
      this.lastEndX = null;
      this.lastEndY = null;
      this.startCell.length = 0;
      this.endCell.length = 0;
      this.lastEndCell.length = 0;
      // 非清除模式累加 drawCount
      if (!this.isClean) {
        this.drawCount++;
      } else {
        // 清除模式累加 cleanCount
        this.cleanCount++;
      }
      this.$emit("input", formatOutput(this.cols));
      // this.$emit("input", [...this.cols]);
      document.removeEventListener("mousemove", this.draging);
    },
    // 判断这次绘制/擦除后涉及的行是否超出limit，若超出，还原这行
    judgeRowLimitIsValid() {
      let x_start = Math.min(this.startCell[0], this.endCell[0]);
      let x_end = Math.max(this.startCell[0], this.endCell[0]);
      let y_start = Math.min(this.startCell[1], this.endCell[1]);
      let y_end = Math.max(this.startCell[1], this.endCell[1]);
      for (let i = y_start; i <= y_end; i++) {
        if (this.getRowRangeCount(i) > this.limit) {
          // 若超出，还原该行x_start 到 x_end项 handleLeaveCell
          for (let j = x_start; j <= x_end; j++) {
            this.handleLeaveCell(this.cols[i][j]);
          }
        }
      }
    },
    // 网格区 mouseup
    handleMouseUp() {
      if (this.isPressed) {
        // 结束格
        let _cell = this.cols[this.endCell[1]][this.endCell[0]];
        // 鼠标抬起时，当前格左右两边突出的部分都要抹去(鼠标抬起时再做处理？)
        if (_cell.pre && _cell.pre.half.end === 1) {
          _cell.pre.half.end = null;
          // 时间修正
          _cell.pre.endTime = _cell.colIndex * 1800;
          if (!_cell.pre.half.start) {
            // 如果抹去一边的同时另一边half情况本来就是null,则将ishalf置于false
            _cell.pre.half.ishalf = false;
          }
        }
        if (_cell.next && _cell.next.half.start === -1) {
          _cell.next.half.start = null;
          // 时间修正
          _cell.next.beginTime = (_cell.colIndex + 1) * 1800;
          if (!_cell.next.half.end) {
            // 如果抹去一边的同时另一边half情况本来就是null,则将ishalf置于false
            _cell.next.half.ishalf = false;
          }
        }
        this.endDrag();
      }
    },
    // 网格区 mouseleave
    handleMouseLeaveTable() {
      if (this.isPressed) {
        this.endDrag();
      }
    },
    // 单个cell mouseenter
    handleMouseEnter(e, col) {
      this.hoverRow = col.rowIndex;
      this.hoverCol = col.colIndex;
      // 弹窗显示时禁用hoverRow
      if (!this.showCopyBox) {
        this.hoverToolRow = this.hoverRow;
      }
      if (this.isPressed) {
        return;
      }
      if (col.status) {
        this.cellTimeOut = setTimeout(() => {
          const [_beginTime, _endTime] = this.getTimeRange(col);
          this.beginTime = _beginTime;
          this.endTime = _endTime;
          this.showTime = true;
        }, 500);
      }
    },
    // 单个cell mouseleave
    handleMouseLeaveCell() {
      if (this.isPressed) {
        return;
      }
      if (this.cellTimeOut) {
        clearTimeout(this.cellTimeOut);
      }
      this.showTime = false;
    },
    // plan-time mouseenter
    handleEnterTimeBox() {
      // 鼠标悬于popover时不隐藏popover
      this.showTime = true;
    },
    // plan-time mouseDown
    handleMouseDownTimeBox(e) {
      // 阻止冒泡
      stopPropagation(e);
    },
    // 获取鼠标悬停段的时间范畴
    getTimeRange(cell) {
      // TODO:若只是在同行同一段区间,且该段区间没有增加修改,取消运算
      // if (
      //   this.hoverRow === this.planRow &&
      //   this.hoverCol >= this.planRange[0] &&
      //   this.hoverCol <= this.planRange[1]
      // ) {
      //   return [this.beginTime, this.endTime];
      // }
      let _plan = cell.currentPlan; // 当前 cell 的 plan
      let _row = this.cols[cell.rowIndex]; // 当前 cell 所在行
      let _col = cell.colIndex; // 当前 cell 列 index
      let min = _col;
      let max = _col;
      // eslint-disable-next-line no-debugger
      // debugger;
      // 左边界
      for (min; min >= 0; --min) {
        // 计划改变或者某格左侧向内缩进(或某格前一格右侧向内缩进)，该段结束
        if (_row[min].currentPlan !== _plan) {
          break;
        }
        if (_row[min].half.start === 1) {
          min--;
          break;
        }
        if (_row[min].pre && _row[min].pre.half.end === -1) {
          min--;
          break;
        }
      }
      // 右边界
      for (max; max <= 47; ++max) {
        // 计划改变或者某格右侧向内缩进(或某格后一格左侧向内缩进)，该段结束
        if (_row[max].currentPlan !== _plan) {
          break;
        }
        if (_row[max].half.end === -1) {
          max++;
          break;
        }
        if (_row[max].next && _row[max].next.half.start === 1) {
          max++;
          break;
        }
      }
      // 性能优化
      this.planRange = [min + 1, max - 1];
      this.planRow = cell.rowIndex;
      // 返回左边界的beginTime,右边界的endTime
      return [_row[min + 1].beginTime, _row[max - 1].endTime];
    },
    // 计算一行中已有几段计划
    getRowRangeCount(rowIndex) {
      let count = 0;
      let endIndex = 0;
      // 当前行的状态
      let _row = this.cols[rowIndex];
      // 先找到一个有状态的格子, endIndex 指针指向数组最后一位时停止
      while (endIndex < _row.length) {
        let _cell = _row[endIndex];
        // 找到一个有状态的格子后寻找他的右边界index,找到后退出遍历, 下一次while遍历从找到的右边界继续搜索
        if (_cell.status) {
          count++;
          endIndex = _cell.colIndex;
          let _plan = _cell.currentPlan;
          // 右边界
          for (endIndex; endIndex <= 47; ++endIndex) {
            // 计划改变或者某格右侧向内缩进(或某格后一格左侧向内缩进)，该段结束
            if (_row[endIndex].currentPlan !== _plan) {
              // endIndex++;
              break;
            }
            if (_row[endIndex].half.end === -1) {
              endIndex++;
              break;
            }
            if (_row[endIndex].next && _row[endIndex].next.half.start === 1) {
              endIndex++;
              break;
            }
          }
          endIndex--;
        }
        endIndex++;
      }
      return count;
    },
    // 处理鼠标进入toolbox
    handleMouseEnterToolBox(index) {
      if (!this.showCopyBox) {
        this.hoverToolRow = index;
      }
    },
    // 全选
    handleCheckAllChange(value) {
      let checkList = [];
      this.rows.forEach((item, index) => {
        if (index !== this.hoverToolRow) {
          checkList.push(index);
        }
      });
      this.copyList = value ? checkList : [];
      this.isIndeterminate = false;
    },
    // 监听多选数组
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.rows.length;
      this.isIndeterminate
        = checkedCount > 0 && checkedCount < this.rows.length;
    },
    // 处理点击复制行按钮
    handleCopyBtn() {
      if (this.showCopyBox) {
        return;
      }
      // 打开复制弹框前要先清除所有选择的日期
      this.checkAll = false;
      this.isIndeterminate = false;
      this.copyList = [];
      this.showCopyBox = true;
    },
    // 关闭复制弹窗
    closeCopyBox() {
      this.showCopyBox = false;
    },
    // 复制弹窗点击确定，确认复制
    handleCopy() {
      this.showCopyBox = false;
      // 该行的数据
      const originData = this.cols[this.hoverToolRow];
      if (this.copyList.length) {
        this.copyList.forEach((item1, index1) => {
          // 修改 rowIndex，rowName属性值，其余单元格状态做一层克隆即可
          this.cols[item1] = originData.map((item2) => {
            return {
              ...item2,
              rowIndex: index1,
              rowName: this.rows[index1]
            };
          });
        });
        // 回传v-model
        this.$emit("input", formatOutput(this.cols));
        // this.$emit("input", [...this.cols]);
      }
    }
  }
};
</script>

<style lang="less" scoped>
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
  width: 577px;
  border-top: 0px;
  border-bottom: 0px;
  border-left: 0px;
  position: relative;
}

.plan-select-box {
  position: absolute;
  border: 1px dashed #ffffff;
  /* background: rosybrown; */
  width: 0px;
  height: 0px;
  z-index: 5;
  display: none;
}

.plan-clean-box {
  border: 1px dashed #999999;
}

.plan-time-table-row {
  display: flex;
  height: 28px;
  border-bottom: 0px;
  text-align: center;
  line-height: 28px;
  position: relative;
  z-index: 1;
}

.plan-time-table-col {
  width: 12px;
  height: 27px;
  position: relative;
  /* margin: 0px 0 0 -1px; */
}

.plan-time-table-col-container {
  width: 100%;
  height: 29px;
  position: absolute;
  z-index: -1;
  margin: -1px 0 0px 0;
  box-sizing: border-box;
}

.time-box {
  position: absolute;
  background: #ffffff;
  padding: 4px 8px;
  border: 1px solid rgb(204, 204, 204);
  z-index: 20;
}

.time-arrow {
  position: absolute;
  top: 38px;
  left: 100px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #ffffff;
  z-index: 21;
}

.plan-popover-time {
  display: flex;
  align-items: center;
}

.plan-popover-divider {
  width: 8px;
  height: 1px;
  margin: 0 8px;
  background-color: #999;
}

.plan-tool-box {
  width: 48px;
  position: relative;
}

.tool-area {
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.plan-tool-icon:hover {
  cursor: pointer;
  background: #eeeeee;
}

.tool-copy-box {
  width: 280px;
  height: 200px;
  border-radius: 2px;
  position: absolute;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0 0 5px #cccccc;
  color: #999999;
  z-index: 99;
  box-sizing: border-box;
}

.copy-box-title {
  padding-bottom: 8px;
  border-bottom: 1px solid #cccccc;
  line-height: 16px;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.copy-box-check-btn {
  display: flex;
  justify-content: flex-end;
}

.copy-box-content {
  margin-top: 8px;
}

.copy-btn {
  color: #000000;
  margin-right: 10px;
}

.copy-btn:hover {
  cursor: pointer;
  text-decoration: underline;
}

.box-arrow {
  position: absolute;
  width: 0px;
  height: 0px;
  top: 86px;
  right: -4px;
  border: 4px solid #ffffff;
  box-shadow: 1px 1px 1px #cccccc;
  transform: rotate(-45deg);
}

/deep/.el-checkbox__label {
  width: 80px;
}
</style>