<template>
  <div class="flex layout-col wrapper space-between" :class="{'mobile-ver': isMobile}">
    <div v-if="isMobile" class="back-mobile flex mid center" @click="switchToMobile()">
      モバイル用<span>GogoJungleに戻る</span>
    </div>
    <div>
      <div class="flex w-full user-header">
        <div class="w-1000">
          <a :href="logoHref" class="pt-5 pb-5">
            <i :is="LogoComp" class="logo-cls" title />
          </a>
        </div>
      </div>
      <div ref="topImgShow" class="header-img" :class="{'top-img': profile.hasBanner}">
        <div :style="{
          background: `url(${topImgUrl}) top center / contain no-repeat`,
          height: 0}" v-if="profile.hasBanner"
        ></div>
      </div>
      <div class="top-menu flex w-full">
        <div class="flex w-1000">
          <div class="left flex-wrap flex pos-rel">
            <div class="avatar" :style="{backgroundImage: `url(/img/users/${this.$route.params.id}/original?defaultImg=1)`}">
              <img src="/img/assets/pc/award/seller.png" class="seller-award" v-if="showAward" />
            </div>
            <div class="flex mid space-between user-name-ctn flex-wrap">
              <b class="wrap-text ml-20 mr-5" :title="profile.nickName || $t('31')">{{ profile.nickName || $t('31') }}</b>
              <div class="my-tooltip-1" data-toggle="tooltip" data-placement="bottom" data-html="true" :title="rankTitle">
                <RankIcon class="rank-icon" :type="profile.rankGroup || 0" v-if="smallIconShow" />
              </div>
            </div>
          </div>
          <div class="right flex mid space-between">
            <div class="flex menu">
              <a :href="item.url" class="pl-15 pr-15 flex"
                 :class="{ disabled: !item.hasData, active: item.active }"
                 v-for="(item, i) in menu" :key="i"
              >
                {{ $t(item.title) }}
              </a>
              <a :href="`/users/${$route.params.id}/follows`" class="flex layout-col mid center sub-menu ml-40"
                 :class="{ disabled: !profile.follows }"
              >
                <span>{{ $t(1) }}</span>
                <span>{{ profile.follows || 0 }}</span>
              </a>
              <div class="splitter ml-10 mr-10"></div>
              <a :href="`/users/${$route.params.id}/followers`" class="flex layout-col mid center sub-menu"
                 :class="{ disabled: !profile.followers }"
              >
                <span>{{ $t(2) }}</span>
                <span>{{ profile.followers || 0 }}</span>
              </a>
            </div>
            <button @click="onSendMsg" :class="{ disabled: !isProfileValid || $store.state.user.id == $route.params.id }" class="add-msg fs-12">
              {{ $t(3) }}
            </button>
          </div>
        </div>
      </div>
      <div class="main flex center" :class="{'w-1000': isMobile}">
        <!-- banner left -->
        <a v-if="banners[1] && !isMobile" class="block mr-20 mb-20" :href="banners[1].landingPageUrl" target="_blank">
          <img :src="banners[1].bannerUrl" alt="banners-1" />
        </a>
        <div class="flex">
          <div class="profile-left mt-50 pr-20">
            <div class="rank-icon-large my-tooltip-2" data-toggle="tooltip" data-placement="right" data-html="true" :title="rankTitle">
              <RankIcon class="rank-icon" :type="profile.rankGroup || 0" />
            </div>
            <a v-if="+userId == +$route.params.id" type="button" href="/mypage" class="btn-mypage">
              <span class="icon-user"><UserIcon /></span>
              <span>{{ $t('78') }}</span>
            </a>
            <template v-if="profile.lastAccess">
              <div class="last-access">
                {{ $t('43') }}:&nbsp;
                {{ formatTime(profile.lastAccess, 15) }}
              </div>
            </template>
            <template v-if="isProfileValid">
              <div v-if="profile.isEstimate" class="tooltip-estimate">
                <a @click="checkLoginEstimate" id="request-a-quote" class="flex mid center btn-req-skillshare w-full"><PenSolid />{{ $t('70') }}</a>
                <!-- <a href="https://www.gogojungle.co.jp/post/1/17014" data-html="true" type="button" class="gui-estimate" data-toggle="tooltip" data-placement="right" :title="$t('21')">
        ?
      </a> -->
                <div class="gui-es-v2">
                  <a href="https://www.gogojungle.co.jp/post/1/17014">{{ $t('72') }}</a>
                </div>
              </div>
              <div class="profile-info mb-10">
                {{ $t(6) }}：{{ bt }} │
                {{ $t(7) }}：{{ jt }}
                {{ sa ? ` │ ${$t(8)}：${sa}` : '' }}
                {{ ae ? ` │ ${$t(9)}：${ae}` : '' }}
                {{ ama ? ` │ ${$t(10)}：${ama}` : '' }}
                <!-- {{ $t(9) }}：{{ ae }} │
                {{ $t(10) }}：{{ ama }} -->
              </div>
              <div class="text-center mb-10">
                <button :class="{ disabled: !isProfileValid }" class="follow-btn" @click="handleFollow">
                  <UserTimes v-if="profile.isFollow" />
                  <UserPlus v-else />
                  {{ $t(profile.isFollow ? 11 : 12) }}
                </button>
              </div>
              <p class="intro" v-html="profile.introduction"></p>
            </template>
          </div>
          <nuxt-child class="profile-right" />
        </div>
        <!-- banner right -->
        <a v-if="banners[2] && !isMobile" class="block ml-20 mb-20" :href="banners[2].landingPageUrl" target="_blank">
          <img :src="banners[2].bannerUrl" alt="" />
        </a>
      </div>
      <FooterAdaptive />
    </div>
    <GogoModal :show="showGuide" :title="$t(15)" @update:show="val => showGuide = val" width="600px" height="340px"
               class="c-modal"
    >
      <div class="modal-body flex layout-col mid" slot="modal-body">
        <span class="text-center mt-20" v-html="msg"></span>
        <a class="flex mid center no-underlying" href="/register">{{ $t(16) }}</a>
      </div>
      <div slot="modal-footer" class="modal-footer flex mid center text-center">
        {{ $t(17) }}<a :href="`/login?u=${returnUrl || $route.fullPath}`">{{ $t(18) }}&#x3e;&#x3e;</a>
      </div>
    </GogoModal>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/users-id.json'
