import { Injectable, NestMiddleware } from '@nestjs/common'
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
  MAX_RETRY_GET_TOKEN_NUMBER,
  REFRESH_TOKEN_LIFE_TIME,
  REFRESH_TOKEN_SIG_COOKIE,
} from '../app.constants'
import * as slackUtil from '@ggj/utils/utils/slackv2'
import { isLocal } from '../utils/shared'

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private readonly accountHostUrl = process.env.ACCOUNT_HOST_URL
  private readonly myAccountHostUrl = process.env.MYACCOUNT_HOST_URL

  constructor(
    private readonly pubSubService: PubSubService,
    private readonly httpService: HttpService,
  ) {}

  async use(req: any, res: any, next: (error?: any) => void): Promise<any> {
    const { headers, path, originalUrl } = req
    const userAgent = headers['user-agent'] || ''
    const isDocumentReq = (headers['accept'] || '').includes('text/html')
    const isNextDataReq = path.startsWith('/_next/data')
    const isAjaxReq = headers['x-requested-with'] === 'XMLHttpRequest'
    if (
      // In case it NOT document request// and it NOT the ajax request too
      // => Ignore the authentication process
      !(isDocumentReq || isAjaxReq || isNextDataReq) ||
      // or it's an image request
      (path.startsWith('/img') && req.method == 'GET')
    ) {
      return next()
    }

    const cookies = cookie.parse(headers.cookie || '')
    const accessTokenSignature = cookies[ACCESS_TOKEN_SIG_COOKIE] || ''
    const refreshTokenSignature = cookies[REFRESH_TOKEN_SIG_COOKIE] || ''

    if (!accessTokenSignature && !refreshTokenSignature) {
      console.log('!accessTokenSignature && !refreshTokenSignature')
      // in case both access & refresh token does not exist
      return this.redirectBackAccountHost(res, isDocumentReq, originalUrl)
    }

    if (accessTokenSignature) {
      console.log('accessTokenSignature exist ', path, userAgent)
      if (!refreshTokenSignature) {
        console.log('refreshTokenSignature does not exist')
        this.cleanAuthenticationCookie(res)
        return this.redirectBackAccountHost(res, isDocumentReq, originalUrl)
      }
      // in case the access token signature exist
      let fullAccessToken = await this.getTokenBySignature(accessTokenSignature)
      // Waiting in case the EFS sync is slow down
      if (!fullAccessToken) {
        fullAccessToken = await this.tryGetAccessToken(accessTokenSignature)
      }

      if (!fullAccessToken) {
        await this.pubSubService.deleteEventCache(refreshTokenSignature)
        console.log(
          'Cannot find access_token base signature ',
          accessTokenSignature,
        )
        // this.cleanAuthenticationCookie(res)
        // return this.redirectBackAccountHost(res, isDocumentReq, originalUrl)
      } else {
        const decryptAT = this.decodeToken(fullAccessToken)

        if (decryptAT.success) {
          // In case the access token valid
          console.log('Access token valid')
          this.setReqHeaders(req, decryptAT['decode'])
          return next()
        }
        // In case has access token but the access toke is invalid
        // => redirect in case document request
        await this.pubSubService.deleteEventCache(refreshTokenSignature)
        console.log(
          'Decrypt the access token failed ',
          decryptAT,
          accessTokenSignature,
          refreshTokenSignature,
        )
      }
    }

    if (!refreshTokenSignature) {
      this.cleanAuthenticationCookie(res)
      return this.redirectBackAccountHost(res, isDocumentReq, originalUrl)
    }

    // Refresh access token based the refresh token signature
    try {
      console.log('Starting refresh token ', path, userAgent)
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
          path,
          userAgent,
        )
        this.pubSubService.initEvent(eventName)
        const result = await this.getRefreshTokenData(refreshTokenSignature)
        // In case there is an error and no data is responded
        if (!result || result.error) {
          console.log(
            'There are an error refresh token',
            result,
            refreshTokenSignature,
            path,
            userAgent,
          )
          this.cleanAuthenticationCookie(res)
          this.pubSubService.publishAll(eventName)
          return this.redirectBackAccountHost(res, isDocumentReq)
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
      this.cleanAuthenticationCookie(res)
      return this.redirectBackAccountHost(res, isDocumentReq, originalUrl)
    }
  }

  private redirectBackAccountHost(
    res: any,
    isDocumentReq,
    originalUrl?: string,
  ) {
    const redirectUrl = `${this.accountHostUrl}/login?u=${this.myAccountHostUrl}${originalUrl}`
    if (isDocumentReq) {
      return res.redirect(redirectUrl)
    }
    return res.sendStatus(GGJ_REDIRECT_CODE)
  }

  refreshTokenPublishHandler(
    data: TEventData,
    previousResult: TRefreshTokenResult,
  ) {
    console.log('refreshTokenPublishHandler')
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
        maxAge: ACCESS_TOKEN_LIFE_TIME,
        httpOnly: true,
        secure: !isLocal(),
        domain: process.env.GOGO_DOMAIN,
      })

    token.rts &&
      res.cookie(REFRESH_TOKEN_SIG_COOKIE, token.rts, {
        maxAge: REFRESH_TOKEN_LIFE_TIME,
        httpOnly: true,
        secure: !isLocal(),
        domain: process.env.GOGO_DOMAIN,
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

  cleanAuthenticationCookie(res) {
    res.clearCookie(ACCESS_TOKEN_SIG_COOKIE)
    res.clearCookie(REFRESH_TOKEN_SIG_COOKIE)
  }

  private async tryGetAccessToken(
    accessTokenSignature: string,
  ): Promise<string> {
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
}
