// OAM-17509
import wrapper from './wrapper'
import { criteoFilter } from './helper'
import { isAgentMobile } from '@/utils/client/common'

const REGEX = /.+\/(\d+)(\?.+)?$/i
const REGEX_2ID = /.+\/(\d+)\/(\d+)(\?.+)?$/i
const REGEX_NAVI_SERIES = /.+series\/(\d+)(\?.+)?$/i
const REGEX_NAVI_ARTICLE = /.+articles\/(\d+)(\?.+)?$/i

const takenArea = {
  mobile: {
    '/systemtrade': 'main a[href*=\\/{href}\\/]',
    '/tools': 'main .tools-index a[href*=\\/{href}\\/]',
    '/finance': 'main .finance-index a[href*=\\/{href}\\/]',
    '/finance/navi': '.body .navi-list a[href*=\\/{href}\\/]',
    '/finance/navi/articles': '.body .series-list-content a[href*=\\/{href}\\/]',
    '/finance/navi/series': '.body .series-list-content a[href*=\\/{href}\\/]',
    '/finance/mailmagazine': 'main .mailmagazine-list a[href*={href}]',
    '/products': 'main .product-list a[href*=systemtrade]:lt(5), main a[href*=tools]:lt(5)'
  },
  desktop: { 
    '/systemtrade': 'main .right-content a[href*=\\/{href}\\/]',
    '/tools': 'main .right-block a[href*=\\/{href}\\/]',
    '/finance': 'main .sal-h01__l--fi a[href*=\\/{href}\\/]',
    '/finance/navi': '.body.mw-body .top-right-content a[href*=\\/{href}\\/]',
    '/finance/navi/articles': '.body.mw-body .series-list-content a[href*=\\/{href}\\/]',
    '/finance/navi/series': '.body.mw-body .series-list-content a[href*=\\/{href}\\/]',
    '/finance/mailmagazine': 'main .salon-item .content a[href*=\\/{href}\\/]:nth-child(1)',
    '/products': 'main a[href*=systemtrade]:lt(5), main a[href*=tools]:lt(5)'
  }
}

const processList = {
  '/finance/navi': financeNavi,
  '/finance/navi/articles': financeNaviArticles,
  '/finance/navi/series': financeNaviSeries,
  '/finance/videos': financeVideos,
  '/finance/mailmagazine': financeMailmagazine,
  '/event': event,
}

const processDetail = ['/finance/navi', '/finance/mailmagazine', '/finance/videos', '/event']

// topTagCriteo, OAM-63409
const topTagCriteo = [
  /^\/$/, // top page
  /^\/(finance\/navi\/authors|finance\/mailmagazine\/\d+\/\d+)$/, // finance group page
  /^\/users/, // users group page
  /^\/review/, // group page review
  /^\/companies$/, // companies group page
  /^\/systemtrade\/converter$/, //systemtrade group page
  /^\/inquiry$/, // inquiry group page
  /^\/markets/, // market group page
  /^\/crowdsourcing/, // crowdsourcing group page
  /^\/terms/, // terms group page
  /^\/post/,
  /^\/info/,
  /^\/login/,
  /^\/portfolio/,
]

async function criteo() {
  if (topTagCriteo.some(regex => regex.test(location.pathname))) {
    // top page
    return { event: 'viewHome' }
  } else {
    // detect whether current URL is list or detail page
    let canon = $('head link[rel=canonical]'),
      href = (canon.get(0) || {}).href || '',
      isDetailUrl = REGEX.exec(href)

    if (isDetailUrl) {
      let pId
      if(processDetail.some(e => href.includes(e))) {
        // window.productId will be set in each page
        // for example: /finance/navi/134/512 ==> ja/desktop/pages/finance/navi/_sid/_id.vue

        // cancel send criteo
        if(window.productId === 0) {
          return { event: 'viewHome' }
        }

        pId = window.productId || null
      }
      pId = pId || isDetailUrl[1]

      // criteoFilter
      return (await criteoFilter.call(this, { ids: [pId] })).length
              ? { event: 'viewItem', item: `P${pId}` }
              : { event: 'viewHome' }
    }
    else {
      let subUrl = href.replace(/(.+:\/\/)?([^\/]+)/, '')
      href = subUrl.split('/')[1]
      let links, ta = takenArea[isAgentMobile(navigator.userAgent) ? 'mobile' : 'desktop'][subUrl], item = []
      if (ta) {
        links = $(ta.replace(/{href}/, href))
      } else {
        links = $(`main a[href*=\\/${href}\\/]`)
      }
      item = await (processList[subUrl] || defaultProcessId).call(this, links)
      return item.length ? { event: 'viewList', item } : null
    }
  }
}

