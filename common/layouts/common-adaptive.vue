<template>
  <div class="pos-rel ggj-layout">
    <HeaderAdaptive class="mb-sm-20" />
    <BreadCrumb01 style="margin-bottom: 15px; margin-top: 15px;" />
    <main class="w-full mt-10">
      <CommonBanner />
      <slot class="body"></slot>
    </main>
    <FooterAdaptive />
    <no-ssr><ScrollTopButton /></no-ssr>
  </div>
</template>

<script>
import HeaderAdaptive from '@@/../components/header/HeaderAdaptive'
import FooterAdaptive from '@@/../components/footer/FooterAdaptive'
import ScrollTopButton from '@@/../components/ScrollTopButton.vue'
import BreadCrumb01 from '@@/../components/common/BreadCrumb01.vue'
import criteo from '@@/../common/js/criteo'
import recentProduct from '@@/../common/js/recentProduct'
import googleTag from '@@/../common/js/googleTag'
import CommonBanner from '@@/../components/common/CommonBanner.vue'

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
  components: {
    HeaderAdaptive,
    FooterAdaptive,
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
</style>
