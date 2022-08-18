<template>
  <div>
    <div class="navi-left-menu">
      <div class="status-list follow flex mid">
        <span @click="selectFollowType(0)" :class="{selected: !selectFollowed}">{{ $t('7') }}</span>
        <span @click="selectFollowType(1)" :class="{selected: selectFollowed}">{{ $t('8') }}</span>
      </div>
      <div class="status-list price flex mid">
        <span @click="selectPlan(-1, true)" :class="{selected: selectedPlan === -1}">{{ $t('1') }}</span>
        <span @click="selectPlan(1, true)" :class="{selected: selectedPlan === 1}">{{ $t('2') }}</span>
        <span @click="selectPlan(0, true)" :class="{selected: selectedPlan === 0}">{{ $t('3') }}</span>
      </div>
      <div class="category inline-flex mt-40">
        <span style="display: inline-block; margin-right: 10px; font-size: 13px;">{{ $t('4') }}:</span>
        <div class="flex layout-col list-item" style="font-size: 13px;">
          <span :class="{selected: !selectedCategory}" @click="selectCategory(0, true)">{{ $t('5') }}</span>
          <span v-for="category in categories" :key="category.id" @click="selectCategory(category.id, true)" :class="{selected: selectedCategory === category.id}">
            {{ category.categoryName }}
          </span>
        </div>
      </div>
      <div class="divider"></div>
      <!-- HASHTAG -->
      <div class="hashtag inline-flex">
        <span style="display: inline-block; margin-right: 10px; font-size: 13px; min-width: 60px;">{{ $t('14') }}:</span>
        <div class="flex layout-col list-item" style="font-size: 13px;">
          <a :href="`${SEARCH_URL}&h=${hashtag.hashtag}`" class="flex wrapper-item" v-for="(hashtag) in hashtags" :key="hashtag.id">
            <span class="hashtag-item">
              <span :title="hashtag.hashtag" class="hashtag-name clamp clamp-1">#{{ hashtag.hashtag }}</span>
              <span class="hashtag-number">{{ hashtag.count }}件</span>
            </span>
          </a>
        </div>
      </div>
    </div>
    <div class="navi-left-menu-mobile w-full">
      <div class="status-title">{{ $t('9') }}</div>
      <div class="flex space-between mt-20">
        <div class="status-list flex mid">
          <span @click="selectFollowType(0)" :class="{selected: !selectFollowed}">{{ $t('7') }}</span>
          <span @click="selectFollowType(1)" :class="{selected: selectFollowed}">{{ $t('8') }}</span>
        </div>
        <div class="filter-icon" @click="openModal"><FilterIcon /></div>
      </div>
      <div class="user-info-mobile">
        <GogoModal :show="showModal" @update:show="val => showModal = val" class="c-modal">
          <div slot="title" class="flex center"></div>
          <div slot="modal-body" class="flex layout-col share-body space-between">
            <div>
              <div class="title">
                {{ $t('10') }}
              </div>
              <div class="action-list">
                <button type="button" class="all btn" @click="selectPlan(-1)" :class="{selected: selectedPlan === -1}">{{ $t('1') }}</button>
                <button type="button" class="all btn" @click="selectPlan(1)" :class="{selected: selectedPlan === 1}">{{ $t('2') }}</button>
                <button type="button" class="all btn" @click="selectPlan(0)" :class="{selected: selectedPlan === 0}">{{ $t('3') }}</button>
              </div>
              <div class="title mt-20">{{ $t('11') }}</div>
              <div class="action-list">
                <button type="button" class="all btn" @click="selectCategory(0)" :class="{selected: !selectedCategory}">{{ $t('5') }}</button>
                <button type="button" class="all btn" v-for="category in categories" :key="category.id" @click="selectCategory(category.id)" :class="{selected: selectedCategory === category.id}">
                  {{ category.categoryName }}
                </button>
              </div>
            </div>
            <div class="btn-navi">
              <button @click="onSearch">{{ $t('12') }}</button>
            </div>
          </div>
          <div slot="modal-footer"></div>
        </GogoModal>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components/navi-left-menu.json'
import FilterIcon from '@@/../components/icons/FilterIcon.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import { SEARCH_URL } from '@@/../common/assets/consts/common'

export default {
  name: 'NaviLeftMenu',
  i18n: {
    messages: i18n,
  },
  components: {
    FilterIcon,
    GogoModal
  },
  props: {
    hashtags: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    const query = this.$route.query || {},
        plan = +query.plan,
        followed = query.filters
    return {
      SEARCH_URL,
      selectFollowed: followed === 'followed' ? 1 : 0,
      selectedPlan: plan == 0 ? 0 : (plan || -1),
      selectedCategory: +query.category || 0,
      showModal: false,
    }
  },
  computed: {
    categories() {
      return this.$store.getters['finance/naviCategories'] || []
    },
  },
  methods: {
    openModal() {
      this.showModal = true
    },
    selectFollowType(val) {
      this.selectFollowed = val
      this.$emit('set-followed', val)
    },
    selectPlan(value, isDesktop = false) {
      const {plan} = this.$route.query || {}
      if (value === plan) return
      this.selectedPlan = value
      if(isDesktop) this.$emit('set-plan', value)
    },
    selectCategory(value, isDesktop) {
      const {category} = this.$route.query || {}
      if (value === category) return
      this.selectedCategory = value
      if(isDesktop) this.$emit('set-category', value)
    },
    onSearch() {
      this.$emit('select-search', {
        plan: this.selectedPlan,
        category: this.selectedCategory
      })
      this.showModal = false
    },
  }
}
</script>

