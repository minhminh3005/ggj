<template>
  <LazyComp01
    :class="`rank-${userInfo.rankId}`"
    class="flex layout-col pos-rel user-card"
    @comp-ready="buildSlider"
    min-height="370px"
  >
    <!-- ranking -->
    <RankIcon class="rank-icon" :type="userInfo.rankGroup || 0" />

    <!-- block 1 - info -->
    <div class="block-1">
      <div class="center flex wrap-text" style="padding: 13px 30px;">
        <div
          class="wrap-text"
          style="color: #333;"
          :class="[ userInfo.isDeveloper ? 'text-ut-red' : 'text-ut-green' ]"
        >
          <a
            :href="`/users/${userInfo.userId}`"
            :title="userInfo.nickName || $t(6)"
            style="color: #000;"
            class="flex mid"
          >
            <span v-if="userInfo.isDeveloper" class="red-dot"></span>
            <span v-if="userInfo.isBuyer" class="green-dot"></span>
            <strong class="ml-5">{{ userInfo.nickName || $t(6) }}</strong>
          </a>
        </div>
      </div>
      <div class="flex">
        <a
          class="img-ctn flex mid center"
          :href="`/users/${userInfo.userId}`"
          target="_blank"
          :title="userInfo.nickName || $t(6)"
        >
          <img :src="`/img/users/${userInfo.userId}`" alt="" />
        </a>
        <div class="active center flex follow-info layout-col pl-10">
          <div class="mb-5 ">
            <template v-if="!userInfo.followings">
              <span class="mr-5">Following</span>
              <span>{{ userInfo.followings }}</span>
            </template>
            <a
              style="color: #000;"
              target="_blank"
              v-else
              :href="`/users/${userInfo.userId}/follows`"
            >
              <span class="mr-5">Following</span>
              <span>{{ userInfo.followings }}</span>
            </a>
          </div>
          <div>
            <template v-if="!userInfo.followers">
              <span class="mr-5">Following</span>
              <span>{{ userInfo.followings }}</span>
            </template>
            <a
              style="color: #000;"
              :href="`/users/${userInfo.userId}/followers`"
              v-else
              target="_blank"
            >
              <span class="mr-5">Followers</span>
              <span>{{ userInfo.followers }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- block 2 - products -->
    <div class="block-2 flex layout-col space-between">
      <div class="slide-title">
        <a 
          :href="userInfo.isDeveloper ? `/users/${userInfo.userId}/products` : `/users/${userInfo.userId}/review?t=2`"
          style="color: #000;"
          target="_blank"
        >
          {{ userInfo.isDeveloper ? $t(5) : $t(15) }} {{ (userInfo.products || []).length }}
        </a>
      </div>
      <!-- slider -->
      <div ref="slider" class="owl-carousel">
        <div
          v-for="(items, index) in productSliderItem"
          :key="`items-${index}`"
          class="flex flex-wrap"
          style="overflow: hidden; max-height: 165px;"
        >
          <a
            v-for="item in items"
            :key="`item-${item.id}`"
            :title="item.name"
            :href="userInfo.isDeveloper ? item.url : `/review/detail/${item.id}`"
            class="product-item flex mid center"
            target="_blank"
          >
            <img class="owl-lazy" :data-src="item.articleId ? `/img/articles/${item.articleId}/small` : `/img/products/${item.id}/small?isna=1`" :alt="item.name" />
          </a>
        </div>
      </div>
      <div class="flex space-between next-prev-ctn mt-10" v-if="(userInfo.products || []).length">
        <div @click="prev">
          <AngleLeft />
        </div>
        <div @click="next">
          <AngleRight />
        </div>
      </div>
    </div>
  </LazyComp01>
</template>

<script>
import AngleLeft from '@@/../components/icons/AngleLeft.vue'
import AngleRight from '@@/../components/icons/AngleRight.vue'
import i18n from '@@/lang/desktop/users-index.json'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import RankIcon from '@@/../components/users/rank-icons'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    AngleLeft,
    AngleRight,
    LazyComp01,
    RankIcon,
  },
  props: {
    userInfo: {
      type: Object,
      default() {
        return {
          userId: 0,
          nickName: '',
          isBuyer: 0,
          isDeveloper: 0,
          followings: 0,
          followers: 0,
          products: [],
        }
      }
    },
  },
  computed: {
    productSliderItem() {
      let { products } = JSON.parse(JSON.stringify(this.userInfo)), // deep clone
      rs = []
      while (products.length) {
        rs.push(products.splice(0, 12))
      }
      return rs
    },
  },
  methods: {
    buildSlider() {
      this.$nextTick(() => {
        const nextArrow = '<i style="width: 35px;color: black; height: 35px;" class="icon-cls"><svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" width="36" height="36"><path fill="currentColor" d="M31.3 45.2l22.1-22.1c1.5-1.5 4-1.5 5.5 0l3.7 3.7c1.5 1.5 1.5 4 0 5.5L46.9 48l15.8 15.7c1.5 1.5 1.5 4 0 5.5L59 72.9c-1.5 1.5-4 1.5-5.5 0L31.3 50.8c-1.6-1.6-1.6-4 0-5.6z"></path></svg></i>'
        const prewArrow = '<i style="width: 35px;color: black; height: 35px;" class="icon-cls"><svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" width="36" height="36"><path fill="currentColor" d="M64.7 50.8L42.6 72.9c-1.5 1.5-4 1.5-5.5 0l-3.7-3.7c-1.5-1.5-1.5-4 0-5.5L49.1 48 33.3 32.3c-1.5-1.5-1.5-4 0-5.5l3.7-3.7c1.5-1.5 4-1.5 5.5 0l22.2 22.1c1.6 1.6 1.6 4 0 5.6z"></path></svg></i>'
        $(this.$refs.slider).owlCarousel({
          slideTransition: 'ease',
          autoplayTimeout: 4e3,
          items: 1,
          nav: true,
          dots: false,
          lazyLoad: true,
          loop: true,
          autoplay: true,
          slideBy: 1,
          smartSpeed: 500,
          autoplayHoverPause: true,
          navText: [nextArrow, prewArrow],
        })
      })
    },
    next() {
      $(this.$refs.slider).find('.owl-next').click()
    },
    prev() {
      $(this.$refs.slider).find('.owl-prev').click()
    },
  }
}
</script>

