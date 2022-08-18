<template>
  <div>
    <no-ssr>
      <div
        class="noti-box-ctn"
        :class="{ 'in': isOpenNoti, 'empty': !countInfo.total }"
      >
        <div
          class="noti-box flex layout-col" 
          @click.self="toggleShowNotification(false)"
        >
          <div class="noti-header flex ">
            <div class="w-full flex mid flex-wrap pr-3 flex-sm-nowrap">
              <span class="mr-10">{{ $t(3) }}</span>
              <div
                class="pos-rel input-ctn mr-10" 
              >
                <input
                  type="text"
                  class="form-control sender-input pr-5"
                  :placeholder="$t(5)"
                  ref="senderInput"
                  v-model="senderSearchKeyword"
                  @input="debounceSearch"
                />
              </div>
              <div>
                <Checkbox
                  class="mt-10 fs-12"
                  v-model="unreadOnly"
                  @input="onSearchNoti"
                  :label="$t('4')"
                  style="margin: 12px 0;"
                />
              </div>
            </div>
            <!-- <i class="fa fa-times fs-18 pos-abs" @click="toggleShowNotification(false)"></i> -->
            <div style="font-size: 28px;" @click="toggleShowNotification(false)">×</div>
          </div>
          <div class="noti-list" ref="notiList">
            <div
              v-if="!notiList.length && !isProcess"
              class="bg-white center flex mid center h-full p-5"
              style="height: 109px; color: #333;"
            >
              {{ $t(9) }}
            </div>
            <template v-else>
              <NotiItem01
                v-for="(item, index) in notiList"
                :key="`noti-item-${index}`"
                :item="{ ...item, userName: listSenderObj[item.userId] }"
                :key-word="itemKeywordMatch"
                @onClick="(id) => onNotiClick(id, index)"
              />
              <Loading
                class="bg-white"
                v-if="isProcess"
                :style="{ height: '109px' }"
              />
            </template>
          </div>
        </div>
        <!-- <div class="click-outside-detector" @click="toggleShowNotification(false)"></div> -->
      </div>
    </no-ssr>
    <div class="show-modal modal fade" role="dialog" :id="'show-modal-review-noti'">
      <div class="modal-dialog flex layout-col">
        <div class="modal-header flex space-between pos-rel">
          <strong v-html="itemModal.subject"></strong>
          <!-- <i class="fa fa-times" @click="showReviewNoti = false" /> -->
        </div>
        <div
          v-if="itemModal"
          class="h-full w-full flex layout-col"
          style="color: #333; flex-grow: 1; overflow: auto; padding: 20px 40px;"
        >
          <div v-html="itemModal.content" class="content-ctn"></div>
        </div>
        <button
          style="width: 200px; margin: 10px auto 0 auto;"
          @click="closeModalReviewNoti"
          class="btn btn-default"
        >
          {{ $t('8') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NotiItem01 from '@@/../components/header/NotiItem01.vue'
import Checkbox from '@@/../components/form/Checkbox.vue'
import Loading from '@@/../components/icons/Loading.vue'
import { broadcast } from "@@/../common/js/notification/notification-helper.js"
import i18n from '@@/lang/components-desktop/notifications.json'
export const LIMIT = 30

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    NotiItem01,
    Checkbox,
    Loading,
  },
  data() {
    return {
      isOpenNoti: false,
      notiList: [],
      listSender: [],
      senderSearchKeyword: '',
      senderListShow: [],
      unreadOnly: false,
      isProcess: false,
      currentSenderId: null,
      isEndOfPaging: false,
      showReviewNoti: false,
      itemModal: {},
      listSenderObj: {},
      isHaveNewNoti: false,
      debounceSearch: this.debounce(this.onSearchNoti.bind(this), 800),
      itemKeywordMatch: ''
    }
  },
  methods: {
    closeModalReviewNoti() {
      $('#show-modal-review-noti').modal('hide')
    },
    initData() {
      //  init store
      this.$store.dispatch('notification/init')

      // get list sender
      this.GoGoHTTP.get('/api/noti/senders').then(res => {
        // 
        let listSenderObj = {}

        // 
        this.listSender = res.data.listUser
        this.senderListShow = res.data.listUser

        // 
        this.listSender.forEach(item => {
          listSenderObj[item.id] = item.name
        })
        this.listSenderObj = listSenderObj
      })
    },
    onNotiClick(id, index) {
      this.onReview()
      this.GoGoHTTP.put(`/api/noti/seen/${id}`, null, { isIgnore: true })
      this.notiList[index].isRead = 1
    },
    toggleShowNotification(val = null) {
      // true: open noti box
      // false: close noti box

      // open/close noti-box
      this.isOpenNoti = val !== null ? val : !this.isOpenNoti
      if(this.isOpenNoti) {
        this.isHaveNewNoti && this.getNotiList() // if have new noti, get new list
        $('body').css('overflow', 'hidden')
      } else {
        this.onReview() // close, the new notifications has been reviewed
        $('body').css('overflow', '')
      }
    },
    onSearchNoti() {
      this.notiList = []
      this.itemKeywordMatch = this.senderSearchKeyword
      this.getNotiList()
    },
    getNotiList() {
      if(this.isProcess) return
      this.isProcess = true
      this.isEndOfPaging = false

      //
      this.GoGoHTTP.get("/api/noti", {
        params: this.calcParams(),
        isIgnore: true,
      }).then((res) => {
        if (res.data && res.data.notifies) {
          let _list = res.data.notifies
          this.notiList = _list
        }
        this.isProcess = false
      })
    },
    async onScrollDown() {
      if (this.isProcess || this.isEndOfPaging) {
        return
      }
      this.isProcess = true
      this.GoGoHTTP.get("/api/noti", {
        params: this.calcParams(true),
        isIgnore: true,
      }).then((res) => {
        let newRecord = res.data.notifies || []
        if (newRecord && newRecord.length) {
          this.notiList = [ ...this.notiList, ...newRecord ]
        }
        this.isProcess = false
        if (newRecord.length < LIMIT) {
          this.isEndOfPaging = true
        }
      })
    },
    calcParams(isLoadMore = false) {
      let senderIds = []
      if(this.senderSearchKeyword) {
        senderIds = this.listSender
                  .filter(item => item.name.includes(this.senderSearchKeyword))
                  .map(item => item.id)
      }

      return {
        limit: LIMIT,
        keyword: this.senderSearchKeyword || null,
        senderIds: `${senderIds}` || null,
        unreadOnly: this.unreadOnly || null,
        minId: isLoadMore ? this.notiList[this.notiList.length - 1].id : null
      }
    },
    onReview() {
      if(!this.countInfo.total) {
        return
      }
      this.isHaveNewNoti = false
      const obj = { ...this.countInfo, total: 0 }
      this.$store.commit('notification/setCountInfo', obj)
      broadcast('noti', obj)
      this.GoGoHTTP.put(
        `/api/noti/reviewed?id=${this.countInfo.lastRecord}`, null, { isIgnore: true }).then(() => {
        this.notiList.forEach(noti => {
          noti.isReview = 1
        })
      })
    },
    onHaveNewNoti() {
      // 
      if(!this.countInfo.total) { // total = 0, update all is reviewed
        this.notiList.forEach(noti => {
          noti.isReview = 1
        })
        return
      }

      // 
      if(!this.isOpenNoti) { // if have new noti, and noti box is not open -> get new list when open noti box
        this.isHaveNewNoti = true
        return
      }

      // 
      this.GoGoHTTP.get("/api/noti", {
        params: {
          limit: LIMIT,
        },
        isIgnore: true,
      }).then((res) => {
        if (res.data && res.data.notifies.length) {
          this.notiList = res.data.notifies
        }
      })

      // 
      this.isEndOfPaging = false
    },
  },
  mounted() {
    // check login
    if(window && !window.$nuxt.$store.state.user.id) {
      return
    }

    // 
    this.initData()
    this.getNotiList()
    this.$nuxt.$on('toggleShowNotification', this.toggleShowNotification)
    this.$nuxt.$on('countInfoChange', this.onHaveNewNoti)
    this.$nuxt.$on('showNotiModal', item => {
      this.itemModal = item || {}
      // this.showReviewNoti = true
      $('#show-modal-review-noti').modal('show')
      console.log(1212)
    })

    // 
    setTimeout(() => {
      this.$refs.notiList.onscroll = (function() {
        if (this.$refs.notiList.offsetHeight + this.$refs.notiList.scrollTop >= this.$refs.notiList.scrollHeight - 200) {
          this.onScrollDown()
        }
      }).bind(this)
    }, 0)

    // Custom text for this case:
    // https://docs.google.com/spreadsheets/d/1PIUdmAEZ_hInblcNLrnlHpZv1Fx3YcMm-qUseboXtBU/edit#gid=1177407713&range=19:19
    moment.updateLocale('ja', {
      relativeTime : {
        mm : '%d分前',
        dd: "%d日前",
      },
    })
  },
  computed: {
    countInfo() {
      return this.$store.getters['notification/count'] || {}
    },
  }
}
</script>

