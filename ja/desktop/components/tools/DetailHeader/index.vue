<template>
  <div class="product-header">
    <!-- 1. product img + title + description -->
    <div class="flex">
      <div class="product-img mr-20">
        <img :src="'/img/products/' + product.id" :alt="`${product.name} ${$t('23')}`" />
        <!-- <img src="/img/assets/pc/award/product.png" class="product-award" v-if="showAward" /> -->
      </div>
      <div style="min-height: 110px; flex-grow: 1;">
        <div class="name">{{ product.name }}</div>
        <div v-html="product.description" class="description"></div>
      </div>
    </div>

    <!-- 2. product information -->
    <div class="flex mt-15">
      <!-- 2.1 left block -->
      <div style="min-height: 200px; width: 130px; flex: 0 0 130px;" class="mr-20">
        <!-- favorite -->
        <FavoriteBox />
        <!-- performance -->
        <div class="mt-20">
          <span>{{ $t(22) }}：</span>
          <div class="fs-24 co-red"><b>{{ cartInfo.count }}本</b></div>
        </div>
        <!-- review -->
        <div class="mt-20">
          <span>{{ $t(10) }}：</span>
          <Rate
            style="font-size: 16px;"
            :alway-show="true"
            :stars="(product.review || {}).stars"
            :target="product.id"
            :number="(product.review || {}).count" 
          />
        </div>
      </div>
      <!-- 2.2 right block -->
      <div style="width: calc(100% - 120px); min-height: 200px; flex-grow: 1;">
        <!-- discount -->
        <!-- <div class="flex info-row" v-if="cartInfo.discountStart && cartInfo.discountEnd">
          <div class="row-title">{{ $t(20) }}:</div>
          <div class="row-content"><b>{{ formatTime(cartInfo.discountStart, 0) }} ~  {{ formatTime(cartInfo.discountEnd, 0) }}</b></div>
        </div> -->
        <!-- community -->
        <CommunityButton :attrs="{page: 'tools'}" />
        <!-- reserved -->
        <div class="flex">
          <div class="flex info-row pr-10" v-if="cartInfo.reservedStart">
            <div class="row-title">{{ $t(9) }}：</div>
            <div class="row-content"><b>{{ formatTime(cartInfo.reservedStart, 0) }}</b></div>
          </div>
          <div class="flex info-row pr-10" v-if="cartInfo.reservedEnd">
            <div class="row-title">{{ $t(21) }}：</div>
            <div class="row-content"><b>{{ formatTime(cartInfo.reservedEnd, 0) }}</b></div>
          </div>
        </div>
        <!-- saleRemain -->
        <div class="flex info-row" v-if="cartInfo.saleRemain">
          <div class="row-title">{{ $t(19) }}:</div>
          <div class="row-content"><b>{{ $t(17) }}{{ cartInfo.saleRemain }}{{ $t(18) }}</b></div>
        </div>
        <!-- discountRemain -->
        <div class="flex info-row" v-if="cartInfo.discountRemain">
          <div class="row-title">{{ $t(16) }}:</div>
          <div class="row-content"><b>{{ $t(17) }}{{ cartInfo.discountRemain }}{{ $t(18) }}</b></div>
        </div>
        <!-- keyword -->
        <div class="flex info-row" v-if="product.typeId === 13 ? !(product.categoryLarge || {}).id || (product.categoryLarge || {}).id < 4 : true">
          <div class="row-title">{{ $t(3) }}:</div>
          <div class="row-content flex flex-wrap">
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
        <!-- category -->
        <div class="flex info-row">
          <div class="row-title">{{ $t(1) }}:</div>
          <div class="row-content flex flex-wrap">
            <template v-if="product.typeId === 13">
              <div class="mb-5 mr-10">
                <template v-if="(product.categoryLarge || {}).name">
                  <a class="cursor-pointer" :href="product.categoryLarge.path"><b>{{ product.categoryLarge.name }}</b></a>
                  <template v-if="(product.categoryMiddle || {}).id">
                    <span>{{ ' > ' }}</span>
                    <a class="cursor-pointer" :href="product.categoryMiddle.path"><b>{{ product.categoryMiddle.name }}</b></a>
                  </template>
                </template>
                <span v-else>-</span>
              </div>
            </template>
            <template v-else-if="(product.categoryList || []).length">
              <span class="mb-5 mr-10" v-for="item in (product.categoryList || [])" :key="'prd-cate-' + item.categoryId">
                <a class="cursor-pointer" @click="onGoToSearch(2, item.categoryId)"><b>{{ item.name }}</b></a>
              </span>
            </template>
            <template v-else>
              -
            </template>
          </div>
        </div>
        <!-- providing method -->
        <div class="flex info-row">
          <!-- label -->
          <div class="row-title">{{ $t('25') }}:</div>
          <!-- rooms -->
          <div class="row-content" v-if="product.typeId == 13">{{ $t('24') }}</div> 
          <!-- indicator -->
          <div class="row-content" v-else-if="product.typeId == 2">{{ $t('35') }}</div>
          <!-- ebooks -->
          <div class="row-content" v-else>{{ $t('36') }}</div>
        </div>
        <!-- cart info started/updated -->
        <div class="flex">
          <div class="flex info-row pr-10">
            <div class="row-title">{{ $t(9) }}:</div>
            <div class="row-content">
              {{
                cartInfo.start ? formatTime(cartInfo.start, 7) : '-'  
              }}
            </div>
          </div>
          <div class="flex info-row">
            <div class="row-title">{{ $t(13) }}:</div>
            <div class="row-content">
              {{
                cartInfo.updated ? formatTime(cartInfo.updated, 7) : '-'  
              }}
            </div>
          </div>
        </div>
        <!-- versions -->
        <div class="flex info-row">
          <div class="row-title">{{ $t('14') }}:</div>
          <div class="row-content">{{ cartInfo.version || '-' }}</div>
        </div>
        <!-- brokers -->
        <div class="flex info-row" v-if="(cartInfo.brokers || []).length">
          <div class="row-title">{{ $t('27') }}:</div>
          <div class="row-content flex flex-wrap">
            <span
              v-for="item in brokers"
              :is="(isSuportLocale || !companyUrls[item])
                ? 'span'
                : 'a'" :href="companyUrls[item]"
              :key="'broker-' + item"
              class="fs-12 h-20 block mr-5 border-radius-10 pr-10"
            >
              {{ allowedBrokers[item] }}
            </span>
          </div>
        </div>
        <!-- payment methods -->
        <div class="flex info-row" v-if="cartInfo.price && !cartInfo.externalUrl">
          <div class="row-title">{{ $t(28) }}:</div>
          <div class="row-content">
            <template v-if="cartInfo.payments">
              <div class="card-img flex flex-wrap">
                <template v-if="cartInfo.payments.card === 1">
                  <img class="mr-5 mb-5" src="/img/assets/pc/common/payment_ico_mastercard.png" alt="" />
                  <img class="mr-5 mb-5" src="/img/assets/pc/common/payment_ico_visacard.png" alt="" />
                </template>
                <template v-if="cartInfo.payments.card2 === 1">
                  <img class="mr-5 mb-5" height="35" src="/img/assets/pc/common/payment_ico_jcb.png" alt="" />
                </template>
                <template v-if="cartInfo.payments.store === 1">
                  <img class="mr-5 mb-5" src="/img/assets/pc/common/payment_ico_D1.png" alt="" />
                  <img class="mr-5 mb-5" src="/img/assets/pc/common/payment_ico_D2.png" alt="" />
                  <img class="mr-5 mb-5" src="/img/assets/pc/common/payment_ico_familymart_new.png" alt="" />
                </template>
              </div>
            </template>
            <span v-else>-</span>
            <!-- <template v-if="cartInfo.price && cartInfo.isDvd">
              <div class="mb-10 flex mid mt-10">
                <CD class="cd-icon" />
                <b class="ml-5 fs-18">{{ $t("31") }}</b>
              </div>
              <div class="fs-16 mt-5">
                <b style="color: #666;">{{ $t("32") }}</b>
                <span>(<b class="co-red">{{ $t("34", { price: "1,480" }) }}</b>)</span>
                <a href="/post/53/7726" target="_blank" class="text-underline ml-5">{{ $t("33") }}</a>
              </div>
            </template> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/product-detailheader.json'
