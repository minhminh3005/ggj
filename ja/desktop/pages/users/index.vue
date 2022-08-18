<template>
  <div class="w-1000">
    <div class="flex space-between mt-20">
      <!-- LEFT -->
      <div class="left-sidebar">
        <!-- left title -->
        <div class="w-full search-header">
          {{ $t(16) }}
        </div>

        <!-- filters -->
        <div class="content-list w-full">
          <!-- user type -->
          <div class="sub-title">
            <b>{{ $t(1) }}</b>
          </div>
          <div class="flex layout-col flex-wrap w-full" style="max-width: calc(100% - 20px); border-bottom: #d9d9d9 1px solid; margin: 10px;" :style="{'height': (userTypes.length * 18) + 'px'}">
            <label class="ml-0 label-hover flex mid cursor-pointer" v-for="item in userTypes" :key="'cate-' + item.value">
              <input
                :disabled="isLoading"
                type="checkbox"
                name="selectedUserTypes"
                :value="item.value"
                v-model="ut"
              />
              <span></span>
              <div class="item-lbl">{{ item.name }}</div>
            </label>
          </div>

          <!-- review type -->
          <div class="sub-title">
            <b>{{ $t(2) }}</b>
          </div>
          <div class="flex flex-wrap" style="max-width: calc(100% - 20px); height: auto; border-bottom: #d9d9d9 1px solid; margin: 0 10px 10px 10px;">
            <label class="ml-0 label-hover flex mid cursor-pointer" v-for="item in reviewTypes" :key="'review-type-' + item.value">
              <div class="flex mid">
                <input
                  :disabled="isLoading"
                  type="checkbox"
                  name="selectedReviewTypes"
                  :value="item.value"
                  v-model="rt"
                />
                <span></span>
                <div class="item-lbl">{{ item.name }}</div>
              </div>
            </label>
          </div>

          <!-- active type -->
          <div class="sub-title">
            <b>{{ $t(3) }}</b>
          </div>
          <!--  -->
          <label class="ml-0 label-hover flex mid cursor-pointer ml-10" :key="'active-type-all'">
            <div class="flex mid radio">
              <input
                :disabled="isLoading"
                type="radio"
                name="selectedReviewTypes"
                :value="0"
                v-model="at"
              />
              <span></span>
              <div class="item-lbl">{{ $t('type-all') }}</div>
            </div>
          </label>
          <!--  -->
          <div class="flex flex-wrap" style="height: auto; border-bottom: #d9d9d9 1px solid; margin: 0 10px 10px 10px;">
            <label class="ml-0 label-hover flex mid cursor-pointer" v-for="item in activeTypes" :key="'active-type-' + item.value">
              <div class="flex mid radio">
                <input
                  :disabled="isLoading"
                  type="radio"
                  name="selectedActiveTypes"
                  :value="item.value"
                  v-model="at"
                />
                <span></span>
                <div class="item-lbl">{{ item.name }}</div>
              </div>
            </label>
          </div>

          <!-- button -->
          <div class="flex flex-wrap" style="margin: 10px;">
            <button class="btn-search" @click="onSearch" :disabled="isLoading">
              {{ $t(4) }}
            </button>
          </div>
        </div>
      </div>
      <!-- RIGHT -->
      <section class="w-740" style="min-height: 1600px;">
        <!-- search bar -->
        <div class="search-wrap w-full">
          <div class="search-input">
            <div class="w-full flex mid space-between">
              <input
                :disabled="isLoading"
                type="text"
                name="condition"
                v-model="keyword"
                :placeholder="$t(7)"
                class="input-text w-full fs-13"
                @keyup.enter="onSearch"
                maxlength="1000"
              />
              <Search class="search-icon" :class="{ disabled: isLoading }" @click.native="onSearch" />
            </div>
          </div>
        </div>

        <!-- filter selected -->
        <div class="mt-20">
          <b class="title-selected">{{ $t(8) }}</b>
        </div>

        <!-- list filter selected -->
        <transition-group
          name="filter-list"
          class="search-wrap w-full flex flex-wrap"
          style="min-height: 48px; position: relative;"
        >
          <div
            v-for="(item, i) in selectedFilter"
            :key="`${item.value}-${item.type}`"
            :class="{ disabled: isLoading, 'no-remove': item.type === 'at' && item.value === 0 }"
            class="selected-item cursor-pointer wrap-text"
            @click="onRemoveFilter(item, i)"
          >
            <span>{{ item.name }}</span>
            <span class="item-rm">×</span>
          </div>
        </transition-group>

        <!-- list info -->
        <div class="flex mid mt-20 space-between pb-5" style="border-bottom: 1px solid #d9d9d9; height: 42px;">
          <div>
            <span style="font-size: 18px;" class="mr-10">{{ $t(9) }}</span>
            <span style="font-size: 18px;">{{ $t(10, { total: users.total }) }}</span>
          </div>
          <SelectBox
            class="list-sort"
            :class="{ disabled: isLoading }"
            :selected="st"
            v-model="st"
            @input="onSearch"
            :data-source="sortTypes"
            id-val="id"
            display="text"
          />
        </div>

        <!-- dots info -->
        <div class="text-center mt-15 mb-10">
          <span class="text-ut-red" style="margin-right: 45px;">
            <span>{{ $t(11) }}</span>
          </span>
          <span class="text-ut-green">
            <span>{{ $t(12) }}</span>
          </span>
        </div>

        <!-- CASE 1 - in process -->
        <div v-if="isLoading" style="min-height: 1600px;">
          <Loading />
        </div>

        <!-- CASE 2 - no data -->
        <div v-else-if="!users.data.length" class="no-data">{{ this.$t('user-not-found') }}</div>

        <!-- CASE 3 - list of users -->
        <template v-else>
          <!-- list item -->
          <div class="flex flex-wrap mt-10">
            <UserCard
              v-for="(userInfo, index) in users.data || []"
              :key="userInfo.userId + index"
              :user-info="userInfo"
            />
          </div>

          <!-- paging -->
          <div class="text-center mt-25">
            <paging
              :cur-page="users.currentPage"
              :total="users.lastPage"
              :from="users.pagingFrom"
              :to="users.pagingTo"
              theme-class="theme4"
              @pagingclick="onPagingClick"
            />
          </div>
        </template>
      </section>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/users-index.json'
