<template>
  <div class="p-5" v-if="products.length">
    <div class="flex space-between mid flex-wrap mb-10">
      <slot></slot>
      <div class="agree-all flex mid center">
        <Checkbox :label="$t('14')" v-model.number="checkAll" />
      </div>
    </div>
    <div class="prod-info flex center layout-col fs-12 pt-20 pb-10 pl-30 pr-30 pos-rel">
      <div class="flex flex-wrap item pos-rel space-between w-full pt-10 pb-10" v-for="prd in products" :key="'ea-item-' + prd.product.id">
        <div v-if="prd.product.typeId !== SALON" class="lbl flex center mid pos-abs" :style="{'background-color': typeColors[prd.product.typeId]}">{{ $t('types.' + prd.product.typeId) }}</div>
        <div v-else class="lbl flex center mid pos-abs" :style="{'background-color': '#ff7d00'}">{{ $t('38') }}</div>
        <div class="col wrapp-info mt-25">
          <div class="title">{{ (prd.product || {}).name }}</div>
          <div class="seller">{{ $t('8') }}: {{ (prd.user || {}).nickName }}</div>
        </div>
        <div class="col mt-25 flex layout-col center wrapp-cb">
          <div class="flex space-between" style="min-width: 180px;">
            <div class="amount">{{ $t('9') }} {{ prd.count }}</div>
            <div class="text-right">
              <div class="total">
                <strong v-if="(prd.product || {}).isFreeFirstMonth">{{ $t('42') }}</strong>
                <strong>
                  {{ formatNumber(campaignPrice(prd.prices[0])) }}
                  {{ currency }}
                  {{ isYearly(prd) ? $t('51') : (isMonthly(prd) ? $t('50') : '') }}
                </strong>
              </div>
              <div class="total">
                <strong>{{ isYearly(prd) ? $t('53') : (isMonthly(prd) ? $t('52') : '') }}</strong>
              </div>
            </div>
          </div>
        </div>
        <div class="paid-options" v-if="(prd.paidOptions || []).length">
          <div class="option" v-for="opt in prd.paidOptions" :key="'option-' + opt.id">
            <div class="item-info">
              <span class="badge-realtrade wrap-text cursor-pointer mr-10">{{ $t('49') }}</span>
              <span class="name">{{ opt.optionName }}</span>
            </div>
            <span class="price co-red">{{ formatNumber(opt.optionPrice) }}{{ currency }}</span>
          </div>
        </div>
        <div class="terms-condition mt-10 flex space-between">
          <Checkbox :label="$t('11')" v-model="checkList" :attrs="{value: prd.product.id}" />&nbsp;
          <a class="cursor-pointer" @click="showTerm(prd.product.id)">
            <strong>【{{ prd.product.typeId == 1 ? $t('40') : $t('12') }}】</strong>
          </a>
        </div>
        <div class="terms-condition flex space-between" v-if="prd.user.isNda">
          <Checkbox :label="$t('43')" v-model="checkNda" :attrs="{value: prd.user.id}" />&nbsp;
          <a class="cursor-pointer" @click="showNda(prd.user.id)">
            <strong>{{ $t('44') }}</strong>
          </a>
        </div>
      </div>
      <div class="flex content-end flex-wrap mt-5" v-if="price && hasDvd && $i18n.locale == 'ja' && isDisplayDelivery()">
        {{ $t('32') }} {{ $t('dvd' + dvdOpt) }} :
        <a class="cursor-pointer" @click="showChangeDvd">{{ $t('33') }}</a>
      </div>
      <GogoModal :show="showDvd" @update:show="val => showDvd = val" :width="480" :height="200" :cancel-text="''">
        <div slot="title" class="modal-title pl-10 ml-20">
          {{ $t('34') }}
        </div>
        <div slot="modal-body" class="dvd-modal modal-body">
          <div class="select-dvd flex layout-col p-20">
            <Radio v-model.number="dvdOpt" :attrs="{value: 0}" :label="$t('32') + $t('dvd0')" v-if="isDisplayDvD(0)" />
            <Radio v-model.number="dvdOpt" :attrs="{value: 1}" :label="$t('32') + $t('dvd1') + '   ' + $t('35') + ' ￥1,480'" v-if="isDisplayDvD(1) && hasDvd[0]" />
            <Radio v-model.number="dvdOpt" :attrs="{value: 2}" :label="$t('32') + $t('dvd2') + '   ' + $t('35') + ' ￥1,100'" v-if="isDisplayDvD(2) && hasDvd[1]" />
          </div>
        </div>
      </GogoModal>
      <GogoModal :show="isShowTerm" @update:show="val => isShowTerm = val" :width="780" :height="580" :ok-text="''" :cancel-text="'3'" :title="$t('40')" class="term-modal">
        <div slot="modal-body" class="item modal-body">
          <div class="modal-term">
            <div class="flex mid center" v-if="loading">
              <Loading style="width: 50px; height: 50px;" />
            </div>
            <div class="term-before" v-html="keepType ? termSys : term" v-else></div>
          </div>
        </div>
      </GogoModal>
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
  </div>
</template>

