<template>
  <div class="panel p-40 mb-20">
    <Title04 :title="title" class="mb-30" />
    <div class="flex flex-wrap">
      <LazyComp01 class="user-product mt-10 mb-10 flex" v-for="data in products" 
                  :key="'underSaleProduct'+data.id" min-height="90px"
      >
        <a :href="data.detailUrl" class="flex mid mr-10 shadow pos-rel">
          <Lzimg :data-src="`/img/${isArticle(data) ? 'articles' : 'products'}/${isArticle(data) ? data.articleId : data.id}/small?isna=1`" alt="" class="pos-abs" />
        </a>
        <div>
          <a :href="data.detailUrl" :title="data.name"
             class="wrap-text pr-10 no-underlying"
          >
            {{ data.name }}
          </a>
          <Price :is-vertical="true" :class="{ 'reverse-price': (data.price && data.price.oldPrice) }"
                 :price="(data.price || {}).price" :old-price="(data.price || {}).oldPrice"
          />
          <b v-if="data.profit" class="wrap-text">{{ profitTitle }}: <br />{{ formatProfit(data.profit) }}円</b>
        </div>
      </LazyComp01>
    </div>
    <LoadMore @click.native="handleLoadMore" v-if="showMore" class="mt-20 loadmore" :href="`/users/${id}/products?notShowMore`" />
  </div>
</template>

<script>
import Title04 from '@/components/review/Title04.vue'
import Price from '@@/../components/prices/Price.vue'
import LoadMore from '@/components/user/LoadMore.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import Lzimg from '@@/../components/Lzimg.vue'

export default {
  components: {
    Title04,
    LazyComp01,
    Price,
    LoadMore,
    Lzimg,
  },
  props: {
    id: [Number, String],
    title: String,
    profitTitle: String,
    showMore: Boolean,
    products: {
      type: Array,
    },
    onLoadMore: Function,
  },
  methods: {
    handleLoadMore(e) {
      if (!this.onLoadMore) {
        return
      }
      e.preventDefault()
      this.onLoadMore()
    },
    formatProfit(num){
      return Math.floor(num).toLocaleString('en-GB', {
          minimumFractionDigits: 0,
        })
    },
    isArticle(item) {
      return !!item.articleId
    }
  },
}
</script>

<style lang="scss" scoped>
.user-product {
  width: 33%;
  flex: 0 -1 33%;
  > a {
    width: 90px;
    height: 90px;
    flex: 0 0 90px;
    background-color: #e6e9ec;
    img {
      width: 100%;
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  > div {
    width: calc(100% - 100px);
    > a {
      display: block;
    }
    > b {
      width: 130px;
    }
  }
}
.user-page {
  .title {
    border-bottom: 1px solid #f2677d !important;
  }
  a {
    &.loadmore {
      color: #f2677d;
      border: 2px solid #f2677d;
    }
  }
}
</style>
