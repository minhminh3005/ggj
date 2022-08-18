<template>
  <div class="flex layout-col">
    <div class="series-list w-full">
      <div class="left-menu flex layout-col">
        <div class="flex layout-col filters" :class="toggleSearch ? 'toggle-search' : ''">
          <div class="status-list inline-flex">
            <span @click="setPlan(-1)" :class="{selected: plan === -1}">{{ $t('3') }}</span>
            <span @click="setPlan(1)" :class="{selected: plan === 1}">{{ $t('2') }}</span>
            <span @click="setPlan(0)" :class="{selected: !plan}">{{ $t('12') }}</span>
          </div>

          <div class="period">
            <div class="series-period inline-flex mid">
              <span class="desktop">{{ $t('24') }}: &nbsp;</span>
              <div class="dropdown">
                <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  {{ periods[period] || $t('7') }}
                  <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                  <li class="pl-10 pt-10 pb-5" :class="{selected: period === 1}" @click="setPeriod(1)">{{ periods[1] }}</li>
                  <li class="pl-10 pt-10 pb-5" :class="{selected: period === 2}" @click="setPeriod(2)">{{ periods[2] }}</li>
                  <li class="pl-10 pt-10 pb-5" :class="{selected: !period }" @click="setPeriod(0)">{{ periods[0] }}</li>
                  <li class="pl-10 pt-10 pb-5" :class="{selected: period === 3}" @click="setPeriod(3)">{{ periods[3] }}</li>
                </ul>
              </div>
            </div>

            <div class="category inline-flex">
              <span class="desktop">{{ $t('25') }}:&nbsp;</span>
              <div class="desktop flex layout-col">
                <span class="list-item" :class="{selected: !category}" @click="setCategory(0)">{{ $t('3') }} </span>
                <span class="list-item" @click="setCategory(cg.id)" v-for="(cg, index) in categories" :key="index" :class="{selected: category == cg.id}">{{ cg.categoryName }}</span>
              </div>
              <div class="dropdown">
                <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  {{ getCategory(category) || $t('3') }}
                  <span class="caret"></span>
                </button>
                <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu2">
                  <li class="pl-10 pt-10 pb-5" :class="{selected: !category}" @click="setCategory(0)">{{ $t('3') }}</li>
                  <li v-for="(cg, index) in categories" :key="index" class="pl-10 pt-10 pb-5" :class="{selected: category == cg.id}" @click="setCategory(cg.id)">{{ cg.categoryName }}</li>
                </ul>
              </div>
            </div>
            <div class="divider"></div>
          </div>
          <div class="search-block">
            <div class="series-search" @click="onSearch">
              <form @submit="onSearch" action=""><input name="keyword" ref="searchInput" v-model="keyword" type="search" /></form>
              <SeriesSearch />
            </div>
            <div :class="toggleSearch ? 'search-close' : 'hidden'" @click="()=> toggleSearch = false">
              <CloseIcon />
            </div>
          </div>
        </div>
      </div>
      <div class="series-list-content center layout-col w-full loading" ref="seriesContent">
        <a class="banner flex center p-15 pb-30" v-if="banners.landingPageUrl" target="_blank" rel="nofollow" :href="banners.landingPageUrl">
          <img :src="banners.bannerUrl" alt="" style="max-width: 1000px; max-height: 130px; width: 100%;" />
        </a>
        <template v-if="loading">
          <Loading />
        </template>
        <div v-else-if="!highlightItems.length && !normalItems.length" class="flex center mid mb-30">
          {{ $t(16) }}
        </div>
        <template v-else>
          <div class="item" v-if="isBusy == 'up' || loading">
            <Loading />
          </div>
          <div class="highlight-items row flex flex-wrap">
            <NaviArticleItem class="large-item col-xs-12 col-sm-4 col-md-6 col-lg-4 pb-50" v-for="item in highlightItems" :key="'highlight-items-' + item.id"
                             :opts="{item, category: getCategory(item.categoryId), objLike: getObjectLike(item), handleLike, imgHeight: 140}"
            />
          </div>
          <div class="normal-items-and-ranking">
            <div class="series-normal-items w-full" style="align-content: flex-start;">
              <NaviArticleItem class="col-xs-12 col-sm-6 col-md-6 col-lg-3" v-for="item in normalItems" :key="'normalItems-' + item.id"
                               :opts="{item, category: getCategory(item.categoryId), objLike: getObjectLike(item), handleLike}"
              />
            </div>
            <div class="ml-30 ranking flex layout-col">
              <div class="title flex mid">
                <corona-icon class="mr-5" />
                <span style="margin-top: 2px;">{{ $t('18') }}</span>
              </div>
              <div class="ranking-period inline-flex mt-10">
                <div :class="{active: activeTab === PERIODS.YESTERDAY}" @click="activeTab = PERIODS.YESTERDAY">{{ $t('19') }}</div>
                <div :class="{active: activeTab === PERIODS.WEEK}" @click="activeTab = PERIODS.WEEK">{{ $t('20') }}</div>
                <div :class="{active: activeTab === PERIODS.MONTH}" @click="activeTab = PERIODS.MONTH">{{ $t('21') }}</div>
                <div :class="{active: activeTab === PERIODS.ALL}" @click="activeTab = PERIODS.ALL">{{ $t('22') }}</div>
              </div>
              <div class="ranking-content">
                <NaviArticleItem class="pt-30" style="min-width: 200px;"
                                 :opts="{item, category: getCategory(item.categoryId), objLike: getObjectLike(item), handleLike, simpleMode: true, imgHeight: 40}"
                                 v-for="(item, index) in articleRanking[activeTab]" :key="'ranking-content-' + item.id + activeTab"
                >
                  <template slot="ranking">
                    <CupIcon1 v-if="(index + 1) === 1" style="width: 40px;" />
                    <CupIcon2 v-if="(index + 1) === 2" style="width: 40px;" />
                    <CupIcon3 v-if="(index + 1) === 3" style="width: 40px;" />
                    <CupIcon4 v-if="(index + 1) === 4" style="width: 40px;" />
                    <CupIcon5 v-if="(index + 1) === 5" style="width: 40px;" />
                  </template>
                </NaviArticleItem>
              </div>
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
import CoronaIcon from '@@/../common/components/navi/top/corona-icon'
import CupIcon1 from '@@/../common/components/cup-icon-1'
import CupIcon2 from '@@/../common/components/cup-icon-2'
import CupIcon3 from '@@/../common/components/cup-icon-3'
import CupIcon4 from '@@/../common/components/cup-icon-4'
import CupIcon5 from '@@/../common/components/cup-icon-5'
import CloseIcon from '@@/../common/components/close-icon'
import i18n from '@@/lang/desktop/navi-series.json'
import Loading from '@@/../components/icons/Loading.vue'
import SeriesSearch from '@@/../components/icons/SeriesSearch.vue'
import NaviArticleItem from '@@/../common/components/navi/article/NaviArticleItem'
import {
  scrollDirection,
} from '@@/../common/js/finance/utils'

