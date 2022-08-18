<template>
  <div class="w-full writer-list">
    <section class="writer-section w-full inline-flex">
      <div class="author-group">
        <img class="author-image" :src="'/img/users/' + author.id + '/original'" :alt="author.name" />
      </div>
      <div class="author-info">
        <div class="flex layout-col">
          <div class="group-info">
            <a target="_blank" title="AuthorName" :href="`/users/${author.id || ''}`" class="author-name clamp clamp-2">{{ author.name || $t(23) }}</a>
            <div class="group-share hidden-xs hidden-sm">
              <a class="cursor-pointer write-info" @click="isShowModal = true">{{ $t(24) }}</a>
              <NaviFollowActions :attrs="followOpt" :product="author" @onClick="handleFollow" @updateNotify="updateNotify" />
            </div>
          </div>
          <div class="follow-info">
            <div class="hover-num mr-30" @click="clickFollerNum">
              <span class="num">{{ author.numFollowing || 0 }}</span>
              <br class="visible-xs" />
              <span>{{ $t(22) }}</span>
            </div>
            <div class="hover-num" @click="clickFollowingNum">
              <span class="num">{{ author.numFollower || 0 }}</span>
              <br class="visible-xs" />
              <span>{{ $t(21) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="visible-xs visible-sm" style="padding-top: 8px;">
      <div class="group-share">
        <a class="mt-15 cursor-pointer write-info" @click="isShowModal = true">{{ $t(25) }}</a>
        <NaviFollowActions :attrs="followOpt" :product="author" @onClick="handleFollow" @updateNotify="updateNotify" />
      </div>
    </section>
    <section class="author-content">
      <div class="author-share" v-html="urlify(author.userIntroduction)"></div>
      <div class="author-linkk">
        <a target="_blank" :href="`/users/${author.id || ''}`" class="author-link">{{ $t('20') }}</a>
      </div>
    </section>
    <ul class="nav nav-tabs" role="tablist">
      <li role="presentation" :class="{active: tabSelected === TYPE.ARTICLES}"><a :name="TYPE.ARTICLES" href="#articles" aria-controls="articles" role="tab" data-toggle="tab">{{ $t('17') }}</a></li>
      <li role="presentation" :class="{active: tabSelected === TYPE.SERIES}"><a :name="TYPE.SERIES" href="#series" aria-controls="series" role="tab" data-toggle="tab">{{ $t('18') }}</a></li>
      <li role="presentation" :class="{active: tabSelected === TYPE.FOLLOWING}"><a :name="TYPE.FOLLOWING" href="#following" aria-controls="following" role="tab" data-toggle="tab">{{ $t('26') }}</a></li>
      <li role="presentation" :class="{active: tabSelected === TYPE.FOLLOWER}"><a :name="TYPE.FOLLOWER" href="#follower" aria-controls="follower" role="tab" data-toggle="tab">{{ $t('27') }}</a></li>
    </ul>
    <div class="tab-content" ref="tabManager">
      <div role="tabpanel" class="tab-pane" id="articles" :class="{active: tabSelected === TYPE.ARTICLES}">
        <template>
          <section v-if="!loading" class="p-15 flex layout-col auto section-wrapper bg-grey">
            <article-list class="article-list" @onFilterTab="handleFilterPlan" @selectSort="handSortChange"
                          :sort-type="routeParams[0].sort" :data-source="sortArticle"
                          :list="articleData.data"
                          :total="articleData.total || 0"
                          :page="(articleData.currentPage - 1) || 0"
                          :tab-selected="routeParams[0].plan"
            >
              <template slot-scope="prop">
                <navi-horizontal07 :item="prop.item" />
              </template>
            </article-list>
            <div class="flex center pt-15">
              <paging :cur-page="articleData.currentPage"
                      :total="articleData.lastPage"
                      :from="articleData.pagingFrom"
                      :to="articleData.pagingTo"
                      :has-scroll="false"
                      theme-class="theme5"
                      class="article-list"
                      @pagingclick="onPagingClick"
              />
            </div>
          </section>
          <div class="flex center" v-else><Loading /></div>
        </template>
      </div>
      <div role="tabpanel" class="tab-pane" id="series" :class="{active: tabSelected === TYPE.SERIES}">
        <template>
          <section v-if="!loading" class="p-20 flex layout-col auto section-wrapper">
            <div class="flex space-between mb-10">
              <h5 class="total">{{ $t('19', {number: seriesData.total}) }}</h5>
              <TabFilter class="flex grow1 mid content-end" :tab-selected="routeParams['1'].plan" @onFilterTab="handleFilterPlan" />
            </div>
            <div class="flex content-end price-filter mb-15">
              <SelectBox :data-source="sortArticle" :display="'text'" :id-val="'id'" @input="handSortChange" :selected="routeParams[1].sort" />
            </div>
            <SerieHorizontal v-for="item in seriesData.data" :key="'series-' + item.id" :item="item" @favorite="onFavorite" />
            <div class="flex center">
              <paging :cur-page="seriesData.currentPage"
                      :total="seriesData.lastPage"
                      :from="seriesData.pagingFrom"
                      :to="seriesData.pagingTo"
                      :origin-url="originUrl"
                      :has-scroll="true"
                      theme-class="theme5"
                      @pagingclick="onPagingClick" class="mt-15"
              />
            </div>
          </section>
          <div class="flex center" v-else><Loading /></div>
        </template>
      </div>
      <div role="tabpanel" class="tab-pane" id="following" :class="{active: tabSelected === TYPE.FOLLOWING}">
        <template>
          <section v-if="!loading" class="p-15 flex layout-col auto section-wrapper bg-grey">
            <div class="flex space-between mb-10">
              <h5 class="total">{{ $t('28', {number: followingData.total || 0}) }}</h5>
            </div>
            <div class="author-list">
              <ProductHorizontalFollow v-for="(item,idx) in followingData.data" :key="'aflw'+idx" :product="item" :attrs="{ showButton: true, showDescription: true, theme: 'theme-03' }" @updateFollow="refreshList" />
            </div>
            <div class="flex center">
              <paging :cur-page="followingData.currentPage"
                      :total="followingData.lastPage"
                      :from="followingData.pagingFrom"
                      :to="followingData.pagingTo"
                      :origin-url="originUrl"
                      :has-scroll="true"
                      theme-class="theme5"
                      @pagingclick="onPagingClick" class="mt-15"
              />
            </div>
          </section>
          <div class="flex center" v-else><Loading /></div>
        </template>
      </div>
      <div role="tabpanel" class="tab-pane" id="follower" :class="{active: tabSelected === TYPE.FOLLOWER}">
        <template>
          <section v-if="!loading" class="p-15 flex layout-col auto section-wrapper bg-grey">
            <div class="flex space-between mb-10">
              <h5 class="total">{{ $t('29', {number: followerData.total || 0}) }}</h5>
              <TabFilter class="flex grow1 mid content-end" :tab-selected="routeParams['3'].uType" @onFilterTab="handleFilterFollower" :attrs="{isFollower: true}" />
            </div>
            <div class="author-list">
              <ProductHorizontalFollow v-for="(item,idx) in followerData.data" :key="'aflwer'+idx" :product="item" :attrs="{ showButton: item.isAuthor, showDescription: true, theme: 'theme-03' }" @updateFollow="refreshList" />
            </div>
            <div class="flex center">
              <paging :cur-page="followerData.currentPage"
                      :total="followerData.lastPage"
                      :from="followerData.pagingFrom"
                      :to="followerData.pagingTo"
                      :origin-url="originUrl"
                      :has-scroll="true"
                      theme-class="theme5"
                      @pagingclick="onPagingClick" class="mt-15"
              />
            </div>
          </section>
          <div class="flex center" v-else><Loading /></div>
        </template>
      </div>
    </div>
    <GogoModal :show="isShowModal" @update:show="val => isShowModal = val" :width="w + 100" :height="h + 400">
      <div slot="title" class="flex center">
        {{ $t('6') }}
      </div>
      <div slot="modal-body" class="share-body">
        <div class="a-row flex mid">
          <div class="title">{{ $t('7') }}</div>
          <div class="content">
            <SelectBox :data-source="layoutList" :display="'text'" :id-val="'id'" v-model="layoutType" />
          </div>
        </div>
        <div class="a-row flex mid">
          <div class="title">{{ $t('8') }}</div>
          <div class="content">
            <input type="number" v-model="w" max="999" />px&nbsp;
            <span>{{ $t('12') }}</span>
          </div>
        </div>
        <div class="a-row flex mid">
          <div class="title">{{ $t('9') }}</div>
          <div class="content">
            <input type="number" v-model="h" max="999" />px&nbsp;
            <span>{{ $t('12') }}</span>
          </div>
        </div>
        <div class="a-row flex mid">
          <div class="title">{{ $t('10') }}</div>
          <div class="content">
            <input type="color" v-model="frCo" />&nbsp;
            <span>{{ $t('13') }}</span>
          </div>
        </div>
        <div class="a-row flex mid">
          <div class="title">{{ $t('11') }}</div>
          <div class="content">
            <input type="color" v-model="foCo" />&nbsp;
            <span>{{ $t('13') }}</span>
          </div>
        </div>
        <div class="flex center mt-20">
          <iframe :src="`${FXON_BLOG_URL}/parts/navi_serial_parts.php?w=${w-4}&h=${h-4}&gid=0&did=${author.id}&s=${layoutType}&fr=${frCo.substr(1, 7)}&fo=${foCo.substr(1, 7)}`" style="border: none; overflow: hidden;" :width="w + 'px'" :height="h + 'px'"></iframe>
        </div>
        <div class="share-footer p-20">
          <textarea class="w-full resize-vertical" ref="shareUrl" rows="3" readonly="true" v-model="buildTxt"></textarea>
        </div>
        <div class="flex center pb-20">
          <button class="btn-copy" @click="onCallCopy">{{ $t('16') }}</button>
        </div>
      </div>
      <div slot="modal-footer"></div>
    </GogoModal>
  </div>
</template>

<script>
import Paging from '@@/../components/paging/Paging.vue'
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/navi-writer-list.json'
import { filterInt } from '@@/../ja/desktop/utils/client/common'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import SelectBox from '@@/../components/form/SelectBox.vue'
import SerieHorizontal from '@@/../ja/desktop/components/product/navi/SerieHorizontal.vue'
import { gotoLogin } from '@@/../ja/desktop/utils/client/common'
import TabFilter from '@@/../common/components/navi/series/tab-filter'
import Loading from '@@/../components/icons/Loading.vue'
import ArticleList from '@@/../common/components/navi/series/article-list'
import NaviHorizontal07 from '@@/../common/components/navi/series/navi-horizontal07'
import {urlify} from '@@/../common/assets/js/helper'
import ProductHorizontalFollow from '@@/../components/product/ProductHorizontalFollow.vue'
import NaviFollowActions from '@@/../components/product/NaviFollowActions.vue'
const URL = '/api/v3/surface/navi/follow/'
const URL_AUTHORS = '/api/v3/surface/navi/authors/'

export default {
  validate({ params }) {
    return !isNaN(filterInt(params.id))
  },
  components: {
    Paging,
    GogoModal,
    SelectBox,
    TabFilter,
    SerieHorizontal,
    Loading,
    ArticleList,
    NaviHorizontal07,
    ProductHorizontalFollow,
    NaviFollowActions
  },
  i18n: {
    messages: i18n,
  },
  props: {
    forceSub: Object,
  },
  data() {
    const defaultDataList = {
      total: 0,
      currentPage: 0,
      lastPage: 0,
      pagingFrom: 0,
      pagingTo: 0,
      data: [],
    }
    return {
      loading: true,
      seriesCache: {},
      articlesCache: {},
      seriesData: defaultDataList,
      articleData: defaultDataList,
      followingData: defaultDataList,
      followerData: defaultDataList,
      isShowModal: false,
      frCo: '#52b800',
      foCo: '#e4e4e4',
      w: 400,
      h: 180,
      layoutList: [
        {
          id: 0,
          text: this.$t('14'),
        },
        {
          id: 1,
          text: this.$t('15'),
        },
      ],
      layoutType: 0,
      FXON_BLOG_URL: process.env.FXON_BLOG_URL,
      TYPE: {
        SERIES: 1,
        ARTICLES: 0,
        FOLLOWING: 2,
        FOLLOWER: 3
      },
      sortArticle: [
        {
          id: 1,
          text: this.$t('30'),
        },
        {
          id: 2,
          text: this.$t('31'),
        },
        {
          id: 3,
          text: this.$t('32'),
        },
      ]
    }
  },
  computed: {
    followOpt() {
      return {
        showSelect: this.author.isFollowed || 0,
        showButton: true
      }
    },
    buildTxt() {
      return `<iframe src="${process.env.FXON_BLOG_URL}/parts/navi_serial_parts.php?w=${this
        .w - 4}&h=${this.h - 4}&gid=0&did=${this.author.id}&s=${
        this.layoutType
      }&fr=${this.frCo.substr(1, 7)}&fo=${this.foCo.substr(
        1,
        7
      )}" style="border: none; overflow: hidden" width="400px" height="180px"></iframe>`
    },
    categories() {
      return this.$store.getters['finance/naviCategoryToObject'] || {}
    },
    userId() {
      return this.$store.state.user.id
    },
  },
  async asyncData({ app, params, store, error }) {
    let locale = app.i18n.locale,
      suffix = i18n[locale]['1'],
      originUrl,
      titleChunk

    const currentParams = {
      plan: +params.plan || -1,
      type: +params.type || 0,
      p: +params.p || 1,
      sort: +params.sort || 1,
    }
    const defaultParams = {
      plan: -1,
      type: 0,
      p: 1,
      sort: 1,
    }
    const currentFl = {
      type: +params.type || 0,
      p: +params.p || 1,
    }
    const defaultFl = {
      type: 0,
      p: 1,
    }
    const currentFlwer = {
      ...currentFl,
      uType: +params.uType
    }
    const defaultFlwer = {
      ...defaultFl,
      uType: -1
    }
    const type = +params.type || 0
    let [author, isFollowed] = await Promise.all([
      app.GoGoHTTP.get(`${URL_AUTHORS}${params.id}`, {params: {isNewAuthor: 1}}),
      app.GoGoHTTP.get(`${URL}${params.id}/status`,
        { params: {type: 'author'} },
      ),
    ])
    if (!author || !author.id) {
      return error({ statusCode: 404 })
    }
    originUrl = `/finance/navi/authors/${params.id}`
    titleChunk = suffix.replace('{name}', author.name || '')
    store.commit('pushBC', {
      name: titleChunk,
      path: originUrl,
    })
    author.isFollowed = typeof isFollowed === 'object' && Object.keys(isFollowed).length === 0 ? 0 : isFollowed || 0

    return {
      author,
      // dataShow,
      originUrl,
      titleChunk,
      routeParams: {
       0:  type === 0 ? currentParams : defaultParams,
       1:  type === 1 ? currentParams : defaultParams,
       2:  type === 2 ? currentFl : defaultFl,
       3:  type === 3 ? currentFlwer : defaultFlwer,
      },
      tabSelected: +params.type || 0,
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/finance/navi/authors/${
            params.id
          }`,
        },
      ]
    }
  },
  mounted() {
    const self = this
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
      self.tabSelected = +e.target.name
      self.moveToNewState()
      self.fetchData()
    })
    this.$nuxt.$on('followItemAction', item => {
      if(!item) return
      if(item.id === this.author.id) this.author.isFollowed = item.isFollowed
    })
    this.fetchData()
  },
  beforeDestroy() {
    this.$nuxt.$off('followItemAction')
  },
  methods: {
    urlify,
    async refreshList() {
      if(Number(this.userId) === this.author.id) this.refreshAuthor()
      this.fetchData(false)
      const following = await this.GoGoHTTP.get(`/api/v3/surface/navi/following`)
      this.$store.commit('finance/setFavFollowing', following)
    },
    async refreshAuthor() {
      let id = this.author.id
      let [author, isFollowed] = await Promise.all([
        this.GoGoHTTP.get(`${URL_AUTHORS}${id}`, {params: {isNewAuthor: 1}}),
        this.GoGoHTTP.get(`${URL}${id}/status`,
          { params: {type: 'author'} },
        ),
      ])
      author.isFollowed = typeof isFollowed === 'object' && Object.keys(isFollowed).length === 0 ? 0 : isFollowed || 0
      this.author = author
    },
    fetchData(fromPaging = false) {
      switch(this.tabSelected) {
        case this.TYPE.ARTICLES:
          this.getArticles(fromPaging)
          break
        case this.TYPE.SERIES:
          this.getSeries(fromPaging)
          break
        case this.TYPE.FOLLOWING:
          this.getFollowing(fromPaging)
          break
        case this.TYPE.FOLLOWER:
          this.getFollower(fromPaging)
          break
        default:
          break
      }
    },
    addFavorite(item) {
      let elTopBar = $('#info_fav')
      if (elTopBar.hasClass('active')) {
        item['isUnFav'] = false
      }
      this.$store.commit('finance/addFavItem', item)
    },
    removeFavorite(item) {
      let elTopBar = $('#info_fav')
      if (elTopBar.hasClass('active')) {
        item['isUnFav'] = true
        this.$store.commit('finance/addFavItem', item)
      } else {
        this.$store.commit('finance/removeFavItem', item)
      }
    },
    onFavorite(item) {
      if (!this.$store.state.user.id) {
        gotoLogin(`u=${location.pathname}`)
        return
      }
      this.GoGoHTTP.post(`/api/v3/surface/navi/favorite/series`, {
        seriesId: item.id,
      }).then(res => {
        if (res.status) {
          this.addFavorite(item)
        } else {
          this.removeFavorite(item)
        }
        this.$nuxt.$emit('upDateData')
      })
    },
    onPagingClick(page) {
      let selectedTabRoute = { ...this.routeParams[this.tabSelected] }
      this.routeParams = {
        ...this.routeParams,
        [this.tabSelected]: {
          ...selectedTabRoute,
          p: page
        }
      }
      this.moveToNewState()
      this.fetchData(true)
    },
    descriptionTemplate() {
      return this.author.userIntroduction || ''
    },
    moveToNewState() {
      const routeParams = this.routeParams[`${this.tabSelected}`]
      let combineParams = `/type/${this.tabSelected}/p/${routeParams.p}`
      switch(this.tabSelected) {
        case this.TYPE.ARTICLE:
        case this.TYPE.SERIES:
          combineParams = `/type/${this.tabSelected}/plan/${routeParams.plan}/sort/${routeParams.sort}/p/${routeParams.p}`
          break
        case this.TYPE.FOLLOWER:
          combineParams = `/type/${this.tabSelected}/p/${routeParams.p}/uType/${routeParams.uType}`
          break
        default:
          break
      }
      history.replaceState({ ...routeParams, tab: this.tabSelected }, '', `/finance/navi/authors/${this.author.id}${combineParams}`)
    },
    handleFilterPlan(selectedItem) {
      this.routeParams = {
        ...this.routeParams,
        [this.tabSelected]: {
          ...this.routeParams[this.tabSelected],
          plan: selectedItem
        }
      }
      // set page = 1 when click filter tab
      this.routeParams[0]['p'] = 1
      this.moveToNewState()
      this.fetchData()
    },
    handleFilterFollower(val) {
      this.routeParams = {
        ...this.routeParams,
        [this.tabSelected]: {
          ...this.routeParams[this.tabSelected],
          uType: val
        }
      }
      this.moveToNewState()
      this.fetchData()
    },
    handSortChange(sortType) {
      this.routeParams = {
        ...this.routeParams,
        [this.tabSelected]: {
          ...this.routeParams[this.tabSelected],
          sort: sortType
        }
      }
      this.moveToNewState()
      this.fetchData()
    },
    onClickShare() {
      this.isShowModal = true
    },
    onCallCopy() {
      this.$refs.shareUrl.select()
      document.execCommand('copy')
    },
    handleFollow(item) {
      let method = item.isFollowed ? 'delete': 'post'
      this.GoGoHTTP[method](`${URL}${item.id}`).then(async() => {
        this.author.isFollowed = item.isFollowed ? 0 : 1
        const following = await this.GoGoHTTP.get(`/api/v3/surface/navi/following`)
        this.$store.commit('finance/setFavFollowing', following)
      })
    },
    updateNotify(data) {
      if(!data || !data.item) return
      let item = data.item,
      num = data.num
      this.GoGoHTTP.put(`${URL}${item.id}`, {
        isNotification: num
      }).then(async() => {
        // isFollowed: 0 | 1 | 2 // 0: no follow, 1: follow & noti, 2: follow without noti
        this.author.isFollowed = num === 1 ? 1 : 2
      })
    },
    getArticles(fromPaging) {
      this.loading = true
      let pr = this.routeParams[this.TYPE.ARTICLES]
      return this.GoGoHTTP.get(`${URL_AUTHORS}${this.author.id}/articles`, {
        params: {
          isPaid: pr.plan,
          articlePage: pr.p,
          sortType: pr.sort
        }
      })
        .then(response => {
          const cookDataOfResponse = response.data.map((item, index) => {
            const result = {
              ...item,
              purchased: +item.isPurchased,
              pId: item.productId,
              sId: item.seriesId,
              categoryName: (this.categories[item.naviCategoryId] || {}).categoryName || '',
              index
            }
            delete result['productId']
            delete result['seriesId']
            delete result['isPurchased']
            return result
          })
          this.articleData = {...response, data: cookDataOfResponse}
          this.loading = false
          if (fromPaging) this.$nextTick(() => this.$refs.tabManager.scrollIntoView())
        })
        .catch(e => {
          console.error(e)
          this.loading = false
        })
    },
    getSeries(fromPaging) {
      this.loading = true
      let pr = this.routeParams[this.TYPE.SERIES]
      return this.GoGoHTTP.get(`${URL_AUTHORS}${this.author.id}/series`, {
        params: {
          isPaid: pr.plan,
          seriesPage: pr.p,
          sortType: pr.sort
        }
      })
        .then(response => {
          this.seriesData = response
          this.loading = false
          if (fromPaging) this.$nextTick(() => this.$refs.tabManager.scrollIntoView())
        })
        .catch(e => {
          console.error(e)
          this.loading = false
        })
    },
    getFollowing(fromPaging) {
      this.loading = true
      let pr = this.routeParams[this.TYPE.FOLLOWING]
      return this.GoGoHTTP.get(`${URL_AUTHORS}${this.author.id}/following`, {
        params: {
          page: pr.p
        }
      })
        .then(response => {
          this.followingData = response
          this.loading = false
          if (fromPaging) this.$nextTick(() => this.$refs.tabManager.scrollIntoView())
        })
        .catch(e => {
          console.error(e)
          this.loading = false
        })
    },
    getFollower(fromPaging) {
      this.loading = true
      let pr = this.routeParams[this.TYPE.FOLLOWER]
      let type =
      pr.uType === -1 ? '' :
      pr.uType === 1 ? 'author' : 'general'
      return this.GoGoHTTP.get(`${URL_AUTHORS}${this.author.id}/followers`, {
        params: {
          page: pr.p,
          uType: type
        }
      })
        .then(response => {
          this.followerData = response
          this.loading = false
          if (fromPaging) this.$nextTick(() => this.$refs.tabManager.scrollIntoView())
        })
        .catch(e => {
          console.error(e)
          this.loading = false
        })
    },
    clickFollowingNum() {
      const animateTime = 300
      $('html, body').animate({ scrollTop: $('.nav-tabs').offset().top }, animateTime)
      setTimeout(() => {$('.nav-tabs li:last-child a').tab('show')}, animateTime + 50)

      // then scroll to end tab
      setTimeout(() => {
        $('.nav-tabs').animate({ scrollLeft: $('.nav-tabs li:last-child').position().left }, animateTime)
      }, animateTime + 100)
    },
    clickFollerNum() {
      const animateTime = 300
      $('html, body').animate({ scrollTop: $('.nav-tabs').offset().top }, animateTime)
      setTimeout(() => $('.nav-tabs li:nth-last-child(2) a').tab('show'), animateTime + 50)

      // then scroll to end tab
      setTimeout(() => {
        $('.nav-tabs').animate({ scrollLeft: $('.nav-tabs li:last-child').position().left }, animateTime)
      }, animateTime + 100)
    },
  },
  ...title
}
</script>

<style lang="scss" scoped>
@import "@@/../common/assets/variables.scss";
.writer-list {
  color: #2d2d2d;
  max-width: 1000px; // 620 + 310 + 155
  align-self: center;
  background: #fff;
  margin: auto;
  .user-img {
    flex: 0 0 60px;
    width: 60px;
    height: 60px;
  }
  .user-name {
    font-size: 24px;
    line-height: 30px;
  }
  .user-url {
    color: #2d2d2d;
    display: inline-block;
  }
  .ext-link {
    align-items: flex-end;
  }
  .blog-part {
    background: #fdfdfd;
    padding: 0 5px;
    width: 135px;
    span {
      font-size: 11px;
    }
    &:hover,
    &:active,
    &:focus {
      outline: none;
      background: #fdfdfd;
    }
  }
  .guide {
    .icon-cls {
      color: #2d2d2d;
      flex: 0 0 17px;
      width: 17px;
      height: 17px;
    }
    span {
      margin-top: 1px;
      color: #2d2d2d;
    }
  }
  .nav-tabs {
    display: flex;
    border-top: 1px solid #ddd;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    * {
      font-size: 14px;
      color: #ccc !important;
    }
    li {
      > a {
        padding: 8px 20px;
        border: none;
      }
      &.active {
        * {
          color: #333 !important;
        }
        margin: 0 !important;
        > a, > a:hover, > a:focus {
          border: none !important;
        }
      }
    }
  }
  .price-filter {
    /deep/ button {
      height: 25px;
      border-radius: 5px;
    }
  }
  .writer-section {
    padding-top: 40px;
  }
  .author-content {
    padding-bottom: 80px;
  }
}
/deep/ .loader {
  min-height: 70vh;
  @media only screen and (min-width: $screen-xs) {
    /deep/ .loader {
      min-height: 500px;
    }
  }
}
.hover-num {
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
@media only screen and (max-width: $screen-xs) {
  .section-wrapper {
    min-height: auto;
  }
}
@media only screen and (max-width: $screen-sm) {
  .author-content {
    padding-left: 15px;
    padding-right: 15px;
  }
  .writer-section {
    padding-left: 15px;
    padding-right: 15px;
    flex-wrap: nowrap;
  }
  .author-name {
    font-size: 15px !important;
    font-weight: bold;
    max-width: 100% !important;
  }
  .group-share {
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
    justify-content: space-between;
    height: 28px;
    align-items: center;
  }
  .group-info {
    flex-direction: column;
  }
}
/deep/ .modal-dialog {
  top: 15%;
  margin: 10% auto;
}
.share-body {
  border-top: 1px dotted #d9d9d9;
  background: white;
  .a-row {
    border-bottom: 1px dotted #d9d9d9;
    padding: 5px 10px;
    .title {
      text-align: right;
      flex: 0 0 40%;
      width: 40%;
      padding-right: 10px;
    }
    .content {
      padding-left: 10px;
      input {
        width: 60px;
        height: 25px;
      }
    }
  }
  .share-footer {
    textarea {
      resize: vertical;
    }
  }
  .btn-copy {
    height: 25px;
    width: 150px;
    border-radius: 5px;
    border: 1px solid #d1d1d1;
    outline: none;
    background: white;
  }
}
.serie-list /deep/ {
  .article-XMkTj {
    margin-bottom: 0;
  }
}
.section-wrapper {
  /deep/ .list-VHwiM {
    padding-top: 35px;
  }
  min-height: 500px;
  @media only screen and (max-width: 768px), only screen and (max-height: 414px) and (max-width: 896px) {
    &.bg-grey {
      background-color: #4b4b4b;
    }
    /deep/ .list-filter, /deep/ .content-end {
      top: 0 !important;
      .fi-tab.active {
        border: 1px solid #777;
      }
    }
    .total { color: white; }
    /deep/ .list-options {
      top: 25px !important;
    }
    /deep/ .list-header {
      padding-top: 0 !important;
    }
    /deep/ .article-XMkTj:first-child {
      border-top: solid 1px #777;
    }
    /deep/ .list-VHwiM { padding-top: 65px !important; }
    /deep/ .theme5 { display: block; }
  }
  /deep/ .article-XMkTj {
    width: 100%;
    margin-bottom: 0 !important;
  }
}
.author-name {
  color: #333;
  font-size: 24px;
  margin-top: 4px;
  margin-bottom: 16px;
  text-decoration: none;
  max-width: 60%;
}
.author-share {
  color: #727272;
  font-size: 14px;
  line-height: 2;
  white-space: break-spaces;
  word-break: break-word;
  margin-top: 20px;
}
.author-linkk {
  margin-top: 40px;
}
.author-link {
  color: #337ab7;
  text-decoration: underline;
  font-weight: bold;
}
.write-info {
  font-size: 12px;
  color: #333;
  text-decoration: underline;
}
img.author-image {
  width: 110px;
  height: auto;
  border-radius: 2px;
}
.author-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  @media all and (max-width: 896px) {
    align-items: unset;
  }
}
/deep/ .list-header {
  margin-top: 0 !important;
}
.article-bagde {
  min-width: auto;
}
.total {
  margin: 0;
  position: relative;
  top: 18px;
}
.author-list {
  margin-top: 25px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 15px;
  .product-horizontal {
    width: 32.2%;
  }
}
.follow-info {
  display: flex;
  color: #757575;
  .num {
    color: #2d2d2d;
    font-weight: bold;
  }
}
.group-info {
  display: flex;
  justify-content: space-between;
}
.group-share {
  display: flex;
  align-items: center;
  .write-info {
    color: #757575;
    margin-right: 30px;
  }
  /deep/ .follow-group {
    width: 176px;
    .sl-QFVuO {
      .sl-area {
        width: 100%;
        justify-content: center;
      }
      .dropdown-menu {
        left: 30px;
      }
    }
    .btn-follow {
      width: 100%;
    }
  }
}
.author-info {
  width: 100%;
  padding-left: 16px;
  @media all and (min-width: $screen-xs) {
    padding-left: 30px;
  }
}
// test
.btn-follow {
  color: #fff;
  background: #73cdd6;
  border-radius: 2px;
  border: none;
  padding: 5px 15px;
  transition: 0.3s;
  width: 160px;
  &:hover {
    background: #4cb2bb;
  }
}
@media only screen and (max-width: $screen-sm) {
  .author-list {
    .product-horizontal {
      width: 100%;
      padding: 0 15px;
    }
  }
}
</style>

<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>
