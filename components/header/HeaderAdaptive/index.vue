<template>
  <!-- // TODO: when finish responsive for all of surface, remove this component -->
  <div class="header-adaptive-ctn">
    <div class="header-adaptive pos-rel">
      <!-- logo | search bar | info + term + cart -->
      <div class="flex space-between top-block" :class="{ 'on-search-focus': isSearchFocus }">
        <h1 class="m-0 left-side">
          <span class="heading-cls">{{ heading }}</span>
          <a :href="headingHref" class="logo-head">
            <i :is="LogoComp" class="logo-cls" title="" />
          </a>
          <div class="devide-col" style="margin-top: 12px;"></div>
          <a href="/post/46/17704" class="flex" style="margin-top: 12px;">
            <ComingSoon class="coming-soon" />
          </a>
        </h1>
        <div class="flex mid right-side">
          <SearchBar @onSearchFocus="(val) => isSearchFocus = val" ref="SearchBar" style="margin-top: 12px;" />
          <ul class="header-icon-list ml-10" style="margin-top: 12px;">
            <template v-for="(icon, index) in icons">
              <li
                class="header-icon-item"
                v-if="icon.isShow"
                :key="'oslF8'+index"
                :class="[
                  icon.comp.toLowerCase(),
                ]"
                style="min-width: 56px;"
              >
                <a :href="icon.url" class="header-icon-item-link pos-rel">
                  <i class="icon-cls" :is="icon.comp" :class="icon.classes" />
                  <span :style="icon.style" v-html="icon.title"></span>
                </a>
                <span v-if="icon.url === '/cart' && $store.state.cartCnt" class="show-cart flex mid center">
                  {{ $store.state.cartCnt }}
                </span>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <!-- menu | login info -->
      <div class="flex space-between mid bottom-block">
        <Menu :data="menuData" />
        <UserInfo class="h-full" />
      </div>
      <NotiBox />
      <no-ssr>
        <div
          class="seller-box flex mid center"
          v-if="isShowSeller()"
          :style="{ width: $store.state.user.id ? 'calc(25% + 12px)' : null }"
          @click="onSellerBoxClick"
        >
          <span>{{ $t(16) }}</span>
        </div>
      </no-ssr>
    </div>
  </div>
</template>

<script>
import ComingSoon from '@@/../components/icons/ComingSoon.vue'
import Logoja from '@@/../components/icons/Logoja.vue'
import Logoen from '@@/../components/icons/Logoen.vue'
import Logoth from '@@/../components/icons/Logoth.vue'
import Logovi from '@@/../components/icons/Logovi.vue'
import Wrench from '@@/../components/icons/Wrench.vue'
import HandShake from '@@/../components/icons/HandShake.vue'
import Cart from '@@/../components/icons/Cart.vue'
import BookOpen from '@@/../components/icons/BookOpen.vue'
import SearchBar from './SearchBar.vue'
import UserInfo from '@@/../components/header/HeaderResponsive/UserInfo.vue'
import Menu from './Menu.vue'
import NotiBox from '@@/../components/header/NotiBox.vue'
import i18n from '@@/lang/components-desktop/header-responsive.json'
import { SELLER_BOX_DISPLAY_PATH_REG } from '@@/../utils/constants'