<script>
import Checkbox from '@@/../components/form/Checkbox'
import i18n from '@@/lang/components-desktop/cart.json'
import GogoModal from '@@/../components/modals/GogoModal.vue'
import Radio from '@@/../components/form/Radio.vue'
import Loading from '@@/../components/icons/Loading.vue'
import {ustDefault, ustDefaultTh} from '@@/../common/commondata/ustDefault.js'
import { setCookie } from '@/utils/client/common'
const SALON = 4

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Checkbox,
    GogoModal,
    Radio,
    Loading,
  },
  computed: {
    products() {
      // https://gogojungle.backlog.jp/view/OAM-73769
      return this.$store.getters['cart01/buyNow'].filter(
        item => !item.product.isAdvising
      )
    },
    dvdOpt: {
      get() {
        return this.$store.getters['cart01/dvdOpt']
      },
      set(val) {
        if (val) {
          let period = 30 * 24 * 60
          setCookie('cdvdoption', this.dvdOpt, period)
        }
        this.$store.commit('cart01/setDvd', {
          dvdOpt: val,
        })
      },
    },
    ids() {
      return this.products.map(item => {
        return item.product.id
      })
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
        if (this.$store.getters['cart01/normalAll']) {
          this.checkList = []
          this.checkNda = []
        } else {
          this.checkList = this.ids
          this.checkNda = this.uIds
        }
      },
      get() {
        return this.$store.getters['cart01/normalAll']
      },
    },
    hasDvd() {
      return this.$store.getters['cart01/hasDvd']
    },
    currency() {
      if (this.langSupported().includes(this.$i18n.locale)) {
        return 'JPY'
      }
      return '円'
    },
    pay() {
      return this.$store.getters['cart01/payId']
    },
    price() {
      return this.$store.getters['cart01/sumPrice']
    },
    allDvDPrices() {
      return this.$store.getters['cart01/allDvDPrice']
    },
    userName() {
      return this.$store.state.user.name
    },
  },
  data() {
    return {
      typeColors: {
        1: '#000',
        2: '#f15e5a',
        3: '#367db4',
        4: '#4da6e0',
        5: '#ff1493',
        6: '#f15e5a',
        9: '#16a085',
        19: '#ff7d00',
        70: '#5844ac',
        71: '#5844ac',
        72: '#5844ac',
      },
      SALON,
      showDvd: false,
      checkList: [],
      isShowTerm: false,
      isShowNda: false,
      term: null,
      nda: null,
      termSys: null,
      keepId: null,
      ustDefault,
      ustDefaultTh,
      loading: false,
      loadingNda: false,
      keepType: 0,
      checkNda: [],
    }
  },
  methods: {
    showChangeDvd() {
      this.showDvd = true
    },
    async showTerm(id) {
      this.isShowTerm = true
      this.keepId = id
      this.loading = true
      let product =
          this.products.filter(item => item.product.id === id)[0] || {},
        res
      if (product.product.typeId == 1) {
        this.keepType = 1
        if (!this.termSys) {
          this.termSys = await this.GoGoHTTP.get('/api/v3/surface/inquiry/usl')
          this.termSys = (this.termSys || {}).Contents
        }
      } else {
        this.keepType = 0
        res = await this.GoGoHTTP.get(`/api/v3/surface/inquiry/ust/${id}`)
        let ust = this.$i18n.locale == 'th' ? this.ustDefaultTh : this.ustDefault
        this.term =
          (res || {}).content ||
          ust.content.replace(
            '出品者名',
            (product.user || {}).nickName || null
          ).replace(
            'ชื่อผู้ขาย',
            (product.user || {}).nickName || null
          )
      }
      this.loading = false
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
    isDisplayDelivery(){
      //only check for Cobini pay method.
      //price + 550(min dvdOptPrice) <= 300000
      return this.pay != 4 || this.price <= 299450
    },
    isDisplayDvD(dvdOpt){
      const totalPrice = this.allDvDPrices[dvdOpt] + this.price

      //only check for Cobini pay method.
      //totalPrice <= 300000
      return this.pay != 4 || totalPrice <= 300000
    },
    campaignPrice(price) {
      return price.offType2 ? price.campaign2 : (price.offType1 ? price.campaign1 : (price.offType0 ? price.campaign0 : price.price))
    },
    closeModal() {
      this.isShowNda = false
      this.isShowTerm = false
    },
    isMonthly(prd) {
      return (prd.prices[0] || {}).chargeType == 2
    },
    isYearly(prd) {
      return (prd.product || {}).isYearly
    },
  },
  watch: {
    checkList() {
      this.$store.commit('cart01/setCheckList', this.checkList)
    },
    checkNda() {
      this.$store.commit('cart01/setCheckNda', this.checkNda)
    },
  },
  created() {
    this.checkAll = true
  },
  mounted() {
    this.$eb.$on(this.$ebc.CART_PRESS_ESC, () => {
      this.closeModal()
    })
  }
}
</script>

<style lang="scss" scoped>
/deep/ .item.modal-body {
  min-height: 50vh;
  height: calc(100% - 100px);
  margin: 0;
}
/deep/ .dvd-modal.modal-body {
  height: auto;
  margin: 0;
}
.prod-info {
  width: 600px;
  min-height: 50px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.item {
  border-bottom: 1px solid #ddd;
  .lbl {
    background: #000;
    color: #fff;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 9px;
  }
  .col {
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
  }
}
/deep/ .modal-dialog {
  top: 5%;
}
.modal-title {
  border-left: 2px solid black;
}
.select-dvd {
  background: white;
  /deep/ .c-label {
    font-weight: normal;
  }
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
.pre-wrap {
  white-space: pre-line;
  word-break: break-word;
}
.paid-options {
  width: 100%;
  .option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    .item-info {
      display: flex;
      @media (max-width: 575.98px) {
        display: initial;
      }
      align-items: baseline;
      background: #f3f3f3;
      padding: 10px;
      width: 70%;
      .badge-realtrade {
        min-width: 85px;
        margin-top: 0.5rem;
        background-color: #ff981a;
        border-radius: 0.25rem;
        color: white;
        padding: 0 10px;
      }
      .name {
        color: #666;
        font-weight: bold;
        word-break: break-all;
      }
    }
  }
}
</style>
