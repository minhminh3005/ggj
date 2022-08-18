<template>
  <div>
    <div class="status-title">{{ $t('24') }}</div>
    <div class="wrapper-populer-article-PC">
      <div class="popular-article" v-for="(article, idx) in popularHashtagsArticle" :key="`${article.id}-${idx}`">
        <a :title="(article.hashtags || {}).hashtag" :href="`${SEARCH_URL}&h=${(article.hashtags || {}).hashtag}`" class="text-left hashtag-title wrap-text">#{{ (article.hashtags || {}).hashtag }}</a>
        <a class="content-article">
          <a class="wrapper-img-title" target="_blank" :href="`/finance/navi/articles/${article.id}`">
            <div class="wrapper-img">
              <img class="img-article" :src="`/img/articles/${article.articleId}`" :alt="article.title" />
            </div>
            <p :title="article.title" class="text-left article-title wrap-text">{{ article.title }}</p>
          </a>
          <div class="wrapper-user-info">
            <a class="user-left" target="_blank" :href="`/finance/navi/authors/${article.userId}`"><img :src="`/img/users/${article.userId}/small`" alt="..." /></a>
            <div class="user-right" :title="article.nickName">
              <a target="_blank" :href="`/finance/navi/authors/${article.userId}`" class="article-content text-left clamp clamp-1">{{ article.nickName }}</a>
              <p class="article-pub-at text-left">{{ formatTime(article.publishedAt, 6) }}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div class="wrapper-hashtag" @click="showModalHashtag">
      <div class="icon-hashtag">
        <Tags />
        <span>{{ $t('22') }}</span>
      </div>
    </div>
    <GogoModal
      :show="showModal"
      @update:show="(val) => (showModal = val)"
      :width="480"
      class="modal-list-popular-hashtag"
    >
      <div slot="modal-header" class="modal-header">
        <div class="title-hashtag text-center">
          <span>{{ $t('22') }}</span>
        </div>
        <span class="close-icon" @click="() => showModal = false"><CloseIcon /></span>
      </div>
      <div slot="modal-body" class="share-body">
        <a
          :href="`${SEARCH_URL}&h=${hashtag.hashtag}`"
          class="text-left wrapper-item"
          v-for="(hashtag) in hashtags" :key="hashtag.id"
        >
          <span class="hashtag-name">#{{ hashtag.hashtag }}</span>
          <span class="hashtag-popular-number">{{ hashtag.count }} {{ $t('23') }}</span>
        </a>
      </div>
      <div slot="modal-footer"></div>
    </GogoModal>
  </div>
</template>

<script>
import Tags from '@@/../components/icons/Tags.vue'
import CloseIcon from '@@/../common/components/close-icon'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import i18n from '@@/lang/desktop/navi-layout.json'
import { SEARCH_URL } from '@@/../common/assets/consts/common'

export default {
  name: 'NaviTopItem',
  i18n: {
    messages: i18n,
  },
  components: {
    Tags,
    CloseIcon,
    GogoModal,
  },
  props: {
    hashtags: {
      type: Array,
      default() {return []}
    },
    popularHashtagsArticle: {
      type: Array,
      default() {return []}
    },
  },
  data() {
    return {
      SEARCH_URL,
      showModal: false,
    }
  },
  methods: {
    showModalHashtag() {
      this.showModal = true
    }
  }
}
</script>

