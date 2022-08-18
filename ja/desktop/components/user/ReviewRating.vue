<template>
  <div class="reviewing pos-rel">
    <div class="user-review" :class="{'user-review-full': [1,3].includes(type) }">
      <div class="left mr-20">
        <div class="author" :class="{'mb-15': type == 0}" v-if="type !== 2">
          <Lzimg width="50" height="50" :data-src="'/img/users/'+data.userId+'/small'" alt="" />
          <a :href="'/users/'+data.userId" target="_blank" class="author-name">{{ data.userName }}</a>
        </div>
        <rate v-if="[1,3].includes(type)" :stars="data.ratingStars || data.stars" class="rating" :classes="'rate-star rate'" />
        <div class="author-content" @click="goDetail">
          <b class="mb-10">{{ data.title }}</b>
          <p class="content">
            {{ data.content }}
          </p>
        </div>
      </div>
      <div class="right" v-if="[0,2].includes(type)">
        <a class="block w-90 no-underlying" :href="data.productDetailUrl">
          <Lzimg width="100" height="100" :data-src="'/img/products/'+data.productId+'/small'" alt="" />
          <p class="break-word">{{ data.productName }}</p>
        </a>
        <rate :stars="data.ratingStars || data.stars" class="rating" :classes="'rate-star rate'" />
      </div>
    </div>
    <div class="date" v-if="data.publishedAt">
      {{ formatTime(data.publishedAt, 6) }}
    </div>
  </div>
</template>

<script>
import Rate from '@/components/user/Rate.vue'
import Lzimg from '@@/../components/Lzimg.vue'

export default {
  components: {
    Rate,
    Lzimg,
  },
  props: {
    data: Object,
    type: {
      type: Number,
      default: 0
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    goDetail() {
      const target = [0,2].includes(this.type)
      location.href = target ? `/review/detail/${this.data.productId}` : `/users/${this.data.userId}`
    }
  }
}
</script>

<style lang="scss" scoped>
.reviewing {
  border-bottom: 1px solid #b4b5b6;
}
.user-review {
  display: flex;
  justify-content: space-between;
  .left {
    flex: 0 0 82%;
    width: calc(100% - 125px);
  }
}
.break-word {
  word-wrap: break-word;
  width: 100px;
  margin: 0;
  padding-top: 10px;
}
.right {
  font-size: 13px;
}
.rating {
  font-size: 18px;
  .star {
    font-size: 20px;
  }
}
.date {
  text-align: right;
  color: #909090;
}
.author {
  display: flex;
  align-items: center;
  p {
    margin: 0;
    padding-left: 10px;
  }
}
.author-star {
  margin-top: 5px;
}
.user-review-full {
  .left {
    flex: 0 0 100%;
  }
}
.content {
  margin-top: 5px;
  white-space: pre-line;
}
.author-name {
  color: #333;
  font-weight: bold;
  margin-left: 5px;
  &:hover {
    text-decoration: none;
  }
}
.author-content {
  height: calc(100% - 50px);
  cursor: pointer;
}
</style>
