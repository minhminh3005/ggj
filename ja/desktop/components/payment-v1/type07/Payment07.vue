<template>
  <div class="w-full pt-20 flex flex-wrap">
    <div class="col-xs-12 col-md-6 pl-0 pr-0 text-center pb-15" style="font-weight: bold;">
      <!-- old price -->
      <div v-if="info.oldPrice">
        <strong>{{ $t("16") }}:<span style="text-decoration: line-through;">￥{{ formatNumber(info.oldPrice) }}{{ $t(5) }}</span></strong>
      </div>

      <!-- current price -->
      <div v-if="infoPrice">
        <span style="font-size: 28px; color: red;">￥{{ formatNumber(infoPrice) }} <span style="font-size: 17px;">{{ $t(5) }}</span></span>
      </div>

      <!-- free -->
      <div v-else class="text-center" style="color: red; font-size: 30px;">
        <b>{{ $t(6) }}</b>
      </div>
      
      <!-- price percent decrease -->
      <div class="fs-15" style="color: red;" v-if="info.oldPrice">
        <span>({{ Math.floor(((info.oldPrice - info.price) / info.oldPrice) * 100) }}%OFF)</span>
      </div>
      <div class="mb-10 flex mid center" v-if="info.price && info.isSub">
        <b v-if="info.isYearly" class="ml-5 fs-18">{{ $t("28") }}</b>
        <b v-else class="ml-5 fs-18">{{ $t("19") }}</b>
        <b class="ml-5 fs-18" v-if="info.isFFM">{{ $t("20") }}</b>
      </div>
      <div class="fs-13 mt-15" v-if="info.discountStart">
        <div>{{ $t(23) }}: </div>
        <span style="color: red;">{{ formatTime(info.discountStart, 0) }}～<br />{{ formatTime(info.discountEnd, 0) }}</span>
      </div>
    </div>
    <div class="col-xs-12 col-md-6 pl-0 pr-0 flex center layout-col cart-btn-ctn">
      <!-- cart button -->
      <CartButton :get-product-password="getProductPassword " />
    </div>
  </div>
</template>

<script>
import CartButton from "./CartButton.vue"
import i18n from "@@/lang/components-desktop/payment-payment.json"

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    CartButton,
  },
  computed: {
    infoPrice() {
      return this.info.price + this.priceOptionsSelected
    },
    userId() {
      return this.$store.state.user.id
    },
    info() {
      return this.$store.state.cart.info
    },
    payments() {
      return this.$store.getters["cart/payments"]
    },
    priceOptionsSelected() {
      return this.$store.getters['cart/getPriceOptionsSelected']
    },
    isPassword() {
      return this.$store.getters["cart/isPassword"]
    },
  },
  methods: {
    getProductPassword(password) {
      return this.GoGoHTTP.post(
        `/api/v3/surface/review/product/${this.info.productId}/info`,
        { pagePassword: password }
      ).then(data => {
        if (Object.keys(data).length === 0) {
          data = {}
        }
        if (this.isPassword === 1 && data.passwordStatus == 0) {
          this.$store.commit('cart/productStatus', 0)
        } else if (this.isPassword === 1 && data.passwordStatus == 1) {
          this.$store.commit('review-detail/productInfo', data)
          this.$store.commit('cart/setCart', data.cartInfo)
          this.$store.commit('cart/productStatus', 1)
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.cart-btn-ctn {
  padding: 0 20px 0;
  max-width: 300px;
  margin: 0 auto;
  @media only screen and (min-width: @screen-md) {
    padding: 0;
  }
}
</style>