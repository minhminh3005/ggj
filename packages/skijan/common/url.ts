import getConfig from 'next/config'
import { NextRouter } from 'next/dist/shared/lib/router/router'

const {publicRuntimeConfig: {ACCOUNT_HOST_URL, SKJ_HOST_URL}} = getConfig()

export function genAuthUrl(router: NextRouter | null, path: string) {
  return [ACCOUNT_HOST_URL, path + (!router ? '' : '?u=' + SKJ_HOST_URL + (router.asPath == '/' ? '' : router.asPath))].join('/')
}

export function getAuthUrl(path: string, currentPath: string) {
  return [ACCOUNT_HOST_URL, path + '?u=' + SKJ_HOST_URL + currentPath].join('/')
}

export function getInvalidUrl(path: string, currentPath: string) {
  return [ACCOUNT_HOST_URL, path + (currentPath ? '?u=' + currentPath : '')].join('/')
}

export const SCROLL_RESTORATION = 'scrollRestoration'
export const restorationScrollUrls = ['/', '/search']
