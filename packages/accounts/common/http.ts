import axios, { AxiosRequestHeaders } from 'axios'
import getConfig from 'next/config'
import { NextRequest } from 'next/server'
import { GGJ_REDIRECT_CODE } from './constant'

let options = {
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
}

// if is in server
if (typeof window === 'undefined') {
  const { serverRuntimeConfig } = getConfig()
  options = Object.assign({}, options, {
    baseURL: serverRuntimeConfig.ACCOUNTS_API_URL
  })
}

const http = axios.create(options)

if (typeof window !== 'undefined') {
  http.interceptors.response.use(function(response) {
    return response
  }, function(error) {
    const { publicRuntimeConfig } = getConfig()
    if (error.response.status === GGJ_REDIRECT_CODE) {
      // 456: Redirect to different origin after calling an ajax request
      // In case user request login when it already logged in
      window.location.href = publicRuntimeConfig.SKJ_HOST_URL
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  })
}

export default http

// using to append request header at server side
export function appendGgjHeader({ req }: { req: NextRequest }): AxiosRequestHeaders {
  const headerKeys = ['au-payload','user-agent', 'x-forwarded-for']
  const headers = req.headers as unknown as Record<string, string>
  const reqHeader = {} as unknown as Record<string, string>
  headerKeys.forEach(item => headers[item] ? reqHeader[item] = headers[item] : '')
  return reqHeader
}
