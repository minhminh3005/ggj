<template>
  <div class="wrapper-review pt-5" id="wrapper-review-detail">
    <!-- 1. SEARCH & SORT -->
    <div class="wrapper-search flex flex-wrap">
      <div class="search-block-left">
        <div style="height: 34px;" class="flex mid">{{ $t(32) }}</div>
      </div>
      <div class="search-block-right flex flex-wrap mid space-between">
        <div class="col-xs-12 col-sm-7 p-0 flex mid search-bar">
          <div class="desktop-ui pos-rel">
            <input 
              type="text" 
              class="w-full h-full wrap-text input-search" 
              v-model="searchText"
              maxlength="500"
              @keyup.enter="onSearch"
            />
            <button 
              @click="onSearch"
              class="button-search pos-abs"
            >
              <span class="glyphicon glyphicon-search"></span>
            </button>
          </div>
        </div>
        <div class="col-xs-12 col-sm-5 p-0 list-sort">
          <SelectBox
            style="width: 100%;"
            :selected="sortType"
            @input="changeSortId"
            :data-source="sortList"
            :id-val="'id'"
            :display="'name'"
          />
        </div>
      </div>
    </div>
    <template v-if="loading">
      <Loading />
    </template>
    <!-- 2. REVIEW LIST -->
    <div v-if="((reviewData || {}).data || []).length > 0" class="wrapper-list">
      <div
        class="wrapper-item w-full"
        v-for="(review,index) in reviewData.data"
        :key="'a4hAd'+index"
        min-height="105px"
        :id="`user-review-${(review.reviewUser || {}).id}`"
      >
        <div class="repview-left divs pt-15 pl-15 pr-40">
          <a target="_blank" class="flex layout-col" :href="'/users/'+ review.reviewUser.id +'/review?t=2&s=0'" v-if="review.reviewUser">
            <img class="img-user" :src="`/img/users/${review.reviewUser.id}/small`" alt="" width="50" height="50" />
            <span class="username mt-5">{{ review.reviewUser.nickName }}</span>
          </a>
        </div>
        <div class="repview-right divs">
          <a target="_blank" class="mb-user-review flex mid" :href="`/users/${review.reviewUser.id}/review?t=2&s=0`" v-if="review.reviewUser">
            <img class="img-user mb-10" :src="`/img/users/${review.reviewUser.id}/small`" alt="" width="50" height="50" />
            <span class="username ml-10">{{ review.reviewUser.nickName }}</span>
          </a>
          <template v-if="review.reviewUser.id != userId || !isEditReview">
            <div class="wrapper-res">
              <span class="review-title">{{ review.title }}</span>
              <span class="at">{{ formatTime((review.publishedAt) * 1000, 6, 1) }}</span>
            </div>
            <ReviewRate
              class="rating no-cursor mt-5 mb-15"
              :alway-show="true" 
              :stars="review.reviewStars" :target="review.id" 
              :stars-only="true"
            />
            <p v-html="review.content" class="review-content"></p>
          </template>
          <template v-else>
            <input
              type="text"
              style="padding: 8px 15px;"
              :placeholder="$t(47)"
              class="w-full textarea"
              v-model="review.title" 
            />
            <div class="text-danger mt-5" v-show="!review.title">{{ $t(39) }}</div>
            <StarInput v-model="review.reviewStars" class="mt-5 mb-15" />
            <div class="text-danger mt-5" v-show="!review.reviewStars">{{ $t(39) }}</div>
            <textarea 
              name="review_content" 
              class="textarea pl-15 pr-15 pt-10 pb-10 mb-10" v-model="review.content" rows="6"
              :placeholder="$t(48)"
              maxlength="1000"
              v-validate="{
                rules:{
                  required: true,
                }
              }"
            ></textarea>
            <div class="flex space-between">
              <div>
                <span class="text-danger" v-show="!review.content">{{ $t(39) }}</span>
              </div>
              <div class="text-right">{{ review.content.length }}/1000</div>
            </div>
          </template>
          <div class="flex space-between mid">
            <div
              @click="debounceHandleLike(1, review)"
              class="flex mid"
            >
              <ThumbsUp :class="[review.isLiked ? 'thumsup-active' : 'thumsup']" />
              <span>{{ review.likeCount }}</span>
            </div>
            <div v-if="review.reviewUser.id == userId">
              <template v-if="!isEditReview">
                <span class="btn-edit mr-5" @click="openEditMyReview(review)">{{ $t(41) }}</span>
                <span class="btn-delete" @click="confirmDeleteMyReview(index)">{{ $t(40) }}</span>
              </template>
              <template v-else>
                <span class="btn-edit mr-5" @click="closeEditMyReview(review, index)">{{ $t(37) }}</span>
                <span class="btn-edit" @click="submitMyReview(review)">{{ $t(36) }}</span>
              </template>
            </div>
          </div>
          <!-- 3. REPLY OF DEVELOPER -->
          <div v-if="isShowReplyBlock(review)" class="panel panel-reply mt-15">
            <div class="wrapper-res mb-15">
              <a target="_blank" :href="`/users/${product.userId}/review?t=2&s=0`">
                <img class="img-user" :src="`/img/users/${product.userId}/small`" alt="" width="50" height="50" />
                <span class="ml-10 username">{{ product.nickname }}</span>
              </a>
              <span class="at mt-10">{{ formatTime((review.replyPublishedAt) * 1000, 6, 1) }}</span>
            </div>
            <!-- 3.1 UI show reply -->
            <template v-if="!isEdit || selectedId !== review.id">
              <ReviewRate
                class="rating no-cursor mb-15" 
                :alway-show="true" 
                :stars="review.replyReviewStars"
                :target="review.id"
                :stars-only="true"
              />
              <p class="reply-content">
                {{ review.replyContent }}
              </p>
            </template>
            <!-- 3.2 UI edit reply -->
            <template v-if="isEdit && selectedId === review.id">
              <p class="edit-title mb-0">{{ $t(34) }}</p>
              <div class="review-rate flex mb-15">
                <div class="rate-star flex row-reverse">
                  <span class="star cursor-pointer" v-for="i in 5" :key="'rate' + i" :class="check(i, review)" @click="onRate(i, review)"></span>
                </div>
                <input type="hidden" name="star" v-model="review.reviewStars" />
              </div>
              <div class="text-danger" v-if="isNotRating">
                {{ $t(38) }}
              </div>
              <p class="edit-title">{{ $t(35) }}</p>
              <textarea 
                name="reply" 
                class="textarea pl-15 pr-15 pt-10 pb-10 mb-10" v-model="review.replyContent" rows="6"
                maxlength="500"
                v-validate="{
                  rules:{
                    required: true,
                  }
                }"
              >
              </textarea>
              <div class="mt-5 mb-5" v-show="errors.has('reply')">
                <span class="text-danger" v-show="errors.firstByRule('reply', 'required')">
                  {{ $t(39) }}
                </span>
              </div>
            </template>
            <div class="flex space-between mid">
              <div @click="debounceHandleLike(2, review)" class="flex mid">
                <ThumbsUp :class="[review.isLikedReply ? 'thumsup-active' : 'thumsup']" />
                <span class="at">{{ review.replyLikeCount }}</span>
              </div>
              <!-- product.userId === userId : only owner of product can use edit & delete feature reply-->
              <div v-if="product.userId == userId && (!isEdit || selectedId !== review.id)">
                <span class="btn-edit mr-5" @click="showEdit(review)">
                  {{ $t(41) }}
                </span>
                <span class="btn-delete" @click="confirmDelete(review)">
                  {{ $t(40) }}
                </span>
              </div>
              <div v-if="isEdit && selectedId === review.id">
                <span @click="removeEdit(review)" class="btn-edit mr-5">
                  {{ $t(37) }}
                </span>
                <span @click="saveEdit(review)" class="btn-edit">
                  {{ $t(36) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!loading && (!reviewData || (((reviewData || {}).data || []).length == 0))" class="text-center no-data">
      {{ $t(45) }}
    </div>
    <!-- 4. PAGINATION-->
    <div class="text-center mt-20 mb-10">
      <paging :cur-page="page"
              :total="reviewData.lastPage"
              :from="reviewData.pagingFrom"
              :to="reviewData.pagingTo"
              :has-scroll="true"
              @pagingclick="onChangePage"
      />
    </div>
    <!-- 5. MODAL -->
    <GogoModal
      :show="isShowModal"
      @update:show="val => (isShowModal = val)"
      :width="300"
      :height="220"
      @close="isShowModal = false"
    >
      <div class="modal-header" slot="modal-header">
        <span @click="isShowModal = false" style="font-weight: 800; cursor: pointer;">X</span>
      </div>
      <!-- 5.1 modal success reply -->
      <template v-if="isReplySuccess">
        <div class="modal-body" slot="modal-body">
          <p class="text-primary text-success">{{ $t(43) }}</p>
          <p>{{ $t(44) }}</p>
        </div>
        <div class="modal-footer" slot="modal-footer">
          <button @click="isShowModal = false" class="btn btn-primary">OK</button>
        </div>
      </template>
      <!-- 5.2 modal confirm delete -->
      <template v-if="!isReplySuccess">
        <div class="modal-body" slot="modal-body">
          <p>{{ $t(42) }}</p>
        </div>
        <div class="modal-footer" slot="modal-footer">
          <button @click="deleteReply" class="btn btn-danger">{{ $t(40) }}</button>
          <button @click="isShowModal = false" class="btn btn-default">{{ $t(37) }}</button>
        </div>
      </template>
    </GogoModal>
    <!-- modal delete my review -->
    <GogoModal
      :show="isConfirmDeleteReview"
      @update:show="val => (isConfirmDeleteReview = val)"
      :width="300"
      :height="220"
      @close="isConfirmDeleteReview = false"
    >
      <div class="modal-header" slot="modal-header">
        <span @click="isConfirmDeleteReview = false" style="font-weight: 800; cursor: pointer;" v-if="!isDeleteMyReviewPosting">X</span>
      </div>
      <template>
        <div class="modal-body" slot="modal-body">
          <p>{{ $t(49) }}</p>
        </div>
        <div class="modal-footer delete-modal pos-rel" slot="modal-footer">
          <button @click="deleteMyReview" class="btn btn-danger">{{ $t(40) }}</button>
          <button @click="isConfirmDeleteReview = false" class="btn btn-default">{{ $t(37) }}</button>
          <Loading v-if="isDeleteMyReviewPosting" />
        </div>
      </template>
    </GogoModal>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/review-index-new.json'
import SelectBox from '@@/../components/form/SelectBox.vue'
import ThumbsUp from '@@/../components/icons/ThumbsUp.vue'
import ReviewRate from '@/components/user/Rate.vue'
import Paging from '@@/../components/paging/Paging.vue'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import Loading from '@@/../components/icons/Loading.vue'
import StarInput from './StarInput.vue'
import { gotoLogin } from '@/utils/client/common'

if (process.browser) {
  Vue.use(VeeValidate, {
    inject: true,
    events: 'none',
  })
}

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    SelectBox,
    ReviewRate,
    ThumbsUp,
    Paging,
    GogoModal,
    Loading,
    StarInput,
  },
  data() {
    return {
      loading: false,
      deletedReview: {}, 
      isReplySuccess: true,
      isShowModal: false,
      isNotRating: false,
      selectedId: 0,
      isEdit: false, 
      starBackup: 0,
      contentBackup: '',
      contentReply: '',
      reviewData: {},
      sortList: [
        {
          id: 1,
          name: this.$t('sort-type-1')
        },
        {
          id: 2,
          name: this.$t('sort-type-2')
        },
        {
          id: 3,
          name: this.$t('sort-type-3')
        },
        {
          id: 4,
          name: this.$t('sort-type-4')
        },
      ],
      // params search
      searchText: this.$route.query.keyword || '',
      sortType: +this.$route.query.sortType || 1,
      page:  +this.$route.query.page || 1,
      debounceHandleLike: this.debounce(this.handleLike, 5e2),
      // backup content for review
      titleReviewBackup: '',
      contentReviewBackup: '',
      starReviewBackup: '',
      isEditReview: false, // using for toggle review edit mode
      isConfirmDeleteReview: false, // open/close modal delete my review
      myReviewPosition: null, //
      isDeleteMyReviewPosting: false, // show/hide loading
    }
  },
  computed: {
    userId() {
      return this.$store.state.user.id
    },
    product() {
      return this.$store.state['review-detail'].productInfo
    },
  },
  mounted() {
    this.getReviewList(this.page, false)
    this.$nuxt.$on('onSubmitReviewSuccess', this.getReviewList)
    this.$nuxt.$on('jumpToMyReview', this.jumpToMyReview)
  },
  beforeDestroy() {
    this.$nuxt.$off('onSubmitReviewSuccess')
  },
  methods: {
    openEditMyReview(review) {
      this.titleReviewBackup = review.title
      this.contentReviewBackup = review.content
      this.starReviewBackup = review.reviewStars
      this.isEditReview = true
    },
    closeEditMyReview(review, index) {
      this.$set(this.reviewData.data, index, {
        ...review,
        title: this.titleReviewBackup,
        content: this.contentReviewBackup,
        reviewStars: this.starReviewBackup,
      })
      this.isEditReview = false
    },
    async submitMyReview(review) {
      if(!review.reviewStars || !review.title || !review.content) {
        return
      }
      await this.GoGoHTTP.post(`/api/v3/surface/review/myreview/${this.product.id}`, {
        reviewStars: review.reviewStars,
        reviewTitle: review.title,
        reviewContent: review.content,
      })
      this.isEditReview = false
    },
    async confirmDeleteMyReview(index) {
      this.myReviewPosition = index
      this.isConfirmDeleteReview = true
    },
    async deleteMyReview() {
      if(this.myReviewPosition === null)  {
        return
      }
      this.isDeleteMyReviewPosting = true
      const myReview = this.reviewData.data[this.myReviewPosition]
      this.GoGoHTTP.delete(`/api/v3/surface/review/myreview/${myReview.id}`).then(async () => {
        // process after deleted
        this.$nuxt.$emit('deleteMyReview')
        this.$store.commit(
          'review-detail/productInfo',
          {
            ...this.product,
            reviewCount: this.product.reviewCount - 1 || 0
          }
        )
        this.reviewData.data.splice(this.myReviewPosition, 1)
        this.isConfirmDeleteReview = false
        this.isDeleteMyReviewPosting = false
      })
    },
    changeQuery(query) {
      if (history.replaceState) {
        let params = new URLSearchParams(location.search)
        Object.keys(query).forEach(key => {
          params.set(key, query[key])
        })
        let newUrl = location.protocol + "//" + location.host + location.pathname + '?' + params.toString()
        history.replaceState({path:newUrl},'',newUrl)
      }
    },
    isShowReplyBlock(review) {
      if(this.isEdit && this.selectedId === review.id) {
        return review.isReply
      }
      return review.replyContent && review.isReply
    },
    async jumpToMyReview() {
      const jumFn = () => {
        let el = $(`#user-review-${this.userId}`),
          offset = el.offset()
        if(el && offset && offset.top) {
          $('html, body').animate({ scrollTop: offset.top - 100 }, 'slow')
          el.addClass('active')
          setTimeout(() => el.removeClass('active'), 8e3 /*8s*/)
        }
      }
      if(((this.reviewData || {}).data || []).find(i => i.reviewUser.id == this.userId)) {
        jumFn()
      } else {
        this.loading = true
        this.reviewData = {}
        this.searchText = ''

        // 
        try {
          this.reviewData = await this.GoGoHTTP.get(
            `/api/v3/surface/review/v2/product/${this.$route.params.id}`,
            { params: { includeOwned: 1, sortType: this.sortType } }
          )
          this.page = this.reviewData.currentPage
          this.$nextTick(jumFn)
          this.changeQuery({ page: this.page })
        } catch(e) {
          console.log(e)
        } finally {
          this.loading = false
        }
      }
      // 
    },
    onRate(star, review) {
      review.replyReviewStars = 5 - star + 1
    },
    check(i, review) {
      let reviewStars = this.reviewStars || review.replyReviewStars,
        a = i + reviewStars,
        b = i + parseInt(reviewStars)
      if (a > 5) {
        return b === 5 ? { half: true } : { full: true }
      }
    },
    beforeShowEdit() {
      // revert old item content before swicth to new
      if(((this.reviewData || {}).data || []).length) {
        for(let i = 0; i < this.reviewData.data.length; i++) {
          let item = this.reviewData.data[i]
          if(item.id === this.selectedId) {
            item.replyContent = this.contentBackup
            item.replyReviewStars = this.starBackup
            this.$set(this.reviewData.data, i, item)
            break
          }
        }
      }
    },
    showEdit(review) {
      this.beforeShowEdit()
      this.selectedId = review.id
      this.isEdit = true
      this.starBackup = review.replyReviewStars
      this.contentBackup = review.replyContent
    },
    removeEdit(review) {
      this.selectedId = review.id
      review.replyReviewStars = this.starBackup
      review.replyContent = this.contentBackup
      this.isEdit = false
    },
    onSearch() {
      this.getReviewList()
    },
    changeSortId(sortType) {
      this.sortType = sortType
      this.getReviewList()
    },
    onChangePage(page) {
      this.getReviewList(page)
    },
    async getReviewList(page = 1, isScroll = true) {
      this.loading = true
      this.reviewData = {}
      this.page = page
      let params = {
        keyword: this.searchText.trim(),
        sortType: this.sortType,
        page: this.page,
      }
      try {
        this.reviewData = await this.GoGoHTTP.get(
          `/api/v3/surface/review/v2/product/${this.$route.params.id}`,
          { params }
        )
        this.changeQuery(params)
        this.$nextTick(() => {
          const el = $('#wrapper-review-detail').offset()
          if(el) {
            let offset = el.top
            isScroll && $('html, body').animate({ scrollTop: offset - 30 })
          }
        })
      } catch(e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    confirmDelete(review) {
      this.isShowModal = true
      this.isReplySuccess = false
      this.deletedReview = review
    },
    async deleteReply() {
      try {
        let data = await this.GoGoHTTP.delete(`/api/v3/mypage/reviews/reply/${this.deletedReview.id}`)
        if(data) {
          this.isShowModal = false
          this.getReviewList()
        }
      } catch(e) {
        console.log(e)
      }
    },
    async saveEdit(review) {
      this.isNotRating = review.replyReviewStars ? false : true
      if(!await this.$validator.validateAll() || this.isNotRating) {
        return
      }
      this.loading = true
      let params = {
        content: review.replyContent,
        star: review.replyReviewStars,
      }
      try {
        let data = await this.GoGoHTTP.post(`/api/v3/mypage/reviews/reply/${review.id}`, params)
        if(data) {
          this.isNotRating = false
          this.isEdit = false
          this.isShowModal = true
          this.isReplySuccess = true
          this.loading = false
        }
      } catch(e) {
        this.loading = false
        console.log(e)
      }
    },
    handleLike(likeType, review) {
      // NOTE: likeType: (1|2), review: <Object>
      // check user logged in
      if(!this.userId) {
        gotoLogin(`u=${location.pathname}`)
        return
      }
      // type 1, like for the review
      if(likeType === 1) {
        const newStatus = review.isLiked === 1 ? 0 : 1
        const params = {
          likeStatus: newStatus,
          isReply: 0,
        }
        this.GoGoHTTP.post(`/api/v3/surface/review/${review.id}/like`, params).then(() => {
          review.isLiked = newStatus
          review.likeCount += review.isLiked ? 1 : -1
        }).catch((e) => console.error(e))
      }
      // type 2, like for the reply
      else if(likeType === 2) {
        const newStatus = review.isLikedReply === 1 ? 0 : 1
        const params = {
          likeStatus: newStatus,
          isReply: 1,
        }
        this.GoGoHTTP.post(`/api/v3/surface/review/${review.id}/like`, params).then(() => {
          review.isLikedReply = newStatus
          review.replyLikeCount += review.isLikedReply ? 1 : -1
        }).catch((e) => console.error(e))
      }
    },
  }
}
</script>

<style lang="less" scoped>
.wrapper-review {
  @media screen and (min-width: @screen-md) {
    padding: 0;
  }
}
.desktop-ui {
  width: 100%;
  height: 34px;
  opacity: 1;
  overflow: hidden;
}
.input-search {
  padding: 0 32px 0 12px;
  border: 1px solid #aaa;
  border-radius: 4px;
  color: #5a5a5a;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  // width: 200px;
  // @media screen and (min-width: @screen-xs) {
  //   width: 300px;
  // }
  // @media screen and (min-width: @screen-md) {
  //   width: 578px;
  // }
}
.input-search:focus {
  border: 1px solid #1ab6cf;
  box-shadow: 0 0 2px 2px #9ce5f0;
}
.button-search {
  border: none;
  background: none;
  color: #5a5a5a;
  position: absolute;
  right: 0;
  top: 1px;
  height: 34px;
  width: 34px;
}
.glyphicon {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: normal;
  line-height: 1;
  left: -25px;
}
.glyphicon:hover {
  opacity: 0.8;
}
.wrapper-search {
  background: #e9e9e9;
  padding: 12px 15px;
  // display: flex;
  // flex-direction: column;
  margin-bottom: 20px;
  @media only screen and (min-width: @screen-sm) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  span {
    color: #7d7d7d;
    font-size: 13px;
    width: 70px;
  }
  @w: 100px;
  .search-block-left {
    width: @w;
  }
  .search-block-right {
    width: calc(100% - @w);
    .search-bar {
      margin-bottom: 6px;
      @media only screen and (min-width: @screen-sm) {
        margin-bottom: 0;
      }
    }
  }
}
.list-sort {
  @media only screen and (min-width: @screen-sm) {
    max-width: 253px;
  }
  /deep/ button {
    background: #fff !important;
    color: #333 !important;
    width: 100%;
  }
}
.types {
  font-size: 10px;
  color: #2d2d2d;
  border-radius: 3px;
  border: solid 1px #d9d9d9;
  width: fit-content;
  padding: 1px 5px;
  display: inline-block;
}
.wrapper-list {
  min-height: 200px;
}
.wrapper-item {
  // display: flex;
  justify-content: flex-start;
  align-items: start;
  color: #333;
  padding-top: 30px;
  border-bottom: 1px solid #e2e2e2;
  display: table;
  transition: box-shadow 1s;
  @media only screen and (min-width: @screen-sm) {
    padding-bottom: 30px;
  }
  &.active {
    box-shadow: 0 0 70px 0 inset #f8ffc9;
  }
}
.divs {
  @media only screen and (min-width: @screen-sm) {
    display: table-cell !important;
  }
}
.repview-left {
  display: none;
  @media only screen and (min-width: @screen-sm) {
    display: block;
    width: 140px;
    background: #f8f8f8;
    flex: 1;
    a {
      justify-content: flex-start;
    }
  }
}
.mb-user-review {
  @media only screen and (min-width: @screen-sm) {
    display: none;
  }
}
.repview-right {
  flex: 9;
  padding-bottom: 20px;
  vertical-align: top;
  @media only screen and (min-width: @screen-sm) {
    padding-left: 20px;
    padding-bottom: 0;
  }
}
.wrapper-res {
  display: flex;
  flex-direction: column;
  @media only screen and (min-width: @screen-sm) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
.review-title {
  font-size: 17px;
  font-weight: bold;
  margin-top: 10px;
  @media only screen and (min-width: @screen-sm) {
    margin-top: 0;
  }
}
.at {
  color: #888;
  @media only screen and (min-width: @screen-sm) {
    margin-top: 0;
  }
}
/deep/ .star {
  margin-right: 4px;
  font-size: 22px;
}
/deep/ .full {
  color: #fcd605;
}
.no-cursor {
  cursor: default;
}
.rating {
  /deep/ .star {
    cursor: default;
  }
}
.thumsup {
  margin-right: 3px;
  color: #888;
}
.thumsup-active {
  margin-right: 3px;
  color: #418dd0;
}
/deep/ i.icon-cls {
  width: 20px;
  height: 25px;
  cursor: pointer;
  :hover {
    color: #418dd0;
    opacity: 0.8;
  }
}
.panel-reply {
  background: #f8fef8 0% 0% no-repeat padding-box;
  border: 1px solid #8bd48b;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 15px;
  @media only screen and (min-width: @screen-sm) {
    margin-bottom: 0;
  }
}
.btn-edit {
  text-decoration: underline;
  color: #337ab7;
  font-size: 13px;
  cursor: pointer;
}
.btn-delete {
  text-decoration: underline;
  color: #ec5665;
  font-size: 13px;
  cursor: pointer;
}
.reply-content {
  font-size: 13px;
  color: #888;
  white-space: pre-line;
}
.edit-title {
  font-weight: bold;
  color: #17a2b8;
  font-size: 16px;
}
.textarea {
  width: 100%;
  border: 1px solid #c1c1c1;
  resize: vertical;
  &:focus-visible {
    outline: none;
    border: 1px solid #1ab6cf;
    box-shadow: 0 0 2px 2px #9ce5f0;
  }
}
/deep/ .modal {
  max-width: 100%;
}
/deep/ .modal-content {
  top: 25%;
  border-radius: 6px;
  width: 300px;
  height: 220px;
  margin: 0 auto;
  @media only screen and (min-width: @screen-sm) {
    width: 350;
  }
}
.modal-header {
  display: flex;
  justify-content: flex-end;
  vertical-align: middle;
  background: #efefef;
  height: 50px;
}
.modal-body {
  height: 120px;
  .text-success {
    font-size: 15px;
    color: #17a2b8;
  }
}
.modal-footer {
  height: 50px;
  background: #fff;
  border-top: 1px solid #bbb;
  button:focus {
    outline: none;
  }
}
.username {
  word-break: break-word;
  color: #333;
}
.img-user {
  box-shadow: 1px 1px 4px #00000029;
}
/deep/ .loader {
  min-height: 250px;
}
.no-data {
  color: #b8b8b8;
  margin-top: 65px;
  margin-bottom: 150px;
  font-size: 20px;
}
.review-content {
  white-space: pre-wrap;
}
.delete-modal /deep/ .loader {
  height: 50px;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  background: #fff;
  display: flex;
  opacity: 0.9;
  min-height: 100%;
  &::before {
    width: 20px;
    height: 20px;
    left: calc(50% - 10px);
    top: calc(50% - 10px);
  }
}
</style>
