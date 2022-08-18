<template>
  <div
    class="center favorite-box flex layout-col mid"
    @click="onFavorite"
    :class="{ 'is-favorite': cartInfo.isFavorite }"
  >
    <div class="flex mid center"><Heart /> {{ $t(37) }}</div>
    <div style="color: #ec5665;"><b>{{ cartInfo.favoriteCount || 0 }}</b></div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/tools-detail.json'
import Heart from '@@/../components/icons/Heart.vue'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Heart,
  },
  computed: {
    cartInfo() {
      return this.$store.state.cart.info
    },
  },
  methods: {
    onFavorite() {
      this.$store.dispatch('cart/favorite', this)
    },
  },
}
</script>

<style lang="scss" scoped>
.favorite-box {
  width: 110px;
  height: 55px;
  box-shadow: 0 0 1px 1px #ec5665;
  border-radius: 4px;
  text-align: center;
  padding: 4px 6px 0 6px;
  color: #666;
  cursor: pointer;
  &.is-favorite {
    background: #fff3f3;
    color: #ec5665;
    .icon-cls {
      color: #ec5665;
    }
  }
  .icon-cls {
    height: 19px;
    width: 18px;
    margin-right: 3px;
  }
}
</style>