<template>
  <div class="flex h-full mid flex-wrap">
    <MenuItem style="margin-right: 16px;" :data="data.categories">
      <span>
        <span style="color: #f60;" class="glyphicon glyphicon-th-large mr-5" aria-hidden="true"></span>
        <b class="fs-13 hidden-xs">{{ $t(1) }}</b>
        <b class="fs-13 visible-xs-inline">{{ $t(17) }}</b>
      </span>
    </MenuItem>
    <MenuItem :data="data.ranking" theme="ranking" :header="$t(18)">
      <div class="h-full flex mid">
        <Award style="margin-right: 2px; color: #cbb232;" />
        <b class="fs-13">{{ $t(2) }}</b>
      </div>
    </MenuItem>
  </div>
</template>

<script>
import MenuItem from './MenuItem.vue'
import Award from '@@/../components/icons/Award.vue'
import i18n from '@@/lang/components-desktop/header-responsive.json'

export default {
  i18n: { messages: i18n },
  components: {
    MenuItem,
    Award,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@@/../common/assets/variables.scss";
.menu {
  min-height: 40px;
  .list-ctn {
    width: 240px;
    min-height: 679px;
    background: #fff;
    box-shadow: 1px 1px 4px -1px #888;
    display: none;
    top: calc(100% + 1px);
    .menu-item {
      cursor: pointer;
      height: 39px;
      padding: 0 16px;
      .list-ctn-lv2 {
        width: 240px;
        min-height: 679px;
        box-shadow: 1px 1px 4px -1px #888;
        display: none;
        right: calc(-100% - 1px);
        top: 0;
        .menu-item-lv2 {
          cursor: pointer;
          height: 33px;
          padding: 0 16px;
          @media only screen and (min-width: $screen-sm) {
            &:hover {
              background: #ff66001c;
            }
          }
        }
      }
      @media only screen and (min-width: $screen-sm) {
        &:hover {
          background: #ff66001c;
          .list-ctn-lv2 {
            display: block;
          }
        }
      }
    }
  }
  @media only screen and (min-width: $screen-sm) {
    &:hover .list-ctn {
      display: block;
    }
  }
}
</style>