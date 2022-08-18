<template>
  <div class="review-product-info">
    <!-- PRODUCT INFO -->
    <div class="p-0 flex left-block flex-wrap">
      <!-- product image -->
      <div class="pt-10 left-block-left">
        <a
          :href="productInfo.detailUrl"
          class="flex mid center"
          style="width: 100px; min-height: 100px; box-shadow: 0 0 20px 5px inset #efefef;"
        >
          <img :src="`/img/products/${productInfo.id}/small`" alt="" class="w-full" />
        </a>
        <div class="text-center mt-10"><span class="label-1">{{ getCateName() }}</span></div>
      </div>
      <!-- info -->
      <div class="left-block-right">
        <!-- average review start, review count  -->
        <Rate 
          class="rating mb-10" 
          :stars="productInfo.reviewStars"
          :number="productInfo.reviewCount"
        />
        <!-- day start sell -->
        <div class="mb-10">
          <b>{{ $t(2) }}：</b>
          <b>{{ formatTime(cartInfo.start, 0) }}</b>
        </div>
        <!-- seller info -->
        <div class="mb-10">
          <span>{{ $t(3) }}：</span>
          <a :href="`/users/${productInfo.userId}`">{{ productInfo.nickname }}</a>
        </div>
        <!-- user count -->
        <div class="mb-10">
          <span>{{ $t(4) }}：</span>
          <span>{{ cartInfo.count }}{{ $t(8) }}</span>
        </div>
        <!-- favorite count -->
        <div class="mb-10">
          <div
            class="favorite-btn flex mid center" 
            :class="{ active: cartInfo.isFavorite}"
            @click="onFavorite"
          >
            <Heart />
            <span class="ml-5 mr-5">{{ $t(5) }}</span>
            <span class="fav-num">{{ cartInfo.favoriteCount }}</span>
          </div>
        </div>
        <!-- dvd option -->
        <strong v-if="cartInfo.price && !cartInfo.externalUrl && cartInfo.isDvd">
          <span v-html="$t(6)"></span>
          <a href="/post/53/7726" target="_blank" class="text-underline ml-5">{{ $t(7) }}</a>
        </strong>
      </div>
    </div>
    <!-- CART INFO -->
    <div style="flex-grow: 1;" class="right-block">
      <Payment07 />
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/review-product-info.json'
import Rate from '@/components/review/Rate.vue'
import Payment07 from '@/components/payment-v1/type07/Payment07.vue'
import Heart from '@@/../components/icons/Heart.vue'
import { salonProductIds } from '@@/../common/assets/js/consts'
export default {
  i18n: { messages: i18n },
  components: {
    Rate,
    Heart,
    Payment07,
  },
  computed: {
    cartInfo() {
      return this.$store.state.cart.info
    },
    productInfo() {
      return this.$store.state['review-detail'].productInfo
    }
  },
  methods: {
    onFavorite() {
      this.$store.dispatch('cart/favorite', this)
    },
    getCateName() {
      //  This function is related with OAM-25511 (TYPEID)
      if(!this.productInfo) {
        return ''
      }
      let item = this.productInfo
      if(item.typeId == 1) { // systemtrade
        if (item.categories == 1) { // fx
          return this.$t('cate-1')
        } else if (item.categoryId == 3) { // stock (kabu)
          return this.$t('cate-2')
        }
      }
      if([2, 6, 9, 10].includes(item.typeId)) { // tools
        return this.$t('cate-3')
      }
      if(item.typeId == 3) {  // navi
        return this.$t('cate-4')
      }
      if(item.typeId == 4) {  // salon & emagazine
        if(salonProductIds.includes(item.productId)) { // only these products is salon 
          return this.$t('cate-5')
        } else {
          return this.$t('cate-6') // mail magazine
        }
      }
      return this.$t('cate-7') // others
    },
  }
}
</script>

<style lang="less" scoped>
.review-product-info {
  width: 100%;
  min-height: 256px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  @w: 441px;
  @media only screen and (min-width: @screen-sm) {
    padding: 20px 35px;
  }
  .left-block {
    width: 100%;
    padding-top: 12px;
    @media only screen and (min-width: @screen-sm) {
      width: @w;
      border-right: 1px solid #d9d9d9;
      max-width: calc(100% - 270px);
    }
    @w2: 100px;
    .left-block-left {
      width: @w2;
      margin-right: 25px;
      @media only screen and (min-width: @screen-sm) {
        margin-right: 0;
      }
    }
    .left-block-right {
      width: 100%;
      padding: 0;
      flex-grow: 1;
      margin-top: 20px;
      @media only screen and (min-width: @screen-sm) {
        margin-top: 0;
        padding: 0 30px;
        width: calc(100% - @w2);
      }
    }
    /deep/ .rate-num {
      padding-top: 13px;
    }
  }
  .right-block {
    margin-top: 20px;
    border-top: 1px solid #d9d9d9;
    @media only screen and (min-width: @screen-sm) {
      margin-top: 0;
      width: calc(100% - @w);
      border-top: none;
    }
  }
}
.label-1 {
  border: 1px solid #aaa;
  color: #aaa;
  border-radius: 3px;
  font-size: 12px;
  padding: 2px 7px;
}
.favorite-btn {
  @color: #EC5665;
  height: 35px;
  width: 147px;
  border: 1px solid @color;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  &.active {
    background: #ffe6e8;
    color: #ec5665;
    .icon-cls {
      color: #ec5665;
    }
  }
  .fav-num {
    color: @color;
    font-weight: bold;
  }
  .icon-cls {
    height: 18px;
    width: 18px;
    transition: all 0.3s;
  }
}
/deep/ .co-red {
  color: red;
}
</style>