import PenSolid from '@@/../components/icons/PenSolid.vue'
import jobType from '@@/lang/common/job-type.json'
import bloodType from '@@/lang/common/blood-type.json'
import styleAdvise from '@@/lang/common/style-advise﻿.json'
import adviseExperience from '@@/lang/common/advise-experience.json'
import adviseMoneyAmount from '@@/lang/common/advise-money-amount.json'
import UserPlus from '@@/../components/icons/UserPlus.vue'
import UserTimes from '@@/../components/icons/UserTimes.vue'
import ArrowCircleRight from '@@/../components/icons/ArrowCircleRight.vue'
import FooterAdaptive from '@@/../components/footer/FooterAdaptive'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import Logoja from '@@/../components/icons/Logoja.vue'
import Logoen from '@@/../components/icons/Logoen.vue'
import Logoth from '@@/../components/icons/Logoth.vue'
import Logovi from '@@/../components/icons/Logovi.vue'
import RankIcon from '@@/../components/users/rank-icons'
import UserIcon from '@@/../components/icons/User.vue'
import { filterInt } from '@/utils/client/common'
import title from '@@/../common/pages'
import { setCookie, isAgentMobile } from '@/utils/client/common'
import {sellers} from '@@/../common/assets/award2020.js'

const SUBTITLE = {
  '': 36,
  products: 20,
  blog: 21,
  review: 22,
  follows: 1,
  followers: 2,
  realtrade: 39
}

