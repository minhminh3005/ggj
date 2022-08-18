<template>
  <!-- these variables will be get from common/containers/navi/mixin.js -->
  <div>
    <template v-if="isNaviTop || isArticleDetailPage">
      <app-header :back-label="isNaviTop ? $t(20) : $t(30)" back-link="/finance/navi/articles" :right-label="$t(21)" :hide-back-btn="!isArticleDetailPage" />
    </template>
    <template v-else-if="isSeriesDetailPage || isSearchPage || isAuthorPage || isSeriesListPage || isArticleListPage">
      <app-header :back-label="$t(20)" back-link="" :right-label="$t(21)" :hide-back-btn="true" />
      <navi-header :is-list-page="!isSeriesDetailPage" />
      <!-- <slot class="body series-page"></slot> -->
    </template>
    <nuxt class="body mw-body" />
    <FooterResponsive />
    <no-ssr>
      <ScrollTopButton />
    </no-ssr>
  </div>
</template>

<script>
import NaviMixin from '@@/../common/containers/navi/mixin'
import criteo from '@@/../common/js/criteo'
import recentProduct from '@@/../common/js/recentProduct'
import googleTag from '@@/../common/js/googleTag'
import ScrollTopButton from '@@/../components/ScrollTopButton.vue'

import AppHeader from '@@/../common/components/app-header'
import NaviHeader from '@@/../common/components/navi/navi-header'
import i18n from '@@/lang/desktop/navi-seriesdetail.json'
import FooterResponsive from '@@/../components/footer/FooterResponsive'

export default {
  mixins: [NaviMixin],
  i18n: {
    messages: i18n,
  },
  components: {
    FooterResponsive,
    AppHeader,
    NaviHeader,
    ScrollTopButton,
  },
  mounted() {
    function iOS() {
      return (/ipad|iphone/i.test(navigator.platform)
          // iPad on iOS 13 detection
          || (/mac/i.test(navigator.userAgent) && 'ontouchend' in document)) &&
          !(/mac/i.test(navigator.userAgent) && /safari/i.test(navigator.userAgent))
    }
    // only apply scrollRestoration for apple ecosystem
    if (process.client && window && iOS()) {
      window.history.scrollRestoration = 'auto'
    }
    criteo.call(this)
    recentProduct.call(this)
    googleTag.call(this)
    if (this.$route.path.startsWith('/finance/navi')) {
      let viewport = document.querySelector('meta[name=viewport]'),
        newViewport = document.createElement('meta')
      viewport.parentNode.removeChild(viewport)

      newViewport.setAttribute('name', 'viewport')
      newViewport.setAttribute('content', 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0')
      document.head.appendChild(newViewport)
    }
  },
}
</script>

<style>
/* override css at ja/desktop/layouts/error.vue */
@media only screen and (max-device-width: 1024px) {
  html,
  body {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
.mw-body {
  width: 100% !important;
  overflow: hidden auto;
}
.footer /deep/ {
  @media (min-width: 768px) and (max-width: 1024px) {
    .footer1 {
      width: unset;
    }
    .footer2 {
      min-width: unset;
      > .w-1000 {
        width: unset;
      }
    }
  }
}
</style>
