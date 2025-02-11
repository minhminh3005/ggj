import titleI18n from '@@/lang/common/title.json'
import { editCss } from '@/utils/client/common'
import { getExternalRedirectLink, isMultiplePrice } from '@@/../common/js/product/externalProduct'

export async function getData(
  app,
  params,
  error,
  req,
  route,
  store,
  titlePrefix = '',
  query = {},
) {
  let id = params.id,
    locale = app.i18n.locale,
    // suffixDes = titleI18n[locale].suffixDes,
    title = titleI18n[locale].title,
    // category = route.fullPath.split('/')[2],
    [detail, mainChart, externalUrl, isRangePrice] = await Promise.all([
      app.GoGoHTTP.get(`/api/v3/surface/systemtrade/fx/${id}`),
      app.GoGoHTTP.get(`/api/v3/surface/systemtrade/fx/${id}/chartv2`, {
        params: {
          accountId: query.a || 0
        }
      }),
      getExternalRedirectLink(app, id),
      isMultiplePrice(app, params.id),
    ]),
    descriptionChunk,
    titleChunk,
    currentUrl
  if (!detail || !Object.keys(detail).length) {
    return error({ statusCode: 404 })
  }
  if (detail.code) {
    return error({ statusCode: 404, exists: detail.exists })
  }
  store.commit('cart/setInfo', {
    // OAM-27672
    info: Object.assign({},
      { externalUrl, isRangePrice },
      detail.cartInfo),
    productStatus: detail.status,
    isPassword: detail.isPassword,
  })
  if (process.browser) {
    currentUrl = window.location.href
  } else {
    currentUrl = process.env.GOGO_URL + req.originalUrl
  }
  titleChunk = titlePrefix ? `${detail.name} - ${titlePrefix}` : detail.name
  descriptionChunk = `${titleChunk} - ${title}` // `${detail.name} ${suffixDes}`
  if (
    (detail.outline || {}).outline &&
    detail.outline.outline.includes('<style')
  ) {
    detail.outline.outline = editCss(
      detail.outline.outline,
      '.outline-IbBKtrbLMt'
    )
  }
  store.commit('pushBC', {
    name: 'Top',
    path: '/',
  })
  store.commit('pushBC', {
    name: detail.name,
    target: { name: 'en-systemtrade-index-fx-id', params: params },
  })
  return {
    id,
    detail,
    mainChart,
    titleChunk,
    descriptionChunk,
    keywordsChunk: detail.name,
    meta: [
      {
        name: 'og:site_name',
        content: 'GogoJungle',
        hid: 'og:site_name',
      },
      {
        name: 'og:type',
        content: 'website',
        hid: 'og:type',
      },
      {
        name: 'og:title',
        content: `${titleChunk} - ${title}`,
        hid: 'og:title',
      },
      {
        name: 'og:description',
        content: descriptionChunk, //detail.description || detail.name,
        hid: 'og:description',
      },
      {
        name: 'og:url',
        content: currentUrl,
        hid: 'og:url',
      },
      {
        name: 'og:image',
        content: `${process.env.GOGO_URL}/img/products/${id}`,
        hid: 'og:image',
      },
    ],
    linkMeta: [
      {
        rel: 'canonical',
        href: `https://www.gogojungle.co.jp/en/systemtrade/fx/${id}`,
      },
    ],
  }
}
