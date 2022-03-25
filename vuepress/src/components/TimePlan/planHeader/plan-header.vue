/**
* @author chenzixin7(chenzixin7@hikvision.com.cn)
* @desc plan 时间计划组件上方的按钮组,计划按钮和擦除按钮只能单选其一
*/
<template>
  <div class="plan-header">
    <!-- 计划笔刷 -->
    <div class="plan-group">
      <div class="plan-group-wrapper" :style="planGroupWrapperStyle">
        <div class="plan-group-content" :style="planGroupStyle">
          <template v-if="planMode === 'edit'">
        
            <div
              class="plan-btn"
              v-for="(plan, index) in planGroup"
              :key="index"
              @click="handleClick('plan', plan, index)"
              :title="plan.label"
              :style="{width: btnWidth + 'px'}"
              :class="{
                selected:
                  (selectedBtn && selectedBtn === plan.id) ||
                  (selectedBtn === 0 && selectedBtn === plan.id),
              }"
            >
              <img :src="plan.icon">
              <div class="plan-btn-txt">{{ plan.label }}</div>
            </div>
          
        
          </template>
          <template v-else-if="planMode === 'show'">
            <div
              class="plan-btn"
              v-for="(plan, index) in planGroup"
              :title="plan.label"
              :key="index"
              :style="{width: btnWidth + 'px'}"
            >
              <div class="plan-color" :style="'background:' + plan.color"></div>
              <div class="plan-btn-txt show-btn-txt">{{ plan.label }}</div>
            </div>
          </template>
          <template v-else-if="planMode === 'slot'">
            <div
              class="plan-btn"
              v-for="(slot, index) in slotGroup"
              :key="index"
              @click="handleClick('slot', slot, index)"
              :title="slot.label"
              :style="{width: btnWidth + 'px'}"
              :class="{
                selected:
                  (selectedBtn && selectedBtn === slot.id) ||
                  (selectedBtn === 0 && selectedBtn === slot.id),
              }"
            >
              <div class="plan-color" :style="'background:' + slot.color"></div>
              <div class="plan-btn-txt show-btn-txt">{{ slot.label }}</div>
            </div>
          </template>
        </div>
      </div>
      <!-- 下拉菜单 plan -->
      <template v-if="isShowMoreBtn">
        <el-popover
          ref="popover"
          placement="bottom-start"
          width="200"
          trigger="click"
        >
          <div class="plan-list">
            <!-- slotMode的下拉菜单 -->
            <template v-if="planMode === 'slot'">
              <div
                class="plan-list-item"
                v-for="(plan, index) in slotGroup"
                :key="index"
                @click="handleClick('plan', plan, index, true)"
              >
                <div class="color-wrapper" :style="'background:' + plan.color"></div>
                <div class="plan-name">{{ plan.label }}</div>
              </div>
            </template>
            <!-- editMode和showMode的下拉菜单 -->
            <template v-else>
              <div
                class="plan-list-item"
                v-for="(plan, index) in planGroup"
                :key="index"
                @click="handleClick('plan', plan, index, true)"
              >
                <div class="color-wrapper" :style="'background:' + plan.color"></div>
                <div class="plan-name">{{ plan.label }}</div>
              </div>
            </template>
          </div>
        </el-popover>
        <div class="more-icon h-icon-angles_right_sm" :style="moreIconStyle" v-popover:popover></div>
      </template>
    </div>
    <!-- 清除笔刷 -->
    <div class="clean-group" v-if="planMode === 'edit'">
      <div
        class="plan-btn"
        v-for="(clean, index) in cleanGroup"
        :key="index"
        :title="clean.label"
        @click="handleClick('clean', clean)"
        :style="{width: '90px'}"
        :class="{
          selected:
            (selectedBtn && selectedBtn === clean.id) ||
            (selectedBtn === 0 && selectedBtn === clean.id),
        }"
      >
        <img :src="clean.icon">
        <div class="plan-btn-txt">{{ clean.label }}</div>
      </div>
      <div v-if="supportWeekPlan || supportEmpty">
        <el-popover
          ref="popover2"
          placement="bottom-start"
          width="120"
          trigger="click"
        >
          <div class="plan-list">
            <div
              class="plan-list-item"
              @click="handleFuncBtn('full')"
              v-if="supportWeekPlan"
            >
              <div class="extra-btn-text" :title="$t('allWeekPlan')">
                {{ $t('allWeekPlan') }}
              </div>
            </div>
            <div
              class="plan-list-item"
              @click="handleFuncBtn('empty')"
              v-if="supportEmpty"
            >
              <div class="extra-btn-text" :title="$t('cleanAll')">
                {{ $t('cleanAll') }}
              </div>
            </div>
          </div>
        </el-popover>
        <div class="h-icon-more_hori func-btn" v-popover:popover2></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ZPlanHeader",
  props: {
    planMode: {
      type: String,
      default: "edit"
    },
    btnLabel: {
      type: Array,
      default: () => []
    },
    slotBtnLabel: {
      type: Array,
      default: () => []
    },
    colors: {
      type: Array,
      default: () => []
    },
    btnIcon: {
      type: Array,
      default: () => []
    },
    supportWeekPlan: {
      type: Boolean,
      default: false
    },
    supportEmpty: {
      type: Boolean,
      default: false
    },
    dayLabel: {
      type: String,
      default: ""
    },
    planType: {
      type: String,
      default: "week"
    },
    btnWidth: {
      type: Number,
      default: 90
    }
  },
  data() {
    return {
      cleanGroup: [],
      // 选中的 btn 的 id
      selectedBtn: null,
      planGroupLeft: 0
    };
  },
  computed: {
    planGroup() {
      if (this.btnLabel.length) {
        return this.btnLabel.map((label, labelIndex) => ({
          id: label.type,
          label: label.name,
          color: this.colors[labelIndex],
          icon: this.btnIcon[labelIndex]
        }));
      }
      return [];
    },
    slotGroup() {
      if (this.slotBtnLabel.length) {
        return this.slotBtnLabel.map((label, labelIndex) => ({
          id: label.type,
          label: label.name,
          color: this.colors[labelIndex],
          icon: this.btnIcon[labelIndex],
          timeSpan: label.timeSpan
        }));
      }
      return [];
    },
    planGroupStyle() {
      return {
        "left": `-${ this.planGroupLeft }px`
      };
    },
    // 显示的计划按钮数量
    iShowBtnCount() {
      if (this.planMode === 'edit' && this.dayLabel === '' && this.planType === 'day') {
        return Math.floor(392 / (this.btnWidth + 8));
      }
      return Math.floor(490 / (this.btnWidth + 8));
    },
    planGroupWrapperStyle() {
      return {
        "width": this.iShowBtnWrapperLength + 'px'
      };
    },
    moreIconStyle() {
      return {
        "left": this.iShowBtnWrapperLength + 'px'
      };
    },
    // 计划按钮显示区域长度
    iShowBtnWrapperLength() {
      return this.iShowBtnCount * (this.btnWidth + 8);
    },
    // 是否显示更多笔刷按钮
    isShowMoreBtn() {
      if (this.planMode === 'edit' || this.planMode === 'show') {
        return this.planGroup.length > this.iShowBtnCount;
      } else if (this.planMode === 'slot') {
        return this.slotGroup.length > this.iShowBtnCount;
      }
      return false;
    }
  },
  created() {
    // 根据配置项配置对应笔刷和橡皮擦
    this.cleanGroup.push({
      id: "eraser",
      label: this.$t('eraser'),
      icon: require("../assets/attendance_schedule_template_erase.png")
    });
  },
  methods: {
    // 处理点击事件
    handleClick(type, opts, index, isPopover) {
      if (isPopover) {
        this.$refs.popover.showPopper = false;
        let splitCount = this.iShowBtnCount - 1;
        if (this.planMode === 'edit' && this.dayLabel === '' && this.planType === 'day') {
          splitCount = this.iShowBtnCount - 2;
        }
        if (typeof (index) !== "undefined") {
          if (index > splitCount) {
            this.planGroupLeft = (index - splitCount) * (this.btnWidth + 8);
          } else {
            this.planGroupLeft = 0;
          }
        }
      }
      let res = null;
      this.selectedBtn = opts.id;
      if (type === "plan") {
        res = {
          type: "plan",
          color: opts.color,
          label: opts.label,
          id: opts.id
        };
      } else if (type === "slot") {
        res = {
          type: "slot",
          color: opts.color,
          label: opts.label,
          id: opts.id,
          timeSpan: opts.timeSpan
        };
      } else if (type === "clean") {
        res = {
          type: "clean",
          label: opts.label,
          id: opts.id
        };
      }
      this.$emit("input", res);
    },
    // 处理功能菜单
    handleFuncBtn(szType) {
      this.$refs.popover2.showPopper = false;
      this.$emit('func', szType);
    }
  }
};
</script>

