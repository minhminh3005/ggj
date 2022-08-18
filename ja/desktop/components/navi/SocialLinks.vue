<template>
  <div class="mt-30">
    <a class="btn-social btn-twitter w-full flex layout-col-mid mt-10" href="https://twitter.com/GogoJungle_fxon" target="_blank">
      <twitter class="i-twitter mr-20" />
      <p class="fs-20" v-html="$t(1)"></p>
    </a>
    <a class="btn-social btn-fb w-full flex layout-col-mid mt-10" href="https://www.facebook.com/gogojungle" target="_blank">
      <facebook class="i-fb mr-20" />
      <p class="fs-20" v-html="$t(2)"></p>
    </a>
  </div>
</template>

<script>
// TODO: i18n
import Twitter from '@@/../components/icons/Twitter.vue'
import Facebook from '@@/../components/icons/Facebook.vue'
import i18n from '@@/lang/components-desktop/navi-social-links.json'

/**
 * The social network links.
 */
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Twitter,
    Facebook,
  },
}
</script>

<style lang="scss" scoped>
.fs-20 {
  font-size: 20px;
}
/deep/ .icon-cls {
  height: auto;
}
.i-twitter {
  width: 32px;
}
.i-fb {
  width: 16px;
}
.btn-twitter {
  background: #21a5e1;
}
.btn-fb {
  background: #3c5a99;
}
.btn-social {
  color: #fff;
  text-decoration: none;
  height: 80px;
  font-weight: bold;
  &:hover {
    opacity: 0.8;
  }
}
</style>
