<template>
  <div :is="ICON_MAP[type]" v-if="type && ICON_MAP[type]" />
</template>

<script>
import Bronze from './Bronze.vue'
import Diamond from './Diamond.vue'
import Gold from './Gold.vue'
import Platinum from './Platinum.vue'
import Silver from './Silver.vue'
const ICON_MAP = {
  5: 'Diamond',
  4: 'Platinum',
  3: 'Gold',
  2: 'Silver',
  1: 'Bronze',
}

export default {
  components: {
    Bronze,
    Diamond,
    Gold,
    Platinum,
    Silver,
  },
  props: {
    type: {
      type: [String, Number],
      default: 0,
    }
  },
  data() {
    return {
      ICON_MAP,
    }
  }
}
</script>
