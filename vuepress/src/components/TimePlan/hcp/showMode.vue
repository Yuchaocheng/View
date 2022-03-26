/**
* @author chenzixin7(chenzixin7@hikvision.com.cn)
* @desc hcp 业务需求的时间计划组件-show模式
*/
<template>
  <div class="plan-content">
    <!-- 底图已做渲染，这里不做处理 -->
    <div class="plan-timelist" v-if="!isNoLabel"></div>
    <div class="plan-time-table">
      <!-- 每一行 -->
      <div v-for="(row, index) in showData" :key="index" class="show-line">
        <!-- 每一行上的每一段时间计划段 -->
        <div
          class="plan-range"
          v-for="(span, spanIndex) in row"
          :key="spanIndex"
          :style="getPlanRangeStyle(span)"
        >
          <span class="time-txt">
            {{
              secondToFormatTime(span.begin) +
                " - " +
                secondToFormatTime(span.end)
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { timeToSecond } from "../utils";
export default {
  name: "ShowMode",
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
    btnLabel: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tempW: 577,
      total: 86400
    };
  },
  computed: {
    // 展示的数据集合
    showData() {
      return this.value
        .map((row) => {
          if (row.TimeSpan) {
            return row.TimeSpan.map((span) => {
              return {
                plan: this.btnLabel[span.RecordType],
                color: this.getColorByLabel(span.RecordType),
                begin: timeToSecond(span.BeginTime),
                end: timeToSecond(span.EndTime)
              };
            });
          }
          return [];
        })
        .slice(0, this.allowLength); // 防止传入数据长度超过时间列长度
    },
    // 传入数据最大允许长度
    allowLength() {
      if (this.planType === "day") {
        return 1;
      } else if (this.planType === "week") {
        return 7;
      } else if (this.planType === "holiday") {
        return 8;
      } else if (this.planType === "year") {
        return 12;
      }
      // custom 模式
      return this.value.length;
    }
  },
  methods: {
    // 将秒数转为格式化时间
    secondToFormatTime(seconds) {
      let h = parseInt(seconds / 3600, 10);
      let m = parseInt((seconds % 3600) / 60, 10);
      // 补0
      if ((`${h }`).length === 1) {
        h = `0${ h}`;
      }
      // 补0
      if ((`${m }`).length === 1) {
        m = `0${ m}`;
      }
      return `${h }:${ m}`;
    },
    // 获取时间计划段样式
    getPlanRangeStyle(span) {
      const left = (span.begin / this.total) * this.tempW;
      const width = ((span.end - span.begin) / this.total) * this.tempW;
      return {
        left: `${left }px`,
        width: `${width }px`,
        background: span.color,
        "font-size": width > 72 ? "12px" : "0px"
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

.show-line {
  position: relative;
  height: 28px;
}

.plan-range {
  height: 80%;
  position: absolute;
  top: 50%;
  display: flex;
  transform: translateY(-50%);
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 0px;
  font-size: 12px;
}

.time-txt {
  display: none;
}

.plan-range:hover .time-txt {
  display: block;
}
</style>