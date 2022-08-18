'use strict'

import { gotoLogin } from '@/utils/client/common'

export function onNaviFollow() {
  if (this.loadingFollow) return
  if (!this.$store.state.user.id) {
    gotoLogin(`u=${location.pathname}`)
    return
  }

  this.loadingFollow = true
  if (this.followFn) {
    this.followFn(this.item).finally(() => {
      this.loadingFollow = false
    })
  } else {
    this.GoGoHTTP.post('/api/v3/surface/navi/readlater/article', {
      articleId: this.item.id,
    }).finally(() => {
      this.loadingFollow = false
    })
  }
}

export async function onNaviFollowItem(item) {
  let res = {}
  if (this.loadingFollow) return Promise.resolve()
  if (!this.$store.state.user.id) {
    gotoLogin(`u=${location.pathname}`)
    return Promise.resolve()
  }

  this.loadingFollow = true
  res = await this.GoGoHTTP.post('/api/v3/surface/navi/readlater/article', {
    articleId: item.id,
  }).finally(() => {
    this.loadingFollow = false
  })
  item.isReadLater = res.status
  Promise.resolve(res.status)
}

export function onNaviFavorite() {
  let isSeries = this.item.isReadLater === undefined
  if (this.loadingFavorite) return
  if (!this.$store.state.user.id) {
    gotoLogin(`u=${location.pathname}`)
    return
  }

  this.loadingFavorite = true
  if (this.favoriteFn) {
    this.favoriteFn(this.item).finally(() => {
      this.loadingFavorite = false
    })
  } else {
    this.GoGoHTTP.post(
      isSeries
        ? '/api/v3/surface/navi/favorite/series'
        : '/api/v3/surface/navi/favorite/article',
      isSeries ? { seriesId: this.item.sId } : { articleId: this.item.id }
    ).finally(() => {
      this.loadingFavorite = false
    })
  }
}

export async function onNaviFavoriteItem(item) {
  let res = {},
    isSeries = item.isReadLater === undefined,
    apiUrl = isSeries
      ? '/api/v3/surface/navi/favorite/series'
      : '/api/v3/surface/navi/favorite/article'
  if (this.loadingFavorite) return Promise.resolve()
  if (!this.$store.state.user.id) {
    gotoLogin(`u=${location.pathname}`)
    return Promise.resolve()
  }

  this.loadingFavorite = true
  res = await this.GoGoHTTP.post(
    apiUrl,
    isSeries ? { seriesId: item.sId } : { articleId: item.id }
  ).finally(() => {
    this.loadingFavorite = false
  })
  item.isFavorite = res.status
  Promise.resolve(res.status)
}

export function getNaviImg(data, url) {
  if (data.image) {
    return data.image
  }
  return url + data.id + '/small'
}

export function isHTML(stringHTML){
  return /<([^\s>]+)\s?[^>]*>(.*)(?:<\/\1)>/.test(stringHTML)
}

export function setStoreData(data) {
  let storeData = this.$store.getters['finance/getFavData']
  let favData = {
      favorite: storeData.favorite.slice(0),
      follow: storeData.follow.slice(0),
      purchase: storeData.purchased.slice(0)
    }

  data.map(article => {
    let obj = {
      id: article.id,
      seriesId: article.seriesId,
      title: article.title
    }
    if (article.isFavorite) {
      favData.favorite.push(obj)
    }
    if (article.isReadLater) {
      favData.follow.push(obj)
    }
    if (article.isPurchased) {
      favData.purchase.push(obj)
    }
  })
  this.$store.commit('finance/setFavData', favData)
}

export function scrollDirection() {
  // detect scroll direction
  let st = window.pageYOffset || document.documentElement.scrollTop
  // value can be true downscroll | false upscroll
  window.ggjScrollDirection = st > window.ggjLastScrollY ? 'down' : 'up'
  // For Mobile or negative scrolling
  window.ggjLastScrollY = st <= 0 ? 0 : st
}

function _trackViewedItem(item) {
  window.ggjLastNaviItem = {id: item.id, page: item.page}
  let sp = new URLSearchParams(location.search)
  sp.set('tr', `${item.id}_${item.page}`)
  history.replaceState(
    {},
    '',
    location.pathname + '?' + sp.toString())
}

export function ioNaviItem(itemCls, itemImgCls, matchPoint = .5, threshold = [.5, .75, 1.0]) {
  this.$nextTick(() => {
    let io = new IntersectionObserver(entries => {
      if (window.ggjPreventScrollEvent) return
      // If intersectionRatio is 0, the target is out of view
      // and we do not need to do anything.
      let ir = entries[0].intersectionRatio,
        direction = this.lastIntersectionRatio < ir
      // set from common/containers/navi/top/navi-top.vue @handleLazyLoad
      if (ir >= matchPoint && ((window.ggjScrollDirection == 'down' && direction) ||
        (window.ggjScrollDirection == 'up' && !direction))) {
        _trackViewedItem(this.item)
      }
      this.lastIntersectionRatio = ir
    }, {threshold})
    // start observing
    io.observe(this.$el)

    function scrollToEl() {
      let tr = new URLSearchParams(location.search).get('tr')
      if (!window.ggjPreventScrollEvent && tr && /^\d+_\d+$/.test(tr) && tr.split('_')[0] == this.item.id) {
        window.ggjPreventScrollEvent = true
        let el = $(this.$el)
        window.scrollTo(0, el.find(itemCls).offset().top - el.find(itemImgCls).height())
        this.$el.scrollIntoView()
        setTimeout(() => {
          window.ggjPreventScrollEvent = false
        })
      }
    }

    scrollToEl.call(this)

    // special treatment for safari on mac
    // safari does not reload page when using back button
    // need to scroll to el manually
    if (/mac/i.test(navigator.userAgent) && /safari/i.test(navigator.userAgent)) {
      window.addEventListener('pageshow', event  => {
        if (event.persisted) {
          scrollToEl.call(this)
        }
      })
    }
  })
}