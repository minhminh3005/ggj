<template>
  <div class="flex">
    <div v-for="i in monthList" :key="'period-' + i" class="btn-period flex mid center" :class="[themeCls, {'active': m == i}]" @click="onChangeM(rv, i)">
      {{ $t('' + i) }}
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/systemtrade-period.json'
export default {
  props: {
    rv: String,
    m: [Number, String],
    onChangeM: {
      type: Function,
      default: () => {}
    },
    themeCls: {
      type: String,
      default: 'theme-1'
    }
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      monthList: [
        1,
        3,
        12,
        0
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-period {
  border: 1px solid #dbdbdb;
  margin: 0 5px;
  color: #7d7d7d;
  cursor: pointer;
  &.active {
    background: #003567;
    color: white;
  }
}
.theme-1 {
  width: 60px;
  height: 25px;
  font-size: 13px;
  border-radius: 3px;
}
.theme-2 {
  width: 80px;
  height: 30px;
  font-size: 15px;
  border-radius: 5px;
}
</style>