<style lang="scss" scoped>
.noti-box-ctn {
  position: relative;
  z-index: 1000;
  .noti-box {
    position: fixed;
    height: 100vh;
    width: 100vw;
    right: 0;
    top: 0;
    z-index: 10;
    transition: all 0.3s;
    display: none;
    box-shadow: -3px 4px 5px #606060;
  }
  &.in, &.in:hover {
    .noti-box {
      color: #fff;
      display: block;
    }
    .click-outside-detector, .sender-click-outside-detector {
      display: block;
    }
  }
  .noti-header {
    width: 100%;
    flex: 0 0 50px;
    background: #555;
    padding: 10px 15px;
    .fa.fa-times {
      right: 12px;
      top: 13px;
    }
    .fa.fa-times.reset-icon {
      position: absolute;
      right: 9px;
      color: red;
      top: 9px;
    }
  }
  .click-outside-detector {
    position: absolute;
    height: 200vh;
    width: 200vw;
    background: transparent;
    top: -100vh;
    left: -100vw;
    z-index: 9;
    display: none;
  }
  .noti-list {
    overflow: auto;
    max-height: calc(100vh - 176px);
    box-shadow: 0 4px 5px 0 #aaa;
    min-height: 109px;
  }
}
.modal-dialog {
  background: #fff;
  border-radius: 4px;
  padding-bottom: 27px;
  margin: 40px auto;
  width: calc(100vw - 40px);
  max-height: 85vh;
}
.content-ctn {
  width: 100%;
  flex-grow: 1;
  word-break: break-word;
  white-space: pre-wrap;
}
.content-ctn /deep/ * {
  max-width: 100% !important;
}
/deep/ .content-ctn > * {
  max-width: 100% !important;
}
// -----

</style>