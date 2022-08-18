import 'yakuhanjp'
import Head from 'next/head'
import type { AppContext, AppProps } from 'next/app'
import App from 'next/app'
import { appWithTranslation } from 'next-i18next'

import { CssBaseline } from '@mui/material'
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'

import { AppStore, reducerManager, sw } from 'store'
import themeConfig from 'theme.config'
import CommonLayout, { WithoutSideMenu } from 'components/layouts/common'
import LoadingProvider from 'contexts/LoadingContext'
import ToastProvider from 'contexts/ToastContext'
import 'common/app.css'
import 'common/nprogress.css'
import NProgress from 'nprogress'
import I18nProvider from 'contexts/I18nContext'
import { timeZone } from '../common/date'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import http from 'http'
import { actions, IAuth } from 'store/appSlice'
import { auPayload } from 'common/variables'

type ComponentWithPageLayout = AppProps & {
  Component: AppProps['Component'] & {
    PageLayout?: React.ComponentType
  },
  locale: string
}

function CommonHead() {
  return (
    <Head>
      <title>GogoJungle マイアカウント</title>
      <link data-n-head='true' rel='icon' type='image/x-icon' href='/favicon.ico' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0' />
      <meta charSet='utf-8' />
    </Head>
  )
}

const theme = createTheme(themeConfig.light as ThemeOptions)

function GgjApp({
  Component, pageProps,
  // , locale
}: ComponentWithPageLayout) {
  const PageLayout = Component.PageLayout || WithoutSideMenu
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => {
      NProgress.start()
    }
    const handleStop = () => {
      NProgress.done()
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CommonHead />
      {/*TODO: Thao, remove hard code language*/}
      <I18nProvider locale={'jp'}>
        <CommonLayout>
          <PageLayout>
            <LoadingProvider>
              <ToastProvider>
                <Component {...pageProps} />
              </ToastProvider>
            </LoadingProvider>
          </PageLayout>
        </CommonLayout>
      </I18nProvider>
    </ThemeProvider>
  )
}

interface IncomingMessage extends http.IncomingMessage {
  get cookies(): {
    [key: string]: string;
  }
}

function appendAuth(req: IncomingMessage, store: AppStore) {
  if (typeof window !== 'undefined' /*is client*/) {
    return
  }
  let pl: IAuth | Record<string, never> = {}
  try {
    pl = JSON.parse(req.headers[auPayload] as string || '')
  } catch (e) {
    // do nothing
  } finally {
    pl && store.dispatch(actions.setAuth(pl))
  }
}

GgjApp.getInitialProps = sw.getInitialAppProps(store => async (appContext: AppContext) => {
  const req = appContext?.ctx?.req as IncomingMessage
  let locale = req.cookies?.lang || 'ja'
  if (!timeZone[locale]) {
    // TODO: Hieu Nguyen - set cookie
    locale = 'ja'
  }
  reducerManager.restoreReducer()
  appendAuth(req, store)
  return {
    ...(await App.getInitialProps(appContext)), locale,
  }
})

export default sw.withRedux(appWithTranslation(GgjApp))
