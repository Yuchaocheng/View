/**
* @author chenzixin7(chenzixin7@hikvision.com.cn)
* @desc 整个组件的上中下拆分，其中中间部分的 hover 区域是浮于组件上层的，透明的可操作的部分，其中的业务部分提炼至组件 plan-wrap
*/
<template>
  <div :style="planWrapperStyle">
    <!-- 笔刷按钮 -->
    <plan-header
      :plan-mode="zPlanMode"
      v-model="btnOpts"
      :btn-label="btnLabel"
      :slot-btn-label="slotBtnLabel"
      :colors="colors"
      :btn-icon="btnIcon"
      :support-week-plan="supportWeekPlan"
      :support-empty="supportEmpty"
      :day-label="dayLabel"
      :plan-type="zPlanType"
      :btn-width="btnWidth"
      @func="handleFuncBtnClick"
    ></plan-header>
    <div class="plan-wrapper">
      <!-- 顶部刻度 -->
      <div class="plan-wrapper-top" :style="scaleLeftStyle">
        <img :src="imgUrl.topScale">
      </div>
      <div class="plan-wrapper-middle">
        <!-- 日期列表 -->
        <div class="plan-date-content" :style="planContentStyle">
          <div
            class="plan-date-list"
            v-for="(date, index) in dateList"
            :title="date"
            :key="index"
          >
            {{ date }}
          </div>
        </div>
        <!-- 网格区域 -->
        <canvas
          :width="canvasWidth"
          :height="canvasHeight"
          :ref="canvasId"
          class="plan-grid-canvas"
        ></canvas>

        <!-- 工具菜单(行复制) -->
        <div
          class="plan-tool-bar"
          v-if="isSupportCopyTool"
          :style="`height:${canvasHeight + 'px'}`"
        ></div>

        <!-- hover 区域, 真正做操作的区域 -->
        <div class="plan-hover-content">
          <!-- hcp需求 -->
          <hcp-plan
            ref="hcp"
            :plan-mode="zPlanMode"
            :btn-opts="btnOpts"
            :plan-type="zPlanType"
            v-model="planData"
            :show-tool="showTool"
            :is-no-label="isNoTimeLabel"
            :is-old-version="isOldVersion"
            :day-label="dayLabel"
            :week-label="weekLabel"
            :year-label="yearLabel"
            :holiday-label="holidayLabel"
            :colors="colors"
            :btn-label="btnLabel"
            :slot-btn-label="slotBtnLabel"
            :limit="limit"
            :tiny="tiny"
          >
            <template #range="{range}">
              <slot name="range" :range="range"></slot>
            </template>
          </hcp-plan>
        </div>
      </div>
      <!-- 底部刻度 -->
      <div class="plan-wrapper-bottom" :style="scaleLeftStyle">
        <img :src="imgUrl.bottomScale">
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 基础宽度
 */
