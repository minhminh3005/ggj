<template>
  <div v-if="isPageDone" class="navi-index-wrapper">
    <nuxt-child ref="abc" :force-sub="forceSub" :series-ranking="seriesRanking" :article-ranking="articleRanking" />
  </div>
  <div v-else>
    <template v-if="showBanner()">
      <TopMenu class="mb-50" />
    </template>
    <div class="finance-layout w-1000">
      <div class="flex mb-40">
        <Tab class="flex grow1" />
        <InfoBarTop01 />
      </div>
      <div class="flex">
        <div class="left-content">
          <nuxt-child ref="abc" :force-sub="forceSub" />
        </div>
        <div class="right-content ml-20">
          <SearchBox v-model="params.keyword" @enter="gotoSearch" @search="gotoSearch" :placeholder="$t('2')" class="navi-searchbox" />
          <RankingRightContent :article-ranking="articleRanking" :series-ranking="seriesRanking" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RankingRightContent from '@/components/finance/navi/RankingRightContent.vue'
import SearchBox from '@/components/SearchBox.vue'
import Tab from '@/components/finance/Tab.vue'
import InfoBarTop01 from '@/components/navi/InfoBarTop01.vue'
import TopMenu from '@/components/navi/TopMenu.vue'
import i18n from '@@/lang/desktop/navi-layout.json'
import NaviMixin from '@@/../common/containers/navi/mixin'
import { SEARCH_URL } from '@@/../common/assets/consts/common'

export default {
  components: {
    RankingRightContent,
    SearchBox,
    Tab,
    InfoBarTop01,
    TopMenu,
  },
  i18n: {
    messages: i18n,
  },
  layout: 'navi',
  mixins: [NaviMixin],
  methods: {
    gotoSearch() {
      let query = this.params.keyword
        ? `${encodeURIComponent(this.params.keyword)}`
        : ''
      location.href = `${SEARCH_URL}&w=${query}`
    },
    showBanner() {
      if (this.$route.path === '/finance/navi') return true
      for (let i = 0; i < this.banners.length; i++) {
        if (this.$route.path.includes(this.banners[i])) return true
      }
      return false
    },
    async loadInfoBarData() {
      let data = await this.GoGoHTTP.get(`/api/v3/surface/navi/top/headers`)
      let flwing = await ((data || {}).following || []).map(item => {
        item.isFollowed = item.isNotification ? 1 : 2
        return  item
      })
      data.following = flwing
      this.favData = data
      this.$store.commit('finance/setFavData', data)
    },
  },
  data() {
    return {
      params: {},
      banners: [
        '/finance/navi/articles',
        '/finance/navi/series',
        '/finance/navi/authors',
      ],
      forceSub: (function() {
        let observers = []
        return {
          add: function(ob) {
            observers.push(ob)
          },
          remove: function(ob) {
            let index = observers.indexOf(ob)
            if (index > -1) {
              observers.splice(index, 1)
            }
          },
          notifyFollow: function(data) {
            for (let i = 0; i < observers.length; i++) {
              observers[i].notifyFollow(data)
            }
          },
          notifyFavorite: function(data) {
            for (let i = 0; i < observers.length; i++) {
              observers[i].notifyFavorite(data)
            }
          },
        }
      })(),
      favData: {
        readLater: [],
        favorite: [],
        purchased: [],
      },
    }
  },
  async asyncData({ app, route }) {
    let params = {
        sortFee: parseInt(route.params.sortFee) || 1,
        sortPop: parseInt(route.params.sortPop) || 1,
        page: parseInt(route.params.p) || 1,
        limit: 24,
      },
      naviType = route.path.startsWith('/finance/navi/series')
        ? '/series'
        : '/articles'

    if (route.params.searchType === 't') {
      params.tags = route.params.wt
    } else {
      params.keyword = route.params.wt
    }

    let [articleRanking, seriesRanking] = await Promise.all([
      app.GoGoHTTP.get(`/api/v3/surface/navi/rank/article`, {
        params: { limit: 5 },
      }),
      app.GoGoHTTP.get(`/api/v3/surface/navi/rank/series`, {
        params: { limit: 5, isGetContent: 1 },
      })
    ])
    return {
      articleRanking,
      seriesRanking,
      params,
      naviType,
    }
  },
  mounted() {
    this.loadInfoBarData()
  },
}
</script>


<style lang="scss" scoped>
.navi-index-wrapper {
  margin-top: 2px;
}
.finance-layout {
  .left-content {
    width: 740px;
  }
  .right-content {
    width: 240px;
    .navi-searchbox {
      margin-bottom: 23px;
    }
  }
}
</style>
