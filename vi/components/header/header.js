import { setCookie, isAgentMobile } from '@/utils/client/common'
import i18n from '@@/lang/components-desktop/header.json'
import Header01 from '@@/../components/header/Header01.vue'

export default {
  i18n: { messages: i18n },
  components: {
    Header01,
  },
  mounted() {
    this.isMobile = isAgentMobile(window.navigator.userAgent)
  },
  methods: {
    switchToMobile() {
      setCookie('forceRenderDesktop', '', 0)
      // TODO: Hieu Nguyen - Correct finance navi structure
      if (this.$route.path.includes('/t/')) {
        location.href = this.$route.path.replace(
          '/articles/searchresult/',
          '/searchresult/'
        )
      } else {
        location.reload()
      }
    },
  },
  data() {
    return {
      isMobile: false,
    }
  },
}
