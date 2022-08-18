<template>
  <div class="navbar-mobile-ctn pos-rel">
    <div class="navbar-mobile flex">
      <a class="nav-item" v-if="$store.state.user.id" href="/mypage">
        <User />
        <div>{{ $t(13) }}</div>
      </a>
      <a class="nav-item" href="/info">
        <CommentDots />
        <div>{{ $t(51) }}</div>
      </a>
      <a class="nav-item pos-rel " href="/cart">
        <Cart />
        <div>{{ $t(4) }}</div>
        <span class="cart-num" v-if="$store.state.cartCnt">{{ $store.state.cartCnt }}</span>
      </a>
      <no-ssr>
        <div class="nav-item" style="border-left: none;" v-if="isShowSeller()">
        </div>
      </no-ssr>
    </div>
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
</template>

<script>
import CommentDots from '@@/../components/icons/CommentDots.vue'
import Cart from '@@/../components/icons/Cart.vue'
import User from '@@/../components/icons/User2.vue'
import i18n from '@@/lang/components-desktop/header-responsive.json'
import { SELLER_BOX_DISPLAY_PATH_REG } from '@@/../utils/constants'
export default {
  i18n: { messages: i18n },
  components: {
    CommentDots,
    Cart,
    User,
  },
  methods: {
    isShowSeller() {
      if(!process.browser || this.$store.state.user.isDeveloper === 2) {
        return false
      }
      return !SELLER_BOX_DISPLAY_PATH_REG.test(location.pathname)
    },
    onSellerBoxClick() {
      if(this.$store.state.user.id) {
        location.href = '/mypage/display/download/input'
      } else {
        location.href = '/post/1/15363'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@@/../common/assets/variables.scss";
.navbar-mobile-ctn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  z-index: 999;
  .navbar-mobile {
    position: fixed;
    bottom: 0;
    height: 48px;
    background: #5b5b5b;
    left: 0;
    width: 100vw;
    box-shadow: 0 0 4px 2px black;
    @media only screen and (min-width: $screen-sm) {
      display: none !important;
    }
    .nav-item {
      width: 100%;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      @media only screen and (min-width: $screen-xs) {
        font-size: 16px;
      }
      &:not(:first-child) {
        border-left: 1px solid #8a8a8a;
      }
      /deep/ .icon-cls {
        width: 22px;
        height: 22px;
      }
      .cart-num {
        position: absolute;
        display: flex;
        background: #d14239;
        min-width: 18px;
        height: 18px;
        justify-content: center;
        align-items: center;
        top: 6px;
        left: calc(50% + 2px);
        border-radius: 30px;
      }
    }
  }
}
.seller-box {
  height: 60px;
  width: calc(33% + 12px);
  position: absolute;
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
</style>
