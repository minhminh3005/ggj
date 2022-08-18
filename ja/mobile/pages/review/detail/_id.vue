<template>
  <div>
    <div class="review-title pt-10 pb-10 pl-15">
      <strong>{{ $t('1') }}</strong>
    </div>
    <div class="product">
      <div class="product-info p-15">
        <div class="flex layout-row">
          <a :href="productInfo.detailUrl">
            <ImgWrapper class="s-65 mr-5" :src="`/img/products/${productInfo.id}/small`" />
          </a>
          <div class="info">
            <Rate 
              :stars="productInfo.reviewStars"
              :number="productInfo.reviewCount"
            />
            <div class="name" ref="productInfo">
              <a :href="productInfo.detailUrl" class="no-underlying">{{ productInfo.name }}</a>
            </div>
            <span class="product-updated">{{ formatTime(productInfo.updatedAt, 6) }}</span>
          </div>
        </div>
        <div class="flex pr-20 pl-20 pt-20 pb-15 center">
          <a class="flex center my-review pt-5 pb-5 no-underlying" :href="`/review/input/` + productInfo.id">{{ myReview.id ? $t('2') : $t('3') }}</a>
        </div>
      </div>
      <div class="flex mid fixed-cart layout-row w-full" ref="cartFixed" v-show="false">
        <ImgWrapper class="s-40 mr-5" :src="`/img/products/${productInfo.id}/small`" />
        <div class="product-name-price">
          <div class="wrap-text">{{ productInfo.name }}</div>
          <span style="color: red;">
            <span v-html="$t('14', {price: formatNumber(productInfo.cartInfo.price)})"></span>
            <div style="display: inline-block;">{{ $t('16') }}</div>
          </span>
        </div>
        <button class="btn-orange" @click="addToCart">
          <div class="flex mid center w-full">
            <Cart class="mr-10" />
            <span class="ver-mid">{{ $t('13') }}</span>
          </div>
        </button>
      </div>
    </div>
    <LazyComp01 v-for="(review,index) in (reviewData.data || [])" :key="'a4hAd'+index" class="everyone-review pl-10 pr-10 mt-20 pb-20 " min-height="105px">
      <ProductReview
        :img-src="'/img/users/'+review.reviewUserId+'/small'" 
        :review="review"
      >
        <div slot="title">
          <div
            class="flex"
            style="height: 22px;"
            v-if="$store.state.user.id == review.reviewUserId"
          >
            <a
              class="no-underlying pl-5 pr-5 rr-loadmore"
              :href="`/review/input/` + productInfo.id"
            >
              {{ $t(22) }}
            </a>
            <div class="ml-15 text-primary cursor-pointer" @click="onConfirmReview(review.id)"><strong>✕</strong></div>
          </div>
          <div class="text-right" style="color: red; padding: 8px 0; display: none; white-space: nowrap;" id="del-failed-text">{{ $t(23) }}</div>
        </div>
      </ProductReview>
    </LazyComp01>
    <LoadMore
      class="load-more"
      v-show="(reviewData.data || []).length < reviewData.total"
      @click.native="onLoadMore()"
    />
    <div class="p-10 bottom-bg">
      <ReviewContainer 
        @seeMore="onSeeMore"
        :config="{ 
          title: $t('10'),
          seeMoreURL: `/review/highpost/systemtrade/3`,
        }"
        class="mb-20"
      >
        <ReviewItem04 v-for="(item, index) in rankingEA" :item="item" :key="'rankingEA-' + item.productId + index" :rank="parseInt(index) + 1" />
      </ReviewContainer>
    </div>
    <template v-if="(alsoBought || []).length">
      <div class="mt-20 p-10" style="background: #666; color: white;">{{ $t('18') }}</div>
      <div class="flex layout-col">
        <ReviewItem05 v-for="item in alsoBought" :item="item" :key="'also-bought' + item.id" from-src="recommended" />
      </div>
    </template>  
    <SocialLinks class="mt-20 mb-50" />
    <GogoModal
      :show="showDeleteReview"
      @update:show="val => (showDeleteReview = val)"
      :width="350"
      :height="180"
      @close="showDeleteReview = false"
      @ok="showDeleteReview = true" 
    >
      <div
        class="p-20"
        slot="modal-body"
        style="height: calc(100% - 60px);"
      >
        {{ $t(19) }}
      </div>
      <div class="text-right modal-footer" slot="modal-footer" style="background: #fff;">
        <button
          @click="deleteReview"
          class="btn btn-primary mr-10"
          style="background: #17a2b8; border-color: #17a2b8;"
          :disabled="isProcess"
        >
          {{ $t(21) }}
        </button>
        <button
          @click="showDeleteReview = false"
          class="btn btn-default"
          :disabled="isProcess"
        >
          {{ $t(20) }}
        </button>
      </div>
    </GogoModal>
  </div>
