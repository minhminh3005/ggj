<template>
  <div class="product-vertical p-5">
    <div class="sale" v-if="product.prices[0].discountPrice">
      <span class="flex mid center"></span>
      <span class="flex mid center"><b>SALE</b></span>
    </div>
    <a :href="product.detailUrl" class="co-black" :title="product.name">
      <span class="rank flex mid center co-white pos-abs" v-if="rank"><b>{{ rank }}</b><span class="fs-8" v-if="$i18n.locale !== 'th'">{{ $t('1') }}</span></span>
      <div class="product-img pos-rel">
        <slot>
          <img class="pos-abs owl-lazy" :data-src="product.articleId ? `/img/articles/${product.articleId}/small` : `/img/products/${product.id}/small`" />
        </slot>
      </div>
      <div class="product-name mt-10 wrap-text" v-wrap-lines="2">
        {{ product.name }}
      </div>
      <Prices :prices="product.prices" :is-vertical="true" />
    </a>
    <Rate v-if="isShowRate" class="wrap-text" :stars="product.review ? product.review.stars : 0" :number="product.review ? product.review.count : 0"
          :target="product.id"
    />
  </div>
</template>
<script>
import Prices from '@@/../components/prices/Prices.vue'
import Rate from '@@/../components/product/Rate.vue'
import i18n from '@@/lang/components-desktop/product-productvertical.json'
export default {
  components: { Prices, Rate },
  props: {
    product: {
      type: Object
    },
    rank: {},
    isShowRate: {
      type:Boolean,
      default: true,
    }
  },
  i18n: { messages: i18n },
}
</script>
<style lang="scss" scoped>
.product-vertical {
  width: 82px;
  min-height: 152px;
  padding-left: 4vw;
  padding-right: 4vw;
  box-sizing: content-box;
  position: relative;
  &:hover {
    background: #f5f5f5;
  }
  > * {
    width: 100%;
  }
  /deep/ .gogo-link {
    width: 100%;
    &:hover {
      text-decoration: none;
      .product-name {
        text-decoration: underline;
      }
    }
  }
  .product-img {
    width: 100%;
    height: 0;
    padding-top: 100%;
    background: #f5f7fa;
    img {
      max-width: 100%;
      max-height: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .product-name {
    height: 38px;
    color: #424a54;
  }
  /deep/ .rate-num {
    font-size: 8px;
  }
  /deep/ .gg-rating {
    width: 17vw;
    .rate-num {
      margin-top: 1px;
      color: #666;
    }
  }
}
.sale {
  z-index: 2;
  right: 0;
  top: 0;
  span {
    text-transform: uppercase;
    position: absolute;
    background: red;
    color: white;
    font-size: 2.5vw;
    height: 6vw;
    width: 5.5vw;
    top: 1vw;
    right: 3vw;
    z-index: 3;
    &::before,
    &::after {
      content: '';
      position: absolute;
      background: inherit;
      height: inherit;
      width: inherit;
      top: 0;
      right: 0;
      z-index: -1;
      transform: rotate(30deg);
    }
    &::after {
      transform: rotate(60deg);
    }
    &:nth-child(1) {
      transform: rotate(15deg);
    }
  }
}
.rank {
  position: absolute;
  top: 0;
  left: 2px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  background: #656d78;
  color: white;
  z-index: 3;
}
.fs-8 {
  font-size: 8px;
}
.co-white {
  color: white;
}
/deep/ .price-cls {
  min-height: 5px;
  justify-content: flex-end;
}
</style>
<docs>
  ```vue
  <template>
    <div style="width: 300px; display: flex;">
      <ProductVertical02 :product="product" rank="1" />
      <ProductVertical02 :product="product" rank="2" />
      <ProductVertical02 :product="product" rank="3" />
      <ProductVertical02 :product="product" rank="4" />
    </div>
  </template>
  <script>
    export default {
      data() {
        return {
          product: {
            detailUrl:"/tools/indicators/10388",
            id:10388,
            name:"MT4連動ポイント＆フィギュア(ポイントアンドフィギュア)（P＆F）チャート自動作成ツール(ソフト)。エリオット波動計算表付き",
            prices: [{
              discountPrice:29800,
              price:32000
            }],
            review: {
              count:22,
              stars:5
            }
          }
        }
      }
    }
  </script>
  ```
</docs>