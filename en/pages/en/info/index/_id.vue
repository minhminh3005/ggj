<template>
  <div class="w-1000 info-detail">
    <div class="p-30">
      <div class="mt-20 mb-20 back-content co-19 fs-15 lh-20">
        <div @click="onBack" class="cursor-pointer">
          <b>{{ $t('3') }}</b>
        </div>
      </div>
      <Info :product="item" :detail="false" class="detail-info" />
      <div class="mt-50 mb-50" v-html="content" v-if="item"></div>
    </div>
  </div>
</template>

<script>
import title from '@@/../common/pages'
import inforMixin from '@@/../utils/mixins/info/index/_type/_id'

const obj = Object.assign(
  {
    mixins: [inforMixin],
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
@import '@@/../common/assets/info/info.scss';
.col1,
.col2 {
  display: block;
  width: 82px;
  padding: 3px 0 2px;
}
</style>
