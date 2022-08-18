<template>
  <div class="review-form" v-if="$store.state.user.id && review.isPurchased">
    <div class="flex mid review-title-label" v-if="review.id && review.isReply" @click="jumpToMyReview">
      <Pencil class="mr-10" style="height: 30px; width: 30px; transform: translateY(-2px); color: #ec5665;" />
      <strong style="font-size: 18px;">{{ $t(1) }}</strong>
    </div>
    <div class="flex mid review-title-label no-hover" v-if="review.id && !review.isReply">
      <strong style="font-size: 18px;">{{ $t('review-is-being-approved') }}</strong>
    </div>
    <template v-else-if="!review.id">
      <!-- title -->
      <div class="w-full flex mid mb-20" style="color: #333;">
        <Pencil class="mr-10" style="height: 30px; width: 30px; transform: translateY(-2px);" />
        <strong style="font-size: 23px;" class="m-0">{{ $t(2) }}</strong>
      </div>
      <div class="pl-50 pr-50">
        <!-- star -->
        <div class="w-full mb-10">
          <!-- <Rate/> -->
          <div class="review-rate flex">
            <div class="rate-star flex row-reverse" :class="{ disabled: posting }">
              <span class="star cursor-pointer" v-for="i in 5" :key="'rate' + i" @click="onRate(i)" :class="check(i)" @mouseover="onMouseOver(i)" @mouseout="onMouseOut(i)"></span>
            </div>
            <input type="hidden" name="star" v-model="review.reviewStars" v-validate="{ rules: { required: true, min_value: 1, max_value: 5 } }" />
          </div>
        </div>
        <div style="color: #e5455d;" class="mb-5"><template v-if="isClient && errors.has('star')">{{ $t('error-star') }}</template> </div>
        <!-- title input -->
        <div class="w-full mb-15">
          <input
            class="w-full"
            name="title"
            v-model="review.reviewTitle"
            :placeholder="$t(3)"
            v-validate="{ rules: { required: true } }"
            :disabled="posting"
          />
        </div>
        <div style="color: #e5455d;" class="mb-5"><template v-if="isClient && errors.has('title')">{{ $t('error-title-required') }}</template> </div>
        <!-- content input -->
        <div class="w-full">
          <textarea
            name="des"
            class="w-full"
            :placeholder="$t(4)"
            v-model="review.reviewContent"
            maxlength="1000"
            v-validate="{ rules: { required: true } }"
            :disabled="posting"
          ></textarea>
          <div class="flex space-between">
            <div style="color: #e5455d;" class="mb-5">
              <template v-if="isClient && errors.has('des')">
                {{ $t('error-content-required') }}
                <!-- {{ $t('error-content-max-length') }} -->
              </template>
            </div>
            <div class="text-right">{{ review.reviewContent.length }}/1000</div>
          </div>
        </div>
        <!-- button -->
        <div class="flex center mid layout-col">
          <button class="h-40 btn-submit-review" :class="{ 'disable': posting }" @click="postReview">
            <div class="flex mid center">
              <b>{{ review.id ? $t(6) : $t(5) }}</b>
              <Loading v-if="posting" class="ml-10 sm" style="width: 20px; height: 20px;" />
            </div>
          </button>
        </div>
      </div>
    </template>
    <!-- modals -->
    <GogoModal 
      :show="showPostReviewSuccess"
      @update:show="val => (showPostReviewSuccess = val)"
      :width="350"
      :height="220"
    >
      <!-- <div slot="modal-header"></div> -->
      <div slot="modal-body" class="modal-body">
        <strong style="color: #00a0e9;">{{ $t(7) }}</strong>
        <div class="mt-10" v-html="$t(8)"></div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button class="button-close-modal" @click="closeModal">OK</button>
      </div>
    </GogoModal>
  </div>
</template>

