<template>
  <div class="article flex" :key="'article-' + item.id">
    <div class="demo">
      <ImgWrapper :href="`/finance/navi/articles/${item.id}`" :src="src" alt="" class="article-img cursor-pointer" />
      <MiniCart02 class="hero-header-text" :paid="item.paid" :price="item.price" :product-id="item.pId" :purchased="item.purchased" :discount-price="0" v-if="isShowCart()" />
    </div>
    <div class="w-full article-full-content">
      <a :href="`/finance/navi/articles/${item.id}`">
        <div class="flex width-wrap-text">
          <span v-if="categories[item.naviCategoryId]" class="artical-bagde">{{ categories[item.naviCategoryId].categoryName || '' }}</span>
          <div class="article-name wrap-text" :title="item.title">{{ item.title }}</div>
        </div>
      </a>
      <div class="flex space-between">
        <div class="article-time">
          {{ formatTime(item.publishedAt, 20) }}{{ $t('3') }}
        </div>
      </div>
      <div class="mobile-category" v-if="item.naviCategoryId">
        #{{ categories[item.naviCategoryId].categoryName || '' }}
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/navi-horizontal07.json'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import MiniCart02 from '@@/../common/components/navi/series/mini-cart02'
import { onNaviFollow, onNaviFavorite } from '@@/../common/js/finance/utils'
import { SALON_ARTICLE } from '@@/../common/assets/consts/article'

export default {
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    followFn: Function,
    favoriteFn: Function,
    seriesPrice: Number
  },
  components: {
    ImgWrapper,
    MiniCart02,
  },
  i18n: {
    messages: i18n,
  },
  computed: {
    categories() {
      return this.$store.getters['finance/naviCategoryToObject'] || {}
    },
    src(){
      const noImage = '/img/assets/pc/common/default/no-img.png'
      return this.item.articleOption === SALON_ARTICLE ? this.item.imageFile || noImage : `/img/articles/${this.item.id}/small`
    }
  },
  methods: {
    onNaviFollow,
    onNaviFavorite,
    isShowCart() {
      // free and purchased !this.item.purchased
      return !(((this.seriesPrice || this.item.seriesPrice) && !this.item.price && !this.item.purchased) || (!this.item.price && this.item.paid))
    },
    isFavoriteStore() {
      let favData = this.$store.getters['finance/getFavData']
      if(favData) {
        return favData.favorite.findIndex(favItem => favItem.id == this.item.id)
      }
    },
    isFollowStore() {
      let favData = this.$store.getters['finance/getFavData']
      if(favData) {
        return favData.follow.findIndex(
          followItem => followItem.id == this.item.id
        )
      }
    },
    getUnFav() {
      let favData = this.$store.getters['finance/getFavData'],
        isFavoriteStore = this.isFavoriteStore()
      if (favData && isFavoriteStore != -1) {
        this.isUnFav = favData.favorite[isFavoriteStore]['isUnFav']
      } else {
        this.isUnFav = true
      }
    },
    getUnFollow() {
      let favData = this.$store.getters['finance/getFavData'],
        isFollowStore = this.isFollowStore()
      if (favData && isFollowStore != -1) {
        this.isUnFollow = favData.follow[isFollowStore]['isUnFollow']
      } else {
        this.isUnFollow = true
      }
    },
    getInfoStore() {
      this.getUnFav()
      this.getUnFollow()
    },
  },
  data() {
    return {
      SALON_ARTICLE,
      loadingFollow: false,
      loadingFavorite: false,
      isUnFav: true,
      isUnFollow: true,
    }
  },
  mounted() {
    this.getInfoStore()
    this.$nuxt.$on('upDateDataItem', this.getInfoStore)
  },
  beforeDestroy() {
    this.$nuxt.$off('upDateDataItem')
  },
}
</script>

<style lang="scss" scoped>
/deep/ {
  .follow-YD28V {
    height: 21px;
  }
}
.article {
  padding: 15px 0;
  width: 100%;
  .article-img {
    flex: 0 0 98px;
    width: 98px;
    height: 55px;
  }
  .article-full-content {
    width: 100%;
    margin-left: 20px;
    .article-name {
      color: #595959;
      font-size: 18px;
    }
    .article-content {
      color: #7d7d7d;
      height: 36px;
      overflow: hidden;
    }
    .article-time {
      font-size: 12px;
      color: #7d7d7d;
      margin-top: 10px;
    }
    a {
      text-decoration: none;
      &:hover {
        .article-name {
          text-decoration: underline;
        }
      }
    }
  }
  .follow-YD28V.theme-1 {
    width: 75px;
    height: 20px;
    span {
      font-size: 10px;
    }
  }
  .fav-F7AR2 {
    width: 75px;
    height: 21px;
    span {
      font-size: 10px;
    }
    .icon-cls {
      flex: 0 0 11px;
      width: 11px;
      height: 11px;
    }
  }
}
.deactive-qANNQ {
  opacity: 0.5;
}
.artical-bagde {
  white-space: nowrap;
  height: 20px;
  color: #6d6c6c;
  border: solid 1px #b2b2b2;
  border-radius: 4px;
  text-align: center;
  font-size: 12px;
  padding: 0 10px;
  line-height: 20px;
  margin-top: 2px;
  margin-right: 10px;
}
.demo {
  position: relative !important;
  .hero-header-text {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    border-radius: 8px;
    transform: translate(-50%, -50%);
    width: 65px;
    height: 30px;
    background: #ff8500 0% 0% no-repeat padding-box;
    opacity: 0.75;
  }
}
.width-wrap-text {
  width: 730px;
}
.mobile-category {
  display: none;
}
@media only screen and (max-width: 768px),
  only screen
  and (max-width: 896px)
  and (max-height: 414px) {
  .width-wrap-text {
    width: 100%;
  }
  .demo {
    display: flex;
    align-items: center;
    .hero-header-text {
      position: static;
      margin-left: 25px;
      transform: none;
    }
  }
  .article {
    flex-direction: column;
    padding-top: 10px;
    .article-full-content {
      margin-left: 0;
      width: 100%;
      .article-name {
        color: white;
        max-width: calc(100vw - 50px);
        margin-top: 15px;
      }
      .article-time {
        font-size: 14px;
        color: #a0a0a0;
        margin-top: 10px;
      }
    }
  }
  .artical-bagde {
    display: none;
  }
  .mobile-category {
    display: block;
    color: #cecece;
    margin-top: 10px;
    padding-bottom: 10px;
    font-size: 14px;
    border-bottom: solid 1px #777;
  }
}
</style>
