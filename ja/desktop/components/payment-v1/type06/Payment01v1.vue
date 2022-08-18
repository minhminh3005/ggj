<template>
  <div class="type01-payment">
    <!-- info price -->
    <div class="info-price mb-15">
      <div v-if="!info.isRangePrice" style="margin: 0 -20px;">
        <!-- old price -->
        <div
          v-if="info.oldPrice"
          id="oldPrice"
          class="flex center fs-18 mid space-around flex-wrap mb-5"
        >
          <strong class="mt-3">{{ $t("16") }}:</strong>
          <strong class="flex flex-wrap mid">
            <b class="line-through fs-22">￥{{ formatNumber(info.oldPrice) }}</b><b>{{ $t("5") }}</b>
          </strong>
        </div>

        <!-- current price -->
        <b
          v-if="infoPrice"
          id="currentPrice"
          style="white-space: nowrap;"
          class="co-red flex flex-wrap fs-34 mid center"
        >
          <span>￥{{ formatNumber(infoPrice) }}</span>
          <span class="co-red fs-20">{{ $t("5") }}</span>
        </b>

        <!-- free -->
        <div v-else class="co-red fs-30 text-center">
          <b>{{ $t("6") }}</b>
        </div>

        <!-- price percent decrease -->
        <div v-if="info.oldPrice" id="reducedPrice" class="fs-20 text-center mb-5">
          <strong class="rv-price co-red">({{ Math.floor(((info.oldPrice - info.price) / info.oldPrice) * 100) }}%OFF)</strong>
        </div>
        <div class="mb-10 flex mid center" v-if="info.price && info.isSub">
          <b v-if="info.isYearly" class="ml-5 fs-18">{{ $t("28") }}</b>
          <b v-else class="ml-5 fs-18">{{ $t("19") }}</b>
          <b class="ml-5 fs-18" v-if="info.isFFM">{{ $t("20") }}</b>
        </div>
      </div>

      <!-- cart button -->
      <CartButton01v1
        :get-product-password="getProductPassword"
      />

      <!-- web auth -->
      <div v-if="info.isAuth" class="web-auth fs-13 text-center mt-10 flex mid center">
        {{ $t(22) }}
      </div>

      <!-- campaign time -->
      <div
        v-if="info.discountStart && info.discountEnd"
        class="fs-16 flex layout-col" style="font-weight: bold;"
      >
        <b>{{ $t('23') }}</b>
        <b class="co-red">{{ formatTime(info.discountStart, 0) }}～</b>
        <b class="co-red">{{ formatTime(info.discountEnd, 0) }}</b>
      </div>

      <!-- dvd -->
      <!-- <template v-if="info.price && !info.externalUrl && info.isDvd">
        <div class="mb-10 flex mid mt-10">
          <CD class="cd-icon" />
          <b class="ml-5 fs-18">{{ $t("7") }}</b>
        </div>
        <div class="fs-16 mt-20">
          <span>{{ $t("8") }}</span>
          <span>(<b class="co-red">{{ $t("21", { price: "1,480" }) }}</b>)</span>
          <a href="/post/53/7726" target="_blank" class="text-underline">{{ $t("10") }}</a>
        </div>
      </template> -->
      <!-- skill share -->
      <div v-if="product.cartInfo.isEstimate" class="tooltip-estimate">
        <a @click="checkLoginEstimate" id="request-a-quote" class="flex mid center btn-req-skillshare w-full"><PenSolid />{{ $t(29) }}</a>
        <div class="gui-es-v2">
          <a href="https://www.gogojungle.co.jp/post/1/17014">{{ $t(29) }}</a>
        </div>
      </div>
    </div>
    <!-- <template v-if="payments.bank === 1">
      <div class="mt-20">
        <img
          src="/img/assets/pc/common/msg_tools.png"
          alt=""
          width="300"
          height="auto"
        />
      </div>
    </template> -->
    <div
      class="dvd-block mt-20 flex layout-col space-between"
      v-if="info.price && !info.externalUrl && info.isDvd"
    >
      <div class="fs-18 flex mid title-block"><CD class="cd-icon mr-5" /><span>{{ $t(26) }}</span></div>
      <div class="flex mid child-block space-between">
        <span>{{ $t("8") }}</span>
        <b class="co-red">({{ $t("21", { price: "1,480" }) }})</b>
        <a href="/post/53/7726" target="_blank" class="text-underline ml-5">{{ $t("10") }}</a>
      </div>
    </div>
    <div class="card-img flex flex-wrap" v-if="showPaymentMethod">
      <template v-if="payments.card === 1">
        <img
          class="mr-5 mb-5"
          src="/img/assets/pc/common/payment_ico_mastercard.png"
          alt=""
        />
        <img
          class="mr-5 mb-5"
          src="/img/assets/pc/common/payment_ico_visacard.png"
          alt=""
        />
      </template>
      <template v-if="payments.store === 1">
        <img
          class="mr-5 mb-5"
          src="/img/assets/pc/common/payment_ico_D1.png"
          alt=""
        />
        <img
          class="mr-5 mb-5"
          src="/img/assets/pc/common/payment_ico_D2.png"
          alt=""
        />
        <img
          class="mr-5 mb-5"
          height="35"
          src="/img/assets/pc/common/payment_ico_jcb.png"
          alt=""
        />
        <img
          class="mr-5 mb-5"
          src="/img/assets/pc/common/payment_ico_familymart_new.png"
          alt=""
        />
      </template>
    </div>
  </div>
