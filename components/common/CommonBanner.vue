<template>
  <div>
    <ListSliderNew v-if="isSupportSlider" />
    <div class="banner pos-rel">
      <a
        v-if="banners && banners[1]"
        class="banner-left pos-abs cursor-pointer"
        :href="banners[1].landingPageUrl"
        target="_blank"
        rel="nofollow"
      >
        <img :src="banners[1].bannerUrl" width="170" height="1170" alt="" />
      </a>
      <a
        v-if="banners && banners[2]"
        class="banner-right pos-abs cursor-pointer"
        :href="banners[2].landingPageUrl"
        target="_blank"
        rel="nofollow"
      >
        <img :src="banners[2].bannerUrl" width="170" height="1170" alt="" />
      </a>
    </div>
    <div class="banner pos-rel flex center mid">
      <a
        v-if="banners && banners[3]"
        class="cursor-pointer mb-20 banner-ads-desktop"
        :href="banners[3].landingPageUrl"
        target="_blank"
        rel="nofollow"
      >
        <img :src="banners[3].bannerUrl" alt="" />
      </a>
      <a
        v-if="bannerMobile"
        :href="bannerMobile.landingPageUrl"
        class="cursor-pointer banner-ads-mobile"
        target="_blank"
        rel="nofollow"
      >
        <img :src="bannerMobile.bannerUrl" alt="" />
      </a>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ListSliderNew from '@@/../ja/desktop/components/sliders/ListSliderNew.vue'

export default {
  components: {
    ListSliderNew,
  },
  data() {
    return {
      isSupportSlider: /^\/$/.test(this.$route.path),
    }
  },
  computed: {
    ...mapGetters({
      banners: 'getBanners',
    }),
    bannerMobile() {
      if (!this.banners) return null
      const banner = {}
      if (this.banners[7]) {
        banner.landingPageUrl = this.banners[7].landingPageUrl
        banner.bannerUrl = this.banners[7].bannerUrl
        return banner
      }

      if (this.banners[8]) {
        banner.landingPageUrl = this.banners[8].landingPageUrl
        banner.bannerUrl = this.banners[8].bannerUrl
        return banner
      }

      return null
    },
  },
}
</script>
<style lang="scss" scoped>
.banner {
  z-index: 999;
  a {
    display: block;
    &.banner-left {
      top: 0;
      left: -190px;
    }
    &.banner-right {
      top: 0;
      right: -190px;
    }
    &.banner-ads-desktop {
      img {
        width: 1000px;
        height: 130px;
      }
    }
  }
}
/deep/ .banner-detail {
  display: none;
  margin-bottom: 20px;
  max-width: 100%;
}
@media only screen and (max-width: 1370px) {
  /deep/ .banner-detail {
    display: block;
  }
}
@media only screen and (max-width: 992px) {
  .banner {
    width: 100%;
    .banner-ads-desktop {
      display: none;
    }
    .banner-ads-mobile {
      display: block;
      margin: 25px 0 20px 0;
      img {
        width: 100%;
        height: 100%;
        max-width: 100%;
      }
    }
  }
}
@media (min-width: 768px) and (max-width: 992px) {
  .banner {
    .banner-ads-mobile {
      margin: 0 0 20px 0;
    }
  }
}
@media (min-width: 993px) {
  .banner {
    width: 1000px;
    margin: 0 auto;
    .banner-ads-desktop {
      display: block;
    }
    .banner-ads-mobile {
      display: none;
    }
  }
}
</style>