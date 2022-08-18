<template>
  <ResetComp />
</template>

<script>
import ResetComp from '@@/../components/auth/ResetComp.vue'
import i18n from '@@/lang/desktop/reset.json'
import title from '@@/../common/pages'

export default Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {ResetComp},
    data() {
      return {
        linkMeta: [
          {
            rel: 'canonical',
            href: 'https://www.gogojungle.co.jp/th/password/reset',
          },
          {
            rel: 'alternate',
            hreflang: 'ja',
            href: `https://www.gogojungle.co.jp/password/reset`,
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `https://www.gogojungle.co.jp/en/password/reset`,
          },
          {
            rel: 'alternate',
            hreflang: 'th',
            href: `https://www.gogojungle.co.jp/th/password/reset`,
          },
          {
            rel: 'alternate',
            hreflang: 'vi',
            href: `https://www.gogojungle.co.jp/vi/password/reset`,
          },
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: `https://www.gogojungle.co.jp/password/reset`,
          }
        ],
      }
    },
    async asyncData({ store, app, redirect }) {
      if (store.state.user.id) {
        return redirect('/mypage')
      }
      let locale = app.i18n.locale,
        titleChunk = i18n[locale][1]

      store.commit('pushBC', {
        name: 'Top',
        path: '/en',
      })
      store.commit('pushBC', {
        name: titleChunk,
        path: '/en/password/reset',
      })
      return {
        titleChunk
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('19')
      },
    },
  },
  title
)
</script>

<style lang="scss" scoped>
$color53: #666;
$color64: #f5f5f5;
$color2: #b4b5b6;
.reset-pw {
  margin: 100px auto;
  padding: 80px 60px;
}
.p-lr-80 {
  padding-left: 80px;
  padding-right: 80px;
}
.p-tb-60 {
  padding-top: 60px;
  padding-bottom: 60px;
}
.h-50 {
  height: 50px;
}
.w-75p {
  width: 75%;
}
.w-25p {
  width: 25%;
}
.h-100 {
  height: 100px;
}
.p-t-40 {
  padding-top: 40px;
}
input {
  border-radius: 0;
  padding-left: 5px;
}
.co-53 {
  color: $color53;
}
.bg-co-64 {
  background: $color64;
}
.btn-black {
  background: black;
  color: white;
  border-radius: 0;
  width: 210px;
  align-self: center;
  border: none;
  white-space: nowrap;
}
.co-red {
  color: red;
}
.self-align {
  align-self: center;
}
.h-35 {
  height: 35px;
}
.border-bottom {
  border-bottom: 1px #b4b5b6 solid;
}
.w-200 {
  width: 200px;
}
.bg-white {
  background: white;
}
.border-radius-10 {
  border-radius: 10px;
}
.border-dashed-2 {
  border: 2px $color2 dashed;
}
.loading {
  pointer-events: none;
  opacity: 0.5;
}
input[name='email'] {
  border: none;
}
</style>
