<template>
  <div class="price-cls flex grow1" :class="{'layout-col': isVertical}" :style="isMobile ? 'flex-direction:column-reverse' :null ">
    <template v-if="typeof price === 'number'">
      <strong class="co-red">
        {{ !rightCurr ? priCurrency + formatNumber(iPrice, $t('1')) : formatNumber(iPrice, $t('1')) + priCurrency }}
      </strong>
      <strong v-if="iDiscountPrice">
        <span class="old-price co-black">
          {{ !rightCurr ? priCurrency + formatNumber(iDiscountPrice) : formatNumber(iDiscountPrice) + priCurrency }}
        </span>
        <span v-if="iDiscountFree && (iDiscountPrice - iPrice > 0)">({{ ((iDiscountPrice - iPrice) / iDiscountPrice * 100).toFixed(1) }}% OFF)</span>
      </strong>
    </template>
    <template v-else>
      <strong class="co-red" v-if="!iDiscountFree && !iDiscountPrice">
        {{
          (!rightCurr ? priCurrency + formatNumber(iPrice, $t("1")) : formatNumber(iPrice, $t("1")) 
            + priCurrency) + (isSubscription ? `/${$t('2')}` : "")
        }}
      </strong>
      <template v-else-if="iDiscountPrice">
        <div :class="{'product-percent' : showPercent}">
          <div :class="{'vertical' : showPercent || isVertical}">
            <strong>
              <span class="old-price co-black">
                {{
                  (!rightCurr ? priCurrency + formatNumber(iPrice) : formatNumber(iPrice) 
                    + priCurrency) + (isSubscription ? `/${$t('2')}` : "")
                }}
              </span>
            </strong>
            <strong>
              <span class="co-red">
                {{ (!rightCurr ? priCurrency + formatNumber(iDiscountPrice) : formatNumber(iDiscountPrice) + priCurrency) 
                  + (isSubscription ? `/${$t('2')}` : '') }}
              </span>
            </strong>
          </div>
          <small v-if="showPercent" class="percent">{{ calPercent(iPrice,iDiscountPrice) }}% OFF</small>
        </div>
      </template>
      <template v-else-if="iDiscountFree">
        <strong>
          <span class="old-price co-black">
            {{
              (!rightCurr ? priCurrency + formatNumber(iPrice) : formatNumber(iPrice) + priCurrency) 
                + (isSubscription ? `/${$t('2')}` : "")
            }}
          </span>
        </strong>
        <strong><span class="co-red">{{ $t('1') }}</span></strong>
      </template>
    </template>
  </div>
</template>
<script>
import i18n from '@@/lang/components/price.json'
export default {
  props: {
    oldPrice: Number,
    price: [Number, Object],
    isVertical: Boolean,
    currency: String,
    hasOff: Boolean,
    /**
     * The position of currency: true: right, false: left
     */
    rightCurr: {
      type: Boolean,
      default: false,
    },
    isMobile: {
      type: Boolean,
      default: false
    },
    showPercent: {
      type: Boolean,
      default: false
    }
  },
  i18n: {
    messages: i18n,
  },
  created() {
    this.processData()
  },
  watch: {
    price() {
      this.processData()
    },
    oldPrice() {
      this.processData()
    },
  },
  methods: {
    processData() {
      if (typeof this.price === 'object') {
        // preprocess data for new API
        let p = this.price
        this.iPrice = p.price
        this.iDiscountPrice = p.discountPrice
        this.isSubscription = p.isSubscription
      } else if (typeof this.price === 'number') {
        // preprocess data for old API
        this.iPrice = this.price
        this.iDiscountPrice = this.oldPrice
        this.iDiscountFree = this.hasOff
      }
      if(this.iDiscountPrice) {
        this.$emit('percent', this.calPercent(this.iPrice,this.iDiscountPrice))
      }
    },
    calPercent(iPrice,iDiscountPrice) {
      if(!iPrice && !iDiscountPrice) return 0
      return ((iPrice - iDiscountPrice) / iPrice * 100).toFixed(0)
    }
  },
  data: () => ({
    iPrice: null,
    iDiscountPrice: null,
    iDiscountFree: null,
    isSubscription: false
  }),
  computed: {
    priCurrency() {
      let c = this.iPrice && (this.currency || '￥')
      return c || ''
    }
  },
}
</script>

<style scoped lang="scss">
.price-cls:not(.layout-col) .co-red {
  margin-left: 5px;
}
.old-price {
  text-decoration: line-through;
  color: #434343;
}
.co-red {
  color: red;
}
.vertical {
  display: flex;
  flex-direction: column;
}
.product-percent {
  display: flex;
  align-items: flex-end;
  .percent {
    margin-left: 10px;
    background: #f00;
    color: #fff;
    padding: 1px 5px;
    font-weight: bold;
    margin-bottom: 2px;
  }
}
</style>

<docs>
  ```vue
  <template>
    <Price :price="item" />
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          price: 1980,
          discountPrice: 220
        },
      }
    },
  }
  </script>
  ```
  ```vue
  <template>
    <Price :price="item" :is-vertical="true" currency="$" />
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          price: 1980,
          discountPrice: 220
        },
      }
    },
  }
  </script>
  ```
  ```vue
  <template>
    <Price :price="item" :is-vertical="true" currency="$" :right-curr="true" />
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          price: 1980,
          discountPrice: 220
        },
      }
    },
  }
  </script>
  ```
</docs>
