<template>
  <div class="pos-rel ggj-layout">
    <HeaderResponsive class="mb-sm-20" />
    <BreadCrumb01 v-if="!isSupportSlider" style="margin-bottom: 15px; margin-top: 15px; max-width: 100%;" />
    <main class="w-full mt-10">
      <CommonBanner />
      <slot class="body"></slot>
    </main>
    <FooterResponsive />
    <NavbarMobile />
    <ScrollTopButton />
  </div>
</template>

<script>
import HeaderResponsive from '@@/../components/header/HeaderResponsive'
import NavbarMobile from '@@/../components/header/NavbarMobile'
import FooterResponsive from '@@/../components/footer/FooterResponsive'
import ScrollTopButton from '@@/../components/ScrollTopButton.vue'
import BreadCrumb01 from '@@/../components/common/BreadCrumb01.vue'
import CommonBanner from '@@/../components/common/CommonBanner.vue'
import recentProduct from '@@/../common/js/recentProduct'
import googleTag from '@@/../common/js/googleTag'
import criteo from '@@/../common/js/criteo'

export default {
  props: {
    opt: {
      type: Object,
      default() {
        return {
          noCriteo: false,
        }
      },
    },
  },
  data() {
    return {
      isSupportSlider: /^\/\/$/.test(this.$route.path)
    }
  },
  components: {
    HeaderResponsive,
    NavbarMobile,
    FooterResponsive,
    ScrollTopButton,
    BreadCrumb01,
    CommonBanner
  },
  mounted() {
    if (process.client && window) {
      window.history.scrollRestoration = 'auto'
    }
    recentProduct.call(this)
    !this.opt.noCriteo && criteo.call(this)
    googleTag.call(this)
  },
}
</script>

<style lang="scss" scoped>
@import "@@/../common/assets/variables.scss";
.mb-sm-20 {
  @media only screen and (min-width: $screen-sm) {
    margin-bottom: 20px;
  }
}
/deep/ .btn-top {
  transform: translateY(-70px);
  @media only screen and (min-width: $screen-xs) {
    transform: translateY(0);
  }
}
// hide scroll button in mobile versions
// https://gogojungle.backlog.jp/view/OAM-66945
/deep/ .scroll-btn {
  @media only screen and (max-width: $screen-sm) {
    display: none !important;
  }
}
</style>
