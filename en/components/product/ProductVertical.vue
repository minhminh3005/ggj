<template>
  <div class="product-tIhXrfXTOP flex layout-col space-between">
    <a class="top-content" :href="product.detailUrl" :title="product.name">
      <img v-if="!product.articleId" :src="'/img/products/' + product.id + '/small'" class="img-prd-new" :alt="product.name" width="40" height="40" />
      <img v-else :src="'/img/articles/' + product.articleId + '/small'" class="img-prd-new" :alt="product.name" width="40" height="40" />
      <div class="product-info">
        <div v-wrap-lines="2" class="product-name">
          {{ product.name }}
        </div>
        <Prices :prices="product.prices" :is-vertical="true" />
      </div>
    </a>
    <div class="flex mid">
      <div class="category text-center mr-5" 
           :style="{
             'background-color': categoryColors[product.typeId || 1],
             'font-size': product.typeId == 2 ? '10px' : '11px',
             'width': product.typeId == 2 ? '52px' : '40px',
           }"
      >
        {{ product.typeId == 2 ? $t('types.2') : $t('c' + (product.category || 1)) }}
      </div>
      <Rate :stars="product.review ? Number(product.review.stars) : 0" :number="product.review ? Number(product.review.count) : 0"
            :target="product.id" :alway-show="true"
      />
    </div>
    <google-line-chart class="img-chart mt-10" :size="[144, 68]" :data="product.chart" v-if="product.chart" />
  </div>
</template>
<script>
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
  },
  components: {
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
    }
  },
}
</script>
<style lang="scss" scoped>
.product-tIhXrfXTOP {
  width: 160px;
  min-height: 118px;
  background: #ebeaeb;
  box-sizing: border-box;
  padding: 10px 7px;
  overflow: hidden;
  .top-content {
    cursor: pointer;
    display: flex;
    text-decoration: none;
    &:hover .product-name {
      text-decoration: underline;
    }
    .img-prd-new {
      flex: 0 0 40px;
      margin-right: 7px;
    }
    .product-info {
      flex: 0 1 auto;
      .product-name {
        height: 40px;
        color: #666;
        overflow: hidden;
      }
    }
    .price-cls {
      height: 40px;
      margin-top: -3px;
      justify-content: flex-end;
      .old-price {
        color: #666;
      }
    }
  }
  /deep/ .rate-num {
    font-size: 12px;
    color: #666;
  }
  .category {
    text-decoration: none;
    width: 40px;
    height: 14px;
    line-height: 15px;
    color: white;
    border-radius: 2px;
    &:hover {
      text-decoration: none;
    }
  }
}
</style>
<docs>
  ```vue
  <template>
    <div style="width: 300px;">
      <ProductVertical :product="product" />
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
