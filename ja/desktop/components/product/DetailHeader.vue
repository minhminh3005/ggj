<template>
  <div>
    <div class="flex">
      <div class="product-img mr-20 mt-5 flex mid center pos-rel">
        <img :src="'/img/products/' + product.id" :alt="`${product.name} ${$t('23')}`" />
        <img src="/img/assets/pc/award/product.png" class="product-award" v-if="showAward" />
      </div>
      <b class="co-tools" v-html="product.description"></b>
    </div>
    <div class="mt-30">
      <template v-if="cartInfo.discountStart && cartInfo.discountEnd">
        <b class="co-grey fs-20">{{ $t('20') }}:</b>
        <p class="co-red fs-24 mt-5">
          <b>{{ formatTime(cartInfo.discountStart, 0) }} ~  {{ formatTime(cartInfo.discountEnd, 0) }}</b>
        </p>
      </template>
      <p v-if="cartInfo.reservedStart">
        <b class="co-grey fs-20">{{ $t('9') }}: </b>
        <span class="co-red fs-24 mt-5">
          <b>{{ formatTime(cartInfo.reservedStart, 0) }}</b>
        </span>
      </p>
      <p v-if="cartInfo.reservedEnd">
        <b class="co-grey fs-20">{{ $t('21') }}: </b>
        <span class="co-red fs-24 mt-5">
          <b>{{ formatTime(cartInfo.reservedEnd, 0) }}</b>
        </span>
      </p>
      <p v-if="cartInfo.saleRemain">
        <b class="co-grey fs-20">{{ $t('19') }}:</b>
        <b class="co-red fs-25 ml-10 mt-5">{{ $t('17') }}{{ cartInfo.saleRemain }}{{ $t('18') }}</b>
      </p>
      <p v-if="cartInfo.discountRemain">
        <b class="co-grey fs-20">{{ $t('16') }}:</b>
        <b class="co-red fs-25 ml-10 mt-5">{{ $t('17') }}{{ cartInfo.discountRemain }}{{ $t('18') }}</b>
      </p>
    </div>
    <div class="flex mid mt-40 mb-20">
      <div class="mt-5 mb-5 title-selected pr-10 text-right">{{ $t('1') }}</div>:
      <div class="flex flex-wrap ml-15">
        <template v-if="(product.categoryList || []).length">
          <span class="mt-5 mb-5 mr-10" v-for="item in (product.categoryList || [])" :key="'prd-cate-' + item.categoryId">
            <a class="cursor-pointer" @click="onGoToSearch(2, item.categoryId)"><b>{{ item.name }}</b></a>
          </span>
        </template>
        <template v-else>
          -
        </template>
      </div>
    </div>
    <div class="flex mid mb-20">
      <div class="mb-5 title-selected pr-10 text-right">{{ $t('2') }}</div>:
      <a class="cursor-pointer mt-5 mb-5 ml-15" :href="'/users/' + (product.user || {}).id">
        <b>{{ (product.user || {}).name || $t('4') }}</b>
      </a>
      <div class="last-access" v-if="product.typeId == 13 && (product.user || {}).lastAccess">
        {{ $t('26') }}:&nbsp;
        {{ formatTime((product.user || {}).lastAccess, 15) }}
      </div>
    </div>
    <div class="flex mb-20">
      <div class="mb-5 title-selected pr-10 text-right">{{ $t('3') }}</div>:
      <div class="flex flex-wrap ml-15">
        <template v-if="(product.keywordList || []).length">
          <span class="mb-5 mr-10" v-for="item in (product.keywordList || [])" :key="'prd-cate-' + item.keywordId">
            <a class="cursor-pointer" @click="onGoToSearch(1, item.keywordId)"><b>{{ item.name }}</b></a>
          </span>
        </template>
        <template v-else>
          -
        </template>
      </div>
    </div>
    <div class="flex mid mb-20" v-if="product.typeId == 13">
      <div class="title-selected pr-10 text-right">{{ $t('25') }}</div>:
      <div class="ml-15">{{ $t('24') }}</div>
    </div>
    <div class="border-top">
      <div class="flex pt-20">
        <div class="w-120">
          {{ $t('8') }}
        </div>
        <div class="flex grow1">
          <div class="grow11">
            <product-info :title="$t('9')" :info="cartInfo.start ? formatTime(cartInfo.start, 7) : '-'" />
            <product-info :title="$t('14')" :info="cartInfo.version || '-'" />
          </div>
          <div class="grow11">
            <product-info :title="$t('13')" :info="cartInfo.updated ? formatTime(cartInfo.updated, 7) : '-'" />
            <div class="flex space-between">
              <product-info :title="$t('10')" />
              <div class="w-100"><rate class="rating" :alway-show="true" :stars="(product.review || {}).stars" :target="product.id" :number="(product.review || {}).count" /></div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="cartInfo.brokers" class="flex pt-10">
        <div class="w-120">
          {{ $t('27') }}
        </div>
        <div class="flex flex-wrap">
          <components
            :is="(isSuportLocale || !companyUrls[item])
              ? 'div'
              : 'a'" :href="companyUrls[item]" v-for="item in brokers"
            :key="'broker-' + item"
            class="fs-12 h-20 block mr-5 border-radius-10 pr-10"
          >
            {{ allowedBrokers[item].name }}
          </components>
          <div v-if="!brokers.length">-</div>
        </div>
      </div>
    </div>
    <div class="flex mid pt-20" v-if="cartInfo.count">
      <div class="w-120">
        {{ $t('22') }}
      </div>
      <div class="flex grow11">
        <SaleCount :sale-count="cartInfo.count" />
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/product-detailheader.json'
import ProductInfo from './ProductInfo.vue'
import Rate from '@@/../components/product/Rate.vue'
import SaleCount from './SaleCount.vue'
import {products} from '@@/../common/assets/award2020.js'
const GET_BROKERS_URL = '/api/v3/brokers/domestic?type=1'

