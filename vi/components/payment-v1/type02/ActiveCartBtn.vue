<template>
  <button class="btn orange border-radius-5 w-full" @click="addToCart">
    <div class="flex mid center">
      <Cart />
      <span class="ver-mid">{{ btnText || $t(info.externalUrl ? 19 : 1) }}</span>
    </div>
    <form
      ref="addCartForm"
      :action="info.externalUrl || `/cart/add/${info.productId}`"
      :method="info.externalUrl ? 'get' : 'post'"
    >
      <input type="hidden" name="add" value="1" />
    </form>
  </button>
</template>

<script>
import i18n from '@@/lang/components-desktop/payment-cartbutton.json'
import Cart from '@@/../components/icons/Cart.vue'
export default {
  components: { Cart },
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
      $(this.$refs.addCartForm).submit()
    },
  },
}
</script>

<style lang="scss" scoped>
.btn {
  padding: 5px 25px;
  font-size: 16.5px;
  text-decoration: none;
  color: #fff;
  position: relative;
  display: inline-block;
  outline: none;
}
.btn:active {
  transform: translate(0, 5px);
  -webkit-transform: translate(0, 5px);
  box-shadow: 0 1px 0 0;
}
.orange {
  background-color: #ff8500;
  box-shadow: 0 5px 0 0 #b84d03;
}
.orange:hover {
  outline: none;
  background-color: #ff9929;
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
</style>
