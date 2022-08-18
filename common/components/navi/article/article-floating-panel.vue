<template>
  <div class="floating-panel flex layout-col" ref="floatingPanel">
    <span>
      {{ t(3) }}：<span class="date">
        {{
          formatTime(article.publishedAt, 6)
        }}
      </span>
    </span>
    <span>
      {{ t(4) }}：<span class="date">
        {{
          formatTime(article.updatedAt, 6)
        }}
      </span>
    </span>
    <div class="btns-group">
      <div class="flex center mb-20 mt-20">
        <LikeCount
          width="30"
          height="30"
          @onLike="$emit('onLike')"
          :liked="likeStatus.isLiked"
          :count="likeStatus.totalLike"
        />
      </div>
      <navi-favourite-button
        @favourite="markFavourite"
        :marked="article.isFavorite"
      />
    </div>
    <SocialIcons />
    <!-- ARTICLE PRICE -->
    <div class="divider mb-20" v-if="article.articlePrice"></div>
    <div class="series-section inline-flex mb-20" style="align-items: center;" v-if="article.articlePrice">
      <Book />
      <span class="ml-5" style="color: #737e8e; font-size: 14px;">{{ t(56) }}</span>
    </div>
    <div class="flex mid" style="flex-direction: column;">
      <navi-cart-button
        :article-sale-stop="article.articleSaleStop"
        v-if="article.articlePrice && !article.isPurchased && !isOwner"
        class="mt-20"
        :price="article.articlePrice"
        :product-id="article.productId"
        container-class="article-price-container"
        button-class="article-price-button"
      />
      <div class="purchase-btn flex mt-15" v-if="!!article.articlePrice && article.isPurchased && !isOwner">
        <span>{{ t(38) }}</span>
        <span>¥{{ formatNumber(article.articlePrice || 0) }}</span>
      </div>
    </div>
    <!-- SERIES PRICE -->
    <template v-if="article.seriesId">
      <div class="divider mt-20 mb-20"></div>
      <div class="series-section inline-flex" style="align-items: center;">
        <SeriesIcon :article-option="article.articleOption" />
        <span class="ml-5" style="color: #737e8e; font-size: 14px;">
          {{
            article.articleOption === SALON_ARTICLE ? t(45) : t(5)
          }}
        </span>
      </div>
      <span
        v-if="article.articleOption === SALON_ARTICLE"
        class="series-title mt-10 clamp clamp-2"
        :title="article.seriesName"
        style="height: 40px;"
      >
        {{ article.seriesName }}
      </span>
      <a
        class="series-title mt-10 clamp clamp-2"
        v-else-if="article.seriesName"
        :title="article.seriesName"
        :href="`/finance/navi/series/${article.seriesId}`"
        style="height: 40px;"
      >
        {{ article.seriesName }}
      </a>
      <div v-if="!isHTML(article.seriesContent)"
           class="series-content mt-10 clamp"
           style="height: 120px; -webkit-line-clamp: 7;"
      >
        {{ article.seriesContent }}
      </div>
      <div class="flex center" style="flex-direction: column;">
        <navi-cart-button
          :series-sale-stop="article.seriesSaleStop"
          class="mt-20"
          monthly
          v-if="article.seriesPrice && !article.isPurchasedSeries && !isOwner"
          :price="article.seriesPrice"
          :product-id="article.seriesProductId"
          button-class="series-price-button"
          container-class="series-price-container"
        />
      </div>
      <div class="purchase-btn flex mt-20" v-if="article.seriesPrice && article.isPurchasedSeries && !isOwner">
        <span>{{ t(38) }}</span>
        <span>¥{{ formatNumber(article.seriesPrice || 0) }}</span>
      </div>
      <div class="salon-detail-link mt-20" v-if="article.salon">
        <a :href="salonUrl">{{ t(43) }}</a>
      </div>
    </template>
  </div>
</template>
<script>
import Book from '@@/../components/icons/Book.vue'
import SeriesIcon from "@@/../common/components/navi/series-icon"
import NaviFavouriteButton from "@@/../common/components/favourite-button"
import NaviCartButton from "@@/../common/components/navi/article/article-cart-button"
import LikeCount from "@@/../common/components/like-count"
import ArticleMixins from "@@/../common/containers/navi/article/mixins"
import { urlify, t } from "@@/../common/assets/js/helper"
import {
  isHTML,
} from '@@/../common/js/finance/utils'
import { SALON_ARTICLE } from '@@/../common/assets/consts/article'
import SocialIcons from "@@/../common/components/social-icons"

