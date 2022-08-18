<template>
  <LazyComp01 class="user-review flex" min-height="157px">
    <div class="left mr-10">
      <a class="block no-underlying" :href="data.productDetailUrl">
        <Lzimg width="90" height="90" :data-src="'/img/products/'+data.productId+'/small'" alt="" />
        <p class="mt-10 mb-10 break-word">{{ data.productName }}</p>
        <rate :stars="data.stars" />
      </a>
    </div>
    <div class="right" :class="classes">
      <a :href="'/review/detail/'+data.productId" class="no-underlying">
        <b class="mb-10">{{ data.title }}</b><br />
        {{ data.content }}
      </a>
      <div class="text-right">{{ formatTime(data.publishedAt, 6) }}</div>
    </div>
  </LazyComp01>
</template>

<script>
import Rate from '@/components/user/Rate.vue'
import Lzimg from '@@/../components/Lzimg.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'

export default {
  components: {
    Rate,
    Lzimg,
    LazyComp01,
  },
  props: {
    data: Object,
    classes: {
      type: String,
      default: ''
    }
  },
}
</script>


<style lang="scss" scoped>
.user-review {
  .left {
    width: 110px;
    flex: 0 0 110px;
  }
  border-bottom: 1px solid #b4b5b6;
}
.break-word {
  word-wrap: break-word;
}
.right {
  font-size: 13px;
}
.width-item {
  width: calc(100% - 98px);
}
</style>
