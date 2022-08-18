import 'yakuhanjp'
import Head from 'next/head'
import type { AppContext, AppProps } from 'next/app'
import App from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import {AppStore, reducerManager, sw} from 'store/store'
import { actions, IAuth } from 'store/appSlice'
import {theme as createTheme} from 'theme.config'
import LoadingProvider from 'contexts/LoadingContext'
import ToastProvider from 'contexts/ToastContext'
import type { NextPage } from 'next'
import type { ReactElement, ReactNode } from 'react'
import {useEffect, useRef, useCallback} from 'react'
import { LayoutProvider } from 'contexts/LayoutContext'
import 'common/app.css'
import 'common/nprogress.css'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import I18nProvider from 'contexts/I18nContext'
import { timeZone } from 'common/date'
import http from 'http'
import { auPayload } from 'common/variables'
import nextI18nConfig from '../next-i18next.config'
import {restorationScrollUrls, SCROLL_RESTORATION} from '../common/url'
import getConfig from 'next/config'

type AppPropsWithLayout = AppProps & {
  Component: NextPage & {
    Layout: (props: { children: ReactNode }) => ReactElement
  },
  locale: string
}

const GoogleAnalytics = () => {
  const { publicRuntimeConfig } = getConfig()
  const env = publicRuntimeConfig.ENV
  if (env !== 'production') return <></>
  const GA_ID = 'G-N09TMKXTKN'
  return (
    <Head>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `,
        }}
      />
    </Head>
  )
}

function CommonHead() {
  return (
    <Head>
      <link
        data-n-head="true"
        rel="icon"
        type="image/x-icon"
        href="/favicon.ico"
      />
      <meta property="og:title" content="My page title" key="og:title" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=no"/>
      <meta charSet="utf-8" />
    </Head>
  )
}

const theme = createTheme
function GgjApp({Component, pageProps
  // , locale
}: AppPropsWithLayout) {
  if(!Component.Layout) {
    throw 'Please specific Layout for this page.'
  }
  useAppRouter()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <CommonHead/>
      <GoogleAnalytics/>
      {/*TODO: Thao, remove hard code language*/}
      <I18nProvider locale={'jp'}>
        <LayoutProvider>
          <Component.Layout>
            <LoadingProvider>
              <ToastProvider>
                <Component {...pageProps} />
              </ToastProvider>
            </LoadingProvider>
          </Component.Layout>
        </LayoutProvider>
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
  if(typeof window !== 'undefined' /*is client*/ ) {
    return
  }
  let pl: IAuth | Record<string, never> = {}
  try {
    pl = JSON.parse(req.headers[auPayload] as string || '')
  } catch (e) {
    // do nothing
  } finally {
    store.dispatch(actions.setAuth(pl))
  }
}

function useAppRouter() {
  const isBackRef = useRef<boolean>(false)
  const router = useRouter()
  const handleSetIsBack = useCallback(() => isBackRef.current = true, [])

  useEffect(() => {
    const restorationLocalStorage = JSON.parse(localStorage.getItem(SCROLL_RESTORATION) || '{}')
    const pathName = router.pathname

    const handleStart = () => {
      if(restorationScrollUrls.includes(pathName)){
        let scrollPositionY
        if (window.innerWidth < 960) {
          scrollPositionY = window.scrollY
        } else {
          const ele = document.getElementById('BodyWrapper')
          scrollPositionY = ele?.scrollTop || 0
        }
        const localStorageSet = {
          ...restorationLocalStorage,
          [router.pathname]: scrollPositionY
        }
        localStorage.setItem(SCROLL_RESTORATION, JSON.stringify(localStorageSet))
      }
      NProgress.start()
    }
    const handleComplete = () => {
      const pageScrollLocalStorage = (restorationLocalStorage[pathName] || 0) as number
      const scrollPositionY = (restorationScrollUrls.includes(pathName) && isBackRef.current) ? pageScrollLocalStorage : 0
      if (window.innerWidth < 960) {
        setTimeout(() => window.scrollTo(0, scrollPositionY))
      } else {
        const ele = document.getElementById('BodyWrapper')
        ele && setTimeout(() => ele.scrollTo(0, scrollPositionY))
      }
      isBackRef.current = false
      handleStop()
    }
    const handleStop = () => NProgress.done()

    window.addEventListener('popstate', handleSetIsBack)
    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleStop)

    return () => {
      window.removeEventListener('popstate', handleSetIsBack)
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])
  return null
}

GgjApp.getInitialProps = sw.getInitialAppProps(store => async (appContext: AppContext) => {
  const req = appContext?.ctx?.req as IncomingMessage
  let locale = req?.cookies?.lang || 'ja'
  if (!timeZone[locale]) {
    // TODO: Hieu Nguyen - set cookie
    locale = 'ja'
  }
  reducerManager.restoreReducer()
  appendAuth(req, store)
  return {
    ...(await App.getInitialProps(appContext)), locale
  }
})

export default sw.withRedux(appWithTranslation(GgjApp,nextI18nConfig))
