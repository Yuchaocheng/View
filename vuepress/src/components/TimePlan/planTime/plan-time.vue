/**
* @author chenzixin7(chenzixin7@hikvision.com.cn)
* @desc 时间计划组件时间微调组件
*/
<template>
  <div class="time-wrapper">
    <div class="time-hour">{{ hour }}</div>
    <div class="time-divider">:</div>
    <div class="time-minutes">{{ minutes }}</div>
    <div class="change-area">
      <div
        class="add"
        @click="add"
        :class="isDisabledAdd ? 'disable-add' : ''"
      ></div>
      <div
        class="reduce"
        @click="reduce"
        :class="isDisabledReduce ? 'disable-reduce' : ''"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ZPlanTime",
  props: {
    value: {
      type: Number,
      default: -1
    },
    disabled: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      h: 0, // 时
      m: 0 // 分
    };
  },
  computed: {
    hour() {
      let _h = `${this.h }`;
      if (_h.length === 1) {
        _h = `0${ _h}`;
      }
      return _h;
    },
    minutes() {
      let _m = `${this.m }`;
      if (_m.length === 1) {
        _m = `0${ _m}`;
      }
      return _m;
    },
    isDisabledAdd() {
      // 是否禁用加号
      return (this.disabled && this.disabled === "add") || this.value === 86400;
    },
    isDisabledReduce() {
      // 是否禁用减号
      return (this.disabled && this.disabled === "reduce") || this.value === 0;
    }
  },
  watch: {
    value(val) {
      // 秒数转时分
      let _h = 0;
      let _m = 0;
      if (val >= 0 && val <= 86400) {
        _h = parseInt(val / 3600, 10);
        _m = parseInt((val % 3600) / 60, 10);
      }
      this.h = _h;
      this.m = _m;
    }
  },
  methods: {
    add() {
      // 加号被禁用
      if (this.isDisabledAdd) {
        return;
      }
      this.$emit("input", this.value + 60);
    },
    reduce() {
      // 减号被禁用
      if (this.isDisabledReduce) {
        return;
      }
      this.$emit("input", this.value - 60);
    }
  }
};
</script>

<style scoped>
.time-wrapper {
  width: 85px;
  height: 30px;
  background: #ffffff;
  border: 1px solid #b3b3b3;
  display: flex;
  align-items: center;
  padding: 0 4px;
  box-sizing: border-box;
}

.time-hour,
.time-minutes {
  padding: 0 4px;
  font-size: 13px;
}

.time-divider {
  font-weight: bold;
}

.change-area {
  display: flex;
  flex-direction: column;
  padding: 0px 6px;
}

.add {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 6px solid #000000;
  margin-bottom: 2px;
  cursor: pointer;
}

.reduce {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #000000;
  margin-top: 2px;
  cursor: pointer;
}

.add:hover {
  border-bottom-color: #e72528;
}
.reduce:hover {
  border-top-color: #e72528;
}
.disable-add {
  border-bottom-color: #cccccc;
  cursor: not-allowed;
}

.disable-reduce {
  border-top-color: #cccccc;
  cursor: not-allowed;
}
</style>