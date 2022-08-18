<template>
  <div 
    class="rewrite-outline-container pt-30 pb-20 mt-30" 
    v-if="(content || '').length"
  >
    <div class="rewrite-outline-title">
      {{ $t('1') }}
      <span>{{ $t('2') }}</span>
    </div>
    <div class="mt-20" v-html="content"></div>
  </div>
</template>
<script>
import i18n from '@@/lang/components-desktop/rewrite-outline.json'
export default {
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
    }
  },
}
</script>
<style lang="scss" scoped>
.rewrite-outline-container {
  border-top: 1px #b4b5b6 solid;
  border-bottom: 1px #b4b5b6 solid;
  .rewrite-outline-title {
    color: #666;
    font-size: 18px;
    span {
      font-size: 14px;
    }
  }
}
</style>