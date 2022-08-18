<template>
  <div class="faq-container pl-20 pr-20">
    <div class="faq-top-title">{{ $t(1) }}</div>
    <Search :common-keyword="data.commonKeyword" />
    <!-- List category -->
    <div v-if="data.categories && data.categories.length">
      <div class="faq-sub-title border">{{ $t(2) }}</div>
      <div class="category-container pt-15 pb-15">
        <a
          v-for="(cate, idx) in data.categories"
          :key="`ct-${idx}`"
          class="category"
          :href="`#${cate.id}`"
        >
          {{ cate.name }}
        </a>
      </div>
    </div>
    <!-- List frequently questions -->
    <div class="faq-sub-title">{{ $t(3) }}</div>
    <Questions :questions="data.frequentlyQuestions" />
    <!-- List questions by category -->
    <div class="faq-sub-title">{{ $t(4) }}</div>
    <Questions
      v-for="cate in listQuestionByCategory"
      :questions="cate.listQuestion"
      :subtitle="cate.cateName"
      :key="`ct-${cate.cateId}`"
      :id="cate.cateId"
    />
    <InquiryLink />
  </div>
</template>
<script>
import i18n from '@@/lang/desktop/faq.json'
import title from '@@/../common/pages'
import Search from '@@/../common/components/faq/Search'
import Questions from '@@/../common/components/faq/Questions'
import InquiryLink from '@@/../common/components/faq/InquiryLink'

const obj = Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {
      Search,
      Questions,
      InquiryLink,
    },
    async asyncData({ app }) {
      let [data, listQuestionByCategory] = await Promise.all([
        app.GoGoHTTP.get(`/api/v3/surface/faq/index`),
        app.GoGoHTTP.get(`/api/v3/surface/faq/list`),
      ])
      return {
        data,
        listQuestionByCategory,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/faq`,
          },
        ],
      }
    },
    methods: {
      titleTemplate() {
        return this.$t('top-meta-title')
      },
      descriptionTemplate() {
        return this.$t('top-des')
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
.faq-container {
  max-width: 1000px;
  margin: auto;
  /deep/ .questions-container {
    margin: 15px 0;
    @media only screen and (min-width: $screen-sm) {
      border-top: 1px solid $grey1;
      margin: 20px 0;
    }
  }
}
.faq-top-title {
  font-size: 22px;
  margin-top: 32px;
  color: $grey4;
  text-align: center;
  font-weight: bold;
  @media only screen and (min-width: $screen-sm) {
    font-size: 28px;
  }
}
.border {
  padding-bottom: 17px;
  border-bottom: 1px solid $grey1;
}
.faq-sub-title {
  font-size: 20px;
  color: $grey4;
  text-align: center;
  font-weight: bold;
  margin-top: 25px;
  padding-bottom: 17px;
  border-bottom: 1px solid $grey1;
  @media only screen and (min-width: $screen-sm) {
    font-size: 25px;
    padding-bottom: 20px;
    padding-bottom: 0;
    border-bottom: none;
  }
}
.category-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  .category {
    font-size: 14px;
    border: 1px solid $grey1;
    cursor: pointer;
    text-align: center;
    border-radius: 4px;
    padding: 10px 12px;
    color: $grey3;
    text-decoration: none;
    background: $white;
    font-weight: bold;
    &:hover {
      color: $faq-q;
      border: 1px solid $faq-q;
    }
    @media only screen and (min-width: $screen-sm) {
      font-size: 18px;
      flex-grow: 2;
      min-width: 20%;
      max-width: 40%;
      &:nth-child(odd) {
        flex: 1 1 auto;
      }
      &:nth-child(even) {
        flex: 1 0 auto;
      }
    }
  }
}
</style>
<style lang="scss">
/* stylelint-disable */
html {
  scroll-behavior: smooth;
}
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>
