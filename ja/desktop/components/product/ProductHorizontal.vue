<template>
  <div class="product-horizontal flex p-5" v-if="product">
    <div class="rank"
         v-if="showTopRank && rank"
         :style="{
           background: rankColor[rank] || '#474747',
           color: rankColor[rank] ? 'white' : '#FFFFFF'
         }"
    >
      {{ rank }}
    </div>
    <a :href="product.detailUrl" class="box-hover cursor-pointer gogo-link">
      <Lzimg
        :data-src="product.articleId 
          ? `/img/articles/${product.articleId}/small` 
          : product.seriesId
            ? `/img/products/${product.productId || product.id}/small`
            : `/img/products/${product.id}/small`"
        class="shadow"
        :alt="`${product.name}${ category || '' }`"
      />
      <span v-if="!showTopRank && rank" :class="'rank' + (rank < 4 ? rank : 4)">{{ rank }}</span>
    </a>
    <div class="product-details ml-10 wrap-text">
      <a :href="product.detailUrl" class="cursor-pointer gogo-link">
        <div class="fs-13 product-title wrap-text" :title="product.name">
          {{ product.name }}
        </div>
        <Prices :prices="product.prices" :is-vertical="isVerticalPrice" :show-percent="showPercent" />
        <div v-if="showDescription" class="fs-13 product-des" :title="product.description" v-wrap-lines="2">{{ product.description }}</div>
      </a>
      <Rate :stars="(product.review && product.review.stars) ? Number(product.review.stars) : 0"
            :number="product.review ? Number(product.review.count) : 0" :target="product.id" class="h-20 fs-13"
      />
    </div>
  </div>
</template>

<script>
import Prices from '@@/../components/prices/Prices.vue'
import Rate from '@@/../components/product/Rate.vue'
import Lzimg from '@@/../components/Lzimg.vue'
export default {
  components: { Prices, Rate, Lzimg },
  // props: ['product', 'rank', 'category'],
  props: {
    product: {
      type: Object,
      default() {
        return {}
      },
    },
    rank: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      default: ''
    },
    showDescription: {
      type: Boolean,
      default: true
    },
    isVerticalPrice: {
      type: Boolean,
      default: false
    },
    showPercent: {
      type: Boolean,
      default: false
    },
    showTopRank: {
      type: Boolean,
      default: false
    },
    showRate: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      rankColor: {
        1: '#FFD100', // rank 1
        2: '#C0C0C0', // rank 2
        3: '#816D46' // rank 3
      },
    }
  },
}
</script>

<style scoped lang="scss">
.product-horizontal {
  position: relative;
  /deep/ .a {
    display: flex;
    align-items: center;
    padding: 10px;
  }
  &:hover {
    background: #f1f1f1;
    text-decoration: none;
    /deep/ .product-title {
      color: #23527c;
      text-decoration: underline;
    }
  }
  .box-hover {
    width: 60px;
    height: 60px;
    flex: 0 0 60px;
    div {
      width: 100%;
      height: 100%;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .product-details {
    flex: 1 1 auto;
    .product-title {
      color: #04c;
      font-weight: bold;
    }
    .product-des {
      color: #337ab7;
    }
  }
  .h-20 {
    height: 20px;
  }
  &.new-commodity {
    display: flex;
    align-items: center;
    a {
      &.box-hover {
        display: flex;
        align-items: center;
        background: #dadadb;
      }
      img {
        height: auto;
        max-height: 100%;
      }
    }
  }
  .rank {
    position: absolute;
    top: -6px;
    left: -6px;
    background: purple;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    line-height: 20px;
    text-align: center;
  }
}
</style>
<docs>
  ```vue
  <template>
    <div style="width: 300px; display: flex;">
      <ProductHorizontal :product="product" />
    </div>
  </template>
  <script>
    export default {
      data() {
        return {
          product: {
            description:"",
            detailUrl:"http://fx-on.ex-cloud.biz/ebooks/detail/?id=14994",
            id:14994,
            name:"2億人をターゲットにする新規公開コインICO...",
            prices: [{
              price:1980
            }],
            typeId:3
          }
        }
      }
    }
  </script>
  ```
</docs>
