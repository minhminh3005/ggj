<template>
  <div>
    <div class="info-bar-item" data-toggle="collapse" :href="`#replies-area-${id}`" aria-expanded="false" :aria-controls="`replies-area-${id}`">
      <span class="title">{{ title }}</span>
      <span class="count">{{ (data || []).length }}</span>
    </div>
    <div :id="`replies-area-${id}`" class="panel-collapse collapse fs-13">
      <template v-if="id === FOLLOWING || id === FOLLOWER">
        <div class="item-collapse-follow" v-for="(item,idx) in data" :key="id === FOLLOWER ? 'flwer-'+idx : 'flwing-'+idx">
          <ProductHorizontalFollow :product="item" :attrs="attrsOpt(item)" />
        </div>
      </template>
      <template v-else>
        <div v-for="(item, index) in data || []" :key="`follow-${index}`" class="item-collapse">
          <div class="item-collapse-title" @click="onNavigate(item)">{{ item.title }}</div>
          <div class="item-collapse-content">
            <img class="cover" :src="imgUrl(item)" alt="" @click="onNavigate(item)" onerror="this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAFoCAIAAABIUN0GAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAEJlJREFUeNrs3Ql32lbewGGHECxveEniZNKeznz/TzUzp5N6XzHGmJD5GyUuIYYgIbE+z/T09H3bAL7I96crJPHq7PRkDQCYroohAAABBgABBgAEGAAEGAAQYAAQYABAgAFAgAEAAQYAAQYAAQYABBgABBgAEGAAEGAAQIABQIABAAEGAAEGAAEGAAQYAAQYABBgABBgAECAAUCAAQABBgABBgABBgAEGAAEGAAQYAAQYABAgAFAgAEAAQYAAQYAAQYABBgABBgAEGAAEGAAQIABQIABAAEGAAEGAAEGAAQYAAQYABBgABBgAECAAUCAAQABBgABBgABBgAEGAAEGAAQYAAQYABAgAFAgAEAAQYAAQYAAQYABBgABBgAEGAAEGAAQIABQIABAAEGAAEGAAEGAAQYAAQYABBgABBgAECAAUCAAQABBgABBgABBgAEGAAEGAAQYAAQYABAgAFAgAEAAQYAAQYABBgABBgABBgAEGAAEGAAQIABQIABAAEGAAEGAAQYAAQYAAQYABBgABBgAECAAUCAAQABBgABBgAEGAAEGAAEGAAQYAAQYABAgAFAgAEAAQYAAQYABBgABBgABBgAEGAAEGAAQIABQIABAAEGAAEGAAQYAAQYAAQYABBgABBgAECAAUCAAQABBgABBgAEGAAEGABWU9UQLJlG465xdzf+f//xw+Gwf9Vuty8urwp5qMVycXnZbj9m/VPbW1vb21u2QECAV1TnS6fVao3/3zeb95ubGy/+q273a6aHWhpR3xw/eJKs2/yA8TkEveqa902DACDATD3AzXuDACDATFu3222328YBQICZtkwnbQEgwBTDUWgAAWYGOp2Oo9AAAswMOAoNIMDMgKPQAALMDDgKDTBl7oTFN427u4NabeYvI/YDut2v37bO6utq1Sb6w35Sp/Ml/qFWe1OpVGbyCPneykrlVa3krWuaP1pWvYv9Hqc2FAgwC6bVephJUeJ5438xPY1YgidJEjGuvaltbm4sVpJzjOpAP2KIms375v39z3fHjGHZ3tqKMRndm5j9G427YY+wubFRyKjG2xdPEX+PCo54K6s9SbIe72b8fcJSxhPFjmMM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'" />
            <div class="content-info">
              <div class="author">{{ item.nickName }}</div>
              <button v-if="item.isSaleStop" class="deactive" disabled>
                <div class="flex mid center">
                  <span class="text-cart">
                    {{ $t('15') }}
                  </span>
                  <PriceItem class="deactive-price" :price="item.price" :is-monthly-price="item.isMonthlyPrice" :discount-price="item.discountPrice || 0" :is-free-first-month="item.isFreeFirstMonth || 0" />
                </div>
              </button>
              <div v-else class="price">
                <div :class="item.isMonthlyPrice ? 'series' : 'article'">
                  <PriceItem :price="item.price" :is-monthly-price="item.isMonthlyPrice" :discount-price="item.discountPrice || 0" :is-free-first-month="item.isFreeFirstMonth || 0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import PriceItem from "@@/../common/components/price-item"
