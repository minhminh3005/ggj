<template>
  <LazyComp01 class="flex mb-20 border-bottom pb-10" min-height="90px">
    <div class="img-container flex center">
      <Lzimg class="h-full w-full" :data-src="`/img/users/${ user.id }/small`" alt="" />
    </div>
    <div class="ml-10">
      <a :href="'/users/' + user.id">
        {{ user.nickName || $t('1') }}
      </a>
      <div class="mb-0" v-wrap-lines="3" v-html="user.introduction"></div>
    </div>
  </LazyComp01>
</template>

<script>
import Lzimg from '@@/../components/Lzimg.vue'
import i18n from '@@/lang/components-desktop/user-info.json'
import LazyComp01 from '@@/../components/LazyComp01.vue'

export default {
  i18n: {messages: i18n},
  components: {
    Lzimg,
    LazyComp01,
  },
  props: {
    user: {
      type: [Object, Array],
      default() {
        return {}
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.img-container {
  flex: 0 0 50px;
  height: 50px;
  width: 50px;
}
.border-bottom {
  border-bottom: 1px #b4b5b6 solid;
}
</style>
