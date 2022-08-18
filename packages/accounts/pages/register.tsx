import { ggjServerSideTranslations } from 'common/i18nUtils'
import { NextRequest } from 'next/server'
import React from 'react'

import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'

import { Trans, useTranslation } from 'next-i18next'
import { Divider, Stack, Typography } from '@mui/material'
import SnsButtons from 'components/SnsButtons'
import Link from 'next/link'
import Head from 'next/head'
import {TScreenType} from '../store/authSlice'
import UserForm from '../components/UserForm'

const nsTran = 'gui@register'

const PageMeta = React.memo(() => {
  const {t} = useTranslation(nsTran)
  return <Head>
    <title>{t('meta-title')}</title>
    <meta name="keywords" content={t('meta-keywords')} />
  </Head>
})
PageMeta.displayName = 'PageMeta'

function Register() {
  const theme = useTheme()
  const {t} = useTranslation(nsTran)

  function renderI18HtmlText([text, link]: Array<string>) {
    return <>
      <Trans i18nKey={t(text)} />
      {/* Pending: Link not accept css */}
      <Link href="/login" passHref>
        <a css={css`
          color: ${theme.palette.primary.main};
          text-decoration: none;
          cursor: pointer;
        `}>{t(link)}</a>
      </Link>
    </>
  }

  return <>
    <PageMeta/>
    <Stack spacing={4}>
      <Typography variant="h5" textAlign="center">{t('login-title')}</Typography>
      <Stack spacing={3}>
        <Typography>
          {renderI18HtmlText(['login-subtitle', '3'])}
        </Typography>
        <SnsButtons register />
        <Divider />
        <Typography variant="caption" mb={4} mt={4} textAlign="center">
          {t('2')}
        </Typography>
        <UserForm screenType={TScreenType.REGISTER} />
      </Stack>
      <Stack spacing={2}>
        <Divider/>
        <Typography align='center'>
          {renderI18HtmlText(['1','4'])}
        </Typography>
      </Stack>
    </Stack>
  </>
}

export async function getServerSideProps({req}: {req: NextRequest}) {
  return {
    props: {
      ...await ggjServerSideTranslations(req, [nsTran, 'common@thirdparty', 'common@userform', 'common@validate']),
    },
  }
}

export default Register
