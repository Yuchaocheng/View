<template>
  <div class="hcp-plan">
    <template v-if="planMode === 'edit'">
      <edit-mode
        ref="edit"
        :btn-opts="btnOpts"
        :plan-type="planType"
        v-model="planData"
        :show-tool="showTool"
        :is-no-label="isNoLabel"
        :is-old-version="isOldVersion"
        :day-label="dayLabel"
        :week-label="weekLabel"
        :holiday-label="holidayLabel"
        :year-label="yearLabel"
        :colors="colors"
        :btn-label="btnLabel"
        :limit="limit"
        :tiny="tiny"
      ></edit-mode>
    </template>
    <template v-else-if="planMode === 'show'">
      <show-mode
        :plan-type="planType"
        :is-no-label="isNoLabel"
        v-model="planData"
        :colors="colors"
        :btn-label="btnLabel"
      ></show-mode>
    </template>
    <template v-else-if="planMode === 'slot'">
      <slot-mode
        ref="slot"
        :plan-type="planType"
        :is-no-label="isNoLabel"
        v-model="planData"
        :colors="colors"
        :day-label="dayLabel"
        :week-label="weekLabel"
        :holiday-label="holidayLabel"
        :year-label="yearLabel"
        :btn-opts="btnOpts"
        :slot-btn-label="slotBtnLabel"
      >
        <template #range="{range}">
          <slot name="range" :range="range"></slot>
        </template>
      </slot-mode>
    </template>
  </div>
</template>

<script>
import editMode from "./editMode";
import showMode from "./showMode";
import slotMode from "./slotMode";
export default {
  name: "HcpPlan",
  components: {
    editMode,
    showMode,
    slotMode
  },
  props: {
    planMode: {
      type: String,
      default: "edit"
    },
    btnOpts: {
      type: Object,
      default: null
    },
    planType: {
      type: String,
      default: "day"
    },
    value: {
      type: Array,
      default: () => []
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
    oldVersionDate: {
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
    colors: {
      type: Array,
      default: () => []
    },
    btnLabel: {
      type: Array,
      default: () => []
    },
    slotBtnLabel: {
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
  computed: {
    planData: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    handleFuncBtn(type) {
      this.$refs.edit.handleFuncBtn(type);
    },
    addRow(name) {
      this.$refs.edit.addRow(name);
    },
    refresh() {
      if (this.planMode === 'edit') {
        this.$refs.edit.refresh();
      } else if (this.planMode === 'slot') {
        this.$refs.slot.refresh();
      }
    }
  }
};
</script>

<style scoped>
.hcp-plan {
  height: 100%;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>