export default {
  name: 'ArticleList',
  i18n: {
    messages: i18n
  },
  components: {
    CloseIcon,
    SeriesSearch,
    Loading,
    CoronaIcon,
    CupIcon1,
    CupIcon2,
    CupIcon3,
    CupIcon4,
    CupIcon5,
    NaviArticleItem,
  },
  props: ['articleRanking', 'data'],
  data() {
    let query = this.$route.query,
      plan = +query.plan
    return {
      toggleSearch : false,
      checkClickPeriod: 3,
      checkClickCategory : 0,
      activeTab: 0,
      total: (this.data || {}).total || 0,
      PERIODS: {
        YESTERDAY: 0,
        WEEK: 1,
        MONTH: 2,
        ALL: 3
      },
      page: 1,
      plan: plan == 0 ? 0 : (plan || -1),
      period: +query.period || 3,
      category: +query.category || 0,
      keyword: query.keyword || '',
      loading: false,
      isBusy: false,
      articleLikes: {},
      periods: {
        0: this.$t('6'),
        1: this.$t('4'),
        2: this.$t('5'),
        3: this.$t('7')
      },
      searchString: '',
      highlightItems: [],
      normalItems: [],
    }
  },
  computed: {
    categories() {
      // const categoryList = this.$store.getters['finance/naviCategories'] || []
      // dont fucking know why only using some categories for articles.
      // return categoryList.filter(cg => [1, 2, 3, 4, 5, 7, 8].includes(cg.id))
      return this.$store.getters['finance/naviCategories'] || []
    },
    banners() {
      const defaultBanner = {landingPageUrl: '', bannerUrl:''}
      const bn = this.$store.getters['getBanners']
      if (!bn || (bn instanceof Array)) return defaultBanner
      return bn[3] || defaultBanner
    }
  },
  methods: {
    handleLike(item) {
      const defaultItem = {
        id: 0,
        masterId: item.id,
        totalLike: 0,
        isLiked: false
      }
      this.GoGoHTTP.post(`/api/v3/surface/navi/article/${item.id}/like`)
        .then(() => {
          const likeItem = this.articleLikes[item.id] || defaultItem
          this.articleLikes = {
            ...this.articleLikes,
            [item.id]: {
              ...likeItem,
              isLiked: !likeItem.isLiked,
              totalLike: likeItem.isLiked ? --likeItem.totalLike : ++likeItem.totalLike
            }
          }
        })
    },
    getObjectLike(item) {
      const defaultItem = {
        id: 0,
        masterId: item.id,
        totalLike: 0,
        isLiked: false
      }

      return this.articleLikes[item.id] || defaultItem
    },
    changeUrlState(query) {
      delete query['page']
      delete query['tr']
      const params = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')
      if (params) {
        history.replaceState(null, document.title, `${location.pathname}?${params}`)
      }
    },
    setPeriod(period) {
      if(this.checkClickPeriod !== period){
        this.fetchData('period', period)
      }
      this.checkClickPeriod = period
    },
    setPlan(plan) {
      this.fetchData('plan', plan)
    },
    setCategory(category) {
      if(this.checkClickCategory !== category){
        this.fetchData('category', category)
      }
      this.checkClickCategory = category
    },
    getCategory(id) {
      const category = this.$store.getters['finance/naviCategoryToObject'] || {}
      const foundCategory = category[id] || {}
      return foundCategory.categoryName
    },
    async fetchData(typeName, typeValue) {
      if (this.loading) return
      this.loading = true
      let par = this.getURLParams()
      const params = {
        ...par,
        keyword: par.keyword || '',
        [typeName]: typeValue,
        page: 1
      }
      this.changeUrlState(params)
      this[typeName] = typeValue
      this.highlightItems = []
      this.normalItems = []
      try {
        const response = await this.GoGoHTTP.get('/api/v3/surface/navi/search/article/top', {
          params
        })
        this.handleData(response.data, 1, 1)
        this.total = response.total || 0
      } catch (e) {
        console.log(e)
      }
      this.loading = false
    },
    handleData(data, page, appendDirection) {
      if (!data || !data.length) return
      if (page == 1) {
        this.highlightItems = data.slice(0, 3)
        data = data.slice(3)
      }
      this.normalItems = appendDirection ? this.normalItems.concat(data) : data.concat(this.normalItems)
    },
    handleLazyLoad() {
      scrollDirection()
      if ((this.highlightItems.length + this.normalItems.length) === this.total || this.isBusy) {
        return
      }
      // detect scroll direction
      let curScrollHeight = window.scrollY + window.innerHeight,
          footer = $('.footer:visible').get(0)

      // detect whether user is scrolling to the footer
      // in that case, we will not call API
      if (window.ggjScrollDirection == 'down' && footer.offsetTop < curScrollHeight &&
          (curScrollHeight - footer.offsetTop) / footer.clientHeight > .7) {
        return
      }
      let nl = $('.series-normal-items'),
          a = nl.get(0).getBoundingClientRect(),
          gap = a.bottom - window.innerHeight,
          loadMorePage = 0,
          pageEl
      if (window.ggjScrollDirection == 'down' && gap < 1150) {
        loadMorePage = 1
        pageEl = nl.find('.series-item:last-child')
      } else if (window.ggjScrollDirection == 'up') {
        // if (a.top > -800) {
        if (window.pageYOffset < 100) {
          if (window.ggjLastNaviItem && window.ggjLastNaviItem.id && window.ggjLastNaviItem.page > 1) {
            loadMorePage = -1
            pageEl = nl.find('.series-item:first-child')
          }
        } else if (window.scrollY > nl.get(0).clientHeight + 200) {
          // 200px of header height
          loadMorePage = 1
          pageEl = nl.find('.series-item:last-child')
        }
      }
      if (!window.ggjPreventScrollEvent && loadMorePage && pageEl.length &&
          (loadMorePage == 1 || (loadMorePage == -1 && pageEl.data('page') > 1))) {
        this.isBusy = window.ggjScrollDirection
        this.GoGoHTTP.get('/api/v3/surface/navi/search/article/top',
            { params: {...this.getURLParams(), page: pageEl.data('page') + loadMorePage} })
            .then(async res => {
              if (!res || !res.data || !res.data.length) {
                return
              }
              this.patchLike(res.data)
              this.handleData(res.data, res.currentPage, loadMorePage == 1)
              this.total = res.total

              // handle scroll to the latest element in case scroll top
              if (loadMorePage != -1) {
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
            }).finally(() => (this.isBusy = 0))
      }
    },
    patchLike(list) {
      if (!list.length || process.server) return
      const ids = list.map(l => l.id)
      this.GoGoHTTP.get('/api/v3/surface/navi/like', {
        params: {
          articleIds: ids.join(',')
        }
      }).then(({articleLikes = []}) => {
        articleLikes.forEach(like => {
          this.articleLikes = {
            ...this.articleLikes,
            [like.masterId]: like
          }
        })
      })
    },
    onSearch(e) {
      e.preventDefault()
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      if ($(window).width() > 425) {
        this.timer = setTimeout(() => {
          this.fetchData('keyword', this.$refs.searchInput.value.trim())
        }, 500)
      } else {
        if (!this.toggleSearch) {
          this.toggleSearch = true
          this.$refs.searchInput.value = ''
        } else {
          this.timer = setTimeout(() => {
            this.fetchData('keyword', this.$refs.searchInput.value.trim())
          }, 500)
        }
      }
    },
  },
  created() {
    const patchIds = [...this.data.data]
    this.handleData(this.data.data, this.data.currentPage)
    if (this.articleRanking && this.articleRanking.length) {
      patchIds.push(...this.articleRanking[0])
      patchIds.push(...this.articleRanking[1])
      patchIds.push(...this.articleRanking[2])
      patchIds.push(...this.articleRanking[3])
    }
    this.patchLike(patchIds)
  },
  mounted() {
    this.$refs.searchInput.value = this.$route.query.keyword || ''
    this.$nextTick(() => {
      $(window).on('scroll', this.handleLazyLoad)
    })
  },
}
</script>

<style scoped lang="scss">
@import "@@/../common/assets/variables.scss";
$btn: #333;
$white: #fff;
$grey: #777;
$lgrey: #a9a9a9;
.ranking-period {
  div {
    &:first-child {
      border-top-left-radius: 4px;
    }
    &:last-child {
      border-top-right-radius: 4px;
    }
  }
}
.placeholder-container {
  position: relative;
  img[alt="placeholder"] {
    z-index: -1;
    visibility: hidden;
  }
  img:last-child,.img-rank {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    height: 100%;
    object-fit: cover;
  }
  .like-fav {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #ecececd1;
    padding: 0 10px;
    margin: 0;
    z-index: 9;
  }
}
.series-list {
  display: inline-flex;
  position: relative;
  .left-menu {
    width: 300px;
    .filters {
      padding: 24px;
    }
    .category div[class="dropdown"] {
      display: none;
    }
    .divider {
      height: 1px;
      width: 100%;
      margin: 10px 0;
      background-color: #f5f5f5;
    }
    * {
      color: $grey;
      &.selected {
        font-weight: bold;
      }
    }
    .btn {
      font-size: 13px;
      padding: 1px 6px;
    }
    .series-period {
      margin-top: 40px;
      margin-bottom: 40px;
    }
    .series-period, .category {
      button {
        border: none;
        outline: none;
        font-weight: bold;
      }
      li {
        cursor: pointer;
        &:hover {
          background-color: #e6e6e6;
        }
      }
      .caret:last-child {
        padding-left: 0;
        height: 4px;
      }
      .desktop {
        margin-right: 10px;
        font-size: 13px;
      }
    }
    .status-list {
      transition: all 1s;
      span {
        margin-right: 10px;
        font-size: 13px;
        height: 35px;
        cursor: pointer;
        width: 64px;
        text-align: start;
        &:hover {
          color: #2c2c2c;
        }
      }
    }
    .navi-search-exit-hide {
      display: none;
    }
    .category {
      span {
        cursor: pointer;
        height: 2em;
        font-size: 13px;
        &:hover {
          color: #2c2c2c;
        }
      }
    }
    .search-block {
      display: flex;
      .series-search {
        display: inline-flex;
        border-radius: 21px;
        width: 100%;
        align-items: center;
        background: $white;
        border: 1px solid #bcb5b9;
        transition: all 1s;
        input {
          border: none;
          color: $grey;
          width: 100%;
          margin-left: 8px;
          font-size: 16px;
        }
        i.icon-cls {
          cursor: pointer;
          margin-right: 10px;
          display: flex;
        }
      }
    }
  }
  .series-list-content {
    position: relative;
    padding: 0 15px;
    .normal-items-and-ranking {
      display: flex;
      .series-normal-items {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
      }
      .ranking {
        width: 220px;
        .title {
          svg {
            width: 34px;
          }
        }
        .ranking-period {
          margin-top: 10px;
          div {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            text-align: center;
            cursor: pointer;
            width: 80px;
            height: 24px;
            background-color: #ccc;
            color: #333;
            &.active, &:hover {
              background-color: #494949;
              color: white;
              transition: background-color 0.5s;
            }
          }
        }
        .series-item > * {
          font-size: 13px;
        }
        .ranking-content {
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
  @media screen and (min-width: $screen-lg) {
    padding-top: 40px;
    .series-list-content {
      padding: 0 60px;
      &.loading {
        min-height: 80vh;
      }
    }
    .filters {
      padding: 0 !important;
      margin-left: 50px;
      min-width: 208px;
    }
    .series-search {
      margin-top: 15px;
    }
    .left-menu {
      .status-list {
        margin-left: -16px;
        .selected {
          color: $white;
          background: $btn;
          &:hover {
            color: $white;
          }
        }
        span {
          height: auto;
          width: auto;
          padding: 8px 16px;
          border-radius: 20px;
          color: #2d2d2d4d;
          font-weight: bold;
          display: inline-block;
          font-size: 13px;
          cursor: pointer;
          text-align: start;
          transition: 0.3s;
          margin-right: 10px;
          &:hover {
            color: $grey;
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
  @media screen and (max-width: $screen-lg) {
    display: flex;
    flex-direction: column;
    .left-menu {
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      background-color: #f5f5f5;
      .filters {
        width: 100%;
        height: auto;
        .status-list {
          order: 2;
          margin-right: 12px;
          span {
            line-height: 36px;
            margin: 0;
            text-align: center;
            color: #bfbfbf;
            background: transparent;
            &.selected {
              background-color: $lgrey;
              color: $white;
              font-weight: normal;
            }
            border-bottom: 1px solid $lgrey;
            border-top: 1px solid $lgrey;
            border-right: 1px solid $lgrey;
            &:first-child {
              border-left: 1px solid $lgrey;
              border-top-left-radius: 3px;
              border-bottom-left-radius: 3px;
            }
            &:last-child {
              border-bottom-right-radius: 3px;
              border-top-right-radius: 3px;
            }
          }
        }
        .series-period, .category {
          margin-top: 0;
          align-items: center;
          margin-right: 20px;
          order: 2;
        }
        .search-block {
          width: 100%;
          .series-search {
            form {
              width: 100%;
            }
            width: 100%;
            padding: 0;
            order: 1;
          }
        }
        .divider {
          display: none;
        }
        .category div {
          &:first-child {
            display: none;
          }
          &:last-child {
            display: inline-flex;
          }
        }
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;
      }
    }
  }
  @media screen and (max-width: 425px) {
    .left-menu {
      margin-bottom: 4rem;
      .filters {
        height: auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 12px;
        .status-list {
          width: auto;
          margin-top: 0;
          flex: 4 !important;
          order: 1;
          margin-right: 0;
        }
        .search-block {
          order: 2;
          align-items: center;
          justify-content: flex-end;
          flex: 1 !important;
          height: 35px;
          .series-search {
            justify-content: center;
            margin-top: 0;
            height: 100%;
            form {
              width: 0;
              input {
                width: 0;
                padding: 0;
                margin-left: 0;
              }
            }
            i.icon-cls {
              width: 32px;
              height: auto;
              cursor: pointer;
              margin-right: 0;
            }
          }
        }
        .period {
          width: 100%;
          order: 3;
          display: flex;
          flex-direction: row;
        }
        .series-period,.category {
          width: 48%;
          order: 3;
          .dropdown {
            width: 100%;
          }
        }
      }
      .toggle-search {
        display: flex;
        height: auto;
        flex-direction: row;
        flex-wrap: wrap;
        .status-list {
          display: none !important;
          transition: all 0.2s;
        }
        .search-block {
          .series-search {
            order: 1;
            justify-content: flex-end;
            transition: all 0.2s;
            form {
              width: 100%;
              input {
                width: 100%;
                margin-left: 12px;
              }
            }
            i.icon-cls {
              width: 32px;
              margin-right: 10px;
            }
          }
          .search-close {
            order: 2;
            line-height: 1;
            color: #a8abb1;
            i.icon-cls {
              width: 16px;
              height: auto;
              cursor: pointer;
              margin: 3px 4px 0 10px;
            }
          }
        }
        .period {
          width: 100%;
          order: 3;
          display: flex;
          flex-direction: row;
        }
        .series-period,.category {
          width: 48%;
          order: 3;
          .dropdown {
            width: 100%;
          }
        }
      }
      .btn {
        width: 100%;
      }
    }
  }
  @media screen and (min-width: 426px) {
    .search-close {
      display: none;
    }
  }
}
@media screen and (max-width: 896px) {
  .normal-items-and-ranking {
    flex-wrap: wrap-reverse;
    .ranking {
      width: 100% !important;
      margin: 0;
      background-color: #494949;
      color: $white;
      padding: 0 20px;
    }
    .title {
      padding: 20px 0 0 0;
    }
    .ranking-period {
      .active {
        background-color: black !important;
      }
    }
    .ranking-content {
      display: inline-flex !important;
      flex-direction: row !important;
      height: 350px;
      overflow-x: auto;
      .series-item {
        background: $white;
        border-radius: 4px;
        padding: 10px;
        margin: 20px 10px;
      }
    }
  }
  .series-search {
    width: 100%;
  }
  .desktop {
    display: none;
  }
  .left-menu {
    .filters {
      .status-list {
        margin-top: 15px;
      }
      .period {
        margin-top: 15px;
      }
      .series-period {
        margin-right: 10px !important;
        margin-bottom: 0;
      }
      .category {
        margin-right: 0 !important;
      }
    }
  }
}
@media screen and (max-width: $screen-lg) {
  .series-info-author {
    position: relative;
  }
  .desktop {
    display: none;
  }
  .series-period, .category {
    button {
      font-weight: normal !important;
      border: 1px solid #ccc !important;
      width: 120px;
      height: 35px;
    }
  }
  .left-menu {
    margin-bottom: 32px !important;
    .filters {
      .search-block {
        order: 1;
      }
      .period {
        order: 3;
        margin-top: 15px;
      }
      .status-list {
        order: 2;
        margin-top: 15px;
      }
      .series-period {
        margin-right: 10px !important;
        margin-bottom: 0;
      }
      .category {
        margin-right: 0 !important;
      }
    }
  }
}
</style>