import i18n from '@@/lang/components-desktop/navi-header.json'
import ProductHorizontalFollow from '@@/../components/product/ProductHorizontalFollow.vue'
const FOLLOWING = 4
const FOLLOWER = 5

export default {
    i18n: {
        messages: i18n,
    },
    components: {
      PriceItem,
      ProductHorizontalFollow
    },
    data() {
      return {
        FOLLOWING,
        FOLLOWER
      }
    },
    props: {
        id: {
            type: Number,
            default: 1
        },
        title: {
            type: String,
            default: ''
        },
        data: {
            type: Array,
            default() {
                return []
            },
        }
    },
    methods: {
      onNavigate(item) {
          window.open(item.detailUrl || '/finance/navi/'+item.id)
      },
      imgUrl(item) {
        if(item.productId) {
          return `/img/products/${item.productId}?ingoreOnErr=1&v=${Date.now()}`
        }else {
          return `/img/articles/${item.id}?ingoreOnErr=1&v=${Date.now()}`
        }
      },
      attrsOpt(item) {
        return {
          theme: 'theme-02',
          showDescription: true,
          showSelect: this.id === FOLLOWING ? item.isFollowed : item.isAuthor && item.isFollowed,
          showButton: this.id === FOLLOWING ? !item.isFollowed : item.isAuthor && !item.isFollowed
        }
      }
    }
}
</script>
<style lang="scss" scoped>
.info-bar {
  &-item {
    height: 40px;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    border-bottom: solid 1px #eaeaea;
    .title {
      width: 90px;
    }
    .count {
      background: #757575;
      color: white;
      padding: 2px 6px;
      border-radius: 2px;
      margin-left: 20px;
      &.purchased {
        margin-left: 34px;
      }
    }
  }
}
.collapse.in {
  max-height: 100%;
  overflow-y: hidden;
  background: #eaeaea;
}
.item-collapse {
  background: #eaeaea;
  border: solid 1px #e5e5e5;
  &:last-child {
    .item-collapse-content {
      margin-bottom: 8px;
    }
  }
  &-title {
    font-size: 12px;
    color: #333;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    background: white;
    margin: 8px 8px 0 8px;
    padding: 14px 14px 0 14px;
  }
  &-content {
    display: flex;
    background: white;
    margin-left: 8px;
    margin-right: 8px;
    padding: 14px;
    .content-info {
      padding-left: 10px;
      .author {
        font-size: 13px;
        color: #757575;
      }
      .price {
        font-size: 10px;
        color: #548bdf;
      }
    }
  }
  &-follow {
    background: #eaeaea;
    padding: 5px 10px;
    &:first-child {
      padding-top: 10px;
    }
    &:last-child {
      padding-bottom: 10px;
    }
    .product-horizontal {
      background: #fff;
    }
  }
}
.cover {
  flex: 0 0 80px;
  width: 80px;
  height: 50px;
}
.deactive {
  height: 22px;
  font-size: 10px;
  text-decoration: none;
  color: #fff;
  position: relative;
  outline: none;
  background: #707070;
  border: none;
  border-radius: 4px;
  cursor: not-allowed;
  .price-wrap {
    margin-top: 1px;
  }
  .discount-price {
    text-decoration: line-through;
    color: #333;
    font-size: 12px;
  }
  .text-cart {
    padding-right: 15px;
  }
}
.article {
  color: #73cdd6;
}
.series {
  color: #548bdf;
}
@media only screen and (max-width: 320px) {
  .deactive-price {
    font-size: 9px;
  }
  .deactive .text-cart {
    padding-right: 2px;
    font-size: 9px;
  }
}
</style>
