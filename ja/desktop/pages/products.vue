<template>
  <div class="new-product w-1000 flex">
    <div class="left-content pl-10 pr-10">
      <header-blue-z class="z-title" :left-text="$t('1')" />
      <div class="flex flex-wrap">
        <ProductVertical03
          v-for="product in (newProducts.data || [])"
          :key="'oNrZd' + product.id"
          class="product-h9cei mt-20 ml-15 mr-15"
          :product="product"
          :category="$t(typeMap[product.typeId])"
        />
      </div>
      <div class="text-center mt-20">
        <paging :cur-page="newProducts.currentPage"
                :total="newProducts.lastPage"
                :from="newProducts.pagingFrom"
                :to="newProducts.pagingTo"
                :has-scroll="true"
                :is-add-url-param="true"
                :origin-url="originUrl"
                @pagingclick="onChangePage"
        />
      </div>
    </div>
    <div class="right-content">
      <RankingProduct :ranking-ea="rankingEA" :ranking-ebook="rankingEbook" :new-review="newReview" :rank-data="rankData" />
    </div>
  </div>
</template>

<script>
import ProductVertical03 from '@@/../components/product/ProductVertical03.vue'
import HeaderBlueZ from '@/components/common/HeaderBlueZ.vue'
import Paging from '@@/../components/paging/Paging.vue'
import i18n from '@@/lang/desktop/new-products.json'
import type from '@@/lang/components-desktop/product-productvert.json'
import title from '@@/../common/pages'
import RankingProduct from '@/components/product/RankingProduct.vue'

const typeMap = {
  1: 'type1',
  2: 'typetools',
  3: 'type3',
  4: 'type4',
  6: 'typetools',
  8: 'typetools',
  9: 'typetools',
  10: 'typetools',
  70: 'typetools',
  71: 'typetools',
  72: 'typetools',
}

const langMap = {
  ja: Object.assign(i18n['ja'], type['ja']),
  en: Object.assign(i18n['en'], type['en']),
  th: Object.assign(i18n['th'], type['th']),
  ch: Object.assign(i18n['ch'], type['ch']),
  tw: Object.assign(i18n['tw'], type['tw']),
  vi: Object.assign(i18n['vi'], type['vi']),
}

const obj = Object.assign(
  {
    components: {
      ProductVertical03,
      HeaderBlueZ,
      Paging,
      RankingProduct
    },
    i18n: {
      messages: langMap,
    },
    data() {
      return {
        selectedRank: 'all',
      }
    },
    methods: {
      onChangePage(_page) {
        location.href = `/products/p/${_page}`
      },
      descriptionTemplate() {
        return this.$t('5')
      },
    },
    async asyncData({ app, params }) {
      let [rightContent, newProducts, topProductsData, newReview, eaReview, ebookReview] = await Promise.all([
          app.GoGoHTTP.get('/api/v3/surface/campaigns'),
          app.GoGoHTTP.get(`/api/v3/surface/product/new?page=${params.p || 1}`),
          app.GoGoHTTP.get('/api/v3/surface/top/products', { params: { rtRankingLimit: 10 } }),
          app.GoGoHTTP.get('/api/v3/surface/review/popular/new'),
          app.GoGoHTTP.get('/api/v3/surface/review/highpost/systemtrade/3', { params: { limit: 5 }}),
          app.GoGoHTTP.get('/api/v3/surface/review/highpost/tools/3', { params: { limit: 5 }})
        ]),
        locale = app.i18n.locale

      return {
        rightContent: rightContent.content || '',
        newProducts,
        titleChunk: i18n[locale][1],
        originUrl: '/products',
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/products`,
          },
        ],
        typeMap,
        rankData: topProductsData.ranking || [],
        newReview,
        rankingEA: eaReview.data || [],
        rankingEbook: ebookReview.data || []
      }
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.new-product {
  margin: 0 auto;
}
.z-title {
  /deep/ {
    h2 {
      padding-bottom: 5px;
    }
  }
}
.product-h9cei {
  /deep/ {
    padding: 0;
    .product-name {
      // margin-top: 0;
      width: 82px;
      color: black;
    }
  }
}
.product-h9cei.product-vertical {
  width: 100px;
  /deep/ {
    .product-img {
      img {
        width: 82px;
        height: 82px;
      }
    }
  }
}
.left-content {
  width: 670px;
}
.right-content {
  flex: 0 0 300px;
}
.border-bottom {
  border-bottom: 1px #b4b5b6 solid;
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>