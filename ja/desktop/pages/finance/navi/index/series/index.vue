<template>
  <series-list :series-ranking="seriesRanking" :data="seriesData" />
</template>

<script>
import title from '@@/../common/pages'
import SeriesList from '@@/../common/containers/navi/series/series-list'
import i18n from '@@/lang/desktop/navi-series.json'
const obj = Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {
      SeriesList
    },
    props: {
      seriesRanking: {
        type: Array,
        default() {return []}
      }
    },
    data() {
      return {
        titleChunk: this.$t('tChunk'),
      }
    },
    async asyncData({ app, query }) {
      let params = {
        tr: query.tr || '',
        plan: isNaN(+query.plan) ? -1 : +query.plan,
        period: isNaN(+query.period) ? 3 : +query.period,
        category: isNaN(+query.category) ? 0 : +query.category,
        keyword: query.keyword || '',
      }
      let seriesData = await app.GoGoHTTP.get(
        '/api/v3/surface/navi/search/series/top',
        { params }
      )
      return {
        seriesData,
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/finance/navi/series',
          },
        ],
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('11')
      },
      titleTemplate() {
        return this.$t('seriesTitle')
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
</style>
