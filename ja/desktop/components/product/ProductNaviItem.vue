<template>
  <div class="flex item">
    <a class="img-wrapper" :href="`/finance/navi/${isArticle ? 'articles' : 'series'}/${item.id}`">
      <Lzimg :data-src="imgUrl" alt="" />
    </a>
    <div class="ml-10 content-wrapper">
      <a :href="`/finance/navi/${isArticle ? 'articles' : 'series'}/${item.id}`" class="title no-underlying clamp clamp-1 word-break-all"
         :title="item.title"
      >
        {{ item.title }}
      </a>

      <a :href="`/finance/navi/${isArticle ? 'articles' : 'series'}/${item.id}`" class="des mt-10 no-underlying clamp clamp-2 word-break-all"
         :title="item.title"
      >
        {{ item.content }}
      </a>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/navi-horizontal06.json'
import Lzimg from '@@/../components/Lzimg.vue'
import { SALON_ARTICLE } from '@@/../common/assets/consts/article'

export default {
  name: 'ProductNaviItem',
  i18n: {
    messages: i18n,
  },
  components: { Lzimg },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    }
  },
  data() {
    return {
      SALON_ARTICLE
    }
  },
  computed: {
    imgUrl() {
      return this.item.articleOption == SALON_ARTICLE
      ? `/img/assets/pc/salons/banners/${this.item.seriesProductId}_top_banner.jpg`
      : `/img/${this.isArticle ? 'articles' : 'products'}/${this.isArticle ? this.item.id : this.item.productId}/small`
    },
    isArticle() {
      return this.item.isArticle
    }
  }
}
</script>

<style scoped lang="scss">
.inline-flex:hover {
  text-decoration: none;
}
.number-rank {
  width: 25px;
  font-size: 13px;
  text-align: left;
  ~ div + div {
    border-top: 1px solid #d6d6d6;
  }
}
img {
  max-width: 60px;
}
.item {
  .title {
    font-weight: bold;
  }
}
.img-wrapper {
  display: flex;
  align-items: center;
}
.content-wrapper {
  width: calc(100% - 110px);
}
</style>
