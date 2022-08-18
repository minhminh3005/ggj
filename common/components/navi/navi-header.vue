<template>
  <div
    class="navi-header"
    :class="{ detail: !isListPage, 'list-page': isListPage }"
  >
    <div class="navi-menu flex space-between">
      <div class="flex mid grow1">
        <Tab class="flex" style="flex: 0 0 auto" />
        <div class="user-and-search">
          <div class="author" :class="{ 'active-author': isAuthor }">
            <SeriesAuthor
              :fill="isAuthor ? '#2a2a2a' : '#c9c9c9'"
              @click="submit"
            />
            <a href="/finance/navi/authors" class="author-name wrap-text">
              {{ $t('28') }}
            </a>
          </div>
          <div class="flex mid ml-5">
            <button
              class="btn-hashtag"
              @click="showSearchHashtagModal"
            >
              <SeriesSearch />
              {{ $t('32') }}
            </button>
          </div>
        </div>
      </div>
      <InfoBar class="navi-header-info-bar" />
    </div>
    <GogoModal
      :show="showModal"
      @update:show="(val) => (showModal = val)"
      class="c-modal hashtag-modal"
    >
      <div slot="modal-header" class="modal-header">
        <div class="flex mid h-full">
          <div class="search-wrap">
            <div class="search-bar">
              <span class="search-icon" @click="onSearchKeyword"><Search /></span>
              <!-- Input is for search keyword -->
              <form class="w-full" action="" @submit="onSearchKeyword">
                <input
                  autofocus
                  name="hashtag"
                  type="search"
                  v-model="searchKeyword"
                  @keypress.enter="onSearchKeyword"
                  :placeholder="$t('37')"
                  class="search-hashtag"
                />
              </form>
              <span v-show="searchKeyword.length" @click="clearSearchKeyword" class="clear-search">{{ $t('38') }}</span>
            </div>
          </div>
          <span class="close-icon" @click="() => (showModal = false)"><CloseIcon /></span>
        </div>
      </div>
      <div slot="modal-body" class="share-body">
        <span v-if="hashtags.length" class="title-hashtag text-left">{{ $t('39') }}</span>
        <Hashtags class="m-t-20" :hashtags="hashtags" />
      </div>
      <div slot="modal-footer"></div>
    </GogoModal>
  </div>
</template>
<script>
import ArticleMixin from '@@/../common/containers/navi/article/mixins'
import Tab from '@@/../common/components/navi/tab'
import InfoBar from '@@/../common/components/navi/info-bar'
import SeriesAuthor from '@@/../components/icons/SeriesAuthor.vue'
import SeriesSearch from '@@/../components/icons/SeriesSearch.vue'
import i18n from '@@/lang/desktop/navi-seriesdetail.json'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import Hashtags from '@@/../components/common/Hashtags.vue'
import Search from '@@/../components/icons/Search.vue'
import CloseIcon from '@@/../common/components/close-icon'
import { SEARCH_URL } from '@@/../common/assets/consts/common'

