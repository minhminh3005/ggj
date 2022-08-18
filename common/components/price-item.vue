<template>
  <div>
    <span v-if="price" :class="{'old-price': discountPrice }">¥ {{ formatNumber(price) }}</span>
    <span v-if="!price" :class="{'old-price': discountPrice }">{{ $t('17') }}</span>
    <span v-if="discountPrice" class="co-red"> ¥{{ formatNumber(discountPrice) }}</span>
    <span v-if="isMonthlyPrice && (price || discountPrice)" :class="{'co-red': discountPrice }">/{{ $t('16') }}</span>
    <span v-if="isFreeFirstMonth" class="ml-5">{{ $t('18') }}</span>
  </div>
</template>
<script>
import i18n from '@@/lang/components-desktop/navi-header.json'

export default {
    i18n: {
        messages: i18n,
    },
    props: {
        price: {
            type: Number,
            default: 0
        },
        discountPrice: {
            type: Number,
            default: 0
        },
        isMonthlyPrice: {
            type: Number,
            default: 0
        },
        isFreeFirstMonth: {
            type: Number,
            default: 0
        }
    }
}
</script>
<style lang="scss" scoped>
.co-red {
  color: red;
}
.old-price {
  color: #2c2c2c;
  text-decoration: line-through;
  margin-left: 5px
}
.deactive-price {
  .old-price, .co-red { color: #ffffff }
}
</style>