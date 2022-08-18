<template>
  <div class="lock-password flex mid" v-if="checkShowPassword">
    <input
      class="input-field pl-10 pr-10 mr-10"
      :class="(isError) ? 'is-error' : ''" v-model="password"
      :placeholder="(isError) ? $t(4) : $t(5)"
      type="password"
    />
    <button class="btn-lock flex mid center btn" @click="handleCallPassword" :class="{'disabled': loading}">
      <span>{{ $t(6) }}</span>
    </button>
  </div>
  <button v-else-if="isSaleStop" class="deactive-OaDiw" @click="addToCart" :disabled="isSaleStop">
    <div class="flex mid center">
      <span class="text-cart">
        {{ $t(8) }}
      </span>
      <span class="price-wrap" v-if="price">
        {{ currency }}{{ formatNumber(price || discountPrice) }}/{{ $t('1') }}
      </span>
    </div>
    <!-- <div class="flex mid center" v-if="isSaleStop">
      <span>
        {{ $t(9) }}
      </span>
    </div> -->
  </button>
  <button v-else class="btn-orange" @click="addToCart">
    <div class="flex mid center">
      <span class="text-cart">
        {{ $t(7) }}
      </span>
      <span class="price-wrap" v-if="price">
        {{ currency }}{{ formatNumber(discountPrice || price) }}/{{ $t('1') }}
      </span>
      <span v-else class="price-wrap">{{ $t('2') }}</span>
      <span class="price-wrap discount-price" v-if="discountPrice">
        {{ currency }}{{ formatNumber(price) }}/{{ $t('1') }}
      </span>
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
    getCartPassword: {
      type: Function,
    },
    isSaleStop: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cartProcesssing: false,
      password: null,
      loading: false,
    }
  },
  computed: {
    isError() {
      return this.productStatus === 0
    },
    checkShowPassword() {
      return this.isPassword !== 0 && this.productStatus !== 1
    },
    productStatus() {
      return this.$store.state.cart.productStatus
    },
    isPassword() {
      return this.$store.getters['cart/isPassword']
    },
  },
  methods: {
    addToCart() {
      if (this.cartProcesssing) {
        return
      }
      this.cartProcesssing = true
      this.$store.dispatch('cart/addToCart', {
        productId: this.productId,
        price: this.price,
      })
    },
    handleCallPassword() {
      this.loading = true
      this.getCartPassword(this.password).finally(() => {
        this.loading = false
      })
    },
  },
}
</script>


<style lang="scss" scoped>

.deactive-OaDiw {
  height: 50px;
  font-size: 15px;
  text-decoration: none;
  color: #fff;
  position: relative;
  outline: none;
  background: #707070;
  border: none;
  border-radius: 4px;
  cursor: not-allowed;
  .price-wrap {
    margin-top: 1px;
  }
  .discount-price {
    text-decoration: line-through;
    color: #333;
    font-size: 12px;
  }
}

.btn-orange {
  //width: 220px;
  height: 50px;
  font-size: 15px;
  text-decoration: none;
  color: #fff;
  outline: none;
  background-color: #ff8500;
  border: none;
  .price-wrap {
    margin-top: 1px;
  }
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
.icon-cls {
  flex: 0 0 18px;
  width: 18px;
  height: 20px;
}
.lock-password {
  border-radius: 10px;
  .hint {
    color: #2d2d2d;
  }
  .input-field {
    height: 35px;
    width: 150px;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    &::placeholder {
      color: #9f9f9f;
    }
    &.is-error {
      border: 1px solid red;
      &::placeholder {
        color: red;
      }
    }
  }
  .btn {
    color: white;
    background: #ff9929;
    height: 30px;
  }
  .disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
.text-cart {
  padding-right: 20px;
}

@media only screen and (max-width: 768px),
only screen
and (max-width: 896px) 
and (max-height: 414px) {
  .btn-orange {
    width: 100%;
    margin-top: 40px;
  }
}
</style>