import FavoriteBox from './FavoriteBox'
// import ProductVertical from '@@/../components/product/ProductVertical.vue'
import ProductInfo from '@/components/product/ProductInfo.vue'
// import { products } from '@@/../common/assets/award2020.js'
import Rate from '@@/../components/product/Rate.vue'
import SaleCount from '@/components/product/SaleCount.vue'
const GET_BROKERS_URL = '/api/v3/brokers/domestic'
import CommunityButton from '@@/../components/community/CommunityButton.vue'

export default {
  components: {
    // ProductVertical,
    CommunityButton,
    ProductInfo,
    Rate,
    SaleCount,
    FavoriteBox,
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
      companyUrls: [],
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
    brokers() {
      return (this.cartInfo.brokers || []).filter(e => Object.keys(this.allowedBrokers).includes(e.toString()))
    },
    isSuportLocale() {
      return this.langSupported().includes(this.$i18n.locale)
    },
    // showAward() {
    //   return products.includes(this.product.id)
    // },
  },
}
</script>

<style lang="scss" scoped>
.product-header {
  .product-img {
    flex: 0 0 110px;
    width: 110px;
    height: 110px;
    background: #f5f7fa;
    overflow: hidden;
    position: relative;
    img {
      max-width: 110px;
      max-height: 110px;
    }
    .product-award {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 40%;
      height: 40%;
    }
  }
  .name {
    color: #434a54;
    font-weight: bold;
    font-size: 20px;
  }
  .description {
    color: #8b8b8b;
  }
  .info-row {
    margin-bottom: 15px;
    width: 100%;
    .row-title {
      color: #666;
      font-weight: bold;
      width: 110px;
      flex: 0 0 110px;
    }
    .row-content {
      flex-grow: 1;
    }
  }
  .card-img img {
    height: 19px;
  }
}
.co-red {
  color: red;
}
.fs-24 {
  font-size: 24px;
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
}
.h-20 {
  height: 20px;
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
