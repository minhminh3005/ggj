<template>
  <div>
    <div class="desktop w-full">
      <div class="left-menu flex layout-col">
        <SearchBox v-model="searchKey" @search="gotoSearch" @enter="gotoSearch" />
        <div class="divider"></div>
        <DropdownDefault :data-source="sortAuthor" :title="$t('7')" :display="'text'" :id-val="'id'" v-model="filters.searchType" @input="selectSort" />
        <div class="divider"></div>
      </div>
      <div class="content">
        <div v-if="(dataList.data || []).length > 0" class="author-list">
          <ProductHorizontalFollow v-for="(item,idx) in dataList.data" :key="'pc'+idx" :product="item" :attrs="{ showButton: true, showDescription: true, theme: 'theme-03' }" @updateFollow="refreshList" />
        </div>
        <section v-else class="o-err mt-30">
          {{ $t('10') }}
        </section>
        <div class="flex center">
          <paging :cur-page="dataList.currentPage"
                  :total="dataList.lastPage"
                  :from="dataList.pagingFrom"
                  :to="dataList.pagingTo"
                  :has-scroll="true"
                  theme-class="theme1"
                  @pagingclick="onPagingClick" class="mt-15"
          />
        </div>
      </div>
    </div>
    <div class="mobile articles-list-wrapper">
      <div class="search-box-wrapper">
        <SearchBox :placeholder="$t('11')" v-model="searchKey" @search="gotoSearch" @enter="gotoSearch" />
      </div>
      <div class="select-filter flex ">
        <div class="btn-toggle flex">
          <RadioTag v-model="filters.searchType" :theme="'theme-2'" :class-mobile="'c-label-mobile'" :attrs="{ id: 'sortAuthor'+item.id, value: item.id }" :label="item.text" v-for="item in sortAuthorMobile" :key="`sortAuthor-${item.id}`" @input="selectSort" />
        </div>
      </div>
      <div v-if="(dataList.data || []).length > 0" class="articles-list">
        <ProductHorizontalFollow v-for="(item,idx) in dataList.data" :key="'mb'+idx" :product="item" :attrs="{ showButton: true, showDescription: true, theme: 'theme-03' }" @updateFollow="refreshList" />
      </div>
      <section v-else class="o-err mt-30">
        {{ $t('10') }}
      </section>
      <PagingMobile :cur-page="dataList.currentPage"
                    :total="dataList.lastPage"
                    :from="dataList.pagingFrom"
                    :to="dataList.pagingTo"
                    :has-scroll="true"
                    theme-class="theme1"
                    @pagingclick="onPagingClick" class="w-full mt-15 pb-25 text-center"
      />
    </div>
  </div>
</template>

<script>
import Paging from '@@/../components/paging/Paging.vue'
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/navi-authors.json'
import DropdownDefault from '@@/../components/form/DropdownDefault.vue'
import SearchBox from '@@/../common/components/navi/search-box'
import RadioTag from '@@/../components/form/RadioTag.vue'

import NaviHorizontal09 from '@@/../components/product/NaviHorizontal09.vue'
import PagingMobile from '@@/../components/common/paging-mobile.vue'
import NaviAuthorsItem from '@@/../components/product/NaviAuthorsItem.vue'
import SearchBoxMobile from '@@/../components/product/SearchBox.vue'
import ProductHorizontalFollow from '@@/../components/product/ProductHorizontalFollow.vue'

