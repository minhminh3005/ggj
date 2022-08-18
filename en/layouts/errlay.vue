<template>
  <div class="err-layout flex layout-col">
    <Header />
    <nuxt class="w-1000" />
  </div>
</template>

<script>
import Header from '@/components/header/Header.vue'

export default {
  components: { Header },
}
</script>
