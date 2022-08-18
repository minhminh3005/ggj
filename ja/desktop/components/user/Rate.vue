<template>
  <div class="flex gg-rating fs-13" :class="[classes, { 'rate-hover' : isHover}]">
    <span :key="i" class="star cursor-pointer" v-for="i in 5" :class="[check(i)]" @click="rating(i)"></span>
  </div>
</template>

<script>
export default {
  props: {
    stars: Number,
    classes: {
      type: String,
      default: ''
    },
    isHover: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    stars(val) {
      this.istars = val
    },
  },
  data() {
    return {
      istars: this.stars || 0,
    }
  },
  methods: {
    check(i) {
      let a = i + this.istars,
        b = i + parseInt(this.istars)
      if (a > 5) {
        return b === 5 ? { half: true } : { full: true }
      }
    },
    rating(i) {
      if(!this.isHover) return
      this.istars = 5 - i + 1
      this.$emit('input', this.istars)
    },
  },
}
</script>


<style lang="scss" scoped>
$active: #fcd605;
$deactive: #c1c1c1;
.gg-rating {
  color: $deactive;
  flex-direction: row-reverse;
  justify-content: flex-end;
}
.star {
  color: $deactive;
  display: inline-block;
}
.star::before {
  content: '\2605';
}
.full {
  color: $active;
}
.half {
  position: relative;
}
.half::after {
  top: 0;
  left: 0;
  position: absolute;
  overflow: hidden;
  content: '\2605';
  color: $active;
  width: 50%;
}
.rate-star {
  display: flex;
  justify-content: flex-end;
  flex-direction: row-reverse;
  &.view {
    .star {
      font-size: 25px;
    }
  }
  &.rate-hover {
    .star {
      font-size: 25px;
      cursor: pointer !important;
    }
    .star:hover {
      color: $active;
    }
    .star:hover ~ .star {
      color: $active;
    }
  }
  .star {
    margin-right: 5px;
    font-size: 18px;
    cursor: unset !important;
  }
}
</style>
