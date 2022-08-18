<template>
  <div class="product-BjNGXdi flex space-between pt-10" :title="product.name">
    <div class="flex">
      <a class="product-img pos-rel mb-10" :href="product.detailUrl">
        <rank-number v-if="rank" :number="rank" class="pos-abs" :size="24" />
        <div class="sale" v-if="(product.prices[0] || {}).discountPrice">
          <span class="flex mid center"></span>
          <span class="flex mid center"><b>SALE</b></span>
        </div>
        <google-line-chart
          v-if="product.chart"
          class="img-chart"
          :size="[58, 58]"
          :data="product.chart"
        />
        <img
          v-else
          class="w-full mb-10"
          :src="'/img/products/' + product.id + '/small'"
          :alt="product.name + ' ' + product.typeId"
        />
      </a>
      <div class="product-wrapper ml-15">
        <a :href="product.detailUrl">
          <div v-wrap-lines="2" class="cursor-pointer product-name">
            <span
              class="category text-center"
              :style="{
                'background-color': categoryColors[product.typeId || 1],
                'font-size': product.typeId == 2 ? '10px' : '11px',
                'width': product.typeId == 2 ? '52px' : '40px',
              }"
            >
              {{ product.typeId == 2 ? $t('types.2') : $t('c' + (product.category || 1)) }}
            </span>
            {{ product.name }}
          </div>
          <div v-if="showCriterial">
            <div class="criterial fs-12" v-if="product.profitRate">
              {{ product.profitRate }}%
            </div>
            <div class="criterial fs-12" v-if="product.profitTotal">
              {{ formatNumber(product.profitTotal)
              }}{{
                product.currencyType ? $t('cur' + product.currencyType) : '円'
              }}
            </div>
            <div class="criterial fs-12" v-if="product.profitFactor">
              PF: {{ formatNumber(product.profitFactor) }}
            </div>
            <div class="criterial fs-12" v-if="product.riskReturn">
              {{ product.riskReturn }}%
            </div>
          </div>
          <Prices :prices="product.prices" />
        </a>
        <Rate
          :alway-show="true"
          :stars="product.review ? Number(product.review.stars) : 0"
          :number="product.review ? Number(product.review.count) : 0"
          :target="product.id"
        />
        <div
          :style="{ color: platformColors[product.platform] }"
          v-if="product.platform"
        >
          <b class="fs-12">{{ $t('platforms.' + product.platform) }}</b>
        </div>
      </div>
    </div>
    <a
      class="flex layout-col content-end mb-10"
      :href="product.detailUrl"
    >
      <img
        :src="'/img/products/' + product.id + '/small'"
        width="30"
        height="30"
        :alt="product.name"
        class="img-border"
        v-if="product.chart"
      />
    </a>
  </div>
</template>

<script>
import RankNumber from '@/components/icons/RankNumber.vue'
import GoogleLineChart from '@@/../components/charts/GoogleLineChart.vue'
import Rate from '@@/../components/product/Rate.vue'
import Prices from '@@/../components/prices/Prices.vue'
import i18n from '@@/lang/components-desktop/product-productvert.json'
export default {
  i18n: { messages: i18n },
  props: {
    product: {
      type: Object,
      default() {
        return {}
      },
    },
    rank: {
      type: Number,
      default: 0,
    },
    isHorizontal: {
      type: Boolean,
      default: false,
    },
    showCriterial: {
      type: Boolean,
      default: false,
    },
    // showChart: {
    //   type: Boolean,
    //   default: true,
    // },
  },
  components: {
    RankNumber,
    GoogleLineChart,
    Rate,
    Prices,
  },
  data() {
    return {
      categoryColors: {
        1: '#8fc31f',
        2: '#00b7ee',
      },
      platformColors: {
        1: '#00cc33',
        2: '#00cc33',
        3: '#627cc6',
        4: '#ef9062',
        5: '#00cc33',
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.product-BjNGXdi {
  a {
    text-decoration: none;
  }
  .product-wrapper {
    flex: 0 0 195px;
    a {
      display: block;
    }
  }
  &:hover {
    background: #f5f5f5;
    .product-name {
      text-decoration: underline;
    }
  }
  .product-img {
    flex: 0 0 60px;
  }
  .number {
    top: 0;
    left: 0;
    z-index: 1;
  }
  .product-name {
    overflow: hidden;
    height: 35px;
    margin-top: -1px;
    color: #666;
    line-height: 18px;
    .category {
      display: inline-block;
      height: 14px;
      line-height: 15px;
      color: white;
      border-radius: 2px;
    }
  }
  .criterial {
    color: #666;
    font-weight: bold;
  }
  /deep/ .price-cls {
    justify-content: flex-end;
    flex-direction: row-reverse;
    .co-red {
      margin-left: 0;
    }
    .old-price {
      color: #666;
      margin-left: 5px;
    }
  }
  /deep/ .gg-rating {
    font-size: 12px;
    margin-top: -3px;
    .rate-num {
      font-size: 11px;
      color: #666;
    }
  }
  .img-border {
    border: 1px solid #d2d2d2;
  }
  .content-end {
    flex: 0 0 30px;
  }
  .sale {
    z-index: 2;
    left: 0;
    top: 0;
    span {
      text-transform: uppercase;
      position: absolute;
      background: red;
      font-size: 10px;
      color: white;
      height: 20px;
      width: 20px;
      top: 0;
      left: -7px;
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
</style>
<docs>
  ```vue
  <template>
    <div style="width: 300px;">
      <ProductHorizontal :product="product" />
    </div>
  </template>
  <script>
    export default {
      data() {
        return {
          product: {
            category:1,
            chart:"0,0,14921,14921,14921,14921,29876,29876,40295,40295,40295,55215,68824,83769,100639,100639",
            detailUrl:"/systemtrade/fx/14861",
            id:14861,
            name:"Prospect_FX_AUDNZD",
            prices:[{
              price:15000
            }],
            review: {
              count:10,
              stars:4,
            }
          }
        }
      }
    }
  </script>
  ```
</docs>
