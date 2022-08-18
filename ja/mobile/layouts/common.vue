<template>
  <main>
    <Header />
    <slot class="body"></slot>
    <Footer />
    <no-ssr>
      <ScrollTopButton />
    </no-ssr>
  </main>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ScrollTopButton from '@@/../components/ScrollTopButton.vue'
import '@/assets/form.css'
import criteo from '@@/../common/js/criteo'

export default {
  components: {
    Header,
    Footer,
    ScrollTopButton,
  },
  mounted() {
    criteo.call(this)
  },
}
</script>
<style lang="scss" scoped>
.banner:hover img {
  opacity: 0.85;
}
</style>
