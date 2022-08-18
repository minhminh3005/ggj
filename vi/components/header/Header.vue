<template>
  <div class="w-full top-header">
    <div
      v-if="isMobile"
      class="back-mobile flex mid center"
      @click="switchToMobile()"
    >
      Return to <span> GogoJungle for mobile</span>
    </div>
    <Header01 />
  </div>
</template>

<script>
import header from './header.js'
export default header
</script>

<style lang="scss" scoped>
.top-header {
  box-shadow: 0 3px 4px #ededed;
  margin-bottom: 20px;
}
.back-mobile {
  display: none;
  width: 100%;
  height: 150px;
  background: #0343ce;
  font-size: 55px;
  color: white;
  span {
    text-decoration: underline;
  }
}
</style>
