import 'yakuhanjp'
import Head from 'next/head'
import type { AppContext, AppProps } from 'next/app'
import { appWithTranslation, useTranslation } from 'next-i18next'

import { css } from '@emotion/react'
import {
  AppBar,
  CssBaseline,
  Slide,
  Stack,
  Toolbar,
  Typography,
  useScrollTrigger,
} from '@mui/material'
import {
  createTheme,
  ThemeOptions,
  ThemeProvider,
} from '@mui/material/styles'

import { reducerManager, sw } from 'store'
import themeConfig from 'theme.config'
import GogojungleIcon from 'components/icons/GogojungleIcon'
import SkijanIcon from 'components/icons/SkijanIcon'
import LogoContainer from 'components/LogoContainer'

import LoadingProvider from 'contexts/LoadingContext'
import ToastProvider from 'contexts/ToastContext'
import getConfig from 'next/config'
import App from 'next/app'

interface Props {
  window?: () => Window
  children: React.ReactElement
}

const theme = createTheme(themeConfig.light as ThemeOptions)
const commonWidth = css`
  max-width: 432px;
  margin: auto;
`

function CommonHead() {
  return (
    <Head>
      <title>accounts.gogojungle</title>
      <link
        data-n-head="true"
        rel="icon"
        type="image/x-icon"
        href="/favicon.ico"
      />
      <meta property="og:title" content="My page title" key="title" />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <meta charSet="utf-8" />
    </Head>
  )
}

function HideOnScroll(props: Props) {
  const { children, window } = props
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  })

  return (
    <Slide
      appear={false}
      direction="down"
      in={!trigger}
      css={css`
        background: ${theme.palette.common.white};
        border-bottom: 1px solid ${theme.palette.divider};
        box-shadow: none;
      `}
    >
      {children}
    </Slide>
  )
}

const Header = () => {
  const { publicRuntimeConfig } = getConfig()
  return (
    <HideOnScroll>
      <AppBar>
        <Toolbar
          disableGutters
          css={[
            commonWidth,
            css`
              padding-left: ${theme.spacing(3)};
              padding-right: ${theme.spacing(3)};
              width: 100%;
            `,
          ]}
        >
          <Stack direction="row" spacing={3} py={2}>
            <LogoContainer href={publicRuntimeConfig.GOGO_HOST_URL}>
              <GogojungleIcon />
            </LogoContainer>
            <LogoContainer href={publicRuntimeConfig.SKJ_HOST_URL}>
              <SkijanIcon />
            </LogoContainer>
          </Stack>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  )
}

const Footer = () => {
  const { t } = useTranslation('common@footer')

  return (
    <footer>
      <Stack direction="row" justifyContent="center" p={2} bgcolor="#E1E1E1">
        <Typography variant="caption">{t('1')}</Typography>
      </Stack>
    </footer>
  )
}

function GgjApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CommonHead />
      <CssBaseline />
      <Header />
      <main
        css={[
          commonWidth,
          css`
            margin-top: 72px;
            padding: 16px;
            min-height: calc(100vh - 52px);
            position: relative;
            overflow: hidden;
            @media (min-width: ${theme.breakpoints.values.sm}px) {
              padding-top: 64px;
            }
          `,
        ]}
      >
        <LoadingProvider>
          <ToastProvider>
            <Component {...pageProps} />
          </ToastProvider>
        </LoadingProvider>
      </main>

      <Footer />
    </ThemeProvider>
  )
}

GgjApp.getInitialProps = sw.getInitialAppProps(() => async (appContext: AppContext) => {
 
  reducerManager.restoreReducer()
  return {
    ...(await App.getInitialProps(appContext))
  }
})
export default sw.withRedux(appWithTranslation(GgjApp))
