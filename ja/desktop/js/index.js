import i18n from '@@/lang/desktop/index.json'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import ProductRankHorizontalTop from '@/components/product/ProductRankHorizontalTop.vue'
import CategoryList from '@/components/top/CategoryList.vue'
import MenuGrid from '@/components/top/MenuGrid.vue'
import ProductNaviItem from '@/components/product/ProductNaviItem.vue'
import ProductHorizontal from '@/components/product/ProductHorizontal.vue'
import ProductVertical from '@@/../components/product/ProductVertical.vue'
import Lzimg from '@@/../components/Lzimg.vue'
import title from '@@/../common/pages'
import ShowMore from '@/components/common/ShowMore.vue'


if (process.browser) {
  // TODO: hieunt - need to import from style
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}

const obj = Object.assign(
  {
    components: {
      Lzimg,
      ShowMore,
      MenuGrid,
      LazyComp01,
      CategoryList,
      ProductVertical,
      ProductNaviItem,
      ProductHorizontal,
      ProductRankHorizontalTop,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        selectedRank: 'all',
        forwardDataLoaded: false,
      }
    },
    async asyncData({ app }) {
      let [
        topData
      ] = await Promise.all([
        app.GoGoHTTP.get('/api/v3/surface/top')
      ])
      let res = {}
      if (!topData) {
        topData = {}
      }
      let allProductsRanking = ((topData || {}).allProductsRanking || []).splice(0,9)
      res.topData = topData
      res.topData.allProductsRanking = allProductsRanking
      res.linkMeta = [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/`,
        },
        {
          rel: 'alternate',
          hreflang: 'ja',
          href: `https://www.gogojungle.co.jp/`,
        },
        {
          rel: 'alternate',
          hreflang: 'en',
          href: `https://www.gogojungle.co.jp/en/`,
        },
        {
          rel: 'alternate',
          hreflang: 'th',
          href: `https://www.gogojungle.co.jp/th/`,
        },
        {
          rel: 'alternate',
          hreflang: 'vi',
          href: `https://www.gogojungle.co.jp/vi/`,
        },
        {
          rel: 'alternate',
          hreflang: 'x-default',
          href: `https://www.gogojungle.co.jp/`,
        }
      ]
      return res
    },
    computed: {
      userId() {
        return this.$store.state.user.id
      },
    },
    mounted() {
      if (!this.userId) this.getRecentProductFromLocal()
      else this.getRecentProduct()
    },
    methods: {
      rPLength() {
        return Object.keys((this.topData || {}).recentProducts || []).length
      },
      showCategories() {
        let arr = (this.topData || {}).skillShareRP || []
        if(!arr.length) return false
        for(let i = 0; i < arr.length; i++) {
          if(arr[i].data.length > 4) return true
        }
        return false
      },
      showCate(arr) {
        return arr.length > 4
      },
      showItems(arr, num) {
        if(!arr || !arr.length) return []
        return arr.slice(0,num)
      },
      async getRecentProductFromLocal() {
        let datas = localStorage.getItem('rP')
        ? JSON.parse(localStorage.getItem('rP'))
        : {},
        prs = []
        const sorted = Object.entries(datas).sort((a, b) => a[1].t < b[1].t ? 1 : -1)
        for(let i = 0; i < sorted.length; i++) {
          const value = sorted[i][1]
          prs.push({masterId: value.id, browsingHistoryType: value.bht})
        }
        this.topData.recentProducts = await this.GoGoHTTP.post('/api/v3/recent-views/info-product',
        {
          data: prs
        }).catch(()=> {
          return []
        })
        this.forwardDataLoaded = true
      },
      async getRecentProduct() {
        this.topData.recentProducts = await this.GoGoHTTP.get('/api/v3/recent-views').catch(()=> {
          return []
        })
        this.forwardDataLoaded = true
      }
    }
  },
  title
)

export default obj