export default {
  name: 'NaviMenu',
  components: { Tab, InfoBar, SeriesAuthor, SeriesSearch, GogoModal, Hashtags, Search, CloseIcon },
  i18n: {
    messages: i18n,
  },
  mixins: [ArticleMixin],
  props: ['isListPage'],
  data() {
    let searchQuery = this.$nuxt._route.query
    let path = this.$nuxt._route.path || ''
    let params = this.$nuxt._route.params || {}
    const searchKey = !params.wt
      ? ''
      : this.$nuxt._route.fullPath
          .split('/w/')
          .pop()
          // avoid case input "#" directly in browser url
          .replace(/#.*/g, '')

    return {
      searchKeyword: '',
      searchQuery:
        searchQuery.q && !searchQuery.isindex
          ? searchQuery.q
          : decodeURIComponent(searchKey || ''),
      isAuthor: path.includes('authors'),
      showModal: false,
      isClient: process.browser,
      hashtags: []
    }
  },
  computed: {
    article() {
      return this.$store.getters['finance/selectedArticle']
    },
  },
  mounted() {
    this.getHashtag()
  },
  methods: {
    clearSearchKeyword() {
      this.searchKeyword = ''
      this.$nextTick(() => {
        $('input[name="hashtag"]').focus()
      })
    },
    showSearchHashtagModal() {
      this.showModal = true
      this.$nextTick(() => {
        $('input[name="hashtag"]').focus()
      })
    },
    onSearchKeyword(e) {
      e.preventDefault()
      if(!this.searchKeyword) return
      location.href = `${SEARCH_URL}&w=${this.searchKeyword}`
    },
    submit() {
      let q = this.encodeUrlSearchKey(this.searchQuery)
      if (!this.searchQuery) {
        return
      }
      // location.href = `/finance/navi/search/p/1/ipc/0/pt/3/w/${q}`
      location.href = `${SEARCH_URL}&w=${q}`
    },
    async getHashtag() {
      try {
        let res = await this.GoGoHTTP.get('/api/v3/surface/navi/hashtags/favorite?type=search')
        if(res) this.hashtags = res
      } catch(err) {
        console.log('err', err)
      }
    }
  },
}
</script>
<style scoped lang="scss">
@import '@@/../common/assets/variables.scss';
$color-c9: #c9c9c9;
$color-75: #757575;
$color-dark-gray: #333;
.navi {
  &-menu {
    color: $color-c9;
    padding: 0 40px 0 30px;
  }
}
.navi-header {
  background: #fff;
  position: relative;
  overflow: auto hidden;
  @media only screen and (min-width: $screen-md) {
    overflow: visible;
  }
  &::after {
    content: '';
    width: 100%;
    border-bottom: solid 2px #efefef;
    position: absolute;
    left: 0;
    z-index: -1;
  }
  &.detail {
    @media only screen and (max-width: $screen-sm),
      only screen and (max-width: 896px) and (max-height: 414px) {
      display: none;
    }
  }
  &.list-page {
    @media screen and (max-width: 896px) {
      .navi-menu {
        padding: 0;
        > div {
          justify-content: space-between;
          width: 100%;
        }
        .user-and-search {
          margin-left: 0;
        }
      }
    }
  }
}
.list-page {
  .navi-menu .fi-tab {
    @media all and (max-width: 320px) {
      padding: 5px 10px;
    }
  }
}
.user-and-search {
  font-size: 15px;
  display: flex;
  align-items: center;
  margin-left: 44px;
  height: 40px;
  > * {
    padding-top: 5px;
  }
  a {
    color: $color-c9;
    &:hover {
      color: #2d2d2d;
      text-decoration: none;
    }
  }
  .author {
    display: flex;
  }
  .author-name {
    width: 48px;
  }
}
.dropdown.sub-menu {
  display: none;
  @media all and (max-width: $screen-xs) {
    display: block;
  }
  ul {
    left: -206px;
    top: 116%;
    width: 240px;
    min-width: 0;
    li {
      height: 40px;
      padding-left: 10px;
    }
  }
  button {
    outline: none;
    border: none;
    background: transparent;
    color: $color-c9;
    font-size: 20px;
  }
}
.icon-cls {
  display: inline-block;
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
}
i.icon-cls {
  color: $color-c9;
  width: 20px;
  height: 20px;
}
.header-search-block {
  input {
    border: none;
    color: $color-dark-gray;
    &::placeholder {
      /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: $color-c9;
      opacity: 1; /* Firefox */
    }
  }
}
.active-author {
  position: relative;
  a {
    color: #2a2a2a;
    text-decoration: none;
  }
}
.active-author::before {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  width: 100%;
  height: 2px;
  margin: 0 auto;
  background: #2a2a2a;
}
@media only screen and (max-width: 1024px) {
  .user-and-search {
    margin-left: 30px;
  }
}
@media only screen and (max-width: $screen-sm) {
  .btn-hashtag {
    width: 214px;
    font-size: 13px;
    text-align: left;
  }
  .user-and-search {
    .author-name {
      font-size: 13px;
      margin-left: 1px;
      display: flex;
      align-items: flex-end;
    }
  }
  .active-author {
    a {
      color: $color-dark-gray;
    }
  }
  .navi-menu {
    color: $color-75;
  }
}
.btn-hashtag {
  display: flex;
  align-items: center;
  position: relative;
  background: no-repeat;
  padding: 1px 2px;
  border: none;
  color: $color-c9;
}
/deep/ .share-body {
  padding: 20px;
  padding-bottom: 25px;
  margin: auto;
  overflow-y: scroll;
  height: 80%;
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
}
.title-hashtag {
  font-weight: bold;
  font-size: 15px;
}
.search-hashtag {
  width: 100%;
  background: #FFF 0% 0% no-repeat padding-box;
  border: none;
  outline: none;
  opacity: 1;
  &:focus {
    border: none;
    outline: none;
  }
  &::placeholder {
    font-size: 14px;
    color: #707070;
  }
}
.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  input {
    font-size: 14px;
    color: $color-dark-gray;
    &::placeholder {
      /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: $color-c9;
      opacity: 1; /* Firefox */
    }
    &::-internal-autofill-selected {
      background-color: none;
    }
  }
  .search-icon {
    display: flex;
    align-items: center;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
}
.close-icon {
  display: flex;
  width: 15px;
  height: 15px;
  cursor: pointer;
}
/deep/ .hashtag-modal {
  .modal-header {
    display: block;
    background: #fff;
    padding: 15px 20px;
    height: auto;
    .search-wrap {
      flex: 1;
      position: relative;
      .clear-search {
        display: none;
        font-size: 12px;
        width: 100px;
        color: $color-c9;
        cursor: pointer;
        text-align: center;
        @media only screen and (min-width: $screen-xs) {
          display: block;
          border-right: solid 1px #c9c9c9;
        }
      }
    }
    .close-icon {
      margin-left: 20px;
    }
    .mobile-header {
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 20px;
      .close-icon {
        position: absolute;
        right: 0;
        margin: 0;
      }
    }
  }
  .modal-content {
    top: 0;
    background: #FFF 0% 0% no-repeat padding-box;
    box-shadow: 0 5px 10px 2px #00000029 !important;
    border-radius: 0;
    height: 100% !important;
  }
  .modal-dialog {
    width: 620px;
    margin: auto;
    margin-left: 420px;
    height: 100% !important;
    transition: none;
    transform: none;
    @media all and (max-width: 1024px) {
      margin-left: auto !important;
    }
  }
}
/deep/ .hashtags-container {
  margin-top: 10px;
  .hashtag {
    font-size: 12px;
    &:hover {
      text-decoration: unset;
    }
  }
}
.d-lg-flex {
  display: none;
}
@media only screen and (min-width: $screen-sm) {
  /deep/ .hashtag-modal {
    .modal-header {
      height: 50px;
      .mobile-header {
        display: none;
      }
    }
    .modal-content {
      top: 55px;
      height: auto !important;
      margin: 30px 10px;
      border: none;
      border-radius: 10px;
    }
  }
  .modal.in {
    background: transparent;
  }
  .d-lg-flex {
    display: flex;
  }
  .share-body {
    max-height: 400px;
  }
}
</style>
