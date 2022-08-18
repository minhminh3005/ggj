<template>
  <div class="flex space-between app-header" :class="headerClass">
    <div v-if="isArticleDetailPage" class="header-series inline-flex mid">
      <span>{{ $t('26') }}</span>
      <a href="/">{{ $t('22') }}</a>
    </div>
    <div v-if="!hideBackBtn" class="back-actions inline-flex mid">
      <navi-back-btn :link="backLink" :label="backLabel" />
    </div>
    <div v-else class="header-series inline-flex mid">
      <span>{{ backLabel }}</span>
      <a href="/">{{ $t('22') }}</a>
    </div>
    <div v-if="hideBackBtn && isSeriesDetailPage" class="back-series">
      <navi-back-btn link="/finance/navi/series" :label="$t('20')" />
    </div>
    <div class="header-logo flex space-between" :class="isArticleDetailPage ? 'header-detail-logo' : 'w-full'">
      <div class="navi-logo" :class="{'hide-logo': isArticleDetailPage, 'hide-logo-series': isSeriesDetailPage}">
        <a href="/finance/navi" style="text-decoration: none;">
          <SeriesLogo />
        </a>
        <a href="/finance/navi" style="text-decoration: none;" class="logo-icon">
          <NaviLogoIcon />
        </a>
      </div>
      <div class="user-info inline-flex">
        <template v-if="account && account.id">
          <div class="user-name dropdown">
            <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              <div class="name">{{ account.name || $t('21') }}</div>
              <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
              <li>
                <a href="/mypage" class="inline-flex">
                  <User />&nbsp;{{ $t('19') }}
                </a>
              </li>
              <li>
                <a href="/info" class="inline-flex">
                  <CommentDots />&nbsp;{{ $t('1') }}
                </a>
              </li>
              <li><a href="/post/1/15363" style="color: #5844ac;">{{ $t('2') }}</a></li>
              <li><a href="/post/1/15356" style="color: #ff1493;">{{ $t('3') }}</a></li>
              <li><a href="/post/1/15376"><BookOpen />&nbsp;{{ $t('4') }}</a></li>
            </ul>
          </div>
          <a href="/" class="gg-text">{{ $t('25') }}</a>
          <div class="user-info-mobile" @click="onClickUser">
            <NaviUserIcon class="header-item" />
          </div>
          <!-- notify icon -->
          <div class="header-item pos-rel" @click="$nuxt.$emit('toggleShowNotification')">
            <Bell class="bell-icon" />
            <div v-if="countInfo.total" class="center flex mid num">{{ countInfo.total > 100 ? '99+' : countInfo.total }}</div>
          </div>
        </template>
        <!-- <a class="cart-info-container" href="/cart" :class="{'hidden-xs hidden-sm' : account.id}"> -->
        <a class="cart-info-container hidden-xs hidden-sm" href="/cart">
          <ShopingCart class="header-item" />
          <span class="number-item-in-cart" v-if="cartNumberItem">{{ cartNumberItem }}</span>
        </a>
        <a href="/" class="gg-text" v-if="!account || !account.id">{{ $t('25') }}</a>
        <a v-if="!account || !account.id" :href="`/login?u=${$route.fullPath}`" class="max-text btn-login flex mid center">{{ $t('5') }}</a>
        <a class="btn-navi flex mid center" :class="{'ml-20': !account.id }" v-if="rightLabel" :href="naviButtonUrl">
          {{ rightLabel }}
        </a>
        <NotiBox ref="notiBox" />
      </div>
    </div>
    <div class="user-info-mobile">
      <GogoModal :show="showModal" @update:show="val => showModal = val" class="c-modal">
        <div slot="title" class="flex center"></div>
        <div slot="modal-body" class="share-body">
          <div class="info">
            <div class="account-name wrap-text"> {{ account.name }}</div>
            <div class="go-home"><a href="/mypage">{{ $t('6') }}</a></div>
            <div class="logout"><a href="/logout">{{ $t('7') }}</a></div>
          </div>

          <div class="info-bar">
            <ToggleTab :id="1" :title="$t('8')" :data="favData.follow" />
            <ToggleTab :id="2" :title="$t('9')" :data="favData.favorite" />
            <ToggleTab :id="3" :title="$t('10')" :data="favData.purchased" />
            <ToggleTab v-if="account.id" :id="4" :title="$t('23')" :data="favData.following" />
            <ToggleTab v-if="account.id && account.isNaviAuthor" :id="5" :title="$t('24')" :data="favData.follower" />
          </div>

          <div class="action-creation">
            <a class="btn-navi flex mid center" v-if="rightLabel" :href="naviButtonUrl">
              {{ rightLabel }}
            </a>
          </div>

          <div class="action-list">
            <div class="action-item">
              <HomeIcon class="home" width="27px" fill="#757575" />
              <a class="action-item-title" href="/">{{ $t('11') }}</a>
            </div>

            <div class="action-item">
              <a class="cart-info-container" href="/cart">
                <ShopingCart class="header-item" />
                <span class="number-item-in-cart" v-if="cartNumberItem">{{ cartNumberItem }}</span>
              </a>
              <a href="/cart" class="action-item-title-cart">{{ $t('12') }}</a>
            </div>

            <div class="action-item">
              <a href="/info">
                <CommentDots />
                <span class="action-item-title">{{ $t('13') }}</span>
              </a>
            </div>

            <div class="action-item">
              <a href="/post/1/15376">
                <BookOpen />
                <span class="action-item-title">{{ $t('14') }}</span>
              </a>
            </div>
          </div>
        </div>
        <div slot="modal-footer"></div>
      </GogoModal>
    </div>
  </div>