const obj = Object.assign(
  {
    components: {
      Paging,
      NaviHorizontal09,
      DropdownDefault,
      SearchBox,
      RadioTag,
      PagingMobile,
      NaviAuthorsItem,
      SearchBoxMobile,
      ProductHorizontalFollow
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        /**
         * Sort order of authors:
         * 0: popular
         * 1: name (Japanese character order)
         * 2: name (Latin character order)
         * 3: new authors
         */
        sortAuthor: [
          {
            text: this.$t('8'),
            id: 1,
          },
          {
            text: this.$t('15'),
            id: 0,
          },
          // TODO: backup REP-1839
          /* {
            text: this.$t('3'),
            id: 1,
          },
          {
            text: this.$t('4'),
            id: 2,
          }, */
          {
            text: this.$t('5'),
            id: 3,
          },
        ],
        sortAuthorMobile: [
          {
            text: this.$t('8'),
            id: 1,
          },
          {
            text: this.$t('16'),
            id: 0,
          },
          {
            text: this.$t('13'),
            id: 3,
          },
        ],
        titleChunk: this.$t('tChunk'),
        searchKey: ''
      }
    },
    props: ['filters', 'keyword', 'dataList'],
    mounted() {
      this.searchKey = this.keyword
    },
    methods: {
      gotoSearch(keyword) {
        this.$emit('gotoSearch', keyword)
      },
      onPagingClick(_page) {
        this.$emit('onPagingClick', _page)
      },
      selectSort() {
        this.$emit('selectSort')
      },
      refreshList() {
        this.$emit('refreshList')
      },
      descriptionTemplate() {
        return this.$t('6')
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
@import "@@/../common/assets/variables.scss";
.desktop {
  display: inline-flex;
}
.o-err {
  color: red;
  text-align: center;
  min-height: 400px;
}
h1 {
  font-size: 24px;
  color: #2d2d2d;
}
.navi-h09 {
  margin-right: 17px;
}
.navi-h09:nth-child(4n) {
  margin-right: 0;
}
.content {
  width: 1000px;
  background: #fff;
  margin: auto;
  padding-top: 20px;
}
.options {
  position: absolute;
}
.author-list {
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 20px;
  .product-horizontal {
    width: 30%;
  }
}
@media only screen and (min-width: 1591px) {
  .content {
    margin-left: 200px;
  }
}
@media only screen and (max-width: 1590px) {
  .options {
    display: flex;
  }
  .content {
    width: 1024px;
    margin-top: 15px;
    padding-top: 15px;
  }
  .fi-tab {
    height: auto !important;
  }
  .navi-h09 {
    margin-right: 15px;
    &:nth-child(4n) {
      margin-right: 15px;
    }
  }
}
@media all and (max-width: 1440px) {
  .content {
    padding-left: 0;
    margin-left: 50px;
  }
}
@media only screen and (max-width: 768px) {
  .options {
    margin-left: 10px !important;
  }
  .left-menu {
    width: 250px !important;
    padding-left: 20px !important;
  }
}
.mobile {
  display: none;
}
@media screen and (max-width: 1570px) {
  .navi-h09 {
    width: 225px !important;
  }
}
@media only screen and (max-width: $screen-lg) {
  .desktop {
    display: none;
  }
  .mobile {
    display: block;
  }
  .menu-cls,
  .search-box,
  .nav-wrapper--fi {
    display: none;
  }
  .o-err {
    color: red;
    text-align: center;
    padding-bottom: 30px;
  }
  .articles-list-wrapper {
    background: #f5f5f5;
    .articles-list {
      padding: 0 15px;
      .product-horizontal {
        margin-bottom: 15px;
      }
    }
  }
  .select-filter {
    padding: 16px 24px 24px 24px;
    .btn-toggle {
      border: 1px solid rgb(169, 169, 169);
      border-radius: 4px;
      overflow: hidden;
    }
  }
}
.search-box-wrapper {
  padding: 24px 24px 0 24px;
}
.left-menu {
  padding-left: 50px;
  margin-top: 10px;
  .category div[class="dropdown"] {
    display: none;
  }
  .divider {
    height: 1px;
    width: 100%;
    margin: 10px 0;
    background-color: #f5f5f5;
    max-width: 213px;
  }
  * {
    color: #777;
    &.selected {
      color: #2c2c2c;
      font-weight: bold;
    }
  }
  .series-period, .category {
    button {
      border: none;
      outline: none;
      color: #777;
      font-weight: bold;
    }
    li {
      cursor: pointer;
      &:hover {
        background-color: #e6e6e6;
      }
    }
    .caret:last-child {
      padding-left: 0;
      height: 4px;
    }
  }
  .status-list {
    span {
      margin-right: 10px;
      height: 36px;
      cursor: pointer;
      width: 52px;
      text-align: center;
      &:hover {
        color: #2c2c2c;
      }
    }
  }
  .category {
    span {
      padding-left: 10px;
      cursor: pointer;
      height: 2em;
      &:hover {
        color: #2c2c2c;
      }
    }
  }
  .series-search {
    display: inline-flex;
    border: 1px solid;
    border-radius: 21px;
    padding: 5px;
    height: 36px;
    width: 100%;
    margin-top: 15px;
    align-items: center;
    input {
      border: none;
      padding: 0 10px;
      color: #2c2c2c;
      width: 100%;
    }
    i {
      margin-top: 6px;
    }
    /deep/ svg:hover {
      circle, line {
        stroke: #2c2c2c;
      }
    }
  }
}
@media only screen and (max-width: 1440px) {
  .left-menu {
    padding-left: 30px !important;
    margin-top: 20px;
  }
}
@media screen and (max-width: 1024px) {
  .filters {
    .divider {
      display: none;
    }
  }
}
.img-wrapp {
  background-color: #fff !important;
}
/deep/ .theme-2 {
  background: #d9d7d4;
  background-color: #a9a9a9;
  color: white;
  &.c-label {
    color: #bfbfbf !important;
    font-size: 13px !important;
    padding: 6px 12px !important;
  }
  &.is-checked {
    color: #fff !important;
  }
}
@media screen and (min-width: 769px) {
  .header-search-block {
    margin-top: 24px;
    margin-bottom: 12px;
  }
}
@media screen and (max-width: 425px) {
  .search-box-wrapper {
    padding: 12px 12px 0 12px;
  }
  .select-filter {
    padding: 16px 12px 12px 12px;
  }
}
</style>

<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>