<template>
  <!-- // TODO: when finish responsive for all of surface, remove this component -->
  <div class="pos-rel menu flex mid h-full">
    <span class="cursor-pointer"><slot/></span>
    <!-- menu hover -->
    <div class="pos-abs list-ctn">
      <template v-for="(item, idx1) in data">
        <a
          class="menu-item flex mid"
          :class="theme"
          :is="item.subs ? 'div' : 'a'"
          :key="item.id"
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
  },
  data() {
    return {
      isMenuOpen: false,
      showSub: false,
      currentSubList: [],
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
    goToTheLink(item) {
      if(item.path) {
        location.href = item.path
      } else if(item.subs && item.subs.length) {
        this.clickOpenSub(item)
      }
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
          &:hover {
            background: #ff66001c;
          }
          &.ranking:hover {
            background: #f5d9482b;
          }
        }
      }
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
  &:hover .list-ctn {
    display: block;
  }
}
.fs-14 {
  font-size: 14px;
}
</style>