<template>
  <div class="type01-cart-button">
    <template v-if="info.status === 1">
      <AuthCartBtn
        v-if="isPassword !== 0 && productStatus !== 1"
        :get-product-password="getProductPassword"
      />
      <ActiveCartBtn class="cart-btn" v-else />
      <div v-if="info.isDevFee">
        <p class="recommend-title">
          <span>{{ $t('25') }}</span>
        </p>
        <ActiveDevFeeCartBtn class="cart-btn mt-10" />
      </div>
    </template>
    <template v-else>
      <DeactiveCartBtn class="cart-btn" />
    </template>
  </div>
</template>

<script>
import i18n from "@@/lang/components-desktop/payment-cartbutton.json"
import ActiveCartBtn from "./ActiveCartBtn.vue"
import AuthCartBtn from "./AuthCartBtn.vue"
import DeactiveCartBtn from "./../DeactiveCartBtn.vue"
import ActiveDevFeeCartBtn from "./ActiveDevFeeCartBtn"

export default {
  components: { ActiveDevFeeCartBtn, ActiveCartBtn, AuthCartBtn, DeactiveCartBtn },
  i18n: {
    messages: i18n,
  },
  props: {
    getProductPassword: {
      type: Function,
    },
  },
  computed: {
    productStatus() {
      return this.$store.state.cart.productStatus
    },
    isPassword() {
      return this.$store.getters["cart/isPassword"]
    },
    info() {
      return this.$store.state.cart.info
    },
  },
}
</script>

<style lang="scss" scoped>
.type01-cart-button /deep/ .btn-cart-I8XMC {
  width: 260px;
  height: 62px;
  margin: 0 auto;
}
.recommend-title {
  margin-top: 15px;
  margin-bottom: 25px;
  display: block;
  height: 11px;
  border-bottom: solid 1px #ccc;
  text-align: center;
  span {
    display: inline-block;
    background-color: #fff;
    padding: 0 10px;
    font-weight: bold;
    font-size: 15px;
    color: #0f3e9e;
  }
}
</style>
