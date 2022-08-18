<template>
  <div class="frame-file" @dragover.prevent @drop.prevent="fileDropped" :class="{'row-reverse space-around': isRowReserver}">
    <label class="btn-file">
      {{ $t('2') }}
      <input ref="file" type="file" class="" style="display: none;" :accept="accept" @change="fileChanged" :disabled="isDisable" />
    </label>
    <span class="text-file" v-html="$t('1')"></span>
    <a download class="co-21 ml-5" v-if="downloadUrl" :href="downloadUrl" :title="imgName">{{ imgName }}</a>
    <div class="dragging w-full h-full" v-show="isShow"></div>
  </div>
</template>
<script>
import {
  createFormDataRequest,
  checkExtension,
  checkImgSize,
  checkImgWH,
} from '@/utils/client/common'
import i18n from '@@/lang/components-desktop/import-file-estimate.json'

const obj = {
  name: 'ImportFile',
  i18n: {
    messages: i18n,
  },
  props: {
    downloadUrl: String,
    filename: String,
    accept: String,
    autoupload: Boolean,
    multiple: {
      type: Number,
      default: 3, // max 3 files
    },
    uploadurl: String,
    maxsize: {
      type: Number,
      default: 10, // 10 MB
    },
    indexNumber: [String, Number],
    isDisable: {
      type: Boolean,
      default: false,
    },
    isRowReserver: {
      type: Boolean,
      default: false,
    },
    defaultTxt: {
      type: String,
      default: '',
    },
    btnTxt: String,
  },
  mounted() {
    $(this.$el).on({
      dragenter: this.handleDragEnter,
      dragleave: this.handleDragLeave,
    })
  },
  activated() {
    $(this.$el).on({
      dragenter: this.handleDragEnter,
      dragleave: this.handleDragLeave,
    })
  },
  destroyed() {
    let body = $(this.$el)
    body.off('dragenter', this.handleDragEnter)
    body.off('dragleave', this.handleDragLeave)
  },
  deactivated() {
    let body = $(this.$el)
    // incase component uses keep-alive
    body.off('dragenter', this.handleDragEnter)
    body.off('dragleave', this.handleDragLeave)
  },
  data() {
    return {
      imgName: this.filename || '',
      dragging: 0,
      isShow: false,
      isProcessing: false,
    }
  },
  watch: {
    filename(val) {
      this.imgName = val
    },
  },
  methods: {
    setFileName(name) {
      this.imgName = name
    },
    fileDropped(evt) {
      this.dragging = 0
      this.isShow = false
      this.fileChanged(evt.dataTransfer.files)
    },
    handleUploadImg(files) {
      // upload file to server
      let me = this
      me.isProcessing = true
      Promise.all([createFormDataRequest(files, this.uploadurl)])
        .then(data => {
          me.imgName = files[0].name
          me.$emit('input', [files, data])
          me.isProcessing = false
        })
        .catch(() => {
          me.isProcessing = false
        })
    },
    fileChanged(files) {
      files instanceof Event && (files = files.target.files)
      if (files.length) {
        // validate before moving further
        let me = this,
          fr = new FileReader()
        fr.onload = () => {
          // validate before move further
          // file extension must belong to accept property
          // and must smaller maxsize property
          let sizeErr = false,
            extErr = false
          for (let i = 0; i < me.multiple; i++) {
            if (files[i]) {
              if (!me.checkExtension(files[i], me.accept.split(/,\s*/))) {
                extErr = true
                break
              }
              if (!me.checkImgSize(files[i], me.maxsize)) {
                sizeErr = true
                break
              }
            }
          }
          if (!extErr && !sizeErr) {
            if (me.autoupload) {
              me.handleUploadImg(files)
            } else {
              let fileNames = [],
                sendFiles = {}
              for (let i = 0; i < me.multiple; i++) {
                if (files[i]) {
                  fileNames.push(files[i].name)
                  sendFiles[i] = files[i]
                  sendFiles.length = i + 1
                }
              }
              me.imgName = fileNames.join(', ')
              me.$emit('input', sendFiles)
            }
          } else {
            me.imgName = this.defaultTxt
            me.$refs.file.value = ''
            me.$emit('input', { err: extErr ? 'extErr' : 'sizeErr' })
          }
        }
        fr.readAsDataURL(files[0])
      } else {
        this.imgName = this.defaultTxt
        this.$refs.file.value = ''
        this.$emit('input', null)
      }
    },
    handleDragEnter(evt) {
      evt.preventDefault()
      this.dragging++
      this.isShow = true
    },
    handleDragLeave(evt) {
      evt.preventDefault()
      this.dragging--
      !this.dragging && (this.isShow = false)
    },
    deleteImage(newName = '') {
      this.imgName = newName
      this.$refs.file.value = ''
    },
  },
}

Object.assign(obj.methods, {
  checkExtension,
  checkImgSize,
  checkImgWH,
})

export default obj
</script>
<style lang="scss" scoped>
@import "@@/../common/assets/variables.scss";
@media screen and (max-width: $screen-xs) {
  .text-file {
    padding: 0 10px;
  }
}
.frame-file {
  height: 181px;
  display: flex;
  border: 1px dashed #ddd;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .text-file {
    margin-top: 8px;
    text-align: center;
    color: #333;
    font-size: 13px/21px;
  }
  .btn-file {
    margin-bottom: 8px;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #bbb;
    font-size: 13px/20px;
    color: #6e757e;
    background: #f1f1f1;
    width: 150px;
    height: 40px;
    &:hover {
      background: #ddd;
    }
  }
}
</style>
