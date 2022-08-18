<template>
  <LazyComp01 class="review-slider" :timeout="4e3" min-height="700px" @comp-ready="getData">
    <div style="min-height: 350px;" v-if="alsoBoughtItems.length">
      <div style="font-size: 18px; color: #333; border-bottom: 1px solid #d9d9d9;" class="mb-20">{{ $t(1) }}</div>
      <AlsoBoughtProducts :products="alsoBoughtItems" :enable-rank="false" :nav-text="navText" />
    </div>
    <div style="min-height: 350px;">
      <div style="font-size: 18px; color: #333; border-bottom: 1px solid #d9d9d9;" class="mb-20">{{ $t(2) }}</div>
      <div class="owl-carousel flex" :ref="`slider-1`">
        <div v-for="(i, idx) in hightScoreItemSlider" :key="idx" style="width: 300px;" class="mr-5">
          <Item :item="i[0]" class="border-item">
            <img class="pos-abs owl-lazy" :data-src="`/img/products/${i[0].id}/small`" style="max-width: 100%;" />
          </Item>
          <Item :item="i[1]">
            <img class="pos-abs owl-lazy" :data-src="`/img/products/${i[1].id}/small`" style="max-width: 100%;" />
          </Item>
        </div>
      </div>
    </div>
  </LazyComp01>
</template>

<script>
import Item from './Item'
import AlsoBoughtProducts from '@/components/product/AlsoBoughtProducts.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import i18n from "@@/lang/components-desktop/review-detail-slider.json"

if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}

const nextArrow = '<i style="width: 35px; height: 35px;" class="icon-cls"><svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" width="36" height="36"><path fill="currentColor" d="M31.3 45.2l22.1-22.1c1.5-1.5 4-1.5 5.5 0l3.7 3.7c1.5 1.5 1.5 4 0 5.5L46.9 48l15.8 15.7c1.5 1.5 1.5 4 0 5.5L59 72.9c-1.5 1.5-4 1.5-5.5 0L31.3 50.8c-1.6-1.6-1.6-4 0-5.6z"></path></svg></i>'
const prewArrow = '<i style="width: 35px; height: 35px;" class="icon-cls"><svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" width="36" height="36"><path fill="currentColor" d="M64.7 50.8L42.6 72.9c-1.5 1.5-4 1.5-5.5 0l-3.7-3.7c-1.5-1.5-1.5-4 0-5.5L49.1 48 33.3 32.3c-1.5-1.5-1.5-4 0-5.5l3.7-3.7c1.5-1.5 4-1.5 5.5 0l22.2 22.1c1.6 1.6 1.6 4 0 5.6z"></path></svg></i>'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Item,
    AlsoBoughtProducts,
    LazyComp01,
  },
  data() {
    return {
      navText: [nextArrow, prewArrow],
      // slider 1 state
      alsoBoughtItems: [],
      alsoBoughtItemsProcess: false,

      // slider 2 state
      hightScoreToolsItems: [],
      hightScoreToolsItemsProcess: false,
    }
  },
  computed: {
    hightScoreItemSlider() {
      let items = []
      for(let i = 0; i < parseInt(this.hightScoreToolsItems.length/2); i++) {
        items.push([
          this.hightScoreToolsItems[i*2],
          this.hightScoreToolsItems[i*2 + 1],
        ])
      }
      return items
    },
  },
  methods: {
    async getData() {
      // start get
      this.alsoBoughtItemsProcess = true
      this.hightScoreToolsItemsProcess = true
      let [
        alsoBoughtItems,
        hightScoreToolsItems
      ] = await Promise.all([
        this.GoGoHTTP.get(`/api/v3/surface/tools/${this.$route.params.id}/also/buy`),
        this.GoGoHTTP.get(`/api/v3/surface/review/highscore/tools`)
      ])

      // mapping
      this.alsoBoughtItems = alsoBoughtItems
      this.hightScoreToolsItems = hightScoreToolsItems.data.map((item, index) => {
        return {
          id: item.productId,
          name: item.reviewTitle,
          stars: (item.review || {}).stars || 0,
          date: item.publishedAt,
          description: item.reviewContent,
          detailUrl: item.productUrl,
          rank: index + 1,
        }
      })
      
      // end get
      this.alsoBoughtItemsProcess = true
      this.hightScoreToolsItemsProcess = true
      this.$nextTick(this.buildSliders)
    },
    buildSliders() {
      $(this.$refs['slider-1']).owlCarousel({
        slideTransition: 'ease',
        autoplayTimeout: 4e3,
        items: 3,
        nav: true,
        dots: false,
        lazyLoad: true,
        loop: true,
        // autoplay: true,
        autoplay: false,
        slideBy: 1,
        smartSpeed: 500,
        autoplayHoverPause: true,
        autoWidth: true,
        navText: [nextArrow, prewArrow],
      })
    }
  }
}
</script>

<style lang="less" scoped>
.border-item {
  border-bottom: 1px solid #d9d9d9;
}
.review-slider {
  @media only screen and (min-width: @screen-sm) {
    padding: 0;
  }
  .owl-carousel /deep/ .owl-nav.disabled {
    display: block !important;
  }
  .owl-carousel /deep/ button {
    transform: translateY(-6px);
    transition: all 0.4s;
    &:active {
      transform: translateY(-6px) scale(1.3);
    }
  }
}
</style>