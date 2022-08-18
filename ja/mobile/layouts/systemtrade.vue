<template>
  <CommonResponsive>
    <FixMenu />
    <nuxt class="body" />
  </CommonResponsive>
</template>

<script>
import FixMenu from '@/components/systemtrade/FixMenu.vue'
import CommonResponsive from '@@/../common/layouts/common-responsive'

export default {
  components: {
    CommonResponsive,
    FixMenu,
  },
}
</script>
