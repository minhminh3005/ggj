<template>
  <button class="btn flex mid center w-full mt-10" @click="onClicked">
    <DevFeeCart class="shoping-cart-large" />
    <span class="ver-mid">{{ $t('24') }}</span>
  </button>
</template>

<script>
import i18n from '@@/lang/components-desktop/payment-cartbutton.json'
import DevFeeCart from '@@/../components/icons/DevFeeCart.vue'

export default {
  components: { DevFeeCart },
  i18n: {
    messages: i18n,
  },
  computed: {
    info() {
      return this.$store.state.cart.info
    },
  },
  data() {
    return {
      cartProcesssing: false,
    }
  },
  props: {
    btnText: String,
  },
  methods: {
    async onClicked() {
      if (this.cartProcesssing) {
        return
      }
      this.cartProcesssing = true
      this.$store.dispatch('cart/addToCart', {
        productId: this.info.productId,
        isDevFee: 1,
      })
    },
  },
}
</script>


<style lang="scss" scoped>
.btn {
  height: 50px;
  background: #ff8500;
  font-size: 20px;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  outline: none;
}
.icon-cls {
  width: 22px;
  height: 22px;
}
</style>
