<template>
  <div class="item flex layout-col" :data-page="item.page" :id="item.id">
    <div class="card-img flex layout-col mid" :class="item.articleOption == SALON_ARTICLE ? 'magazine-cls' : ''">
      <Lzimg
        :data-src="imgSrc"
        @error="handleCoverError"
        alt=""
      />
    </div>
    <a :href="href" class="item-title mt-15 pb-10 no-underlying">
      {{ item.title }}
    </a>
    <p class="item-content clamp clamp-3" v-html="item.content"></p>
    <div class="item-sub-content mt-10 flex space-between">
      <div class="inline-flex">
        <!--         is article         -->
        <template v-if="item.isArticle">
          <span class="type-item p-5 article" v-if="(item.price || !item.seriesPrice) && !item.articleSaleStop">
            {{
              $t('5')
            }}
          </span>
          <span v-if="item.price && !item.articleSaleStop" style="color: #5ccfca;"
                class="flex mid mr-10 ml-5"
          >
            ¥{{ formatNumber(item.price) }}
          </span>
          <span v-if="!item.price && !item.seriesPrice && !item.seriesSaleStop" style="color: #5ccfca;"
                class="flex mid mr-10 ml-5"
          >
            {{ $t('6') }}
          </span>
          <template v-if="item.seriesPrice && !item.seriesSaleStop">
            <span class="type-item p-5 series"
                  :class="{'magazine': item.articleOption === SALON_ARTICLE}"
            >
              {{ $t( item.articleOption === SALON_ARTICLE ? '15' : '4') }}
            </span>
            <span v-if="item.seriesPrice" class="flex mid mr-10 ml-5"
                  :style="{color: item.articleOption === SALON_ARTICLE ? '#ce8d5d' : '#548bdf'}"
            >
              ¥{{ formatNumber(item.specialDiscountPrice || item.seriesPrice) }}/月
              <span style="text-decoration: line-through; color: #333; margin-left: 5px;"
                    v-if="item.specialDiscountPrice"
              >
                ¥{{ formatNumber(item.seriesPrice) }}/月
              </span>
            </span>
          </template>
        </template>
        <!--         is series         -->
        <template v-else>
          <span class="type-item p-5 series">{{ $t('4') }}</span>
          <template v-if="item.price">
            <template v-if="item.isSpecialDiscount">
              <span class="flex mid ml-5 mr-10" style="color: #548bdf;">
                ¥{{
                  formatNumber(item.specialDiscountPrice)
                }}/月
              </span>
              <span class="flex mid" style="text-decoration: line-through; margin-left: -5px;">
                ¥{{
                  formatNumber(item.price)
                }}/月
              </span>
            </template>
            <span v-else class="flex mid ml-5 mr-10" style="color: #548bdf;">¥{{ formatNumber(item.price) }}/月</span>
          </template>
          <span v-else style="color: #548bdf;" class="flex mid mr-10 ml-5">{{ $t('6') }}</span>
          <span v-if="item.isFreeFirstMonth" class="is-free-first-month mr-5">({{ $t('7') }})</span>
        </template>
        <div class="navi-category ml-5 flex" v-if="getCategory(item.naviCategoryId)">
          <span class="item-category p-5 ml-5">{{ getCategory(item.naviCategoryId) }}</span>
        </div>
      </div>
    </div>
    <div class="item-author flex space-between mt-20">
      <div class="author inline-flex grow00">
        <a :href="`/finance/navi/authors/${item.userId}`">
          <Lzimg :data-src="`/img/users/${item.userId}/small`" width="36px" height="36px" alt=""
                 style="border: none;"
          />
        </a>
        <div class="flex layout-col ml-5 w-full" style="min-width: 100px;">
          <a :href="`/finance/navi/authors/${item.userId}`" class="author-name wrap-text no-underlying clamp clamp-1"
             :title="item.nickName"
          >
            {{ item.nickName || '名称未設定' }}
          </a>
          <span class="published-date">
            {{
              formatTime(item.publishedAt, 6)
            }}
          </span>
        </div>
      </div>
      <div class="flex grow10 content-end">
        <LikeCount
          width="24"
          height="24"
          :liked="objLike.isLiked"
          :count="objLike.totalLike"
          @onLike="handleLike(item)"
          class="mr-10 ml-20"
        />
        <FavouriteButton
          :marked="!!favorites[item.id] || !!(favorites[item.id] || {}).seriesId"
          @favourite="handleFavorite(item)"
          icon-only
        />
      </div>
    </div>
    <div class="hoz-divider mt-15 mb-15"></div>
  </div>
