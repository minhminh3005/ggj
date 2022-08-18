<template>
  <div class="tools-index mt-20">
    <div class="input-form flex mid mb-20" @keyup.enter="searchClick">
      <Search @click.native="searchClick" />
      <input class="no-border" ref="input" type="text" v-model="textSearch" @focus="handleFocus(true)" @blur="handleFocus(false)" :placeholder="$t('31')" />
    </div>
    <LazyComp01 min-height="300px" v-if="videoSlider.length">
      <div class="flex mid space-between p-10 title">
        <strong class="fs-20">{{ $t(33) }}</strong>
      </div>
      <VideoSlider :list="videoSlider" />
    </LazyComp01>
    <div class="flex mid space-between p-10 title">
      <a class="fs-20" href="/tools">{{ $t('1') }}</a>
      <div class="filter-tools flex mid center" @click="showModal = true">
        {{ $t('4') }}
        <span class="arrow-down"></span>
      </div>
    </div>
    <nuxt-child :categories="categories" :keywords="keywords" :midcates="shareRoomCategoriesRaw.middle" />
    <GogoModal :show="showModal" :cancel-text="''" :ok-text="''" @update:show="val => showModal = val" class="c-modal" :width="'90vw'" :height="'80vh'">
      <div slot="title" class="modal-title pl-10">
        {{ $t('5') }}
      </div>
      <div slot="modal-body" class="modal-body p-10">
        <div class="type-title">{{ $t('6') }}</div>
        <!-- large categories -->
        <SelectBox class="list-category" :selected="selectedLargeCategory" @input="onSelectLargeCategory" :data-source="shareRoomCategoriesRaw.large" :id-val="'id'" :display="'name'" />
        <!-- medium categories or master.categories -->
        <div class="flex flex-wrap space-between mt-10" v-if="shareRoomLargeCategoriesObj[selectedLargeCategory]">
          <checkbox v-model="selectedCategories" :attrs="{ id: 'categories-'+label.id, value: label.id }" :label="label.name" v-for="label in shareRoomLargeCategoriesObj[selectedLargeCategory].mid" :key="'categories-' + label.id" class="ml-10" />
        </div>

        <!-- keywords, only show if masterCategory is selected (selectedLargeCategory === 1) -->
        <template v-if="selectedLargeCategory === 1">
          <div class="type-title mt-20">{{ $t('7') }}</div>
          <div class="flex flex-wrap space-between mt-10">
            <checkbox v-model="selectedKeywords" :attrs="{ id: 'keywords-'+label.keywordId, value: label.keywordId }" :label="label.name" v-for="label in keywords" :key="'keywords-' + label.keywordId" class="ml-10" />
          </div>
        </template>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button @click="onlickOk" v-if="$route.path != '/tools'">OK</button>
      </div>
    </GogoModal>
  </div>
