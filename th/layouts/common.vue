<template>
  <section>
    <Header />
    <BreadCrumb01 />
    <main class="w-full mt-10">
      <div class="banner w-1000 pos-rel">
        <a
          v-if="banners && banners[1]"
          class="banner-fix banner-left pos-abs cursor-pointer"
          :href="banners[1].landingPageUrl"
          target="_blank"
          rel="nofollow"
        >
          <img :src="banners[1].bannerUrl" width="120" height="600" alt="" />
        </a>
        <a
          v-if="banners && banners[2]"
          class="banner-fix banner-right pos-abs cursor-pointer"
          :href="banners[2].landingPageUrl"
          target="_blank"
          rel="nofollow"
        >
          <img :src="banners[2].bannerUrl" width="120" height="600" alt="" />
        </a>
        <a
          v-if="banners && banners[3]"
          class="cursor-pointer mb-20"
          :href="banners[3].landingPageUrl"
          target="_blank"
          rel="nofollow"
        >
          <img :src="banners[3].bannerUrl" width="1000" height="130" alt="" />
        </a>
      </div>
      <slot class="body"></slot>
    </main>
    <Footer class="footer" />
  </section>
</template>

<script>
// import { mapGetters } from 'vuex'
import Header from '@/components/header/Header.vue'
import Footer from '@@/../components/footer/Footer.vue'
import BreadCrumb01 from '@@/../components/common/BreadCrumb01.vue'
export default {
  components: {
    Header,
    Footer,
    BreadCrumb01,
  },
  computed: {
    // ...mapGetters({
    //   banners: 'getBanners',
    // }),
    banners() {
      return (this.$store.state.advertisements || {}).banners || []
    },
    isLoggedIn() {
      return !!this.$store.state.user.id
    }
  },
  mounted() {
    if (!process.browser) {
      return
    }
    let $win = $(window),
      $main = $('.body'),
      $nav = $('.banner-fix'),
      navHeight = 600,
      tmpH = 0,
      fixedClass = 'is-fixed',
      navPos,
      fn
    
    if (!$nav.length) {
      return
    }
    navPos = $nav.offset().top
    fn = function() {
      if (tmpH) {
        $nav.addClass(fixedClass)
      } else {
        $nav.removeClass(fixedClass)
      }
    }
    $win.on('load scroll', function() {
      if ($(this).scrollTop() > navPos) {
        tmpH = navHeight
        window.requestAnimationFrame(fn)
      } else {
        tmpH = 0
        window.requestAnimationFrame(fn)
      }
    })
  },
}
</script>

<style>
/* stylelint-disable */
@media only screen and (max-device-width: 1024px) {
  html,
  body {
    width: 1025px;
  }
}
</style>
<style lang="scss" scoped>
.banner {
  z-index: 999;
  a {
    display: block;
    &.banner-left {
      left: 50%;
      margin-left: -640px;
    }
    &.banner-right {
      right: 50%;
      margin-right: -640px;
    }
    &.is-fixed {
      position: fixed;
      top: 2%;
      z-index: 999;
    }
  }
}
/deep/ .banner-detail {
  display: none;
  margin-bottom: 20px;
  max-width: 100%;
}
@media only screen and (max-width: 1370px) {
  .banner {
    display: none;
  }
  /deep/ .banner-detail {
    display: block;
  }
}
@media (min-width: 1000px) {
  body {
    font-size: 14px;
  }
}
.footer,
header {
  min-width: 1024px;
}
/* stylelint-enable */
</style>
