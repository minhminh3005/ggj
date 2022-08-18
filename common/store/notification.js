import {
  DELAY,
  broadcast,
} from "@@/../common/js/notification/notification-helper.js"

export default {
  namespaced: true,
  state: () => ({
    countInfo: { // countInfo will be sync with another tab
      total: 0,
      lastRecord: null,
    },
    _tabId: Date.now(),
    tabList: [],
  }),
  mutations: {
    setCountInfo(state, countInfo) {
      state.countInfo = countInfo

      // if have new noti, emit event
      window.$nuxt.$emit('countInfoChange', countInfo)
    },
    updateLasRecord(state, lastRecord) {
      state.countInfo.lastRecord = lastRecord
    },
    setTabList(state, tabList) {
      state.tabList = tabList
    },
  },
  getters: {
    count(state) {
      return state.countInfo
    },
  },
  actions: {
    init({ dispatch, state, commit }) {
      // check user is not login
      if(window && !window.$nuxt.$store.state.user.id) {
        return
      }

      dispatch("startCount", true)
      commit("updateLasRecord", +localStorage.getItem('noti_lastRecord'))

      // init sync tabs
      $(window).on('storage', (e) => {
        if(e.originalEvent.key !== 'broadcast') { // cancel other storage event key
          return
        }
        let { eventName, value } = JSON.parse(e.originalEvent.newValue)
        const action = {
            'updateTabList': () => commit("setTabList", [ ...state.tabList, value ]), // sync tab list
            'noti': () => commit("setCountInfo", value), // sync count info
          }
        action[eventName]()
      })
    },
    async startCount({ state, dispatch, commit }, forceCount = false) { //  realtime noti count
      let tabList = state.tabList,
       { lastRecord, total } = state.countInfo

      // get data
      if(forceCount || state._tabId === Math.max(...tabList)) {
        let { data } = await window.$nuxt.GoGoHTTP.get("/api/noti/new/count-unreview", {
          isIgnore: true,
          params: {
            lastRecord,
          }
        })
        if(data.total !== total && data.total > 0) {
          const obj = {...data, total: data.total  }
          commit("setCountInfo", obj)
          broadcast('noti', obj,  state._tabId)
        } else {
          commit("updateLasRecord", data.lastRecord)
        }
        localStorage.setItem('noti_lastRecord', data.lastRecord)
      }

      // sync tab list
      commit("setTabList", [state._tabId])
      broadcast('updateTabList', state._tabId,  state._tabId)

      // recall self
      setTimeout(() => dispatch('startCount'), DELAY)
    },
  },
}
