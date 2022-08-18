<template>
  <div class="video-slider">
    <div ref="slider" class="owl-carousel flex">
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
          <Prices :prices="item.prices" />
        </div>
        <div class="live-label" v-if="!item.url && item.liveUrl">LIVE</div>
      </a>
    </div>
  </div>
</template>

<script>
import { youtubeParser } from '@/utils/client/common'
import Prices from '@@/../components/prices/Prices.vue'
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
        items: 3,
        nav: true,
        loop: true,
        autoplay: true,
        dots: false,
        lazyLoad: true,
        slideBy: 2,
        smartSpeed: 500,
        autoplayHoverPause: true,
        autoWidth: true,
      })
    })
  },
}
</script>

<style lang="scss" scoped>
.video-slider {
  height: 280px;
  border: 1px solid #d0d5dc;
  padding: 10px;
  &.hide {
    opacity: 0;
  }
  .video-item {
    height: 260px;
    width: 300px;
    padding: 0 2px;
    position: relative;
    .iframe-ctn {
      height: 168px;
      background: #000;
      iframe {
        max-height: 100%;
        max-width: 100%;
      }
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
}
.owl-carousel /deep/ {
  width: 100% !important;
  .owl-nav button {
    &.owl-prev,
    &.owl-next {
      position: absolute;
      top: calc(50% - 20px);
      opacity: 0.8;
      font-size: 2em !important;
      font-weight: bold;
      height: 35px;
      background: rgba(80, 80, 80, 0.7);
      width: 35px;
      line-height: 35px;
      border-radius: 35px;
      text-align: center;
      &:hover {
        opacity: 0.9;
      }
      &:active {
        opacity: 1;
        background: #424242;
      }
    }
    &.owl-prev {
      left: -15px;
    }
    &.owl-next {
      right: -15px;
    }
  }
  .owl-nav.disabled { // alway show owl-nav
    display: block !important;
  }
}
</style>