<template>
  <div id="btn-options-wapper">
    <button class="btn-cart-MS0sr btn-orange border-radius-5 w-full" @click="addToCart">
      <div class="flex mid center">
        <Cart />
        <span class="ver-mid">
          {{
            btnText || $t(info.externalUrl ? 19 : 1)
          }}
        </span>
      </div>
    </button>
    <!-- product paid options -->
    <ProductPaidOptions />
  </div>
</template>

<script>
import i18n from "@@/lang/components-desktop/payment-cartbutton.json"
import Cart from "@@/../components/icons/Cart.vue"
import ProductPaidOptions from "../../product/ProductPaidOptions.vue"

export default {
  components: { 
    Cart,
    ProductPaidOptions, 
  },
  i18n: {
    messages: i18n,
  },
  props: {
    btnText: String,
  },
  data() {
    return {
      cartProcesssing: false,
    }
  },
  computed: {
    info() {
      return this.$store.state.cart.info
    },
  },
  methods: {
    async addToCart() {
      if (this.cartProcesssing) {
        return
      }
      this.cartProcesssing = true
      if (this.info.externalUrl) {
        location.href = this.info.externalUrl
        return
      }
      this.$store.dispatch("cart/addToCart", {
        productId: this.info.productId,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.btn-orange {
  padding: 5px 25px;
  font-size: 16.5px;
  text-decoration: none;
  color: #fff;
  position: relative;
  display: inline-block;
  outline: none;
  background-color: #ff8500;
  box-shadow: 0 5px 0 0 #b84d03;
  border: none;
  &:hover {
    outline: none;
    background-color: #ff9929;
  }
  &:active {
    transform: translate(0, 5px);
    -webkit-transform: translate(0, 5px);
    box-shadow: 0 1px 0 0;
  }
}
.border-radius-5 {
  border-radius: 5px;
}
.icon-cls {
  width: 30px;
  height: 34px;
}
.lh-16 {
  line-height: 16px;
}
.ver-mid {
  vertical-align: middle;
}
/deep/ #list-product {
  padding-left: 4%;
}
#btn-options-wapper:hover {
  /deep/ #list-product {
    display: block;
  }
  /deep/ #btn-show-product {
    border-bottom: none;
    .rotate {
      transform: rotate(90deg);
    }
  }
}
</style>