</template>
<script>
import NaviBackBtn from "@@/../common/components/back-button"
import ShopingCart from '@@/../components/icons/ShopingCart.vue'
import Bell from '@@/../components/icons/Bell.vue'
import HomeIcon from "@@/../common/components/home-icon"
import NaviUserIcon from "@@/../common/components/navi/navi-user-icon"
import User from '@@/../components/icons/User.vue'
import CommentDots from '@@/../components/icons/CommentDots.vue'
import BookOpen from '@@/../components/icons/BookOpen.vue'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import ToggleTab from "@@/../common/components/toggle-tab"
import i18n from '@@/lang/components-desktop/navi-header.json'
import NaviMixin from '@@/../common/containers/navi/mixin'
import NaviLogoIcon from "@@/../common/components/navi/navi-logo-icon"
import SeriesLogo from '@@/../components/icons/SeriesLogo.vue'
import NotiBox from '@@/../components/header/NotiBox.vue'

export default {
  name: "AppHeader",
  mixins: [NaviMixin],
  components: {
    SeriesLogo,
    NaviBackBtn,
    User,
    CommentDots,
    BookOpen,
    NaviUserIcon,
    NaviLogoIcon,
    GogoModal,
    ToggleTab,
    ShopingCart,
    Bell,
    HomeIcon,
    NotiBox
  },
  i18n: {
    messages: i18n,
  },
  props: {
    userName: {
      type: String,
      default: ''
    },
    backLabel: {
      type: String,
      default: ''
    },
    backLink: {
      type: String,
      default: ''
    },
    rightLabel: {
      type: String,
      default: ''
    },
    hideBackBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showModal: false,
    }
  },
  computed: {
    countInfo() {
      return this.$store.getters['notification/count'] || {}
    },
    /**
     * @returns {{id: number, name: string, isBuyuser: boolean}}
     */
    account() {
      return this.$store.state.user
    },
    cartNumberItem() {
      return this.$store.state.cartCnt
    },
    article() {
      return this.$store.getters['finance/selectedArticle']
    },
    naviButtonUrl() {
      if (!this.account) return '/login'
      return this.account.isBuyuser ? '/mypage/display' : '/mypage/display/navi/list'
    },
    favData() {
      return this.$store.getters['finance/getFavData']
    },
    headerClass() {
      let classes = ''
      if(this.isSeriesDetailPage || this.isArticleDetailPage) classes += ' header-detail-page'
      if(this.hideBackBtn) {
        classes += ' app-header-series'
        if(!this.isSeriesDetailPage) {
          classes += ' header-flex-end'   
        }
      }
      return classes
    }
  },
  mounted() {
    this.GoGoHTTP.get('/api/v3/surface/cart/count').then(data => {
      this.$store.commit('setCartCount', data.count || 0)
    })
  },
  methods: {
    onClickUser() {
      this.showModal = true
    }
  }
}
</script>
<style scoped lang="scss">
@import "@@/../common/assets/variables.scss";