<style scoped>
.plan-header {
  position: relative;
  padding-bottom: 8px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 17px;
}

.plan-group {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  flex-wrap: nowrap;
  /* overflow-x: scroll; */
}

.plan-group-wrapper {
  position: relative;
  height: 30px;
  overflow: hidden;
}

.plan-group-content {
  position: absolute;
  width: auto;
  white-space: nowrap;
  top: 0px;
  left: 0px;
}

.more-icon {
  position: absolute;
  top: 2px;
  font-size: 24px;
  cursor: pointer;
}

.plan-list {
  max-height: 120px;
  box-sizing: border-box;
  overflow: auto;
  margin: 8px;
}

.plan-list::-webkit-scrollbar {
  /*滚动条整体样式*/
  width : 5px;  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.plan-list::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  background   : #c1c1c1;
}
.plan-list::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background   : #f1f1f1;
}

.plan-list-item {
  display: flex;
  align-items: center;
  color: #333333;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #cccccc;
  box-sizing: border-box;
  height: 30px;
  cursor: pointer;
}

.plan-list-item:nth-last-child(1) {
  border-bottom: none;
}

.plan-list-item:hover {
  background: #eeeeee;
}

.extra-btn-text {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
}

.color-wrapper {
  width: 16px;
  height: 16px;
}

