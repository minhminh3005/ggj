<template>
  <div>
    <template v-if="!isShowDetail">
      <div class="top-menu flex pt-10 pb-10 bg-white">
        <div
          class="ml-10 avatar pos-rel"
          :style="{
            backgroundImage: `url(/img/users/${profile.id}/large?defaultImg=1)`,
          }"
        >
          <!-- <img src="/img/assets/pc/award/seller.png" class="seller-award" v-if="showAward" /> -->
          <div class="rank-icon">
            <RankIcon :type="profile.rankGroup || 0" />
            <div
              class="icon-click"
              data-toggle="tooltip"
              data-placement="bottom"
              data-html="true"
              :title="rankTitle"
            >
              CLICK
            </div>
          </div>
        </div>
        <div class="flex space-between mid col-warmgrey profile">
          <div class="pl-10 pr-5 flex custom-detail" style="flex-flow: column">
            <b class="wrap-text mb-5">{{ profile.nickName || $t('31') }}</b>
            <template v-if="sa">
              <span classs="mb-5">{{ $t(8) }}: {{ sa }}</span>
            </template>
            <template v-if="ae">
              <span>{{ $t(9) }}: {{ ae }} </span>
            </template>
            <div class="last-access" v-if="profile.lastAccess">
              {{ $t('48') }}:&nbsp;
              {{ formatTime(profile.lastAccess, 15) }}
            </div>
            <div v-if="profile.isEstimate" class="tooltip-estimate">
              <a
                @click="checkLoginEstimate"
                id="request-a-quote"
                class="flex mid center btn-req-skillshare w-full"
              >
                <PenSolid />{{ $t('50') }}
              </a>
              <div class="gui-es-v2">
                <a href="https://www.gogojungle.co.jp/post/1/17014">
                  {{
                    $t('52')
                  }}
                </a>
              </div>
            </div>
          </div>
          <a class="mr-10 angle-right" @click="isShowDetail = true">
            <AngleRight class="col-greyish" />
          </a>
        </div>
      </div>
      <div class="user-noti flex space-between mid bg-white">
        <a
          v-if="profile.follows"
          :href="`/users/${id}/follows`"
          class="col-gray"
        >
          <b>{{ profile.follows }}</b><span>{{ $t(1) }}</span>
        </a>
        <a v-else class="col-greyish">
          <b>0</b>
          <span>{{ $t(1) }}</span>
        </a>
        <a
          v-if="profile.followers"
          :href="`/users/${id}/followers`"
          class="col-gray"
        >
          <b>{{ profile.followers }}</b><span>{{ $t(2) }}</span>
        </a>
        <a v-else class="col-greyish">
          <b>0</b> <span>{{ $t(2) }}</span>
        </a>
        <a
          @click="onSendMessage"
          class="col-gray"
          :class="userId == id ? 'col-greyish disabled' : 'col-gray'"
        >
          <Email class="svg-size" />
          <span>{{ $t(3) }}</span>
        </a>
      </div>
      <div class="content-list mt-10 mb-200">
        <a
          v-for="(item, index) in contentList"
          :key="index"
          :href="countContent(item.id) ? item.url : null"
          class="user-tools flex space-between mid bg-white"
          :class="countContent(item.id) ? 'col-gray' : 'col-greyish'"
        >
          <p class="mb-0">{{ item.name }}</p>
          <div class="flex mid">
            <p class="mr-5 mb-0">({{ countContent(item.id) || '0' }})</p>
            <i
              :class="countContent(item.id) !== 0 ? 'col-gray' : 'col-greyish'"
              is="AngleRight"
            />
          </div>
        </a>
      </div>
    </template>
    <template v-else>
      <div class="top-menu flex pt-10 pb-10 bg-white">
        <div
          class="ml-10 avatar"
          :style="{
            backgroundImage: `url(/img/users/${profile.id}/large?defaultImg=1)`,
          }"
        ></div>
        <div class="flex space-between mid col-warmgrey" style="width: 75%">
          <button
            :class="{ disabled: !isProfileValid }"
            class="mr-10 flex center mid p-5"
            @click="handleFollow"
          >
            <UserTimes v-if="profile.isFollow" class="col-warmgrey svg-size2" />
            <UserPlus v-else class="col-orange svg-size2" />
            <b>{{ $t(profile.isFollow ? 11 : 12) }}</b>
          </button>
        </div>
      </div>
      <div
        class="user-info pre-wrap pl-20 pr-20 pb-10 bg-white col-gray mb-200"
      >
        <div class="flex pb-20 mid">
          <a class="mr-10" @click="isShowDetail = false">
            <AngleLeft class="col-greyish" />
          </a>
          <div class="custom-detail">
            <b class="wrap-text mb-5" style="display: inherit">
              {{
                profile.nickName || $t('31')
              }}
            </b>
            <div class="mt-5">{{ $t(6) }}：{{ bt }} │ {{ $t(7) }}：{{ jt }}{{ sa ? ` │ ${$t(8)}：${sa}` : '' }}{{ ae ? ` │ ${$t(9)}：${ae}` : '' }}{{ ama ? ` │ ${$t(10)}：${ama}` : '' }}</div>
          </div>
        </div>
        <p
          v-if="profile.introduction"
          v-html="profile.introduction"
          class="pt-20 pb-20 profile-info"
        ></p>
      </div>
    </template>
  </div>
