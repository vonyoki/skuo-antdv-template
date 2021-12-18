<template>
  <a-spin class="file-input" :spinning="loading" :delay="200">
    <slot />
    <input type="file" :accept="accept" @change="onChange" />
  </a-spin>
</template>

<script>
import { getStsOSS } from '@/api/basic'

import storage from 'store'
import { OSS_STS } from '@/store/mutation-types'

const OSS = require('ali-oss')

export default {
  name: 'FileInput',
  props: {
    value: { type: Object, default: () => { } },
    folder: { type: String, default: '' },
    accept: { type: String, default: 'image/*' }
  },
  data () {
    return {
      sts: null,
      client: null,
      loading: false
    }
  },
  created () {
    this.initSts()
  },
  methods: {
    initSts () {
      this.loading = true
      const sts = storage.get(OSS_STS)
      if (sts && (sts.expiration - new Date().getTime() / 1000) > 600) {
        this.sts = sts
        this.initOss()
      } else {
        getStsOSS()
          .then(res => {
            this.$store.commit('SET_OSS_STS', res.data)
            this.sts = res.data
            this.initOss()
          })
      }
    },
    initOss () {
      this.client = new OSS({
        region: this.sts.region,
        accessKeyId: this.sts.access_key_id,
        accessKeySecret: this.sts.access_key_secret,
        stsToken: this.sts.security_token,
        bucket: this.sts.bucket,
        secure: true
      })
      this.loading = false
    },
    checkType (file) {
      const types = this.accept.split(',')
      let flag = types.length === 0
      types.map(p => {
        if (p.split('/')[1] === '*') {
          if (p.split('/')[0] === file.type.split('/')[0]) flag = true
        } else {
          if (p === file.type) flag = true
        }
      })
      return flag
    },
    getFileName (fileName) {
      const index = fileName.lastIndexOf('.')
      const name = fileName.substring(0, index)
      const tail = fileName.substring(index + 1, fileName.length)
      return this.folder + name + '_' + new Date().getTime() + '.' + tail
    },
    onChange (e) {
      const file = e.target.files[0]
      // 判断文件类型
      if (this.checkType(file)) {
        this.client.multipartUpload(this.getFileName(file.name), file, {
          progress: (a, b) => { this.$emit('progress', { a, b }) }
        }).then(res => {
          const url = { path: res.name, full_path: res.res.requestUrls[0] }
          this.$emit('input', url)
          this.$emit('change', url)
        }).catch(err => {
          this.$emit('fail', err)
        })
      } else {
        this.$notification.error({ message: '不支持的文件格式' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.file-input {
  position: relative;

  input {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0;
  }
}
</style>
