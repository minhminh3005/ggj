<template>
  <div class="user-card flex space-between">
    <!-- 1. seller ava -->
    <div style="width: 125px; height: 130px;" class="flex layout-col center mid">
      <div class="user-ava-ctn">
        <a
          class="h-full w-full flex mid center user-ava-img d"
          style="overflow: hidden; width: 100%; height: 100%;"
          :href="`/users/${userId}`"
        >
          <img :src="`/img/users/${userId}`" alt="" />
        </a>
        <div class="my-tooltip-1" data-toggle="tooltip" data-placement="bottom" data-html="true" :title="rankTitle">
          <RankIcon :type="(data.user || {}).rankGroup || 0" class="rank-icon" />
        </div>
      </div>
      <button
        @click="onSendMsg"
        class="add-msg fs-12 mt-15"
      >
        {{ $t(30) }}
      </button>
    </div>

    <!-- 2. seller info -->
    <div style="width: 470px;">
      <!-- row 1 -->
      <div class="flex space-between">
        <div class="flex flex-wrap user-name">
          <strong class="pr-10">{{ $t(5) }}</strong>
          <a :href="`/users/${userId}`">{{ (data.user || {}).nickName }}</a>
        </div>
        <div class="flex space-around ml-10 mr-10">
          <!--  -->
          <a :href="`/users/${userId}/follows`" style="color: #333;" v-if="(data.user || {}).follows">{{ $t("following") }} {{ (data.user || {}).follows || 0 }}</a>
          <span v-else>{{ $t("following") }} {{ (data.user || {}).follows || 0 }}</span>
          <!--  -->
          <span class="ml-5 mr-5">❘</span>
          <!--  -->
          <a :href="`/users/${userId}/followers`" style="color: #333;" v-if="(data.user || {}).followers">{{ $t("followers") }} {{ (data.user || {}).followers || 0 }}</a>
          <span v-else>{{ $t("followers") }} {{ (data.user || {}).followers || 0 }}</span>
        </div>
        <div
          class="text-center flex space-between follow-btn"
          @click="handleFollow"
        >
          <span>
            <UserTimes v-if="(data.user || {}).isFollow" />
            <UserPlus v-else />
          </span>
          <span>{{ $t((data.user || {}).isFollow ? $t(2) : $t(3)) }}</span>
        </div>
      </div>

      <!-- row 2 -->
      <div
        class="last-access mt-10"
        style="width: 80%;"
      >
        <template v-if="(data.user || {}).lastAccess">
          <span>{{ $t(1) }}:</span>
          <span>{{ formatTime((data.user || {}).lastAccess, 15) }}</span>
        </template>
        <span v-else>-</span>
      </div>

      <!-- row 3 -->
      <div class="mt-15 flex">
        <button
          :class="`mr-5 flex mid btn btn-default btn-sm certificate-btn space-between ${data.isNda ? 'have-data' : 'none-data'}`"
        >
          <span>{{ data.isNda ? $t('NDA') : $t('28') }}</span>
          <Lock v-if="data.isNda" class="lock-icon ml-5" />
          <Check v-if="data.isNda" class="check-icon ml-5" />
        </button>
        <button
          :class="`mr-5 flex mid btn btn-default btn-sm space-between certificate-btn ${data.isIdentity ? 'have-data' : 'none-data'}`"
        >
          <span>{{ data.isIdentity ? $t('identity') : $t('29') }}</span>
          <User2 v-if="data.isIdentity" class="lock-icon ml-5" />
          <Check v-if="data.isIdentity" class="check-icon ml-5" />
        </button>
      </div>

      <!-- row 4 -->
      <div class="mt-15 des-ctn" ref="desCtn" v-if="isDesExpand">
        <!-- intro -->
        <div>
          <strong>{{ $t(25) }}</strong>
        </div>
        <div class="intro" v-html="(data.user || {}).introduction"></div>
        
        <!-- url -->
        <!-- <div class="mt-15">
          <strong>{{ $t(26) }}</strong>
        </div>
        <div class="intro">
          <a :href="(data.user || {}).url" v-if="(data.user || {}).url">{{ (data.user || {}).url }}</a>
          <span v-else>-</span>
        </div> -->
      </div>
      <span
        style="color: #327ab7; cursor: pointer;"
        class="flex mid pt-15"
        @click="onToggleDesExpand"
      >
        <b>{{ $t(6) }}</b>
        <span
          :is="isDesExpand ? 'AngleUp' : 'AngleDown'"
          style="width: 18px; height: 20px;"
        />
      </span>
    </div>
    <GogoModal
      :show="showGuide"
      :title="$t(15)"
      @update:show="val => showGuide = val"
      width="600px"
      height="340px"
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
import RankIcon from "@@/../components/users/rank-icons"
import UserPlus from "@@/../components/icons/UserPlus.vue"
import UserTimes from "@@/../components/icons/UserTimes.vue"
import AngleUp from "@@/../components/icons/AngleUp.vue"
import AngleDown from "@@/../components/icons/AngleDown.vue"
import Lock from "@@/../components/icons/Lock.vue"
import User2 from "@@/../components/icons/User2.vue"
import Check from "@@/../components/icons/Check.vue"
import i18n from "@@/lang/components-desktop/tools-user-card.json"
import GogoModal from '@@/../components/modals/GogoModal.vue'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    RankIcon,
    UserPlus,
    UserTimes,
    AngleUp,
    AngleDown,
    Lock,
    Check,
    GogoModal,
    User2
  },
  props: {
    userId: {
      type: [Number, String],
      default() {
        return null
      },
    },
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    rankTitle() {
      return this.$t('ex' + (this.data.user || {}).rankGroup) + 
        '<br/><br/>' +
        '<img src="/img/assets/pc/common/user_rank_ex.png" />' +
        '<br/><br/>' +
        '<div style="display: flex; justify-content: flex-end;"><a style="color: white;" href="/post/46/16933" target="_blank">' +
        this.$t('27') +
        '</a></div>'
    }
  },
  mounted() {
    this.initTooltip()
  },
  data() {
    return {
      isDesExpand: false,
      isProcess: false,
      showGuide: false,
      returnUrl: '',
      msg: '',
    }
  },
  methods: {
    initTooltip() {
      // init tooltip hover
      const ttEl1 = $(this.$el).find('.my-tooltip-1')
      const originalLeave = ttEl1.tooltip.Constructor.prototype.leave
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
      // init tooltip hover
      ttEl1.tooltip({ html: true, trigger: 'hover focus', delay: { show: 50, hide: 50 } })
    },
    async handleFollow() {
      this.returnUrl = ""
      if (!this.$store.state.user.id) {
        this.msg = this.$t(24)
        this.showGuide = true
        return
      }
      this.isProcess = true
      let res = await this.GoGoHTTP.post(
        `/api/v3/surface/profile/${this.userId}/${
          (this.data.user || {}).isFollow ? "unfollow" : "follow"
        }`
      )
      
      this.isProcess = false
      if (!res) {
        this.msg = this.$t(24)
        this.showGuide = true
        return
      }
      this.$set(this.data.user, "isFollow", (this.data.user || {}).isFollow ? 0 : 1)
      this.$set(
        this.data.user,
        "followers",
        ((this.data.user || {}).followers || 0) + ((this.data.user || {}).isFollow ? 1 : -1)
      )
    },
    onSendMsg() {
      let url = `/mypage/message?toUserId=${
        this.userId
      }&toUserName=${(this.data.user || {}).name || ""}`
      if (!this.$store.state.user.id) {
        this.msg = this.$t(23)
        this.returnUrl = encodeURIComponent(url)
        this.showGuide = true
        return
      }
      location.href = url
    },
    onToggleDesExpand() {
      this.isDesExpand = !this.isDesExpand

      // mute tag a action
      return false
    },
  },
}
</script>

