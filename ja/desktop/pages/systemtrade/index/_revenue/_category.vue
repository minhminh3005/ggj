<template>
  <product-rank-list
    :origin-url="originUrl"
    :cur-page="curPage"
    :data="productRank"
    :category="category"
    :revenue="revenue"
    :left-title="titleChunk"
    :right-economics-title="economics"
    :note-title="revenue === 'profitfactor' ? $t(23) : ''"
    :m="m"
  >
    <template slot-scope="prop">
      <ProductRankHorizontal05
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
import ProductRankHorizontal05 from '@@/../components/product/ProductRankHorizontal05.vue'
import i18n from '@@/lang/desktop/system-revenue2.json'
const leftTitle = {
  profitrate: {
    fx: 1,
    stocks: 2,
    all: 4,
  },
  profit: {
    fx: 5,
    stocks: 6,
    all: 8,
  },
  profitfactor: {
    fx: 9,
    stocks: 10,
    all: 12,
  },
  riskreturn: {
    fx: 13,
    stocks: 14,
    all: 16,
  },
  sell: {
    fx: 17,
    stocks: 18,
    all: 20,
  },
}

const tRvMap = {
  'all': 0,
  '1y': 12,
  '3m': 3,
  '1m': 1,
}

const tMap = {
  0: '/period/all',
  12: '/period/1y',
  3: '/period/1y',
  1: ''
}

const acceptM = ['all', '1y', '3m', '1m']

const obj = Object.assign(
  {
    scrollToTop: true,
    validate({ params }) {
      return (
        ~['profitrate', 'profit', 'profitfactor', 'riskreturn', 'sell'].indexOf(
          params.revenue
        ) && ~['fx', 'stocks', undefined].indexOf(params.category)
      )
    },
    i18n: {
      messages: i18n,
    },
    components: { ProductRankList, ProductRankHorizontal05 },
    data() {
      return {
        leftTitle,
        category: null,
      }
    },
    computed: {
      titleChunk() {
        return this.$t(this.leftTitle[this.revenue][this.category || 'all'], {period: this.$t('m' + this.m)})
      },
    },
    async asyncData({ app, params, store }) {
      let locale = app.i18n.locale,
        revenue = params.revenue,
        category = params.category || 'all',
        m = acceptM.includes(params.m) ? tRvMap[params.m] : 1,
        [productRank, economics] = await Promise.all([
          app.GoGoHTTP.get(
            params.category
              ? `/api/v3/surface/systemtrade/${params.category}/rank/${revenue}`
              : `/api/v3/surface/systemtrade/rank/${revenue}`,
            {
              params: {
                page: params.p || 1,
                limit: 20,
                type: 1,
                m,
              },
            }
          ),
          app.GoGoHTTP.get(`/api/v3/surface/systemtrade/fx/rank/economics`),
        ]),
        originUrl = `/systemtrade/${revenue}${params.category ? '/' + params.category : ''}${tMap[m]}`,
        alternateLinks = []
      if(category == 'fx') {
        alternateLinks = [
          {
            rel: 'alternate',
            hreflang: 'ja',
            href: `https://www.gogojungle.co.jp${originUrl}`,
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `https://www.gogojungle.co.jp/en${originUrl}`,
          },
          {
            rel: 'alternate',
            hreflang: 'th',
            href: `https://www.gogojungle.co.jp/th${originUrl}`,
          },
          {
            rel: 'alternate',
            hreflang: 'vi',
            href: `https://www.gogojungle.co.jp/vi${originUrl}`,
          },
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: `https://www.gogojungle.co.jp${originUrl}`,
          }
        ]
      }
      store.commit('pushBC', {
        name: i18n[locale][leftTitle[revenue][category]].replace('{period}', i18n[locale]['m' + m]),
        path: originUrl
        // target: {
        //   name: 'systemtrade-index-revenue-category',
        //   params: params,
        // },
      })
      return {
        productRank,
        economics,
        category: params.category,
        revenue,
        m,
        originUrl,
        curPage: params.p || 1,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/systemtrade/${revenue}${
              params.category ? '/' + params.category : ''
            }`,
          }
        ].concat(alternateLinks),
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t(`d${this.revenue || 'profitrate'}${this.category || ''}`)
      },
    },
  },
  title
)
export default obj
</script>
