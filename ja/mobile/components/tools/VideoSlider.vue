<template>
  <div class="video-slider">
    <div ref="slider" class="owl-theme owl-carousel">
      <a
        class="flex layout-col video-item"
        v-for="item in list"
        :key="'video' + item.id"
        :href="item.detailUrl"
      >
        <div class="iframe-ctn flex mid center">
          <iframe :src="youtubeParser(item.url || item.liveUrl)" alt=""></iframe>
        </div>
        <div class="video-info flex layout-col space-between">
          <div v-wrap-lines="2"><strong>{{ item.name }}</strong></div>
          <Prices :prices="item.prices" :is-vertical="true" />
        </div>
        <div class="live-label" v-if="!item.url && item.liveUrl">LIVE</div>
      </a>
    </div>
  </div>
</template>

<script>
import { youtubeParser } from '@/utils/client/common'
import Prices from '@@/../components/prices/Prices.vue'

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}

export default {
  components: {
    Prices,
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      },
    },
  },
  methods: {
    youtubeParser,
  },
  mounted() {
    let me = this
    me.$nextTick(() => {
    $(me.$refs['slider']).owlCarousel({
        slideTransition: 'ease',
        autoplayTimeout: 8e3,
        loop: true,
        autoplay: true,
        smartSpeed: 500,
        autoplayHoverPause: true,
        dots: true,
        slideBy: 2,
        responsive: {
          0: {
            items: 2,
          },
          435: {
            items: 3,
          },
          600: {
            items: 4,
          },
          780: {
            items: 5,
          },
        },
      })
    })
  },
}
</script>

<style lang="scss" scoped>
.video-slider {
  padding: 10px;
  &.hide {
    opacity: 0;
  }
  .video-item {
    height: 200px;
    width: 175px;
    padding: 0 2px;
    max-width: calc(50vw - 10px);
    position: relative;
    @media screen and (min-width: 435px) {
      max-width: calc(33vw - 10px);
    }
    @media screen and (min-width: 600px) {
      max-width: calc(25vw - 10px);
    }
    @media screen and (min-width: 780px) {
      max-width: calc(20vw - 10px);
    }
    .live-label {
      height: 25px;
      width: 65px;
      position: absolute;
      top: 0;
      left: 2px;
      background: red;
      color: #fff;
      text-align: center;
      line-height: 25px;
      border-bottom-right-radius: 10px;
    }
    .iframe-ctn {
      height: 98px;
      background: #000;
      iframe {
        max-height: 100%;
        max-width: 100%;
      }
    }
    &:hover {
      text-decoration: none;
      opacity: 0.8;
    }
  }
  .video-info {
    flex-grow: 1;
    background: #efefef;
    padding: 10px;
    color: #333;
    text-decoration: none;
  }
  /deep/ .price-cls {
    max-width: 100%;
    flex-wrap: wrap;
  }
}
.owl-carousel /deep/ {
  width: 100% !important;
}
</style>
