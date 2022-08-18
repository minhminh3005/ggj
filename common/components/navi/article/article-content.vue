<template>
  <div class="article-content-container">
    <template v-if="article.isPurchased && !isOwner && !article.freeSales">
      <div v-if="!rooms.length" class="w-full purchase-btn mt-10 flex center mid">
        {{ t(38) }}&nbsp;&nbsp;&nbsp; ¥{{ formatNumber(price) }}
      </div>
      <CommunityButton v-else :attrs="{page: 'purchasedArticle', price: price, numCom: 1, articleOption: article.articleOption}" />
    </template>
    <div class="layout-col" style="position: relative;">
      <img v-if="articleOption !== SALON_ARTICLE" class="cover" :class="article.isPurchased && !isOwner && !article.freeSales ? 'mt-10' : 'mt-30'" :src="`/img/articles/${article.id}?ingoreOnErr=1&v=${Date.now()}`" alt="" onerror="this.style.display='none'" />
      <img v-else class="cover" :class="article.isPurchased && !isOwner && !article.freeSales ? 'mt-10' : 'mt-30'" :src="`/img/assets/pc/salons/banners/${article.seriesProductId}_top_banner.jpg`" alt="" onerror="this.style.display='none'" />
      <div class="article-name mt-30">
        {{ article.title }}
      </div>
      <div class="category" v-if="category">{{ category }}</div>
      <div 
        class="article-content mt-50 ql-editor"
        style="color: #8D8D8D;"
        v-if="articleOption === SALON_ARTICLE && !article.paidContent && !article.freeContent && !article.isPurchased"
      >
        <p v-html="t(47)"></p>
      </div>
      <div 
        class="article-content mt-50 ql-editor"
        style="color: #8D8D8D;"
        v-else-if="!article.freeContent && !isOwner && !article.isPurchased"
      >
        <p v-html="t(47)"></p>
      </div>
      <div
        v-else
        class="article-content mt-50 ql-editor"
        v-html="article.paidContent || article.freeContent"
      ></div>
    </div>
    <div class="image-viewer" id="image-viewer">
      <span class="close">&times;</span>
      <img class="modal-content" id="full-image" />
    </div>
  </div>
</template>
<script>
import { t } from "@@/../common/assets/js/helper"
import CommunityButton from '@@/../components/community/CommunityButton.vue'
import { SINGLE, SERIALIZED, SINGLE_SERIALIZED, SALON_ARTICLE } from '@@/../common/assets/consts/article'

export default {
  name: "ArticleContent",
  props: ['articleOption'],
  data() {
    return {
      SINGLE,
      SERIALIZED,
      SINGLE_SERIALIZED,
      SALON_ARTICLE
    }
  },
  components: {
    CommunityButton
  },
  computed: {
    category() {
      const foundCategory = (
        this.$store.getters["finance/naviCategories"] || []
      ).find(item => item.id === this.article.naviCategoryId)
      if (!foundCategory) return ""
      return foundCategory.categoryName
    },
    article() {
      return this.$store.getters["finance/selectedArticle"]
    },
    hideContentIfGuests() {
      // check user no login & free article
      return !this.$store.state.user.id && !this.article.isPaidContent && !this.article.articlePrice &&
          !this.article.seriesPrice
    },
    isOwner() {
      const {user = {}} = this.article
      return user.id == this.$store.state.user.id
    },
    price(){
      return this.article.articlePrice || this.article.seriesPrice
    },
    info() {
      switch (this.article.articleOption) {
        case SINGLE:
          return this.$store.getters['community/getCommunitiesArticle']
        case SERIALIZED:
          return this.$store.getters['community/getCommunitiesSeries']
        case SINGLE_SERIALIZED:
          return this.$store.getters['community/getCommunitiesArticleAndSeries']
        default:
          return this.$store.getters['community/getCommunitiesArticle']
      }
    },
    rooms() {
      return this.info ? (this.info || {}).rooms || [] : []
    },
  },
  mounted() {
    const imagesInContent = document.querySelectorAll('.article-content-container img')
    imagesInContent.forEach(imageElement => {
      if (
        (imageElement.id && imageElement.id.includes('full-image')) ||
        (imageElement.parentElement && imageElement.parentElement.tagName.toLocaleUpperCase()==='A')) return

      $(imageElement).css('cursor', 'zoom-in')
      imageElement.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        $("#full-image").attr("src", $(e.currentTarget || e.target).attr("src"))
        $('#image-viewer').show()
      })
    })
    $("#image-viewer .close").click(function() {
      $('#image-viewer').hide()
    })
    $('#image-viewer').click(function() {
      $(this).hide()
    })
    // get community
    this.$store.dispatch('community/onGetCommunities')
  },
  methods: { t }
}
</script>
<style scoped lang="scss">
.image-viewer {
  display: none;
  position: fixed;
  z-index: 9;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.9);
  .modal-content {
    margin: auto;
    display: block;
    max-width: 1000px;
    animation-name: zoom;
    animation-duration: 0.6s;
    width: 80%;
    @media all and (max-width: 1000px) {
      width: 100%;
    }
  }
  .close {
    position: absolute;
    top: 15px;
    right: 35px;
    color: #f1f1f1;
    font-size: 40px;
    font-weight: bold;
    transition: 0.3s;
    &:hover, &:focus {
      color: #bbb;
      text-decoration: none;
      cursor: pointer;
    }
  }
}
@keyframes zoom {
  from { transform: scale(0); }
  to { transform: scale(1); }
}
.purchase-btn {
  background-color: #ddc6b6;
  color: white;
  height: 32px;
}
.article-content-container {
  @media all and (min-width: 1280px) {
    width: 620px;
  }
}
.cover {
  width: 100%;
  //height: 389px;
}
.article-name {
  font-size: 8vmin;
  color: #292929;
  font-weight: bold;
  @media (min-width: 768px) and (max-width: 1024px) {
    font-size: 4vmin;
  }
  @media (min-width: 1025px) {
    font-size: 2.5vmin;
  }
}
.category {
  font-size: 12px;
  background-color: #ccc;
  padding: 3px 6px;
  border-radius: 2px;
  width: fit-content;
  text-align: center;
  color: white;
}
.article-content {
  word-break: break-all;
  overflow-x: auto;
  overflow-y: hidden;
  line-height: 1.7;
}
.article-content /deep/ {
  color: #4f4f4f;
  font-size: 16px;
  * {
    max-width: 100% !important;
  }
  p {
    a {
      color: #337ab7 !important;
    }
    line-height: 1.7;
    margin: 0 0 10px;
  }
}
.hide-partial-content {
  height: 355px;
  overflow-y: hidden;
}
.transparent {
  background: rgba(0, 0, 0, 0)
    linear-gradient(
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5),
      rgb(255, 255, 255)
    )
    repeat scroll 0% 0%;
  height: 300px;
  position: absolute;
  width: 100%;
  bottom: 252px;
}
.auth-panel-container {
  width: 100%;
  height: 232px;
  background-color: white;
  z-index: 2;
}
.require-login-panel {
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 22px;
  padding: 30px;
  max-width: 454px;
  width: 100%;
  z-index: 1;
  align-items: center;
  position: absolute;
  bottom: 0;
  a {
    text-decoration: none;
    color: white;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      transition: background-color 0.5s;
    }
    &.register-btn {
      width: 196px;
      background-color: #3f48cc;
      &:hover {
        background-color: darken(#3f48cc, 10%);
      }
    }
    &.login-btn {
      width: 117px;
      background-color: #f60;
      border-radius: 5px;
      &:hover {
        background-color: darken(#f60, 10%);
      }
    }
  }
}
</style>
