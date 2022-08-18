<template>
  <!-- TODO: when finish responsive for all of surface, remove this condition at v-if, using only CommonResponsive -->
  <CommonResponsive v-if="isSupportResponsive">
    <nuxt class="body" />
  </CommonResponsive>
  <CommonAdaptive v-else>
    <nuxt class="body" />
  </CommonAdaptive>
</template>

<script>
import CommonResponsive from '@@/../common/layouts/common-responsive'
import CommonAdaptive from '@@/../common/layouts/common-adaptive'

export default {
  components: {
    CommonResponsive,
    CommonAdaptive,
  },
  data() {
    return {
      isSupportResponsive: [
        /^\/(faq|search|estimate|review\/detail)/,
        /^(\/)$/
      ].some(i => i.test(this.$route.path))
    }
  },
}
</script>
