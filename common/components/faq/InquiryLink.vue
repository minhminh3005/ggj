<template>
  <div class="inqui-container">
    <div class="title">{{ $t(10) }}</div>
    <div class="flex center">
      <a href="/inquiry" class="btn-link">{{ $t(11) }}</a>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/faq.json'

export default {
    i18n: {
      messages: i18n,
    },
  }
</script>

<style lang="scss" scoped>
@import '@@/../common/assets/variables.scss';
@import '@@/../common/assets/faq/faq.scss';
.inqui-container {
  @media only screen and (max-width: $screen-sm) {
    margin-bottom: 40px;
  }
}
.title {
  font-size: 25px;
  font-weight: bold;
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid $grey1;
  margin-bottom: 33px;
  margin-top: 120px;
  @media only screen and (max-width: $screen-sm) {
    font-size: 20px;
    padding-bottom: 17px;
    margin-bottom: 22px;
    margin-top: 60px;
  }
}
.btn-link {
  cursor: pointer;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  background: $faq-q;
  border-radius: 5px;
  padding: 9px 21px;
  color: $white;
  border: 1px solid $faq-q;
  text-decoration: none;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: $faq-q;
      background: $white;
      text-decoration: none !important;
    }
  }
}
</style>
