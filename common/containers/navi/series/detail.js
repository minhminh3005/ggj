import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/navi-seriesdetail.json'
import titleI18n from '@@/lang/common/navi-series-detail-title.json'
import { filterInt, pushState, gotoLogin } from '@/utils/client/common'
import {trackingSeriesView} from '@@/../common/js/ga/ecom-enhance'
import SeriesDetailPage from "@@/../common/pages/navi/series/series-detail-page.vue"
import { checkNested } from '@/utils/client/common'

function getData(store, params, data) {
  store.commit('cart/setInfo', {
    productStatus: data.status,
    isPassword: data.isPassword,
    productId: data.pId,
    devId: data.userId,
    name: data.title,
    price: data.price,
    type: 3,
    page: 1,
  })

  let titleChunk = (data.series || { title: '' }).title,
    originUrl = `/finance/navi/series/${params.id}`,
    sortType = parseInt(params.s || 0)
  let dataShow = data.articles
  let datas = data.articles
  store.commit('navi/pushBC', {
    name: titleChunk,
    path: originUrl,
  })
  return {
    params,
    dataShow,
    originUrl,
    titleChunk,
    sortType,
    datas
  }
}

const obj = Object.assign(
  {
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    components: {
      SeriesDetailPage
    },
    i18n: {
      messages: i18n,
    },
    props: {
      forceSub: Object,
    },
    data() {
      return {
        dataShow: {
          data: [],
        },
        sortArticle: [
          {
            id: 0,
            text: this.$t('5'),
          },
          {
            id: 1,
            text: this.$t('6'),
          },
        ],
        likeStatus: {},
        page: 1,
        frCo: '#52b800',
        foCo: '#e4e4e4',
        loading1: false,
        loading2: false,
        isUnFav: true,
        isUnFollow: true,
        loading: false,
        isError: false,
        FXON_BLOG_URL: process.env.FXON_BLOG_URL,
      }
    },
    computed: {
      productStatus() {
        return this.$store.state.cart.productStatus
      },
      isPassword() {
        return this.$store.getters['cart/isPassword']
      },
      checkShowPass() {
        return (
          this.isPassword === 1 &&
          (!this.productStatus || this.productStatus === -1)
        )
      },
      checkShowPayment() {
        return this.data.series.price > 0
      }
    },
    async asyncData({ app, params, store, error }) {
      const paramsApi = {
        isPaid: isNaN(params.isPaid) ? -1 : Number(params.isPaid),
        articlePage: isNaN(params.p) ? 1 : Number(params.p),
        articleLimit: 10,
        sortType: isNaN(params.s) ? 0 : Number(params.s),
        isNewNavi: 1,
      }
      let [data, isFollowed] = await Promise.all([
        app.GoGoHTTP.get(`/api/v3/surface/navi/series/${params.id}`,
          { params: paramsApi },
        ),
        app.GoGoHTTP.get(`/api/v3/surface/navi/follow/${params.id}/status`,
          { params: {type: 'series'} },
        ),
      ])
      if ((!data || !data.series) && !data.isPassword) {
        return error({ statusCode: 404 })
      }

      let { dataShow, originUrl, titleChunk, sortType, datas } = getData(
        store,
        params,
        data,
      )
      if (!data.series) {
        data.series = {}
      }
      let isPaid = isNaN(params.isPaid) ? -1 : Number(params.isPaid)
      // reset this value as /api/v3/surface/navi/follow/${params.id}/status API
      data.isFollowed = typeof isFollowed === 'object' && Object.keys(isFollowed).length === 0 ? 0 : isFollowed || 0
      return {
        isPaid,
        params,
        data,
        dataShow,
        originUrl,
        titleChunk,
        sortType,
        datas: datas || [],
        seriesId: data.series.id || 0,
        localeHead: titleI18n[app.i18n.locale] || titleI18n['ja'],
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/finance/navi/series/${
              params.id
            }`,
          },
        ],
      }
    },
    mounted() {
      this.getInfoStore()
      this.$nuxt.$on('upDateDataItem', this.getInfoStore)
      // OAM-17509
      window.productId = this.data.series.pId
      trackingSeriesView(this.data)
      this.getLike()
      this.$nuxt.$on('followItemAction', item => {
        if(!item) return
        if(item.id === (this.data.series || {}).userId) this.data.isFollowed = item.isFollowed
      })
    },
    beforeDestroy() {
      this.$nuxt.$off('upDateDataItem')
      this.$nuxt.$off('followItemAction')
    },
    methods: {
      checkNested,
      getLike() {
        if(!this.seriesId) return
        this.GoGoHTTP.get(
          `/api/v3/surface/navi/series/${this.seriesId}/like`
        ).then(res => (this.likeStatus = res))
      },
      onLike() {
        if(!this.seriesId) return
        this.GoGoHTTP.post(
          `/api/v3/surface/navi/series/${this.seriesId}/like`
        ).then(() => {
          this.likeStatus = {
            totalLike: this.likeStatus.isLiked
              ? --this.likeStatus.totalLike
              : ++this.likeStatus.totalLike,
            isLiked: !this.likeStatus.isLiked
          }
        })
      },
      async fetchData(params) {
        const response = await this.GoGoHTTP.get(`/api/v3/surface/navi/series/${this.seriesId}`,{
          params
        })
        this.data = response,
        this.dataShow = response.articles
        pushState({ p: this.page || params.articlePage, s: this.sortType || params.sortType, isPaid: this.isPaid || params.isPaid }, null, '', this.originUrl)
        this.loading = false
      },
      onFilterTab(index) {
        if(this.loading) return
        if(isNaN(index)) return
        this.loading = true
        this.isPaid = index
        this.page = 1
        const params = {
          isPaid: index,
          articlePage: 1,
          articleLimit: 10,
          sortType: this.sortType,
          isNewNavi: 1
        }
        this.fetchData(params)
      },
      isFavoriteStore() {
        let favData = this.$store.getters['finance/getFavData'],
          item = this.data.series
          if(favData) {
            return favData.favorite.findIndex(favItem => favItem.id == item.id)
          }
      },
      isFollowStore() {
        let favData = this.$store.getters['finance/getFavData'],
          item = this.data.series
          if(favData) {
            return favData.follow.findIndex(followItem => followItem.id == item.id)
          }
      },
      getUnFav() {
        let favData = this.$store.getters['finance/getFavData'],
          isFavoriteStore = this.isFavoriteStore()
        if (favData && isFavoriteStore != -1) {
          this.isUnFav = favData.favorite[isFavoriteStore]['isUnFav']
        } else {
          this.isUnFav = true
        }
      },
      getUnFollow() {
        let favData = this.$store.getters['finance/getFavData'],
          isFollowStore = this.isFollowStore()
        if (favData && isFollowStore != -1) {
          this.isUnFollow = favData.follow[isFollowStore]['isUnFollow']
        } else {
          this.isUnFollow = true
        }
      },
      getInfoStore() {
        this.getUnFav()
        this.getUnFollow()
      },
      forceFavorite() {
        this.onFavoriteSeries()
      },
      changeFollow(data) {
        let s = this.data.articles.data.find(el => {
          return el.id === data.item.id
        })
        if (s) {
          s.isReadLater = data.action
        }
      },
      changeFavorite(data) {
        let s = this.data.articles.data.find(el => {
          return el.id === data.item.id
        })
        if (s) {
          s.isFavorite = data.action
        }
      },
      onPagingClick(page) {
        if(this.loading) return
        this.loading = true
        this.page = page
        const params = {
          articlePage: page,
          isPaid: this.isPaid,
          articleLimit: 10,
          sortType: this.sortType,
          isNewNavi: 1
        }
        this.fetchData(params)
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
      onFavoriteSeries() {
        if (!this.$store.state.user.id) {
          gotoLogin(`u=${location.pathname}`)
          return
        }
        if (this.loading2) {
          return
        }
        this.loading2 = true
        this.GoGoHTTP.post(`/api/v3/surface/navi/favorite/series`, {
          seriesId: this.data.series.id,
        })
          .then(res => {
            let item = this.data.series
            if (res.status) {
              this.addFavorite(item)
            } else {
              this.data.series.isFavorite = res.status
              this.removeFavorite(item)
            }
            this.getInfoStore()
            this.$nuxt.$emit('upDateData')
          })
          .finally(() => {
            this.loading2 = false
          })
      },
      selectSort(sortType) {
        if(this.loading) return
        this.loading = true
        this.sortType = sortType
        this.page = 1
        const params = {
          isPaid: this.isPaid,
          articlePage: 1,
          articleLimit: 10,
          sortType: sortType,
          isNewNavi: 1
        }
        this.fetchData(params)
      },
      descriptionTemplate() {
        return (this.data.series || {}).content || ''
      },
      keywordsTemplate() {
        return `${this.localeHead.keywords}`
      },
      getSeries(password) {
        if (!password || typeof password !== 'string') {
          this.isError = true
          return
        }
        this.loading = true
        return this.getPasswordSeries(password).finally(() => {
          this.loading = false
        })
      },
      getPasswordSeries(password) {
        return this.GoGoHTTP.post(
          `/api/v3/surface/navi/series/${this.$nuxt._route.params.id}`,
          {
            pagePassword: password,
          }
        ).then(data => {
          if (Object.keys(data).length === 0) {
            data = {}
          }
          if (this.isPassword === 2) {
            this.$store.commit('cart/productStatus', data.status)
          }
          if (this.isPassword == 1 && data.status == 0) {
            this.$store.commit('cart/productStatus', 0)
            this.isError = true
            this.password = null
          }
          if (this.isPassword === 1 && data.status == 1) {
            let { dataShow, originUrl, titleChunk, sortType } = getData(
              this.$store,
              this.$nuxt._route.params,
              data
            )

            this.data = data
            this.dataShow = dataShow
            this.originUrl = originUrl
            this.titleChunk = titleChunk
            this.sortType = sortType
          }
        })
      },
    },
  },
  title
)
export default obj