<style scoped lang="scss">
@import "@@/../common/assets/variables.scss";

$btn: #333;
$white: #fff;
$grey: #777;
$icon: #757575;
@media all and (max-width: $screen-md-navi) {
  .navi-left-menu-mobile {
    position: relative;
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    display: flex !important;
    flex-wrap: wrap;
    flex-direction: column;
  }
}
@media all and (min-width: 1230px) {
  .navi-left-menu {
    display: flex !important;
    flex-direction: column;
    width: 300px;
  }
}
// DESKTOP
.navi-left-menu {
  display: none;
  padding-left: 50px;
  .divider {
    height: 1px;
    width: 100%;
    margin: 10px 0;
    background-color: #f5f5f5;
  }
  * {
    color: $grey;
    &.selected {
      font-weight: bold;
      color: $btn;
    }
  }
  .status-list {
    margin-top: 40px;
    margin-left: -16px;
    .selected {
      color: $white;
      background: $btn;
      &:hover {
        color: $white;
      }
    }
    &.follow {
      span {
        margin-right: 20px;
      }
    }
    &.price {
      span {
        margin-right: 10px;
      }
    }
    span {
      padding: 8px 16px;
      border-radius: 20px;
      color: #2d2d2d4d;
      font-weight: bold;
      display: inline-block;
      font-size: 13px;
      cursor: pointer;
      text-align: start;
      transition: 0.3s;
      &:hover {
        color: $grey;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .category {
    .list-item {
      span {
        cursor: pointer;
        height: 2em;
        font-size: 13px;
        &:hover {
          color: $btn;
        }
      }
    }
  }
  .hashtag {
    border: none;
    margin-top: 22px;
    .list-item {
      a {
        margin-bottom: 16px;
        .hashtag-item {
          display: flex;
          flex-direction: column;
          justify-content: start;
          text-align: left;
          .hashtag-name {
            padding-right: 30px;
            word-break: break-word;
          }
          .hashtag-number {
            color: #2D2D2D4D;
          }
        }
        &:hover {
          text-decoration: none;
          .hashtag-name {
            color: #333;
          }
        }
      }
    }
  }
}
@media only screen and (max-width: 1440px) {
  .navi-left-menu {
    padding-left: 30px;
  }
}
// MOBILE
.navi-left-menu-mobile {
  display: none;
  padding-top: 20px;
  @media only screen and (max-width: 1000px) {
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 25px;
  }
  button {
    outline: none;
    &:active {
      outline-offset: unset;
    }
  }
  .btn {
    font-size: 13px;
    padding: 7px 16px;
    border-radius: 2px;
  }
}
.status-list {
  .selected {
    color: $white !important;
    background: $btn;
  }
  span {
    color: #2d2d2d4d !important;
    font-weight: bold;
    display: inline-block;
    margin-right: 10px;
    font-size: 13px;
    cursor: pointer;
    text-align: start;
    padding: 8px 16px;
    border-radius: 20px;
    transition: 0.3s;
    &:hover {
      color: #2c2c2c;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
.status-title {
  font-size: 21px;
  font-weight: bold;
}
.filter-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
  }
  i.icon-cls {
    width: 22px;
    height: 22px;
    /deep/ svg {
      path {
        fill: $icon;
      }
    }
  }
}
.c-modal /deep/ {
  .modal-dialog {
    display: flex;
    align-items: center;
    height: 100vh;
    margin: auto;
    padding-bottom: 39px;
  }
  .modal-header {
    height: 30px;
    padding: 0;
    position: relative;
    background: $white;
    border-radius: 3px 3px 0 0 !important;
    border-bottom: none;
  }
  .modal-content {
    width: calc(100% - 60px);
    border: none;
    margin-left: 30px;
    margin-right: 30px;
    border-radius: 3px;
  }
  .close {
    padding: 6px;
    margin: 0;
    position: absolute;
    right: 0;
    font-size: 22px;
  }
}
.share-body {
  height: calc(100% - 45px);
  overflow-y: auto;
  padding: 15px;
  .title {
    font-size: 15px;
    color: $btn;
    font-weight: bold;
  }
  .action-list {
    margin-bottom: 10px;
    margin-top: 10px;
    gap: 10px;
    display: flex;
    flex-wrap: wrap;
    .btn {
      color: $icon;
      &.selected {
        color: $white;
        background: $btn;
      }
    }
  }
}
.btn-navi {
  text-align: center;
  button {
    width: 160px;
    height: 34px;
    background: #73cdd6;
    border-radius: 2px;
    color: $white;
    text-decoration: none;
    border: none;
  }
}
</style>
