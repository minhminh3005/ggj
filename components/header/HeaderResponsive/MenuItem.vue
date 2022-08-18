<template>
  <div class="pos-rel menu flex mid h-full">
    <span class="cursor-pointer" @click="openMenu"><slot/></span>
    <!-- menu hover -->
    <div class="pos-abs list-ctn">
      <template v-for="(item, idx1) in data">
        <a 
          class="menu-item flex mid"
          :class="theme" :key="item.id"
          :is="item.subs ? 'div' : 'a'"
          :href="calcUrl(item)"
        >
          {{ item.name }}
          <div class="pos-abs list-ctn-lv2" v-if="item.subs">
            <a
              class="menu-item-lv2 flex mid"
              :class="theme"
              :href="calcUrl(itemLv2)"
              v-for="(itemLv2, idx2) in item.subs"
              :key="idx1 + '-' + idx2"
            >
              {{ itemLv2.name }}
            </a>
          </div>
        </a>
      </template>
    </div>
    <!-- menu overlay -->
    <div class="menu-overlay-ctn" v-if="isMenuOpen" @click.self="closeMenu">
      <div class="menu-overlay sub" v-if="showSub">
        <div class="item item-header flex mid" @click="clickCloseSub">
          <div class="mr-5" style="margin-top: 4px; font-size: 18px;"><span class="glyphicon glyphicon-circle-arrow-left" aria-hidden="true"></span></div>
          <div>{{ header }}</div>
        </div>
        <div style="overflow: auto; height: calc(100% - 51px);">
          <a
            class="item"
            :key="item.id"
            :href="calcUrl(item)"
            v-for="item in currentSubList"
          >{{ item.name }}</a>
        </div>
      </div>
      <div class="menu-overlay" v-else>
        <div class="item item-header">{{ header }}</div>
        <div style="overflow: auto; height: calc(100% - 51px);">
          <template v-for="item in data">
            <!-- <a class="item" :key="item.id" v-if="item.path" :href="item.path">{{ item.name }}</a> -->
            <div class="item" :key="item.id" @click="clickOpenSub(item)">{{ item.name }}</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/header-responsive.json'

export default {
  i18n: { messages: i18n },
  props: {
    data: {
      type: [Array, Object],
      default() {
        return {}
      }
    },
    theme: {
      type: String,
      default() {
        return 'categories'
      },
      validator(val) {
        return ['ranking', 'categories'].includes(val)
      }
    },
    header: {
      type: String,
      default() {
        return this.$t(3)
      },
    },
  },
  data() {
    return {
      isMenuOpen: false,
      showSub: false,
      currentSubList: [],
      // handle for double click
      clicks: 0,
      timer: null,
      timeOut: 300,
    }
  },
  methods: {
    calcUrl(item) {
      if(item.subs && item.subs.length) { // if item have subs, remove path
        return '#'
      }
      if(item.path === '') {
        return ''
      }
      return item.path || '#'
    },
    openMenu() {
      // ipad UI is the same with desktop UI, ignore "openMenu"
      // if(/Tablet|iPad/i.test(navigator.userAgent)) {
      //   return
      // }

      this.isMenuOpen = true
      // $screen-md: 992px;
      if (process.env.ENV_TYPE == 'mobile' || document.body.clientWidth <= 992) {
        document.body.style.overflow = 'hidden'
      }
    },
    closeMenu() {
      document.body.style.overflow = ''
      this.isMenuOpen = false
    },
    clickOpenSub(item) {
      if(!item.subs || !item.subs.length) {
        this.goToTheLink(item)
        return
      }
      this.showSub = true
      this.currentSubList = item.subs
    },
    goToTheLink(item) {
      if(item.path || item.path === '') {
        location.href = item.path
      }
    },
    clickCloseSub() {
      this.showSub = false
      this.currentSubList = []
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@@/../common/assets/variables.scss";
.menu {
  .list-ctn {
    width: 240px;
    background: #fff;
    box-shadow: 1px 1px 4px -1px #888;
    display: none;
    top: 100%;
    padding-bottom: 25px;
    .menu-item {
      cursor: pointer;
      min-height: 39px;
      padding: 6px 16px;
      color: #333;
      text-decoration: none;
      background: #fff;
      .list-ctn-lv2 {
        width: 240px;
        min-height: 100%;
        box-shadow: 1px 1px 4px -1px #888;
        display: none;
        right: calc(-100% + 1px);
        top: 0;
        background: #fff;
        padding-bottom: 25px;
        .menu-item-lv2 {
          cursor: pointer;
          height: 33px;
          padding: 0 16px;
          color: #333;
          text-decoration: none;
          @media only screen and (min-width: $screen-md) {
            &:hover {
              background: #ff66001c;
            }
            &.ranking:hover {
              background: #f5d9482b;
            }
          }
        }
      }
      @media only screen and (min-width: $screen-md) {
        &:hover, &:active, &:focus {
          background: #ff66001c;
          .list-ctn-lv2 {
            display: block;
          }
        }
        &.ranking:hover, &.ranking:active, &.ranking:focus {
          background: #f5d9482b;
        }
      }
    }
  }
  @media only screen and (min-width: $screen-md) {
    &:hover .list-ctn {
      display: block;
    }
  }
}
.menu-overlay-ctn {
  position: fixed;
  top: 0;
  height: 100%;
  width: 100vw;
  left: 0;
  z-index: 1;
  background: #2b2828a6;
  @media only screen and (min-width: $screen-md) {
    display: none;
  }
  .menu-overlay {
    max-width: 260px;
    width: calc(100vmin - 65px);
    height: 100%;
    background: #fff;
    box-shadow: 0 0 8px 3px #434343;
    .item {
      width: 100%;
      height: 51px;
      display: flex;
      align-items: center;
      padding: 0 26px;
      font-weight: bold;
      color: #333;
      text-decoration: none;
      transition: background 0.3s;
      &.item-header {
        background: #17a2b8;
        color: #fff;
      }
      &:active {
        background: #c3f6fe;
      }
    }
  }
}
.fs-14 {
  font-size: 14px;
}
</style>
