<template>
  <div class="footer2">
    <div class="ft-layout-1">
      <div class="ft-ele-child">
        <div class="sns-part flex layout-col-mid icon">
          <a class="icon-tw" target="_blank" title="Twitter" href="https://twitter.com/GogoJungle_fxon"><Twitter /></a>
          <a class="icon-fb" target="_blank" title="Facebook" href="https://www.facebook.com/gogojungle"><Facebook /></a>
          <a class="icon-line" target="_blank" title="Line" id="line-icon" href="https://lin.ee/3ZhkodU34"><LineIcon /></a>
          <a class="icon-yt" target="_blank" title="Youtube" id="youtube-icon" href="https://www.youtube.com/GogoJungleTV"><YoutubeIcon color-polygon="transparent" /></a>
          <a class="icon-in" target="_blank" title="Instagram" href="https://www.instagram.com/gogojungleinc/"><Instagram /></a>
        </div>
        <div class="show-mobile">
          <ChangeLang />
        </div>
      </div>
      <div class="ft-ele-child-2">
        <ul class="mb-20 p-0 help">
          <li>
            <div>
              <label class="ft-title text-center">
                {{ $t('1') }}
              </label>
              <p class="ft-text">
                <a :href="$t('faqUrl')">{{ $t('94') }}</a><br />
                <a href="https://www.gogojungle.co.jp/faq">{{ $t('95') }}</a><br />
                <a :href="$t('payMethodUrl')" v-if="!supportLocale">{{ $t('96') }}</a>
              </p>
            </div>
          </li>
          <li>
            <div>
              <label class="text-center ft-title">
                {{ $t('3') }}
              </label>
              <p class="ft-text">
                <a :href="$t('aboutUrl')">{{ $t('97') }}</a><br />
                <a :href="$t('termUrl')">{{ $t('98') }}</a><br />
                <a href="https://www.gogojungle.co.jp/post/1/18246" v-if="!supportLocale">{{ $t('99') }}</a><br />
                <a :href="$t('185Url')">{{ $t('185') }}</a><br />
                <a :href="$t('186Url')">{{ $t('186') }}</a>
              </p>
            </div>
          </li>
          <li>
            <div>
              <label class="ft-title text-center">
                {{ $t('184') }}
              </label>
              <p class="ft-text">
                <a :href="$t('lawUrl')">{{ $t('100') }}</a><br />
                <a href="https://corp.gogojungle.co.jp/recruit_details/" v-if="!supportLocale">{{ $t('101') }}</a>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="ft-layout-2">
      <span class="text-history wrap-desktop" v-html="$t('104')"></span>
      <span class="text-history wrap-mobile" v-html="$t('104mobile')"></span>
      <div class="sns-part flex layout-col-mid lzimg">
        <a class="lzimg-1" href="http://www.fsa.go.jp/" target="_blank">
          <Lzimg style="width: 100px;" :data-src="'/img/assets/pc/common/footer/img01.jpg'" :alt="$t('107')" />
        </a>
        <a class="lzimg-2" href="http://www.jiaa.or.jp/" target="_blank">
          <Lzimg style="width: 100px;" :data-src="'/img/assets/pc/common/footer/img02.jpg'" :alt="$t('108')" />
        </a>
        <a class="lzimg-3" href="https://www.finmac.or.jp/" target="_blank">
          <Lzimg style="width: 76px;" :data-src="'/img/assets/pc/common/footer/img03.jpg'" :alt="$t('109')" />
        </a>
        <a class="lzimg-4" href="http://www.fsa.go.jp/sesc/" target="_blank">
          <Lzimg style="width: 58px;" :data-src="'/img/assets/pc/common/footer/img04.jpg'" :alt="$t('110')" />
        </a>
      </div>
    </div>
    <p class="source text-center fs-12">
      {{ $t('102', {year: (new Date).getFullYear()}) }}
    </p>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/footer.json'
import ChangeLang from "./ChangeLang.vue"
import Lzimg from '@@/../components/Lzimg.vue'
import Twitter from '@@/../components/icons/Twitter.vue'
import Facebook from '@@/../components/icons/Facebook.vue'
import LineIcon from '@@/../components/icons/Line.vue'
import YoutubeIcon from '@@/../components/icons/YoutubeIcon.vue'
import Instagram from '@@/../components/icons/Instagram.vue'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Lzimg,
    Facebook,
    ChangeLang,
    Twitter,
    LineIcon,
    Instagram,
    YoutubeIcon,
  },
  computed: {
    supportLocale() {
      return this.langSupported().includes(this.$i18n.locale)
    }
  }
}
</script>

<style lang="scss" scoped>
$surface-main-width: 1000px;
@import "@@/../common/assets/variables.scss";
.footer2 {
  padding: 72px 20px 57px 20px;
  margin-top: 20px;
  @media only screen and (max-device-width: 1024px) {
    width: 1025px !important;
  }
  .ft-text {
    color: #333;
    a {
      color: #515151;
      line-height: 25px;
    }
  }
  .ft-layout-1 {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .ft-ele-child {
      flex: 1;
    }
    .ft-ele-child-2 {
      flex: 2;
    }
  }
  .ft-layout-2 {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  background: #eee;
  min-width: $surface-main-width;
  .help {
    list-style: none;
    display: inline-flex;
    width: 100%;
    li {
      display: flex;
      justify-content: flex-end;
      flex: 1 0 auto;
      .ft-title {
        margin-bottom: 18px;
      }
      .first-help {
        border-right: 1px solid;
      }
    }
  }
}
.sns-part {
  margin-bottom: 25px;
  a {
    .icon-cls {
      border-radius: 50%;
    }
    // &:hover {
    //   color: unset;
    // }
  }
  .icon-line {
    transform: translateY(2px);
    height: 38px;
  }
  .icon-tw {
    .icon-cls /deep/ {
      width: 26px;
      height: 26px;
      background: #000;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #eee;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
  .icon-fb {
    .icon-cls /deep/ {
      width: 26px;
      height: 26px;
      background: #000;
      border-radius: 2px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      color: #eee;
      svg {
        width: 22px;
        height: 22px;
      }
    }
  }
  .icon-yt {
    height: 27px;
    .icon-cls /deep/ {
      width: 30px;
      height: 30px;
      cursor: pointer;
      color: black;
      svg {
        width: 30px;
        height: 30px;
      }
    }
  }
  .icon-in {
    height: 27px;
    .icon-cls /deep/ {
      width: 27px;
      height: 27px;
      cursor: pointer;
      color: black;
      svg {
        width: 27px;
        height: 27px;
      }
    }
  }
}
#line-icon {
  .icon-cls /deep/ {
    width: 35px;
    height: 35px;
    color: black;
    svg {
      width: 100%;
      height: 100%;
    }
  }
}
.wrap-mobile {
  display: none;
}
.text-history {
  line-height: 18px;
}
.source {
  margin-top: 40px;
}
.icon {
  height: 27px;
  align-items: center;
  justify-content: flex-start;
  a {
    margin-right: 25px;
  }
}
.lzimg {
  a {
    margin-left: 20px;
  }
}
</style>
