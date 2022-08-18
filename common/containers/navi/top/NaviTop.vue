<template>
  <div class="navi-top">
    <navi-menu :is-list-page="true" />
    <div class="wrap-meme navi-top-content" :class="{emptyHashtag: !popularHashtagsArticle.length}">
      <navi-left-menu class="block-1" @set-followed="handleSelectFollowed" @set-plan="handleSelectPlan" @set-category="handleSelectCategory" @select-search="handleSelectSearch" :hashtags="hashtags" />

      <div class="block-2" v-if="popularHashtagsArticle.length">
        <div class="wrap-hashtag wrap-content">
          <HashtagPopular :hashtags="hashtags" class="hashtag-list flex layout-col" :popular-hashtags-article="popularHashtagsArticle" />
        </div>
      </div>

      <div class="block-3 wrap-content">
        <div class="navi-list flex layout-col">
          <div class="status-title">{{ $t('16') }}</div>
          <span class="mt-30 mb-30" style="text-align: center;" v-if="!selectFollowed && (!naviList || !naviList.length)">
            {{ $t('3') }}
          </span>
          <div class="item" v-if="isBusy == 'up' || loading">
            <Loading />
          </div>
          <template v-if="!loading && naviList.length">
            <NaviTopItem v-for="item in naviList"
                         :opts="{item, objLike: getObjectLike(item), handleLike, handleFavorite}"
                         :key="'navi-top' + item.id"
            />
          </template>
          <template v-if="selectFollowed && !loading && !naviList.length">
            <div class="img-wrapper">
              <Lzimg :data-src="'/img/assets/pc/common/not_found_article.png'" />
              <div class="tit">{{ $t('17') }}</div>
              <div class="cnt">{{ $t('18') }}</div>
              <div class="btn-wrapper"><a :href="`/finance/navi/authors/`" class="btn"><small>{{ $t('19') }}</small></a></div>
            </div>
          </template>
        </div>
      </div>

      <div class="block-4 top-right-content flex layout-col">
        <!--     article ranking     -->
        <template v-if="articleRanking.length">
          <div class="flex center">
            <SocialLinks />
          </div>
          <div class="article-ranking-section flex layout-col mt-30">
            <div class="title flex mid">
              <corona-icon class="mr-5" /> <span style="margin-top: 2px;">{{ $t('8') }}</span>
            </div>
            <div class="ranking-period inline-flex mt-10">
              <div :class="{active: articleTab === PERIODS.YESTERDAY}" @click="articleTab = PERIODS.YESTERDAY">{{ $t('9') }}</div>
              <div :class="{active: articleTab === PERIODS.WEEK}" @click="articleTab = PERIODS.WEEK">{{ $t('10') }}</div>
              <div :class="{active: articleTab === PERIODS.MONTH}" @click="articleTab = PERIODS.MONTH">{{ $t('11') }}</div>
              <div :class="{active: articleTab === PERIODS.ALL}" @click="articleTab = PERIODS.ALL">{{ $t('12') }}</div>
            </div>
            <div class="article-list mt-10">
              <top-ranking :items="articleRanking[articleTab]" />
            </div>
          </div>
        </template>
        <!--     series ranking     -->
        <template v-if="seriesRanking.length">
          <div class="article-ranking-section flex layout-col mt-30">
            <div class="title flex mid">
              <corona-icon class="mr-5" /> <span style="margin-top: 2px;">{{ $t('13') }}</span>
            </div>
            <div class="ranking-period inline-flex mt-10">
              <div :class="{active: seriesTab === PERIODS.YESTERDAY}" @click="seriesTab = PERIODS.YESTERDAY">{{ $t('9') }}</div>
              <div :class="{active: seriesTab === PERIODS.WEEK}" @click="seriesTab = PERIODS.WEEK">{{ $t('20') }}</div>
              <div :class="{active: seriesTab === PERIODS.MONTH}" @click="seriesTab = PERIODS.MONTH">{{ $t('4') }}</div>
              <div :class="{active: seriesTab === PERIODS.ALL}" @click="seriesTab = PERIODS.ALL">{{ $t('21') }}</div>
            </div>
            <div class="article-list mt-10">
              <top-ranking :items="seriesRanking[seriesTab]" is-series />
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="flex center" v-if="isBusy">
      <Loading />
    </div>
  </div>
</template>

<script>
import NaviMenu from '@@/../common/components/navi/navi-header'
import SocialLinks from '@@/../ja/desktop/components/review/SocialLinks.vue'
import CoronaIcon from '@@/../common/components/navi/top/corona-icon'
import i18n from '@@/lang/desktop/navi-layout.json'
import TopRanking from '@@/../common/components/navi/top/top-ranking'
import Loading from '@@/../components/icons/Loading.vue'
import NaviLeftMenu from '@@/../common/components/navi/navi-left-menu'
import NaviTopItem from '@@/../common/components/navi/NaviTopItem'
import HashtagPopular from '@@/../common/components/navi/HashtagPopular'
import {
  scrollDirection,
} from '@@/../common/js/finance/utils'
import Lzimg from '@@/../components/Lzimg.vue'