</template>
<script>
import i18n from '@@/lang/mobile/review-index.json'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import title from '@@/../common/pages'
import Rate from '@/components/review/Rate.vue'
import ProductReview from '@/components/review/ProductReview.vue'
import SocialLinks from '@/components/review/SocialLinks.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import LoadMore from '@/components/common/LoadMore.vue'
import ReviewContainer from '@/components/review/ReviewContainer.vue'
import ReviewItem04 from '@/components/review/ReviewItem04.vue'
import ReviewItem05 from '@/components/review/ReviewItem05.vue'
import Cart from '@@/../components/icons/Cart.vue'
import ChevronRight from '@@/../components/icons/ChevronRight.vue'
import Pencil02 from '@@/../components/icons/Pencil02.vue'
import { filterInt } from '@/utils/client/common'
import GogoModal from "@@/../components/modals/GogoModal.vue"

const obj = Object.assign({
  i18n: {
    messages: i18n
  },
  validate({ params }) {
    return !isNaN(filterInt(params.id))
  },
  components: { 
    ImgWrapper,
    Rate,
    ProductReview,
    LazyComp01,
    LoadMore,
    SocialLinks,
    ReviewContainer,
    ReviewItem04,
    ReviewItem05,
    Cart,
    GogoModal,
    ChevronRight,
    Pencil02,
  },
  computed: {
    titleChunk() {
      return this.$t('15',{productName: this.productInfo.name})
    },
  },
  data() {
    return {
      cartProcesssing: false,
      showDeleteReview: false,
      isProcess: false,
      selectedReviewId: 0,
    }
  },
  methods: {
    onConfirmReview(reviewId) {
      this.selectedReviewId = reviewId
      this.showDeleteReview = true
    },
    async deleteReview() {
      try {
        this.isProcess = true

        // delete review
        let res = await this.GoGoHTTP.delete(`/api/v3/surface/review/myreview/${this.selectedReviewId}`)
        this.productInfo.reviewStars = (res || {}).star || 0
        this.productInfo.reviewCount = (res || {}).count || 0
        delete this.myReview.id

        // get new data
        this.reviewData = await this.GoGoHTTP.get(`/api/v3/surface/review/product/${this.params.id}?page=${this.params.p || 1}`)
      } catch (error) {
        console.error(error)
        $('#del-failed-text').css('display', 'block')
      } finally {
        this.showDeleteReview = false
        this.isProcess = false
      }
    },
    onLoadMore() {
      this.reviewData.currentPage += 1
      this.GoGoHTTP.get(
        `/api/v3/surface/review/product/${this.productInfo.id}`,
        { 
          params: { 
            page: this.reviewData.currentPage, 
            limit: this.reviewData.limit,
          } 
        }
      ).then(data => {
        this.reviewData.data = this.reviewData.data.concat(data.data || [])
      })
    },
    onSeeMore(url) {
      location.href = url
    },
    addToCart() {
      if (this.cartProcesssing) {
        return
      }
      this.cartProcesssing = true
      this.$store.dispatch('cart/addToCart', {
        productId: this.productInfo.cartInfo.productId,
        price: this.productInfo.cartInfo.price,
      })
    },
    descriptionTemplate() {
      return (this.productInfo.description || '').slice(0, 300)
    },
  },
  mounted() {
    let me = this,
      $cart_container = $(me.$refs.productInfo),
      offset =  $cart_container.offset().top + $cart_container.outerHeight() // offset top + height
    $(window).on('load scroll', function() {
      if ($(window).scrollTop() > offset) {
        $(me.$refs.cartFixed).fadeIn(300)
      } else {
        $(me.$refs.cartFixed).fadeOut(300)
      }
    })
  },
  async asyncData({ app, params, error }) {
    let [myReview, productInfo, reviewData, rankingEA, alsoBought] = await Promise.all([
      app.GoGoHTTP.get(`/api/v3/surface/review/myreview/${params.id}`),
      app.GoGoHTTP.get(`/api/v3/surface/review/product/${params.id}/info`),
      app.GoGoHTTP.get(`/api/v3/surface/review/product/${params.id}`,{ params: {page: params.p || 1 , limit: 10 } } ),
      app.GoGoHTTP.get('/api/v3/surface/review/highpost/systemtrade/3', { params: { limit: 5 }}),
      app.GoGoHTTP.get(`/api/v3/surface/review/${params.id}/also-bought`),
    ])

    if (!productInfo || !Object.keys(productInfo).length) {
      return error({ statusCode: 404 })
    }
    reviewData.limit = 10
    return {
      myReview,
      productInfo,
      reviewData,
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/review/detail/${params.id}`,
        },
      ],
      rankingEA: rankingEA.data || [],
      alsoBought,
      params,
    }
  },
}, title)

export default obj
</script>

<style lang="scss" scoped>
.rr-loadmore {
  width: fit-content;
  border-radius: 20px;
  border: solid 1px #2d2d2d;
  background-color: #fff;
  white-space: nowrap;
  padding: 0 8px;
  .icon-cls {
    width: 21px;
    height: 23px;
    margin: 0;
  }
}
/deep/ .modal-dialog {
  max-width: 80vw;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  padding-bottom: 180px;
  /deep/ .modal-header {
    background: #fff;
  }
  /deep/ .modal-footer {
    text-align: right;
  }
}
.review-title {
  background-color: #f3f0ef;
  color: #434343;
  font-size: 16px;
}
.product {
  .product-info {
    box-shadow: 0 0 5px rgba(4, 0, 0, 0.15);
    border-bottom: 1px solid #e0e0e0;
    .s-65 {
      width: 65px;
      height: 65px;
    }
    .info {
      width: calc(100% - 70px);
      /deep/ .gg-rating {
        font-size: 18px;
        .rate-num {
          padding-top: 6px;
        }
        .star-num {
          font-weight: bold;
        }
      }
      .name {
        font-weight: bold;
        margin-top: 3px;
        word-break: break-all;
        line-height: 1.1em;
      }
      .product-updated {
        color: #a0a0a0;
      }
    }
    .my-review {
      border-radius: 20px;
      border: solid 1px #aaa;
      min-width: 175px;
    }
  }
  .fixed-cart {
    box-shadow: 0 8px 10px -6px rgba(4, 0, 0, 0.4);
    background-color: #fff;
    padding: 5px 3%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    .s-40 {
      width: 40px;
      height: 40px;
    }
    .product-name-price {
      width: calc(100% - 205px);
    }
    .btn-orange {
      background-color: #ff8500;
      border-radius: 5px;
      border: none;
      color: #fff;
      flex: 0 0 160px;
      height: 35px;
      .icon-cls {
        width: 24px;
        height: 24px;
        margin-right: 0;
      }
    }
  }
}
.everyone-review {
  border-bottom: 1px solid #e0e0e0;
  /deep/ .gg-rating {
    font-size: 16px;
  }
}
.bottom-bg {
  background-color: #f3f0ef;
}
.load-more /deep/ {
  .icon-cls {
    width: 16px !important;
    height: 16px !important;
  }
}
</style>