<style lang="scss" scoped>
.user-card {
  width: calc(33.33333% - 13.33333px);
  min-height: 370px;
  border: 2px solid #e2e2e2;
  margin-right: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  &:nth-child(3n) {
    margin-right: 0;
  }
  .rank-icon {
    height: 40px;
    width: 40px;
    position: absolute;
    top: 4px;
    left: 4px;
    transition: opacity 0.3s ease-in-out 0.4s;
  }
  .block-1 {
    min-height: 100px;
    margin: 0 12px;
    padding: 0 12px 15px 12px;
    border-bottom: 1px solid #e2e2e2;
    .img-ctn {
      width: 50px;
      height: 50px;
      border: 1px solid #d5d5d5;
      border-radius: 5px;
      overflow: hidden;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .follow-info {
      flex-grow: 1;
    }
  }
  .block-2 {
    .product-item {
      width: 42px;
      height: 42px;
      margin: 5px;
      transition: all 0.3s;
      cursor: pointer;
      border: 1px solid #d5d5d5;
      border-radius: 5px;
      overflow: hidden;
      img {
        max-width: 100%;
        max-height: 100%;
      }
      &:hover {
        transform: scale(1.2);
      }
    }
    .owl-carousel /deep/ {
      width: calc(100% - 18px) !important;
      margin: auto;
      height: 165px;
      overflow: hidden;
      .owl-nav button {
        &.owl-prev {
          display: none;
        }
        &.owl-next {
          display: none;
        }
      }
    }
  }
  .slide-title {
    text-align: center;
    font-size: 18px;
    padding: 8px 0;
    color: #707070;
  }
  .next-prev-ctn /deep/ .icon-cls {
    width: 28px;
    height: auto;
    color: #858585;
  }
}
.red-dot {
  display: inline-block;
  height: 12px;
  width: 12px;
  flex: 0 0 12px;
  background: #ec6878;
  margin-right: 2px;
  border-radius: 10px;
}
.green-dot {
  display: inline-block;
  height: 12px;
  width: 12px;
  flex: 0 0 12px;
  background: #21ba9b;
  margin-right: 2px;
  border-radius: 10px;
}
</style>