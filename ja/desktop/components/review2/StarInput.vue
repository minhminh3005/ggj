<template>
  <div class="review-rate flex">
    <div class="rate-star flex row-reverse" :class="{ disabled: posting }">
      <span
        class="star cursor-pointer"
        v-for="i in 5"
        :key="'rate' + i"
        @click="onRate(i)"
        :class="check(i)"
        @mouseover="onMouseOver(i)"
        @mouseout="onMouseOut(i)"
      ></span>
    </div>
    <input
      type="hidden"
      name="star"
      v-model="reviewStars"
      v-validate="{ rules: { required: true, min_value: 1, max_value: 5 } }"
    />
  </div>
</template>

<script>
export default {
  model: {
    prop: "reviewStars",
    event: "change",
  },
  props: {
    posting: {
      type: Boolean,
      default: false,
    },
    reviewStars: {
      type: [Number, Object],
      default: null,
    },
  },
  data() {
    return {
      tempReviewStars: null,
    }
  },
  methods: {
    onRate(star) {
      if (this.posting) {
        return
      }
      // this.reviewStars = 5 - star + 1
      this.$emit("change", 5 - star + 1)
    },
    check(i) {
      let tempReviewStars = this.tempReviewStars || this.reviewStars || 0,
        a = i + tempReviewStars,
        b = i + parseInt(tempReviewStars)
      if (a > 5) {
        return b === 5 ? { half: true } : { full: true }
      }
    },
    onMouseOut() {
      this.tempReviewStars = null
    },
    onMouseOver(i) {
      this.tempReviewStars = 5 - i + 1
    },
  },
}
</script>

<style lang="less" scoped>
@active: #fcd605;
@deactive: #c1c1c1;
.review-rate {
  align-items: center;
  .rate-star {
    .star:hover ~ .star {
      color: @active;
    }
    .star {
      color: @deactive;
      display: inline-block;
      font-size: 22px;
      &:hover {
        color: @active;
      }
    }
    .full {
      color: @active;
    }
    .half {
      position: relative;
    }
    .half::after {
      top: 0;
      left: 0;
      position: absolute;
      overflow: hidden;
      content: "\2605";
      color: @active;
      width: 50%;
    }
  }
  .star-note {
    align-items: center;
    i {
      color: @active;
      padding-bottom: 3px;
      width: 20px;
      height: auto;
    }
    p {
      margin: 0;
    }
  }
}
</style>
