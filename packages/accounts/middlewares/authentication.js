/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const axios = require('axios')
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const { join } = require('path')
const slackUtils = require('@ggj/utils/utils/slackv2')
const { GGJ_REDIRECT_CODE } = require('../common/constant')
/* eslint-enable @typescript-eslint/no-var-requires */
const ACCESS_TOKEN_SIG_COOKIE = 'tsa'
const REFRESH_TOKEN_SIG_COOKIE = 'tsr'
const ACCESS_TOKEN_LIFE_TIME = 900000 // 15 min
const REFRESH_TOKEN_LIFE_TIME = 6.307e10 // 2 year
const TEMPORARY_REDIRECT = 307

const INTERNAL_PATHS = [
  '/api/accounts/v1/authentication/revoke',
  '/api/accounts/v1/authentication/revokeAll'
]

async function refreshAccessToken({
  refreshTokenSignature,
  res,
  firstAutoLoginClientId,
  firstAutoLoginUrl,
  previousPath,
  isDocumentReq,
  clientId,
}) {
  // Refresh access token based the refresh token signature
  try {
    const requestAuth =
      await axios.post(`${process.env.ACCOUNTS_API_URL}/api/accounts/v1/authentication/refresh`, {
        rts: refreshTokenSignature
      })

    const refreshTokenResult = requestAuth.data
    // In case there is an error or no data is responded
    if (!refreshTokenResult || refreshTokenResult.error) {
      return res.redirect('/logout')
    }

    const {
      token
    } = refreshTokenResult.data

    setCookies(res, token)

    return authorizeAndRedirect(res, {
      parentRTS: token.rts,
      firstAutoLoginClientId,
      firstAutoLoginUrl,
      previousPath,
      isDocumentReq,
      clientId
    })
  } catch (e) {
    // In case there is an error unhandled
    console.error(e)
    slackUtils.send(
      {
        preContent: `Refresh token failed\nRefresh token signature: ${refreshTokenSignature}`,
        message: e?.message
      },
      process.env.ERROR_SLACK_CHANNEL
    )
    return res.redirect('/logout')
  }
}

async function authentication(req, res, next) {
  //TODO: Trung Pham - Remove all console log in this file
  const { headers = {}, query = {}, path } = req

  if (INTERNAL_PATHS.some(internalPath => path.startsWith(internalPath))){
    return res.sendStatus(401)
  }

  const isDocumentReq = (headers['accept'] || '').includes('text/html')
  const isAjaxReq = headers['x-requested-with'] === 'XMLHttpRequest'
  const cookies = cookie.parse(headers.cookie || '')
  const accessTokenSignature = cookies[ACCESS_TOKEN_SIG_COOKIE] || ''
  const refreshTokenSignature = cookies[REFRESH_TOKEN_SIG_COOKIE] || ''
  const isNextDataReq = path.startsWith('/_next/data')
  // Redirect to skijan if logged
  if (isNextDataReq && refreshTokenSignature) {
    return res.json({
      pageProps: {
        __N_REDIRECT: process.env.SKJ_HOST_URL,
        __N_REDIRECT_STATUS: TEMPORARY_REDIRECT,
      },
    })
  }
  if (
    // In case it NOT documents request and it NOT the ajax request too
    // => Ignore the authentication process
    !(isDocumentReq || isAjaxReq ) ||
    // or it's an image request
    (req.path.startsWith('/img') && req.method === 'GET')
  ) {
    return next()
  }
 
  const isLogout = req.path.startsWith('/logout')

  if (!accessTokenSignature && !refreshTokenSignature) {
    if (isLogout) {
      return res.redirect('/login')
    }
    console.log('!accessTokenSignature && !refreshTokenSignature ', path)
    return next()
  }

  if (isLogout) {
    return next()
  }

  const { firstAutoLoginClientId, firstAutoLoginUrl, u: previousPath, clientId  } = query

  if (!accessTokenSignature){
    console.log('accessTokenSignature does not exist ', path)
    // In case access token signature is valid
    return await refreshAccessToken({
      refreshTokenSignature,
      res,
      firstAutoLoginClientId,
      firstAutoLoginUrl,
      previousPath,
      clientId,
      isDocumentReq
    })
  }

  if (!refreshTokenSignature) {
    console.log('refreshTokenSignature does not exist ', path)
    clearAuthenticationCookie(res)
    if (path.startsWith('/login')){
      return next()
    }
    return res.redirect('/login')
  }
  // In case access token signature is existed
  const fullAccessToken = await getTokenBySignature(accessTokenSignature)

  if (!fullAccessToken){
    console.log('Cannot find fullAccessToken ', path)
    return await refreshAccessToken({
      refreshTokenSignature,
      res,
      firstAutoLoginClientId,
      firstAutoLoginUrl,
      previousPath,
      clientId,
      isDocumentReq
    })
  }

  const decryptAT = decodeToken(fullAccessToken)

  if (!decryptAT.success){
    console.log(
      'Decrypt the access token failed ',
      decryptAT,
      accessTokenSignature,
      refreshTokenSignature,
      path
    )
    return await refreshAccessToken({
      refreshTokenSignature,
      res,
      firstAutoLoginClientId,
      firstAutoLoginUrl,
      previousPath,
      clientId,
      isDocumentReq
    })
  }
  // In case access token signature is valid
  return authorizeAndRedirect(res, {
    parentRTS: refreshTokenSignature,
    firstAutoLoginClientId,
    firstAutoLoginUrl,
    previousPath,
    isDocumentReq,
    clientId
  })
}