export default Object.assign(
  {
    layout: 'empty',
    i18n: {
      messages: i18n,
    },
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    components: {
      PenSolid,
      UserPlus,
      UserTimes,
      ArrowCircleRight,
      FooterAdaptive,
      GogoModal,
      Logoja,
      Logoen,
      Logoth,
      Logovi,
      RankIcon,
      UserIcon,
    },
    data() {
      let topImgUrl = `/img/users/${
        this.$route.params.id
      }/banners?ingoreOnErr=1`
      return {
        topImgUrl,
        showGuide: false,
        msg: '',
        returnUrl: '',
        smallIconShow: false,
      }
    },
    mounted() {
      window.onscroll = this.handleWindowScroll
      const ttEl1 = $(this.$el).find('.my-tooltip-1')
      const ttEl2 = $(this.$el).find('.my-tooltip-2')
      const originalLeave = ttEl1.tooltip.Constructor.prototype.leave

      $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })

      ttEl1.tooltip.Constructor.prototype.leave = function(obj) {
        const self = obj instanceof this.constructor ?
          obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)
        let container, timeout
        originalLeave.call(this, obj)
        if(obj.currentTarget) {
          container = $(obj.currentTarget).siblings('.tooltip')
          timeout = self.timeout
          container.one('mouseenter', function(){
            clearTimeout(timeout)
            container.one('mouseleave', function(){
              ttEl1.tooltip.Constructor.prototype.leave.call(self, self)
            })
          })
        }
      }
      const originalLeave2 = ttEl2.tooltip.Constructor.prototype.leave
      ttEl2.tooltip.Constructor.prototype.leave = function(obj) {
        const self = obj instanceof this.constructor ?
          obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)
        let container, timeout
        originalLeave2.call(this, obj)
        if(obj.currentTarget) {
          container = $(obj.currentTarget).siblings('.tooltip')
          timeout = self.timeout
          container.one('mouseenter', function(){
            clearTimeout(timeout)
            container.one('mouseleave', function(){
              ttEl2.tooltip.Constructor.prototype.leave.call(self, self)
            })
          })
        }
      }
      ttEl1.tooltip({ html: true, trigger: 'hover focus', delay: { show: 50, hide: 50 } })
      ttEl2.tooltip({ html: true, trigger: 'hover focus', delay: { show: 50, hide: 50 } })
    },
    async asyncData({ app, params, req, error }) {
      let { id } = params,
        [profile, blog, banners, articlesRes] = await Promise.all([
          app.GoGoHTTP.get(`/api/v3/surface/profile/${id}`),
          app.GoGoHTTP.get(`/api/v3/surface/profile/${id}/blog`),
          app.GoGoHTTP.get('/api/v3/surface/banner'),
          app.GoGoHTTP.get(`/api/v3/surface/navi/authors/${id}/articles`, {
            params: {
              isPaid: -1,
              articlePage: 1,
              sortType: 1,
              articleLimit: 5
            }
          }),
        ]),
        isProfileValid = Object.keys(profile).length,
        locale = app.i18n.locale,
        cI18n = i18n[locale],
        bt = bloodType[locale][profile.bloodType] || '-',
        jt = jobType[locale][profile.occupation] || '-',
        sa = styleAdvise[locale][profile.investmentType] || '',
        ae = adviseExperience[locale][profile.investmentCareer] || '',
        ama = adviseMoneyAmount[locale][profile.investmentAmount] || '',
        type = req._parsedOriginalUrl.pathname.split('/')[3] || '',
        menu = [
          {
            title: 19,
            url: `/users/${id}`,
            hasData: true,
            active: type == '',
          },
          {
            title: 20,
            url: `/users/${id}/products`,
            hasData: profile.hasProduct,
            active: type == 'products',
          },
          {
            title: 74,
            url: `/finance/navi/authors/${id}`,
            hasData: articlesRes.total || 0,
            // active: type == 'blog',
          },
          {
            title: 22,
            url: `/users/${id}/review`,
            hasData: profile.hasReview,
            active: type == 'review',
          },
          {
            title: 39,
            url: `/users/${id}/realtrade`,
            hasData: profile.realtrade,
            active: type == 'realtrade',
          },
        ],
        isMobile = isAgentMobile(req.headers['user-agent']),
        articles = articlesRes.data || []

      if (!isProfileValid) {
        return error({ statusCode: 404 })
      }
      return {
        profile,
        blog,
        articles,
        isProfileValid,
        bt,
        jt,
        sa,
        ae,
        ama,
        menu,
        banners,
        isMobile,
        titleChunk: `${profile.nickName || cI18n[35]}${cI18n[37]}${
          cI18n[SUBTITLE[type]]
        } - ID : ${id}`,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/users/${id}${
              type ? `/${type}` : ''
            }`,
          },
        ],
      }
    },
    methods: {
      checkLoginEstimate(){
        if(this.userId){
          location.href = `/estimate/${this.profile.id}`
        } else{
          location.href = `/login?u=${this.$route.fullPath}`
        } 
      },
      switchToMobile() {
        setCookie('forceRenderDesktop', '', 0)
        // TODO: Hieu Nguyen - Correct finance navi structure
        if (this.$route.path.includes('/t/')) {
          location.href = this.$route.path.replace(
           '/articles/searchresult/',
           '/searchresult/'
        )
       } else {
         location.reload()
        }
      },
      descriptionTemplate() {
        return (this.profile.introduction || '').replace(/<(.|\n)*?>/g, '')
      },
      handleWindowScroll() {
        if (window.pageYOffset < 40) {
          this.$refs.topImgShow.classList.remove('scroll-lvl1')
          this.$refs.topImgShow.classList.remove('scroll-lvl2')
          this.smallIconShow = false
        } else if (window.pageYOffset > 40 && window.pageYOffset < 300) {
          this.$refs.topImgShow.classList.add('scroll-lvl1')
          this.$refs.topImgShow.classList.remove('scroll-lvl2')
          this.smallIconShow = false
        } else {
          this.$refs.topImgShow.classList.remove('scroll-lvl1')
          this.$refs.topImgShow.classList.add('scroll-lvl2')
          this.smallIconShow = true
        }
      },
      onSendMsg() {
        if (!this.isProfileValid) {
          return
        }
        let url = `/mypage/message?toUserId=${
          this.$route.params.id
        }&toUserName=${this.profile.nickName || ''}`
        if (!this.$store.state.user.id) {
          this.msg = this.$t(23)
          this.returnUrl = encodeURIComponent(url)
          this.showGuide = true
          return
        }
        location.href = url
      },
      async handleFollow() {
        if (!this.isProfileValid) {
          return
        }
        this.returnUrl = ''
        if (!this.$store.state.user.id) {
          this.msg = this.$t(24)
          this.showGuide = true
          return
        }
        let res = await this.GoGoHTTP.post(
          `/api/v3/surface/profile/${this.$route.params.id}/${
            this.profile.isFollow ? 'unfollow' : 'follow'
          }`
        )
        if (!res) {
          this.msg = this.$t(24)
          this.showGuide = true
          return
        }
        this.$set(this.profile, 'isFollow', this.profile.isFollow ? 0 : 1)
        this.$set(
          this.profile,
          'followers',
          (this.profile.followers || 0) + (this.profile.isFollow ? 1 : -1)
        )
      },
    },
    computed: {
      userId() {
        return this.$store.state.user.id
      },
      LogoComp() {
        if (this.langSupported().includes(this.$i18n.locale)) {
          return `Logo${this.$i18n.locale}`
        }
        return 'Logoja'
      },
      logoHref() {
        if (this.langSupported().includes(this.$i18n.locale)) {
          return `/${this.$i18n.locale}`
        }
        return '/'
      },
      showAward() {
        return sellers.includes(parseInt(this.$route.params.id))
      },
      rankTitle() {
        return this.profile.isDeveloper && this.profile.rankGroup 
        ? 
          this.$t('ex' + this.profile.rankGroup) + 
          '<br/><br/>' +
          '<img src="/img/assets/pc/common/user_rank_ex.png" />' +
          '<br/><br/>' +
          '<div style="display: flex; justify-content: flex-end;"><a style="color: white;" href="/post/46/16933" target="_blank">' +
          this.$t('69') +
          '</a></div>'
        : 
        ''
      }
    },
  },
  title
)
</script>

<style lang="scss" scoped>
$minWidth: 1020px;
$s: 230px;
@media only screen and (max-width: 1400px) {
  .main > a {
    display: none;
  }
}
.back-mobile {
  display: none;
  width: 100%;
  height: 150px;
  background: #0343ce;
  font-size: 55px;
  color: white;
  span {
    text-decoration: underline;
  }
}
.wrapper {
  background: #f5f8fa;
  min-width: $minWidth;
}
.user-header {
  position: fixed;
  background: white;
  z-index: 2;
  a {
    display: inline-block;
  }
  .logo-cls {
    width: 180px;
    height: 40px;
  }
}
.header-img {
  background: white;
}
.top-menu {
  z-index: 2;
  height: 60px;
  box-shadow: 0 4px 2px -2px rgba(207, 203, 207, 1);
  align-items: center;
  position: fixed;
  top: 50px;
  background: white;
  min-width: $minWidth;
  > div:first-child {
    height: 60px;
  }
  .left {
    width: $s;
    height: $s;
    flex: 0 0 $s;
    align-items: center;
    transition: all 0.3s ease;
    font-size: 16px;
    b {
      max-width: calc(#{$s} - 60px);
    }
  }
  .right {
    width: 770px;
    height: 60px;
    > div:first-child {
      height: 60px;
    }
    a {
      color: black;
      text-decoration: none;
      position: relative;
    }
  }
  & + .main {
    .profile-left {
      margin-top: 290px;
    }
    .profile-right {
      margin-top: 140px;
      margin-bottom: 100px;
    }
    > a {
      margin-top: 140px;
    }
  }
  .avatar {
    width: 203px;
    height: 203px;
    border: 5px solid white;
    background-repeat: no-repeat;
    background-size: cover;
    transition: height 0.3s ease, width 0.2s;
    border-radius: 5px;
    position: relative;
    overflow: hidden;
    margin-bottom: 15px;
    .seller-award {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 45%;
      height: 45%;
    }
  }
  .user-name-ctn {
    width: 100%;
    max-width: 193px;
    position: absolute;
    left: 10px;
    bottom: -15px;
    .rank-icon {
      display: none;
      position: relative;
      margin-left: -1000px;
      height: 31px;
      width: 31px;
      flex: 0 0 31px;
    }
  }
}
/deep/ .tooltip {
  color: red;
  & > .tooltip-inner {
    background-color: rgba(1, 1, 1, 0.85);
    color: white;
    text-align: left;
    padding: 10px 15px;
    min-width: 330px;
    max-width: 350px;
    z-index: 99999;
  }
  $direct: (
    top,
    bottom,
    left,
    right
  );
  @each $dir in $direct {
    &.#{$dir} > .tooltip-arrow {
      border-#{$dir}: 5px solid rgba(1, 1, 1, 0.85);
    }
  }
}
.rank-icon-large {
  padding: 5px 0 20px;
  height: 90px;
  width: 70px;
  .rank-icon {
    height: 70px;
    width: 70px;
  }
}
.last-access {
  border: 1px solid #ff7575;
  color: #ff7575;
  border-radius: 3px;
  background: #fff3f3;
  padding: 5px 10px;
  margin-bottom: 12px;
  font-size: 13px;
}
.top-img {
  height: 320px;
  min-height: 320px;
  margin-top: 50px;
  width: 100%;
  > div {
    height: 320px !important;
    transform: translate3d(0, 0, 0);
  }
  + .top-menu {
    position: absolute;
    top: 370px;
    .left {
      margin-top: -150px;
    }
    & + .main {
      margin-top: 60px;
      .profile-left {
        margin-top: 50px;
      }
      .profile-right {
        margin-top: 30px;
        position: relative;
      }
      > a {
        margin-top: 30px;
      }
    }
  }
}
.scroll-lvl1:not(.top-img) + .top-menu,
.scroll-lvl2 + .top-menu {
  .left {
    height: 60px;
    b {
      max-width: calc(#{$s} - 132px);
    }
  }
  .avatar {
    width: 40px;
    height: 40px;
    margin-bottom: 0;
    border: none;
  }
  .user-name-ctn {
    max-width: 170px;
    justify-content: flex-start;
    left: 40px;
    bottom: 12px;
    height: 32px;
    position: absolute;
    .rank-icon {
      margin-left: 0;
      height: 31px;
      width: 31px;
      flex: 0 0 31px;
      display: inline-block;
    }
  }
}
.scroll-lvl2 + .top-menu {
  .left {
    margin-top: 0;
  }
  position: fixed;
  top: 50px;
}
.follow-btn {
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  outline: none;
  height: 40px;
  width: 100%;
  font-weight: bold;
  .icon-cls {
    color: #f60;
    width: 16px;
    height: 12px;
  }
}
.menu a:not(.sub-menu) {
  font-size: 14px;
  align-items: center;
  transition: all 0.4s;
  &.active,
  &:hover {
    color: #f2677d;
    &::before {
      content: "";
      height: 2px;
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      background: #f2677d;
    }
  }
}
.disabled {
  pointer-events: none;
  opacity: 0.5;
}
.splitter {
  border-left: 1px dotted gray;
  height: 20px;
  margin-top: 25px;
}
.sub-menu > span:first-child {
  font-size: 11px;
}
.add-msg {
  background: #f2677d;
  height: 30px;
  width: 140px;
  color: white;
  border: none;
  outline: none;
  border-radius: 5px;
}
.profile-left {
  width: 230px;
  min-width: 230px;
  flex: 0 0 230px;
  font-size: 14px;
  line-height: 20px;
}
.intro {
  word-wrap: break-word;
}
.main {
  height: auto;
  background: #f5f8fa;
  > div {
    width: 1000px;
    flex: 0 0 1000px;
  }
}
.profile-right {
  width: 770px;
  flex: 0 0 770px;
}
.recent-article {
  border-bottom: 1px dotted #b4b5b6;
}
.blog {
  display: block;
}
.show-more .icon-cls {
  width: 14px;
  height: 14px;
  vertical-align: middle;
}
.c-modal /deep/ {
  .modal-dialog {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 340px;
    font-size: 14px;
  }
  .modal-header {
    text-align: center;
  }
  .modal-body {
    height: 227px;
    span {
      font-size: 20px;
    }
    a {
      outline: none;
      background: #ff7d00;
      color: white;
      border-radius: 5px;
      border: none;
      height: 45px;
      width: 260px;
      margin-top: 25px;
    }
  }
  .modal-footer {
    height: 40px;
  }
}
/deep/ .panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.mobile-ver {
  .back-mobile {
    display: flex !important;
  }
  div:nth-child(2) {
    transform: translateX(0);
  }
  .scroll-lvl2 + .top-menu {
    top: unset;
  }
}
.btn-req-skillshare {
  margin-bottom: 6px;
  cursor: pointer;
  box-shadow: 0 1px 1px #85b427;
  color: white;
  font-weight: normal;
  background-color: #a4ce51;
  line-height: 25px;
  border-radius: 3px;
  padding: 13px 0 12px 0;
  font-size: 17px;
  &:hover {
    background-color: #85b427;
    text-decoration: none;
    color: white;
  }
  .icon-cls {
    width: 17px;
    height: 17px;
    margin-right: 3px;
  }
}
.tooltip-estimate /deep/ {
  // position: relative;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .gui-es-v2 {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    a {
      font-size: 12px;
      line-height: 18px;
      color: #337ab7;
    }
  }
  .gui-estimate {
    text-decoration: none;
    outline: none;
    cursor: pointer;
    background: #a4d1ff;
    margin-left: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    width: 20px;
    height: 18px;
    font-weight: bold;
    color: white;
    border: none;
    border-radius: 50%;
  }
  .tooltip-inner {
    max-width: 178px;
    min-width: 0;
    padding: 15px 11px;
    text-align: left;
    font: 13px/20px;
    color: #fff;
    border-radius: 5px;
    opacity: 1;
  }
}
.btn-mypage {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #17A2B8 0% 0% no-repeat padding-box;
  border-radius: 3px;
  opacity: 1;
  width: 100%;
  font-size: 13px;
  color: #fff;
  margin-bottom: 12px;
  outline: none;
  border: none;
  font-weight: 700;
  text-decoration: none;
  padding-top: 3px;
  &:focus {
    outline: none;
    border: none;
  }
  &:hover {
    background: #0C8CA0 0% 0% no-repeat padding-box;
  }
}
.icon-user {
  margin-right: 5px;
  /deep/ .icon-cls {
    svg {
      path {
        fill: #fff;
      }
    }
  }
}

</style>
