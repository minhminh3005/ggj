<template>
  <div>
    <a @click="focusedTab(-1)" :class="{'active': currentTab === tabIndexx.all}" class="fi-tab flex mid center">{{ $t('13') }}</a>
    <a @click="focusedTab(1)" :class="{'active': currentTab === tabIndexx.price}" class="fi-tab flex mid center">{{ attrs.isFollower ? $t('16') : $t('14') }}</a>
    <a @click="focusedTab(0)" :class="{'active': currentTab === tabIndexx.free}" class="fi-tab flex mid center">{{ attrs.isFollower ? $t('17'): $t('15') }}</a>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/finance-tab.json'

const tabIndexx = {
  all: -1,
  price: 1,
  free: 0
}
export default {
  i18n: {
    messages: i18n,
  },
  props: {
    tabSelected: {
      type: Number,
      default: -1,
    },
    attrs: {
      type: Object,
      default: function() {
        return {}
      },
    },
  },
  mounted() {
    let vm = this
    $(this.$refs.category).popover({
      placement: 'bottom',
      html: true,
      trigger: 'focus',
      delay: { show: 0, hide: 1500 },
      template:
        '<div class="popover" style="width: 300px;border-radius: 0;" role="tooltip"><div class="arrow"></div><div class="popover-content" style="padding: 10px;"></div></div>',
      content: function() {
        return $(vm.$refs.catList).html()
      },
    })
    $(this.$refs.category).on('shown.bs.popover', function() {
      $(vm.$refs.category).addClass('bg')
    })
    $(this.$refs.category).on('hidden.bs.popover', function() {
      $(vm.$refs.category).removeClass('bg')
    })
  },
  data() {
    return {
      tabIndexx: tabIndexx,
      currentTab: this.tabSelected,
    }
  },
  methods: {
    focusedTab(index) {
      if(isNaN(index)) return
      this.$emit('onFilterTab', index)
    }
  },
}
</script>


<style lang="scss" scoped>
.fi-tab {
  width: 54px;
  height: 21px;
  background: #fff;
  border: 1px solid #a9a9a9;
  color: #bfbfbf;
  font-size: 12px;
  border-right: none;
  cursor: pointer;
  &:first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  &:last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    border-right: 1px solid #d4d4d4;
  }
  &:hover {
    background: #d4d4d4;
    color: white;
  }
}
.category-btn {
  outline: none;
  border-right: 1px solid #d4d4d4;
  &.bg {
    background: #d4d4d4;
    color: white;
  }
}
.border-right {
  border-right: 1px solid #d5d5d5;
}
.block {
  display: block;
}
.cat-item {
  padding: 2px 5px;
  &:hover {
    background: #f1f0f1;
  }
}
.active {
  text-decoration: none;
  color: #fff;
  background: #4b4b4b;
  border: none;
}
/deep/ .arrow {
  left: 103px !important;
}
@media only screen and (max-width: 768px),
  only screen
  and (max-width: 896px)
  and (max-height: 414px) {
  .fi-tab {
    height: 30px;
  }
}
</style>
