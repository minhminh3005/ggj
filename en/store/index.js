import { getCookie } from '@/utils/client/common'

export const state = () => ({
  user: {},
  cartCnt: null,
  banners: {},
  advertisements: {},
  bcRoutes: [],
})

export const mutations = {
  setUser: function(state, user) {
    state.user = user
  },
  setCartCount: function(state, count) {
    state.cartCnt = count
  },
  setBanners: function(state, banners) {
    state.advertisements.banners = banners
  },
  setAdvertisements: function(state, advertisements) {
    state.advertisements = advertisements
  },
  setBC: function(state, bcRoutes) {
    state.bcRoutes = bcRoutes
  },
  pushBC: function(state, bcRoute) {
    state.bcRoutes.push(bcRoute)
  },
}

export const getters = {
  getBanners: () => {
    return []
    // return (state.advertisements || {}).banners || []
  },
  getAdvertisements: state => {
    return state.advertisements || {}
  },
  getTopSliders: state => {
    return (state.advertisements || {}).topSliders || []
  },
}

async function getAdvertisements(route, app, params, commit) {
  return new Promise(resolve => {
    if (!route.matched.length) {
      return resolve()
    }
    let path = getServicePath(app, route, params)
    app.GoGoHTTP.post('/api/v3/surface/advertisement', {
      service_path: path,
    }).then(data => {
      commit('setAdvertisements', data)
      resolve()
    })
  })
}

async function processCookie(req, commit) {
  return new Promise(resolve => {
    let stringCookie = req.headers['cookie'],
      uid = getCookie('uid', stringCookie),
      uname = getCookie('uname', stringCookie),
      isBuyuser = getCookie('isBuyuser', stringCookie),
      llt = parseInt(getCookie('llt', stringCookie)),
      isaff = parseInt(getCookie('isaff', stringCookie))

    commit('setUser', {
      id: uid,
      name: uname,
      isBuyuser: parseInt(isBuyuser),
      llt,
      isaff,
    })
    resolve()
  })
}

function getServicePath(app, route, params) {
  let matched = route.matched[route.matched.length - 1],
    path,
    metaNewPath = matched.meta.originalPath
  if (metaNewPath || (!metaNewPath && metaNewPath === '')) {
    path = matched.parent
      ? [matched.parent.path, metaNewPath].join('/')
      : metaNewPath
  } else {
    path = matched.path
  }
  let pathRoute = app.router.resolve(path),
    routeParams = pathRoute.route.params
  path = pathRoute.route.path
  for (let r in routeParams) {
    path = path.replace(routeParams[r], params[r])
  }
  return path
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  async nuxtServerInit({ commit }, { req, app, route, params }) {
    try {
      await Promise.all([
        getAdvertisements(route, app, params, commit),
        processCookie(req, commit),
      ])
    } catch (e) {
      console.error(e)
    }
  },
}
