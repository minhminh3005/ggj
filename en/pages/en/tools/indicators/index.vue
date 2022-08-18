<template>
  <ListProducts
    :origin-url="originUrl"
    :cur-page="curPage"
    :data="newProduct"
    :title="$t('2')"
  >
    <div class="right-content" slot="right-content">
      <right-content class="mt-5" :category="'indicators'" />
    </div>
  </ListProducts>
</template>
<script>
import i18n from '@@/lang/desktop/th-indicators-list.json'
import title from '@@/../common/pages'
import ListProducts from '@/components/tools/ListProducts.vue'
import RightContent from '@/components/systemtrade/RightContent.vue'
const obj = Object.assign(
  {
    scrollToTop: true,
    components: { ListProducts, RightContent },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: this.$t('2'),
      }
    },
    async asyncData({ app, params, store }) {
      let locale = app.i18n.locale,
        _page = params.p || 1,
        newProduct = await app.GoGoHTTP.get('/api/v3/surface/tools/indicators', {
          params: {
            page: _page,
            limit: 40,
          }
        }),
        originUrl = '/en/tools/indicators'
      store.commit('pushBC', {
        name: 'Top',
        path: '/en',
      })
      store.commit('pushBC', {
        name: i18n[locale]['2'],
        path: '/en/tools/indicators',
      })
      return {
        newProduct,
        originUrl,
        curPage: params.p || 1,
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/en/tools/indicators',
          },
        ],
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('dall')
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
