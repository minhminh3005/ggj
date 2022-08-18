<template>
  <div class="wrap-toggle">
    <div :id="attrs.id" class="content" :class="{'clamp clamp-2' : !isExpand}">
      {{ attrs.content }}
    </div>
    <div v-if="isShowToggle" :id="attrs.tid" class="btn-readmore cursor-pointer" :class="{'open' : isExpand}" @click="onToggle">
      {{ textToggle }}
      <ChevronDown class="caret-icon icon-cls" />
    </div>
  </div>
</template>
<script>
import ChevronDown from '@@/../components/icons/ChevronDown.vue'

export default {
  components: {
    ChevronDown
  },
  props: {
    attrs: {
      type: Object,
      default: function() {
        return {}
      },
    },
  },
  data() {
    return {
      isExpand: false,
      toggleAttrs: {
        checked: false,
        val: false
      },
      textToggle: this.attrs.txtSeeMore,
      isShowToggle: false,
    }
  },
  mounted() {
    this.$nextTick(this.checkShowToggle)
  },
  methods: {
    checkShowToggle() {
      let id = `#${this.attrs.id}`
      if(!$(id)[0] || ($(id)[0] && !$(id)[0].scrollHeight)) {
        this.isShowToggle = false
        return
      }
      // check text is truncated, line clamp is enabled -> show read more button
      if(!this.toggleAttrs.checked) {
        this.toggleAttrs = {
          checked: true,
          val: $(id)[0].scrollHeight - $(id)[0].clientHeight > 1
        }
      }
      this.isShowToggle = this.toggleAttrs.val
    },
    onToggle() {
      let id = `#${this.attrs.tid}`
      if (!$(id).hasClass('open')) {
        this.isExpand = true
        $(id).addClass('open')
        this.textToggle = this.attrs.textClose
      } else {
        this.isExpand = false
        $(id).removeClass('open')
        this.textToggle = this.attrs.txtSeeMore
      }
    }
  },
}
</script>
<style lang="less" scoped>
  .content {
    color: #707070;
    transition: all 0.3s linear 0s;
    width: fit-content;
    word-break: break-all;
  }
  .caret-icon {
    transition: 0.6s ease;
    margin-left: 10px;
  }
  i.icon-cls {
    width: 15px !important;
    height: 15px !important;
    fill: #707070;
  }
  .open {
    .caret-icon {
      transform: rotate(180deg);
    }
  }
  .btn-readmore {
    transition: all 0.5s;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 0;
    color: #707070;
    font-size: 12px;
  }
  .wrap-toggle {
    margin: 8px 0 16px;
  }
</style>