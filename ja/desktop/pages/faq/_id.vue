<template>
  <div class="detail-container">
    <div class="head-title">
      {{ $t(1) }}
    </div>
    <div v-if="result">
      <div v-if="result.question" class="flex question-wrapper">
        <span class="letter question-letter">Q.</span>
        <div class="question">
          {{ result.question }}
        </div>
      </div>
      <hr class="divider" />
      <div v-if="result.answer" class="flex answer-wrapper">
        <span class="letter answer-letter">A.</span>
        <div class="answer" v-html="urlifyOutsideATag(result.answer)"></div>
      </div>
    </div>
    <div class="detail-search-title">{{ $t(13) }}</div>
    <Search :common-keyword="data.commonKeyword || []" />
    <template v-if="(data.relatedQuestions || []).length > 0">
      <div class="detail-title">
        {{ $t(9) }}
      </div>
      <Questions :questions="data.relatedQuestions || []" />
    </template>
    <InquiryLink />
  </div>
</template>

<script>
import { urlifyOutsideATag } from '@@/../common/assets/js/helper'
import i18n from '@@/lang/desktop/faq.json'
import title from '@@/../common/pages'
import Questions from '@@/../common/components/faq/Questions'
import Search from '@@/../common/components/faq/Search'
import InquiryLink from '@@/../common/components/faq/InquiryLink'
const obj = Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: { Questions, Search, InquiryLink },
    data() {
      return {
        titleChunk: this.$t('detail-meta-title'),
        descriptionChunk: this.$t('detail-meta-description'),
      }
    },
    async asyncData({ app, params, store, error }) {
      let data = await app.GoGoHTTP.get(
        `/api/v3/surface/faq/${params.id}`
      ).catch((err) => {
        const errorObj = err.response
        if (errorObj.status === 404 && !Object.keys(errorObj.data).length) {
          return error({ statusCode: 404 })
        }
        return err
      })
      if (!data || !Object.keys(data).length) {
        return error({ statusCode: 404 })
      }

      let result = data.result || {}
      store.commit('pushBC', {
        name: result.cateName || '',
        path: `/faq#${result.cateId}`,
      })
      store.commit('pushBC', {
        name: result.question || '',
        path: `/faq/${params.id}`,
      })
      return {
        data,
        result,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/faq/${params.id}`,
          },
        ],
      }
    },
    methods: {
      urlifyOutsideATag,
      titleTemplate() {
        return this.$t('detail-meta-title', {
          title: (this.result || {}).question || '',
        })
      },
      descriptionTemplate() {
        return this.$t('detail-meta-description', {
          title: (this.result || {}).question || '',
        })
      },
    },
  },
  title
)

export default obj
</script>

<style lang="scss" scoped>
@import '@@/../common/assets/variables.scss';
@import '@@/../common/assets/faq/faq.scss';
.detail-container {
  max-width: 1000px;
  margin: auto;
  padding: 0 20px;
  .head-title {
    font-size: 28px;
    margin-top: 32px;
    margin-bottom: 50px;
    color: $grey4;
    text-align: center;
    font-weight: bold;
    @media only screen and (max-width: $screen-sm) {
      font-size: 22px;
      margin-bottom: 25px;
    }
  }
  .detail-search-title {
    font-size: 25px;
    margin-top: 100px;
    margin-bottom: -25px;
    color: $grey4;
    text-align: center;
    font-weight: bold;
    @media only screen and (max-width: $screen-sm) {
      font-size: 20px;
      margin-top: 45px;
      padding-bottom: 18px;
    }
  }
  .detail-title {
    display: flex;
    justify-content: center;
    font-size: 25px;
    font-weight: bold;
    color: $grey4;
    padding-top: 50px;
    padding-bottom: 20px;
    border-bottom: 1px solid $grey1;
    @media only screen and (max-width: $screen-sm) {
      padding-top: 33px;
      font-size: 20px;
      padding-bottom: 17px;
    }
  }
}
.question-wrapper,
.answer-wrapper {
  .letter {
    font-size: 25px;
    font-weight: bold;
    &.question-letter {
      color: $faq-q;
    }
    &.answer-letter {
      color: $faq-a;
    }
    @media only screen and (max-width: $screen-sm) {
      font-size: 18px;
    }
  }
  .question {
    font-size: 25px;
    font-weight: bold;
    margin-left: 15px;
    @media only screen and (max-width: $screen-sm) {
      font-size: 18px;
      margin-left: 10px;
    }
  }
  .answer {
    font-size: 18px;
    margin-left: 15px;
    line-height: 2;
    word-break: break-word;
    white-space: pre-wrap;
    /deep/ img {
      padding-top: 20px;
      max-width: 100%;
      @media only screen and (max-width: $screen-sm) {
        padding-top: 17px;
      }
    }
    @media only screen and (max-width: $screen-sm) {
      font-size: 13px;
      margin-left: 10px;
    }
  }
}
.divider {
  width: 100%;
  margin-bottom: 40px;
  @media only screen and (max-width: $screen-sm) {
    margin: 18px 0;
  }
}
</style>
