<template>
  <button class="btn-orange w-full" :class="{'btn-free': (!price && !paid), 'btn-purchased': purchased && paid}" @click="addToCart">
    <div class="flex mid center">
      <span class="price-wrap" v-if="purchased">
        {{ $t('3') }}
      </span>
      <template v-else>
        <span class="price-wrap" v-if="price">
          {{ currency }}{{ formatNumber(discountPrice || price) }}
        </span>
        <span v-else-if="!price && !paid" class="price-wrap">{{ $t('2') }}</span>
        <span class="price-wrap discount-price" v-if="discountPrice">
          {{ currency }}{{ formatNumber(price) }}
        </span>
      </template>
    </div>
  </button>
</template>

<script>
import i18n from '@@/lang/components-desktop/mini-cart.json'

export default {
  i18n: {
    messages: i18n,
  },
  props: {
    discountPrice: [String, Number],
    price: [String, Number],
    productId: [String, Number],
    currency: {
      type: String,
      default: '￥',
    },
    purchased: {
      type: Number,
      default: 0,
    },
    paid: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      cartProcesssing: false,
    }
  },
  methods: {
    addToCart() {
      if (!this.price) {
        return
      }
      if (this.cartProcesssing) {
        return
      }
      this.cartProcesssing = true
      this.$store.dispatch('cart/addToCart', {
        productId: this.productId,
      })
    },
  },
}
</script>


<style lang="scss" scoped>
.btn-orange {
  width: 110px;
  height: 35px;
  text-decoration: none;
  color: #fff;
  outline: none;
  background-color: #ff8500;
  border: none;
  .discount-price {
    text-decoration: line-through;
    color: #333;
    font-size: 12px;
  }
}
.btn-orange:hover {
  outline: none;
  background-color: #ff9929;
}
.btn-free {
  text-decoration: none;
  color: #ffffff;
  outline: none;
  background-color: white;
  border: none;
  &:hover {
    outline: none;
    background-color: #e67905;
  }
}
.btn-purchased {
  font-size: 11px;
  text-decoration: none;
  color: white;
  outline: none;
  background-color: #c9c9c9;
  pointer-events: none;
  &:hover {
    outline: none;
    background-color: #c9c9c9;
  }
}
.border-radius-4 {
  border-radius: 4px;
}
.icon-cls {
  flex: 0 0 14px;
  width: 14px;
  height: 16px;
}
.price-wrap {
  margin-top: 1px;
  min-width: 100px;
}
</style>
