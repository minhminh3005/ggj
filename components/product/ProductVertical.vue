<template>
  <div class="product-vertical p-5 pos-rel" :class="theme">
    <a :href="product.detailUrl" class="co-black" :title="product.name" :class="{'no-underlying' : theme == 'theme-01'}">
      <div class="product-img s-82">
        <div v-if="rank" :class="['lg', 'rank' + rank > 3 ? 4 : rank]">
          <b>{{ rank }}</b>
        </div>
        <div class="sale" v-if="(product.prices[0] || {}).discountPrice">
          <span class="flex mid center"></span>
          <span class="flex mid center"><b>SALE</b></span>
        </div>
        <small v-if="showPercent && discountPercent" class="discount-percent">{{ discountPercent }}% OFF</small>
        <google-line-chart
          v-if="showChart"
          class="img-chart"
          :size="[80, 80]"
          :data="product.chart"
        />
        <Lzimg
          v-else-if="product.isEstimate"
          class="s-82 mb-10 owl-lazy"
          :data-src="'/img/users/' + (product.seller ? product.seller.userId : 0) + imgSize"
          :alt="product.name + ' ' + (category || '')"
        />
        <Lzimg
          v-else-if="!showChart && !product.articleId"
          class="s-82 mb-10 owl-lazy"
          :data-src="'/img/products/' + product.id + imgSize"
          :alt="product.name + ' ' + (category || '')"
        />
        <Lzimg
          v-else
          class="s-82 mb-10 owl-lazy"
          :data-src="'/img/articles/' + product.articleId + imgSize"
          :alt="product.name + ' ' + (category || '')"
        />
      </div>
      <div class="product-name mt-10"
           :v-wrap-lines="theme == 'theme-01' ? 1 : 2"
           :class="{'clamp clamp-1' : theme == 'theme-01'}"
      >
        {{ `${product.isEstimate ? $t('estimate_label') + ' ' : ''}${product.name}` }}
      </div>
    </a>
    <div class="product-info" v-if="product.description" v-wrap-lines="2" :title="product.description">
      {{ product.description }}
    </div>
    <Prices :prices="product.prices" :right-align="rightAlign" :is-vertical="isVerticalPrice" @percent="catchPercent" />
    <Rate :stars="product.review ? Number(product.review.stars) : 0" :number="product.review ? Number(product.review.count) : 0"
          :target="!product.isEstimate ? product.id : (product.seller ? product.seller.userId : 0)"
          :is-estimate="!!product.isEstimate"
    />
  </div>
</template>

<script>
import Prices from '@@/../components/prices/Prices.vue'
import Rate from '@@/../components/product/Rate.vue'
import GoogleLineChart from '@@/../components/charts/GoogleLineChart.vue'
import i18n from '@@/lang/components-desktop/product-productvert.json'
import Lzimg from '@@/../components/Lzimg.vue'

export default {
  components: { Prices, Rate, GoogleLineChart, Lzimg },
  // props: ['product', 'rightAlign', 'rank', 'category', 'showChart']
  props: {
    product: {
      type: Object,
      default() {
        return {}
      }
    },
    rightAlign: {
      type: Boolean,
      default: false
    },
    rank: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      default: ''
    },
    showChart: {
      type: Boolean,
      default: false
    },
    isVerticalPrice: {
      type: Boolean,
      default: true
    },
    showPercent: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default() {
        return ''
      }
    },
    smallImg: {
      type: Boolean,
      default: true
    }
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      discountPercent: 0
    }
  },
  methods: {
    catchPercent(val) {
      if(!val) return
      this.discountPercent = val
    }
  },
  computed: {
    imgSize() {
      return this.smallImg ? '/small' : '/medium'
    }
  }
}
</script>

<style lang="scss" scoped>
.product-vertical {
  width: 95px;
  box-sizing: content-box;
  > * {
    width: 100%;
  }
  .product-info {
    height: 36px;
    overflow: hidden;
  }
  .product-name {
    height: 42px;
    overflow: hidden;
    font-weight: bold;
  }
  .s-82 {
    width: 82px;
    height: 82px;
  }
  .sale {
    z-index: 2;
    right: 0;
    top: 0;
    span {
      text-transform: uppercase;
      position: absolute;
      background: red;
      font-size: 11px;
      color: white;
      height: 27px;
      width: 27px;
      top: 5px;
      right: 7px;
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
}
.theme-01 {
  &.product-vertical {
    width: 100%;
    padding: 0;
    margin: 0;
    // background: #9ddcee;
    .s-82 {
      width: auto;
      height: auto;
      max-width: 100%;
      margin: 0;
    }
    .product-name {
      color: #333;
      height: auto;
    }
    .product-info {
      display: none;
    }
    .product-img {
      position: relative;
      border: solid 1px #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 210px;
      width: 210px;
      overflow: hidden;
    }
    .sale {
      position: absolute;
      top: -7px;
      right: -7px;
    }
    .discount-percent {
      position: absolute;
      bottom: 0;
      left: 0;
      background: #f00;
      color: #fff;
      padding: 1px 5px;
      font-weight: bold;
    }
  }
}
</style>

<docs>
  ```vue
  <template>
    <ProductVertical :product="item" />
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          detailUrl: '/systemtrade/fx/10833',
          id: '1',
          name: 'TORURIPI-R666BZ-R_USDJPY',
          prices: [{ price: 49900 }],
          review: { count: 3, stars: 1 },
        },
      }
    },
  }
  </script>
  ```
</docs>
