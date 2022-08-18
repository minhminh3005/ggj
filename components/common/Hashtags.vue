<template>
  <div class="hashtags-container" v-if="hashtags.length">
    <a v-for="(item, idx) in hashtags"
       :key="`ht-${idx}`" class="hashtag"
       :href="`${SEARCH_URL}&h=${item.hashtag}`"
       :class="{'selected': item.hashtag == $route.query.h}"
    >
      #{{ item.hashtag }}
    </a>
  </div>
</template>

<script>
import { SEARCH_URL } from '@@/../common/assets/consts/common'

export default {
  data() {
    return {SEARCH_URL}
  },
  props: {
    hashtags: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .hashtags-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }
  .hashtag {
    font-size: 14px !important;
    margin: 0 8px 8px 0;
    border: 1px solid #EAEAEA;
    cursor: pointer;
    text-align: center;
    border-radius: 4px;
    padding: 6px 12px;
    color: #707070;
    text-decoration: none;
    &:hover {
      background: #B9E3EA;
    }
  }
  .selected {
    background: #B9E3EA;
  }
</style>
