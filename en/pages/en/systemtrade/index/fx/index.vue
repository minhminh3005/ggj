<template>
  <section></section>
</template>
<script>
  export default {
    async asyncData({error}) {
      return error({ statusCode: 404, exists: 1 }) 
    }
  }
</script>