</template>

<script>
import LikeCount from '@@/../common/components/like-count'
import FavouriteButton from '@@/../common/components/favourite-button'
import Lzimg from '@@/../components/Lzimg.vue'
import i18n from '@@/lang/desktop/navi-layout.json'
import {
  ioNaviItem,
} from '@@/../common/js/finance/utils'
import { SALON_ARTICLE } from '@@/../common/assets/consts/article'

export default {
  name: 'NaviTopItem',
  i18n: {
    messages: i18n,
  },
  components: {
    FavouriteButton,
    LikeCount,
    Lzimg,
  },
  props: {
    opts: {
      type: Object,
    },
  },
  data() {
    return {
      SALON_ARTICLE,
      lastIntersectionRatio: 0
    }
  },
  mounted() {
    ioNaviItem.call(this, '.item-title', '.card-img')
  },
  computed: {
    imgSrc(){
      const item = this.opts.item
      if (item.articleOption === SALON_ARTICLE){
        return `/img/assets/pc/salons/banners/${item.seriesProductId}_top_banner.jpg`
      }
      const pathName = item.isArticle ? 'articles' : 'products'
      const pathId = item.isArticle? item.id : item.productId
      return `/img/${ pathName }/${pathId}?ingoreOnErr=1`
    },
    href() {
      return `/finance/navi/${this.opts.item.isArticle ? 'articles' : 'series'}/${this.opts.item.id}`
    },
    item() {
      return this.opts.item
    },
    objLike() {
      return this.opts.objLike
    },
    handleLike() {
      return this.opts.handleLike
    },
    handleFavorite() {
      return this.opts.handleFavorite
    },
    favorites() {
      const {favorite = []} = this.$store.getters['finance/getFavData'] || {}
      return favorite.reduce((f, val) => {
        f[val.id] = val
        return f
      }, {})
    }
  },
  methods: {
    getCategory(id) {
      const category = this.$store.getters['finance/naviCategoryToObject'] || {}
      const foundCategory = category[id] || {}
      return foundCategory.categoryName
    },
    handleCoverError(e) {
      e.src = '/img/assets/pc/common/default/no-img.png'
      // if (e.style) {
      //   e.style.display='none'
      // }
    },
  }
}
</script>

<style scoped lang="scss">
@import "@@/../common/assets/variables.scss";
.item {
  @media screen and (max-width: 1000px) {
    padding-left: 15px;
    padding-right: 15px;
  }
}
/deep/ .favourite-button {
  min-width: 90px;
  span {
    font-size: 12px;
  }
}
.item-title {
  color: #333;
  font-size: 22px;
  font-weight: bold;
}
.item-content {
  color: #333;
  line-height: 27px;
  font-size: 18px;
}
.item-sub-content {
  height: 24px;
  font-size: 12px;
  .type-item {
    color: white;
    text-align: center;
    border-radius: 22px;
    padding: 3px 6px;
    &.series {
      background-color: #548bdf;
    }
    &.magazine {
      background-color: #ce8d5d;
    }
    &.article {
      background-color: #5ccfca;
    }
  }
  .navi-category {
    padding-left: 5px;
    border-left: 1px solid #d6d6d6;
    .item-category {
      text-align: center;
      color: white;
      font-weight: bold;
      background-color: #ccc;
      border-radius: 2px;
    }
  }
  .item-divider {
    height: 24px;
    width: 1px;
    background-color: #ccc;
    margin: 0 10px;
  }
}
.item-author {
  .author {
    max-width: 60%;
  }
  img {
    border-radius: 50%;
  }
  .author-name {
    color: #333;
    display: inline-block;
  }
  .published-date {
    color: #898989;
    font-size: 12px;
  }
  /deep/ .like {
    min-width: 24px;
    path {
      stroke: #777;
    }
    .like-count {
      margin-left: 6px !important;
      color: #757575;
      font-weight: bold;
      font-size: 12px;
    }
  }
  /deep/ .favourite-button {
    width: 20px;
    min-width: 0;
    margin-right: 14px;
    button {
      margin-bottom: 0;
    }
  }
}
.hoz-divider {
  width: 100%;
  height: 1px;
  background-color: #ccc;
}
.is-free-first-month {
  text-align: center;
  color: #548bdf;
  border-radius: 10px;
  font-size: 12px;
  line-height: 24px;
}
.card-img {
  height: calc(242px + 5vw);
  box-sizing: border-box;
  border-radius: 6px;
  @media screen and (max-width: $screen-sm) {
    &.magazine-cls {
      height: calc(140px + 5vw);
    }
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
</style>
