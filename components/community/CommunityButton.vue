<template>
  <div v-if="rooms.length">
    <div>
      <div v-if="attrs.page === TOOLS">
        <div class="flex info-row">
          <div class="row-title">
            {{ $t(1) }}<span class="d-lg-none">:</span>
          </div>
          <span class="d-sm">:</span>
          <div @click="onShowModal" class="row-content">
            <a class="comu">{{ $t(2) }}</a>
          </div>
        </div>
      </div>
      <div v-if="attrs.page === SYSTEMTRADE">
        <div class="flex mt-5">
          <div class="category">{{ $t(1) }}</div>
          <span class="d-md">:</span>
          <a @click="onShowModal" class="fs-12 cate-title">
            <span class="under-link">{{ $t(2) }}</span>
          </a>
        </div>
      </div>
      <div v-if="attrs.page === NAVI" class="navi">
        <button @click="onShowModal">{{ $t(3) }}</button>
      </div>
      <div v-if="attrs.page === PURCHASED_ARTICLE">
        <button @click="onShowModal" class="w-full purchase-btn mt-10 flex center mid">
          {{ $t(13) }}&nbsp;&nbsp;&nbsp; ¥{{ formatNumber(attrs.price) }} {{ $t(14) }}
        </button>
      </div>
    </div>
    <GogoModal
      :show="showModal"
      @update:show="val => showModal = val"
      :width="450"
      :height="'auto'"
    >
      <div slot="title" class="flex center">{{ $t(4) }}</div>
      <div slot="modal-body" class="share-body">
        <div :class="'mySlides'+attrs.numCom" class="fade-slider" :key="'slider' + currentRoomIdx" v-if="rooms[currentRoomIdx]">
          <div class="com-slider">
            <div
              :class="{ show: currentRoomIdx > 0 }"
              class="btn-slider prev"
              @click="plusSlides(-1)"
            >
              <ChevronRound />
            </div>
            <div class="avatar">
              <img :src="'/img/communities/avatar/' + rooms[currentRoomIdx].id + '/medium'" alt="" />
            </div>
            <div
              :class="{ show: currentRoomIdx < rooms.length - 1 }"
              class="btn-slider next"
              @click="plusSlides(1)"
            >
              <ChevronRound class="rotate-180" />
            </div>
          </div>
          <div class="des">
            <div class="name clamp clamp-2">
              {{ rooms[currentRoomIdx].name }}
            </div>
            <ToggleContent
              :attrs="{
                content: rooms[currentRoomIdx].overview,
                id: 'toverview' + currentRoomIdx,
                tid: 'toverviewbtn' + currentRoomIdx,
                show: showModal,
                txtSeeMore: $t(12),
                textClose: $t(11)
              }"
            />
            <ToggleContent
              :attrs="{
                content: rooms[currentRoomIdx].rule,
                id: 'trule' + currentRoomIdx,
                tid: 'trulebtn' + currentRoomIdx,
                show: showModal,
                txtSeeMore: $t(12),
                textClose: $t(11)
              }"
            />
          </div>
          <div class="author">
            <div class="auth-avatar">
              <img :src="'/img/users/' + user.id + '/small'" alt="" />
            </div>
            <div class="info">
              <div class="or">{{ $t(5) }}</div>
              <div class="nm clamp clamp-1">{{ user.name }}</div>
            </div>
          </div>
          <div class="num">{{ $t(6) }}{{ rooms[currentRoomIdx].numMembers }}人</div>
          <!--  JOINT COMMUNITY -->
          <!-- <div v-if="canJoin" class="btns">
            <button class="joint btn-joint" :class="{'jointed':rooms[currentRoomIdx].isJoined}" @click="onJoint(rooms[currentRoomIdx])">
              <i class="fa fa-comments-o" aria-hidden="true"></i>
              <span>{{ txtBtnJoin(rooms[currentRoomIdx].isJoined) }}</span>
            </button>
          </div> -->
          <div class="ab">
            <a href="/mypage/community" target="_blank">{{ $t(7) }}</a>{{ $t(8) }}
          </div>
        </div>
      </div>
      <div slot="modal-footer"></div>
    </GogoModal>
  </div>
</template>
<script>
import GogoModal from '@@/../components/modals/GogoModal.vue'
import ToggleContent from '@@/../components/community/ToggleContent.vue'
import ChevronRound from '@@/../components/icons/ChevronRound.vue'
import i18n from '@@/lang/components/community-button.json'
import { NAVI, TOOLS, SYSTEMTRADE, SINGLE, SERIALIZED, SINGLE_SERIALIZED, PURCHASED_ARTICLE  } from '@@/../common/assets/consts/article'

