import React from 'react'
import { css } from '@emotion/react'
import NextLink from 'next/link'
import { useTranslation } from 'next-i18next'
import { ggjServerSideTranslations } from 'common/i18nUtils'

import { Divider, Link, Stack, Typography } from '@mui/material'

import SnsButtons from 'components/SnsButtons'
import UserForm from 'components/UserForm'
import { NextRequest } from 'next/server'
import Head from 'next/head'

import { actions, TScreenType } from 'store/authSlice'
import { sw } from '../store'

const nsTran = 'gui@login'

const styleLink = css`
  cursor: pointer;
  text-decoration: none;
`

const PageMeta = React.memo(() => {
  const {t} = useTranslation(nsTran)
  return <Head>
    <title>{t('meta-title')}</title>
    <meta name="keywords" content={t('meta-keywords')} />
  </Head>
})
PageMeta.displayName = 'PageMeta'

function Login() {
  const {t} = useTranslation(nsTran)

  return <>
    <PageMeta />
    <Typography variant="h5" mb={4} textAlign="center">{t('1')}</Typography>
    <Stack direction="column" spacing={3}>
      <SnsButtons />
      <Divider />
      <Typography variant="caption" mb={4} mt={4} textAlign="center">
        {t('21')}
      </Typography>
      <UserForm screenType={TScreenType.LOGIN} />
    </Stack>
    <Typography textAlign="center" mt={5}>
      <NextLink href="/password/reset" passHref>
        <Link css={styleLink} color="primary">{t('17')}</Link>
      </NextLink>
    </Typography>
    <Typography textAlign="center" mt={4}>
      {t('19')}
      <NextLink href="/register" passHref>
        <Link css={styleLink} color="primary">{t('18')}</Link>
      </NextLink>
    </Typography>
  </>
}

export const getServerSideProps = sw.getServerSideProps((store) => async ({req}) => {
  store.dispatch(actions.setClientId(req.headers['referer'] || ''))
  return {
    props: {
      ...await ggjServerSideTranslations(req as unknown as NextRequest, [nsTran, 'common@thirdparty', 'common@userform', 'common@validate']),
    },
  }
})

export default Login
