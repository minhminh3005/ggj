<template>
  <div class="article-password-lock flex center" v-if="locked">
    <article-password-lock :unlock="unlockArticle" />
  </div>
  <div v-else class="article-detail-page flex layout-col pb-60">
    <article-header :article="article" />
    <div class="article-detail-page-container">
      <article-floating-panel :like-status="likeStatus" @onLike="onLike" />
      <article-content :article-option="article.articleOption" />
      <div class="hashtag-area" v-if="article.hashtags.length">
        <Hashtags :hashtags="article.hashtags" />
      </div>
      <register-article-free :register-title="$t(41)" :error-text="$t(58)" />
      <article-prices :unlock="unlockArticle" />
      <div class="text-center mt-20" v-if="article.articleOption === SALON_ARTICLE">
        <a :href="magazineUrl" class="btn btn-salon">{{ $t(46) }}</a>
      </div>
      <div class="sharing-bottom flex space-between mt-30">
        <div class="inline-flex">
          <LikeCount
            width="30"
            height="30"
            :liked="likeStatus.isLiked"
            :count="likeStatus.totalLike"
            @onLike="onLike"
            class="like-count"
          />
          <navi-favourite-button
            @favourite="markFavourite"
            :marked="article.isFavorite"
          />
        </div>
        <SocialIcons />
      </div>
      <LazyComp01 :always-show="isGoToComment" min-height="192px">
        <article-comments v-if="article.seriesId !== 811" />
      </LazyComp01>
      <LazyComp01 min-height="194px" v-if="isShownPaging && article.articleOption !== SALON_ARTICLE">
        <article-paging />
      </LazyComp01>
      <LazyComp01 min-height="110px" v-if="article.articleOption === SALON_ARTICLE">
        <div class="flex layout-col mid salon-preview-ctn mt-30">
          <div class="mt-30"><span class="salon-title mt-30">{{ $t(44) }}</span></div>
          <SalonHorizontal01 class="mt-20 mb-20" :data="article.salon" :is-navi="false" />
        </div>
      </LazyComp01>
      <LazyComp01 min-height="110px">
        <article-author-bottom />
      </LazyComp01>
      <div v-if="isShowReviewLink" class="review-detail-link">
        <a :href="reviewDetailURL">{{ $t(54) }}</a>
        {{ $t(55) }}
      </div>
      <div class="separate-section"></div>
      <LazyComp01 min-height="428px" v-if="seriesRank && seriesRank.length">
        <article-ranking
          :title="$t(2)"
          :products="seriesRank"
          v-if="seriesRank && seriesRank.length"
        />
      </LazyComp01>
      <LazyComp01 min-height="428px" v-if="articleRank && articleRank.length">
        <article-ranking :title="$t(26)" :products="articleRank" use-period />
      </LazyComp01>
      <LazyComp01 min-height="288px" v-if="alsoBought && alsoBought.length">
        <article-also-bought
          :products="alsoBought"
          v-if="alsoBought && alsoBought.length"
        />
      </LazyComp01>
    </div>
  </div>
</template>
<script>
import ArticleHeader from "@@/../common/components/navi/article/article-header"
import ArticleContent from "@@/../common/components/navi/article/article-content"
import ArticlePaging from "@@/../common/components/navi/article/article-paging"
import ArticleAlsoBought from "@@/../common/components/navi/article/article-also-bought"
import ArticleFloatingPanel from "@@/../common/components/navi/article/article-floating-panel"
import ArticleAuthorBottom from "@@/../common/components/navi/article/author-bottom"
import ArticleComments from "@@/../common/containers/navi/article/article-comments"
import ArticleRanking from "@@/../common/containers/navi/article/article-ranking"
import NaviFavouriteButton from "@@/../common/components/favourite-button"
import LazyComp01 from "@@/../components/LazyComp01.vue"
import ArticlePrices from "@@/../common/containers/navi/article/article-price-buttons"
import RegisterArticleFree from "@@/../common/containers/navi/article/article-register-free"
import LikeCount from "@@/../common/components/like-count"
import SalonHorizontal01 from '@@/desktop/components/product/navi/SalonHorizontal01.vue'
import { checkNested } from "@/utils/client/common"
import ArticleMixins from "@@/../common/containers/navi/article/mixins"
import ArticlePasswordLock from "@@/../common/components/navi/article/article-password-lock"
import i18n from "@@/lang/common/navi-article.json"
import { SINGLE, SERIALIZED, SINGLE_SERIALIZED, SALON_ARTICLE } from '@@/../common/assets/consts/article'
import Hashtags from '@@/../components/common/Hashtags.vue'
import SocialIcons from "@@/../common/components/social-icons"

