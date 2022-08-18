import NaviTop from '@@/../common/containers/navi/top/NaviTop'
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/navi-index.json'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    NaviTop,
  },
  async asyncData({app, query = {}}) {
    query.metaInfo = 1
    const res = await Promise.all([
      app.GoGoHTTP.get('/api/v3/surface/navi/top/new', { params: query }),
      app.GoGoHTTP.get(`/api/v3/surface/navi/rank/article`, {params: { limit: 10 }}),
      app.GoGoHTTP.get(`/api/v3/surface/navi/rank/series`, { params: { limit: 10 }}),
      app.GoGoHTTP.get(`/api/v3/surface/navi/article/popular-hashtags`),
      app.GoGoHTTP.get(`/api/v3/surface/navi/hashtags/favorite`),
    ])

    return {
      naviList: res[0] || [],
      articleRanking: res[1] || [],
      seriesRanking: res[2] || [],
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/finance/navi`,
        },
      ],
      popularHashtagsArticle: res[3] || [],
      hashtags: res[4] || [],
    }
  },
  data() {
    return {
      titleChunk: this.$t('1'),
    }
  },
  methods: {
    descriptionTemplate() {
      return this.$t('5')
    }
  },
  ...title
}