export default {
  i18n: { messages: i18n },
  components: {
    ComingSoon,
    Logoja,
    Logoen,
    Logoth,
    Logovi,
    Cart,
    BookOpen,
    SearchBar,
    UserInfo,
    Menu,
    NotiBox,
    Wrench,
    HandShake,
  },
  computed: {
    prefix() {
      if (this.langSupported().includes(this.$i18n.locale)) {
        return `/${this.$i18n.locale}`
      }
      return ''
    },
    headingHref() {
      let langs = this.langSupported(),
        lang = this.$i18n.locale
      if (langs.includes(lang)) {
        return `/${lang}`
      }
      return '/'
    },
    LogoComp() {
      if (this.langSupported().includes(this.$i18n.locale)) {
        return `Logo${this.$i18n.locale}`
      }
      return 'Logoja'
    },
    heading() {
      let path = this.$route.path,
        bcRoutes = this.$store.state.bcRoutes || []
      if (this.h1Obj[path]) {
        return this.h1Obj[path]
      } else if (bcRoutes.length) {
        let item = bcRoutes.slice(-1)[0] || {}
        return item.name || this.$t('breadcrumbs02')[item.path] || 'GogoJungle'
      } else {
        return 'GogoJungle'
      }
    },
    icons() {
      return [
        {
          comp: 'Wrench',
          title: this.$t('19'),
          url: this.prefix + '/crowdsourcing',
          isShow: true,
          classes: "icon-wrench"
        },
        {
          comp: 'HandShake',
          title: this.$t('20'),
          url: this.prefix + '/post/1/15356',
          isShow: true,
          classes: "icon-handshake"
        },
        {
          comp: 'BookOpen',
          title: this.$t('5'),
          url: this.$t('guideUrl'),
          isShow: true,
        },
        {
          comp: 'Cart',
          title: this.$t('4'),
          url: '/cart',
          isShow: true,
        },
      ]
    },
  },
  data() {
    return {
      h1Obj: {
        '/systemtrade': this.$t('h1-heading.1'),
        '/systemtrade/fx': this.$t('h1-heading.2'),
        '/systemtrade/stocks': this.$t('h1-heading.3'),
      },
      isSearchFocus: false,
      menuData: {}
    }
  },
  mounted() {
    this.GoGoHTTP.get('/api/v3/surface/cart/count').then(data => {
      this.$store.commit('setCartCount', data.count || 0)
    })
    this.GoGoHTTP.get('/api/v3/surface/menu').then(data => {
      this.menuData = data || {}
    })
  },
  methods: {
    isShowSeller() {
      if (!process.browser || this.$store.state.user.isDeveloper === 2) {
        return false
      }
      return !SELLER_BOX_DISPLAY_PATH_REG.test(location.pathname)
    },
    onSellerBoxClick() {
      if (this.$store.state.user.id) {
        location.href = '/mypage/display/download/input'
      } else {
        location.href = '/post/1/15363'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@@/../common/assets/variables.scss";
/deep/ .ctn-icon {
  height: 27px !important;
  width: 27px !important;
  .user-ava {
    height: 33px !important;
    width: 33px !important;
  }
  .icon-cls.search-icon {
    display: none;
  }
}
/deep/ .ctn1 {
  b {
    display: inline !important;
  }
  &.user-ava-ctn {
    display: none !important;
  }
  &.user-ava-ctn2 {
    display: flex !important;
    .ctn-icon {
      width: 27px !important;
      height: 27px !important;
    }
  }
  .dropdown-user-info {
    @media only screen and (max-width: 1024px) {
      left: auto;
      right: 0;
    }
  }
}
.header-adaptive-ctn {
  box-shadow: 0 0 6px #888;
  z-index: 1000;
  min-width: 1000px;
  @media only screen and (max-device-width: 1024px) {
    width: 1025px;
    padding: 0 10px;
  }
  /deep/ .noti-box-ctn.in .noti-box {
    position: absolute;
    right: 0;
    top: 0;
  }
}
.header-adaptive {
  // max-width: 100vw;
  margin: 0 auto;
  z-index: 1000;
  width: 1000px;
  /deep/ .logo-cls {
    transform: translateY(-5px);
  }
  .bottom-block {
    @media only screen and (min-width: $screen-sm) {
      height: 50px;
    }
  }
  .top-block {
    align-items: center;
    overflow: hidden;
    // height: 105px; // only css for IP5
    flex-wrap: wrap;
    justify-content: space-between;
    // css for MB > IP5
    @media only screen and (min-width: 365px) {
      height: 60px;
      flex-wrap: nowrap;
    }
    .left-side {
      transition: all 0.7s;
      // padding-right: 40px;
      // margin-right: 7px;
      @media only screen and (min-width: $screen-sm) {
        margin-right: 20px;
      }
      .heading-cls {
        position: fixed;
        z-index: -1;
        top: -300px;
      }
      // .logo-head /deep/ .logo-cls {
      //   max-height: 51px;
      //   max-width: 180px;
      // }
    }
    .right-side {
      flex-grow: 1;
      .auth-block {
        transition: all 0.7s;
      }
    }
    &.on-search-focus {
      .left-side {
        transform: translateX(-200px);
        opacity: 0;
      }
      .right-side .auth-block {
        transform: translateX(200px);
        opacity: 0;
      }
    }
  }
}
.header-icon-list {
  display: flex;
  list-style: none;
  margin-bottom: 0;
  padding-left: 5px;
  flex: 1 0 auto;
  justify-content: flex-end;
  .header-icon-item {
    cursor: pointer;
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    padding: 4px 0 4px 0;
    border-radius: 4px;
    &:not(:last-child) {
      margin-right: 16px;
    }
    &:hover {
      // background: #eef7fc;
      opacity: 0.8;
    }
    .header-icon-item-link {
      display: inline-flex;
      color: #333;
      text-decoration: none;
      align-content: center;
      align-items: center;
      span {
        line-height: 30px;
      }
      /deep/ i {
        width: 24px;
        height: 24px;
        color: #888;
        margin-right: 4px;
        transform: translateY(-2px);
      }
      .header-icon-item-title {
        color: #666;
        font-size: 12px;
        line-height: 12px;
        padding: 0 10px;
        margin-top: 1px;
        border-right: 1px solid #ccc;
        > div {
          white-space: nowrap;
        }
      }
      .icon-wrench {
        width: 17px;
        height: 17px;
      }
      .icon-handshake {
        width: 34px;
        height: 34px;
        /deep/ svg {
          path {
            fill: #888;
          }
        }
      }
    }
    &:last-child {
      .header-icon-item-title {
        border-right: none;
      }
    }
    .show-cart {
      position: absolute;
      top: -3px;
      left: 24px;
      background: #ff6900;
      color: white;
      font-size: 10px;
      border-radius: 50%;
      width: 18px;
      height: 18px;
    }
  }
}
.seller-box {
  height: 70px;
  width: calc(33% + 12px);
  position: fixed;
  right: 0;
  background: #d14239;
  bottom: 0;
  border-top-left-radius: 62px;
  color: #fff;
  padding: 4px 0 0 21px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 0 3px #353535;
  cursor: pointer;
  @media only screen and (min-width: $screen-xs) {
    width: 180px !important;
    padding: 4px 0 0 4px;
    height: 60px;
    transition: all 0.1s;
    &:hover {
      transform: scale(1.1);
    }
  }
}
@media only screen and (max-device-width: 1024px) {
  html,
  body {
    width: 1025px;
  }
}
.logo-head {
  width: 150px;
  height: 60px;
  svg {
    width: 100%;
    height: 100%;
  }
}
.coming-soon {
  width: 52px;
  height: 26px;
  @media only screen and (min-width: $screen-xs) {
    width: 70px;
    height: 34px;
  }
  @media only screen and (min-width: $screen-sm + 1) {
    width: 76px;
    height: 37px;
  }
}
.left-side {
  display: flex;
  align-items: center;
}
.devide-col {
  height: 17px;
  border-right: 1px solid #ccc;
  margin: 0 7px;
  @media only screen and (min-width: $screen-sm) {
    margin: 0 13px;
  }
}
</style>
