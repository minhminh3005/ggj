<template>
  <div class="w-1000" :class="{ loading }">
    <div class="flex space-between mt-20">
      <div class="left-sidebar">
        <div class="w-full search-header">
          {{ $t(22) }}
        </div>
        <div class="content-list w-full">
          <div class="sub-title">
            <b>{{ $t('23') }}</b>
          </div>
          <SelectBox
            class="list-category"
            v-model="largeCategoryId"
            @input="onGetMiddleCate"
            :data-source="categories"
            :id-val="'id'"
            :display="'name'"
          />
          <div
            class="flex flex-wrap"
            style="border-bottom: #d9d9d9 1px solid; margin: 10px;"
          >
            <!-- v-for midcate by large id -->
            <label
              class="label-hover label-cates flex mid cursor-pointer wrapper-input mr-2"
              v-for="item in middCatesSelected"
              :key="'cate-' + largeCategoryId === 1 ? item.categoryId : item.id"
            >
              <input
                :disabled="loading"
                type="checkbox"
                name="selectedCategories"
                :value="largeCategoryId === 1 ? item.categoryId : item.id"
                v-model="selectedCategories"
              />
              <span></span>
              <div class="item-lbl">{{ item.name }}</div>
            </label>
          </div>
          <!-- hide when select share-room -->
          <template v-if="largeCategoryId == 1 && keywords.length>0">
            <div class="sub-title">
              <b>{{ $t('24') }}</b>
            </div>
            <div
              class="flex flex-wrap"
              style="border-bottom: #d9d9d9 1px solid; margin: 10px;"
            >
              <label
                class="label-hover label-cates flex mid cursor-pointer wrapper-input mr-2"
                v-for="item in keywords"
                :key="'keyword-' + item.keywordId"
              >
                <div class="flex mid">
                  <input
                    :disabled="loading"
                    type="checkbox"
                    name="selectedKeywords"
                    :value="item.keywordId"
                    v-model="selectedKeywords"
                  />
                  <span></span>
                  <div class="item-lbl">{{ item.name }}</div>
                </div>
              </label>
            </div>
          </template>
          <div class="flex flex-wrap" style="margin: 10px;">
            <button
              :disabled="loading"
              class="btn-seach" id="btnSearch" @click="onSearch(true)"
            >
              {{ $t('31') }}
            </button>
          </div>
        </div>
      </div>
      <!--  -->
      <section class="w-740">
        <div class="search-wrapp w-full">
          <div class="search-input">
            <div class="w-full flex mid space-between">
              <input
                type="text"
                name="condition"
                v-model="textSearch"
                :placeholder="$t('24')"
                class="input-text w-full fs-13"
                @keyup.enter="onSearch(true)"
              />
              <Search class="search-icon" @click.native="onSearch(true)" />
            </div>
          </div>
        </div>
        <div class="mt-20">
          <b class="title-selected">{{ $t('25') }}</b>
        </div>
        <transition-group
          name="selected-item"
          class="search-wrapp w-full flex flex-wrap"
          style="min-height: 40px;"
        >
          <!-- selected mid cate -->
          <template v-if="displayCategories.length">
            <div
              v-for="(item) in displayCategories"
              :key="`middle-cate-${item}-${displayCategoriesLarge}`"
              class="mr-10 selected-item flex mid space-between"
            >
              <div>{{ displayCategoriesName[item] }}</div>
              <div class="item-rm" @click="onRmCate(item)">×</div>
            </div>
          </template>
          <!-- selected keyword -->
          <template v-if="displayKeywords.length">
            <div
              v-for="(item) in displayKeywords"
              :key="'keyword-' + item"
              class="mr-10 selected-item flex mid space-between"
            >
              <span>{{ keywordsObj[item] }}</span>
              <div class="item-rm" @click="onRmKeyword(item)">×</div>
            </div>
          </template>
          <template v-if="!displayKeywords.length && !displayCategories.length">
            <div class="mr-10 selected-item flex space-between" key="default">
              <span>{{ $t('4') }}</span>
            </div>
          </template>
        </transition-group>
        <div class="search-result flex mid space-between mt-30">
          <div class="left-result">
            <span>{{ $t('18') }}</span>
            <span style="margin-left: 20px;">
              {{ data.total }}{{ $t('19') }}
            </span>
          </div>
          <SelectBox
            class="list-sort"
            :selected="sortType"
            @input="onSort"
            :data-source="sortList"
            :id-val="'id'"
            :display="'text'"
          />
        </div>
        <div v-if="loading">
          <Loading />
        </div>
        <div v-else-if="dataShow.length">
          <div class="flex flex-wrap product-wrapper">
            <LazyComp01
              v-for="(list, index) in dataShow"
              :key="'FHJEo' + list.id"
              :always-show="index < 16"
              min-height="216px"
            >
              <ProductVertical02
                class="cursor-pointer mt-10"
                :key="'list' + list.id"
                :product="list"
                type="tools"
              />
            </LazyComp01>
          </div>
          <div class="text-center mt-25">
            <paging
              :cur-page="paging.currentPage"
              :total="paging.lastPage"
              :from="paging.pagingFrom"
              :to="paging.pagingTo"
              :has-scroll="true"
              theme-class="theme4"
              @pagingclick="onGetDataPage"
            />
          </div>
        </div>
        <div v-else class="text-center mt-20 co-red">
          {{ $t('17') }}
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/tools-index-search.json'
import ProductVertical02 from '@/components/product/ProductVertical02.vue'
import Paging from '@@/../components/paging/Paging.vue'
import Search from '@@/../components/icons/Search.vue'
import { pushState, encodeURL,setCookie } from '@/utils/client/common'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import title from '@@/../common/pages'
import SelectBox from '@@/../components/form/SelectBox.vue'
import Checkbox from '@@/../components/form/Checkbox.vue'
import Loading from '@@/../components/icons/Loading.vue'