export default {
  name: 'NaviTop',
  i18n: {
    messages: i18n,
  },
  components: {
    NaviLeftMenu,
    TopRanking,
    NaviMenu,
    SocialLinks,
    CoronaIcon,
    Loading,
    NaviTopItem,
    HashtagPopular,
    Lzimg
  },
  props: {
    hashtags: {
      type: Array,
      default() {return []}
    },
    popularHashtagsArticle: {
      type: Array,
      default() {return []}
    },
    items: {
      type: Object,
      default() {return {}}
    },
    articleRanking: {
      type: Array,
      default() {return []}
    },
    seriesRanking: {
      type: Array,
      default() {return []}
    },
  },
  data() {
    const query = this.$route.query || {},
    followed = query.filters
    return {
      selectFollowed: followed === 'followed' ? 1 : 0,
      naviList: this.items.naviList,
      titleChunk: this.$t('1'),
      PERIODS: {
        YESTERDAY: 0,
        WEEK: 1,
        MONTH: 2,
        ALL: 3
      },
      seriesTab: 0,
      articleTab: 0,
      loading: false,
      // up, down, 0-none
      isBusy: 0,
      articleLikes: {},
      seriesLikes: {},
      isEmptyDataForCurrentFilterInNextPage: false,
      lastNaviItem: null,
    }
  },
  watch: {
    isBusy(val) {
      window.ggjPreventScrollEvent = !!val
    },
  },
  mounted() {
    this.manipulateData(this.naviList, false, this.items.page)
    this.$nextTick(() => {
      setTimeout(() => {
        $(window).on('scroll', this.handleLazyLoad)
      })
    })
  },
  methods: {
    openNav() {
      document.getElementById("myNav").style.width = "100%"
    },
    closeNav() {
      document.getElementById("myNav").style.width = "0%"
    },
    changeUrlState(query) {
      delete query['page']
      const params = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')
      if (params) {
        history.replaceState(null, document.title, `${location.pathname}?${params}`)
      }
    },
    async handleSelectFollowed(value) {
      this.selectFollowed = value
      const params = { ...this.getURLParams(), page: 1, metaInfo: 1, filters: value ? 'followed' : ''}
      delete params.tr
      await this.getData(params)
    },
    async handleSelectPlan(value) {
      const params = { ...this.getURLParams(), plan: value, page: 1, metaInfo: 1}
      delete params.tr
      await this.getData(params)
    },
    getData: async function(params) {
      this.loading = true
      this.isEmptyDataForCurrentFilterInNextPage = false
      try {
        let tn = await this.GoGoHTTP.get('/api/v3/surface/navi/top/new', { params })
        this.naviList = tn.naviList
        this.manipulateData(this.naviList, true, tn.page)
        this.changeUrlState(params)
      } catch (e) {
        console.log(e)
      }
      this.loading = false
    },
    async handleSelectCategory(value) {
      const params = {...this.getURLParams(), category: value, page: 1, metaInfo: 1}
      delete params.tr
      await this.getData(params)
    },
    async handleSelectSearch(value) {
      const params = {...this.getURLParams(), plan: value.plan, category: value.category, page: 1, metaInfo: 1}
      delete params.tr
      await this.getData(params)
    },
    /**
     * @param item {{id: number, isArticle: boolean}}
     * @returns {{isLiked: boolean, totalLike: number}}
     */
    getObjectLike(item) {
      const defaultItem = {
        id: 0,
        masterId: item.id,
        totalLike: 0,
        isLiked: false
      }
      const result = item.isArticle ? this.articleLikes[item.id] : this.seriesLikes[item.id]
      return result || defaultItem
    },
    /**
     * @param item {{id: number, isArticle: boolean}}
     */
    handleLike(item) {
      if (!this.$store.state.user.id) location.href = '/login'
      const defaultItem = {
        id: 0,
        masterId: item.id,
        totalLike: 0,
        isLiked: false
      }
      if (item.isArticle) {
        return this.GoGoHTTP.post(`/api/v3/surface/navi/article/${item.id}/like`)
          .then(() => {
            const favoriteItem = this.articleLikes[item.id] || defaultItem
            this.articleLikes = {
              ...this.articleLikes,
              [item.id]: {
                ...favoriteItem,
                isLiked: !favoriteItem.isLiked,
                totalLike: favoriteItem.isLiked ? --favoriteItem.totalLike : ++favoriteItem.totalLike
              }
            }
          })
      }
      this.GoGoHTTP.post(`/api/v3/surface/navi/series/${item.id}/like`)
        .then(() => {
          const favoriteItem = this.seriesLikes[item.id] || defaultItem
          this.seriesLikes = {
            ...this.seriesLikes,
            [item.id]: {
              ...favoriteItem,
              isLiked: !favoriteItem.isLiked,
              totalLike: favoriteItem.isLiked ? --favoriteItem.totalLike : ++favoriteItem.totalLike
            }
          }
        })
    },
    async handleFavorite(item) {
      if (!this.$store.state.user.id) location.href = '/login'
      const url = item.isArticle ? '/api/v3/surface/navi/favorite/article' : '/api/v3/surface/navi/favorite/series'
      const path = `/finance/navi/${item.isArticle ? 'articles' : 'series'}/${item.id}`
      const res = await this.GoGoHTTP.post(url, {
        articleId: item.id,
        seriesId: item.id
      })
      if (res.status) {
        return this.$store.commit('finance/addFavItem', {
          id: item.id,
          seriesId: item.seriesId,
          detailUrl: path,
          title: item.title
        })
      }
      this.$store.commit('finance/removeFavItem', {id: item.id})
    },
    manipulateData(naviList, isReset = false, page = 1) {
      if (isReset) {
        this.articleLikes = this.seriesLikes = {}
      }
      const articlesIds = [], seriesIds = []
      naviList.forEach(item => {
        if (item.isArticle) articlesIds.push(item.id)
        else seriesIds.push(item.id)
        item.page = page
      })

      if (!articlesIds.length && !seriesIds.length) return

      this.GoGoHTTP.get('/api/v3/surface/navi/like', {
        params: {
          articleIds: articlesIds.join(','),
          seriesIds: seriesIds.join(',')
        }
      }).then(res => {
        const {articleLikes = [], seriesLikes = []} = res
        articleLikes.forEach(al => {
          this.articleLikes = {
            ...this.articleLikes,
            [al.masterId]: al
          }
        })
        seriesLikes.forEach(sl => {
          this.seriesLikes = {
            ...this.seriesLikes,
            [sl.masterId]: sl
          }
        })
      })
    },
    async handleLazyLoad() {
      scrollDirection()
      // detect scroll direction
      let curScrollHeight = window.scrollY + window.innerHeight,
        footer = $('.footer:visible').get(0)

      // detect whether user is scrolling to the footer
      // in that case, we will not call API
      if (window.ggjScrollDirection == 'down' && footer.offsetTop < curScrollHeight &&
          (curScrollHeight - footer.offsetTop) / footer.clientHeight > .7) {
        return
      }

      if (this.isBusy || this.isEmptyDataForCurrentFilterInNextPage) return
      let nl = $('.navi-list'),
          a = nl.get(0).getBoundingClientRect(),
          gap = a.bottom - window.innerHeight,
          loadMorePage = 0,
          pageEl
      if (window.ggjScrollDirection == 'down' && gap < 1200) {
        loadMorePage = 1
        pageEl = nl.find('.item:last-child')
      } else if (window.ggjScrollDirection == 'up') {
        if (a.top > -800) {
          if (window.ggjLastNaviItem && window.ggjLastNaviItem.id && window.ggjLastNaviItem.page > 1) {
            loadMorePage = -1
            pageEl = nl.find('.item').first()
          }
        } else if (window.scrollY > nl.get(0).clientHeight + 200) {
          // 200px of header height
          loadMorePage = 1
          pageEl = nl.find('.item:last-child')
        }
      }
      if (!window.ggjPreventScrollEvent && loadMorePage && pageEl.length &&
          (loadMorePage == 1 || (loadMorePage == -1 && pageEl.data('page') > 1))) {
        this.isBusy = window.ggjScrollDirection
        this.GoGoHTTP.get('/api/v3/surface/navi/top/new',
            { params: {...this.getURLParams(), page: pageEl.data('page') + loadMorePage} })
          .then(async res => {
            if (res && res.naviList.length) {
              this.naviList = loadMorePage == 1 ? this.naviList.concat(res.naviList) : res.naviList.concat(
                  this.naviList)
              this.manipulateData(res.naviList, false, res.page)
              // handle scroll to the latest element in case scroll top
              if (loadMorePage != -1) {
                // let el = nl.find('.item:last-child')
                // if (el.length && el.get(0).getBoundingClientRect().bottom < 0) {
                //   // in case user scroll to the end of screen & it will cause get API forever
                //   window.scrollTo(0, nl.height())
                // }
                return
              }
              await new Promise(resolve => {
                this.$nextTick(() => {
                  setTimeout(() => {
                    // setTimeout to make sure it called after all child NaviTopItems are mounted
                    window.scrollTo(0, $(`#${window.ggjLastNaviItem.id || new URLSearchParams(location.search).get('tr').split('_')[0]}`)
                        .get(0).offsetTop)
                    resolve()
                  })
                })
              })
            } else {
              this.isEmptyDataForCurrentFilterInNextPage = true
            }
          }).finally(() => (this.isBusy = 0))
      }
    },
  }
}
</script>

