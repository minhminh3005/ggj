<template>
  <div class="flex p-10 item">
    <a class="img-ctn flex mid pos-rel" :href="item.detailUrl">
      <slot><img :src="`/img/products/${item.id}/small`" alt="" style="width: 100%; height: auto;" /></slot>
      <span class="rank-num" :class="`rank-num-${item.rank}`">{{ item.rank }}</span>
    </a>
    <div class="pl-10" style="max-width: calc(100% - 80px);">
      <div :title="item.name" class="wrap-text" style="margin-bottom: 2px;"><b>{{ item.name }}</b></div>
      <div class="content-box" :title="item.description">{{ item.description }}</div>
      <div class="pt-5 pb-5"><Rate :stars="0" :alway-show="true" /></div>
      <div>{{ formatTime(item.date, 6) }}</div>
    </div>
  </div>
</template>

<script>
import Rate from '@@/../components/product/Rate.vue'

export default {
  components: {
    Rate,
  },
  props: {
    item: {
      type: Object,
      default() {
        return {
          id: null,
          name: null,
          stars: null,
          date: null,
          description: null,
          detailUrl: null,
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  height: 120px;
  transition: all 0.4s;
  &:hover {
    @media only screen and (min-width: @screen-sm) {
      background: #ececec;
      border-radius: 2px;
    }
  }
  /deep/ .rate-num {
    display: none;
  }
}
.img-ctn {
  width: 80px;
  height: 80px;
  flex: 0 0 80px;
  background: #b9cbe4;
  box-shadow: 0 0 1px;
  &:hover {
    opacity: 0.8;
  }
}
.content-box {
  -webkit-line-clamp: 2;
  overflow: hidden;
  -webkit-box-orient: vertical;
  display: -webkit-box;
}
.rank-num {
  position: absolute;
  color: #8d99ad;
  top: 0;
  left: 0;
  padding: 3px;
  background: #e7ebee;
  display: flex;
  height: 25px;
  width: 25px;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  font-weight: bold;
  &.rank-num-1 {
    color: #fff;
    background: #fc0;
  }
  &.rank-num-2 {
    color: #fff;
    background: #6e766a;
  }
  &.rank-num-3 {
    color: #fff;
    background: #e2594e;
  }
}
</style>