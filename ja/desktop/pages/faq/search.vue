<template>
  <div class="search-container">
    <div class="search-top-title">{{ $t(1) }}</div>
    <Search :common-keyword="freqData.commonKeyword" />
    <div class="search-title">
      <div class="title">
        <div class="mr-5 word-break-all txt-center">「{{ keyword }}」</div>
        <div>{{ $t(12) }}</div>
      </div>
      <div class="search-total">
        {{ $t(15) }}: {{ data.total }} {{ $t(16) }}
      </div>
    </div>
    <Questions :questions="data.questions" />
    <div class="flex center">
      <div v-if="!hasShowMore" @click="onShowMore" class="btn-show-more">
        {{ $t('show-more') }}
      </div>
      <div v-if="emptyData" class="empty-data">
        {{ $t(14) }}
      </div>
    </div>
    <div v-if="keyword">
      <div class="flex center search-questions">
        <div>{{ $t(3) }}</div>
      </div>
      <Questions :questions="freqData.frequentlyQuestions" />
    </div>

    <InquiryLink />
  </div>
</template>

<script>
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
        titleChunk: this.$t('search-meta-title'),
        descriptionChunk: this.$t('search-meta-description'),
      }
    },
    async asyncData({
      app,
      route: {
        query: { q },
      },
      error,
    }) {
      let keyword = unescape(q || '')
      let [data, freqData] = await Promise.all([
        app.GoGoHTTP.get(`/api/v3/surface/faq/search`, {
          params: {
            ...(q && { q: unescape(q) }),
          },
        }).catch((err) => {
          const errorObj = err.response
          if (errorObj.status === 400 || !Object.keys(errorObj.data).length) {
            return error({ statusCode: 404 })
          }
          return err
        }),
        app.GoGoHTTP.get(`/api/v3/surface/faq/search-info`),
      ])

      return {
        data,
        freqData,
        keyword,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/faq/search${
              q ? `?q=${keyword}` : ''
            }`,
          },
        ],
      }
    },
    methods: {
      onShowMore() {
        this.GoGoHTTP.get('/api/v3/surface/faq/search', {
          params: {
            ...(this.keyword && { q: this.keyword }),
            page: parseInt(this.data.currentPage) + 1,
          },
        }).then((newData) => {
          this.data.currentPage = newData.currentPage
          this.data.questions = this.data.questions.concat(newData.questions)
        })
      },
      titleTemplate() {
        return this.$t('search-meta-title')
      },
      descriptionTemplate() {
        return this.$t('search-meta-description')
      },
    },
    computed: {
      emptyData() {
        let empty = false
        if (this.data.questions.length == 0) {
          empty = true
        }
        return empty
      },
      hasShowMore() {
        let result =
          this.data.questions.length == 0 ||
          this.data.questions.length == parseInt(this.data.total) ||
          parseInt(this.data.total) <= 20
        return result
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
.search-container {
  max-width: 1000px;
  margin: auto;
  padding: 0 20px;
}
.txt-center {
  text-align: center;
}
.search-top-title {
  font-size: 28px;
  margin-top: 32px;
  color: $grey4;
  text-align: center;
  font-weight: bold;
  @media only screen and (max-width: $screen-sm) {
    font-size: 22px;
  }
}
.search-title {
  font-size: 25px;
  color: $grey4;
  padding-bottom: 20px;
  border-bottom: 1px solid $grey1;
  padding-top: 32px;
  @media only screen and (max-width: $screen-sm) {
    font-size: 20px;
    padding-bottom: 17px;
    padding-top: 25px;
  }
  .title {
    font-weight: bold;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    padding-bottom: 15px;
    @media only screen and (max-width: $screen-sm) {
      padding-bottom: 10px;
    }
  }
  .search-total {
    font-size: 18px;
    color: $grey4;
    @media only screen and (max-width: $screen-sm) {
      font-size: 13px;
    }
  }
}
.empty-data {
  font-size: 18px;
  color: rgb(248, 86, 86);
  @media only screen and (max-width: $screen-sm) {
    font-size: 13px;
  }
}
.search-questions {
  font-size: 25px;
  font-weight: bold;
  color: $grey4;
  padding-bottom: 20px;
  border-bottom: 1px solid $grey1;
  margin-top: 120px;
  @media only screen and (max-width: $screen-sm) {
    font-size: 20px;
    margin-top: 40px;
    padding-bottom: 17px;
  }
}
.btn-show-more {
  cursor: pointer;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: $faq-q;
  background: #fff;
  border-radius: 5px;
  padding: 9px 21px;
  border: 1px solid $faq-q;
  text-decoration: none;
  margin-top: 25px;
  width: 240px;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: $white;
      background: $faq-q;
      text-decoration: none !important;
    }
  }
}
</style>