$icon-color: #b2b2b2;
$grey1: #c9c9c9;
$grey2: #a2a2a2;
$grey3: #757575;
/deep/ .noti-box-ctn {
  width: 100%;
  .noti-box {
    position: fixed !important;
    top: 0;
    right: 0 !important;
    width: 100vw !important;
    @media only screen and (min-width: $screen-md) {
      position: absolute !important;
      max-height: calc(100vh - 178px) !important;
      width: 480px !important;
      background: #fff;
      z-index: 10;
      top: 75px;
      transition: opacity 0.5s ease-out;
      opacity: 0;
    }
  }
}
.navi {
  &-logo {
    display: flex;
    align-items: center;
    .logo-icon {
      width: 111px;
      margin-left: 8px;
    }
  }
}
.hide-logo {
  visibility: hidden;
}
.home {
  display: none;
}
.header-detail-logo {
  height: 51px;
}
i.icon-cls-logo {
  display: inline-block;
  color: $grey1;
  width: 31px;
}
.btn-login {
  color: #73cdd6;
  border: solid 1px #73cdd6;
  border-radius: 4px;
  width: 80px;
  height: 32px;
  &:hover {
    text-decoration: none;
  }
}
.app-header {
  padding: 0 40px;
  flex-wrap: wrap;
  &.app-header-series {
    background: #fff;
    border: none;
    .back-series {
      display: none;
      @media only screen and (max-width: $screen-sm) {
        display: inline-flex;
      }
    }
  }
  .header-series {
    height: 46px;
    width: 100%;
    font-size: 10px;
    color: $grey2;
    justify-content: space-between;
    @media only screen and (max-width: $screen-sm) {
      display: none;
    }
    a {
      color: $grey2;
      cursor: pointer;
      text-decoration: underline;
    }
  }
  @media only screen and (max-width: $screen-sm) {
    padding: 10px 20px;
    &.header-flex-end {
      justify-content: flex-end;
    }
    .btn-login {
      margin-right: 15px;
    }
    .home {
      display: block;
    }
  }
  @media only screen and (max-width: 425px) {
    height: 24px;
    padding: 10px;
    display: flex;
  }
  .title {
    font-size: 1rem;
    color: #666 !important;
    @media only screen and (max-width: $screen-sm) {
      display: none;
    }
  }
  .user-name {
    font-size: 16px;
    color: #666 !important;
    margin-right: 20px;
    .name {
      margin-right: 8px;
      text-overflow: ellipsis;
      max-width: 264px;
      overflow: hidden;
    }
    button {
      border: none;
      display: flex;
      align-items: center;
      @media only screen and (max-width: $screen-sm) {
        font-size: 16px;
      }
      &:hover {
        border: none;
        background: transparent;
      }
    }
    /deep/ ul li a {
      display: inline-flex !important;
      width: 100%;
      align-items: center;
      height: 36px;
      padding: 10px 15px !important;
      i { margin-top: 4px; }
      svg {
        width: 30px !important;
        height: 30px !important;
        path {
          fill: #888 !important;
        }
      }
    }
  }
  .cart-info-container {
    position: relative;
    color: $icon-color;
    .number-item-in-cart {
      position: absolute;
      top: -2px;
      right: 13px;
      background-color: #ff8500;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      color: white;
      text-align: center;
      vertical-align: center;
      font-size: 11px;
    }
  }
}
.user-info {
  align-items: center;
  flex-wrap: wrap;
  .max-text {
    text-overflow: ellipsis;
    max-width: 264px;
    overflow: hidden;
  }
}
.user-info-mobile {
  display: none;
}
.header-item {
  margin-right: 20px;
  &:first-child {
    width: 28px;
    height: 28px;
    cursor: pointer;
    &:hover {
      stroke: darken($icon-color, 15%) !important;
    }
  }
}
.bell-icon {
  width: 28px;
  height: 28px;
  cursor: pointer;
  color: $icon-color;
  &:hover {
    stroke: darken($icon-color, 15%) !important;
  }
}
.num {
  position: absolute;
  top: -2px;
  left: 13px;
  background-color: red;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  color: white;
  text-align: center;
  vertical-align: center;
  font-size: 11px;
}
.btn-navi {
  width: 80px;
  height: 28px;
  background: #73cdd6;
  border-radius: 4px;
  color: white;
  text-decoration: none;
}
// iphone x
@media only screen
  and (max-width: 896px)
  and (max-height: 414px) {
  .app-header {
    .back-series {
      display: inline-flex !important;
    }
    &.app-header-series {
      .header-series {
        display: none;
      }
    }
    padding: 0 20px;
    .title {
      display: none;
    }
    .user-name {
      button {
        font-size: 16px;
      }
    }
  }
}
@media only screen and (max-width: 425px) {
  .max-text {
    text-overflow: ellipsis;
    max-width: 180px !important;
    overflow: hidden;
  }
  .app-header {
    .user-name {
      margin-right: 10px;
      .name {
        max-width: 180px !important;
        overflow: hidden;
      }
      button {
        padding: 0 !important;
      }
    }
  }
  .header-detail-page {
    height: 54px !important;
    position: relative;
  }
}
@media only screen and (max-width: 320px) {
  .max-text {
    text-overflow: ellipsis;
    max-width: 96px !important;
    overflow: hidden;
  }
}
.c-modal /deep/ {
  .modal-dialog {
    display: flex;
    align-items: center;
  }
  .modal-content {
    width: 100%;
  }
  .close {
    padding: 0;
    margin-top: -6px;
  }
  .c-modal__b {
    height: calc(550px - 105px);
    overflow-y: auto;
    padding: 40px 0 10px 60px;
    label {
      font-size: 14px;
      flex: 0 0 17%;
      margin-bottom: 15px;
      box-sizing: content-box;
    }
  }
  .c-modal__t {
    padding-left: 38px;
  }
  .modal-header {
    height: 40px;
    background: #fff;
    border-radius: 0;
    border-bottom: none;
  }
}
.share-body {
  height: calc(100% - 22px);
  overflow-y: auto;
}
/deep/ .modal-dialog {
  height: fit-content !important;
  max-height: 82vh;
}
@media screen and (max-width: $screen-sm) {
  .app-header {
    &.app-header-series {
      position: relative;
      height: 60px;
      .header-logo {
        margin-bottom: 0;
      }
    }
    .header-detail-logo {
      height: auto;
    }
    .hide-logo-series {
      visibility: hidden;
    }
    .user-info {
      align-items: center;
      position: absolute;
      z-index: 3;
      top: 15px;
      right: 0;
      .user-name, .btn-navi {
        display: none;
      }
    }
    .user-info-mobile {
      display: inline-block;
      order: 3;
      .header-item {
        width: 24px;
      }
    }
    .header-item {
      margin-right: 12px;
    }
    .cart-info-container {
      color: $icon-color;
    }
  }
  .c-modal /deep/ {
    .modal-header {
      height: 22px;
      padding: 0;
      position: relative;
    }
    .modal-content {
      width: calc(100% - 60px);
      height: 100% !important;
      border-radius: 0;
      border: none;
      margin-left: 30px;
      margin-right: 30px;
    }
    .close {
      padding: 6px;
      margin: 0;
      position: absolute;
      right: 0;
      font-size: 18px;
    }
  }
  .share-body {
    padding-left: 0;
    padding-right: 0;
    max-height: 79vh;
    overflow-y: auto;
    .info {
      border-bottom: solid 1px #eaeaea;
      padding: 0 15px 10px;
      .account-name {
        color: #333;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 5px;
      }
      .go-home {
        padding: 5px 0;
        a {
          font-size: 14px;
          color: $grey3;
        }
      }
      .logout {
        padding: 5px 0;
        a {
          font-size: 12px;
          color: $grey3;
          text-decoration: underline;
        }
      }
    }
    .action-creation {
      padding-top: 20px;
      padding-bottom: 20px;
      border-bottom: double 4px #eaeaea;
      .btn-navi {
        font-size: 14px;
        font-weight: bold;
        width: calc(100% - 30px);
        height: 30px;
        border-radius: 2px;
        margin-left: 15px;
        margin-right: 15px;
      }
    }
    .action-list {
      font-size: 14px;
      padding: 16px 15px;
      a {
        font-size: 14px;
        color: $grey3;
        display: flex;
        align-items: center;
      }
      .action-item {
        display: flex;
        align-items: center;
        height: 40px;
        a {
          i.icon-cls {
            width: 27px;
            height: 27px;
          }
        }
        &-title {
          margin-left: 10px;
          &-cart {
            margin-left: 0;
          }
        }
        .cart-info-container .number-item-in-cart {
          right: 6px;
        }
      }
    }
  }
  .gg-text {
    display: flex !important;
    cursor: pointer;
    font-size: 12px;
    height: 33px;
    line-height: 26px;
    margin-right: 8px;
    color: #a2a2a2;
    text-decoration: underline;
  }
}
@media screen and (max-width: $screen-xs) {
  i.icon-cls-logo {
    width: 26px;
  }
  .navi {
    &-logo {
      .logo-icon {
        width: 100px;
      }
    }
  }
  .btn-login {
    margin-right: 8px !important;
    width: 64px;
    height: 27px;
  }
}
.gg-text {
  display: none;
}
</style>
