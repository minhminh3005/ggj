<template>
  <div v-if="isShow">
    <div class="w-full mt-20">
      <button class="register-btn" @click="requestRegister" :disabled="isSaleStop || isLoading || showErrorBuyer">
        <Loading class="loading" v-if="isLoading" />
        <template v-else>{{ registerTitle }}</template>
      </button>
    </div>
    <div v-if="showErrorBuyer" class="error-text">{{ errorText }}</div>
  </div>
</template>
<script>
import {t} from '@@/../common/assets/js/helper'
import { setCookie } from '@@/../ja/desktop/utils/client/common'
import Loading from '@@/../components/icons/Loading.vue'
export default {
  name: "RegisterArticleFree",
  components: {
    Loading,
  },
  props: {
    registerTitle: {
      type: String,
      default: ''
    },
    errorText: {
      type: String,
      default: ''
    },
  },
  computed: {
      isShow() {
        return this.$store.getters['finance/selectedArticle']['registerArticleFree']
      },
      isSaleStop() {
        return this.$store.getters['finance/selectedArticle']['articleSaleStop']
      },
      showErrorBuyer() {
        return this.$store.getters["finance/showErrorBuyer"]
      },
  },
  data() {
    return {
      isLoading: false,
    }
  },
  mounted() {
    this.scrollToLastViewPosition()
  },
  methods: {
    t,
    async requestRegister() {
      if(this.isLoading) {
        return
      }
      // save scroll position, set cookie
      localStorage.setItem("navi_content_scroll_position", window.scrollY)
      setCookie('pmc', this.$store.getters['finance/selectedArticle']['id'])

      // if not logged in 
      if(!this.$store.getters['getUser'].id){
        location.href = `/login?u=${this.$route.fullPath}`
      }
      // logged in
      else {
        // enable loading
        this.isLoading = true
        // register article
        await this.GoGoHTTP.post(`/api/v3/surface/navi/article/register/free/${(this.$route.params || {}).id}`)
        .catch(err => {
          this.isLoading = false
          if(!err || !(err || {}).response) return
          const error = err.response.data
          if(error.message == 'userNotBuyer') this.$store.commit('finance/setShowErrorBuyer')
        })
        // update data
        let { paidContent, registerArticleFree } = await this.GoGoHTTP.get(`/api/v3/surface/navi/${(this.$route.params || {}).id}`),
          selectedArticle = this.$store.getters['finance/selectedArticle']
        this.$store.commit('finance/setSelectedArticle', {
          ...selectedArticle,
          paidContent,
          registerArticleFree,
        })
        // disable loading
        this.isLoading = false
        // scroll, clean localStorage
        window.scrollTo(0, +localStorage.getItem("navi_content_scroll_position"))
        localStorage.removeItem("navi_content_scroll_position")
      }
    },
    scrollToLastViewPosition() {
      let navi_content_scroll_position = +localStorage.getItem("navi_content_scroll_position")
      if(document.referrer.includes(this.$route.params.id)) {
        window.scrollTo(0, navi_content_scroll_position)
      }
      // clean localStorage
      localStorage.removeItem("navi_content_scroll_position")
    },
  },
}
</script>
<style scoped lang="scss">
.w-full {
  display: flex;
  justify-content: center;
  button {
    &.register-btn {
      width: 200px;
      height: 50px;
      border: none;
      color: white;
      background: #1b7ab8;
      margin-bottom: 20px;
    }
    &:disabled {
      background: grey;
    }
  }
  .loading {
    height: 20px;
    &::before {
      width: 20px;
      height: 20px;
      left: calc(50% - 10px);
      top: calc(50% - 12px);
    }
  }
}
.error-text {
  color: red;
  text-align: center;
}
</style>
