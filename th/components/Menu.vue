<template>
  <div id="menu" class="menu-cls menu-others">
    <ul class="header-menu-item-list">
      <li class="header-menu-item pos-rel" v-for="(item, index) in menus" :key="'menu1' + index">
        <a :href="item.url" class="header-menu-item-link"
           :class="['header-menu-item-link-' + (index + 1), {'active': index == selectedMenu}]"
        >
          {{ item.title }}
        </a>
        <span v-if="item.isNew" class="new-item pos-abs"> <b>New!</b> </span>
      </li>
    </ul>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/menu.json'

export default {
  name: 'Menu',
  i18n: { messages: i18n },
  mounted() {
    this.selectedMenu = this.menus.findIndex(e =>
      location.pathname.startsWith(e.url)
    )
  },
  data() {
    return {
      selectedMenu: null,
      menus: [
        {
          title: this.$t('14'),
          url: '/th',
          isNew: true,
        },
        {
          title: this.$t('11'),
          url: 'https://real-trade.tech/th',
          isNew: true,
        },
        {
          title: this.$t('13'),
          url: '/th/tools/indicators'
        },
        {
          title: this.$t('12'),
          url: '/th/post/46/16251?src=banner'
        },
        {
          title: this.$t('16'),
          url: 'https://www.facebook.com/GogoJunglethai'
        },
      ],
    }
  }
}
</script>

<style scoped lang="scss">
.menu-cls {
  min-width: 1000px;
  box-shadow: 0 3px 4px #ededed;
  text-align: center;
  .header-menu-item-list {
    display: inline-flex;
    list-style: none;
    font-size: 17px;
    font-weight: 700;
    padding: 0;
    margin-top: 20px;
    .header-menu-item {
      padding: 2px 12px;
      &-link {
        color: #666;
        text-decoration: none;
        cursor: pointer;
      }
    }
  }
}
$hover-color: #251775, #029e9d, #29a8e3, #009736, #f15e5a, #fdaf17, #367db4, #59a99e, #a489c0;
@for $i from 1 through 9 {
  .header-menu-item-link-#{$i} {
    position: relative;
    &.active,
    &:hover {
      color: nth($hover-color, $i) !important;
    }
    &:focus {
      outline: none;
    }
  }
}
.new-item {
  color: #fff;
  background: #ff6901;
  font-size: 10px;
  display: inline-block;
  padding: 1px 4px;
  border-radius: 3px;
  top: -12px;
  right: -2px;
  -webkit-transform: rotate(9deg);
  transform: rotate(9deg);
  position: absolute;
  z-index: 1;
}
@media only screen and (max-width: 1100px) {
  .header-menu-item {
    font-size: 16px;
  }
}
.menu-others {
  width: 1020px;
  display: flex;
  align-items: center;
  margin: 0 auto;
  box-shadow: none;
}
</style>
