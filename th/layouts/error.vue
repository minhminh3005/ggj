<template>
  <section>
    <div class="flex layout-col" style="width: 1000px; margin: 0 auto;">    
      <h3 style="font-weight: bold; margin-bottom: 40px;">
        {{ error.exists ? $t('5') : $t('1') }}
      </h3>
      <div class="flex img-area">
        <img src="/img/assets/pc/common/robot2.png" alt="robot-error" style="width: 182px; height: 160px;" />
        <img src="/img/assets/pc/common/error-404.png" alt="error-404" class="ml-30" style="width: 286px; height: 160px;" />
      </div>
      <h3 style="font-weight: bold; margin: 40px 0 30px 0;">
        {{ error.exists ? $t('6') : $t('2') }}
      </h3>
      <div style="font-weight: bold; font-size: 18px;">
        <a style="text-decoration: underline; color: #000;" href="/th">
          {{ $t('3') }}
        </a>
        <span v-if="!error.exists">&nbsp;|&nbsp;</span>
        <a
          style="text-decoration: underline; color: #000;"
          href="javascript:history.back();"
          v-if="!error.exists"
        >
          {{ $t('4') }}
        </a>
      </div>
      <div class="mt-30">{{ $t('7') }}</div>
      <div class="flex link-area mt-5">
        <a @click="changeLang('ja')" class="mr-10">日本語 </a>|
        <a @click="changeLang('en')" class="ml-10 mr-10">English </a>|
        <a @click="changeLang('th')" class="ml-10 mr-10">ภาษาไทย </a>|
        <a @click="changeLang('ch')" class="ml-10 mr-10">简体中文 </a>|
        <a @click="changeLang('tw')" class="ml-10 mr-10">繁體中文 </a>|
        <a @click="changeLang('vi')" style="font-family: Arial, sans-serif;" class="ml-10">Tiếng Việt </a>
      </div>
    </div>
  </section>
</template>

<script>
import i18n from '@@/lang/common/layout-error.json'
import { setCookie } from '@/utils/client/common'
export default {
  layout: 'errlay',
  i18n: {messages: i18n},
  props: ['error'],
  head() {
    return {
      title: this.titlei18n
    }
  },
  data() {
    return {
      titlei18n: this.error.exists ? this.$t('titleNonExists') : this.$t('title'),
    }
  },
  mounted() {
    $('html, body').css('overflow', 'hidden')
  },
  computed: {
    baseUrl() {
      if (this.langSupported().some(e => this.$route.path.startsWith(`/${e}`))) {
        return this.$route.fullPath.substr(3)
      }
      return this.$route.fullPath
    }
  },
  methods: {
    changeLang(lang = '') {
      setCookie('lang',lang, 60*24*365)
      if (this.langSupported().some(e => lang === e)) {
        location.href = `/${lang}${this.baseUrl}`
        return
      } else {
        location.href = this.baseUrl
      }
      
    }
  }
}
</script>
<style>
/* stylelint-disable */
@media only screen and (max-device-width: 1024px) {
  html,
  body {
    width: 1000px;
    min-width: 1000px;
  }
}
</style>
<style lang="scss" scoped>
.link-area {
  a {
    display: block;
    font-weight: bold;
    cursor: pointer;
    font-size: 16px;
  }
}
header {
  min-width: 1000px;
}
/* stylelint-enable */
</style>