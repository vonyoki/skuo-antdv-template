<template>
  <a-space align="start">
    <a-time-picker
      v-model="time_start"
      placeholder="开始时间"
      :style="width ? 'width: ' + width + 'px' : null"
      allowClear
      format="HH:mm"
      valueFormat="HH:mm"
      @change="onChange"
    ></a-time-picker>

    <a-icon type="arrow-right" />

    <a-time-picker
      v-model="time_end"
      placeholder="结束时间"
      :style="width ? 'width: ' + width + 'px' : null"
      allowClear
      format="HH:mm"
      valueFormat="HH:mm"
      @change="onChange"
    ></a-time-picker>

    <a-button v-if="showDel" type="link" @click="onDelete" style="color: #ff4d4f">删除</a-button>
  </a-space>
</template>

<script>
export default {
  name: 'TimePickers',
  props: {
    value: { type: Object, default: () => { } },
    showDel: { type: Boolean, default: false },
    width: { type: Number, default: 0 }
  },
  data () {
    return {
      time_start: '',
      time_end: ''
    }
  },
  watch: {
    value (curVal) {
      if (!curVal) return
      this.time_start = curVal.time_start
      this.time_end = curVal.time_end
    }
  },
  methods: {
    onChange () {
      if (this.time_start && this.time_end) {
        this.$emit('change', {
          time_start: this.time_start,
          time_end: this.time_end
        })
      }
    },
    onDelete () {
      this.$emit('delete', {})
    }
  }
}
</script>

<style>
</style>
