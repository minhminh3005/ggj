<template>
  <div class="wrapper-icon">
    <a class="icon-line" target="_blank" title="Line" id="line-icon" @click="shareLine"><LineIcon /></a>
    <a class="icon-tw" target="_blank" title="Twitter" @click="shareTwitter"><Twitter /></a>
    <a class="icon-fb" target="_blank" title="Facebook" @click="shareFB"><Facebook /></a>
  </div>
</template>
<script>
import Twitter from '@@/../components/icons/Twitter.vue'
import Facebook from '@@/../components/icons/Facebook.vue'
import LineIcon from '@@/../components/icons/Line.vue'
export default {
  name: "SocialIcons",
  components: {
    Facebook,
    Twitter,
    LineIcon,
  },
  methods: {
    shareLine() {
      window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}`)
    },
    shareTwitter() {
      const twitterUrl = "https://twitter.com/intent/tweet"
      window.open(
        `${twitterUrl}?hashtags=GogoJungle&original_referer=${window.location.origin}&ref_src=twsrc%5Etfw&text=${window.document.title}&tw_p=tweetbutton&url=${window.location.href}`,
        "_blank"
      )
    },
    shareFB() {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')
    },
  }
}
</script>
<style lang='scss' scoped>
.wrapper-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  a:not(:last-child) {
    margin-right: 20px;
  }
  a {
    cursor: pointer;
  }
  .icon-fb,.icon-tw {
    .icon-cls {
      width: 26px;
      height: 26px;
      background: #333;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #eee;
    }
  }
  .icon-line {
    transform: translateY(2px);
    height: 38px;
    color: #333;
  }
  .icon-tw {
    margin-right: 4px;
    .icon-cls /deep/ {
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
  .icon-fb {
    .icon-cls /deep/ {
      align-items: flex-end;
      svg {
        width: 22px;
        height: 22px;
      }
    }
  }
  #line-icon {
    margin-right: 17px;
    .icon-cls /deep/ {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      svg {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
