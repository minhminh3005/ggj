<template>
  <Inquiry />
</template>

<script>
  import i18n from '@@/lang/desktop/inquiry.json'
  import Inquiry from '@@/../components/inquiry/inquiry.vue'
  import title from '@@/../common/pages'
  const obj = Object.assign({
    components: {
      Inquiry,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: this.$t('1'),
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/vi/inquiry`,
          },
          {
            rel: 'alternate',
            hreflang: 'ja',
            href: `https://www.gogojungle.co.jp/inquiry`,
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `https://www.gogojungle.co.jp/en/inquiry`,
          },
          {
            rel: 'alternate',
            hreflang: 'th',
            href: `https://www.gogojungle.co.jp/th/inquiry`,
          },
          {
            rel: 'alternate',
            hreflang: 'vi',
            href: `https://www.gogojungle.co.jp/vi/inquiry`,
          },
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: `https://www.gogojungle.co.jp/inquiry`,
          }
        ]
      }
    },
    async asyncData({ store, app}) {
      store.commit('pushBC', {
        name: 'Top',
        path: '/vi',
      })
      store.commit('pushBC', {
        name: i18n[app.i18n.locale][1],
        target: { path: '/vi/inquiry' },
      })
    }
  },title)
  export default obj
</script>

