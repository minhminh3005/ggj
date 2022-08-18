<template>
  <section class="cart-layout">
    <CommonResponsive :opt="{noCriteo: true}">
      <nuxt class="body mh-body" />
      <Spinner v-if="isLoading" />
    </CommonResponsive>
  </section>
</template>
<script>
import Spinner from '@@/../components/Spinner.vue'
import i18n from '@@/lang/common/layout-cart.json'
import CommonResponsive from '@@/../common/layouts/common-responsive'

export default {
  i18n: { messages: i18n },
  components: {
    Spinner,
    CommonResponsive
  },
  mounted() {
    this.$nuxt.$on('cart/showSpinner', show => {
      this.isLoading = show
    })
  },
  data() {
    return {
      isLoading: false
    }
  },
}
</script>
<style lang="scss">
@import '@/assets/cart/variables.scss';
@media only screen and (max-width: $max-width) {
  .w-1000 {
    width: 100% !important;
  }
}
@media only screen and (min-width: $min-width) {
  .scroll-btn {
    display: none !important;
  }
}
@media only screen and (max-device-width: $max-width) {
  html,
  body {
    width: auto !important;
    font-size: 15px;
  }
}
@media only screen and (min-device-width: $min-width) and (max-device-width: 1024px) {
  html,
  body {
    width: 1025px;
  }
}
</style>

<style lang="scss" scoped>
@import '@/assets/cart/variables.scss';
/* stylelint-disable */
@media only screen and (max-width: $max-width) {
  .logo-cls {
    width: 125px !important;
    height: 45px !important;
  }
  .change-lang {
    margin: 0;
    width: 100%;
  }
  /deep/ .change-lang {
    z-index: 9;
    width: 140px !important;
    height: 27px;
    & > div {
      width: 100% !important;
    }
  }
  .cart-footer {
    margin-top: 0 !important;
  }
}
@media only screen and (min-width: 1000px) {
  /deep/ .change-lang {
    z-index: 9;
    width: 170px !important;
    height: 27px;
    & > div {
      width: 100% !important;
    }
  }
}
.top-header {
  background: white;
  box-shadow: 0 3px 4px #ededed;
  padding: 10px 5px;
  a {
    display: inline-block;
  }
  .logo-cls {
    width: 175px;
    height: 45px;
  }
}
.cart-footer {
  margin-top: 100px;
}
.lang-vi {
  font-family: Arial, sans-serif;
}
.mh-body {
  min-height: calc(100vh - 576px);
}
.cart-layout {
  /deep/ .spinner {
    z-index: 1001;
  }
}
</style>
<style lang="scss">
.cart-layout {
  .bread-crumb {
    display: none;
  }
}
</style>
