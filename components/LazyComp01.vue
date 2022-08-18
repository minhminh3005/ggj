<template>
  <div :style="{minHeight}" :class="classes">
    <slot v-if="alwaysShow || shouldShow || isBot" />
  </div>
</template>
<script>
export default {
  props: {
    minHeight: {
      type: String,
      required: true,
    },
    classes: {
      type: String,
      default: ''
    },
    alwaysShow: Boolean
  },
  data() {
    return {
      isBot: this.$store.state.isBot,
      shouldShow: false,
    }
  },
  mounted() {
    if (this.alwaysShow) {
      this.$emit('comp-ready')
      return
    }
    let opt = {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      },
      observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) {
            return
          }
          observer.unobserve(this.$el)
          this.shouldShow = true
          this.$emit('comp-ready')
        })
      }, opt)
    observer.observe(this.$el)
  },
}
</script>
