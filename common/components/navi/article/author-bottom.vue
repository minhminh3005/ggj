<template>
  <div class="author-bottom flex layout-col pb-30 mb-35">
    <span class="section-title mt-30">
      {{ t(20) }}
    </span>
    <div class="section-author mt-40 inline-flex">
      <a :href="`/finance/navi/authors/${article.user.id}`">
        <img :src="`/img/users/${article.user.id}`" :alt="article.user.name" />
      </a>
      <div class="author-content flex layout-col ml-15 auto">
        <div class="flex">
          <a class="author-content-title clamp clamp-1" :title="article.user.name" :href="`/finance/navi/authors/${article.user.id}`">{{ article.user.name }}</a>
        </div>
        <div class="author-content-content mt-10 clamp clamp-5" v-html="urlify(article.user.selfIntroduction)" style="word-break: break-word;">
        </div>
        <NaviFollowActions :attrs="{showButton: true, theme: 'theme-03'}" :product="{id: article.user.id, isFollowed: article.isFollowed}"
                           @onClick="handleFollow"
        />
      </div>
    </div>
  </div>
</template>
<script>
import {urlify, t} from '@@/../common/assets/js/helper'
import NaviFollowActions from '@@/../components/product/NaviFollowActions.vue'

export default {
  name: 'navi-article-author-bottom',
  components: {
    NaviFollowActions,
  },
  computed: {
    article() {
      return this.$store.getters['finance/selectedArticle']
    },
  },
  methods: {
    urlify,
    t,
    handleFollow(item) {
      let method = item.isFollowed ? 'delete': 'post'
      this.GoGoHTTP[method](`/api/v3/surface/navi/follow/${item.id}`).then(async() => {
        this.$store.commit('finance/setSelectedArticle',
            Object.assign({}, this.article, { isFollowed: !item.isFollowed }))
      })
    },
  },
}
</script>
<style scoped lang="scss">
.author-bottom {
  border-bottom: 1px solid #d3d3d3;
  margin-bottom: 40px;
}
.section-title {
  text-align: center;
  color: #2c2c2c;
  font-size: 16px;
  font-weight: bold;
}
.section-author {
  img {
    border-radius: 50%;
    width: 80px;
    height: 80px;
    border: 1px solid #efefef;
  }
  .author-content {
    &-title {
      color: #757575;
      font-size: 20px;
    }
    &-content {
      color: #606060;
      font-size: 16px;
      line-height: 24px;
    }
  }
}
</style>
