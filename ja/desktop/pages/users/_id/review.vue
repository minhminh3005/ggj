<template>
  <div>
    <div class="tabs">
      <div class="tab-item" :class="{'active': type == 0}" @click="onSelect(0)">{{ $t(`title0`) }}</div>
      <div class="tab-item" :class="{'active': type == 1}" @click="onSelect(1)">{{ $t(`title1`) }}</div>
      <div class="tab-item" :class="{'active': type == 2}" @click="onSelect(2)">{{ $t(`title2`) }}</div>
      <div class="tab-item" :class="{'active': type == 3}" @click="onSelect(3)">{{ $t(`title3`) }}</div>
    </div>
    <div class="panel panel-default">
      <div class="panel-body p-30 pos-rel" :class="[0,2].includes(type) ? 'product-avatar' : 'user-avatar' ">
        <div class="pos-rel">
          <title04 :title="$t(`title${(type || 0)}`)" class="mb-30" />
          <div class="list-options">
            <span class="mr-10">{{ $t('60') }}</span>
            <SelectBox :data-source="sortArticle" :display="'text'" :id-val="'id'" @input="selectSort" :selected="orderType" />
          </div>
        </div>
        <template v-if="reviews">
          <review-rating :type="type" :data="review" class="mb-20 pb-10" v-for="(review,index) in reviews.data" :key="'userReview'+index" />
          <paging class="text-center mt-45"
                  :cur-page="reviews.currentPage"
                  :total="reviews.lastPage"
                  :from="reviews.pagingFrom"
                  :to="reviews.pagingTo"
                  :has-scroll="true"
                  :is-add-url-param="true"
                  :origin-url="`/users/${this.id}/review/`"
                  @pagingclick="onPagingClick"
          />
        </template>
        <template v-if="(!reviews || reviews.data.length == 0)">
          <div class="no-data">{{ $t(32) }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/users-id.json'
import reviewRating from '@/components/user/ReviewRating.vue'
import Title04 from '@/components/review/Title04.vue'
import Paging from '@@/../components/paging/Paging.vue'
import { calPaging } from '@/utils/client/common'
import SelectBox from '@@/../common/components/navi/series/select-box.vue'

const TYPES = [
  0,1,2,3
]
const ORDER_TYPES = [
  0,1
]
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    SelectBox,
    reviewRating,
    Title04,
    Paging,
  },
  data() {
    return {
      sortArticle: [
        {
          id: 0,
          text: this.$t('62'),
        },
        {
          id: 1,
          text: this.$t('63'),
        }
      ]
    }
  },
  async asyncData({ app, params, query }) {
    let id = params.id,
      type = TYPES.includes(parseInt(query.t)) ? parseInt(query.t) : 0,
      orderType = ORDER_TYPES.includes(parseInt(query.s)) ? parseInt(query.s) : 0,
      data = await app.GoGoHTTP.get(`/api/v3/surface/profile/${id}/review`, {
        sfLoading: true,
        params: {
          type: type,
          orderType: orderType
        }
      }),
      limit = 20,
      pageRange = 4,
      p = params.p,
      reviews = calPaging(data, p, limit, pageRange)
    return {
      type,
      orderType,
      data,
      reviews,
      id,
      p,
      limit,
      pageRange,
    }
  },
  methods: {
    selectSort(orderType) {
      this.orderType = orderType
      location.href = `/users/${this.id}/review?t=${this.type}&s=${this.orderType}`
    },
    onPagingClick(page) {
      this.reviews = calPaging(this.data, page, this.limit, this.pageRange)
    },
    onSelect(i) {
      this.type = i || 0
      location.href = `/users/${this.id}/review?t=${this.type}&s=${this.orderType}`
    },
  },
}
</script>
<style lang="scss" scoped>
$pink: #f2677d;
.tabs {
  display: flex;
  margin-bottom: 20px;
  .tab-item {
    font-size: 12px;
    color: #000;
    padding-right: 20px;
    padding-left: 20px;
    height: 35px;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    transition: all 0.4s ease;
    &:not(:last-child) {
      border-right: solid 1px #a5a5a5;
    }
    &:hover {
      color: $pink;
    }
    &.active {
      color: $pink;
      &::after {
        content: "";
        background: $pink;
        position: absolute;
        bottom: 0;
        height: 2px;
        width: calc(100% - 40px);
      }
    }
  }
}
.title {
  border-bottom: 1px solid $pink !important;
}
.list-options {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
}
.loader {
  position: absolute;
  top: 65px;
  width: calc(100% - 60px);
  &::before {
    border-top: 3px solid #f2677d !important;
  }
}
.product-avatar {
  min-height: 339px;
}
.user-avatar {
  min-height: 278px;
}
.no-data {
  text-align: center;
  font-size: 14px;
  color: #6e757e;
  padding-top: 10px;
}
.dropdown-box {
  /deep/ button.sl-area {
    min-width: 150px;
    border-radius: 3px;
  }
}
</style>