<template>
  <div id="btn-options-wapper2">
    <button
      class="btn-cart-I8XMC flex mid center mb-5 orange"
      @click="addToCart"
    >
      <Cart class="shoping-cart mr-5" />
      <div v-if="info.status">
        <span class="ver-mid">{{ $t(info.externalUrl ? 19 : 1) }}</span>
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
  i18n: {
    messages: i18n,
  },
  components: {
    Cart, 
    ProductPaidOptions,
  },
  data() {
    return {
      cartProcessing: false,
    }
  },
  computed: {
    info() {
      return this.$store.state.cart.info
    },
    favTitle() {
      if (!this.$store.state.user.id) {
        return this.$t("11")
      }
      return this.info.isFavorite ? this.$t("12") : this.$t("13")
    },
  },
  methods: {
    async addToCart() {
      if (this.cartProcessing) {
        return
      }
      this.cartProcessing = true
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
.btn-cart-I8XMC {
  width: 260px;
  height: 62px;
  line-height: 52px;
  text-decoration: none;
  color: #fff;
  position: relative;
  border: none;
  outline: none;
  font-size: 22px;
  border-radius: 4px;
  &:hover {
    opacity: 0.85;
  }
  > span {
    margin-top: 2px;
  }
}
.orange {
  background-color: #ff8500;
}
.shoping-cart {
  width: 34px;
  height: 34px;
}
.ver-mid {
  vertical-align: middle;
}
.heart {
  border-radius: 50%;
  background: #ec5665;
  width: 35px;
  height: 35px;
  &:hover {
    opacity: 0.9;
  }
}
.heart-icon {
  margin-top: 2px;
  width: 20px;
  height: 20px;
  color: white;
}
.heart-number {
  font-size: 20px;
  color: #ec5665;
}
#btn-options-wapper2 {
  /deep/ #btn-show-product {
    width: 260px;
  }
}
#btn-options-wapper2:hover {
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
/deep/ #list-product {
  left: -21px !important;
  right: -21px !important;
  border-right: 1px solid #bababa !important;
  border-bottom: 1px solid #bababa !important;
  border-left: 1px solid #bababa !important;
  border-bottom-right-radius: 5px !important;
  border-bottom-left-radius: 5px !important;
  padding-left: 10px;
}
/deep/ .c-label {
  &::before {
    right: 11px !important;
    left: 11px !important;
    width: calc(100% - 31px) !important;
  }
}
</style>
