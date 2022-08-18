<template>
  <div ref="carousel" class="owl-carousel owl-theme d-flex">
    <div v-for="(e, index) in slider" :key="index">
      <div class="owl-item-content" v-html="e.content"></div>
    </div>
  </div>
</template>

<script>

const
left = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><style>.cls-1{fill:silver;}.cls-2{fill:#fff;}</style></defs><g id="レイヤー_2" data-name="レイヤー 2"><g id="レイヤー_2-2" data-name="レイヤー 2"><circle class="cls-1" cx="16" cy="16" r="16"/><path class="cls-2" d="M20.9,9.92,14.84,16l6.06,6.08L19,23.94,11.1,16,19,8.06Z"/></g></g></svg>`,
right = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><style>.cls-1{fill:silver;}.cls-2{fill:#fff;}</style></defs><g id="レイヤー_2" data-name="レイヤー 2"><g id="レイヤー_2-2" data-name="レイヤー 2"><circle class="cls-1" cx="16" cy="16" r="16"/><path class="cls-2" d="M11.1,22.08,17.16,16,11.1,9.92,13,8.06,20.9,16,13,23.94Z"/></g></g></svg>`

export default {
  mounted() {
    $('.owl-carousel').removeClass('d-flex')
    this.$nextTick(() => {
      this.owl = $(this.$refs.carousel).owlCarousel({
        autoplayTimeout: 6e3,
        loop: true,
        autoplay: true,
        dots: true,
        items: 4,
        lazyLoad: true,
        autoWidth: true,
        smartSpeed: 1000,
        autoplayHoverPause: true,
        slideTransition: 'ease',
        margin: 15,
        nav: true,
        navText: [left, right],
        center: true,
        responsive:{
          0:{
            items:1
          },
          600:{
            items:3
          },
          1000:{
            items:4
          }
        }
      })
    })
  },
  computed: {
    slider() {
      return this.$store.state.advertisements.topSliders || []
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@@/../common/assets/variables.scss";
.d-flex {
  display: flex;
  padding-bottom: 25px !important;
  min-height: 338px;
  margin-left: -204px;
  .owl-item-content {
    margin-right: 15px;
  }
}
@media only screen and (max-width: $screen-sm) {
  .owl-carousel {
    min-height: 250px !important;
  }
  .owl-item-content {
    /deep/ img {
      width: 295px !important;
      height: 185px !important;
    }
  }
  /deep/ .owl-nav {
    .owl-next, .owl-prev {
      top: calc(50% - 30px) !important;
    }
  }
}
@media only screen and (max-width: $screen-xs) {
  .owl-carousel {
    min-height: 229px !important;
  }
  .owl-item-content {
    /deep/ img {
      width: 246px !important;
      height: 154px !important;
    }
  }
  /deep/ .owl-nav {
    .owl-next {
      right: 8% !important;
    }
    .owl-prev {
      left: 8% !important;
    }
  }
}
.owl-item-content {
  padding: 10px;
  /deep/ img {
    width: 352px;
    height: 220px;
    border-radius: 15px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    image-rendering: -webkit-optimize-contrast;
  }
}
.owl-carousel {
  min-height: 320px;
  position: relative;
  /deep/ .owl-dots {
    margin-top: 0 !important;
  }
  /deep/ .owl-nav {
    .owl-next, .owl-prev {
      position: absolute;
      top: calc(50% - 55px);
      transform: translateY(-50%);
      -webkit-transform: translateY(-50%);
      &:hover {
        background: none !important;
        svg {
          fill-opacity: 1;
        }
      }
      svg {
        width: 36px;
        height: 36px;
        fill-opacity: 0.9;
      }
    }
    .owl-next {
      right: 82px;
      display: flex;
    }
    .owl-prev {
      left: 82px;
      display: flex;
    }
  }
}

</style>
