<template>
  <div v-if="isArticleDetailPage || isSeriesDetailPage || isSearchPage || isAuthorPage || $route.path === '/finance/navi' || isSeriesListPage || isArticleListPage">
    <no-ssr>
      <ScrollTopButton class="toggle-scroll" />
    </no-ssr>
    <nuxt-child ref="navi" :series-ranking="seriesRanking" :article-ranking="articleRanking" />
  </div>
  <div class="navi-wrapper w-full" v-else>
    <no-ssr>
      <ScrollTopButton class="toggle-scroll" />
    </no-ssr>
    <img class="w-full" height="auto" src="/img/assets/mobile/navi/navi_main.jpg" v-if="$route.path.startsWith('/finance/navi')" />
    <TopMenu />
    <NaviTabMenu class="flex" />
    <SearchBox :placeholder="$t(1)" v-model="keyword" @enter="gotoSearch" @search="gotoSearch" />
    <nuxt-child ref="navi" />
  </div>
</template>

<script>
import TopMenu from '@/components/finance/TopMenu.vue'
import NaviTabMenu from '@/components/finance/navi/NaviTabMenu.vue'
import SearchBox from '@/components/finance/SearchBox.vue'
import i18n from '@@/lang/mobile/navi.json'
import NaviMixin from '@@/../common/containers/navi/mixin'
import ScrollTopButton from '@@/../components/ScrollTopButton.vue'

export default {
  i18n: {
    messages: i18n,
  },
  mixins: [NaviMixin],
  components: {
    ScrollTopButton,
    TopMenu,
    NaviTabMenu,
    SearchBox,
  },
  data() {
    return {
      keyword: this.$route.params.w,
      seriesRanking: [],
      articleRanking: [],
      favData: {
        readLater: [],
        favorite: [],
        purchased: [],
      },
    }
  },
  async mounted() {
    const [seriesRanking, articleRanking] = await Promise.all([
      this.GoGoHTTP.get(`/api/v3/surface/navi/rank/series`, {params: {limit: 5}}),
      this.GoGoHTTP.get(`/api/v3/surface/navi/rank/article`, {params: {limit: 5}}),
    ])
    this.articleRanking = articleRanking
    this.seriesRanking = seriesRanking
    this.getData()
  },
  methods: {
    gotoSearch() {
      let query = `p/1/ipc/0/pt/3/${
        this.keyword ? `w/${encodeURIComponent(this.keyword)}` : ''
      }`

      location.href = `/finance/navi/${
        this.$store.state.navi.searchType
      }searchresult/${query}`
    },
    async getData() {
      let [favorite, follow, purchased] = await Promise.all([
        this.GoGoHTTP.get(`/api/v3/surface/navi/favorite`),
        this.GoGoHTTP.get(`/api/v3/surface/navi/readlater`),
        this.GoGoHTTP.get(`/api/v3/surface/navi/purchased`),
      ])

      this.favData.readLater = follow || []
      this.favData.favorite = favorite || []
      this.favData.purchased = purchased || []

      this.$store.commit('finance/setFavData', {
        favorite: favorite,
        purchased: purchased,
        follow: follow,
      })
    },
  },
}
</script>
<style lang='scss' scoped>
@media screen and (min-width: 1025px) {
  .toggle-scroll {
    display: none !important;
  }
}
@media screen and (max-width: 480px) {
  .toggle-scroll {
    margin-bottom: 8px !important;
    margin-left: 6px !important;
  }
}
</style>