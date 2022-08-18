<template>
  <div class="prod-info flex center layout-col fs-12 pt-20 pb-40 pl-30 pr-30" v-if="products.length">
    <div class="prod-doc flex center layout-col mb-10" v-for="prd in products" :key="'advising-item-' + prd.product.id">
      <div class="flex item w-full pos-rel space-between pt-10 pb-20">
        <div class="lbl flex center mid pos-abs" :style="{'background-color': colors[prd.product.isAdvising]}">{{ (prd.product || {}).isAdvising ? $t('37') : $t('38') }}</div>
        <div class="col wrapp-info">
          <div class="title">{{ (prd.product || {}).name }}</div>
          <div class="seller">{{ $t('8') }}: {{ prd.user.nickName }}</div>
        </div>
        <div class="col flex layout-col flex-start">
          <div class="flex space-between">
            <div class="amount mr-20">{{ $t('9') }} {{ prd.count }}</div>
            <div class="total"><strong>({{ $t('39') }})<span v-if="(prd.product || {}).isFreeFirstMonth" class="ml-5">{{ $t('42') }}</span>&nbsp;{{ formatNumber(campaignPrice(prd.prices[0])) }}{{ currency }}</strong></div>
          </div>
        </div>
      </div>
      <div class="ta w-full p-10 mb-20" v-html="getTerm(prd.user, prd.prices[0].price) || ''" v-if="(prd.product || {}).isAdvising"></div>
      <div class="terms-condition flex mb-20" v-if="prd.user.isNda">
        <Checkbox :label="$t('43')" v-model="checkNda" :attrs="{value: prd.user.id}" />&nbsp;
        <a class="cursor-pointer" @click="showNda(prd.user.id)">
          <strong>{{ $t('44') }}</strong>
        </a>
      </div>
    </div>
    <div class="mt-30 flex center" v-if="hasAdvising">
      <div class="agree-all flex mid center">
        <Checkbox :label="$t('36')" v-model.number="checkAll" />
      </div>
    </div>
    <GogoModal :show="isShowNda" @update:show="val => isShowNda = val" :width="780" :height="580" :ok-text="''" :cancel-text="'3'" :title="$t('46')" class="term-modal">
      <div slot="modal-body" class="item modal-body">
        <div class="modal-term">
          <div class="flex mid center" v-if="loadingNda">
            <Loading style="width: 50px; height: 50px;" />
          </div>
          <div class="term-before pre-wrap" v-html="nda" v-else></div>
        </div>
      </div>
    </GogoModal>
  </div>
</template>