<script>
import Loading from '@@/../components/icons/Loading.vue'
import Pencil from '@@/../components/icons/Pencil02.vue'
import i18n from "@@/lang/components-desktop/review-detail-form.json"
import GogoModal from '@@/../components/modals/GogoModal.vue'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Loading,
    Pencil,
    GogoModal,
  },
  data() {
    return {
      review: {
        title: '',
        content: '',
        reviewStars: 0,
        reviewContent: ''
      },
      id: this.$route.params.id,
      posting: false,
      isClient: process.browser,
      showPostReviewSuccess: false,
    }
  },
  mounted() {
    this.isClient = process.browser
    this.getMyriew()
    this.$nuxt.$on('deleteMyReview', this.getMyriew)
  },
  methods: {
    jumpToMyReview() {
      this.$nuxt.$emit('jumpToMyReview')
    },
    async getMyriew() {
      if(!this.$store.state.user.id) {
        return
      }
      let myReview = await this.GoGoHTTP.get(`/api/v3/surface/review/myreview/${this.id}`)
      this.review = Object.assign({}, {
        title: null,
        content: null,
        reviewStars: 0,
        reviewContent: ''
      }, myReview)
    },
    onMouseOut() {
      this.reviewStars = null
    },
    onMouseOver(i) {
      this.reviewStars = 5 - i + 1
    },
    onRate(star) {
      if(this.posting) {
        return
      }
      this.review.reviewStars = 5 - star + 1
    },
    check(i) {
      let reviewStars = this.reviewStars || this.review.reviewStars,
        a = i + reviewStars,
        b = i + parseInt(reviewStars)
      if (a > 5) {
        return b === 5 ? { half: true } : { full: true }
      }
    },
    postReview() {
      this.$validator.validateAll().then(rs => {
        if(rs) {
          this.posting = true
          this.GoGoHTTP.post(
            `/api/v3/surface/review/myreview/${this.id}`,
            { ...this.review, isNotRedirect: 1 }
          ).then(() => {
            // location.href = `/review/detail2/${this.id}`
            this.showPostReviewSuccess = true
          }).finally(() => {
            this.posting = false
          })
        }
      })
    },
    async closeModal() {
      await this.getMyriew()
      this.showPostReviewSuccess = false
      this.$nuxt.$emit('onSubmitReviewSuccess')
    },
  }
}
</script>

<style lang="less" scoped>
.review-form {
  width: 100%;
  input {
    height: 32px;
    border: 3px solid #aaa;
    padding: 0 8px;
  }
  textarea {
    border: 3px solid #aaa;
    padding: 6px 8px;
    border-radius: 0;
    height: 158px;
    resize: none;
    overflow: auto;
  }
  input, textarea {
    transition: all 0.4s;
  }
  input:focus, textarea:focus {
    border-color: black;
  }
}
.review-rate {
  align-items: center;
  .rate-star {
    @active: #fcd605;
    @deactive: #c1c1c1;
    .star:hover ~ .star {
      color: @active;
    }
    .star {
      color: @deactive;
      display: inline-block;
      font-size: 30px;
      padding-right: 5px;
      &:hover {
        color: @active;
      }
    }
    .full {
      color: @active;
    }
    .half {
      position: relative;
    }
    .half::after {
      top: 0;
      left: 0;
      position: absolute;
      overflow: hidden;
      content: '\2605';
      color: @active;
      width: 50%;
    }
  }
  .star-note {
    align-items: center;
    i {
      color: #fcd605;
      padding-bottom: 3px;
      width: 20px;
      height: auto;
    }
    p {
      margin: 0;
    }
  }
}
.btn-submit-review {
  background: #00a0e9;
  width: 167px;
  height: 34px;
  color: #fff;
  border: none;
  border-radius: 4px;
  box-shadow: 0 0 2px #00a0e9;
}
.review-title-label {
  background: #00a0e91a;
  color: #337ab7;
  height: 55px;
  padding: 10px 20px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &.no-hover {
    cursor: auto;
    &:hover {
      opacity: 1;
    }
  }
}
/deep/ .modal-dialog {
  display: flex;
  align-items: center;
  padding: 0 30px;
  .modal-content {
    width: 100%;
    .modal-body {
      height: calc(100% - 100px);
      padding: 10px;
      margin: 0;
    }
  }
  .button-close-modal {
    background: #00a0e9;
    border: none;
    color: #fff;
    box-shadow: 0 0 2px #00a0e9;
    height: 30px;
    min-width: 68px;
    &:active {
      box-shadow: none;
    }
  }
}
</style>
