<template>
  <div v-if="isLoading">
    <Loading />
  </div>
  <section v-else>
    <div class="search-wrapp w-full pt-20 pb-20 pl-25 pr-25" v-if="selectedCategories.length || selectedKeywords.length">
      <div v-if="selectedCategories.length" class="flex fs-12">
        <b class="title-selected">{{ $t('15') }}</b>
        <div class="flex flex-wrap">
          <div v-for="(item, i) in selectedCategories" :key="'cate-' + i" class="ml-15">
            {{ middleCategoriesObj[item] }}
          </div>
        </div>
      </div>
      <div v-if="selectedKeywords.length" class="flex mt-10 fs-12">
        <b class="title-selected">{{ $t('14') }}</b>
        <div class="flex flex-wrap">
          <div v-for="(item, i) in selectedKeywords" :key="'key-' + i" class="ml-15">
            {{ keywordsObj[item] }}
          </div>
        </div>
      </div>
    </div>
    <div class="search-result flex mid mt-30 pl-15 pr-15">
      <Search class="mr-5" />
      <b>{{ $t('18') }}({{ dataPaging.total }}{{ $t('19') }})</b>
    </div>
    <div v-if="dataPaging.data.length">
      <div class="text-center mt-10 mb-10">
        <paging :cur-page="dataPaging.currentPage"
                :total="dataPaging.lastPage"
                :from="dataPaging.pagingFrom"
                :to="dataPaging.pagingTo"
                :has-scroll="true"
                :scroll-offset="250"
                @pagingclick="onGetDataPage"
        />
      </div>
      <div class="flex flex-wrap p-5 center">
        <ProductVertical01 class="cursor-pointer mt-10" v-for="list in dataPaging.data"
                           :key="'list' + list.id" :product="list" type="tools"
        />
      </div>
      <div class="text-center mt-15 mb-50">
        <paging :cur-page="dataPaging.currentPage"
                :total="dataPaging.lastPage"
                :from="dataPaging.pagingFrom"
                :to="dataPaging.pagingTo"
                :has-scroll="true"
                :scroll-offset="250"
                @pagingclick="onGetDataPage"
        />
      </div>
    </div>
    <div v-else class="text-center mt-20 co-red">{{ $t('17') }}</div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@@/lang/desktop/tools-index-search.json'
import ProductVertical01 from '@/components/product/ProductVertical01.vue'
import Paging from '@/components/paging/Paging.vue'
import Search from '@@/../components/icons/Search.vue'
import SortUp from '@@/../components/icons/SortUp.vue'
import SortDown from '@@/../components/icons/SortDown.vue'
import title from '@@/../common/pages'
import Loading from '@@/../components/icons/Loading.vue'

const obj = Object.assign(
  {
    components: {
      ProductVertical01,
      Paging,
      SortUp,
      SortDown,
      Search,
      Loading,
    },
    props: {
      categories: {
        type: Array,
        default: () => []
      },
      midcates: {
        type: Array,
        default: () => []
      },
      keywords: {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {
        data: [],
        dataShow: [],
        textSearch: null,
        isShowModal: false,
        tabs: [this.$t('5'), this.$t('6'), this.$t('7'), this.$t('8')],
        sortType: 0,
        selectedTab: 0,
        timer: null,
        titleChunk: this.$t('21'),
        isLoading: false,
        latestParams: {}
      }
    },
    i18n: {
      messages: i18n,
    },
    computed: {
      ...mapGetters({
        selectedCategories: 'tools/getToolsCategories',
        selectedKeywords: 'tools/getToolsKeywords',
      }),
      middleCategoriesObj() {
        return this.midcates.reduce((acc, val) => {
          acc[val.id] = val.name
          return acc
        }, {})
      },
      keywordsObj() {
        return this.keywords.reduce((acc, val) => {
          acc[val.keywordId] = val.name
          return acc
        }, {})
      }
    },
    mounted() {
      this.$nuxt.$on('onSearch', this.onSearch)
    },
    methods: {
      onSearch(paramsInput) {
        let params = {
          ...this.latestParams,
          ...(paramsInput || {}),
        }
        this.isLoading = true
        this.$router.replace({ query: params })
        this.GoGoHTTP.get('/api/v3/surface/tools/search', {
          params,
        }).then((dataPaging) => {
          this.dataPaging = dataPaging
          this.isLoading = false
          this.latestParams = params
        })
      },
      onGetDataPage(_page) {
        this.onSearch({ p: _page })
      },
      descriptionTemplate() {
        return this.$t('20')
      },
    },
    async asyncData({ app, req, store }) {
      let { cat, key, t = '' } = req.query,
        dataPaging = await app.GoGoHTTP.get('/api/v3/surface/tools/search', {
          params: req.query
        })
        
      cat && (cat = cat.split(',').map(e => parseInt(e)))
      key && (key = key.split(',').map(e => parseInt(e)))

      if (cat != undefined) {
        store.commit('tools/setToolsCategories', cat)
      }

      if (key != undefined) {
        store.commit('tools/setToolsKeywords', key)
      }

      return {
        dataPaging,
        textSearch: t,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/tools/search`,
          },
        ],
      }
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.co-red {
  color: red;
}
.search-wrapp {
  background: #ccd1d9;
  .search-input {
    b {
      flex: 0 0 130px;
      color: #434a54;
    }
    .input-text {
      height: 30px;
      border: 1px solid #434a54;
      padding: 0 115px 0 15px;
      &::placeholder {
        color: #9c9c9c;
      }
    }
    .btn-search {
      top: 0;
      right: 0;
      width: 100px;
      height: 30px;
      background: #434a54;
      color: white;
      outline: none;
      border: none;
      &:hover {
        opacity: 0.9;
      }
    }
  }
  .title-selected {
    color: #434a54;
    flex: 0 0 130px;
  }
}
.search-result {
  font-size: 18px;
  color: #337ab7;
  letter-spacing: 2px;
  i {
    width: 30px;
    height: 31px;
  }
}
/deep/ .dropdown-menu {
  max-height: 304px;
  overflow: auto;
}
</style>
