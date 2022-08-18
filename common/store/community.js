export default {
  state: () => ({
    info: {
      canJoin: 0,
      rooms: [],
      user: {
        id: null,
        name: '',
        rule: '',
        overview: ''
      }
    },
    infoNavi: {
      article: {
        canJoin: 0,
        rooms: [],
        user: {
          id: null,
          name: '',
          rule: '',
          overview: ''
        }
      },
      series: {
        canJoin: 0,
        rooms: [],
        user: {
          id: null,
          name: '',
          rule: '',
          overview: ''
        }
      }
    }
  }),
  mutations: {
    setCommunities: function(state, data) {
      state.info = data
    },
    setCommunitiesNavi: function(state, data) {
      state.infoNavi = data
    },
  },
  getters: {
    getCommunities: state => {
      return state.info
    },
    getCommunitiesNavi: state => {
      return state.infoNavi
    },
    getCommunitiesArticle: state => {
      return state.infoNavi.article
    },
    getCommunitiesSeries: state => {
      return state.infoNavi.series
    },
    getCommunitiesArticleAndSeries: state => {
      let data = JSON.parse(JSON.stringify(state.infoNavi.article)),
      aRooms = state.infoNavi.article.rooms || [],
      sRooms = state.infoNavi.series.rooms || []

      if(!aRooms) data.rooms = sRooms
      if(!sRooms) data.rooms = aRooms
      if(aRooms && sRooms) {
        // combine article and series rooms
        let arr = [...aRooms,...sRooms]
        // remove duplicated
        data.rooms = (arr || []).filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i) || []
      }

      return data
    },
  },
  actions: {
    async onGetCommunities({ commit }) {
      let id = window.$nuxt.$route.params ? window.$nuxt.$route.params.id : null,
      path = window.$nuxt.$route.path || '',
      type = !path.includes('navi') ? '' : path.includes('article') ? 'article' : 'series',
      data = await window.$nuxt.GoGoHTTP.get(`/api/community/rooms/product/${id}?type=${type}`, {isIgnore: true})
      if(Object.keys(data).length) commit(!path.includes('navi') ? 'setCommunities' :  'setCommunitiesNavi', data)
    },
    async jointCommunity({ dispatch }, roomID) {
      window.$nuxt.GoGoHTTP.post(`/api/community/rooms/${roomID}/join`, {isIgnore: true})
      dispatch('onGetCommunities')
    }
  }
}