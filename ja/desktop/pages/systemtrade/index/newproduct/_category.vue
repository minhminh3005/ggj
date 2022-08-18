<template>
  <NewProduct
    :origin-url="originUrl"
    :cur-page="curPage"
    :data="newProduct"
    :cur-type="$route.params.category"
  >
    <div class="right-content" slot="right-content">
      <RankingProduct :ranking-ea="rankingEA" :ranking-ebook="rankingEbook" :new-review="newReview" :rank-data="rankData" />
    </div>
  </NewProduct>
</template>
<script>
import i18n from '@@/lang/desktop/systemtrade-newproduct.json'
import title from '@@/../common/pages'
import NewProduct from '@@/../components/systemtrade/NewProduct.vue'
import RankingProduct from '@/components/product/RankingProduct.vue'

const obj = Object.assign(
  {
    scrollToTop: true,
    validate({ params }) {
      return ~['fx', 'stocks', undefined].indexOf(params.category)
    },
    components: { 
      NewProduct,
      RankingProduct
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        selectedRank: 'all',
        titleChunk: this.$route.params.category
          ? this.$t('2' + this.$route.params.category)
          : this.$t('2'),
      }
    },
    async asyncData({ app, params, store }) {
      let locale = app.i18n.locale,
        category = params.category || null,
        url = category
          ? `/api/v3/surface/systemtrade/${category}/new/product?limit=0`
          : `/api/v3/surface/systemtrade/new/product?limit=0`,
        [newProduct, topProductsData, newReview, eaReview, ebookReview] = await Promise.all([
          app.GoGoHTTP.get(url),
          app.GoGoHTTP.get('/api/v3/surface/top/products', { params: { rtRankingLimit: 10 } }),
          app.GoGoHTTP.get('/api/v3/surface/review/popular/new'),
          app.GoGoHTTP.get('/api/v3/surface/review/highpost/systemtrade/3', { params: { limit: 5 }}),
          app.GoGoHTTP.get('/api/v3/surface/review/highpost/tools/3', { params: { limit: 5 }})
        ]),
        originUrl = ['/systemtrade/newproduct', params.category].join('/'),
        alternateLinks = []
      if(category && category == 'fx') {
        alternateLinks = [
          {
            rel: 'alternate',
            hreflang: 'ja',
            href: `https://www.gogojungle.co.jp/systemtrade/newproduct${
              params.category ? '/' + params.category : ''
            }`,
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `https://www.gogojungle.co.jp/en/systemtrade/newproduct${
              params.category ? '/' + params.category : ''
            }`,
          },
          {
            rel: 'alternate',
            hreflang: 'th',
            href: `https://www.gogojungle.co.jp/th/systemtrade/newproduct${
              params.category ? '/' + params.category : ''
            }`,
          },
          {
            rel: 'alternate',
            hreflang: 'vi',
            href: `https://www.gogojungle.co.jp/vi/systemtrade/newproduct${
              params.category ? '/' + params.category : ''
            }`,
          },
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: `https://www.gogojungle.co.jp/systemtrade/newproduct${
              params.category ? '/' + params.category : ''
            }`,
          }
        ]
      }
      store.commit('pushBC', {
        name: i18n[locale]['2' + (category || '')],
        target: {
          name: 'systemtrade-index-newproduct-category',
          params: params,
        },
      })
      return {
        newProduct: newProduct,
        originUrl,
        curPage: params.p || 1,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/systemtrade/newproduct${
              params.category ? '/' + params.category : ''
            }`,
          }
        ].concat(alternateLinks),
        rankData: topProductsData.ranking || [],
        newReview,
        rankingEA: eaReview.data || [],
        rankingEbook: ebookReview.data || []
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t(`d${this.$route.params.category || ''}`)
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.right-content {
  width: 300px;
  height: 100%;
  .title-right {
    height: 30px;
    border-left: 3px solid #dbdbdb;
    background: #f0f0f0;
    font-size: 16px;
    color: #7d7d7d;
  }
  /deep/ .gogo-link {
    width: 100%;
    img:hover {
      opacity: 0.85;
    }
  }
  .co-white {
    color: white;
  }
}
</style>
