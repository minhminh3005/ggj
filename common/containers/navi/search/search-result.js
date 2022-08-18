import title from '@@/../common/pages'
import authorMeta from '@@/../common/pages/author.js'
import i18n from '@@/lang/desktop/navi-search.json'
import titleI18n from '@@/lang/common/navi-search-title.json'
import SearchResult from "@@/../common/pages/navi/search/search-result.vue"
import { SEARCH_URL } from '@@/../common/assets/consts/common'

const obj = Object.assign(
  {
    components: {
      SearchResult
    },
    i18n: {
      messages: i18n,
    },
    props: {
      forceSub: Object,
    },
    data() {
      return {
        titleChunk: null,
        meta: [authorMeta],
        isPaidContentList: null,
        periodTypeList: null,
        params: {},
        isLoading: false
      }
    },
    async asyncData({ app, route, store }) {
      // this.$route.params.w sometime decode wrong
      // Ex: %25%40 => %%40 (expected: %@)
      const searchKey = !route.params.wt
      ? (route.query.w || '').replace(/#.*/g, '')
      : route.fullPath
        .split('/w/').pop()
        // avoid case input "#" directly in browser url
        .replace(/#.*/g, '')
      // avoid case input "#" directly in browser url
      const hashTag = (route.query.h || '').replace(/#.*/g, '')

      let locale = app.i18n.locale,
        pageType = (route.path || '').includes('series') ? 'series' : 'articles',
        keyword = decodeURIComponent(searchKey || '') || '',
        hashtag = decodeURIComponent(hashTag || '') || '',
        params = {
          limit: 40,
          searchType: route.params.searchType || 'w',
          isPaidContent: route.query.ipc ? parseInt(route.query.ipc) : 0,
          periodType: route.query.pt ? parseInt(route.query.pt) : 3,
          page: route.query.p ? parseInt(route.query.p) : 1,
          isGetContent: 1,
        },
        naviSearchUrl = '/finance/navi/search',
        extUrl = pageType === 'series' ? 'series/' : '',
        isPaidContentList = [
          { text: i18n[locale][1], id: 1 },
          { text: i18n[locale][2], id: 0 },
          { text: i18n[locale][13], id: 2 },
        ],
        periodTypeList = [
          { text: i18n[locale][3], id: 1 },
          { text: i18n[locale][4], id: 2 },
          { text: i18n[locale][5], id: 0 },
          { text: i18n[locale][6], id: 3 },
        ]

      if(keyword) params.keyword = keyword
      if(hashtag) params.hashtag = hashtag
      if (params.searchType === 't') {
        params.tags = keyword
        store.commit('navi/pushBC', {
          name: i18n[locale].tags[params.tags],
          target: { path: route.fullPath },
        })
      } else {
        store.commit('navi/pushBC', {
          name: params.keyword || params.hashtag,
          target: { path: route.fullPath },
        })
      }
      let dataList = await app.GoGoHTTP.get(
        `/api/v3/surface/navi/search/all`,
        { params: params }
      )
      return {
        pageType,
        dataList,
        params,
        naviSearchUrl,
        extUrl,
        keyword,
        hashtag,
        isPaidContentList,
        periodTypeList,
        titleChunk: `${params.keyword ||
          params.hashtag ||
          i18n[locale].tags[params.tags] ||
          ''} ${
          isPaidContentList.filter(x => x.id === params.isPaidContent)[0].text
        } ${periodTypeList.filter(x => x.id === params.periodType)[0].text}`,
        localeHead: titleI18n[locale] || titleI18n['ja'],
      }
    },
    methods: {
      gotoSearch(keyword) {
        if (!keyword) {
          return
        }
        let q = this.encodeUrlSearchKey(keyword)
        location.href = `${SEARCH_URL}&w=${q}`
      },
      onFilterTab(index) {
        if(index === undefined) return
        this.selectSortPrice(index)
      },
      async onPagingClick(_page) {
        this.onNavigate(_page, this.params.isPaidContent)
      },
      selectSort(index) {
        this.params.periodType = index
        this.onNavigate(1, this.params.isPaidContent)
      },
      selectSortPrice(index) {
        this.onNavigate(1, index)
      },
      onNavigate(page, ipc) {
        let query = `p=${page}&ipc=${ipc}&pt=${this.params.periodType}`
        if(this.keyword) query += `&w=${this.encodeUrlSearchKey(this.keyword) || ''}`
        if(this.hashtag) query += `&h=${this.hashtag || ''}`
        location.href = `${this.naviSearchUrl}?${query}`
      },
      async searchByPrice(index) {
        let params = {
          searchType: this.$route.params.searchType || 'w',
          isPaidContent: index,
          periodType: this.params.periodType
            ? parseInt(this.params.periodType)
            : 3,
          page: this.$route.params.p ? parseInt(this.$route.params.p) : 1,
          limit: 40
        }
        if(this.hashtag) params.hashtag = this.hashtag
        this.dataList = await this.GoGoHTTP.get(
          `/api/v3/surface/navi/search/all`,
          { params: params }
        )
      },
      // head fucntions:
      descriptionTemplate() {
        return this.descriptionChunk
          ? `${this.localeHead.prefix} ${this.descriptionChunk}${
              this.localeHead.description
            }`
          : `${this.localeHead.prefix}`
      },
      keywordsTemplate() {
        return this.keywordsChunk
          ? `${this.localeHead.keywords},${this.keywordsChunk}`
          : `${this.localeHead.keywords}`
      },
    },
  },
  title
)
export default obj