</template>

<script>
import i18n from '@@/lang/mobile/users-id.json'
import PenSolid from '@@/../components/icons/PenSolid.vue'
import bloodType from '@@/lang/common/blood-type.json'
import jobType from '@@/lang/common/job-type.json'
import adviseMoneyAmount from '@@/lang/common/advise-money-amount.json'
import AngleRight from '@@/../components/icons/AngleRight.vue'
import AngleLeft from '@@/../components/icons/AngleLeft.vue'
import styleAdvise from '@@/lang/common/style-advise﻿.json'
import adviseExperience from '@@/lang/common/advise-experience.json'
import Email from '@@/../components/icons/Email.vue'
import UserPlus from '@@/../components/icons/UserPlus.vue'
import UserTimes from '@@/../components/icons/UserTimes.vue'
// import {sellers} from '@@/../common/assets/award2020.js'
import RankIcon from '@@/../components/users/rank-icons'

export default {
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      isShowDetail: false,
      returnUrl: '',
    }
  },
  components: {
    PenSolid,
    AngleRight,
    AngleLeft,
    Email,
    UserTimes,
    UserPlus,
    RankIcon,
  },
  computed: {
    userId() {
      return parseInt(this.$store.state.user.id)
    },
    userName() {
      return parseInt(this.$store.state.user.name)
    },
    // showAward() {
    //   return sellers.includes(parseInt(this.$route.params.id))
    // },
    rankTitle() {
      return this.profile.isDeveloper && this.profile.rankGroup
        ? this.$t('ex' + this.profile.rankGroup) +
            '<br/><br/>' +
            '<img src="/img/assets/pc/common/user_rank_ex.png" />' +
            '<br/><br/>' +
            '<div style="display: flex; justify-content: flex-end;"><a style="color: white;" href="/post/46/16933" target="_blank">' +
            this.$t('49') +
            '</a></div>'
        : ''
    },
  },
  mounted() {
    $(this.$el)
      .find('div[data-toggle="tooltip"]')
      .tooltip({ html: true, trigger: 'click' })
  },
  methods: {
    checkLoginEstimate() {
      if (this.userId) {
        location.href = `/estimate/${this.profile.id}`
      } else {
        location.href = `/login?u=${this.$route.fullPath}`
      }
    },
    async handleFollow() {
      if (!this.isProfileValid) {
        return
      }
      this.returnUrl = ''
      if (!this.userId) {
        location.href = `/login?u=${this.$route.fullPath}`
      } else {
        await this.GoGoHTTP.post(
          `/api/v3/surface/profile/${this.$route.params.id}/${
            this.profile.isFollow ? 'unfollow' : 'follow'
          }`
        )
        this.$set(this.profile, 'isFollow', this.profile.isFollow ? 0 : 1)
        this.$set(
          this.profile,
          'followers',
          (this.profile.followers || 0) + (this.profile.isFollow ? 1 : -1)
        )
      }
    },
    onSendMessage() {
      if (!this.isProfileValid) {
        return
      }
      let url = `/mypage/message?toUserId=${this.id}&toUserName=${this.profile.nickName}`
      if (!this.userId) {
        this.returnUrl = encodeURIComponent(url)
        location.href = `/login?u=${this.returnUrl || this.$route.fullPath}`
      } else {
        location.href = url
      }
    },
    countContent(type) {
      switch (type) {
        case 'products':
          return this.profile.products || 0
        case 'blog':
          return this.profile.blogCount || 0
        case 'review':
          return this.profile.hasReview || 0
        case 'realtrade':
          return this.profile.realtrade || 0
        case 'navi-article':
          return this.totalArticles || 0
      }
    },
  },
  async asyncData({ app, params, req }) {
    let { id } = params,
      [profile, articlesRes] = await Promise.all([
        app.GoGoHTTP.get(`/api/v3/surface/profile/${id}`),
        app.GoGoHTTP.get(`/api/v3/surface/navi/authors/${id}/articles`, {
          params: {
            isPaid: -1,
            articlePage: 1,
            sortType: 1,
            articleLimit: 5,
          },
        }),
      ]),
      locale = app.i18n.locale,
      isProfileValid = Object.keys(profile).length,
      bt = bloodType[locale][profile.bloodType] || '-',
      jt = jobType[locale][profile.occupation] || '-',
      sa = styleAdvise[locale][profile.investmentType] || '',
      ae = adviseExperience[locale][profile.investmentCareer] || '',
      ama = adviseMoneyAmount[locale][profile.investmentAmount] || '',
      type = req._parsedOriginalUrl.pathname.split('/')[3] || '',
      contentList = [
        {
          id: 'products',
          name: i18n[locale]['20'],
          url: `/users/${id}/products`,
        },
        {
          id: 'navi-article',
          name: i18n[locale]['55'],
          url: `/finance/navi/authors/${id}`,
        },
        {
          id: 'review',
          name: i18n[locale]['22'],
          url: `/users/${id}/review`,
        },
        {
          id: 'realtrade',
          name: i18n[locale]['47'],
          url: `/users/${id}/realtrade`,
        },
      ],
      totalArticles = articlesRes.total || 0

    return {
      id,
      contentList,
      isProfileValid,
      profile,
      sa,
      ae,
      bt,
      jt,
      ama,
      type,
      totalArticles,
    }
  },
}
</script>