const DRAWELEM = {
  CELLH: 28, //单元格高度
  CELLW: 12, //单元格宽度
  TEMPW: 577,
  CELLTIME: 30, //每个单元格30分钟
  PANNELBACKGROUND: "#ECF3FB", //模板背景色
  LINESTYLE: "#BAC8DA", //线条颜色
  LINECENTERSTYLE: "#80A9DE", //线条中轴颜色
  POPWIDTH: 350 //pop框宽度
};
const topScale = require("./assets/top.png");
const bottomScale = require("./assets/bottom.png");
const Icon01 = require("./assets/brush_blue.svg");
const Icon02 = require("./assets/brush_orange.svg");
const Icon03 = require("./assets/brush_green.svg");
const Icon04 = require("./assets/brush_yellow.svg");
const Icon05 = require("./assets/brush_red.svg");
const Icon06 = require("./assets/brush_purple.svg");
const Icon07 = require("./assets/brush_lightblue.svg");
const Icon08 = require("./assets/brush_pink.svg");
import hcpPlan from "./hcp/hcpPlan";
import planHeader from "./planHeader/plan-header";
import {
  getDateListByPlanType,
  getType,
  logTypeError,
  logValueError,
  logColorFormatError,
  logTypeErrorInObject
} from "./utils";
import Vue from "vue";
import I18n from '@/Common/static/i18n/index';
export default {
  name: "TimePlan",
  components: {
    hcpPlan,
    planHeader
  },
  props: {
    // Invalid prop: custom validator check failed for prop "planMode"
    planMode: {
      type: String,
      default: "edit"
    },
    planType: {
      type: String,
      default: "week"
    },
    value: {
      type: Array,
      default: () => []
    },
    showTool: {
      type: Boolean,
      default: false
    },
    colors: {
      type: Array,
      default: () => ["#597EF7", "#FF7A45", "#16b89b", "#36CFC9", "#C678DD"]
    },
    btnLabel: {
      type: Array,
      default: () => [
        { type: 0, name: I18n.t('plan1') },
        { type: 1, name: I18n.t('plan2') },
        { type: 2, name: I18n.t('plan3') },
        { type: 3, name: I18n.t('plan4') },
        { type: 4, name: I18n.t('plan5') }
      ]
    },
    btnWidth: {
      type: Number,
      default: 90
    },
    slotBtnLabel: {
      type: Array,
      default: () => []
    },
    btnIcon: {
      type: Array,
      default: () => [
        Icon01,
        Icon02,
        Icon03,
        Icon04,
        Icon05,
        Icon06,
        Icon07,
        Icon08
      ]
    },
    dayLabel: {
      type: String,
      default: ""
    },
    weekLabel: {
      type: Array,
      default: () => [
        I18n.t('Sunday'),
        I18n.t('Monday'),
        I18n.t('Tuesday'),
        I18n.t('Wednesday'),
        I18n.t('Thursday'),
        I18n.t('Friday'),
        I18n.t('Saturday')
      ]
    },
    holidayLabel: {
      type: Array,
      default: () => [
        I18n.t('Sunday'),
        I18n.t('Monday'),
        I18n.t('Tuesday'),
        I18n.t('Wednesday'),
        I18n.t('Thursday'),
        I18n.t('Friday'),
        I18n.t('Saturday'),
        I18n.t('holiday')
      ]
    },
    yearLabel: {
      type: Array,
      default: () => {
        return [
          I18n.t('Jan'),
          I18n.t('Feb'),
          I18n.t('Mar'),
          I18n.t('Apr'),
          I18n.t('May'),
          I18n.t('Jun'),
          I18n.t('Jul'),
          I18n.t('Aug'),
          I18n.t('Sep'),
          I18n.t('Oct'),
          I18n.t('Nov'),
          I18n.t('Dec')
        ];
      }
    },
    timePlanSetting: {
      type: Object,
      default: null
    },
    supportWeekPlan: {
      type: Boolean,
      default: false
    },
    supportEmpty: {
      type: Boolean,
      default: false
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
      imgUrl: {
        topScale,
        bottomScale
      },
      canvasId: `attMuti-canvas${ new Date().getTime()}`,
      canvasWidth: DRAWELEM.TEMPW,
      ctx: null, // canvas 对象
      btnOpts: null, // 当前选中按钮
      customOpts: {}, //自定义配置项
      oldVersionDate: [] // 旧版本数据，旧版本不支持双向绑定
    };
  },
  computed: {
    // 判断是否为旧版本
    isOldVersion() {
      return Boolean(this.timePlanSetting);
    },
    // 整合旧版本后的 planMode
    zPlanMode() {
      return this.isOldVersion ? this.timePlanSetting.model : this.planMode;
    },
    // 整合旧版本后的 colors
    zColors() {
      return this.isOldVersion
        ? [
          "#2196f3",
          "#ff9466",
          "#15b89b",
          "#f6bd16",
          "#e86452",
          "#945fb9",
          "#6dc8ec",
          "#FF99c3"
        ]
        : this.colors;
    },
    // 整合旧版本后的 planType
    zPlanType() {
      return this.isOldVersion ? "custom" : this.planType;
    },
    // 整合旧版本后的 btnLabel
    zBtnLabel() {
      return this.isOldVersion ? this.timePlanSetting.button : this.btnLabel;
    },
    // 组件整体样式（宽度）
    planWrapperStyle() {
      let _width = this.isSupportCopyTool ? 724 : 676;
      _width = this.isNoTimeLabel ? _width - 99 : _width;
      return {
        width: `${_width }px`
      };
    },
    // 顶部底部刻度左侧偏移量
    scaleLeftStyle() {
      return {
        "margin-left": this.isNoTimeLabel ? "0px" : "99px"
      };
    },
    // 计算canvas高度
    canvasHeight() {
      return DRAWELEM.CELLH * parseInt(this.dateList.length, 10) + 1;
    },
    planContentStyle() {
      return {
        width: this.isNoTimeLabel ? "0px" : "99px",
        height: `${this.dateList.length * DRAWELEM.CELLH }px`
      };
    },
    dateList() {
      // 时间名称集合
      let timeStrArr = null;
      if (this.isOldVersion) {
        // 老版本
        timeStrArr = this.oldVersionDate.map((row) => {
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
      return getDateListByPlanType(this.zPlanType, timeStrArr);
    },
    planData: {
      get() {
        // 整合旧版本
        return this.isOldVersion ? this.oldVersionDate : this.value;
      },
      set(val) {
        if (this.isOldVersion) {
          this.oldVersionDate = val;
        } else {
          this.$emit("input", val);
        }
      }
    },
    // 是否支持复制功能
    isSupportCopyTool() {
      return (
        this.showTool && this.planMode === "edit" && this.planType !== "day"
      );
    },
    // 是否没有time-label，用于整体是否要缩进
    isNoTimeLabel() {
      let isNoLabel = true;
      this.dateList.forEach((item) => {
        if (item) {
          isNoLabel = false;
        }
      });
      return isNoLabel;
    }
  },
  watch: {
    canvasHeight() {
      // canvas 尺寸改变后重绘
      this.$nextTick(() => {
        this.DrawInit();
      });
    },
    planMode() {
      this.$nextTick(() => {
        this.DrawInit();
      });
    }
  },
  beforeCreate() {
    // 去除 vue warn
    Vue.config.silent = false;
  },
  created() {
    if (this.isOldVersion) {
      this.oldVersionDate = this.timePlanSetting.date;
    }
    // 对传入数据进行校验
    // planMode
    this.isPlanModeValid(this.planMode);
    // planType
    this.isPlanTypeValid(this.planType);
    // showTool
    this.isShowToolValid(this.showTool);
    // colors
    this.isColorsValid(this.colors);
    // btnLabel
    this.isBtnLabelValid(this.btnLabel);
    // dayLabel
    this.isDayLabelValid(this.dayLabel);
    // weekLabel
    this.isWeekLabelValid(this.weekLabel);
    // holidayLabel
    this.isHolidayLabelValid(this.holidayLabel);
  },
  mounted() {
    // 初始化 canvas，并绘制网格背景
    this.ctx = this.$refs[this.canvasId].getContext("2d");
    this.DrawInit();
  },
  methods: {
    refresh() {
      this.$refs.hcp.refresh();
    },
    // 清空画布
    clean() {
      this.handleFuncBtn('empty');
    },
    // 老版本方法
    getData() {
      return this.oldVersionDate;
    },
    // 老版本方法
    addRow({ name }) {
      this.oldVersionDate.splice(1, 0, { name, TimeSpan: [] });
      this.$refs.hcp.addRow(name);
    },
    handleFuncBtn(type) {
      this.$refs.hcp.handleFuncBtn(type);
    },
    DrawInit() {
      //绘制背景
      this.ctx.strokeStyle = DRAWELEM.LINESTYLE;
      this.ctx.fillStyle = DRAWELEM.PANNELBACKGROUND;
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.strokeRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.save();
      //绘制水平线
      for (let i = 1; i < this.dateList.length; i++) {
        // 虚线
        if (this.zPlanMode === "show") {
          this.ctx.setLineDash([3, 2]);
        }
        this._drawLine(
          0,
          i * DRAWELEM.CELLH + 0.5,
          DRAWELEM.TEMPW,
          i * DRAWELEM.CELLH + 0.5
        );
      }
      if (this.zPlanMode === "edit" || this.zPlanMode === "slot") {
        //绘制垂直线
        for (let i = 1; i <= 48; i++) {
          this.ctx.strokeStyle = DRAWELEM.LINESTYLE;
          //实线
          if (i % 2 === 0) {
            i === 24 && (this.ctx.strokeStyle = DRAWELEM.LINECENTERSTYLE);
            this.ctx.setLineDash([]);
          } else {
            //虚线
            this.ctx.setLineDash([3, 2]);
          }
          this._drawLine(
            i * DRAWELEM.CELLW + 0.5,
            0,
            i * DRAWELEM.CELLW + 0.5,
            this.canvasHeight
          );
        }
      }
    },
    _drawLine(fromX, fromY, toX, toY) {
      this.ctx.beginPath();
      this.ctx.moveTo(fromX, fromY);
      this.ctx.lineTo(toX, toY);
      this.ctx.stroke();
    },
    // 校验 planMode
    isPlanModeValid(val) {
      if (!(["edit", "show", "slot"].indexOf(val) !== -1)) {
        return logValueError("planMode", ["edit", "show", "slot"], val);
      }
    },
    // 校验 planType
    isPlanTypeValid(val) {
      if (!(["day", "week", "holiday", "year", "custom"].indexOf(val) !== -1)) {
        return logValueError(
          "planType",
          ["day", "week", "holiday", "year", "custom"],
          val
        );
      }
    },
    // 校验 showTool
    isShowToolValid(val) {
      const _type = getType(val);
      if (_type !== "boolean") {
        return logTypeError("showTool", "boolean", _type);
      }
    },
    // 校验 colors
    isColorsValid(val) {
      const _type = getType(val);
      if (_type !== "array") {
        return logTypeError("colors", "array", _type);
      }
      for (let i = 0; i < val.length; i++) {
        if (!this.CheckIsColor(val[i])) {
          logColorFormatError("colors", i);
        }
      }
    },
    // 校验是否为颜色字符串, 支持 16进制 ("#FFFFFF", "#FFF") 和 rgba ("rgba(255,255,255)")
    CheckIsColor(colorValue) {
      var type = "^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$";
      var re = new RegExp(type);
      if (colorValue.match(re) === null) {
        type
          = "^[rR][gG][Bb][(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){2}[\\s]*(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)[\\s]*[)]{1}$";
        re = new RegExp(type);
        if (colorValue.match(re) === null) {
          return false;
        }
        return true;
      }
      return true;
    },
    // 校验 btnLabel
    isBtnLabelValid(val) {
      const _type = getType(val);
      if (_type !== "array") {
        return logTypeError("btnLabel", "array", _type);
      }
      for (let i = 0; i < val.length; i++) {
        let _type = getType(val[i]);
        if (_type !== "object") {
          return logTypeErrorInObject("btnLabel", "object", _type, i);
        }
      }
    },
    // 校验 dayLabel
    isDayLabelValid(val) {
      const _type = getType(val);
      if (_type !== "string") {
        return logTypeError("dayLabel", "string", _type);
      }
    },
    // 校验 weekLabel
    isWeekLabelValid(val) {
      const _type = getType(val);
      if (_type !== "array") {
        return logTypeError("weekLabel", "array", _type);
      }
      for (let i = 0; i < val.length; i++) {
        let _type = getType(val[i]);
        if (_type !== "string") {
          return logTypeErrorInObject("weekLabel", "string", _type, i);
        }
      }
    },
    // 校验 holidayLabel
    isHolidayLabelValid(val) {
      const _type = getType(val);
      if (_type !== "array") {
        return logTypeError("holidayLabel", "array", _type);
      }
      for (let i = 0; i < val.length; i++) {
        let _type = getType(val[i]);
        if (_type !== "string") {
          return logTypeErrorInObject("holidayLabel", "string", _type, i);
        }
      }
    },
    // 处理功能菜单点击
    handleFuncBtnClick(szType) {
      this.handleFuncBtn(szType);
    }
  }
};
</script>

<style scoped>
.plan-wrapper {
  position: relative;
  line-height: 17px;
}

.plan-wrapper-top,
.plan-wrapper-bottom {
  margin-left: 99px;
  height: 17px;
  line-height: 17px;
}

.plan-wrapper-bottom {
  position: relative;
  top: -4px;
}

.plan-wrapper-middle {
  display: inline-block;
  /* overflow: hidden; */
  position: relative;
  width: 100%;
}

.plan-date-content {
  float: left;
}

.plan-date-list {
  width: 100%;
  height: 28px;
  padding: 0 8px;
  line-height: 28px;
  text-align: center;
  background: #ffffff;
  border-left: 1px solid #bac8da;
  border-bottom: 1px solid #bac8da;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.plan-date-list:first-of-type {
  border-top: 1px solid #bac8da;
  height: 29px;
}

.plan-grid-canvas {
  float: left;
}

.plan-tool-bar {
  float: left;
  width: 48px;
  border-right: 1px solid #bac8da;
  border-top: 1px solid #bac8da;
  border-bottom: 1px solid #bac8da;
  background: #ffffff;
  overflow: hidden;
  box-sizing: border-box;
}

.plan-hover-content {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  /* padding-top: 1px; */
}

.plan-hover-item {
  height: 28px;
  cursor: pointer;
  padding: 4px 0;
  box-sizing: border-box;
}
.plan-hover-item:first-of-type {
  height: 28px;
  margin-bottom: 1px;
}

.plan-hover-item:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>