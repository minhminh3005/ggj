<template>
  <div style="display: flex; flex-direction: column;">
    <template v-if="info.status === 1">
      <CartAuthBtn v-if="isPassword !== 0 && productStatus !== 1" :get-product-password="getProductPassword" />
      <ActiveCartBtn v-else />
    </template>
    <template v-else>
      <DeactiveCartBtn :cate="1" />
    </template>
    <div v-if="info.isEstimate" class="tooltip-estimate">
      <a @click="checkLoginEstimate" id="request-a-quote" class="flex mid center btn-req-skillshare w-full"><PenSolid />{{ $t(28) }}</a>
      <div class="gui-es-v2">
        <a href="https://www.gogojungle.co.jp/post/1/17014">{{ $t(28) }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/payment-cartbutton.json'
import ActiveCartBtn from './ActiveCartBtn.vue'
import PenSolid from '@@/../components/icons/PenSolid.vue'
import CartAuthBtn from './CartAuthBtn.vue'
import DeactiveCartBtn from './../DeactiveCartBtn.vue'

export default {
  components: { ActiveCartBtn, CartAuthBtn, DeactiveCartBtn, PenSolid },
  i18n: {
    messages: i18n,
  },
  props: {
    btnText: String,
    getProductPassword: Function,
  },
  computed: {
    userId() {
      return this.$store.state.user.id
    },
    productStatus() {
      return this.$store.state.cart.productStatus
    },
    isPassword() {
      return this.$store.getters['cart/isPassword']
    },
    info() {
      return this.$store.state.cart.info
    },
  },
  mounted(){
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  },
  methods:{
    checkLoginEstimate(){
      if(this.userId){
        location.href = `/estimate/${(this.info || {}).devId}/${(this.info || {}).productId}`
      } else{
        location.href = `/login?u=${this.$route.fullPath}`
      } 
    }
  }
}
</script>
<style lang="scss" scoped>
.btn-req-skillshare {
  margin-bottom: 6px;
  background-color: #a4ce51;
  color: white;
  cursor: pointer;
  font-weight: normal;
  border-radius: 5px;
  padding: 10px 0;
  font-size: 17px;
  line-height: 25px;
  box-shadow: 0 1px 1px #85b427;
  &:hover {
    text-decoration: none;
    color: white;
    background-color: #85b427;
  }
  .icon-cls {
    width: 18px;
    height: 18px;
    margin-right: 6px;
  }
}
.tooltip-estimate /deep/ {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .gui-es-v2 {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    a {
      font-size: 12px;
      line-height: 18px;
      color: #337ab7;
    }
  }
  .gui-estimate {
    text-decoration: none;
    outline: none;
    cursor: pointer;
    background: #a4d1ff;
    margin-left: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    width: 20px;
    height: 18px;
    font-weight: bold;
    color: white;
    border: none;
    border-radius: 50%;
  }
  .tooltip-inner {
    max-width: 178px;
    padding: 15px 11px;
    text-align: left;
    font: 13px/20px;
    color: #fff;
    border-radius: 5px;
    opacity: 1;
  }
}
</style>