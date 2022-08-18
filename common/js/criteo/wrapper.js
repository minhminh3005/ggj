// OAM-17509
const processUrls = [
  '/systemtrade',
  '/tools',
  '/finance',
  '/event',
  '/products',
  '/cart',
  '/users',
  '/companies',
  '/inquiry',
  '/review',
  '/login',
  '/post',
  '/info',
  '/terms',
  '/crowdsourcing',
  '/markets',
  '/portfolio',
]

export default function(onLoadFn) {
  let p = location.pathname,
    ua = navigator.userAgent
  if (/(Chrome-Lighthouse|bot)/i.test(ua) || !processUrls.some(e => p.startsWith(e)) && p !== '/') {
    // only process the urls as processUrls
    return
  }

  setTimeout(async() => {
    let evt = await onLoadFn.call(this)
    if (!evt) {
      return
    }

    // ignore if not production mode
    if(process.env.NODE_ENV !== 'production') {
      let isMobile = /mobile/i.test(ua) && !/ipad/i.test(ua) && 'm',
        isTablet = /Tablet|iPad|iPod/i.test(ua) && 't'
      console.log('CRITEO TAG', evt, isMobile || isTablet || 'd')
      return
    }

    let fjs = document.getElementsByTagName('script')[0],
      js = document.createElement('script')

    js.src = '//static.criteo.net/js/ld/ld.js'
    js.async = true
    js.onload = async function() {
      let isMobile = /mobile/i.test(ua) && !/ipad/i.test(ua) && 'm',
        isTablet = /Tablet|iPad|iPod/i.test(ua) && 't'
      console.log('CRITEO TAG', evt, isMobile || isTablet || 'd')

      window.criteo_q = window.criteo_q || []
      window.criteo_q.push(
        { event: 'setAccount', account: 62157 },
        // m: Mobile, t: Tablet, d: PC
        { event: 'setSiteType', type: isMobile || isTablet || 'd' },
        evt,
        // { event: "setEmail", email: "tterasaki@gogojungle.co.jp" },
      )
    }
    fjs.parentNode.insertBefore(js, fjs)
  })
}