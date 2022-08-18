<template>
  <div class="err-layout flex layout-col">
    <HeaderResponsive :is404="true" />
    <nuxt />
  </div>
</template>

<script>
import HeaderResponsive from '@@/../components/header/HeaderResponsive'

export default {
  components: { HeaderResponsive },
}
</script>
