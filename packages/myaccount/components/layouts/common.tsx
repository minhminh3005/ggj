// mui
import { AppBar, Button, Grid, MenuItem, Select, Toolbar, Typography } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import LanguageIcon from '@mui/icons-material/Language'
import { styled, useTheme } from '@mui/material/styles'

// react, emotion react
import { ComponentPropsWithoutRef, ReactNode, useEffect, useRef, useState } from 'react'
import { css } from '@emotion/react'

// store

// utils
import { setCookie } from 'common/utils'

// logo components
import GogojungleIcon from 'components/icons/GogojungleIcon'
import SkijanIcon from 'components/icons/SkijanIcon'

// next
import getConfig from 'next/config'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

// const
const nsTran = ['common@common-layout']
const bodyMaxWidth = '1128px'

/**
 * [Functional components]
 * Common layout for myaccount service.
 * */
export default function CommonLayout(props: { children: ReactNode }) {
  return <>
    <Header />
    <main>
      {props.children}
    </main>
    <Footer />
  </>
}

/**
 * [Functional components]
 * Common layout for myaccount service.
 * */
export function WithoutSideMenu(props: { children: ReactNode }) {
  const theme = useTheme()
  return <div css={css`
      padding: 0 16px;
      min-height: calc(100vh - 336px);
      @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
        padding: 0 24px ${theme.spacing(7)};
        margin: 0 24px;
      }
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        padding: 0 ${theme.spacing(6)} ${theme.spacing(7)};
        width: 100%;
        max-width: ${bodyMaxWidth};
        margin: 0 auto;
      }`
  }>
    {props.children}
  </div>
}

/**
 * [Functional components]
 * Header of the "CommonLayout".
 * */
function Header() {
  const theme = useTheme()
  const router = useRouter()
  const { t } = useTranslation(nsTran)
  const { publicRuntimeConfig } = getConfig()
  let hiddenHeader = ''
  if (router.pathname !== '/') {
    hiddenHeader = `@media only screen and (max-width: ${theme.breakpoints.values.md}px) { display: none;}`
  }
  return <AppBar
    color="transparent"
    css={css`
      background: #fff;
      position: sticky;
      box-shadow: none;
      margin-bottom: 2px;
      height:72px;
      border-bottom: 1px solid ${theme.palette.divider};
      ${hiddenHeader};
      @media (min-width: ${theme.breakpoints.values.md}px) {
        position: static;
      }
    `}
  >
    <Toolbar
      variant="dense"
      css={css`
        justify-content: space-between;
        max-width: ${bodyMaxWidth};
        padding: 0 16px;
        height:100%;
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          padding: 0 24px;
          margin: 0 24px;
        }
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          padding: 0 ${theme.spacing(6)};
          width: 100%;
          max-width: ${bodyMaxWidth};
          margin: 0 auto;
        }
      `}
    >
      <div css={css`display: flex; align-items:center`}>
        <div css={css`
          margin: ${theme.spacing(2)};
          margin-left: ${theme.spacing(0)};
          border: 1px solid ${theme.palette.divider};
          border-radius: 10px;`}
        >
          <LogoContainer href={`${publicRuntimeConfig.GOGO_URL}`}><GogojungleIcon /></LogoContainer>
        </div>
        <div css={css`margin: ${theme.spacing(2)}; margin-left: ${theme.spacing(0)}; margin-right:0`}>
          <LogoContainer href={`${publicRuntimeConfig.SKJ_HOST_URL}`}><SkijanIcon /></LogoContainer>
        </div>
        <Typography variant="h6" css={css`margin-left: ${theme.spacing(3)}; color:${theme.palette.text.primary}`}>{t('titleHeader')}</Typography>
      </div>
    </Toolbar>
  </AppBar>
}

/**
 * [Functional components]
 * Logo of the "Header".
 * */
function LogoContainer(props: ComponentPropsWithoutRef<'div'> & { href: string }) {
  const theme = useTheme()
  return (
    <Link href={props.href} passHref>
      <Button
        css={css`
            height: 40px;
            min-width: 0;
            width: 40px;
            border-radius: 10px;
            overflow: hidden;
            transition: ${theme.transitions.create(['box-shadow'], { duration: 'complex' })};
            cursor: pointer;
            box-shadow: ${theme.shadows[0]};
            display: block;
            padding: 0;
            transition: box-shadow ${theme.transitions.duration.standard};
            svg {
              height: 100%;
              width: 100%;
            }
            &:hover {
              box-shadow: ${theme.shadows[1]};
            }
            &:active {
              box-shadow: ${theme.shadows[0]};
            }
        `}
      >{props.children}</Button>
    </Link>
  )
}

/**
 * [Functional components]
 * FOOTER
 * */