<style lang="scss" scoped>
.user-card {
  width: 100%;
  border: 1px solid #bababa;
  margin-bottom: 10px;
  border-radius: 5px;
  padding: 20px 25px;
  color: #333;
  .user-card-title {
    font-size: 18px;
    font-weight: bold;
  }
  .user-ava-ctn {
    height: 80px;
    width: 80px;
    margin: auto;
    position: relative;
    .user-ava-img {
      border: 1px solid #cecece;
      border-radius: 60px;
      overflow: hidden;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    /deep/ .rank-icon {
      height: 40px;
      width: 40px;
      position: absolute;
      bottom: -8px;
      right: -5px;
    }
  }
  .last-access {
    border: 1px solid #ff7575;
    color: #ff7575;
    border-radius: 3px;
    background: #fff3f3;
    padding: 10px;
    font-size: 13px;
    width: calc(100% - 17px);
  }
  .follow-btn {
    background: #fff;
    border-radius: 5px;
    outline: none;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    .icon-cls {
      color: #f60;
      width: 16px;
      height: 12px;
    }
  }
  .add-msg {
    background: #f2677d;
    height: 32px;
    width: 125px;
    color: #fff;
    border: none;
    outline: none;
    border-radius: 5px;
  }
  .certificate-btn {
    border-radius: 3px;
    outline: none;
    font-weight: bold;
    padding: 2px 10px;
    height: 28px;
    line-height: 14px;
  }
  .none-data {
    border: 1px solid #bbb;
    color: #bbb;
    pointer-events: none;
  }
  .have-data {
    border: 1px solid #707070;
    color: #333;
  }
  .lock-icon {
    width: 16px;
    height: 18px;
    color: #bf9f47;
  }
  .check-icon {
    width: 16px;
    height: 18px;
    color: #00a041;
  }
  /deep/ .modal-body {
    height: 260px;
  }
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
.user-name {
  max-width: 180px;
}
</style>