<style scoped lang="scss">
@import "@@/../common/assets/variables.scss";
.wrapper-populer-article-PC {
  display: grid;
  grid-column-gap: 15px;
  grid-row-gap: 25px;
  grid-template-columns: repeat(auto-fill,minmax(30%,1fr));
  padding: 0;
   > * {
    min-width: 0;
  }
  @media only screen and (max-width: 1228px) {
    margin: 0 15px;
    overflow-x: scroll;
    grid-template-columns: repeat(auto-fill,minmax(192px ,1fr));
    grid-auto-flow: column;
    scrollbar-color: #d6d6d6 #fff;
    scrollbar-width: thin;
    &::-webkit-scrollbar {
      height: 12px;
      cursor: pointer;
      &-track {
        background: #fff;
        border-radius: 4px;
      }
      &-thumb {
        background: #d6d6d6;
        border-radius: 999px;
        cursor: pointer;
      }
    }
  }
}
.popular-article {
  .content-article {
    text-decoration: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    .wrapper-img-title {
      text-decoration: none;
      .wrapper-img {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  display: inline-block;
  @media only screen and (max-width: 1228px) {
    width: 192px;
  }
  .hashtag-title {
    color: #707070;
    cursor: pointer;
    display: block;
    margin-bottom: 8px;
  }
  .img-article {
    height: 108px;
    min-height: 108px;
    max-width: 192px;
    object-fit: cover;
    @media only screen and (min-width: $screen-md-navi) {
      max-width: 100%;
      object-fit: cover;
    }
  }
  .card-article {
    text-decoration: none;
    color: #333;
  }
  .article-title {
    font-size: 18px;
    color: #333;
    font-weight: bold;
    margin-top: 8px;
  }
  .article-hashtag {
    margin-bottom: 6px;
  }
}
.wrapper-user-info {
  display: flex;
  .user-left {
    flex: 1;
    img {
      width: 36px;
      height: 36px;
      object-fit: fill;
      border-radius: 50%;
    }
  }
  .user-right {
    width: calc(100% - 51px);
    margin-left: 15px;
    .article-content {
      font-size: 14px !important;
      font-weight: bold;
      color: #333;
      text-decoration: none;
    }
    .article-pub-at {
      font-size: 12px !important;
      color: #898989;
      text-decoration: none;
    }
  }
}
.wrapper-hashtag {
  margin-top: 10px;
  color: #707070;
  display: flex;
  justify-content: flex-end;
  padding: 0 15px;
  font-size: 13px;
  @media only screen and (min-width: $screen-md-navi) {
    display: none;
  }
  .icon-hashtag {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  /deep/ i.icon-cls {
    display: inline-block;
    width: 30px;
    height: 38px;
  }
}
.close-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  &:hover {
    cursor: pointer;
  }
}
/deep/ .modal-header {
  background: #fff;
  border-bottom: 1px solid #0000004D;
  height: 60px;
}
/deep/ i.icon-cls {
  width: 20px;
  height: 20px;
}
.title-hashtag {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  display: flex;
  justify-content: center;
}
.wrapper-item {
  height: 48px;
  padding: 8px;
  text-decoration: none;
  font-size: 14px;
  color: #777;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center;
  .hashtag-name {
    word-break: break-word;
    max-width: 200px;
    @media only screen and (min-width: 480px) {
      max-width: 300px;
    }
  }
  &:hover, &:focus {
    font-weight: bold;
  }
  .hashtag-popular-number {
    color: #2D2D2D4D;
  }
}
.modal-list-popular-hashtag {
  height: calc(100% + 120px);
  @media only screen and (min-width: $screen-md-navi) {
    display: none;
  }
  /deep/ .modal-dialog {
    display: flex;
    align-items: center;
    height: 100vh !important;
    margin: auto !important;
    @media only screen and (max-width: $screen-sm) and (min-width: $screen-xs) {
      width: 480px !important;
    }
    .modal-content {
      width: 100%;
      max-height: 100%;
      overflow: auto;
      @media only screen and (max-width: $screen-xs) {
        height: 100% !important;
        border: none;
        border-radius: unset;
      }
      .share-body {
        padding: 20px;
        margin: auto;
        height: calc(100% - 60px);
        overflow: auto;
        scrollbar-color: #d6d6d6 #fff;
        scrollbar-width: thin;
        &::-webkit-scrollbar {
          width: 8px;
          cursor: pointer;
          &-track {
            background: #fff;
            border-radius: 4px;
          }
          &-thumb {
            background: #d6d6d6;
            border-radius: 7px;
            cursor: pointer;
          }
        }
        @media only screen and (max-width: $screen-xs) {
          height: calc(100% - 160px);
        }
      }
    }
  }
}
.status-title {
  font-size: 21px;
  font-weight: bold;
  padding: 20px 15px 10px 15px;
  text-align: left;
  @media only screen and (min-width: $screen-md-navi) {
    text-align: center;
    margin-bottom: 20px;
    padding: 24px 15px;
    border-bottom: solid 2px #efefef;
  }
}
</style>
