<template>
  <div class="mobile-register-completed">
    <div class="text-center title">
      <h3 class="i-title"><b>{{ $t('28') }}</b></h3>
    </div>
    <div class="d-flex justify-content-center">
      <div class="btn-middle">
        <Button01 :background="'#185ADB'" class="btnMobile mt-10 mb-10 h-40" :text="$t('22')" @click="gotoPage('/')" />
        <Button01 :background="'#185ADB'" class="btnMobile mt-10 mb-10 h-40" :text="$t('21')" @click="gotoPage('/mypage')" />
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/register.json'
import Button01 from '@/components/common/Button01'
export default {
  i18n: {
    messages: i18n,
  },
  components: {
    Button01,
  },
  async asyncData({ redirect, req }) {
    let referer = req.headers.referer || ''
    if (!referer.includes('/register')) {
      return redirect('/')
    }
    return {}
  },
  methods: {
    gotoPage(page) {
      location.href = page
    },
  },
}
</script>


<style lang="scss" scoped>
.mobile-register-completed {
  padding: 0;
  padding-bottom: 10px;
  background: #f5f5f5;
  .title {
    .i-title {
      margin: 0;
      padding-top: 20px;
      padding-bottom: 20px;
      b {
        color: #666;
        font-size: 24px;
      }
    }
  }
}
.h-40 {
  height: 40px;
}
.btnMobile {
  border-radius: 1px;
  display: block;
  width: 100%;
  box-shadow: 2px 9px 5px -6px grey;
}
.btn-middle {
  width: 85%;
  margin: auto;
  margin-bottom: 20px;
  .btnMobile:first-child {
    margin-top: 0;
    margin-bottom: 20px;
  }
}
</style>
<style lang="scss">
/* stylelint-disable */
.scroll-btn {
  display: none !important;
}
/* stylelint-enable */
</style>
