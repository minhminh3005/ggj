<template>
  <div>
    <div class="rate-user">
      <div class="rate-info">
        <div v-if="user.showBuyer" class="rate-item">
          <div class="rate-title">
            {{ $t('44') }}
          </div>
          <div class="num">
            <div>{{ $t('45') }}</div>
            <span>{{ user.countRatingByBuyer }}</span>
          </div>
          <div class="start">
            <div>{{ $t('46') }}</div>
            <div class="flex rating-info">
              <rate :stars="Number(user.totalBuyerStar)" class="rating" :classes="'rate-star rate'" />
              <span>{{ user.totalBuyerStar }}</span>
            </div>
          </div>
        </div>
        <div v-if="user.showDeveloper" class="rate-item" :class="{'line': user.showBuyer}">
          <div class="rate-title">
            {{ $t('47') }}
          </div>
          <div class="num">
            <div>{{ $t('48') }}</div>
            <span>{{ user.countRatingBySeller }}</span>
          </div>
          <div class="start">
            <div>{{ $t('49') }}</div>
            <div class="flex rating-info">
              <rate :stars="Number(user.totalSellerStar)" class="rating" :classes="'rate-star rate'" />
              <span>{{ user.totalSellerStar }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showInput" class="rate-input">
        <div class="title-input"> {{ ($parent.profile.nickName || '') + $t('50') }}</div>
        <a href="">
          <i class="fa fa-chevron-down"></i>
        </a>
        <rate :stars="reviewData.stars" class="rating" :classes="'rate-star'" :is-hover="true" @input="onRate" />
        <textarea v-model="reviewData.content" class="rate-comment"></textarea>
        <div class="rate-button">
          <button v-if="rating.content !== '' || rating.star !== 0" class="cancel" @click="()=>{showInput = false}">
            {{ $t('67') }}
          </button>
          <button :disabled="reviewData.stars == 0 || reviewData.content == ''" class="submit" @click="submit">
            {{ $t('51') }}
          </button>
        </div>
      </div>
      <div v-if="!showInput && rating.star !== 0" class="list-comment">
        <div class="list-comment-item">
          <div class="item-title">
            {{ ($parent.profile.nickName || '') + $t('52') }}
          </div>
          <rate :stars="Number(rating.star)" class="rating" :classes="'rate-star view'" />
          <div class="item-content">
            {{ rating.content }}
          </div>
          <div class="actions">
            <span @click="editComment">{{ $t('53') }}</span>
            <span @click="showConfirmDelete" class="ml-10">{{ $t('54') }}</span>
          </div>
        </div>
      </div>
    </div>
    <ProductPanel v-if="speProducts.length" :show-more="false"
                  :products="speProducts" :id="id"
                  :title="$t(73)" :profit-title="$t(34)"
                  class="user-page"
    />
    <ProductPanel v-if="products.length" :show-more="products.length > 5"
                  :products="products" :id="id"
                  :title="$t(25)" :profit-title="$t(34)"
                  class="user-page"
    />
    <ProductPanel v-if="prProducts.length"
                  :products="prProducts" :id="id"
                  :title="$t(28)" :profit-title="$t(34)"
                  class="user-page"
    />
    <div v-if="traders.length" class="panel p-40 mb-20">
      <Title04 :title="$t(39)" class="mb-30" style="text-transform: uppercase;" />
      <TradeInfo
        v-for="(item, index) in traders"
        :key="index"
        :data="item"
        :num="index + 1"
        class="trade-info"
      />
      <LoadMore :href="`${id}/realtrade`" class="mt-20 loadmore" :text="$t(14)" />
    </div>
    <div v-if="reviews.length" class="panel p-40 mb-20">
      <Title04 :title="($parent.profile.nickName || '')+ $t(33) " class="mb-30" />
      <template v-if="reviews">
        <review :data="review" class="mb-20 pb-10" v-for="(review,index) in reviews.slice(0, 2)" :key="'userReview'+index" :classes="'width-item'" />
      </template>
      <template v-else>
        <div class="text-center pt-100">{{ $t(32) }}</div>
      </template>
      <LoadMore v-if="reviews.length > 2" :href="`/users/${id}/review?t=2`" class="mt-20 loadmore" :text="$t(14)" />
    </div>
    <div class="panel p-40 mb-20" v-if="$parent.articles.length">
      <Title04 :title="($parent.profile.nickName || '')+$t(75)" class="mb-30" />
      <UserArticle class="mt-40 mb-40" :data="item" v-for="(item, index) in $parent.articles" :key="'userArticle'+index" />
      <LoadMore :href="`/finance/navi/authors/${id}`" class="mt-20 loadmore" :text="$t(14)" />
    </div>
    <GogoModal :show="isShowModal" :height="'auto'" class="confirm-modal" @close="isShowModal = false">
      <div slot="modal-body" class="p-30 momo">
        {{ $t('55') }}
      </div>
      <div slot="modal-footer" class="btn-wrapp flex mid center modal-footer flex-wrap">
        <button class="btn-simple btn-cancel" @click="onClose">
          {{ $t('56') }}
        </button>
        <button
          class="btn-submit"
          @click="onSubmit"
          :class="{ 'btn-loading': loading }"
        >
          {{ $t('57') }}
        </button>
      </div>
    </GogoModal>
    <GogoModal :show="confirmDelete" :height="'auto'" class="confirm-modal" @close="confirmDelete = false">
      <div slot="modal-body" class="p-30 momo">
        {{ $t('58') }}
      </div>
      <div slot="modal-footer" class="btn-wrapp flex mid center modal-footer flex-wrap">
        <button class="btn-simple btn-cancel" @click="()=>{confirmDelete= false}">
          {{ $t('56') }}
        </button>
        <button
          class="btn-submit"
          @click="deleteComment"
          :class="{ 'btn-loading': loading }"
        >
          {{ $t('59') }}
        </button>
      </div>
    </GogoModal>
    <Loading v-if="loading" />
  </div>
</template>

<script>
import { getPrProduct } from '@/js/users'
import ProductPanel from '@/components/user/ProductPanel.vue'
import TradeInfo from '@/components/user/TradeInfo.vue'
import Review from '@/components/user/Review.vue'
import i18n from '@@/lang/desktop/users-id.json'
import Title04 from '@/components/review/Title04.vue'
import LoadMore from '@/components/user/LoadMore.vue'
import Rate from '@/components/user/Rate.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import Loading from '@@/../components/icons/Loading.vue'
import UserArticle from '@/components/user/UserArticle.vue'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Rate,
    Loading,
    GogoModal,
    ProductPanel,
    Title04,
    Review,
    LoadMore,
    TradeInfo,
    UserArticle,
  },
  data() {
    return {
      isShowModal: false,
      loading: false,
      confirmDelete: false
    }
  },
  async asyncData({ app, params }) {
    let id = params.id,
        [products, result, reviews, prProducts, user] = await Promise.all([
        app.GoGoHTTP.get(
          `/api/v3/surface/profile/${id}/product`
        ),
        app.GoGoHTTP.get(`/api/v3/surface/profile/${id}/realtrade?limit=3`),
        app.GoGoHTTP.get(`/api/v3/surface/profile/${id}/review?limit=3&type=2`),
        getPrProduct(app),
        app.GoGoHTTP.get(`/api/v3/surface/profile/${id}/showRating`),
      ]),
      onSales = (products.onSales || []).slice(0, 6),
      showInput = (user.canRating && user.rating.content == null && user.rating.star == null) || false,
      reviewData = {
        stars: 0,
        content: ''
      },
      rating = {
        star: 0,
        content: ''
      }
      if(user && user.rating) {
        reviewData = {
          stars: user.rating.star || 0,
          content: user.rating.content || ''
        },
        rating = {
          star: user.rating.star || 0,
          content: user.rating.content || ''
        }
      }
    return {
      id,
      products: onSales,
      traders: result.data || [],
      reviews,
      prProducts: !onSales.length && !reviews.length ? prProducts : [],
      user,
      rating,
      showInput,
      reviewData,
      speProducts : products.special || []
    }
  },
  methods: {
    submit() {
      this.isShowModal = true
    },
    showConfirmDelete() {
      this.confirmDelete = true
    },
    onClose() {
      this.isShowModal = false
    },
    closeConfirmModal() {
      this.showInput = false
      this.isShowModal = false
    },
    async getUserInfo() {
      let user = await this.GoGoHTTP.get(`/api/v3/surface/profile/${this.id}/showRating`)
      if(user) {
        this.user = user,
        this.rating = {
          star: user.rating.star || 0,
          content: user.rating.content || ''
        }
      }
    },
    onSubmit() {
      this.loading = true
      let isCreate = this.rating.star == 0 && this.rating.content == '' ? true : false
      if(this.reviewData.stars !== this.rating.star || this.reviewData.content !== this.rating.content) {
        this.GoGoHTTP.post(
          `/api/v3/surface/profile/${this.id}/${isCreate ? 'postRating' : 'editRating'}`,
          this.reviewData
        )
          .then(() => {
            this.getUserInfo()
          })
          .finally(() => {
            this.closeConfirmModal()
            this.loading = false
          })
      }else {
        this.closeConfirmModal()
        this.loading = false
      }
    },
    editComment() {
      this.showInput = true
    },
    deleteComment() {
      this.confirmDelete = false
      this.loading = true
      this.GoGoHTTP.delete(
        `/api/v3/surface/profile/${this.id}/deleteRating`
      )
      .then(() => {
        this.getUserInfo()
        this.loading = false
        this.showInput = true
        this.reviewData = {
          stars: 0,
          content: ''
        }
      })
    },
    onRate(i) {
      this.reviewData.stars = i
    }
  }
}
</script>
<style lang="scss" scoped>
.title /deep/ {
  border-bottom: 1px solid #f2677d !important;
}
a {
  &.loadmore /deep/ {
    color: #f2677d;
    border: 2px solid #f2677d;
  }
}
.rate-user {
  background: white;
  border: solid 1px #e0e0e0;
  border-radius: 4px;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.rate-info {
  display: flex;
  .rate-item {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 15px;
    padding-right: 15px;
    .rate-title {
      font-size: 14px;
      color: #000;
      background: #e6e6e6;
      border-radius: 4px;
      padding: 5px 20px;
    }
    .num {
      text-align: center;
      > div {
        font-size: 12px;
      }
      span {
        font-size: 14px;
      }
    }
    .start {
      text-align: center;
      > div {
        font-size: 12px;
        align-items: center;
      }
    }
    &.line {
      padding-left: 15px;
      border-left: 1px solid #a5a5a5;
    }
  }
}
.rate-input {
  padding: 30px;
  .title-input {
    color: #333;
    font-size: 15px;
    font-weight: bold;
  }
}
.rate-button {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  button {
    transition: all 0.4s ease;
    &.cancel {
      border-radius: 5px;
      padding: 10px 40px;
      border: none;
      color: #333;
      font-size: 14px;
      background: none;
      margin-right: 5px;
      &:hover {
        background: #efefef;
      }
    }
    &.submit {
      border-radius: 5px;
      background: #f2677d;
      padding: 10px 40px;
      border: none;
      color: white;
      font-size: 14px;
      &:disabled {
        background: #f39eab;
        &:hover {
          background: #f39eab;
        }
      }
      &:hover {
        background: #de6175;
      }
    }
  }
}
.loadmore {
  a {
    color: #f2677d;
    border: 2px solid #f2677d;
  }
}
.add-msg {
  background: #f2677d;
}
textarea {
  resize: none;
  &.rate-comment {
    margin-top: 10px;
    width: 100%;
    height: 100px;
    border: solid 1px #dadada;
    padding: 15px;
  }
}
button, textarea {
  &:focus, &:hover {
    outline: none;
  }
}
.confirm-modal /deep/ {
  .modal-dialog {
    margin: 15% auto;
  }
  .modal-header {
    border-bottom: solid 1px #dadada;
    background: none;
  }
  .momo {
    color: #4c4c4c;
    font-size: 20px;
    text-align: center;
  }
  .modal-footer {
    background: none;
    border-top: none;
    display: flex;
    justify-content: space-between;
    height: auto;
    padding-bottom: 50px;
    button {
      font-size: 17px;
      padding: 10px 70px;
      border: none;
      border-radius: 5px;
    }
    .btn-cancel {
      color: #333;
      background: #dadada;
    }
    .btn-submit {
      color: #fff;
      background: #00a0e9;
    }
  }
}
.list-comment {
  padding: 30px;
  .list-comment-item {
    .item-title {
      font-size: 15px;
      color: #333;
      font-weight: bold;
    }
    .item-content {
      font-size: 15px;
      color: #333;
      white-space: pre-line;
    }
    .actions {
      margin-top: 10px;
      span {
        color: #337ab7;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
}
.loader {
  position: absolute;
  top: 0;
  right: 50%;
  &::before {
    border-top: 3px solid #f2677d !important;
  }
}
</style>