<style lang="scss" scoped>
a.disabled {
  pointer-events: none;
  cursor: default;
}
.svg-size {
  width: 16px;
  height: 19px;
}
.pre-wrap {
  white-space: pre-line;
  word-break: break-all;
}
.svg-size2 {
  width: 19px;
  height: 17px;
  margin-right: 5px;
}
.top-img {
  height: 140px;
  min-height: 140px;
  width: 100%;
}
.top-menu {
  .avatar {
    width: 75px;
    height: 75px;
    border: 5px solid white;
    background-repeat: no-repeat;
    background-size: cover;
    transition: all 0.5s ease;
    border-radius: 50%;
    align-self: center;
    .seller-award {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 45%;
      height: 45%;
    }
  }
  button {
    background: white;
    min-width: 165px;
    border: 1px solid rgb(178, 178, 178);
    outline: none;
    border-radius: 5px;
    position: absolute;
    right: 10px;
  }
}
.last-access {
  border: 1px solid #ff7575;
  color: #ff7575;
  border-radius: 3px;
  background: #fff3f3;
  padding: 5px 10px;
  margin-bottom: 15px;
  font-size: 13px;
}
.user-noti {
  a {
    width: 33%;
    display: flex;
    flex-flow: column;
    align-items: center;
    height: 40px;
    justify-content: center;
    text-decoration: none;
  }
  text-align: center;
  padding: 7px 8px;
  border-top: 1px solid;
  border-color: rgb(224, 222, 220);
  a:nth-child(2) {
    border-right: 1px solid;
    border-left: 1px solid;
    border-color: rgb(224, 222, 220);
  }
}
.user-tools {
  padding: 5px 10px 5px 15px;
  border-bottom: solid 1px #e0dedc;
  text-decoration: none;
}
.content-list {
  a:nth-child(1) {
    border-top: solid 1px #e0dedc;
  }
}
.profile-info {
  border-top: 1px solid rgb(224, 222, 220);
}
.angle-right {
  position: absolute;
  right: 0;
}
.custom-detail {
  width: calc(100% - 46px);
}
.profile {
  width: calc(100% - 85px);
}
.rank-icon {
  height: 40px;
  width: 44px;
  position: absolute;
  bottom: -10px;
  right: -10px;
  .icon-click {
    border: 3px solid #77cbf2;
    color: #77cbf2;
    border-radius: 8px;
    font-size: 10px;
    padding: 1px 5px;
  }
}
/deep/ .tooltip {
  color: red;
  & > .tooltip-inner {
    background-color: rgba(1, 1, 1, 0.85);
    color: white;
    text-align: left;
    padding: 10px 15px;
    min-width: 310px;
    max-width: 320px;
    z-index: 99999;
  }
  $direct: (top, bottom, left, right);
  @each $dir in $direct {
    &.#{$dir} > .tooltip-arrow {
      border-#{$dir}: 5px solid rgba(1, 1, 1, 0.85);
    }
  }
}
.btn-req-skillshare {
  cursor: pointer;
  box-shadow: 0 1px 1px #85b427;
  color: white;
  background-color: #a4ce51;
  border-radius: 3px;
  padding: 7pt 0;
  line-height: 27pt;
  font-size: 18pt;
  font-weight: normal;
  margin-bottom: 6px;
  .icon-cls {
    width: 18pt;
    height: 18pt;
    margin-right: 6px;
  }
  &:hover {
    background-color: #85b427;
    text-decoration: none;
    color: white;
  }
}
.tooltip-estimate /deep/ {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .gui-es-v2 {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    a {
      font-size: 13pt;
      line-height: 20pt;
      color: #337ab7;
    }
  }
}
</style>
