<template>
  <div class="product-vjFXY pos-rel" :class="{'loading-FvGJd': loading}">
    <div class="flex">
      <ImgWrapper v-if="!product.articleId" class="product-img mr-15" :src="'/img/products/' + product.id" />
      <ImgWrapper v-else class="product-img mr-15" :src="'/img/articles/' + product.articleId" />
      <div class="w-full">
        <div class="flex space-between product-detail fs-12 flex-wrap">
          <div class="product-info-wrapp">
            <a :href="product.url">
              <SimpleParagraph class="co-0b49c9 cursor-pointer mb-5" :content="product.name" />
            </a>
            <span>{{ $t('5') }}: {{ (data.user || {}).nickName || $t('14') }}</span>
            <template v-if="data.affUser">
              <br />
              <span>{{ $t('13') }}: {{ (data.affUser || {}).nickName || $t('14') }}</span>
            </template>
            <div class="mt-5 mb-20 cart-edit">
              <span @click="onDelete" class="co-0b49c9 cursor-pointer">{{ $t('6') }}</span> | <span @click="onMove" class="co-0b49c9 cursor-pointer">{{ moveText }}</span>
            </div>
          </div>
          <div class="product-info-wrapp-2">
            <div class="flex flex-wrap space-between">
              <div class="flex flex-wrap space-between">
                <div class="ml-5 text-right type"><span class="reponsive-label">{{ $t(3) }} :</span>{{ $t('types.' + product.typeId) }}</div>
                <template v-if="buyLater || product.isAdvising || !product.isMultiple || !(selectedPrice||{}).price">
                  <span class="ml-5 text-right mt-3 count">
                    <span class="reponsive-label">{{ $t(4) }} :</span>
                    {{ data.count }}
                  </span>
                </template>
                <div class="flex count" v-else>
                  <span class="reponsive-label">{{ $t(4) }} :</span>
                  <SelectBox class="quantity-sl ml-10" :selected="data.count" @input="onChangeQuantity" :data-source="quantityList" :id-val="'id'" :display="'text'" />
                </div>
              </div>
              <ProductPrice class="product-prices ml-5" :prices="selectedPrice" :is-monthly="selectedPrice.chargeType == 2" :is-subscription="product.isSubscription" :is-free-first-month="product.isFreeFirstMonth" :is-yearly="product.isYearly" />
            </div>
            <div class="co-red fs-12 text-right mt-5" v-if="data.isLimited && data.salesRemain <= 10">{{ $t('19', {number: data.salesRemain}) }}</div>
            <div class="prices-area flex layout-col mt-20 pr-5" v-if="!buyLater && (data.prices.length > 1)">
              <PriceType v-for="(price,index) in data.prices" @changeprice="onChangePrice" :key="index+'nMHM9'" :active="data.priceId == price.id" :prices="price" :is-monthly="price.chargeType == 2" :is-yearly="price.chargeType == 3" />
            </div>
          </div>
        </div>
        <BottomDetail class="bottom-detail" :product-id="product.id" :buy-later="buyLater" :is-advising="product.isAdvising" :user-id="(data.user || {}).id" />
        <div class="co-red mt-10" v-if="data.error"><b>{{ $t('cart-errors.' + data.error) }}</b></div>
        <div class="co-orange mt-10" v-if="data.warning"><b>{{ $t('cart-errors.' + data.warning) }}</b></div>
      </div>
    </div>
    <div v-if="!product.isAdvising && !buyLater && (data.gifts || []).length" class="gift-area flex flex-wrap mt-10">
      <div class="gift-content mb-5 mr-5" v-for="(gift,index) in (data.gifts || [])" :key="index+'3OyaH'">
        {{ (data.user || {}).id == gift.id ? $t('18', {name: gift.nickName, gift: gift.name}) : $t('11', {name: gift.nickName, gift: gift.name}) }}
      </div>
    </div>
    <div class="paid-options" v-if="(paidOptions || []).length">
      <div class="option" v-for="opt in paidOptions" :key="'option-' + opt.id">
        <div class="item-info">
          <span class="badge-realtrade wrap-text cursor-pointer mr-10">{{ $t('20') }}</span>
          <span class="name">{{ opt.optionName }}</span>
        </div>
        <span class="price co-red">¥{{ formatNumber(opt.optionPrice) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import SimpleParagraph from '@@/../components/SimpleParagraph.vue'
import SelectBox from '@@/../components/form/SelectBox.vue'
import BottomDetail from './BottomDetail.vue'
import PriceType from './PriceType.vue'
import ProductPrice from './ProductPrice.vue'
import i18n from '@@/lang/components-desktop/cart-product-list.json'
export default {
  components: {
    ImgWrapper,
    SimpleParagraph,
    SelectBox,
    ProductPrice,
    BottomDetail,
    PriceType,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
    buyLater: {
      type: Boolean,
      default: false,
    },
  },
  i18n: { messages: i18n },
  computed: {
    selectedPrice() {
      if (!this.data.priceId) {
        return this.data.prices[0]
      }
      return (
        this.data.prices.find(item => {
          return this.data.priceId == item.id
        }) || {}
      )
    },
    moveText() {
      return this.buyLater ? this.$t('7') : this.$t('8')
    },
    product() {
      if (this.selectedPrice.isSeries) {
        return this.data.seriesProduct
      }
      return this.data.product
    },
    quantityList() {
      let number = !this.data.isLimited ? 10 : Math.min(this.data.salesRemain || 1, 10)
      return Array.from(Array(number).keys()).map(item => {
        return {
          text: item < 9 ? `0${item + 1}` : item + 1,
          id: item + 1,
        }
      })
    },
    paidOptions() {
      return this.data.paidOptions
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    onDelete() {
      this.loading = true
      this.$store.dispatch(`cart01/deleteFromCart`, {
        id: this.data.product.id,
        buyLater: this.buyLater,
        http: this.GoGoHTTP,
        cb: this.onEditDone,
        price: this.selectedPrice.price*this.data.count, // product_price*quantity
      })
    },
    onMove() {
      this.loading = true
      let move = this.buyLater ? 'moveToBuyNow' : 'moveToBuyLater'
      this.$store.dispatch(`cart01/${move}`, {
        id: this.data.product.id,
        http: this.GoGoHTTP,
        cb: this.onEditDone,
        price: this.selectedPrice.price*this.data.count, // product_price * quantity
      })
    },
    onChangeQuantity(quantity) {
      this.loading = true
      // if (!this.data.upperLimit) {
      //   this.quantityList = Array.from(
      //     Array(parseInt(quantity / 10) * 10 + 10).keys()
      //   ).map(item => {
      //     return {
      //       text: item < 9 ? `0${item + 1}` : item + 1,
      //       id: item + 1,
      //     }
      //   })
      // }
      this.$store.dispatch('cart01/changeQuantity', {
        id: this.product.id,
        quantity: quantity,
        http: this.GoGoHTTP,
        cb: this.onEditDone,
        price: this.selectedPrice.price*quantity, // product_price*quantity
      })
    },
    onChangePrice(id) {
      this.loading = true
      this.$store.dispatch('cart01/changePrice', {
        id: this.data.product.id,
        priceId: id,
        http: this.GoGoHTTP,
        cb: this.onEditDone,
      })
    },
    onEditDone() {
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
$co1: #0b49c9;
.reponsive-label {
  display: none;
}
.product-vjFXY {
  border-bottom: 1px solid #dadada;
  .product-img {
    flex: 0 0 100px;
    width: 100px;
    height: 100px;
  }
  .product-detail {
    flex: 1 0 auto;
  }
  .product-info-wrapp {
    width: 170px;
  }
  .mt-3 {
    margin-top: 3px;
  }
  .type {
    margin-top: 3px;
    width: 100px;
    word-break: break-all;
  }
  .product-prices /deep/ {
    width: 145px;
    text-align: right;
    margin-top: 4px;
    .deactive-1poZh {
      text-align: right;
    }
  }
  .count {
    width: 55px;
    word-break: break-all;
  }
  .bottom-detail /deep/ {
    max-width: 285px;
    .gifts,
    .contract {
      color: $co1;
    }
    .contract {
      font-size: 11px;
      white-space: nowrap;
    }
  }
  .prices-area {
    align-items: flex-end;
    max-height: 240px;
    overflow-y: auto;
    > div:last-child {
      margin-bottom: 0;
    }
    &::-webkit-scrollbar {
      width: 6px;
      &-track {
        background: #e5e5e5;
        border-radius: 15px;
      }
      &-thumb {
        background: #c1c1c1;
        border-radius: 15px;
        &:hover {
          background: #b1b1b1;
        }
      }
    }
  }
}
.co-0b49c9 {
  color: $co1;
}
.quantity-sl {
  height: 22px;
  /deep/ .sl-area {
    height: 22px !important;
    text-align: center !important;
    min-width: 50px !important;
    padding: 0 5px !important;
  }
  /deep/ .dropdown-menu {
    max-height: 400px;
    overflow-y: auto;
    .dd-item {
      font-size: 12px;
    }
    &::-webkit-scrollbar {
      width: 6px;
      &-track {
        background: #e5e5e5;
        border-radius: 15px;
      }
      &-thumb {
        background: #c1c1c1;
        border-radius: 15px;
        &:hover {
          background: #b1b1b1;
        }
      }
    }
  }
}
.extra-list {
  /deep/ .sl-area {
    min-width: 55px !important;
    padding: 0 5px !important;
  }
}
.loading-FvGJd {
  pointer-events: none;
  opacity: 0.5;
}
.co-red {
  color: red;
}
.co-orange {
  color: orange;
}
.gift-area {
  .gift-content {
    border: 1px solid #efd5b9;
    border-radius: 8px;
    padding: 5px;
    width: calc((100% - 10px) / 3);
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
}
.paid-options {
  .option {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
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