</template>

<script>
import i18n from "@@/lang/components-desktop/payment-payment.json"
import PenSolid from '@@/../components/icons/PenSolid.vue'
import CartButton01v1 from "./CartButton01v1.vue"
import CD from "@@/../components/icons/CD.vue"

export default {
  components: {
    CartButton01v1,
    PenSolid,
    CD,
  },
  props: {
    product: {
      type: Object,
      default() {
        return {}
      },
    },
    showPaymentMethod: {
      type: Boolean,
      default: false,
    },
    getProductPassword: {
      type: Function,
    },
  },
  i18n: {
    messages: i18n,
  },
  mounted(){
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
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
  },
  methods:{
    checkLoginEstimate(){
      if(this.userId){
        location.href = `/estimate/${this.product.cartInfo.devId}/${this.product.id}`
      } else{
        location.href = `/login?u=${this.$route.fullPath}`
      } 
    }
  }
}
</script>

<style lang="scss" scoped>
$font18: 18px;
.web-auth {
  width: 260px;
  height: 30px;
  color: white;
  background-color: #337ab7;
  border-radius: 3px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 15px;
  margin-bottom: 10px;
}
.type01-payment {
  .info-price {
    padding: 20px;
    border: 1px solid #bababa;
    border-radius: 5px;
  }
}
.fs-16 {
  font-size: 16px;
}
.fs-18 {
  font-size: $font18;
}
.fs-20 {
  font-size: 20px;
}
.fs-22 {
  font-size: 22px;
}
.fs-30 {
  font-size: 30px;
}
.fs-34 {
  font-size: 34px;
}
.fav-button {
  width: 214px;
  height: 35px;
  line-height: 31px;
  background: white;
  border: 1px solid #f90;
  color: #f90;
  margin: 10px auto 0;
  outline: none;
  &:hover,
  &.is-fav {
    background: #f90;
    color: white;
  }
}
.info {
  background: #eee;
  font-size: $font18;
}
.border-button-001 {
  height: 35px;
  line-height: 33px;
  color: #333;
  border-radius: 18px;
  border: solid 3px #b4b5b6;
}
.min-400 {
  min-height: 300px;
}
.co-red {
  color: #ff0400;
}
.border-radius-5 {
  border-radius: 5px;
}
.icon-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #666;
  margin-bottom: 2px;
}
.icon-star {
  width: 24px;
  height: 24px;
}
.icon-plus {
  width: 18px;
  height: 18px;
}
.payment-method {
  background: #337ab7;
  border-radius: 4px;
  color: white;
}
.line-through {
  text-decoration: line-through;
}
.cart-title {
  font-size: 16px;
  color: #337ab7;
  b {
    flex: 0 0 100px;
  }
  span {
    display: inline-block;
    height: 3px;
    background: #337ab7;
  }
}
.text-underline {
  text-decoration: underline;
}
.card-img img {
  width: inherit;
}
.btn-req-skillshare {
  margin-bottom: 6px;
  cursor: pointer;
  width: 260px;
  font-weight: normal;
  line-height: 33px;
  box-shadow: 0 1px 1px #85b427;
  color: white;
  background-color: #a4ce51;
  border-radius: 5px;
  padding: 11px 0;
  font-size: 22px;
  .icon-cls {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
  &:hover {
    text-decoration: none;
    background-color: #85b427;
    color: white;
  }
}
.tooltip-estimate /deep/ {
  margin-top: 15px;
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
.dvd-block {
  background: #a42727;
  color: #fff;
  min-height: 85px;
  padding: 10px 9px;
  .cd-icon {
    width: 22px;
    height: 25px;
  }
  .title-block {
    line-height: 28px;
    margin-top: -2px;
  }
  .child-block {
    background: #fff;
    color: #333;
    height: 37px;
    padding: 8px;
  }
}
</style>
<docs>
  ```vue
  <template>
    <div style="width: 300px;">
      <Payment01v1 :cartInfo="cartInfo"/>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        cartInfo: {
          price: 119800,
          oldPrice: 49800,
          discountLimit: 5,
          discountRemain: 5,
          remain: 5,
          bank: 1,
          cart: 1,
          conv: 1,
          bit: 1,
          id: 10494,
          type: 1,
          status: 1,
          count: 0,
          expectedSaleCount: 0,
          date: 1477233747,
          is_dvd: 1,
          update: 0,
          isSaleStop: 0,
          isFavorite: 0,
          isPortfolio: 0,
          isSubscription: 0,
          favoriteCount: 0,
          isWebAuthentication: 1,
          forwardAt: 1477233747
          }
      }
    },
  }
  </script>
  ```
</docs>
