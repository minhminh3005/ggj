<template>
  <product-rank-list
    :origin-url="originUrl"
    :cur-page="curPage"
    :data="productRank"
    :category="category"
    :revenue="revenue"
    :left-title="$t(leftTitle[revenue][category || 'all'])"
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
import i18n from '@@/lang/desktop/system-revenue.json'
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
const obj = Object.assign(
  {
    scrollToTop: true,
    validate({ params }) {
      return (
        ~['profitrate', 'profit', 'profitfactor', 'riskreturn', 'sell'].indexOf(
          params.revenue
        )
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
        return this.$t(this.leftTitle[this.revenue][this.category || 'all'])
      },
    },
    async asyncData({ app, params, store }) {
      let locale = app.i18n.locale,
        revenue = params.revenue,
        productRank = await app.GoGoHTTP.get(
          `/api/v3/surface/systemtrade/fx/rank/${revenue}`,
          {
            params: {
              page: params.p || 1,
              limit: 20,
              type: 1,
              m: 3,
            },
          }
        ),
        originUrl = ['/th/systemtrade', revenue, 'fx'].join('/')
      store.commit('pushBC', {
        name: 'Top',
        path: '/th',
      })
      store.commit('pushBC', {
        name: i18n[locale][leftTitle[revenue]['fx']],
        target: {
          name: 'th-systemtrade-index-revenue-fx',
          params: params,
        },
      })
      return {
        productRank,
        category: 'fx',
        revenue,
        originUrl,
        curPage: params.p || 1,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/th/systemtrade/${revenue}/fx`,
          },
          {
            rel: 'alternate',
            hreflang: 'ja',
            href: `https://www.gogojungle.co.jp/systemtrade/${revenue}/fx`,
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `https://www.gogojungle.co.jp/en/systemtrade/${revenue}/fx`,
          },
          {
            rel: 'alternate',
            hreflang: 'th',
            href: `https://www.gogojungle.co.jp/th/systemtrade/${revenue}/fx`,
          },
          {
            rel: 'alternate',
            hreflang: 'vi',
            href: `https://www.gogojungle.co.jp/vi/systemtrade/${revenue}/fx`,
          },
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: `https://www.gogojungle.co.jp/systemtrade/${revenue}/fx`,
          }
        ],
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t(`d${this.revenue || 'profitrate'}fx`)
      },
    },
  },
  title
)
export default obj
</script>
