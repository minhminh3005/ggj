<template>
  <div class="flex article-paging layout-col">
    <span class="paging-title mt-30">{{ t(6) }}</span>
    <div class="flex layout-col article-paging-content mt-20">
      <div class="paging-panel flex layout-col">
        <div class="article-summary inline-flex center mr-30 ml-30 mt-15">
          <img
            :src="`/img/products/${article.seriesProductId}/small`"
            alt=""
          />
          <div class="flex layout-col ml-10 auto series-section">
            <a class="article-title clamp clamp-3" :href="`/finance/navi/series/${article.seriesId}`" :title="article.seriesName">
              {{ article.seriesName }}
            </a>
            <div v-if="!isHTML(article.seriesContent)" class="series-page-content mt-5 clamp clamp-2">
              {{ article.seriesContent }}
            </div>
          </div>
        </div>
        <div class="inline-flex sibling-article" v-if="article.next.title || article.prev.title">
          <a :href="`/finance/navi/articles/${article.prev.id}`" class="previous-article inline-flex" v-if="article.prev.title">
            <NaviBackBtn class="prev" :link="`/finance/navi/articles/${article.prev.id}`" />
            <div class="ml-5 clamp clamp-3">
              {{ article.prev.title }}
            </div>
          </a>
          <a class="next-article inline-flex" v-if="article.next.title" :href="`/finance/navi/articles/${article.next.id}`">
            <div class="mr-10 clamp clamp-3">
              {{ article.next.title }}
            </div>
            <NaviBackBtn class="next" :link="`/finance/navi/articles/${article.next.id}`" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NaviBackBtn from '@@/../common/components/back-button'
import { t } from "@@/../common/assets/js/helper"
import {
  isHTML,
} from '@@/../common/js/finance/utils'
export default {
  name: "article-paging",
  components: { NaviBackBtn },
  computed: {
    article() {
      return this.$store.getters['finance/selectedArticle']
    },
  },
  methods: {
    t,
    isHTML
  }
}
</script>
<style scoped lang="scss">
.article-paging {
  border-top: 1px solid #d8d8d8;
  border-bottom: 1px solid #d8d8d8;
  justify-content: center;
  padding-bottom: 40px;
  margin-top: 30px;
  > div {
    width: 100%;
    max-width: 392px;
    height: 196px;
    border-radius: 2px;
    border: 1px solid #d3d3d3;
    box-shadow: 3px 3px 3px #e5e5e5bf;
    position: relative;
    background-color: white;
    align-self: center;
    &::before {
      z-index: -1;
      border-radius: 2px;
      width: 100%;
      max-width: 392px;
      height: 196px;
      content: "";
      position: absolute;
      top: 10px;
      left: 10px;
      border: 1px solid #d3d3d3;
      box-shadow: 4px 4px 3px #e5e5e5bf;
    }
  }
  img {
    width: 62px;
    height: 62px;
  }
  .paging-panel {
    height: 100%;
  }
  .article-title {
    color: #757575;
    text-align: left;
  }
  .paging-title {
    text-align: center;
    color: #2c2c2c;
    font-size: 16px;
    font-weight: bold;
  }
  .article-summary {
    text-align: center;
    height: 100%;
    .series-section {
      width: 258px;
      text-align: left;
    }
  }
  .sibling-article {
    color: #777;
    border-top: 1px solid #d3d3d3;
    height: 100px;
    .previous-article,
    .next-article {
      align-items: center;
      padding: 10px;
      cursor: pointer;
      &:hover {
        background-color: darken(white, 10%);
        transition: background-color 0.5s;
      }
    }
    .previous-article {
      width: 100%;
      border-right: 1px solid #d3d3d3;
    }
    .next-article {
      width: 100%;
    }
  }
  .series-page-content {
    color: #9e9e9e;
    font-size: 13px;
    height: 36px;
  }
}
.previous-article,
.next-article {
  /deep/ svg {
    min-width: 30px !important;
  }
  .next {
    transform: rotate(180deg);
  }
}
</style>
