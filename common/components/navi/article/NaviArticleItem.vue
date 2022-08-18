<template>
  <div class="series-item flex layout-col space-between normal-item-img p-10 mt-10 mb-10"
       style="min-width: 250px;" :data-page="item.page" :id="item.id"
  >
    <slot name="ranking"></slot>
    <div class="flex layout-col">
      <a class="card-img" :href="`/finance/navi/articles/${item.id}`" :title="item.title">
        <div class="flex layout-col mid" :style="{height: `calc(${imgHeight || 100}px + 5vw)`}">
          <Lzimg :data-src="`/img/articles/${item.id}?ingoreOnErr=1`" alt=""
                 @error="handleCoverError"
          />
        </div>
        <div class="flex series-title mt-15 clamp clamp-2" style="max-height: 50px;">
          {{ item.title }}
        </div>
      </a>
      <div v-if="!simpleMode" class="series-content mt-10 clamp clamp-2" style="max-height: 40px;">{{ item.content }}</div>
    </div>
    <div class="series-info flex layout-col">
      <div class="flex mt-15 flex-wrap" style="font-size: 14px;">
        <!-- article price -->
        <span v-if="item.articlePrice && !item.articleSaleStop" style="color: #548bdf;">
          {{ $t('currency') }}{{ formatNumber(item.articleDiscountPrice || item.articlePrice) }}
          <span v-if="item.articleDiscountPrice" style="color: #2c2c2c; text-decoration: line-through; margin-left: 5px;">
            {{
              $t('currency')
            }}{{ formatNumber(item.articlePrice) }}
          </span>
        </span>
        <!-- free -->
        <span v-else-if="!item.seriesPrice" style="color: #5ccfca; font-weight: bold;" class="mr-10">
          {{
            $t('12')
          }}
        </span>
        <!-- serial price (if sell with series) -->
        <span v-if="item.seriesPrice && !item.seriesSaleStop" style="color: #548bdf;">
          ({{ $t('17') }} {{ $t('currency') }}{{ formatNumber(item.seriesDiscountPrice || item.seriesPrice) }}/{{
            $t('month')
          }}<span v-if="item.seriesDiscountPrice" style="color: #2c2c2c; text-decoration: line-through; margin-left: 5px;">
            {{
              $t('currency')
            }}{{ formatNumber(item.seriesPrice) }}/{{ $t('month') }}
          </span>)
        </span>
      </div>
      <div v-if="!simpleMode" class="mt-10 inline-flex" style="max-height: 24px;">
        <div class="navi-category mr-15" v-if="category">{{ category }}</div>
        <LikeCount :count="objLike.totalLike" :liked="objLike.isLiked" width="18" height="18"
                   class="mr-10" @onLike="handleLike(item)"
        />
      </div>
      <div class="author mt-15">
        <a :href="`/finance/navi/authors/${item.user.id}`">
          <Lzimg class="mr-10" :data-src="`/img/users/${item.user.id}/small`" alt=""
                 @error="handleCoverError"
          />
        </a>
        <div class="author-info flex layout-col">
          <a class="author-name clamp clamp-1" :title="item.user.name"
             :href="`/finance/navi/authors/${item.user.id}`"
             style="height: 18px;"
          >
            {{ item.user.name }}
          </a>
          <span class="published-date">{{ formatTime(item.publishedDate, 1) }}</span>
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
  name: 'NaviArticleItem',
  i18n: {
    messages: i18n
  },
  components: {
    Lzimg,
    LikeCount,
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
    simpleMode() {
      // show ranking part
      return this.opts.simpleMode
    },
    imgHeight() {
      return this.opts.imgHeight
    }
  },
  methods: {
    handleCoverError(e) {
      e.src = '/img/assets/pc/common/default/no-img.png'
    },
  },
  mounted() {
    // there are 3 parts are using this component at common/containers/navi/article/article-list.vue
    // top, right & left, only apply apply below at the right part
    if (this.imgHeight)
      return
    ioNaviItem.call(this, '.series-title', '.card-img', .85, [1.0])
  }
}
</script>

<style lang="scss" scoped>
.large-item {
  .card-img {
    div:first-child {
      height: calc(140px + 5vw);
    }
  }
}
.card-img {
  div:first-child {
    height: calc(100px + 5vw);
    box-sizing: border-box;
    border-radius: 6px;
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
.series-item {
  .series-title {
    font-size: 18px;
    font-weight: 600;
    color: #2c2c2c;
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