function Footer() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  return (<div css={css`display: flex; justify-content: center;background-color: #222;`}>
    <Grid
      container
      component="footer"
      rowSpacing={1}
      columnSpacing={{ xs: 1 }}
      css={css`
        max-width: ${bodyMaxWidth};
        min-height: 20vh;
        width: 100%;
        color: #fff;
        padding: ${theme.spacing(3)} ${theme.spacing(3)};
        margin: 0;
        .MuiTypography-root {
          color: #fff;
        }
        >.MuiGrid-item {
          padding-top: 0;
          padding-left: 0;
        }
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          flex-direction: row-reverse;
          padding: ${theme.spacing(4)};
          margin: 0 24px;
        }
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          padding-left: ${theme.spacing(6)};
          padding-right: ${theme.spacing(6)};
          margin: 0 auto;
        }
      `}
    >
      <Grid
        item
        xs={12}
        md={4}
        css={css`
          margin-bottom: ${theme.spacing(3)};
          height: 42px;
          display: none; //TODO: remove later
          @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
            display: flex;
            flex-direction: row-reverse;
          }
        `}
      >
        {false && <ChangeLanguageButton />}
      </Grid>
      <Grid item xs={12} md={8}>
        <FooterLink href="/terms/service">
          <span>{t('footer-1')}</span>
        </FooterLink>
        <FooterLink href="/terms/seller">
          <span>{t('footer-2')}</span>
        </FooterLink>
        <FooterLink href="/terms/operation">
          <span>{t('footer-3')}</span>
        </FooterLink>
        <FooterLink href="/terms/policy">
          <span>{t('footer-4')}</span>
        </FooterLink>
        <FooterLink href="https://corp.gogojungle.co.jp/">
          <span>{t('footer-5')}</span>
        </FooterLink>
        <FooterLink href="https://corp.gogojungle.co.jp/recruit_details/">
          <span>{t('footer-6')}</span>
        </FooterLink>
      </Grid>
      <Grid item xs={12}>
        <div css={css`
          text-align: center;
          margin-top: ${theme.spacing(4)};
        `}>
          <Typography variant="subtitle2">Copyright © {new Date().getFullYear()} GogoJungle Inc. All Rights Reserved.</Typography>
        </div>
      </Grid>
    </Grid>
  </div>)
}

/**
 * [Functional components]
 * Footer link for the "CommonLayout".
 * */
function FooterLink(props: { children: ReactNode, href: string }) {
  const theme = useTheme()
  return (
    <div css={css`
      margin-bottom: ${theme.spacing(2)};
      &:last-child {
        margin-bottom: 0;
      }
    `}>
      <Link href={props.href} passHref>
        <a css={css`
          text-decoration: none;
          cursor: pointer;
          display: inline;
          color: #fff;
        `}>{props.children}</a></Link>
    </div>
  )
}

/**
 * [Functional components]
 * Custom select, using for the "ChangeLanguageButton".
 * */
const CustomSelect = styled(Select)(
  () => ({
    '.MuiSelect-select': {
      paddingLeft: '36px',
      paddingTop: '8px',
      paddingBottom: '8px',
      width: '160px',
      display: 'flex',
      alignItems: 'center',
      color: '#fff',
    },
    '.MuiOutlinedInput-notchedOutline': {
      borderColor: '#fff'
    },
    '.MuiSvgIcon-root': {
      color: '#fff',
      right: 'auto',
      left: '7px',
    },
    ':hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#626262',
    }
  })
)

/**
 * [Functional components]
 * Change language button for the "CommonLayout".
 * */
const ChangeLanguageButton = () => {
  const router = useRouter()
  const defaultLang = 'ja'
  const [value] = useState(defaultLang) // default is japanese
  const firstUpdate = useRef(true)
  const { publicRuntimeConfig } = getConfig()
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
  }, [value])
  const handleChange = async (event: SelectChangeEvent) => {
    setCookie('lang', event.target.value, 60 * 24 * 365, '/', publicRuntimeConfig.GOGO_DOMAIN)
    location && await router.push(location.href)
  }

  return <CustomSelect
    value={value}
    IconComponent={LanguageIcon}
    onChange={e => handleChange(e as SelectChangeEvent<string>)}
    inputProps={{ 'aria-label': 'Without label' }}
    css={css`max-width: 100%;`}
  >
    <MenuItem value="ja" css={css`display: flex;align-items: center;`}>
      <span>日本語</span>
    </MenuItem>
    <MenuItem value="th" css={css`display: flex;align-items: center;`}>
      <span>ภาษาไทย</span>
    </MenuItem>
    <MenuItem value="en" css={css`display: flex;align-items: center;`}>
      <span>English</span>
    </MenuItem>
    <MenuItem value="ch" css={css`display: flex;align-items: center;`}>
      <span>繁體中文</span>
    </MenuItem>
    <MenuItem value="tw" css={css`display: flex;align-items: center;`}>
      <span>简体中文</span>
    </MenuItem>
    <MenuItem value="vi" css={css`display: flex;align-items: center;`}>
      <span>Tiếng&nbsp;Việt</span>
    </MenuItem>
  </CustomSelect>
}
