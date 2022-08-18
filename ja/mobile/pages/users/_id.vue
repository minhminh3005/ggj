<template>
  <div class="wrapper bg-gray">
    <header class="flex layout-col bg-white">
      <div class="user-role wrap-text" v-if="profile">
        <a class="col-white" :href="`/users/${profile.id}`">
          <User />
          <span class="ml-5">{{ profile.nickName }}{{ $t('54') }}</span>
        </a>
        <!-- <a class="col-white" v-if="!userId" :href="`/login?u=${$route.fullPath}`">
          <Key />
          <span class="ml-5">{{ profile.nickName }}{{ $t('54') }}</span>
        </a>
        <a class="col-white" :href="`/users/${ userId }`" v-else>
          <User />
          <span class="ml-5">{{ user.nickName || $t('31') }}</span>   
        </a> -->
      </div>
      <div class="header-img" :class="{'top-img': profile.hasBanner}" :style="backgroundStyle"
           v-if="profile.hasBanner"
      ></div>
    </header>
    <nuxt-child />
  </div>
</template>

<script>
import Key from '@@/../components/icons/Key.vue'
import User from '@@/../components/icons/User2.vue'
import LazyComp01 from '@@/../components/LazyComp01.vue'
import i18n from '@@/lang/mobile/users-id.json'
import { filterInt } from '@/utils/client/common'
import title from '@@/../common/pages'
import '@/assets/mobile.css'

const SUBTITLE = {
  '': 36,
  products: 20,
  blog: 21,
  review: 22,
  follows: 1,
  followers: 2,
  realtrade: 53
}

export default Object.assign({
  i18n: {
    messages: i18n,
  },
  validate({ params }) {
    return !isNaN(filterInt(params.id))
  },
  components: {
    Key,
    LazyComp01,
    User
  },
  mounted() {
    this.GoGoHTTP.get('/api/v3/surface/cart/count').then(data => {
      this.$store.commit('setCartCount', data.count || 0)
    })
  },
  data() {
    let topImgUrl = `/img/users/${this.$route.params.id}/banners?ingoreOnErr=1`
    return {
      topImgUrl,
    }
  },
  methods: {
    descriptionTemplate() {
        return (this.profile.introduction || '').replace(/<(.|\n)*?>/g, '')
      },
  },
  async asyncData({ app, req, params, error,store }) {
    let { id } = params,
      userId = store.state.user.id,
      [profile, user] = await Promise.all([
        app.GoGoHTTP.get(`/api/v3/surface/profile/${id}`), 
        userId ? app.GoGoHTTP.get(`/api/v3/surface/profile/${userId}`) : Promise.resolve()
      ]),
      locale = app.i18n.locale,
      cI18n = i18n[locale],
      type = req._parsedOriginalUrl.pathname.split('/')[3] || ''
    
    if (!Object.keys(profile).length) {
      return error({ statusCode: 404 })
    }
    return {
      id,
      user,
      userId,
      profile,
      titleChunk: `${profile.nickName || cI18n[35]}${cI18n[37]}${cI18n[SUBTITLE[type]]} - ID : ${id}`,
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/users/${id}${
            type ? `/${type}` : ''
          }`,
        },
      ],
    }
  },
  computed:{
    backgroundStyle() {
      return `background: url(${this.topImgUrl}) center / contain no-repeat;background-size: cover;`
    },
  }
},
  title
)
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  margin: 0;
  padding: 0;
}
header {
  width: 100%;
  .div-height {
    .menu {
      font-size: 12px;
      width: 15%;
    }
    .logo {
      width: 50%;
      .logo-top {
        display: block;
        width: 60%;
        max-width: 250px;
        .logo-cls {
          width: 100%;
        }
      }
    }
    div:last-child {
      a {
        margin-right: 10px;
        color: black;
      }
    }
  }
}
.user-role {
  background-color: rgb(45, 45, 45);
  color: white;
  padding: 2vw 3vw;
  margin-top: -10px;
  i {
    color: white;
    width: 17px;
    height: 13px;
  }
}
.menu-cls {
  border-top: solid 1px #a1a1a1;
  border-bottom: solid 1px #a1a1a1;
  transition: all 1s;
  a {
    text-decoration: none;
    &:not(:last-child) {
      border-right: solid 1px #a1a1a1;
    }
  }
  span {
    color: #000031;
    transition: all 0.2s;
    &.org-number {
      font-size: 11px;
      background: #ff6a02;
      border-radius: 5px;
      color: white;
      padding: 0 4px 0;
      top: 10px;
    }
  }
}
.col-white {
  color: white;
}
.noti {
  color: #000031;
  transition: all 0.2s;
  &.org-number {
    right: 2px;
    position: absolute;
    font-size: 11px;
    background: #ff6a02;
    border-radius: 5px;
    color: white;
    padding: 0 4px 0;
    top: 10px;
  }
}
.top-img {
  height: 100%;
  min-height: 150px;
  width: 100%;
}
</style>
