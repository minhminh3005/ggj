<template>
  <div class="article-author-header flex center mid">
    <div class="flex">
      <a :href="`/finance/navi/authors/${article.user.id}`">
        <img :src="`/img/users/${article.user.id}/small`" alt="" />
      </a>
      <div style="margin-left: 12px;" class="w-full flex mid space-between">
        <div class="wrap-author">
          <div class="flex">
            <a class="author-name clamp clamp-1"
               :href="`/finance/navi/authors/${article.user.id}`"
            >
              {{ article.user.name }}
            </a>
          </div>
          <div class="flex mid space-between">
            <span class="date-created">
              {{
                formatTime(article.publishedAt, 6)
              }}
            </span>
          </div>
        </div>
        <NaviFollowActions :attrs="{showButton: true, theme: 'theme-03', wideBtn: true}" :product="{id: article.user.id, isFollowed: article.isFollowed}"
                           @onClick="handleFollow"
        />
      </div>
    </div>
  </div>
</template>
<script>
import NaviFollowActions from '@@/../components/product/NaviFollowActions.vue'
export default {
  name: 'article-header',
  components: {
    NaviFollowActions,
  },
  computed: {
    article() {
      return this.$store.getters['finance/selectedArticle']
    },
  },
  methods: {
    handleFollow(item) {
      let method = item.isFollowed ? 'delete': 'post'
      this.GoGoHTTP[method](`/api/v3/surface/navi/follow/${item.id}`).then(async() => {
        this.$store.commit('finance/setSelectedArticle',
            Object.assign({}, this.article, { isFollowed: !item.isFollowed }))
      })
    },
  }
}
</script>
<style scoped lang="scss">
img {
  width: 43px;
  height: 43px;
  border-radius: 50%;
  border: 1px solid #efefef;
}
.article-author-header {
  > div {
    max-width: 620px;
    flex: 1;
  }
  height: 64px;
  border-bottom: 1px solid #efefef;
  padding: 0 30px;
  @media only screen and (max-width: 768px),
    only screen
    and (max-width: 896px)
    and (max-height: 414px) {
    padding: 0 20px;
  }
  @media all and (max-width: 425px) {
    padding: 0 10px;
    > div > span {
      display: none;
    }
  }
  position: sticky;
  top: 0;
  background-color: white;
  // z-index: 9;
  .date-created {
    font-size: 12px;
    color: #9e9e9e;
  }
  .author-name {
    font-size: 16px;
    color: #3f3f3f;
    height: 22px;
    @media (min-width: 1025px) {
      font-size: 20px;
      height: 28px;
    }
  }
}
/deep/ .theme-03.follow-group {
  width: auto !important;
  margin-top: 0 !important;
}
.wrap-author {
  margin-right: 16px;
  word-break: break-word;
}
</style>