<script>
import Checkbox from '@@/../components/form/Checkbox'
import i18n from '@@/lang/components-desktop/cart.json'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import Loading from '@@/../components/icons/Loading.vue'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Checkbox,
    GogoModal,
    Loading,
  },
  computed: {
    products() {
      // https://gogojungle.backlog.jp/view/OAM-73769
      return this.$store.getters['cart01/buyNow'].filter(
        item => item.product.isAdvising
      )
    },
    buyer() {
      return this.$store.getters['cart01/buyer']
    },
    hasAdvising() {
      return this.$store.getters['cart01/hasAdvising']
    },
    currency() {
      if (this.langSupported().includes(this.$i18n.locale)) {
        return 'JPY'
      }
      return '円'
    },
    ids() {
      return this.products.map(item => {
        return item.product.isAdvising ? item.product.id : undefined
      }).filter(Boolean)
    },
    uIds() {
      return this.products.map(item => {
        if (item.user.isNda) {
          return item.user.id
        }
      }).filter(Boolean)
    },
    checkAll: {
      set() {
        if (this.$store.getters['cart01/normalAll2']) {
          this.checkList = []
          this.checkNda = []
          this.$store.commit('cart01/onConfirmSalonsBefore', false)
        } else {
          this.checkList = this.ids
          this.checkNda = this.uIds
          this.$store.commit('cart01/onConfirmSalonsBefore', true)
        }
      },
      get() {
        return this.$store.getters['cart01/normalAll2']
      },
    },
  },
  data() {
    return {
      colors: {
        1: '#4da6e0',
        0: '#ff7d00',
      },
      isShowNda: false,
      keepId: null,
      loadingNda: false,
      checkNda: [],
      checkList: [],
      nda: null,
    }
  },
  watch: {
    // checkAll(val) {
    //   this.$store.commit('cart01/onConfirmSalonsBefore', val)
    // },
    checkList() {
      this.$store.commit('cart01/setCheckList2', this.checkList)
    },
    checkNda() {
      this.$store.commit('cart01/setCheckNda2', this.checkNda)
    },
  },
  methods: {
    getTerm(user, price) {
      let text = this.$store.getters['cart01/getConclusion'][user.id],
        curDate = new Date().getTime()
      curDate = curDate / 1000
      if (text) {
        text = text.replace('#PostalCode#', this.buyer.zip)
        text = text.replace('#postal_code#', this.buyer.zip)
        text = text.replace(
          '#Region1#',
          `${this.buyer.prefectureId} ${this.buyer.address1}`
        )
        text = text.replace('#Region2#', this.buyer.address2)
        text = text.replace('#Region3#', this.buyer.address3)
        text = text.replace('#buy_last_name#', this.buyer.lastName)
        text = text.replace('#buyename#', this.buyer.lastName)
        text = text.replace('#buyfname#', this.buyer.firstName)
        text = text.replace('#buy_first_name#', this.buyer.firstName)
        text = text.replace('#dev_last_name#', user.lastName)
        text = text.replace('#dev_first_name#', user.firstName)
        text = text.replace('#devename#', user.lastName)
        text = text.replace('#devfname#', user.firstName)
        text = text.replace('#term#', 1)
        text = text.replace('#dday#', this.formatTime(curDate, 8))
        text = text.replace('#dday2#', this.formatTime(curDate, 8))
        text = text.replace(
          '#dday3#',
          this.formatTime(curDate + 30 * 24 * 60 * 60, 8)
        )
        text = text.replace('#Region4#', '')
        text = text.replace('#price#', this.formatNumber(price))
      }
      return text
    },
    async showNda(id) {
      if (this.loadingNda) {
        return
      }
      this.isShowNda = true
      this.keepId = id
      this.loadingNda = true
      const product = this.products.filter(item => item.user.id === id)[0] || {}

      const res = await this.GoGoHTTP.get(`/api/v3/surface/inquiry/nda/${id}`)
      const dat = new Date()
      let m = dat.getMonth() + 1
      if (m < 10) {
        m = '0' + m
      }
      this.nda = ((res || {}).content || '')
          .replace(
            /###YYYY###/g,
            dat.getFullYear()
          )
          .replace(
            /###MM###/g,
            m
          )
          .replace(
            /###DD###/g,
            dat.getDate()
          )
          .replace(
            /###user_nick_name###/g,
            this.userName || this.$t('45')
          )
          .replace(
            /###developer_nick_name###/g,
            product.user.nickName || this.$t('45')
          )
      this.loadingNda = false
    },
    campaignPrice(price) {
      return price.offType2 ? price.campaign2 : (price.offType1 ? price.campaign1 : (price.offType0 ? price.campaign0 : price.price))
    }
  },
}
</script>


<style lang="scss" scoped>
.prod-doc {
  &:not(:last-child) {
    border-bottom: 1px solid #ddd;
  }
}
.item {
  .lbl {
    background: #4da6e0;
    color: #fff;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 9px;
  }
  .col {
    margin-top: 25px;
    .amount {
      opacity: 0.7;
    }
    &.wrapp-info {
      width: 40%;
    }
    .title,
    .seller {
      word-break: break-all;
    }
    .seller {
      font-size: 10px;
      margin-top: 8px;
      opacity: 0.7;
    }
  }
}
.terms-condition {
  height: 25px;
  font-size: 11px;
  a {
    color: blue;
    opacity: 0.8;
  }
  /deep/ {
    .c-label {
      padding-left: 18px;
    }
    .checkmark {
      top: 2px;
      height: 12px;
      width: 12px;
      border: 1px solid #666;
      &::after {
        top: 2px;
        left: 2px;
      }
    }
  }
}
/deep/ .item.modal-body {
  min-height: 50vh;
  height: calc(100% - 100px);
  margin: 0;
}
.term-modal /deep/ {
  .modal-header {
    .modal-title {
      border-left: 2px solid #2d2d2d;
      padding-left: 5px;
      margin-left: 10px;
    }
  }
  .term-before {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 10px 20px;
  }
}
/deep/ .modal-dialog {
  top: 5%;
}
.ta {
  width: 100%;
  height: 200px;
  overflow-y: auto;
  border: 1px solid #d9d9d9;
}
.agree-all {
  width: 350px;
  height: 50px;
  background: #f0f0f0;
  /deep/ .c-label {
    font-weight: normal;
    margin-bottom: 0;
  }
}
.pre-wrap {
  white-space: pre-line;
  word-break: break-word;
}
</style>
