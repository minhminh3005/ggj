export default function () {
  window.gtmDataLayer = window.gtmDataLayer || []
  window.ggjGtmDataLayer = function(pId) {
    window.gtmDataLayer.push({'product_id': pId })
  }
  // ignore if bot or not production mode
  if (
    /(Chrome-Lighthouse|bot)/i.test(navigator.userAgent) ||
    process.env.NODE_ENV !== 'production'
  ) {
    console.log(`The google-tag-master is in ${process.env.NODE_ENV} env.`)
    return
  }

  // this script is copied from OAM-69045
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f)
  })(window,document,'script','gtmDataLayer','GTM-5SRZZSL')
}