</template>
<script>
import i18n from '@@/lang/mobile/tools-index.json'
import title from '@@/../common/pages'
import { setCookie } from '@/utils/client/common'
import Checkbox from '@@/../components/form/Checkbox.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import TextField from '@/components/form/TextField.vue'
import Search from '@@/../components/icons/Search.vue'
import VideoSlider from '@/components/tools/VideoSlider.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import SelectBox from '@@/../components/form/SelectBox.vue'

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
    scrollToTop: true,
    components: {
      Checkbox,
      GogoModal,
      TextField,
      Search,
      VideoSlider,
      LazyComp01,
      SelectBox
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: this.$t('1'),
        descriptionChunk: null,
        keywordsChunk: null,
        showModal: false,
        textSearch: this.$route.query.t ? this.$route.query.t : null,
        attr: {
          placeholder: this.$t('31'),
          name: 't',
          model: this.text,
        },
        middCatesSelected: [],
        shareRoomLargeCategoriesObj: {},
        shareRoomCategoriesRaw: {
          large: [],
          middle: [],
        },
      }
    },
    computed: {
      selectedCategories: {
        get() {
          return this.$store.getters['tools/getToolsCategories'] || []
        },
        set(val) {
          if (!this.isSearch) {
            location.href = `/tools/search/?cat=${val[0]}`
          }
          let cat = ((this.shareRoomLargeCategoriesObj[this.selectedLargeCategory] || {}).mid || [])
                          .filter(i => val.includes(i.id))
                          .map(i => i.name),
            key = this.selectedKeywords.map(e => this.keywordsObj[parseInt(e)]),
            str = buildTitle.call(this, { categories: cat, keywords: key })
          this.titleChunk = str || this.$t('1')
          this.descriptionChunk = str
          this.keywordsChunk = [...cat, ...key].join()
          this.$store.commit('tools/setToolsCategories', val)
          setCookie('toolsCategories', val, 5, '/tools')
        },
      },
      selectedKeywords: {
        get() {
          return this.$store.getters['tools/getToolsKeywords'] || []
        },
        set(val) {
          if (!this.isSearch) {
            location.href = `/tools/search/?key=${val[0]}`
          }
          let cat = this.selectedCategories.map(e => this.shareRoomLargeCategoriesObj[e].name),
            key = val.map(e => this.keywordsObj[e]),
            str = buildTitle.call(this, { keywords: key, categories: cat })
          this.titleChunk = str || this.$t('1')
          this.descriptionChunk = str
          this.keywordsChunk = [...cat, ...key].join()
          this.$store.commit('tools/setToolsKeywords', val)

          setCookie('toolsKeywords', val, 5, '/tools')
        },
      },
      isSearch() {
        return this.$route.fullPath.indexOf('/tools/search') > -1 ? true : false
      },
    },
    async asyncData({ app, store, req }) {
      let [categories, keywords, videoSlider, shareRoomCategoriesRaw] = await Promise.all([
          app.GoGoHTTP.get('/api/v3/common/categories'),
          app.GoGoHTTP.get('/api/v3/common/keywords'),
          app.GoGoHTTP.get('/api/v3/surface/tools/video/slider'),
          app.GoGoHTTP.get('/api/v3/surface/tools/categories/skill_share'),
        ]),
        { cat='', key='', large='', mid='' } = req.query
      const keywordsObj = keywords.reduce((acc, val) => {
        acc[val.keywordId] = val.name
        return acc
      }, {})

      large = +(large || 1)
      cat && (cat = cat.split(',').map(e => parseInt(e)))
      key && (key = key.split(',').map(e => parseInt(e)))
      store.commit('tools/setToolsCategories', cat || [])
      store.commit('tools/setToolsKeywords', key || [])

      if(large !== 1) {
        mid && (mid = mid.split(',').map(e => parseInt(e)))
        store.commit('tools/setToolsCategories', mid || [])
      }

      return {
        selectedLargeCategory: large,
        categories,
        keywords,
        keywordsObj,
        videoSlider,
        shareRoomCategoriesRaw,
      }
    },
    mounted() {
      this.middCatesSelected = []
      this.calLargeCategories()
    },
    methods: {
      calLargeCategories() {
        // init large object
        this.shareRoomLargeCategoriesObj = this.shareRoomCategoriesRaw.large.sort((a, b) => a.id - b.id).reduce((obj, item) => {
          obj[item.id] = {
            name: item.name,
            mid: [],
          }
          return obj
        }, {})

        // add middle
        this.shareRoomCategoriesRaw.middle.forEach((item) => {
          this.shareRoomLargeCategoriesObj[item.serviceCategoryLargeId] &&
          this.shareRoomLargeCategoriesObj[item.serviceCategoryLargeId].mid.push(item)
        })

        // add master categories
        // note: with large category id 1, medium is got from table "master.categories"
        let middle = this.shareRoomCategoriesRaw.middle,
          masterCategories = this.categories.map(item => ({
            id: item.categoryId,
            name: item.name,
          }))
        this.shareRoomLargeCategoriesObj[1].mid = masterCategories
        this.shareRoomCategoriesRaw.middle = middle.filter((item) => item.serviceCategoryLargeId !== 1)
                                                   .concat(masterCategories)
      },
      onSelectLargeCategory(val) {
         // hide nametags when change dropdown
        this.selectedCategories = []
        this.selectedLargeCategory = val
        this.middCatesSelected = []
        // get middle category by large category id
      },
      titleTemplate(localeDoc) {
        if (!this.selectedCategories.length && !this.selectedKeywords.length) {
          // in case there is no selected category and keyword
          // it will return the default title
          return `${this.$t('1')} - ${localeDoc.title}`
        } else {
          return `${this.titleChunk}- ${this.$t('25')}`
        }
      },
      descriptionTemplate() {
        if (this.selectedCategories.length || this.selectedKeywords.length) {
          return `${this.descriptionChunk}- ${this.$t('26')}`
        }
      },
      keywordsTemplate() {
        if (this.selectedCategories.length || this.selectedKeywords.length) {
          return `${this.keywordsChunk},${this.$t('27')}`
        }
      },
      searchClick() {
        // $(this.$refs.searchForm).submit()
        if (this.textSearch) {
          location.href = `/tools/search/?t=${this.textSearch}`
        }
      },
      handleFocus(isAddFocus) {
        if (isAddFocus) {
          this.$el.classList.add('input-form--focus')
        } else {
          this.$el.classList.remove('input-form--focus')
        }
      },
      onlickOk() {
        this.isShowModal = false
        this.onSearch()
      },
      calcSearchParams() {
        if(this.selectedLargeCategory === 1) { // check is master categories
          return {
            p: 1, // page number
            s: 0, // sort type
            key: `${this.selectedKeywords || ''}`, // keyword
            cat: `${this.selectedCategories || ''}`, // master.categories
            large: '', // large cate
            mid: '', // medium cate
            t: this.textSearch || '', // text search
          }
        }
        return {
          p: 1, // page number
          s: 0, // sort type
          large: `${this.selectedLargeCategory || ''}`, // large cate
          mid: `${this.selectedCategories || ''}`, // medium cate
          key: '', // keyword
          cat: '', // master.categories
          t: this.textSearch || '', // text search
        }
      },
      onSearch() {
        this.$nuxt.$emit('onSearch', this.calcSearchParams())
      },
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.tools-index {
  .input-form {
    padding: 0 5%;
    i {
      color: #a1a1a1;
    }
    &::before {
      width: 90%;
    }
  }
  .title {
    background: #f3f0ef;
    .fs-20 {
      font-size: 17px;
      font-weight: bold;
      color: #393939;
    }
    .filter-tools {
      font-size: 15px;
      padding: 4px 10px 3px;
      border-radius: 3px;
      border: 2px solid #e0dedc;
      background: white;
      span.arrow-down {
        margin-left: 2px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 7px 4px 0 4px;
        border-color: #7d7d7d transparent transparent transparent;
      }
    }
  }
  .modal-title {
    font-size: 16px;
    border-left: 2px solid #9c3;
  }
  .modal-body {
    height: calc(80vh - 120px);
    .type-title {
      font-weight: bold;
      color: #9c3;
      border-bottom: 2px solid #d9d9d9;
    }
    /deep/ .c-label {
      width: 40vw;
      font-weight: normal;
      margin-left: 0;
      margin-bottom: 5px;
    }
  }
  .modal-footer {
    height: 50px;
    button {
      width: 40%;
      max-width: 120px;
      color: white;
      background: #9c3;
      border: 0;
    }
  }
}
.list-category {
  /deep/ button {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
    height: 35px;
    border-radius: 5px;
  }
}
/deep/ .modal-content {
  margin: 0 20px;
}
</style>
<style lang="scss">
/* stylelint-disable */
.search-box {
  display: none;
}
/* stylelint-enable */
</style>