async function authorizeAndRedirect(res, data) {
  const {
    parentRTS,
    firstAutoLoginClientId = '',
    previousPath,
    isDocumentReq,
    firstAutoLoginUrl = '',
    clientId
  } = data

  const skijanHost = process.env.SKJ_HOST_URL
  const validPreviousPath = [
    skijanHost
  ]

  if (!previousPath || !parentRTS || !validPreviousPath.some(val => previousPath.startsWith(val))) {
    // In case go account NOT from the client service (Ex: Skijan)
    // => Redirect to myaccount in case logged in or after refresh token
    if (isDocumentReq) {
      return res.redirect(skijanHost)
    }
    // In case user make request login again after logged in
    return res.sendStatus(GGJ_REDIRECT_CODE)
  }

  try {
    const requestAuth =
      await axios.post(`${process.env.ACCOUNTS_API_URL}/api/accounts/v1/authorization/authorize`, {
        parentRTS,
        firstAutoLoginClientId,
        firstAutoLoginUrl,
        previousPath,
        clientId
      })
    const axiosResponse = requestAuth.data

    if (!axiosResponse.data.url) {
      return res.redirect('/logout')
    }

    return res.redirect(axiosResponse.data.url)
  } catch (e) {
    console.error(e)
    slackUtils.send(
      {
        preContent: `Authorize failed\n
        Refresh token signature: ${parentRTS}\n
        previousPath: ${previousPath}`,
        message: e?.message
      },
      process.env.ERROR_SLACK_CHANNEL
    )
    return res.redirect('/logout')
  }
}

async function getTokenBySignature(signature) {
  if (!signature) {
    return Promise.resolve('')
  }
  return new Promise(resolve => {
    try {
      fs.readFile(join(process.env.ACCOUNT_AUTH_TOKEN_PATH, 'cache', signature), 'utf8',
        (err, data) => {
          if (err) {
            return resolve('')
          }
          resolve(data)
        })
    } catch (e) {
      console.error(e.code === 'ENOENT' ? `File ${signature} not found!` : e)
      resolve('')
    }
  })
}

function decodeToken(token) {
  return jwt.verify(token, process.env.ACCOUNT_AUTH_JWT_SECRETKEY, (err, decode) => {
    if (err) {
      return { success: false, message: err.message }
    }
    return { success: true, decode }
  })
}

function setCookies(res, token) {
  res.cookie(ACCESS_TOKEN_SIG_COOKIE, token.ats, {
    maxAge: isLocal() ? REFRESH_TOKEN_LIFE_TIME : ACCESS_TOKEN_LIFE_TIME,
    httpOnly: true,
    secure: !isLocal(),
    domain: process.env.GOGO_DOMAIN
  })

  res.cookie(REFRESH_TOKEN_SIG_COOKIE, token.rts, {
    maxAge: REFRESH_TOKEN_LIFE_TIME,
    httpOnly: true,
    secure: !isLocal(),
    domain: process.env.GOGO_DOMAIN
  })
}

function clearAuthenticationCookie(res) {
  res.clearCookie(ACCESS_TOKEN_SIG_COOKIE, { domain: process.env.GOGO_DOMAIN })
  res.clearCookie(REFRESH_TOKEN_SIG_COOKIE, { domain: process.env.GOGO_DOMAIN })
}

function isLocal() {
  return !['production', 'staging'].includes(process.env.ENV)
}

module.exports = {
  authentication
}
