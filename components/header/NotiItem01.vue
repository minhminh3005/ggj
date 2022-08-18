<template>
  <a
    class="noti-item-01 flex space-between mp-ds cursor-pointer"
     
    :class="{
      'is-not-review': item.isReview === 0,
      'is-not-read': item.isRead === 0,
      'has-user': item.fromUserId
    }"
    @click="clickHandler($event)"
    :href="item.link"
    :is="item.link ? 'a' : 'div'"
  >
    <div class="user-icon-ctn flex mid center w-full" v-if="item.fromUserId">
      <img :src="`/img/users/${item.fromUserId}`" alt="">
    </div>
    <div class="content-tt">
      <div class="subject">
        <strong v-html="calcMatchStr(item.subject)" :title="item.subject"/>
      </div>
      <div class="content" v-html="calcMatchStr(item.content)" />
    </div>
    <span class="duration">{{ getDuration }}</span>
  </a>
</template>

<script>
// import i18n from '@/i18n/lang/components_desktop/notification.json'
import { tagRemoved } from '@/utils/client/common'

export default {
  i18n: {
    // messages: i18n,
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    keyWord: {
      type: String,
      default: '',
    },
  },
  computed: {
    getDuration() {
      const startTime = moment(this.item.updatedAt)
      const endTime = moment(Date.now())
      const diff = moment(endTime, 'YYYY/MM/DD HH:mm').diff(moment(startTime, 'YYYY/MM/DD HH:mm'))

      return moment.duration(diff).locale('ja').humanize()
    },
  },
  methods: {
    calcMatchStr(str) {
      let rs = tagRemoved(`${str}` || ''),
        keyWord = this.keyWord.replace(/\W/g, '\\$&'),
        rgx = new RegExp(`(${keyWord})`, 'gmi'),
        index = rs.search(rgx)
      if(keyWord && index) {
        // slice from visible position to end of string
        rs = index > 10 ? '...' + rs.slice(index - 10, Infinity)
                        : rs.slice(0, Infinity)
        // bold keyword
        rs = rs.replace(rgx, (_str) => `<strong class="keyword-match">${_str}</strong>`)
      }

      return rs
    },
    clickHandler(e) {
      if(e.ctrlKey && this.item.link) {
        window.open(this.item.link)
        return
      }

      this.$emit('onClick', this.item.id)
      if(!this.item.link) {
        this.$nuxt.$emit('showNotiModal', this.item)
      } else {
        location.href = this.item.link
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$screen-xs: 480px;
$line-height: 20px;
.duration {
  white-space: nowrap;
  line-height: $line-height;
}
.noti-item-01 {
  min-height: 109px;
  border-bottom: 1px solid #cecece;
  width: 100%;
  color: #9d9d9d !important;
  font-size: 13px;
  line-height: 21px;
  border-left: 4px solid transparent;
  position: relative;
  text-decoration: none !important;
  background: #fff;
  padding: 10px 17px 10px 25px;
  &.has-user {
    padding: 10px 15px 8px 74px;
    @media screen and (min-width: $screen-xs) {
      padding: 10px 15px 8px 84px;
    }
  }
  &:hover {
    background: #f9fbee !important;
  }
  .user-icon-ctn {
    height: 44px;
    width: 44px;
    border-radius: 30px;
    border: 1px solid #fff;
    position: absolute;
    left: 15px;
    top: 15px;
    overflow: hidden;
    img {
      height: 100%;
      width: 100%;
      object-fit: unset;
    }
    @media screen and (min-width: $screen-xs) {
      transform: translateX(10px);
    }
  }
  .content-tt {
    width: calc(100% - 65px);
    font-size: 13px;
    line-height: $line-height;
    color: #7d7d7d;
    .subject {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      word-break: break-all;
      max-height: $line-height*3;
      overflow: hidden;
    }
    .content {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: break-all;
      max-height: $line-height*2;
      overflow: hidden;
    }
  }
  &.is-not-review {
    border-left-color: #f77904;
  }
  &.is-not-read {
    background: #e5e5e5;
  }
}
/deep/ .keyword-match {
  color: #39b6c4;
}
</style>
