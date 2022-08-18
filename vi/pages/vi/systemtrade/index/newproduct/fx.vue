<template>
  <NewProduct
    :origin-url="originUrl"
    :cur-page="curPage"
    :data="newProduct"
    :cur-type="$route.params.category"
  >
    <div class="right-content" slot="right-content">
      <right-content class="mt-5" :category="'fx'" />
    </div>
  </NewProduct>
</template>
<script>
import i18n from '@@/lang/desktop/systemtrade-newproduct.json'
import title from '@@/../common/pages'
import NewProduct from '@@/../components/systemtrade/NewProduct.vue'
import RightContent from '@/components/systemtrade/RightContent.vue'
const obj = Object.assign(
  {
    scrollToTop: true,
    components: { NewProduct, RightContent },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: this.$route.params.category
          ? this.$t('2' + this.$route.params.category)
          : this.$t('2'),
      }
    },
    async asyncData({ app, params, store }) {
      let locale = app.i18n.locale,
        newProduct = await app.GoGoHTTP.get('/api/v3/surface/systemtrade/fx/new/product?limit=0'),
        originUrl = '/vi/systemtrade/newproduct/fx'
      store.commit('pushBC', {
        name: 'Top',
        path: '/vi',
      })
      store.commit('pushBC', {
        name: i18n[locale]['2fx'],
        target: {
          path: originUrl,
        },
      })
      return {
        newProduct,
        originUrl,
        curPage: params.p || 1,
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/vi/systemtrade/newproduct/fx',
          },
          {
            rel: 'alternate',
            hreflang: 'ja',
            href: `https://www.gogojungle.co.jp/systemtrade/newproduct/fx`,
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `https://www.gogojungle.co.jp/en/systemtrade/newproduct/fx`,
          },
          {
            rel: 'alternate',
            hreflang: 'th',
            href: `https://www.gogojungle.co.jp/th/systemtrade/newproduct/fx`,
          },
          {
            rel: 'alternate',
            hreflang: 'vi',
            href: `https://www.gogojungle.co.jp/vi/systemtrade/newproduct/fx`,
          },
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: `https://www.gogojungle.co.jp/systemtrade/newproduct/fx`,
          }
        ],
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('dfx')
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
}
</style>