<style scoped lang="scss">
@import "@@/../common/assets/variables.scss";
.navi-top-content {
  position: relative;
  .sidebar-sm, .sidebar {
    display: none;
  }
  @media all and (max-width: $screen-md-navi) {
    .sidebar-sm {
      display: flex;
    }
  }
}
.img-wrapper {
  width: 100%;
  padding: 20px;
  img {
    width: 100%;
  }
  .tit {
    color: #2d2d2d;
    font-weight: bold;
  }
  .cnt {
    margin: 20px 0;
    color: #757575;
    font-weight: bold;
  }
  .btn {
    color: white;
    background: #73a5d6;
    border: none;
    height: 32px;
    width: 100px;
  }
  .btn-wrapper {
    text-align: center;
  }
}
.navi-top {
  font-size: 16px;
  @media all and (min-width: $screen-md-navi) {
    .navi-list, .hashtag-list {
      margin-right: 60px;
      text-align: center;
      .img-wrapper {
        max-width: 600px;
      }
    }
    .navi-top-content {
      flex-direction: row;
    }
    .sidebar {
      display: flex;
      width: 300px;
    }
  }
}
.navi-list, .hashtag-list {
  .item:first-child {
    margin-top: 30px;
  }
  position: relative;
  max-width: 600px;
  width: 100%;
}
.top-right-content {
  margin-top: 30px;
  padding-left: 10px;
  padding-right: 10px;
  .social {
    margin: auto;
  }
  /deep/ a.btn-social {
    width: 224px;
    height: 60px;
    i {
      width: 36px;
      height: 36px;
      margin-left: 20px;
    }
    p {
      display: flex;
      flex-direction: column-reverse;
      margin-left: 20px;
      span {
        font-size: 12px;
      }
    }
  }
}
.article-ranking-section {
  align-self: center;
  .title {
    color: #000;
    svg {
      width: 34px;
    }
  }
  .ranking-period div {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
    flex: 1;
    width: 72px;
    height: 30px;
    background-color: #ccc;
    color: #333;
    &:first-child {
      border-top-left-radius: 4px;
    }
    &:last-child {
      border-top-right-radius: 4px;
    }
    &.active, &:hover {
      background-color: #494949;
      color: white;
      transition: background-color 0.5s;
    }
  }
}
.status-title {
  font-size: 21px;
  font-weight: bold;
  margin-bottom: 20px;
  padding: 24px 15px;
  border-bottom: solid 2px #efefef;
  text-align: left;
  @media only screen and (min-width: $screen-md-navi) {
    text-align: center;
  }
}
@media screen and (max-width: $screen-md-navi) {
  .wrap-content {
    justify-content: center;
  }
  .wrap-meme {
    display: flex !important;
    flex-direction: column !important;
    .block {
      &-1 {
        order: 2;
      }
      &-2 {
        order: 1;
        justify-content: center;
        background: #f5f5f5;
        .wrap-hashtag {
          width: 100%;
          display: flex;
          justify-content: center;
          background: #fff;
          margin-bottom: 15px;
          box-shadow: 0 1px 3px #00000029;
        }
      }
      &-3 {
        justify-content: center;
        order: 3;
        .navi-list {
          .status-title {
            display: none;
          }
        }
      }
      &-4 {
        display: none;
      }
    }
  }
}
@media screen and (max-width: 1000px) {
  .top-right-content {
    display: none;
  }
  .navi-list, .hashtag-list {
    margin-bottom: 15px;
    background: #fff;
  }
}
.wrap-content {
  display: flex;
  min-width: 50%;
  justify-content: end;
}
.wrap-meme {
  display: grid;
  grid-template-columns: 300px auto auto;
  grid-template-rows: 600px auto;
  &.emptyHashtag {
    grid-template-rows: auto;
    .block {
      &-2 {
        display: none;
      }
      &-3 {
        grid-row: 1;
      }
    }
  }
  .block {
    &-1 {
      grid-column: 1;
      grid-row: 1;
    }
    &-2 {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }
    &-3 {
      grid-column: 2 / 3;
      grid-row: 2 / 2;
    }
    &-4 {
      grid-column: 3;
      grid-row: 1;
      place-self: flex-start;
    }
  }
}
</style>
