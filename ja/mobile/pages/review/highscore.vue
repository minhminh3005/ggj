<template>
  <div>
    <ListB :list="data[type]"
           :title="titleChunk"
           :config="config"
           :bottom-data="bottomData"
           :process="isProccess"
           :is-load-more="isLoadMore"
           @onNextPrev="onNextPrev"
           @onLoadMore="onLoadMore"
           :show-load-more="pages[type] < lastPage[type]"
    />
  </div>
</template>
<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/mobile/review-list.json'
import ListB from '@/components/review/ListB.vue'
const obj = Object.assign({
  components: {
    ListB,
  },
  i18n: {
    messages: i18n,
  },
  data() {
    let type = this.$route.params.type,
      month = this.$route.params.month,
      time = month ? this.$t('t' + month) : '',
      cates = type ? ['systemtrade', 'tools', 'kabu', 'navi', 'salons', 'emagazine', 'others'] : []

    return {
      config: {
        cates,
        title: type ? this.$t(type) : this.$t('highscore-title', { time }),
        current: type
      },
      isProccess: false, 
      isLoadMore: false,
    }
  },
  computed: {
    titleChunk() {
      return this.type 
                  ? this.$t(`highscore-${this.type }-title`, {time: this.month ? this.$t('t' + this.month) : ''}) 
                  : this.$t('highscore-title', {time: this.month ? this.$t('t' + this.month) : ''})
    } 
  },
  async asyncData({params, app}) {
    let type = params.type || '',
      month = params.month,
      data = {
        systemtrade: [],
        tools: [],
        navi: [],
        salons: [],
        emagazine: [],
        others: [],
        '': [], // all type
      },
      pages = {
        systemtrade: 1,
        tools: 1,
        navi: 1,
        salons: 1,
        emagazine: 1,
        others: 1,
        '': 1, // all type
      },
      lastPage = {
        systemtrade: 0,
        tools: 0,
        navi: 0,
        salons: 0,
        emagazine: 0,
        others: 0,
        '': 0, // all type
      },
      listUrl = type 
            ? `/api/v3/surface/review/highscore${'/' + type}${month ? '/' + month : ''}`
            : '/api/v3/surface/review/highscore/detail',
      listRankUrl = month 
                    ? '/api/v3/surface/review/highscore/' + month 
                    : '/api/v3/surface/review/highscore/all',
      [
        ls, 
        listRankData 
      ] = await Promise.all([
        app.GoGoHTTP.get(listUrl, {params: {limit: 20, pages: pages[type]}}),
        app.GoGoHTTP.get(listRankUrl, { params: {page: 1, limit: 3}})
      ]),
      listRank = ['systemtrade', 'tools', 'kabu', 'navi', 'salons', 'emagazine', 'others'].filter(item => {
        return item != type
      }),
      bottomData = listRank.map(item => {
        return {
          title: i18n[app.i18n.locale][item] || item,
          list: listRankData[item],
          url: `/review/highscore/${item}${month ? '/' + month : ''}`
        }
      })
    lastPage[type] = ls.lastPage || 0
    data[type] = ls.data
    return {
      bottomData,
      type,
      month,
      data,
      pages,
      listUrl,
      listRank,
      lastPage,
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/review/highscore${type ? '/' + type : ''}${month ? '/' + month : ''}`,
        },
      ],
    }
  },
  methods: {
    descriptionTemplate() {
      let type = this.$route.params.type,
        month = this.$route.params.month,
        
        time = month ? this.$t('t' + month) : ''
      return  type 
              ? this.$t(`highscore-${type}-des`, {time}) 
              : this.$t('highscore-des', {time})
    },
    onLoadMore() {
      let type = this.type,
          month = this.$route.params.month
      if(this.isLoadMore || this.pages[type] == -1) {
        return
      }
      this.isLoadMore = true
      this.GoGoHTTP.get(`/api/v3/surface/review/highscore/${type || 'detail'}${month ? '/' + month : ''}`, { params: {page: this.pages[type] + 1, limit: 20}}).then(res => {
        if(res.data) {
          this.data[type] = this.data[type].concat(res.data)
        }
        if(!res.data.length) {
          this.pages[type] = -1
        } else {
          this.pages[type] = this.pages[type] + 1
        }
        this.isLoadMore = false
      })
    },
    onNextPrev(type) {
      if(!type) {
        return
      }
      this.isProccess = true
      location.href = `/review/highscore/${type || 'detail'}${this.month ? '/' + this.month : ''}`
    },
  }
}, title)
export default obj
</script>