export default {
  name: "ArticleDetailPage",
  i18n: {
    messages: i18n
  },
  components: {
    LikeCount,
    ArticleAlsoBought,
    ArticleRanking,
    ArticleAuthorBottom,
    ArticlePaging,
    ArticleComments,
    NaviFavouriteButton,
    ArticleContent,
    ArticleFloatingPanel,
    ArticleHeader,
    LazyComp01,
    ArticlePasswordLock,
    ArticlePrices,
    RegisterArticleFree,
    SalonHorizontal01,
    Hashtags,
    SocialIcons,
  },
  data() {
    return {
      SINGLE,
      SERIALIZED,
      SINGLE_SERIALIZED,
      SALON_ARTICLE,
      likeStatus: {},
      isGoToComment: false,
    }
  },
  mixins: [ArticleMixins],
  props: [
    'alsoBought',
    'seriesRank',
    'articleRank',
    'unlockArticle',
    'locked',
    'isMobile',
  ],
  computed: {
    article() {
      return this.$store.getters['finance/selectedArticle']
    },
    isShownPaging() {
      return +this.article.seriesId
    },
    magazineUrl(){
      const isOwner = (this.article.user || {}).id == this.$store.state.user.id
      const salon = this.article.salon || {}
      if (!this.article.isPurchasedSeries || isOwner){
        return salon.isMagazine ? `/finance/mailmagazine/${this.article.seriesId}`
            : `/finance/salons/${this.article.seriesProductId}`
      }else{
        return `/mypage/mailmagazine/${this.article.seriesId}/backnumbers/${this.article.productId}`
      }
    },
    isShowReviewLink() {
      const articleOption = this.article.articleOption
      if(articleOption === SINGLE || articleOption === SINGLE_SERIALIZED) return !!this.article.articlePrice
      if(articleOption === SERIALIZED && this.article.seriesPrice) return true
      return false
    },
    reviewDetailURL() {
      if(!this.isShowReviewLink) return '#'
      return `/review/detail/${this.article.articleOption === SERIALIZED ? this.article.seriesProductId : this.article.productId}`
    }
  },
  mounted() {
    this.GoGoHTTP.get(
      `/api/v3/surface/navi/article/${this.article.id}/like`
    ).then(res => (this.likeStatus = res))
    const comment = this.$route.query.cmt
    this.isGoToComment = !!comment
  },
  methods: {
    checkNested,
    onLike() {
      this.GoGoHTTP.post(
        `/api/v3/surface/navi/article/${this.article.id}/like`
      ).then(() => {
        this.likeStatus = {
          totalLike: this.likeStatus.isLiked
            ? --this.likeStatus.totalLike
            : ++this.likeStatus.totalLike,
          isLiked: !this.likeStatus.isLiked
        }
      })
    },
  }
}
</script>
<style scoped lang="scss">
.article-detail-page {
  margin-bottom: 40px;
  border-top: 1px solid #efefef;
  .article-detail-page-container {
    max-width: 620px;
    align-self: center;
    @media screen and (max-width: 620px) {
      width: 100vw;
    }
  }
  .sharing-bottom {
    padding: 10px 0;
    border-bottom: 1px solid #d8d8d8;
  }
}
.separate-section {
  height: 84px;
  background: repeating-linear-gradient(
    -45deg,
    #fff,
    #fff 20px,
    #d8d8d8 20px,
    #d8d8d8 30px
  );
}
.tag {
  border: 1px solid #d9d9d9;
  border-radius: 3px;
  background: #f7f7f7;
  color: #2d2d2d;
  height: 30px;
}
.like-count {
  margin-right: 20px;
}
.favourite-button /deep/ {
  button {
    border: none;
  }
}
.btn-salon {
  min-width: 50%;
  background: #ce8d5d;
  color: white;
  cursor: pointer;
  border-radius: 0;
  &:hover,
  &:focus {
    background: darken($color: #ce8d5d, $amount: 10%);
  }
}
.salon-title {
  text-align: center;
  color: #2c2c2c;
  font-size: 16px;
  font-weight: bold;
}
.salon-preview-ctn {
  border-bottom: 1px solid #d8d8d8;
  border-top: 1px solid #d8d8d8;
}
.review-detail-link {
  text-align: center;
  font-size: 16px;
  padding: 0 0 40px 0;
  margin-bottom: 40px;
  border-bottom: 1px solid #d8d8d8;
}
@media all and (max-width: 767px) {
  /deep/ .article-content-container {
    padding-left: 20px;
    padding-right: 20px;
    ~ div {
      padding-left: 20px !important;
      padding-right: 20px !important;
    }
  }
  .like-count {
    margin-right: 10px;
  }
}
@media all and (max-width: 425px) {
  /deep/ .article-content-container {
    padding-left: 15px;
    padding-right: 15px;
    ~ div {
      padding-left: 15px !important;
      padding-right: 15px !important;
    }
  }
}
@media all and (max-width: 320px) {
  .like-count {
    min-width: 30px !important;
  }
}
.hashtag-area {
  margin-top: 24px;
}
</style>