function buildTitle(val) {
  let totalLength = val.categories.length + val.keywords.length
  if (!totalLength) {
    return ''
  } else {
    let arr = [...val.categories, ...val.keywords],
      str = '',
      i,
      l
    for (i = 1, l = arr.length - 1; i < l; i++) {
      str += `- ${arr[i]} `
    }
    str = arr[0] + str
    if (arr.length > 1) {
      str += '- ' + arr[arr.length - 1]
    }
    return str
  }
}

const obj = Object.assign(
  {
    components: {
      ProductVertical02,
      Paging,
      Search,
      LazyComp01,
      SelectBox,
      Checkbox,
      Loading,
    },
    data() {
      return {
        displayCategoriesName: {},
        displayCategoriesLarge: 1,
        loading: false,
        largeCategoryId: 0,
        isShowKeywords: true,
        data: [],
        dataSearch: [],
        dataShow: [],
        textSearch: null,
        paging: {
          currentPage: 1,
          lastPage: 1,
          pagingFrom: 1,
          pagingTo: 1,
        },
        timer: null,
        titleChunk: this.$t('21'),
        descriptionChunk: null,
        keywordsChunk: null,
        sortList: [
          {
            id: 0,
            text: this.$t('26')
          },{
            id: 1,
            text: this.$t('27')
          },{
            id: 2,
            text: this.$t('30')
          },{
            id: 3,
            text: this.$t('28')
          },{
            id: 4,
            text: this.$t('29')
          },
        ],
        middCatesSelected: [],
        categoriesObj: {}
      }
    },
    i18n: {
      messages: i18n,
    },
    mounted() {
      setCookie('toolsCategories', this.selectedCategories, 5, '/tools')
      setCookie('toolsKeywords', this.selectedKeywords, 5, '/tools')
      this.changeDisplayCateSelected()
    },
    methods: {
      changeDisplayCateSelected() {
        this.displayCategoriesLarge = this.largeCategoryId
        this.displayCategoriesName = this.categoriesObj
      },
      onGetMiddleCate(val) {
        // hide nametags cates && keywords when change dropdown
        this.largeCategoryId = val
        // update mid cates by large id
        if(val === 1) {
          this.middCatesSelected = this.masterCate
        } else {
          this.middCatesSelected = this.middCates.filter(midCate => midCate.serviceCategoryLargeId == val)
        }

        // another present of middCates Selected
        let obj = val === 1
              ? (this.masterCate || []).map(item => ({ id: item.categoryId, name: item.name, serviceCategoryLargeId: 1 }))
              : (this.allLevelCategories.middle || []).filter(i => i.serviceCategoryLargeId === val)
        this.categoriesObj = obj.reduce((acc, item) => {
          acc[item.id] = item.name
          return acc
        }, {})

         // uncheck past middlecate
        this.selectedCategories = []
        this.selectedKeywords = []
      },
      onSearch(resetPage = true) {
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
        this.timer =  setTimeout( async () => {
          let cat, large, mid
          let p = resetPage ? 1 : this.paging.currentPage , s = this.sortType || 0,
          t = this.textSearch || '',
          key = this.selectedKeywords.toString() || ''
          if(this.largeCategoryId === 1) {
            cat= this.selectedCategories.toString() || '',
            large = '',
            mid = ''
          } else {
            cat = '',
            large = `${this.largeCategoryId || ''}`,
            mid = `${this.selectedCategories || ''}`
          }

          try {
            this.loading = true
            let data = await this.GoGoHTTP.get(
              // `/api/v3/surface/tools/search?p=${p}&s=${s}&key=${key}&cat=${cat}&large=${large}&mid=${mid}&t=${t}`
              `/api/v3/surface/tools/search`, {
                params: {
                  p, s, key, cat, large, mid, t
                }
              }
            )
            if(data) {
              this.loading = false
              this.data = data

              setCookie('toolsCategories', this.selectedCategories, 5, '/tools')
              setCookie('toolsKeywords', this.selectedKeywords, 5, '/tools')

              pushState(
              `tools/search?p=${p}&s=${s}&cat=${cat}&large=${large}&mid=${mid}&key=${key}&t=${encodeURL(this.textSearch)}`,
              null,
              '',
              location.protocol + '//' + location.host
              )
              this.applyDataSearch()
              this.dataShow = data.data
              // generate paging from data
              let exclude = new Set(['total', 'data'])
              this.paging = Object.fromEntries(Object.entries(data).filter(e => !exclude.has(e[0])))
            }
          } catch(err) {
            this.loading = false
            console.log(err)
          }
        }, 500)
      },
      applyDataSearch() {
        let cat = this.selectedCategories.map(e => this.categoriesObj[parseInt(e)]),
          key = this.selectedKeywords.map(e => this.keywordsObj[parseInt(e)]),
          str = buildTitle.call(this, { categories: cat, keywords: key })
        this.titleChunk = str || this.$t('1')
        this.descriptionChunk = str
        this.keywordsChunk = [...cat, ...key].join()
        this.$store.commit('tools/setToolsCategories', this.selectedCategories)
        this.$store.commit('tools/setToolsKeywords', this.selectedKeywords)
        this.displayCategories = this.selectedCategories

        this.categoriesObj = this.middCatesSelected.reduce((acc, val) => {
          if(this.largeCategoryId === 1) {
            acc[val.categoryId] = val.name
          }
          acc[val.id] = val.name
          return acc
        }, {})

        this.displayKeywords = this.selectedKeywords
        this.changeDisplayCateSelected()
      },
      onGetDataPage(_page) {
        this.paging.currentPage = _page
        this.onSearch(false)
      },
      descriptionTemplate() {
        return this.$t('20')
      },
      onRmCate(item) {
        this.selectedCategories = this.selectedCategories.filter(e => e != item)
        this.onSearch(true)
      },
      onRmKeyword(item) {
        this.selectedKeywords = this.selectedKeywords.filter(e => e != item)
        this.onSearch(true)
      },
      onSort(idx) {
        this.sortType = idx
        this.isShowKeywords = false
        this.onSearch(true)
      }
    },
    async asyncData({ app, store, query }) {
      let  { cat='', key='', p = 1, t = '', s = 0, large='', mid='' } = query,
        sortType = parseInt(s)
      let params = {cat, key, p, t, s, large, mid}

      let [data, masterCate ,keywords, allLevelCategories] = await Promise.all([
          // app.GoGoHTTP.get(`/api/v3/surface/tools/search/?cat=${cat}&large=${large}&mid=${mid}&key=${key}&p=&t=${t}&s=${s}`),
          app.GoGoHTTP.get(`/api/v3/surface/tools/search`, {
            params
          }),
          app.GoGoHTTP.get('/api/v3/common/categories'),
          app.GoGoHTTP.get('/api/v3/common/keywords'),
          app.GoGoHTTP.get('/api/v3/surface/tools/categories/skill_share'),
        ])

      let categories, middCates
      if(allLevelCategories) {
        categories = allLevelCategories.large.filter(cate => cate.id != 2 && cate.id != 3)
        middCates = allLevelCategories.middle
      }
      let paging = {
        currentPage: data.currentPage,
        lastPage: data.lastPage,
        pagingFrom: data.pagingFrom,
        pagingTo: data.pagingTo,
      }
      let selectedCategories, selectedKeywords, displayCategories, largeCategoryId, middCatesSelected
      largeCategoryId = Number(large) || 1
      if(largeCategoryId === 1) {
        selectedCategories = !cat ? [] : cat.split(',').map(i => Number(i))
      } else {
        selectedCategories = !mid ? [] : mid.split(',').map(i => Number(i))
      }

      displayCategories = selectedCategories
      selectedKeywords = !key ? [] : key.split(',').map(i => Number(i)) 
      store.commit('tools/setToolsCategories', cat || [])
      store.commit('tools/setToolsKeywords', key || [])
       if(largeCategoryId === 1) {
        middCatesSelected = masterCate
      } else {
        middCatesSelected = middCates.filter(midCate => midCate.serviceCategoryLargeId == largeCategoryId)
      }

      const categoriesObj = middCatesSelected.reduce((acc, val) => {
        if(largeCategoryId === 1) {
          acc[val.categoryId] = val.name
        }
        acc[val.id] = val.name
        return acc
      }, {})
      const keywordsObj = keywords.reduce((acc, val) => {
        acc[val.keywordId] = val.name
        return acc
      }, {})

      return {
        allLevelCategories,
        middCatesSelected,
        largeCategoryId,
        masterCate,
        params,
        data,
        categories,
        categoriesObj,
        middCates,
        keywords,
        keywordsObj,
        selectedCategories,
        selectedKeywords,
        displayCategories,
        displayKeywords: selectedKeywords || [],
        dataShow: data.data,
        paging,
        sortType,
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
  background: #f0f0f0;
  border-radius: 5px;
  padding: 10px 30px;
  .search-input {
    border-radius: 5px;
    border: 1px solid #cecdce;
    .input-text {
      height: 35px;
      border: none;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      padding: 5px 10px;
      &::placeholder {
        color: #9c9c9c;
      }
    }
    .search-icon {
      background: #a0a0a0;
      color: white;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      padding: 6px;
      cursor: pointer;
      i {
        width: 30px;
        height: 30px;
      }
      &:hover {
        background: #888;
      }
    }
  }
  .selected-item {
    border-radius: 10px;
    background: #a0a0a0;
    color: white;
    font-size: 11px;
    padding: 3px 10px;
    .item-rm {
      cursor: pointer;
      padding-left: 10px;
    }
    &:hover {
      text-decoration: line-through;
    }
  }
}
.search-result {
  border-bottom: #d9d9d9 1px solid;
  .left-result {
    font-size: 20px;
    color: #7d7d7d;
    letter-spacing: 2px;
  }
  .list-sort {
    height: 30px;
    margin-bottom: 10px;
    /deep/ .sl-area {
      text-align: center !important;
      min-width: 150px !important;
      padding: 2px 15px !important;
      border-radius: 5px !important;
    }
    /deep/ .dropdown-menu {
      max-height: 400px;
      overflow-y: auto;
      border-radius: 5px !important;
      .dd-item {
        font-size: 12px;
      }
    }
  }
}
.product-wrapper div.product-vertical {
  width: 85px;
  /deep/ .prices {
    margin-top: 2px;
    margin-bottom: 3px;
    strong {
      font-weight: normal;
    }
  }
}
.left-sidebar {
  width: 240px;
  height: 100%;
  .content-list {
    border: #d9d9d9 1px solid;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    padding-bottom: 5px;
  }
  .label-hover {
    margin-bottom: 10px;
    width: 50%;
    &:nth-child(odd) {
      padding-right: 4px;
    }
    &:hover {
      opacity: 0.8;
    }
    input {
      display: none;
    }
    span {
      border: 1px solid #d9d9d9;
      float: right;
      height: 16px;
      width: 16px;
      flex: 0 0 16px;
      border-radius: 3px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    input:checked + span {
      border: 8px solid #9c3;
    }
    input:checked + span::before {
      content: '✔️';
      color: #fff;
      font-size: 12px;
    }
    &.hover2 {
      &:nth-child(2n) {
        margin-left: 10px;
      }
    }
    .item-lbl {
      font-weight: normal;
      font-size: 13px;
      margin-left: 5px;
    }
  }
  .sub-title {
    color: #2d2d2d;
    font-size: 16px;
    padding: 10px;
  }
  .btn-seach {
    width: 210px;
    height: 50px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    border: none;
    outline: none;
    border-radius: 5px;
    background: #9c3;
    box-shadow: 0 3px 0 #73a21b;
    padding-top: 4px;
    &:hover {
      opacity: 0.85;
      background: #82ad24;
    }
    &:active {
      transform: translate(0, 5px);
      -webkit-transform: translate(0, 5px);
      box-shadow: 0 1px 0 0;
    }
  }
  .list-category {
    margin: 0 10px 20px;
    /deep/ button {
      width: 100%;
      height: 35px;
      border-radius: 5px;
      border: 1px solid #9c3;
    }
  }
}
.search-header {
  background-color: #a0a0a0;
  height: 45px;
  font-size: 16px;
  color: white;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 12px 14px;
}
.w-740 {
  width: 740px;
}
.angle-right {
  width: 16px;
  height: 16px;
  color: #656d78;
}
.loading {
  .label-hover, .search-input, .selected-item {
    opacity: 0.6;
    pointer-events: none;
  }
  .dropdown.sl-QFVuO.list-sort, .dropdown.sl-QFVuO.list-category {
    opacity: 0.6;
    pointer-events: none;
  }
}
.selected-item {
  transition: all 0.8s;
  margin-bottom: 4px;
}
.selected-item-enter, .selected-item-leave-to {
  opacity: 0;
  transform: translateY(30px);
  position: absolute;
}
.selected-item-leave-active {
  position: absolute;
  opacity: 0;
}
</style>
