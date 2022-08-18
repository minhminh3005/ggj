<template>
  <nuxt />
</template>

<script>
import criteo from '@@/../common/js/criteo'

export default {
  mounted() {
    criteo.call(this)
  },
}
</script>