.plan-btn {
  position: relative;
  padding: 4px 8px;
  display: inline-block;
  align-items: center;
  height: 30px;
  box-sizing: border-box;
  border: 1px solid #cccccc;
  border-radius: 2px;
  background: #ffffff;
  margin-right: 8px;
}

.plan-btn.selected {
  border-color: #e72528;
}

.plan-btn:nth-last-child(1) {
  margin-right: 0px;
}

.plan-btn img {
  width: 20px;
  height: 20px;
  padding-right: 2px;
  float: left;
}

.plan-btn:hover {
  background: #eeeeee;
  cursor: pointer;
}

.plan-btn-txt {
  width: calc(100% - 24px);
  font-size: 13px;
  font-weight: 400;
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  line-height: 22px;
}

.tool-tip-btn {
  padding: 4px 8px;
  border: 1px solid #cccccc;
  border-radius: 2px;
  background: #ffffff;
  margin-right: 8px;
  display: flex;
  align-items: center;
  user-select: none;
}

.plan-color {
  position: absolute;
  top: 6px;
  left: 8px;
  width: 16px;
  height: 16px;
  background: #eeeeee;
}

.clean-group {
  position: absolute;
  display: flex;
  align-items: center;
  top: 0px;
  right: 0px;
  height: 30px;
}

.func-btn {
  color: #333333;
  font-size: 24px;
  cursor: pointer;
}

.show-btn-txt {
  font-size: 14px;
  color: #333333;
  padding-left: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 20px;
}
</style>