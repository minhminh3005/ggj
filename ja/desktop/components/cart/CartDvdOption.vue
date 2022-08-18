<template>
  <div class="options-wrapp">
    <b class="mr-20 mb-20 mt-5 flex mid" style="font-size: 19px; color: #282882;">
      <CD style="width: 22px; height: 22px;" />
      <span>{{ $t(5) }}</span>
      <a
        href="/post/53/7726"
        style="color: #0b49c9; font-size: 13px;"
        class="ml-5"
      >
        {{ $t(6) }}
      </a>
    </b>
    <div class="ml-25">
      <div>
        <radio
          v-model.number="opt"
          :attrs="{value: '0'}"
          class="flex mid"
          :label="$t('2')"
        />
      </div>
      <div v-if="hasDvd[0]">
        <radio
          v-model.number="opt"
          :attrs="{value: '1'}"
          class="flex mid"
          :label="$t('price1', {price: formatNumber(allDvDPrice[1])})"
        />
      </div>
      <div v-if="hasDvd[1]">
        <radio
          v-model.number="opt"
          :attrs="{value: '2'}"
          class="flex mid"
          :label="$t('price2', {price: formatNumber(allDvDPrice[2])})"
        />
      </div>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/components-desktop/cart-dvd-options.json'
import CD from "@@/../components/icons/CD.vue"
import Radio from "@@/../components/form/Radio.vue"
export default {
  model: {
    prop: 'mValue',
    event: 'input',
  },
  components: {
    CD,
    Radio,
  },
  i18n: {
    messages: i18n,
  },
  props: {
    mValue: Number,
  },
  computed: {
    opt: {
      get() {
        return this.$store.getters['cart01/dvdOpt']
      },
      set(val) {
        this.$store.commit('cart01/setDvd', {
          dvdOpt: val,
        })
      },
    },
    hasDvd: {
      get() {
        return this.$store.getters['cart01/hasDvd']
      }
    },
    allDvDPrice() {
      return this.$store.getters['cart01/allDvDPrice']
    },
  },
}
</script>
<style lang="scss" scoped>
.options-wrapp {
  width: 600px;
  color: #2d2d2d;
  /deep/ .c-label {
    margin-bottom: 0;
    font-size: 13px;
    padding-left: 22px;
    height: 32px;
    input[type="radio"], input[type="checkbox"] {
      margin-top: 0;
    }
    .radiomark {
      height: 15px;
      width: 15px;
      border: 1px solid #0075ff;
      top: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      &::after {
        position: static;
        width: 9px;
        height: 9px;
        background: #0075ff;
      }
    }
    .t-label {
      margin-left: 5px;

      /* background: #ddd; */
      border-radius: 3px;
      line-height: 12px;
      font-size: 13px;
    }
  }
}
</style>
<docs>
  ```vue
  <template>
    <CartDvdOption v-model.number="opt"/>
  </template>
  <script>
  export default {
    data() {
      return {
        opt: undefined
      }
    },
  }
  </script>
  ```
</docs>