export default {
  i18n: {
    messages: i18n,
  },
  props: {
    attrs: {
      type: Object,
      default: function() {
        return {
          page: 'tools',
          numCom: 0
        }
      },
    }
  },
  components: {
    GogoModal,
    ToggleContent,
    ChevronRound,
  },
  data() {
    return {
      TOOLS,
      SYSTEMTRADE,
      NAVI,
      PURCHASED_ARTICLE,
      SINGLE,
      SERIALIZED,
      SINGLE_SERIALIZED,
      showModal: false,
      currentRoomIdx: null,
    }
  },
  async mounted() {
    if (!this.attrs.numCom || 0) this.$store.dispatch('community/onGetCommunities')
  },
  methods: {
    onShowModal() {
      this.showModal = !this.showModal
      if(this.showModal) this.showSlides(this.currentRoomIdx || 0)
      $('.scroll-btn').css('z-index', this.showModal ? 0 : 9999999999)
    },
    plusSlides(n) {
      this.showSlides((this.currentRoomIdx || 0) + n)
    },
    showSlides(n) {
      this.currentRoomIdx = n
    },
    onJoint(item) {
      if(!item.isJoined) this.$store.dispatch('community/jointCommunity', item.id)
    },
    txtBtnJoin(isJoined) {
      return isJoined ? this.$t(9) : this.$t(10)
    }
  },
  computed: {
    info() {
      let path = this.$route.path || ''
      if (path.includes('series') || this.attrs.isSeries) return this.$store.getters['community/getCommunitiesSeries']
      if (path.includes('article')) {
        switch (this.attrs.articleOption) {
          case SINGLE:
            return this.$store.getters['community/getCommunitiesArticle']
          case SERIALIZED:
            return this.$store.getters['community/getCommunitiesSeries']
          case SINGLE_SERIALIZED:
            return this.$store.getters['community/getCommunitiesArticleAndSeries']
          default:
            return this.$store.getters['community/getCommunitiesArticle']
        }
      }
      return this.$store.getters['community/getCommunities']
    },
    rooms() {
      return this.info ? (this.info || {}).rooms || [] : []
    },
    user() {
      return this.info.user || {}
    },
    canJoin() {
      return this.info.canJoin || 0
    },
  },
}
</script>
<style lang="less" scoped>
.category {
  flex: 0 0 43%;
}
.cate-title {
  margin-left: 3vw;
}
.under-link {
  text-decoration: underline;
  color: #666;
  cursor: pointer;
}
.navi {
  display: flex;
  justify-content: center;
  button {
    color: #707070;
    border-radius: 18px;
    border: solid 1px #707070;
    background: white;
    padding: 5px 15px;
  }
}
.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  margin-top: 10px;
  .row-title {
    flex: 0 0 25vw;
    margin: 5px 0;
    padding-right: 10px;
    text-align: right;
  }
  .row-content {
    display: flex;
    flex-wrap: wrap;
    margin-left: 15px;
    cursor: pointer;
    .comu {
      color: black;
      text-decoration: underline;
    }
  }
}
.d-lg-none {
  display: none;
}
.d-sm {
  display: none;
}
.d-md {
  display: block;
}
@media only screen and (min-width: @screen-xs) {
  .category {
    flex: 0 0 140px;
    border-right: dotted 2px #c5c5c5;
  }
  .cate-title {
    margin-left: 25px;
  }
  .d-md {
    display: none;
  }
  .d-lg-none {
    display: block;
  }
  .info-row {
    margin-bottom: 15px;
    width: 100%;
    .row-title {
      color: #666;
      font-weight: bold;
      width: 110px;
      flex: 0 0 110px;
      text-align: left;
      display: flex;
    }
    .row-content {
      flex-grow: 1;
      margin-left: 0;
    }
  }
}
@media only screen and (max-width: @screen-xs) {
  .d-sm{
    display: block;
  }
}
.share-body {
  padding: 8px 24px 24px;
  max-height: 70vh;
  overflow-y: auto;
  .com-slider {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .btn-slider {
      cursor: pointer;
      visibility: hidden;
      &.show {
        visibility: visible;
      }
    }
    .avatar {
      width: 96px;
      height: 96px;
      border-radius: 4px;
      overflow: hidden;
      border: solid 1px #d0d0d0;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .des {
    font-size: 15px;
    .name {
      color: #333;
      font-weight: bold;
      margin: 15px 0 10px;
    }
    .overview {
      font-size: 15px;
      color: #707070;
      margin: 10px 0;
    }
    .rule {
      font-size: 15px;
      color: #707070;
      margin: 10px 0;
    }
  }
  .author {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
    .auth-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      margin-left: 10px;
      .or {
        color: #707070;
        font-size: 12px;
      }
      .nm {
        color: #333;
        font-size: 15px;
        font-weight: bold;
        max-width: 132px;
        word-break: break-all;
      }
    }
  }
  .num {
    color: #707070;
    font-size: 15px;
    font-weight: bold;
    text-align: center;
  }
  .btns {
    text-align: center;
    margin: 15px 0;
    .joint {
      background: #73cdd6;
    }
    .jointed {
      background: #a1a1a1;
      cursor: not-allowed;
    }
    .btn-joint {
      border-radius: 6px;
      color: #fff;
      border: none;
      padding: 5px 16px;
      min-width: 149px;
      @media only screen and (max-width: @screen-md) {
        font-size: 14px;
      }
    }
  }
  .ab {
    color: #707070;
    font-size: 12px;
    text-align: center;
    margin-top: 40px;
    a {
      color: #5F95EB;
      font-weight: bold;
    }
  }
  &::-webkit-scrollbar {
    width: 3px;
    background: #efefef;
  }
  &::-webkit-scrollbar-thumb {
    background: #dadada;
  }
}

/* Fading animation */
.fade-slider {
  -webkit-animation-name: fade;
  -webkit-animation-duration: 1.5s;
  animation-name: fade;
  animation-duration: 1.5s;
}
@-webkit-keyframes fade {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}
@keyframes fade {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}
/deep/ .modal-dialog {
  height: 80vh;
  margin:32px auto;
  @media only screen and (max-width: @screen-sm) {
    margin:32px 16px;
  }
  &.fade {
    transition: 0.3s ease-out;
  }
}
/deep/ .modal-header {
  border-bottom: none;
  background: #fff;
  .modal-title {
    font-weight: bold;
    font-size: 16px;
  }
}
.rotate-180 {
  transform: rotate(180deg);
}
.purchase-btn {
  background-color: #ddc6b6;
  color: white;
  height: 32px;
  cursor: pointer;
  border: none;
  &:hover {
    background: no-repeat;
    color: #ddc6b6;
    border: solid 2px #ddc6b6;
    text-decoration: underline;
  }
}
</style>