import Search from '@@/../components/icons/Search.vue'
import UserCard from '@/components/user/UserCard.vue'
import title from '@@/../common/pages'
import SelectBox from '@@/../components/form/SelectBox.vue'
import Paging from '@@/../components/paging/Paging.vue'
import Loading from '@@/../components/icons/Loading.vue'
import { pushState } from '@/utils/client/common'
if (process.browser) {
  require('@@/../common/assets/owl.carousel.css')
  require('owl.carousel/dist/assets/owl.theme.default.css')
  require('owl.carousel')
}
const DEFAULT_PARAMS = {
  ut: [1,2],
  rt: [0, 1, 2, 3, 4, 5],
  at: 1,
  st: 1,
  keyword: '',
  page: 1,
  limit: 12,
}
const obj = Object.assign(
  {
    components: {
      Paging,
      Search,
      SelectBox,
      UserCard,
      Loading,
    },
    data() {
      return {
        userTypes: [
          {
            value: 1, // 'developer',
            name: this.$t('user-type-developer'),
          },
          {
            value: 2, // 'reviewer',
            name: this.$t('user-type-reviewer'),
          },
        ],
        reviewTypes: [
          {
            value: 5,
            name: this.$t('review-type', { num: 5 }),
          },
          {
            value: 4,
            name: this.$t('review-type', { num: 4 }),
          },
          {
            value: 3,
            name: this.$t('review-type', { num: 3 }),
          },
          {
            value: 2,
            name: this.$t('review-type', { num: 2 }),
          },
          {
            value: 1,
            name: this.$t('review-type', { num: 1 }),
          },
          {
            value: 0,
            name: this.$t('review-type-other'),
          },
        ],
        activeTypes: [
          // {
          //   value: 0, // 'all',
          //   name: this.$t('type-all'),
          // },
          {
            value: 1, // '1 month',
            name: this.$t('active-type', { num: 1 }),
          },
          {
            value: 3, // '3 month',
            name: this.$t('active-type', { num: 3 }),
          },
          {
            value: 6, // '6 month',
            name: this.$t('active-type', { num: 6 }),
          },
          {
            value: 12, // '12 month',
            name: this.$t('active-type', { num: 12 }),
          },
          {
            value: 24, // '24 month',
            name: this.$t('active-type', { num: 24 }),
          },
        ],
        sortTypes: [
          {
            id: 1,
            text: this.$t(13)
          },{
            id: 2,
            text: this.$t(14)
          },
        ],
        selectedFilter: [],
        isLoading: false,
        searchDebounce: this.debounce(this.onSearch.bind(this), 1e3),
      }
    },
    i18n: {
      messages: i18n,
    },
    mounted() {
      this.calcSelectedFilter()
      this.calcRank()
    },
    methods: {
      titleTemplate() {
        return this.$t('meta-title')
      },
      descriptionTemplate() {
        return this.$t('meta-des')
      },
      keywordsTemplate() {
        return this.$t('meta-keyword')
      },
      onRemoveFilter(item, i) {
        // special case
        // action type is radio button, keep least one item at filter bar
        if(item.type === 'at') {
          // if value is 0, do nothing
          if(!item.value) {
            return
          }
          this.at = 0
          this.selectedFilter.push({
            value: 0, // all action type
            name: this.$t('type-all'),
            type: 'at'
          })
        } else {
          this.$set(this, item.type, this[item.type].filter(_i => +_i !== +item.value))
        }
        this.selectedFilter.splice(i, 1)

        // debounce search until user finish remove
        this.searchDebounce()
      },
      calcSelectedFilter() {
        this.selectedFilter = [
          // calcSelectedFilter following reviewType selected
          ...[ ...this.reviewTypes ].reduce((arr, item) => {
            if(`${this.rt}`.includes(item.value)) {
              return [...arr, { ...item, type: 'rt'}]
            }
            return arr
          }, []),

          // calcSelectedFilter following userType selected
          ...this.userTypes.reduce((arr, item) => {
            if(`${this.ut}`.includes(item.value)) {
              return [...arr, { ...item, type: 'ut'}]
            }
            return arr
          }, []),

          // calcSelectedFilter following activeType selected
          ...[...this.activeTypes, { value: 0, name: this.$t('type-all') }].reduce((arr, item) => {
            if(item.value === +this.at) {
              return [...arr, { ...item, type: 'at'}]
            }
            return arr
          }, []),
        ]
      },
      onPagingClick(page) {
        this.page = page
        $('html, body').animate({ scrollTop: 0 }, 'slow')
        setTimeout(() => this.onSearch(false), 7e2)
      },
      onSearch(resetPage = true) {
        // check process
        if(this.isLoading) {
          return
        }

        //
        if(resetPage) {
          this.page = 1
        }

        // on search
        this.isLoading = true
        const params = {
          ut: `${ this.ut }`, // integrating api, will be empty string if un-tick all
          rt: `${ this.rt }`, // integrating api, will be   0   string if un-tick all
          at: `${ this.at }`,
          st: +this.st,
          keyword: this.keyword || DEFAULT_PARAMS.keyword,
          page: this.page ||  DEFAULT_PARAMS.page,
          limit: this.limit || DEFAULT_PARAMS.limit,
        }

        // remove empty string in params
        // Object.keys(params).forEach(key => !params[key] ? delete params[key] : null)

        // push state
        pushState(`${this.getParamsSearchString()}`)

        // GET
        this.calcSelectedFilter()
        this.GoGoHTTP.get('/api/user/v2/rankings', {
          params
        }).then(users => {
          this.users = users
          this.calcRank()
        }).finally(() => {
          this.isLoading = false
        })
      },
      calcRank() {
        let offsetNum = this.limit*(this.users.currentPage - 1)
        this.$set(this.users, 'data', this.users.data.map((item, index) => ({
          rankId: offsetNum + index + 1,
          ...item,
        })))
      },
      getParamsSearchString() {
        let paramObj = {
          at: this.at.toString(),
          rt: this.rt.toString(),
          st: this.st.toString(),
          ut: this.ut.toString(),
          keyword: this.keyword,
          page: this.page,
          limit: 12,
        },
        arrStr = Object.keys(paramObj)
                .reduce(
                  (array, key) => (
                    paramObj[key]
                      ? [...array, `${key}=${paramObj[key]}`]
                      : array
                    ),
                  []
                )
        return `?${arrStr.join('&')}`
      },
    },
    async asyncData({ app, query }) {
      let ut = query.ut
                  ? (query.ut || '')
                      .split(',')
                      .reduce((arr, item) => item ? [...arr, +item] : arr, [])
                  : DEFAULT_PARAMS.ut,
        rt = query.rt
                  ? (query.rt || '')
                      .split(',')
                      .reduce((arr, item) => item ? [...arr, +item] : arr, [])
                  : DEFAULT_PARAMS.rt,
        at = +query.at || DEFAULT_PARAMS.at,
        st = +query.st || DEFAULT_PARAMS.st,
        keyword = query.keyword || DEFAULT_PARAMS.keyword,
        page = query.page || DEFAULT_PARAMS.page,
        limit = query.limit || DEFAULT_PARAMS.limit,
        users = await app.GoGoHTTP.get(
          '/api/user/v2/rankings',
          {
            params: {
              ut: ut.toString(),
              rt: rt.toString(),
              at,
              st,
              keyword,
              page,
              limit,
            },
          },
        )

      return {
        users,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/users`,
          },
        ],
        meta: [
          {
            name: 'viewport',
            content: 'width=device-width',
          }
        ],
        // params --------------------------------------
        ut,
        rt,
        at,
        st,
        keyword,
        page,
        limit,
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
.search-wrap {
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
      &.disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }
  }
  .selected-item {
    border-radius: 10px;
    background: #a0a0a0;
    color: white;
    font-size: 11px;
    padding: 3px 10px;
    margin: 3px 10px 3px 0;
    height: 22px;
    transition: all 0.8s;
    display: inline-block;
    margin-right: 10px;
    .item-rm {
      cursor: pointer;
      padding-left: 10px;
    }
    &.no-remove {
      .item-rm {
        display: none;
      }
      &:hover {
        text-decoration: none;
      }
    }
    &:hover {
      text-decoration: line-through;
      opacity: 0.8;
    }
    &.disabled {
      pointer-events: none;
      opacity: 0.3;
    }
  }
  .filter-list-enter, .filter-list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  .filter-list-leave-active {
    position: absolute;
  }
}
.list-sort {
  height: 30px;
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
  &.disabled {
    opacity: 0.3;
    /deep/ .dropdown-menu {
      display: none;
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
    min-width: 50%;
    margin-bottom: 5px;
    height: 28px;
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
      position: relative;
    }
    input:checked + span {
      border: 8px solid #9c3;
    }
    input:disabled + span {
      opacity: 0.6;
    }
    input[type="checkbox"]:checked + span::before {
      content: '';
      color: #fff;
      font-size: 12px;
      height: 10px;
      width: 6px;
      background: #9c3;
      display: block;
      position: absolute;
      border: 2px solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(46deg);
      top: -7px;
      right: -3px;
    }
    .radio {
      span {
        border-radius: 10px;
      }
      input:checked + span::before {
        content: '';
        color: #fff;
        font-size: 12px;
        border: 4px solid #9c3;
        border-radius: 4px;
        box-shadow: 0 0 0 2px white;
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
  .btn-search {
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
    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    &:active {
      transform: translate(0, 5px);
      -webkit-transform: translate(0, 5px);
      box-shadow: 0 1px 0 0;
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
.text-ut {
  @mixin dot($color) {
    position: relative;
    padding-left: 18px;
    ::after {
      content: '';
      position: absolute;
      display: block;
      height: 13px;
      width: 13px;
      border-radius: 10px;
      background-color: $color;
      top: 3px;
      left: 0;
    }
  }
  &-red {
    @include dot(#EC6878);
  }
  &-green {
    @include dot(#21BA9B);
  }
}
.no-data {
  color: #6e757e;
  text-align: center;
  height: 200px;
  font-size: 20px;
  border-radius: 5px;
  margin-top: 30px;
}
</style>
