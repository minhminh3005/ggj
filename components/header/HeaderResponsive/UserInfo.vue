<template>
  <div>
    <!-- non login -->
    <div class="flex h-full mid ctn0" style="flex-grow: 1; justify-content: flex-end;" v-if="!$store.state.user.id">
      <div class="ctn1 hidden-md hidden-lg flex mid h-60" style="margin-right: 8px;" @click="$nuxt.$emit('focusSearch', true)">
        <div class="ctn-icon search">
          <Search style="color: #8a8a8a;" class="search-icon" />
        </div>
      </div>
      <a class="h-60 flex mid no-underlying" :href="`${prefixUrl}/register?${buildGetParams()}`"><button class="btn btn-register mb-5 mt-5 fs-15"><span class="visible-xs">{{ $t(8) }}</span><span class="hidden-xs">{{ $t(9) }}</span></button></a>
      <a class="h-60 flex mid no-underlying" :href="`${prefixUrl}/login?${buildGetParams()}`"><button class="btn btn-login ml-5 mb-5 mt-5 fs-15">{{ $t(10) }}</button></a>
    </div>
    <!-- logged in -->
    <div class="flex h-full mid ctn0" style="flex-grow: 1;" v-else>
      <!-- search icon -->
      <div class="ctn1 hidden-md hidden-lg flex" @click="$nuxt.$emit('focusSearch', true)">
        <div class="ctn-icon">
          <Search style="color: #8a8a8a;" class="search-icon" />
        </div>
      </div>
      <!-- notify info -->
      <a class="ctn1 pos-rel no-underlying" href="/info">
        <div class="pos-rel ctn-icon bull-icon">
          <Bullhorn class="bell-icon" style="color: #8a8a8a;" />
        </div>
        <b class="fs-13 hidden-xs hidden-sm ml-5">{{ $t(51) }}</b>
      </a>
      <!-- notify icon -->
      <div class="ctn1 pos-rel bell-icon-ctn" @click="$nuxt.$emit('toggleShowNotification')">
        <div class="pos-rel ctn-icon">
          <Bell class="bell-icon" style="color: #8a8a8a;" />
          <div v-if="countInfo.total" class="center flex mid num">{{ countInfo.total > 100 ? '99+' : countInfo.total }}</div>
        </div>
        <b class="fs-13 hidden-xs hidden-sm flex mid">{{ $t(11) }}</b>
      </div>
      <!-- user ava -->
      <div class="ctn1 pos-rel user-ava-ctn" style="text-decoration: none; margin-right: 1px;" @click="dropDownUserInfo">
        <div class="pos-rel ctn-icon">
          <div class="pos-rel user-ava ctn-icon">
            <img :src="`/img/users/${$store.state.user.id}/small?v=1628678172577`" alt="" />
          </div>
        </div>
      </div>
      <div class="pos-rel user-ava-part">
        <a class="ctn1 user-ava-ctn2" :href="`/users/${$store.state.user.id}`" style="text-decoration: none; margin-right: 0;">
          <div class="pos-rel ctn-icon">
            <div class="pos-rel user-ava ctn-icon" @click="dropDownUserInfo">
              <img :src="`/img/users/${$store.state.user.id}/small?v=1628678172577`" alt="" />
            </div>
          </div>
          <div class="wrap-text">
            <b class="fs-13 hidden-xs hidden-sm ml-5">{{ $store.state.user.name || $t('21') }}</b>
          </div>
        </a>
        <div class="dropdown-user-info">
          <a class="dropdown-user-info-item" href="/mypage"><span style="color: #17a2b8;">{{ $t(13) }}</span></a>
          <a class="dropdown-user-info-item" href="/terms/service">{{ $t(14) }}</a>
          <a class="dropdown-user-info-item" href="/logout">{{ $t(15) }}</a>
        </div>
      </div>
    </div>
    <!-- menu overlay -->
    <div class="menu-overlay-ctn" v-if="isInfoOpen" @click.self="closeMenu">
      <div class="menu-overlay">
        <a class="item item-header" :href="`/users/${$store.state.user.id}`">
          <div class="center flex mid mr-5 pos-rel user-ava">
            <img :src="`/img/users/${$store.state.user.id}/small?v=1628678172577`" alt="" />
          </div>
          <b class="fs-13 flex mid">{{ $store.state.user.name || $t('21') }}</b>
        </a>
        <a class="item item-mypage" href="/mypage">{{ $t(13) }}</a>
        <a class="item" href="/crowdsourcing">{{ $t(19) }}</a>
        <a class="item" href="/post/1/15356">{{ $t(20) }}</a>
        <a class="item" href="/terms/service">{{ $t(14) }}</a>
        <a class="item" href="/post/1/15376">{{ $t(5) }}</a>
        <a class="item" href="/logout">{{ $t(15) }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import Search from '@@/../components/icons/Search.vue'
import Bell from '@@/../components/icons/Bell.vue'
import Bullhorn from '@@/../components/icons/Bullhorn.vue'
import i18n from '@@/lang/components-desktop/header-responsive.json'
export default {
  i18n: { messages: i18n },
  components: {
    Bell,
    Search,
    Bullhorn,
  },
  computed: {
    countInfo() {
      return this.$store.getters['notification/count'] || {}
    },
    prefixUrl() {
      if (this.langSupported().includes(this.$i18n.locale)) {
        return `/${this.$i18n.locale}`
      }
      return ''
    }
  },
  data() {
    return {
      isInfoOpen: false,
    }
  },
  methods: {
    dropDownUserInfo() {
      this.isInfoOpen = true
      if (process.env.ENV_TYPE == 'mobile') {
        document.body.style.overflow = 'hidden'
      }
    },
    closeMenu() {
      document.body.style.overflow = ''
      this.isInfoOpen = false
    },
    buildGetParams() {
      let q = this.$route.query,
        params = Object.keys(q)
          .map(e => `${e}=${q[e]}`)
          .join('&')
      return params
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@@/../common/assets/variables.scss";
.btn {
  border-radius: 3px;
  opacity: 1;
  color: #fff;
  height: 32px;
  line-height: 19px;
  padding: 0 4px;
  font-size: 11px;
  transition: all 0.3s;
  @media only screen and (min-width: $screen-xs) {
    font-size: 12px;
    height: 35px;
  }
  @media only screen and (min-width: $screen-sm) {
    min-width: 62px;
    height: 35px;
  }
  &:hover {
    font-weight: bold;
    box-shadow: 0 0 4px #17a2b8;
  }
  &:focus, &:focus-visible {
    outline: none;
  }
  &.btn-login {
    border-color: #17a2b8;
    color: #17a2b8;
    background: #fff;
  }
  &.btn-register {
    background: #17a2b8;
    color: #fff;
  }
}
.ctn0 {
  justify-content: flex-end;
  @media only screen and (min-width: $screen-sm) {
    justify-content: flex-end;
  }
}
.ctn1 {
  display: flex;
  cursor: pointer;
  height: 60px;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  a {
    color: #333;
  }
  .ctn-icon {
    height: 21px;
    width: 21px;
    justify-content: center;
    align-items: center;
    display: flex;
    position: relative;
    /deep/ .icon-cls.search-icon, /deep/ .icon-cls.bell-icon {
      height: 100%;
      width: 100%;
    }
    // &.bull-icon {
    //   height: 25px !important;
    //   width: 25px !important;
    // }
    .user-ava {
      $size-user-ava: 33px;
      height: $size-user-ava;
      width: $size-user-ava;
      border-radius: 34px;
      overflow: hidden;
      box-shadow: 0 0 0 1px #cfcfcf;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .num {
      position: absolute;
      left: 50%;
      top: -3px;
      min-width: 16px;
      height: 16px;
      background: red;
      color: #fff;
      border-radius: 54px;
      font-size: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  &.user-ava-ctn {
    text-decoration: none;
    .ctn-icon {
      width: 27px;
      height: 27px;
    }
    @media only screen and (min-width: $screen-md) {
      display: none;
    }
  }
  &.user-ava-ctn2 {
    display: none;
    color: #333;
    max-width: 160px;
    .ctn-icon {
      width: 27px;
      height: 27px;
    }
    @media only screen and (min-width: $screen-md) {
      display: flex;
    }
  }
  &:hover {
    @media only screen and (min-width: $screen-sm) {
      b {
        opacity: 0.8;
      }
    }
  }
  @media only screen and (min-width: $screen-sm) {
    margin-right: 10px;
  }
}
.user-ava-part:hover {
  .dropdown-user-info {
    display: block;
  }
}
.dropdown-user-info {
  width: 154px;
  position: absolute;
  top: 100%;
  right: 0;
  border: 1px solid #b5e5eb;
  display: none;
  background: #fff;
  box-shadow: 1px 5px 7px -5px grey;
  .dropdown-user-info-item {
    height: 40px;
    display: block;
    text-align: center;
    line-height: 40px;
    transition: all 0.3s;
    text-decoration: none;
    color: #333;
    &:hover {
      font-weight: bold;
      background: #e4fcff;
    }
  }
}
.visible-xs-flex {
  display: flex;
  @media only screen and (min-width: $screen-sm) {
    display: none !important;
  }
}
.menu-overlay-ctn {
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100vw;
  left: 0;
  z-index: 1;
  background: #2b2828a6;
  @media only screen and (min-width: $screen-md) {
    display: none;
  }
  .menu-overlay {
    max-width: 250px;
    width: calc(50vw + 10px);
    height: 100vh;
    background: #fff;
    margin-left: auto;
    box-shadow: 0 0 8px 3px #434343;
    .item {
      width: 100%;
      height: 51px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 26px;
      font-weight: bold;
      color: #333;
      text-decoration: none;
      &.item-header {
        background: #17a2b8;
        color: #fff;
        .user-ava {
          $size-user-ava: 21px;
          height: $size-user-ava;
          width: $size-user-ava;
          border-radius: 34px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      &.item-mypage {
        border-bottom: 1px solid #e1e1e1;
        color: #17a2b8;
      }
    }
  }
}
.h-60 {
  height: 60px;
}
</style>