export default {
  name: "ArticleFloatingPanel",
  mixins: [ArticleMixins],
  components: {
    LikeCount,
    NaviCartButton,
    NaviFavouriteButton,
    SeriesIcon,
    Book,
    SocialIcons,
  },
  data() {
    return {
      SALON_ARTICLE
    }
  },
  props: {
    likeStatus: {
      type: Object,
      default: () =>({
        totalLike: 0,
        isLiked: false
      })
    }
  },
  computed: {
    article() {
      return this.$store.getters["finance/selectedArticle"]
    },
    isOwner() {
      const {user = {}} = this.article
      return user.id == this.$store.state.user.id
    },
    salonUrl() {
      const article = this.$store.getters["finance/selectedArticle"]
      const salon = article.salon || {}
      return salon.isMagazine ? `/finance/mailmagazine/${article.seriesId}`
          : `/finance/salons/${salon.id}`
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleWindowScroll)
    window.document.body.addEventListener("scroll", this.handleWindowScroll)
  },
  beforeDestroy() {
    window.document.body.removeEventListener("scroll", this.handleWindowScroll)
    window.removeEventListener("scroll", this.handleWindowScroll)
  },
  methods: {
    t,
    urlify,
    handleWindowScroll() {
      const commentsSection = document.querySelector(".article-comments")
      const articleContentElement = document.querySelector(".article-content")
      const fromTop = $(window).scrollTop()

      if (commentsSection) {
        this.$refs.floatingPanel.style.opacity =
          fromTop &&
          (
            this.isElementInViewport(commentsSection, 300) ||
            !this.isElementInViewport(articleContentElement) ||
            window.innerWidth < 1280
          )
            ? "0"
            : "1"
      }
      if(fromTop >= 161) {
        this.$refs.floatingPanel.style.top = '39px'
        this.$refs.floatingPanel.style.position = 'fixed'
      } else {
        this.$refs.floatingPanel.style.top = '200px'
        this.$refs.floatingPanel.style.position = 'absolute'
      }
    },
    isHTML
  }
}
</script>
<style scoped lang="scss">
.floating-panel {
  display: none;
  transition-delay: 0.2s;
  transition-timing-function: ease;
  transition-duration: 0.4s;
  transition-property: opacity;
  @media all and (min-width: 1280px) {
    display: flex;
  }
  @media all and (min-width: 1777px) {
    left: 300px; // 14%;
  }
  max-width: 230px;
  position: absolute;
  // top: 19%;
  top: 200px;
  left: 50px; // 3%;
  border: 1px solid #cbcbcb;
  padding: 30px 20px;
  border-radius: 4px;
  background: #fff;
  z-index: 2;
  span {
    color: #777;
    align-self: center;
    .date {
      color: #2c2c2c;
    }
  }
  .divider {
    width: 100%;
    height: 2px;
    background-color: #cbcbcb;
  }
  .series-title {
    color: #2c2c2c;
    font-size: 14px;
    font-weight: bold;
    align-self: self-start;
  }
  .series-content {
    color: #606060;
    font-size: 12px;
    word-break: break-word;
  }
  .series-section {
    i.icon-cls {
      color: #5D5E5E;
      width: 28px;
      height: 28px;
    }
  }
  .btns-group {
    display: flex;
    align-content: center;
    justify-content: center;
    .favourite-button /deep/ {
      button {
        border: none;
      }
    }
  }
}
/deep/.navi-cart-button {
  min-width: 115px !important;
  width: auto !important;
  height: 25px !important;
  align-self: center;
  .current-price {
    margin-left: 8px;
  }
  svg {
    width: 20px !important;
    height: 20px !important;
  }
}
.purchase-btn {
  width: 100%;
  height: 32px;
  padding: 5px 15px;
  background-color: #ddc6b6;
  justify-content: space-between;
  align-self: center;
  align-items: center;
  line-height: 40px;
  span {
    color: white;
  }
}
.salon-detail-link {
  text-align: center;
  a {
    text-align: center;
    color: #cd9670;
    font-weight: 700;
    font-size: 16px;
  }
}
</style>
<style lang="scss">
.series-price-container {
  min-width: 130px;
  .discount-time {
    font-size: 10px !important;
  }
}
.series-price-button {
  padding: 5px 15px;
}
.article-price-container {
  width: 125px;
}
.article-price-button {
  padding: 5px 15px;
  min-height: 32px;
}
</style>