export default {
  components: {
    ProductInfo,
    Rate,
    SaleCount,
  },
  i18n: {
    messages: i18n,
  },
  props: {
    product: Object,
    onGoToSearch: {
      type: Function,
      default() {},
    },
  },
  data() {
    return {
      allowedBrokers: [],
      companyUrls: {},
    }
  },
  mounted() {
    this.onGetBrokers()
    this.getCompanyUrls()
  },
  methods: {
    onGetBrokers() {
      this.GoGoHTTP.get(`${GET_BROKERS_URL}`).then(data => {
        this.allowedBrokers = data || []
      })
    },
    getCompanyUrls() {
      if (this.isSuportLocale) {
        return
      }
      this.GoGoHTTP.get('/api/v3/surface/company/urls', {
        params: {
          ids: this.cartInfo.brokers
        }
      }).then(data => {
        this.companyUrls = data
      })
    },
  },
  computed: {
    cartInfo() {
      return this.$store.state.cart.info
    },
    showAward() {
      return products.includes(this.product.id)
    },
    brokers() {
      return (this.cartInfo.brokers || []).filter(e => Object.keys(this.allowedBrokers).includes(e.toString()))
    },
    isSuportLocale() {
      return this.langSupported().includes(this.$i18n.locale)
    },
  },
}
</script>

<style lang="scss" scoped>
.co-grey {
  color: #707070;
}
.co-red {
  color: red;
}
.fs-20 {
  font-size: 20px;
}
.fs-24 {
  font-size: 24px;
}
.fs-25 {
  font-size: 25px;
}
.border-button-001 {
  min-width: 200px;
  height: 42px;
  justify-content: space-around;
  align-items: center;
  color: #10cac8;
  text-decoration: none;
  border-radius: 21px;
  border: solid 3px #10cac8;
  position: relative;
  svg {
    fill: #10cac8;
  }
  .fa-arrow-right {
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 8px solid #10cac8;
  }
  b {
    padding-top: 1px;
    &::after {
      content: '';
      position: absolute;
      top: 14px;
      left: -3px;
      width: 4px;
      height: 5px;
      background: #fff;
    }
  }
  &::before {
    content: '';
    position: absolute;
    top: 5px;
    left: -16px;
    width: 16px;
    height: 17px;
    border-style: solid;
    border-width: 0 0 3px 3px;
    border-color: #10cac8;
    background: transparent;
    border-bottom-left-radius: 16px 17px;
  }
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: -16px;
    width: 16px;
    height: 11px;
    border-style: solid;
    border-width: 0 0 3px 3px;
    border-color: #10cac8;
    background: transparent;
    border-bottom-left-radius: 16px 12px;
  }
}
.w-120 {
  width: 120px;
  flex: 0 0 120px;
}
.product-img {
  flex: 0 0 120px;
  width: 120px;
  height: 120px;
  background: #f5f7fa;
  overflow: hidden;
  img {
    max-width: 120px;
    max-height: 120px;
  }
  .product-award {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40%;
    height: 40%;
  }
}
.h-20 {
  height: 20px;
}
.title-selected {
  flex: 0 0 110px;
}
.last-access {
  border: 1px solid #ff7575;
  color: #ff7575;
  border-radius: 3px;
  background: #fff3f3;
  padding: 2px 10px;
  font-size: 12px;
  margin-left: 20px;
}
.border-top {
  border-top: 1px solid #707070;
}
.ml-100 {
  margin-left: 100px;
}
.co-tools {
  line-height: 2;
  font-size: 21px;
  color: #327ab7;
}
.rating /deep/ {
  align-items: center;
  margin-top: -8px;
  .star {
    font-size: 25px;
  }
  .rate-num {
    a {
      color: red;
      font-size: 16px;
    }
  }
}
</style>
<docs>
  ```vue
  <template>
    <DetailHeader :product="data" :onGoToSearch="onGoToSearch" :cartInfo="cartInfo"/>
  </template>
  <script>
  export default {
    data() {
      return {
        cartInfo: {
          price: 119800,
          oldPrice: 49800,
          discountLimit: 5,
          discountRemain: 5,
          remain: 5,
          bank: 1,
          cart: 1,
          conv: 1,
          bit: 1,
          id: 10494,
          type: 1,
          status: 1,
          count: 0,
          expectedSaleCount: 0,
          date: 1477233747,
          is_dvd: 1,
          update: 0,
          isSaleStop: 0,
          isFavorite: 0,
          isPortfolio: 0,
          isSubscription: 0,
          favoriteCount: 0,
          isWebAuthentication: 1,
          forwardAt: 1477233747
        },
        data: {
          id: 9607,
          communityTotal: 143,
          name: "ハーモニックパターン検出インジケータ",
          description: "MT4でハーモニックパターン自動検出！",
          categories: "1,2,13",
          keywords: "1,4,9,16",
          review: {
            stars: 4,
            count: 43
          },
          user: {
            id: 111923,
            name: "だいすけ",
            transaction: "＊＊＊＊＊＊＊＊＊＊4277"
          }
        }
      }
    },
    methods: {
      onGoToSearch() {}
    }
  }
  </script>
  ```
</docs>
