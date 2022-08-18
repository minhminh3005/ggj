<template>
  <product-rank-list
    :origin-url="originUrl"
    :cur-page="curPage"
    :data="productRank"
    :revenue="'realasset'"
    :left-title="titleChunk"
    :note-title="$t(3)"
    :m="m"
  >
    <template slot-scope="prop">
      <RealRankingProduct
        class="mb-10"
        :product="prop.product"
        :number="prop.number"
        :key="prop.product.id"
      />
    </template>
  </product-rank-list>
</template>
<script>
import title from '@@/../common/pages'
import ProductRankList from '@/components/systemtrade/ProductRankList.vue'
import RealRankingProduct from '@/components/product/RealRankingProduct.vue'
import i18n from '@@/lang/desktop/systemtrade-realasset.json'
const tRvMap = {
  'all': 0,
  '1y': 12,
  '3m': 3,
  '1m': 1,
}

const tMap = {
  0: '/period/all',
  12: '/period/1y',
  3: '/period/3m',
  1: ''
}

const acceptM = ['all', '1y', '3m', '1m']
const obj = Object.assign(
  {
    scrollToTop: true,
    i18n: {
      messages: i18n,
    },
    components: { ProductRankList, RealRankingProduct },
    data() {
      return {
        category: null,
      }
    },
    computed: {
      titleChunk() {
        return this.$t('2', {period: this.$t('m' + this.m)})
      },
    },
    async asyncData({ app, params, store }) {
      const locale = app.i18n.locale
      const curPage = params.p || 1
      const m = acceptM.includes(params.m) ? tRvMap[params.m] : 1
      const productRank = await app.GoGoHTTP.get('/api/v3/surface/systemtrade/rank/realasset',
          {
            params: {
              page: curPage,
              limit: 20,
              type: 1,
              m,
            },
          }
        ),
        originUrl = '/systemtrade/realasset' + tMap[m]

      store.commit('pushBC', {
        name: i18n[locale][2].replace('{period}', i18n[locale]['m' + m]),
        path: originUrl
        // target: {
        //   name: 'systemtrade-index-revenue-category',
        //   params: params,
        // },
      })
      
      return {
        productRank,
        originUrl,
        category: 'all',
        curPage,
        m,
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/systemtrade/realasset',
          }
        ]
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('description')
      },
    },
  },
  title
)
export default obj
</script>
