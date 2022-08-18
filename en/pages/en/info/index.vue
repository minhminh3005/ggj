<template>
  <div class="w-1000">
    <YearSlider :year="year" @year="onSelectYear" />
    <nuxt-child />
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/info.json'
import inforMixin from '@@/../utils/mixins/info/index'
export default {
  mixins: [inforMixin],
  i18n: {
    messages: i18n
  }
}
</script>

<style lang="scss" scoped>
.info-title {
  /deep/ {
    b {
      color: #666;
    }
  }
}
</style>
