<template>
  <div class="product-horizontal flex" :class="attrs.theme">
    <div class="product-img">
      <a :href="detailUrl" class="box-hover cursor-pointer gogo-link">
        <Lzimg
          :data-src="`/img/users/${product.id}/small`"
          :alt="`${product.name}`"
        />
      </a>
      <div class="product-author" v-if="product.isAuthor">
        <div class="author-icon"><SeriesLogo /></div>
        <div class="author-text"><span>{{ $t('10') }}</span></div>
      </div>
    </div>
    <div class="product-details">
      <a :href="detailUrl" class="cursor-pointer gogo-link" :class="attrs.showDescription ? 'w-percent' : 'mr-16'">
        <div class="fs-13 product-title clamp clamp-2" :title="product.name">{{ product.name || $t('7') }}</div>
      </a>
      <a v-if="attrs.showDescription" :href="detailUrl" class="cursor-pointer gogo-link w-percent">
        <div class="fs-13 product-des clamp clamp-3">{{ product.introduction }}</div>
      </a>
      <NaviFollowActions :attrs="{...attrs, url: detailUrl}" :product="product" @onClick="handleFollow" @updateNotify="updateNotify" />
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/navi-rank-horiz.json'
import Lzimg from '@@/../components/Lzimg.vue'
import SeriesLogo from '@@/../components/icons/SeriesLogo.vue'
import NaviFollowActions from '@@/../components/product/NaviFollowActions.vue'
const URL = '/api/v3/surface/navi/follow/'

export default {
  i18n: {
    messages: i18n,
  },
  components: { Lzimg, SeriesLogo, NaviFollowActions },
  props: {
    product: {
      type: Object,
      default() {
        return {}
      },
    },
    attrs: {
      type: Object,
      default: function() {
        return {}
      },
    },
  },
  computed: {
    detailUrl() {
      return this.attrs.showButton || this.product.isAuthor ? `/finance/navi/authors/${this.product.id}` : `/users/${this.product.id}`
    }
  },
  methods: {
    handleFollow(item) {
      let method = item.isFollowed ? 'delete': 'post'
      this.GoGoHTTP[method](`${URL}${item.id}`).then(async() => {
        // update list following
        if(item.isFollowed) this.$store.commit('finance/removeFollowingItem', item.id)
        else this.$store.commit('finance/addFollowingItem', item)
        // update list follower
        let status = item.hasOwnProperty('isNotification') ? item.isFollowed : item.isFollowed ? 0 : 1
        this.$store.commit('finance/updateFollowerItem', {id: item.id,status})
        //
        this.$emit('updateFollow', item)
        //
        this.$nuxt.$emit('followItemAction',{
          id: item.id,
          isFollowed: status
        })
      })
    },
    updateNotify(data) {
      if(!data || !data.item) return
      let item = data.item,
      num = data.num
      this.GoGoHTTP.put(`${URL}${item.id}`, {
        isNotification: num
      }).then(async() => this.$store.commit('finance/updateNotify', {id: item.id,status: num}))
    },
    onSelectClick(e) {
      setTimeout(() => {
        e.scrollIntoViewIfNeeded ? e.scrollIntoViewIfNeeded() : e.scrollIntoView({block: "end"})
      })
    }
  }
}
</script>

<style scoped lang="scss">
.mr-16 {
  margin-right: 16px;
}
.product-horizontal {
  position: relative;
  padding: 8px;
  /deep/ .a {
    display: flex;
    align-items: center;
    padding: 10px;
  }
  &:hover {
    background: #f1f1f1;
    a {
      color: #2d2d2d;
      text-decoration: unset;
    }
  }
  .product-author {
    display: flex;
    margin-top: 5px;
    .author-icon {
      width: 18px;
      line-height: 0;
    }
    .author-text {
      position: relative;
      margin-left: 2px;
      padding-left: 1px;
      font-size: 13px;
      height: 100%;
      color: white;
      background: #898989;
      padding-right: 3px;
      &::before {
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        border-left: 4px solid transparent;
        border-right: 9px solid #898989;
        border-top: 0 solid #898989;
        border-bottom: 18px solid transparent;
        left: -13px;
        bottom: 0;
        right: 0;
        top: 0;
      }
    }
  }
  .product-img {
    width: 50px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    i.icon-cls-logo {
      /deep/ svg {
        path {
          fill: #898989;
        }
      }
    }
  }
  .box-hover {
    width: 50px;
    height: 50px;
    flex: 0 0 50px;
    div {
      width: 100%;
      height: 100%;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .w-percent {
    width: calc(100% - 100px);
  }
  .product-details {
    flex: 1 1 auto;
    margin-left: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 70px);
    a.gogo-link {
      text-decoration: unset;
    }
    a {
      color: #2d2d2d;
    }
    .product-title {
      font-weight: bold;
    }
    .product-des {
      color: #8e8e8e;
    }
  }
  &.theme-02,&.theme-03 {
    background: white;
    .product-details {
      flex-direction: column;
      align-items: baseline;
      a.gogo-link {
        width: 100%;
      }
    }
  }
  &.theme-03 {
    border: 1px solid #ddd;
    padding: 8px;
    min-height: 137px;
  }
}
</style>

