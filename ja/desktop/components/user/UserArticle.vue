<template>
  <LazyComp01 class="wrapper" min-height="55px">
    <div class="title pb-10 mb-5">
      {{ formatTime(data.publishedAt, 1) }}
      <a target="_blank" :href="`/finance/navi/articles/${data.id}`" class="ml-40 cursor-pointer">
        {{ data.title }}
      </a>
    </div>
  </LazyComp01>
</template>

<style lang="scss" scoped>
.wrapper {
  font-weight: bold;
  font-size: 14px;
}
.title {
  border-bottom: 1px solid #b4b5b6;
  a {
    color: #1927fe;
  }
}
</style>

<script>
import LazyComp01 from '@@/../components/LazyComp01.vue'
export default {
  components: {
    LazyComp01
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
}
</script>
