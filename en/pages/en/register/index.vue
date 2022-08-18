<template>
  <RegisterComp :term="term" />
</template>

<script>
import RegisterComp from '@@/../components/auth/RegisterComp.vue'
import i18n from '@@/lang/desktop/register.json'
import title from '@@/../common/pages'

export default Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {
      RegisterComp,
    },
    data() {
      return {
        linkMeta: [
          { rel: 'canonical', href: 'https://www.gogojungle.co.jp/en/register' },
          {
            rel: 'alternate',
            hreflang: 'ja',
            href: `https://www.gogojungle.co.jp/register`,
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `https://www.gogojungle.co.jp/en/register`,
          },
          {
            rel: 'alternate',
            hreflang: 'th',
            href: `https://www.gogojungle.co.jp/th/register`,
          },
          {
            rel: 'alternate',
            hreflang: 'vi',
            href: `https://www.gogojungle.co.jp/vi/register`,
          },
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: `https://www.gogojungle.co.jp/register`,
          }
        ],
      }
    },
    async asyncData({ app, redirect, store }) {
      if (store.state.user.id) {
        return redirect('/mypage')
      }
      let term = await app.GoGoHTTP.get('/api/v3/terms/user'),
        locale = app.i18n.locale,
        titleChunk = i18n[locale][1]
      store.commit('pushBC', {
        name: 'Top',
        path: '/en',
      })
      store.commit('pushBC', {
        name: titleChunk,
        path: '/en/register',
      })
      return {
        term,
        titleChunk,
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t('25')
      },
    },
  },
  title
)
</script>
