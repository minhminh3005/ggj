<template>
  <div>
    <div class="flex space-between tab-ctn mb-25" id="top-tab">
      <div
        @click="onChangeTab(1, 'top')"
        id="top-tabs"
        class="w-full text-center tab flex mid center"
        :class="{ active: currentTab === 1 }"
      >
        <Tags />
        {{ $t(1) }}
        <span></span>
      </div>
      <div
        @click="onChangeTab(2, 'top')"
        class="w-full text-center tab flex mid center"
        :class="{ active: currentTab === 2 }"
      >
        <CommentSolid />
        {{ $t(2, { num: communityTotal }) }}
        <span></span>
      </div>
      <!-- <div
        @click="onChangeTab(3, 'top')"
        class="w-full text-center tab flex mid center"
        :class="{ active: currentTab === 3 }"
        v-if="showTab3"
      >
        <InfoCircle />
        {{ $t(3) }}
        <span></span>
      </div> -->
      <div style="width: calc(100% / 3 - 6px);"></div>
    </div>
    <slot></slot>
    <div class="flex space-between tab-ctn mb-20 mt-60">
      <div
        @click="onChangeTab(1, 'bottom')"
        class="w-full text-center tab flex mid center"
        :class="{ active: currentTab === 1 }"
      >
        <Tags />
        {{ $t(1) }}
        <!-- <span></span> -->
      </div>
      <div
        @click="onChangeTab(2, 'bottom')"
        class="w-full text-center tab flex mid center"
        :class="{ active: currentTab === 2 }"
      >
        <CommentSolid />
        {{ $t(2, { num: communityTotal }) }}
        <!-- <span></span> -->
      </div>
      <!-- <div
        @click="onChangeTab(3, 'bottom')"
        class="w-full text-center tab flex mid center"
        :class="{ active: currentTab === 3 }"
        v-if="showTab3"
      >
        <InfoCircle />
        {{ $t(3) }}
      </div> -->
      <div style="width: calc(100% / 3 - 6px);"></div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/tools-detail-tabs.json'
import Tags from "@@/../components/icons/Tags.vue"
import CommentSolid from "@@/../components/icons/CommentSolid.vue"
// import InfoCircle from "@@/../components/icons/InfoCircle.vue"

export default {
  props: {
    communityTotal: {
      type: [Number, String],
      default: 0,
    },
    // showTab3: {
    //   type: Boolean,
    //   default: false,
    // }
  },
  components: {
    Tags,
    CommentSolid,
    // InfoCircle,
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      currentTab: 1,
    }
  },
  methods: {
    async onChangeTab(num, clickPosition) {
      this.currentTab = num
      if(clickPosition === 'bottom') {
        window.scrollTo({
          top: document.getElementById("top-tabs").getBoundingClientRect().top + window.pageYOffset - 65,
          behavior: 'smooth'
        })
        await new Promise(rs => setTimeout(rs, 5e2))
      }
      this.$emit('onChangeTab', num)
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-ctn {
  .tab {
    $color-active-1: #003567;
    $color-active-2: #f6ba44;
    $color-active-3: #3abb9a;
    $color-deactive: #b9b9b9;
    border-bottom: 4px solid $color-deactive;
    width: calc(100% / 3 - 6px);
    position: relative;
    font-size: 16px;
    color: #333;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    height: 45px;
    &.active {
      border-bottom: 4px solid;
      span {
        display: block;
      }
      &:first-child {
        border-color: $color-active-1;
        span::after {
          border-top: 24px solid $color-active-1;
          border-left: 24px solid $color-active-1;
        }
      }
      &:nth-child(2) {
        border-color: $color-active-2;
        span::after {
          border-top: 24px solid $color-active-2;
          border-left: 24px solid $color-active-2;
        }
      }
      &:last-child {
        border-color: $color-active-3;
        span::after {
          border-top: 24px solid $color-active-3;
          border-left: 24px solid $color-active-3;
        }
      }
    }
    &:active {
      transform: translateY(4px);
    }
    &:hover {
      &:nth-child(1) {
        border-color: $color-active-1;
      }
      &:nth-child(2) {
        border-color: $color-active-2;
      }
      &:nth-child(3) {
        border-color: $color-active-3;
      }
    }
    span {
      position: absolute;
      left: calc(50% - 25px);
      bottom: -16px;
      display: none;
      height: 14px;
      width: 49px;
      overflow: hidden;
      &::after {
        position: absolute;
        left: calc(50% - 16px);
        bottom: -5px;
        content: '';
        border-top: 24px solid $color-active-1;
        border-left: 24px solid $color-active-1;
        border-bottom: 10px solid transparent;
        border-right: 10px solid transparent;
        -webkit-transform: rotate(
          45deg
        );
        transform: rotate(45deg);
      }
    }
    /deep/ .icon-cls {
      width: 25px;
      height: 25px;
      margin-right: 2px;
    }
  }
}
</style>