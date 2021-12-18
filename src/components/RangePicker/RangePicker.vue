<template>
  <a-range-picker
    v-model="rangeTime"
    format="YYYY/MM/DD"
    valueFormat="YYYY/MM/DD"
    :placeholder="['开始日期', '结束日期']"
    :disabled-date="disabledDate"
    @change="changePicker"
    @openChange="openChange"
    @calendarChange="calendarChange"
    :allowClear="false"
  >
    <a-icon slot="suffixIcon" type="calendar" style="color: #bbb" />
  </a-range-picker>
</template>

<script>
import moment from 'moment'

export default {
  name: 'RangePicker',
  props: {
    value: { type: Array, default: () => [] },
    // 限制范围 前后多少天
    limit: { type: Number, default: 0 },
    // 限制类型 0：没有限制 1：不可选择今天以后的时间 2：不可选择今天及以后的时间
    type: { type: Number, default: 0 }
  },
  data () {
    return {
      rangeTime: this.value,
      selectCurrentDate: null
    }
  },
  watch: {
    value (curVal) {
      if (!curVal) return
      this.rangeTime = curVal
    },
    rangeTime (curVal) {
      if (curVal.length) this.$emit('input', curVal)
    }
  },
  created () {
    moment.suppressDeprecationWarnings = true
  },
  methods: {
    changePicker (a, b) {
      this.rangeTime = a.length ? b : []
    },
    openChange (val) {
      if (val) {
        this.selectCurrentDate = null
      }
    },
    disabledDate (current, date) {
      if (this.type === 1 && current > moment(new Date()).add(0, 'days')) {
        return true
      }
      if (this.type === 2 && current > moment(new Date()).add(-1, 'days')) {
        return true
      }
      if (this.limit !== 0 && this.selectCurrentDate !== null) {
        return current < moment(this.selectCurrentDate).add(-1 * (this.limit - 1), 'days') ||
          current > moment(this.selectCurrentDate).add((this.limit - 1), 'days')
      }
      return false
    },
    calendarChange (date, dateString) {
      if (date.length <= 1) {
        this.selectCurrentDate = date[0]
      } else {
        this.selectCurrentDate = null
      }
    }
  }
}
</script>

<style>
</style>
