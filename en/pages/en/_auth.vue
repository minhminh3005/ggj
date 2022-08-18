<template>
  <AuthComp />
</template>

<script>
import AuthComp from '@@/../components/auth/AuthComp.vue'
import i18n from '@@/lang/desktop/login.json'
import title from '@@/../common/pages'
import logoutFn from '@@/../common/js/logout'
export default Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    components: {
      AuthComp,
    },
    validate({ params }) {
      return ~['login', 'logout'].indexOf(params.auth)
    },
    data() {
      return {
        titleChunk: this.auth == 'logout' ? this.$t('20') : this.$t('1')
      }
    },
    async asyncData({ store, redirect, route, params, app, res, req }) {
      let { auth } = params,
        locale = app.i18n.locale,
        titleChunk = (auth == 'login') ? i18n[locale][1] : i18n[locale][20]
      if (store.state.user.id && auth != 'logout' && !route.query.is_buyuser) {
        if (!route.query.u) {
          return redirect('/')
        } else {
          return redirect(route.query.u)
        }
      }
      await logoutFn(app, auth, req, res)
      store.commit('pushBC', {
        name: 'Top',
        path: '/en',
      })
      store.commit('pushBC', {
        name: titleChunk,
        path: `/en/${auth}`,
      })
      let alternateList = []
      if(auth == 'login') {
        alternateList = [
          {
            rel: 'alternate',
            hreflang: 'ja',
            href: `https://www.gogojungle.co.jp/login`,
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `https://www.gogojungle.co.jp/en/login`,
          },
          {
            rel: 'alternate',
            hreflang: 'th',
            href: `https://www.gogojungle.co.jp/th/login`,
          },
          {
            rel: 'alternate',
            hreflang: 'vi',
            href: `https://www.gogojungle.co.jp/vi/login`,
          },
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: `https://www.gogojungle.co.jp/login`,
          }
        ]
      }
      return {
        auth,
        titleChunk,
        linkMeta: [
          { rel: 'canonical', href: `https://www.gogojungle.co.jp/en/${auth}` }
        ].concat(alternateList),
      }
    },
    methods: {
      descriptionTemplate() {
        return this.$t(`${this.auth}Des`)
      },
    }
  },
  title
)
</script>
