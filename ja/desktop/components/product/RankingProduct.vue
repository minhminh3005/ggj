<template>
  <div>
    <div class="fs-12 rank-tabs">
      <button class="co-rank-all rank-title outline-none no-border p-0" :class="{'rank-active' : selectedRank == 'all'}"
              @click="onselectRank('all')" :disabled="selectedRank == 'all'"
      >
        {{ $t('6') }}
      </button>
      <button class="co-rank-ea rank-title outline-none no-border p-0" :class="{'rank-active' : selectedRank == 'ea'}"
              @click="onselectRank('ea')" :disabled="selectedRank == 'ea'"
      >
        {{ $t('7') }}
      </button>
      <button class="co-rank-ebook rank-title outline-none no-border p-0" :class="{'rank-active' : selectedRank == 'etc'}"
              @click="onselectRank('etc')" :disabled="selectedRank == 'etc'"
      >
        {{ $t('8') }}
      </button>
      <button class="co-rank-rt rank-title outline-none no-border p-0" :class="{'rank-active' : selectedRank == 'rt'}"
              @click="onselectRank('rt')" :disabled="selectedRank == 'rt'"
      >
        {{ $t('9') }}
      </button>
    </div>
    <div class="product-list ranking-list">
      <ProductRankHorizontal v-for="(item,index) in rankData[selectedRank]"
                             :key="selectedRank+item.id" :img-index="index + 1"
                             :product="item"
                             :color-index="selectedRank"
                             :display-pips="true"
      />
    </div>
    <!-- ea -->
    <div class="mt-20 right-item-ctn">
      <div class="title" v-html="$t(10)"></div>
      <ReviewHorizontal01 v-for="(item, index) in rankingEa"
                          :item="item"
                          :key="'highpost-ea-3-' + item.productId" :rank="index + 1"
      />
      <ShowMore01 target="/review/highpost/systemtrade/3" class="pt-15" style="border-top: 1px solid #ececec;" />
    </div>
    <!-- ebook -->
    <div class="mt-20 right-item-ctn">
      <div class="title" v-html="$t(11)"></div>
      <ReviewHorizontal01 v-for="(item, index) in rankingEbook"
                          :style="index + 1 == newReview.length"
                          :item="item" :key="'highpost-tools-3-' + item.productId"
                          :rank="index + 1"
      />
      <ShowMore01 target="/review/highpost/tools/3" class="pt-20" style="border-top: 1px solid #ececec;" />
    </div>
    <!-- social button -->
    <SocialLinks class="mt-20" />
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/new-products.json'
import SocialLinks from '@/components/review/SocialLinks.vue'
import ProductRankHorizontal from '@/components/product/ProductRankHorizontal.vue'
import ReviewHorizontal01 from '@/components/review/index/ReviewHorizontal01.vue'
import ShowMore01 from '@/components/common/ShowMore01.vue'

export default {
  i18n: {
    messages: i18n,
  },
  props: {
    rankingEa: {
      type: Array,
      default() {
        return []
      },
    },
    rankingEbook: {
      type: Array,
      default() {
        return []
      },
    },
    newReview: {
      type: Array,
      default() {
        return []
      },
    },
    rankData: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  components: {
    SocialLinks,
    ProductRankHorizontal,
    ReviewHorizontal01,
    ShowMore01
  },
  data() {
    return {
      selectedRank: 'all',
    }
  },
  methods: {
    onselectRank(_index) {
      this.selectedRank = _index
    },
  }
}
</script>

<style lang="scss" scoped>
.right-item-ctn {
  background: white;
  padding: 15px;
  border-radius: 5px;
  .title {
    font-size: 17px;
    line-height: 22px;
    margin-bottom: 15px;
  }
}
$rank-border-color: #d9d9d9;
.rank-tab-psuedo {
  content: '';
  position: absolute;
  height: 1px;
  background-color: $rank-border-color;
}
.rank-tabs {
  display: inline-flex;
  button {
    font-weight: bold;
    background: transparent;
    position: relative;
    height: 22px;
    line-height: 22px;
    border-bottom: 1px solid $rank-border-color;
    text-align: center;
    border-right: 1px solid $rank-border-color;
    padding-left: 10px;
    &.rank-active {
      border-bottom: none;
      z-index: 1;
    }
    &:first-child, &:nth-child(2) {
      width: 50px;
    }
    &:nth-child(3), &:last-child {
      width: 100px;
    }
    &::before {
      @extend .rank-tab-psuedo;
      left: -5px;
      transform: rotate(-48deg);
      top: 10px;
      width: 30px;
    }
    &::after {
      @extend .rank-tab-psuedo;
      left: 20px;
      top: -1px;
    }
    &:first-child::after, &:nth-child(2)::after {
      width: 30px;
    }
    &:nth-child(3)::after, &:last-child::after {
      width: 80px;
    }
  }
}
.product-list {
  min-height: 400px;
}
.ranking-list {
  border: 1px solid #d9d9d9;
  border-top: none;
  padding-top: 1px;
  margin-top: -1px;
}
.co-rank {
  &-all {
    color: #b4b36f;
  }
  &-ea {
    color: #6cb6fc;
  }
  &-ebook {
    color: orange;
  }
  &-rt {
    color: #16a085;
  }
}
.outline-none {
  &:focus {
    outline: none;
  }
}
</style>
