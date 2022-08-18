<template>
  <div>
    <template v-if="info.status === 1">
      <CartAuthBtnM v-if="isPassword !== 0 && productStatus !== 1" :get-product-password="getProductPassword" />
      <BuyedCartButtton v-else-if="info.isPurchased" />
      <ActiveCartBtn v-else />
      <div v-if="info.isDevFee">
        <p class="recommend-title">
          <span>{{ $t('25') }}</span>
        </p>
        <ActiveDevFeeCartBtn class="cart-btn mt-10" />
      </div>
      <!-- product paid options -->
      <ProductPaidOptions v-if="!info.isPurchased" />
    </template>
    <template v-else>
      <DeactiveCartBtn :cate="1" />
    </template>
    <div v-if="info.isEstimate" class="tooltip-estimate">
      <a @click="checkLoginEstimate" id="request-a-quote" class="flex mid center btn-req-skillshare w-full"><PenSolid />{{ $t('27') }}</a>
      <!-- <a href="https://www.gogojungle.co.jp/post/1/17014" data-html="true" type="button" class="gui-estimate" data-toggle="tooltip" data-placement="right" :title="$t('21')">
        ?
      </a> -->
      <div class="gui-es-v2">
        <a href="https://www.gogojungle.co.jp/post/1/17014">{{ $t('27') }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import ActiveCartBtn from './ActiveCartBtn.vue'
import DeactiveCartBtn from './DeactiveCartBtn.vue'
import PenSolid from '@@/../components/icons/PenSolid.vue'
import BuyedCartButtton from './BuyedCartButtton.vue'
import CartAuthBtnM from './CartAuthBtnM.vue'
import ProductPaidOptions from '@/components/product/ProductPaidOptions.vue'
import i18n from '@@/lang/components-desktop/payment-cartbutton.json'
import ActiveDevFeeCartBtn from "./ActiveDevFeeCartBtn"
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    ActiveDevFeeCartBtn,
    PenSolid,
    ActiveCartBtn,
    BuyedCartButtton,
    DeactiveCartBtn,
    CartAuthBtnM,
    ProductPaidOptions,
  },
  props: {
    btnText: String,
    getProductPassword: Function,
  },
  computed: {
    userId() {
      return parseInt(this.$store.state.user.id)
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
  font-weight: normal;
  box-shadow: 0 1px 1px #85b427;
  cursor: pointer;
  margin-top: 16px;
  background-color: #a4ce51;
  color: white;
  line-height: 30pt;
  border-radius: 3px;
  padding: 8pt 0 7pt 0;
  font-size: 20pt;
  &:hover {
    text-decoration: none;
    background-color: #85b427;
    color: white;
  }
  .icon-cls {
    width: 21pt;
    height: 21pt;
    margin-right: 8px;
  }
}
.tooltip-estimate /deep/ {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .gui-es-v2 {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    a {
      font-size: 13pt;
      line-height: 20pt;
      color: #337ab7;
    }
  }
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