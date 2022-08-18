import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/navi-authors.json'
import AuthorsPage from "@@/../common/pages/navi/authors/authors.vue"
const URL = '/api/v3/surface/navi/search/author'

const obj = Object.assign(
  {
    components: {
      AuthorsPage
    },
    i18n: {
      messages: i18n,
    },
    data() {
      // this.$route.params.w sometime decode wrong
      // Ex: %25%40 => %%40 (expected: %@)
      const fullPath = this.$route.fullPath
      const searchKey = !this.$route.params.w
      ? ''
      : fullPath
        .split('/w/').pop()
        // avoid case input "#" directly in browser url
        .replace(/#.*/g, '')

      return {
        keyword: decodeURIComponent(searchKey),
        filters: {},
      }
    },
    async asyncData({ app, params, route, redirect }) {
      const searchType = parseInt(params.sort) || 1

      // exclude searchType = 2
      if(searchType === 2) {
        return redirect('/finance/navi/authors')
      }

      // limit: parseInt(params.sort) === 1 ? 50 : 45,
      const searchKey = !route.params.w
      ? ''
      : route.fullPath
        .split('/w/').pop()
        // avoid case input "#" directly in browser url
        .replace(/#.*/g, '')

      let query = {
        searchType,
        page: parseInt(params.p) || 1,
        limit: 30,
        keyword: decodeURIComponent(searchKey)
      }

      if (query.searchType == undefined || isNaN(query.searchType))
        query.searchType = 1

      let dataList = await app.GoGoHTTP.get(URL ,{ params: query })

      return {
        dataList: dataList,
        filters: query,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/finance/navi/authors`,
          },
        ],
      }
    },
    mounted() {
      this.$nuxt.$on('followItemAction', item => {
        let authors = (this.dataList || {}).data
        if(!item || !authors) return
        for(let i = 0; i < authors.length; i++) {
          if(authors[i].id === item.id) authors[i].isFollowed = item.isFollowed
        }
        this.dataList.data = authors
      })
    },
    beforeDestroy() {
      this.$nuxt.$off('followItemAction')
    },
    methods: {
      async gotoSearch(keyword) {
        let query = `st/${this.filters.searchType}/w/${this.encodeUrlSearchKey(keyword)}`
        location.href = `/finance/navi/authors/${query}`
      },
      async onPagingClick(_page) {
        let query = this.filters.keyword
          ? `st/${this.filters.searchType}/p/${_page}/w/${this.encodeUrlSearchKey(this.filters.keyword)}`
          : `st/${this.filters.searchType}/p/${_page}`
        location.href = `/finance/navi/authors/${query}`
      },
      selectSort() {
        let query = this.filters.keyword
          ? `st/${this.filters.searchType}/w/${this.encodeUrlSearchKey(this.filters.keyword)}`
          : `st/${this.filters.searchType}`
        location.href = `/finance/navi/authors/${query}`
      },
      async refreshList() {
        this.dataList = await this.GoGoHTTP.get(URL,{ params: this.filters })
        if(this.dataList) {
          const following = await this.GoGoHTTP.get(`/api/v3/surface/navi/following`)
          this.$store.commit('finance/setFavFollowing', following)
        }
      }
    },
  },
  title
)
export default obj
