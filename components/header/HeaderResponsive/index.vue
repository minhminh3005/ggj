<template>
  <div class="header-responsive-ctn">
    <div class="header-responsive pos-rel">
      <!-- logo | search bar | info + term + cart -->
      <div class="flex space-between top-block">
        <h1 class="m-0 left-side">
          <span class="heading-cls">{{ heading }}</span>
          <a :href="headingHref" class="logo-head">
            <i :is="LogoComp" class="logo-cls" title="" />
          </a>
          <div class="devide-col hidden-xs hidden-sm" style="margin-top: 12px;"></div>
          <a href="/post/46/17704" class="hidden-xs hidden-sm flex mid" style="margin-top: 12px;">
            <ComingSoon class="coming-soon" />
          </a>
        </h1>
        <SearchBar style="margin-top: 12px;" />
        <ul class="header-icon-list hidden-xs hidden-sm ml-10" style="margin-top: 12px;">
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
        <UserInfo class="hidden-md hidden-lg flex" :class="{'user-info': $store.state.user.id}" />
      </div>
      <!-- menu | login info -->
      <div class="flex space-between mid bottom-block">
        <Menu :data="menuData" />
        <a href="/post/46/17704" class="hidden-md hidden-lg flex mid" style="justify-content: flex-end;">
          <ComingSoon class="coming-soon coming-soon-mobile" />
        </a>
        <UserInfo class="hidden-xs hidden-sm h-full" style="width: 45%;" />
      </div>
      <NotiBox ref="notiBox" />
    </div>
  </div>
</template>

<script>
// import i18n from '@@/lang/components-desktop/header.json'
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
import UserInfo from './UserInfo.vue'
import Menu from './Menu.vue'
import NotiBox from '@@/../components/header/NotiBox.vue'
import i18n from '@@/lang/components-desktop/header-responsive.json'
import { isAgentMobile } from '@/utils/client/common'

export default {
  i18n: { messages: i18n },
  props: {
    is404: {
      type: Boolean,
      default: false
    }
  },
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
      if(this.$route) {
        let path = this.$route.path,
          bcRoutes = this.$store.state.bcRoutes || []
        if (this.h1Obj[path]) {
          return this.h1Obj[path]
        } else if (bcRoutes.length && !path.includes(this.hideHeading)) {
          let item = bcRoutes.slice(-1)[0] || {}
          return item.name || this.$t('breadcrumbs02')[item.path] || 'GogoJungle'
        } else {
          return 'GogoJungle'
        }
      }else {
        return 'GogoJungle'
      }
    },
    prefix() {
      if (this.langSupported().includes(this.$i18n.locale)) {
        return `/${this.$i18n.locale}`
      }
      return ''
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
      hideHeading: ['/faq'],
      menuData: {},
      lastScrollTop: 0,
      minHeight: 0,
    }
  },
  mounted() {
    this.GoGoHTTP.get('/api/v3/surface/cart/count').then(data => {
      this.$store.commit('setCartCount', data.count || 0)
    })
    this.GoGoHTTP.get('/api/v3/surface/menu').then(data => {
      this.menuData = data
    })

    // hide/show some element on scroll
    // add/remove class "on-scroll"
    // add/remove class "scroll-up"
    this.addScrollBehavior()
  },
  methods: {
    addScrollBehavior() {
      const footer = document.querySelector("#__layout > div > div.footer")
      this.isEnableScroll() && document.addEventListener('scroll', () => {
        const scroll = document.body.scrollTop || document.documentElement.scrollTop
        
        // fixing for safari, cancel if scroll to the end of page 
        if(footer.getBoundingClientRect().top < 100) {
          return
        }

        // handle scroll
        if(scroll && scroll < this.lastScrollTop) {
          $(this.$el).addClass('scroll-up')
          document.body.style.marginTop = "165px"
        } else {
          $(this.$el).removeClass('scroll-up')
          document.body.style.marginTop = "0"
        }
        this.lastScrollTop = scroll <= 0 ? 0 : scroll
      })
    },
    isEnableScroll() {
      return !this.is404 && isAgentMobile(navigator.userAgent)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@@/../common/assets/variables.scss";
.header-responsive-ctn {
  box-shadow: 0 0 6px #888;
  z-index: 1020;
  background: #fff;
}
.header-responsive {
  padding: 0 10px 0 10px;
  max-width: 100vw;
  margin: 0 auto;
  z-index: 1000;
  // @media only screen and (min-width: $screen-sm) {
  //   padding: 6px 10px 0 10px;
  // }
  @media only screen and (min-width: $screen-md) {
    max-width: 1000px;
    padding: 0;
  }
  /deep/ .logo-cls {
    transform: translateY(-4px);
    @media only screen and (min-width: $screen-sm) {
      transform: translateY(-5px);
    }
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
      // margin-right: 7px;
      transition: all 0.7s;
      @media only screen and (min-width: $screen-sm) {
        margin-right: 20px;
      }
      .heading-cls {
        position: fixed;
        z-index: -1;
        top: -300px;
      }
      // .logo-head /deep/ .logo-cls {
        // max-width: 103px;
        // max-height: 51px;
        // @media only screen and (min-width: $screen-xs) {
        //   max-width: 150px;
        //   max-height: 51px;
        // }
        // @media only screen and (min-width: $screen-sm) {
        //   max-width: 180px;
        // }
      // }
    }
    .right-side {
      @media only screen and (min-width: $screen-sm) {
        flex-grow: 1;
      }
      .auth-block {
        transition: all 0.7s;
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
      margin-top: -9px;
      position: absolute;
      top: 8px;
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
@media only screen and (max-width: $screen-sm) {
  .scroll-up {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    background: #fff;
  }
}
.d-none {
  display: none !important;
}
.d-sm-block {
  @media only screen and (min-width: $screen-sm) {
    display: block !important;
  }
}
.d-sm-none {
  @media only screen and (min-width: $screen-sm) {
    display: none !important;
  }
}
.user-info {
  // width: 55%;
  padding-left: 10px;
  max-width: 160px;
  flex-grow: 1;
  @media only screen and (min-width: $screen-sm) {
    max-width: unset;
    padding-right: 5px;
  }
}
.header-responsive-ctn /deep/ .noti-box-ctn {
  position: relative;
  z-index: 1000;
  max-width: 100%;
  .noti-box {
    position: fixed;
    top: 0;
    right: 0;
    width: 100vw;
    box-shadow: -3px 2px 5px #606060;
    background: #fff;
    visibility: hidden;
    @media only screen and (min-width: $screen-sm) {
      position: absolute;
      max-height: calc(100vh - 178px);
      width: 480px;
      background: #fff;
      z-index: 10;
      transition: opacity 0.5s ease-out;
      opacity: 0;
    }
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
  &.coming-soon-mobile {
    width: 76px;
    height: 32px;
  }
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
