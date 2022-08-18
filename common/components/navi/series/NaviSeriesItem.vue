<template>
  <div class="series-item inline-flex" :data-page="item.page" :id="item.id">
    <a class="card-img flex layout-col" :href="`/finance/navi/series/${item.id}`" :title="item.title">
      <Lzimg
        alt="" @error="handleCoverError"
        :data-src="`/img/products/${item.productId}?ingoreOnErr=1`"
      />
    </a>
    <div class="series-info flex layout-col">
      <a class="series-title clamp clamp-1" :href="`/finance/navi/series/${item.id}`" :title="item.title"
         style="height: 25px;"
      >
        {{ item.title }}
      </a>
      <div class="series-content clamp clamp-1" style="height: 20px;">{{ item.content }}</div>
      <div class="series-info-author mt-15">
        <span v-if="item.price" class="flex mid ml-5 mr-10" style="color: #548bdf;">
          {{ $t('currency') }}{{ formatNumber(item.discountPrice || item.price) }}/{{ $t('month') }}
          <template v-if="item.discountPrice">
            (<span style="text-decoration: line-through; color: #2c2c2c;">{{ $t('currency') }}{{ formatNumber(item.price) }}/{{ $t('month') }}</span>)
          </template>
        </span>
        <span v-else style="color: #548bdf;" class="mt-15">{{ $t('12') }}</span>
        <div class="mt-10 inline-flex" style="max-height: 24px; width: 100%;">
          <div class="navi-category mr-15" v-if="category">{{ category }}</div>
          <LikeCount :count="objLike.totalLike" :liked="objLike.isLiked" width="18" height="18" class="mr-10" @onLike="handleLike(item)" />
        </div>
        <div class="author mt-15">
          <a :href="`/finance/navi/authors/${item.user.id}`">
            <Lzimg class="mr-10" :data-src="`/img/users/${item.user.id}/small`" alt="" />
          </a>
          <div class="author-info flex layout-col">
            <a class="author-name clamp clamp-1" :href="`/finance/navi/authors/${item.user.id}`" style="height: 18px; overflow: hidden;">{{ item.user.name }}</a>
            <span class="published-date">{{ formatTime(item.publishedDate, 1) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Lzimg from '@@/../components/Lzimg.vue'
import LikeCount from '@@/../common/components/like-count'
import i18n from '@@/lang/desktop/navi-series.json'
import {
  ioNaviItem,
} from '@@/../common/js/finance/utils'

export default {
  name: 'NaviSeriesItem',
  i18n: {
    messages: i18n,
  },
  components: {
    LikeCount,
    Lzimg,
  },
  props: {
    opts: {
      type: Object,
    },
  },
  computed: {
    item() {
      return this.opts.item
    },
    objLike() {
      return this.opts.objLike
    },
    handleLike() {
      return this.opts.handleLike
    },
    category() {
      return this.opts.category
    },
  },
  methods: {
    handleCoverError(e) {
      e.src = '/img/assets/pc/common/default/no-img.png'
    },
  },
  mounted() {
    ioNaviItem.call(this, '.series-title', '.card-img', .85, [1.0])
  }
}
</script>

<style lang="scss" scoped>
.series-item {
  .card-img {
    width: 100%;
    height: calc(180px + 5vw);
    box-sizing: border-box;
    border-radius: 6px;
    @media screen and (min-width: 480px) {
      min-width: 293.33px;
      width: 293.33px;
      height: calc(110px + 5vw);
    }
    img {
      max-width: 100%;
      min-height: 100%;
      width: auto;
      height: auto;
      object-fit: scale-down;
      object-position: 50% 50%;
    }
  }
  .series-title {
    font-size: 18px;
    font-weight: 600;
    color: #2c2c2c;
    margin-top: 10px;
    @media screen and (min-width: 480px) {
      margin-top: 0;
    }
  }
  .series-info {
    @media screen and (min-width: 480px) {
      padding-left: 20px;
    }
  }
  .series-content {
    font-size: 14px;
    color: #7c7c7c;
  }
  .navi-category {
    color: white;
    background-color: #ccc;
    border-radius: 3px;
    height: 24px;
    line-height: 24px;
    padding: 0 5px;
  }
  .author {
    display: inline-flex;
    img {
      width: 38px;
      height: 38px;
      border-radius: 50%;
    }
    .author-name {
      color: #333;
    }
    .published-date {
      font-size: 12px;
      color: #898989;
    }
  }
}
</style>
