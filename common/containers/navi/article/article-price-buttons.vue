<template>
  <div v-if="(article.seriesPrice || article.articlePrice) && !isOwner" class="price-actions flex layout-col">
    <template v-if="!checkShowPassword">
      <div v-if="isFreeArticleInPaidSeries" class="mt-40 mb-20 flex mid center free-article-paid-series w-full">
        {{ t(40) }}
      </div>
      <div v-else-if="isFreeWarning" class="information mt-40 mb-20 flex mid center">
        {{ t(17) }}
      </div>
      <!-- ARTICLE PRICE -->
      <div class="wrap-community" v-if="article.articleOption !== SERIALIZED && article.articlePrice && !article.isPurchased">
        <div class="flex mid">
          <Book />
          <span class="text-icon">{{ t(56) }}</span>
        </div>
        <CommunityButton v-if="article.articlePrice && !article.isPurchased" :attrs="{page: 'navi', numCom: 1, isSeries: false}" />
      </div>
      <navi-cart-button
        :article-sale-stop="article.articleSaleStop"
        :show-cart="false"
        :left-text="article.articleSaleStop ? t(39) : t(18)"
        v-if="article.articlePrice && !article.isPurchased"
        :price="article.articlePrice"
        :product-id="article.productId"
        container-class="price-button-container"
        button-class="price-button"
      />
      <!-- SERIES PRICE -->
      <!-- Show break line when have series price and article price -->
      <div class="break-line" v-if="article.articlePrice && !article.isPurchased && article.seriesPrice && !article.isPurchasedSeries"></div>
      <div class="wrap-community" v-if="article.seriesPrice && !article.isPurchasedSeries">
        <div class="flex mid" v-if="article.articleOption !== SINGLE">
          <SeriesIcon :article-option="article.articleOption" />
          <span class="text-icon">{{ t(5) }}</span>
        </div>
        <CommunityButton v-if="article.seriesPrice && !article.isPurchasedSeries" :attrs="{page: 'navi', isSeries: true, numCom: 1, isSeries: true}" />
      </div>
      <div class="pos-rel">
        <navi-cart-button
          :series-sale-stop="article.seriesSaleStop"
          :show-cart="false"
          :left-text="article.seriesSaleStop ? t(39) : t(19)"
          monthly
          class="mt-5"
          v-if="article.seriesPrice && !article.isPurchasedSeries"
          :price="article.seriesPrice"
          :discount-price="article.discountPrice"
          :product-id="article.seriesProductId"
          container-class="price-button-container"
          button-class="price-button"
        />
        <IsFreeFirstMonthIcon v-if="isFFM" class="ffm" :class="{'has-discount': !!info.serie.oldPrice}" />
      </div>
    </template>
    <article-password-lock v-else :unlock="unlock" class="mt-40" />
  </div>
</template>
<script>
import NaviCartButton from "@@/../common/components/navi/article/article-cart-button"
import ArticlePasswordLock from '@@/../common/components/navi/article/article-password-lock'
import {t} from '@@/../common/assets/js/helper'
import IsFreeFirstMonthIcon from '@@/../common/components/navi/article/is-free-first-month-icon'
import CommunityButton from '@@/../components/community/CommunityButton.vue'
import Book from '@@/../components/icons/Book.vue'
import SeriesIcon from "@@/../common/components/navi/series-icon"
import { SINGLE, SERIALIZED  } from '@@/../common/assets/consts/article'

export default {
  name: "ArticlePrices",
  components: {
    CommunityButton,
    IsFreeFirstMonthIcon,
    NaviCartButton,
    ArticlePasswordLock,
    Book,
    SeriesIcon
  },
  props: ['unlock'],
  data() {
    return {
      SINGLE,
      SERIALIZED
    }
  },
  computed: {
    article() {
      return this.$store.getters["finance/selectedArticle"]
    },
    info() {
      return this.$store.state.cart.info
    },
    checkArticle() {
      if (!this.info.article || !this.info.article.price) {
        return false
      }
      return Object.keys(this.info.article).length
    },
    checkShowPassword() {
      return this.isPassword !== 0 && this.productStatus !== 1
    },
    productStatus() {
      return this.$store.state.cart.productStatus
    },
    isPassword() {
      return this.$store.getters['cart/isPassword']
    },
    isFFM() {
      return this.info.serie.isFFM || this.info.article.isFFM || this.info.serie.productId == 15153 //OAM-30772 serie 512 is free first month
    },
    isOwner() {
      const {user = {}} = this.article
      return user.id == this.$store.state.user.id
    },
    isFreeArticleInPaidSeries() {
      return !this.article.isPaidContent && this.article.seriesPrice > 0 && this.article.articleOption === SERIALIZED
    },
    isFreeWarning() {
      return (!this.article.registerArticleFree && (this.article.articlePrice || (this.article.seriesPrice && !this.article.isPurchasedSeries)) &&
              !this.article.isPurchased &&
              !this.isOwner &&
              (this.info.serie.price || this.info.article.price))
    }
  },
  methods: {t}
}
</script>
<style scoped lang="scss">
@import "@@/../common/assets/variables.scss";
.ffm {
  position: absolute;
  left: -35px;
  top: 5px;
  &.has-discount {
    top: 28px;
  }
}
.price-actions {
  align-items: center;
  .information {
    border: 1px solid #ff8500;
    color: #ff8500;
    width: 274px;
    height: 51px;
    text-align: center;
    font-size: 16px;
  }
  .free-article-paid-series {
    color: #548bdf;
    border-top: 1px solid #548bdf;
    border-bottom: 1px solid #548bdf;
    height: 50px;
  }
}
.wrap-community {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  width: 274px;
  margin: 20px 0 16px;
  align-items: center;
  .text-icon {
    color: #737E8E;
    margin-left: 5px;
  }
  i.icon-cls {
    color: #5D5E5E;
    width: 28px;
    height: 28px;
  }
}
@media only screen and (min-width: $screen-md) {
  .momo {
    display: none;
  }
  .break-line {
    display: none;
  }
}
.break-line {
  height: 2px;
  width: 274px;
  background: #CBCBCB 0% 0% no-repeat padding-box;
  margin-top: 16px;
  opacity: 0.3;
}
</style>
<style lang="scss">
.price-button-container {
  width: 274px;
}
.price-button {
  padding: 5px 15px;
  min-height: 50px;
}
</style>
