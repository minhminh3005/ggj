import VueI18n from 'vue-i18n'
import Vue from 'vue'
import Vuex from 'vuex'
import { state, mutations, getters, actions } from './desktop/store'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
})

const i18n = new VueI18n({
  locale: 'ja',
  fallbackLocale: 'ja',
  silentTranslationWarn: true,
})

export default previewComponent => {
  return {
    i18n,
    store,
    render(createElement) {
      return createElement(previewComponent)
    },
  }
}
