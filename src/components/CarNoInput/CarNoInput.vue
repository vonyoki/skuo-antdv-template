<template>
  <div class="car-no-input">
    <div class="input" :class="disabled ? 'disabled' : ''" @click="onShow">
      <slot name="head"></slot>
      <div v-if="value" class="value">{{ value }}</div>
      <div v-else class="value palceholder">{{ placeholder }}</div>
      <slot name="tail"></slot>
    </div>

    <div v-if="visible" class="mask" @click="visible = false"></div>

    <div v-if="visible" class="board" :style="position + ':0;'">
      <a-row v-for="(p, i) in keyBoard" :key="i" type="flex" justify="center">
        <a-col v-for="(pp, ii) in p" :key="ii" :span="2">
          <div v-if="pp === 'del'" class="del" @click="onTap(pp)">
            <img src="@/assets/icons/backspace.png" />
          </div>
          <div v-else-if="pp" class="btn" :class="keyType === 1 && i === 0 ? 'num' : ''" @click="onTap(pp)">
            {{ pp }}
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>

const keyBoardCN = [
  ['京', '津', '渝', '沪', '冀', '晋', '辽', '吉', '黑', '苏'],
  ['浙', '院', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '琼'],
  ['川', '贵', '云', '陕', '甘', '青', '蒙', '桂', '宁', '新'],
  ['', '藏', '使', '领', '警', '学', '港', '澳', '', '']
]

const keyBoardEU = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '学'],
  ['', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'del', '']
]

export default {
  name: 'CarNoInput',
  props: {
    value: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: '请输入' },
    position: { type: String, default: 'left' }
  },
  data () {
    return {
      keyType: 0,
      visible: false,
      input: ''
    }
  },
  computed: {
    keyBoard () {
      return this.keyType ? keyBoardEU : keyBoardCN
    }
  },
  methods: {
    onShow () {
      if (this.disabled) return
      this.keyType = 0
      this.input = ''
      this.visible = true
    },
    onTap (key) {
      if (key === 'del') {
        this.input = this.input.substr(0, this.input.length - 1)
        if (this.input.length === 0) this.keyType = 0
      } else if (this.keyType === 0) {
        this.keyType = 1
        this.input = key
      } else {
        this.input = this.input + key
      }
      this.$emit('input', this.input)
      this.$emit('change', this.input)
    }
  }
}
</script>

<style lang="less" scoped>
.car-no-input {
  width: 100%;
  position: relative;

  .input {
    height: 32px;
    line-height: 32px;
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid #d9d9d9;
    display: flex;
    align-items: center;
    padding: 0 12px;

    .value {
      flex: 1;
    }

    .palceholder {
      color: #bfbfbf;
    }
  }

  .disabled {
    background: #f5f5f5;
  }

  .mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }

  .board {
    position: absolute;
    top: 34px;
    width: 396px;
    height: 146px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 14px 0;
    background: #ffffff;
    box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08),
      0px 3px 6px -4px rgba(0, 0, 0, 0.12);
    z-index: 999;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;

    .num {
      color: #1f8efa;
    }

    .btn {
      width: 24px;
      height: 24px;
      font-size: 14px;
      border-radius: 2px;
      text-align: center;
      line-height: 24px;
    }

    .btn:hover {
      background: #1890ff;
      color: #fff;
      cursor: pointer;
    }

    .del {
      width: 24px;
      height: 24px;
      border-radius: 2px;
      color: rgba(0, 0, 0, 0.04);
      padding: 4px;

      img {
        width: 16px;
        height: 16px;
        display: block;
      }
    }
  }
}
</style>