async function financeNavi(links) {
  let arr = [], obj = []
  for (let i in links) {
    if (arr.length == 20) {
      break
    }
    let e = REGEX_NAVI_ARTICLE.exec(links[i].href)
    e && !obj.includes(e[1]) && obj.push(e[1]) && arr.push(e[1])
  }
  // criteoFilter
  arr = (await criteoFilter.call(this, { ids: arr, type: 2 })).splice(0, 3)
  return arr.map(item => `P${item}`)
}

async function financeNaviArticles(links) {
  let arr = [], obj = []
  for (let i in links) {
    let e = REGEX_NAVI_ARTICLE.exec(links[i].href)
    e && !obj.includes(e[1]) && obj.push(e[1]) && arr.push(e[1])
    if (arr.length == 20) {
      break
    }
  }
  // criteoFilter
  arr = (await criteoFilter.call(this, { ids: arr, type: 2 })).splice(0, 3)
  return arr.map(item => `P${item}`)
}

async function financeNaviSeries(links) {
  let arr = [], obj = []
  for (let i in links) {
    let e = REGEX_NAVI_SERIES.exec(links[i].href)
    e && !obj.includes(e[1]) && obj.push(e[1]) && arr.push(e[1])
    if (arr.length == 20) {
      break
    }
  }
  // criteoFilter
  arr = (await criteoFilter.call(this, { ids: arr, type: 3 })).splice(0, 3)
  return arr.map(item => `P${item}`)
}

async function financeVideos(links) {
  let arr = []
  for (let i in links) {
    let e = REGEX.exec(links[i].href)
    e && arr.push(e[1])
    if (arr.length == 20) {
      break
    }
  }
  // criteoFilter
  arr = (await criteoFilter.call(this, { ids: arr, type: 4 })).splice(0, 3)
  return arr.map(item => `P${item}`)
}

async function financeMailmagazine(links) {
  let arr = [], obj = []
  for (let i in links) {
    let e = REGEX_2ID.exec(links[i].href)
    e && !obj.includes(e[1]) && obj.push(e[1]) && arr.push(e[1])
    if (arr.length == 20) {
      break
    }
  }
  // criteoFilter
  arr = (await criteoFilter.call(this, { ids: arr, type: 1 })).splice(0, 3)
  return arr.map(item => `P${item}`)
}

async function event(links) {
  let arr = []
  for (let i in links) {
    let e = REGEX.exec(links[i].href)
    e && arr.push(e[1])
    if (arr.length == 20) {
      break
    }
  }
  // criteoFilter
  arr = (await criteoFilter.call(this, { ids: arr, type: 5 })).splice(0, 3)
  return arr.map(item => `P${item}`)
}

async function defaultProcessId(links) {
  let arr = []
  for (let i in links) {
    let e = REGEX.exec(links[i].href)
    if (e && !~arr.indexOf(`P${e[1]}`)) {
      arr.push(e[1])
    }
    if (arr.length == 20) {
      break
    }
  }
  // criteoFilter
  arr = (await criteoFilter.call(this, { ids: arr })).splice(0, 3)
  return arr.map(item => `P${item}`)
}

export default async function() {
  wrapper.call(this, await criteo.bind(this))
}