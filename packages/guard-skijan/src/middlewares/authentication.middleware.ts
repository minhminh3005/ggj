import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import fs from 'fs'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { join } from 'path'
import { PubSubService } from '../services/pub-sub.service'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import {
  ACCESS_TOKEN_LIFE_TIME,
  ACCESS_TOKEN_SIG_COOKIE,
  AUTH_PAYLOAD_HEADER_NAME,
  GGJ_REDIRECT_CODE,
  MAX_RETRY_EXCHANGE_CODE,
  MAX_RETRY_GET_TOKEN_NUMBER,
  REFRESH_TOKEN_LIFE_TIME,
  REFRESH_TOKEN_SIG_COOKIE,
} from '../app.constants'
import * as slackUtil from '@ggj/utils/utils/slackv2'
import { isLocal } from '../utils/shared'

const IGNORE_AUTH_CHECK_PATH = ['/api/skijan/v1/information']

const requiredAuthenticationPath = ['/mypage', '/api/skijan/v1/mypage']

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private readonly skjHostUrl = process.env.SKJ_HOST_URL
  private readonly skjDomain = process.env.SKJ_DOMAIN
  private readonly accountHostUrl = process.env.ACCOUNT_HOST_URL
  private readonly skjClientId = process.env.SKJ_CLIENT_ID

  constructor(
    private readonly pubSubService: PubSubService,
    private readonly httpService: HttpService,
  ) {}

  async use(req: any, res: any, next: (error?: any) => void): Promise<any> {
    const { headers = {}, query = {}, path, method } = req
    const isLogoutReq = path.startsWith('/logout')

    if (isLogoutReq) {
      this.cleanAuthenticationCookiesNHeaders(res, req)
      return res.redirect(`${this.accountHostUrl}/logout`)
    }

    const isDocumentReq = (headers['accept'] || '').includes('text/html')
    const isAjaxReq = headers['x-requested-with'] === 'XMLHttpRequest'
    const isNextDataReq = path.startsWith('/_next/data')
    const isMyPageHeadPath = method === 'HEAD' && path.startsWith('/mypage')
    const isImgSkjMypage = path.startsWith('/img/v3/skijan/mypage')
    const isFileSkjMypage = path.startsWith('/upload/v3/skijan/mypage')
    const isIgnoredPath = IGNORE_AUTH_CHECK_PATH.some((ignorePath) =>
      path.startsWith(ignorePath),
    )

    if (
      // Ignore the authentication process in the following case
      !(
        isDocumentReq ||
        isAjaxReq ||
        isNextDataReq ||
        isFileSkjMypage ||
        isMyPageHeadPath ||
        isImgSkjMypage
      ) ||
      isIgnoredPath
    ) {
      return next()
    }

    const cookies = cookie.parse(headers.cookie || '')

    const accessTokenSignature = cookies[ACCESS_TOKEN_SIG_COOKIE] || ''
    const refreshTokenSignature = cookies[REFRESH_TOKEN_SIG_COOKIE] || ''
    const exchangeCode = query.code

    if (isFileSkjMypage) {
      return refreshTokenSignature
        ? await this.specialHandleForUpload(
            refreshTokenSignature,
            path,
            res,
            req,
            next,
          )
        : res.sendStatus(GGJ_REDIRECT_CODE)
    }

    if (exchangeCode) {
      // in case redirect from the account after login (Ex: SKJ_HOST/xxx?tsa=<token>&tsr=<token>)
      const token = await this.tryExchangeCode(exchangeCode)

      delete query.code

      const params = new URLSearchParams(query).toString()
      const redirectUrl = `${this.skjHostUrl}${path}${
        params ? `?${params}` : ''
      }`
      const { firstAutoLoginClientId = '', firstAutoLoginUrl = '' } = query

      if (!token.rts) {
        return res.redirect(
          !firstAutoLoginClientId ? `/notvalid?u=${redirectUrl}` : '/notvalid',
        )
      }

      this.setCookies(res, {
        rts: token.rts,
        ats: token.ats,
      })

      if (firstAutoLoginClientId) {
        const accountsParams = new URLSearchParams({
          firstAutoLoginClientId,
          firstAutoLoginUrl,
          u: this.skjHostUrl,
          clientId: this.skjClientId,
        }).toString()
        return res.redirect(
          `${this.accountHostUrl}/authorize${
            accountsParams ? `?${accountsParams}` : ''
          }`,
        )
      }

      return res.redirect(301, redirectUrl)
    }

    if (!accessTokenSignature && !refreshTokenSignature) {
      console.log('!accessTokenSignature && !refreshTokenSignature')
      // in case both access & refresh token does not exist
      this.setReqHeaders(req, {} as TAuthPayload)
      return this.handleAuthenticationError(req, res, next)
    }

    if (!accessTokenSignature) {
      console.log('accessTokenSignature does not exist')
      return await this.invalidAccessTokenHandler({
        refreshTokenSignature,
        req,
        res,
        next,
      })
    }

    if (!refreshTokenSignature) {
      console.log('refreshTokenSignature does not exist')
      this.cleanAuthenticationCookiesNHeaders(res, req)
      return next()
    }
    // in case the access token signature exist
    let fullAccessToken = await this.getTokenBySignature(accessTokenSignature)
    // Waiting in case the EFS sync is slow down
    if (!fullAccessToken) {
      fullAccessToken = await this.tryGetFullToken(accessTokenSignature)
    }

    if (!fullAccessToken) {
      // in case access token still not exist after waiting
      console.log(
        'Cannot find access_token base signature ',
        accessTokenSignature,
      )

      return await this.invalidAccessTokenHandler({
        refreshTokenSignature,
        req,
        res,
        next,
        isDeleteEventCache: true,
      })
    }

    const decryptAT = this.decodeToken(fullAccessToken)
    if (!decryptAT.success) {
      console.log(
        'Decrypt the access token failed ',
        decryptAT,
        accessTokenSignature,
        refreshTokenSignature,
        path,
      )
      return await this.invalidAccessTokenHandler({
        refreshTokenSignature,
        req,
        res,
        next,
        isDeleteEventCache: true,
      })
    }

    // In case the access token valid
    console.log('Access token valid')
    const tokenPayload = decryptAT['decode']
    if (tokenPayload.clientId !== this.skjClientId) {
      console.log(
        'Invalid token payload client ',
        tokenPayload,
        accessTokenSignature,
      )
      // Refresh access token based the refresh token signature
      return await this.invalidAccessTokenHandler({
        refreshTokenSignature,
        req,
        res,
        next,
      })
    }
    this.setReqHeaders(req, tokenPayload)
    return next()
  }

  private async specialHandleForUpload(
    refreshTokenSignature: string,
    path,
    res: any,
    req: any,
    next: (error?: any) => void,
  ) {
    // in case the access token signature exist
    let fullRefreshToken = await this.getTokenBySignature(refreshTokenSignature)
    // Waiting in case the EFS sync is slow down
    if (!fullRefreshToken) {
      fullRefreshToken = await this.tryGetFullToken(refreshTokenSignature)
    }

    if (!fullRefreshToken) {
      // in case access token still not exist after waiting
      console.log(
        'Upload: Cannot find fullRefreshToken base signature ',
        refreshTokenSignature,
        path,
      )
      return res.sendStatus(GGJ_REDIRECT_CODE)
    }
    const decryptedRefreshToken = this.decodeToken(fullRefreshToken)
    if (!decryptedRefreshToken.success) {
      console.log(
        'Upload: Decrypt the refresh token failed ',
        decryptedRefreshToken,
        refreshTokenSignature,
        path,
      )
      return res.sendStatus(GGJ_REDIRECT_CODE)
    }

    // In case the access token valid
    const tokenPayload = decryptedRefreshToken['decode']
    if (tokenPayload.clientId !== this.skjClientId) {
      console.log(
        'Upload: Invalid token payload client ',
        tokenPayload,
        refreshTokenSignature,
      )
      return res.sendStatus(GGJ_REDIRECT_CODE)
    }
    this.setReqHeaders(req, tokenPayload)
    return next()
  }

  async invalidAccessTokenHandler({
    refreshTokenSignature,
    req,
    res,
    next,
    isDeleteEventCache = false,
  }: TInvalidAccessTokenHandlerData) {
    if (!refreshTokenSignature) {
      this.cleanAuthenticationCookiesNHeaders(res, req)
      return next()
    }
    isDeleteEventCache &&
      (await this.pubSubService.deleteEventCache(refreshTokenSignature))
    return await this.refreshAccessToken(refreshTokenSignature, req, res, next)
  }

  private async refreshAccessToken(
    refreshTokenSignature,
    req: any,
    res: any,
    next: (error?: any) => void,
  ) {
    try {
      console.log(
        'Starting refresh token ',
        refreshTokenSignature,
        req.originalUrl,
      )

      const eventName = refreshTokenSignature

      const cachedRefreshData = await this.pubSubService.getCachedEventData(
        eventName,
      )
      if (cachedRefreshData) {
        // In case has cached refresh data
        return this.refreshTokenPublishHandler(
          {
            req,
            res,
            next,
          },
          cachedRefreshData,
        )
      }

      if (this.pubSubService.isExistEvent(eventName)) {
        // In case exist request refresh token
        // => add the current request to the list & waiting for the result
        console.log(
          'Subscribing the req %s to the event %s ',
          req.originalUrl,
          eventName,
        )
        this.pubSubService.subscribe(eventName, (previousResult) =>
          this.refreshTokenPublishHandler({ req, res, next }, previousResult),
        )
      } else {
        console.log(
          'Start the first refresh token request ',
          refreshTokenSignature,
          req.originalUrl,
        )
        this.pubSubService.initEvent(eventName)

        const result = await this.getRefreshTokenData(refreshTokenSignature)
        // In case there is an error and no data is responded
        if (!result || result.error) {
          console.log(
            'There are an error refresh token',
            result,
            refreshTokenSignature,
          )
          this.pubSubService.publishAll(eventName)
          this.cleanAuthenticationCookiesNHeaders(res, req)
          return this.handleAuthenticationError(req, res, next)
        }

        this.setCookies(res, result.data.token)
        this.setReqHeaders(req, result.data.userData)

        //Publish all waiting refresh token request
        this.pubSubService.publishAll(eventName, result.data)

        return next()
      }
    } catch (e) {
      // In case there is an error unhandled
      console.error(e)
      slackUtil.send(
        {
          preContent: `Refresh token failed\nRefresh token signature: ${refreshTokenSignature}`,
          message: e?.message,
        },
        process.env.ERROR_SLACK_CHANNEL,
      )
      this.cleanAuthenticationCookiesNHeaders(res, req)
      return this.handleAuthenticationError(req, res, next)
    }
  }

  private handleAuthenticationError(req, res, next) {
    const { headers = {}, path } = req
    const isDocumentReq = (headers['accept'] || '').includes('text/html')
    const isNextMyPagePath = path.match(/^\/_next\/data\/.*\/mypage\/.*/)

    if (isNextMyPagePath) {
      const matchRs = req.originalUrl.match(/\/mypage\/.*/)
      const redirectUrl = matchRs ? matchRs[0].replace('.json', '') : ''
      return res.json({
        pageProps: {
          __N_REDIRECT: `${this.accountHostUrl}/login?clientId=skj&u=${this.skjHostUrl}${redirectUrl}`,
          __N_REDIRECT_STATUS: HttpStatus.TEMPORARY_REDIRECT,
        },
      })
    }

    if (
      requiredAuthenticationPath.some((authPath) => path.startsWith(authPath))
    ) {
      // redirect to login page in case non-logged user access mypage
      return isDocumentReq
        ? res.redirect(
            `${this.accountHostUrl}/login?clientId=skj&u=${this.skjHostUrl}${req.originalUrl}`,
          )
        : res.sendStatus(GGJ_REDIRECT_CODE)
    }
    return next()
  }

  private async tryGetFullToken(accessTokenSignature: string): Promise<string> {
    let cnt = 0
    let res
    while (!res && cnt < MAX_RETRY_GET_TOKEN_NUMBER) {
      try {
        res = await this.getTokenBySignature(accessTokenSignature)
      } catch (e) {
        return ''
      }
      if (res) {
        return res
      }
      await new Promise((resolveTimeOut) => setTimeout(resolveTimeOut, 500))
      cnt += 1
    }
    return ''
  }

  private cleanAuthenticationCookiesNHeaders(res: any, req: any) {
    res.clearCookie(ACCESS_TOKEN_SIG_COOKIE, { domain: this.skjDomain })
    res.clearCookie(REFRESH_TOKEN_SIG_COOKIE, { domain: this.skjDomain })
    this.setReqHeaders(req, {} as TAuthPayload)
  }

  refreshTokenPublishHandler(
    data: TEventData,
    previousResult: TRefreshTokenResult,
  ) {
    const { req, res, next } = data
    if (!previousResult) {
      return next()
    }
    this.setCookies(res, previousResult.token)
    this.setReqHeaders(req, previousResult.userData)
    return next()
  }

  async getTokenBySignature(signature: string): Promise<string> {
    if (!signature) {
      return Promise.resolve('')
    }
    return new Promise((resolve) => {
      try {
        fs.readFile(
          join(process.env.ACCOUNT_AUTH_TOKEN_PATH, 'cache', signature),
          'utf8',
          (err, data) => {
            if (err) {
              return resolve('')
            }
            resolve(data)
          },
        )
      } catch (e) {
        console.error(e.code === 'ENOENT' ? `File ${signature} not found!` : e)
        resolve('')
      }
    })
  }

  decodeToken(token: string) {
    return jwt.verify(
      token,
      process.env.ACCOUNT_AUTH_JWT_SECRETKEY,
      (err, decode) => {
        if (err) {
          return { success: false, message: err.message }
        }
        return { success: true, decode }
      },
    )
  }

  setReqHeaders(req, userData: TAuthPayload) {
    req.headers[AUTH_PAYLOAD_HEADER_NAME] = JSON.stringify(userData)
  }

  setCookies(res, token: TToken) {
    token.ats &&
      res.cookie(ACCESS_TOKEN_SIG_COOKIE, token.ats, {
        maxAge: isLocal() ? REFRESH_TOKEN_LIFE_TIME : ACCESS_TOKEN_LIFE_TIME,
        httpOnly: true,
        secure: !isLocal(),
        domain: this.skjDomain,
      })

    token.rts &&
      res.cookie(REFRESH_TOKEN_SIG_COOKIE, token.rts, {
        maxAge: REFRESH_TOKEN_LIFE_TIME,
        httpOnly: true,
        secure: !isLocal(),
        domain: this.skjDomain,
      })
  }

  async getRefreshTokenData(
    refreshTokenSignature: string,
  ): Promise<TRefreshTokenResponse> {
    try {
      const requestAuth = await lastValueFrom(
        this.httpService.post(
          `${process.env.ACCOUNTS_API_URL}/api/accounts/v1/authentication/refresh`,
          {
            rts: refreshTokenSignature,
            clientId: this.skjClientId,
          },
        ),
      )
      return requestAuth.data
    } catch (e) {
      console.error(e)
      slackUtil.send(
        {
          preContent: `Call refresh token request to account API failed\n
          Refresh token signature: ${refreshTokenSignature}`,
          message: e?.message,
        },
        process.env.ERROR_SLACK_CHANNEL,
      )
      return {
        error: 'RefreshTokenFailed',
        data: {} as TRefreshTokenResult,
      }
    }
  }

  private async tryExchangeCode(code: string): Promise<TToken> {
    let cnt = 0
    let res
    while (!res && cnt < MAX_RETRY_EXCHANGE_CODE) {
      try {
        res = await lastValueFrom(
          this.httpService.post(
            `${process.env.ACCOUNTS_API_URL}/api/accounts/v1/authorization/code/exchange`,
            {
              code,
            },
          ),
        )
      } catch (e) {
        return {} as TToken
      }
      if (res) {
        return res?.data?.data
      }
      await new Promise((resolveTimeOut) => setTimeout(resolveTimeOut, 500))
      cnt += 1
    }
    return {} as TToken
  }
}
