<template>
  <article-list :article-ranking="articleRanking" :data="articleData" />
</template>

<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/mobile/navi-new.json'
import ArticleList from '@@/../common/containers/navi/article/article-list'

const obj = Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {
      ArticleList
    },
    props: {
      articleRanking: {
        type: Array,
        default() {return []}
      }
    },
    data() {
      return {
        filter: {},
        titleChunk: this.$t('tChunk'),
      }
    },
    async asyncData({ app, query }) {
      let params = {
        page: query.page || 1,
        plan: isNaN(+query.plan) ? -1 : +query.plan,
        period: +query.period || 3,
        category: +query.category || 0,
        keyword: query.keyword || '',
        limit: 25
      }
      let articleData = await app.GoGoHTTP.get(
        '/api/v3/surface/navi/search/article/top',
        { params }
      )
      return {
        articleData,
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/finance/navi/articles',
          },
        ],
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('15')
      },
    },
  },
  title
)

export default obj
</script>

<style lang="scss" scoped>
</style>
