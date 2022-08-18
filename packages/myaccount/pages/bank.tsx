import { Grid, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { css } from '@emotion/react'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { NextRequest } from 'next/server'
import { useEffect } from 'react'
import Head from 'next/head'
import { BackButton } from 'components/common'
import slice, { actions, getBankInfo, nsBank } from 'store/bankSlice'
import { reducerManager, sw } from 'store'
import BankContent from 'components/pages/bank/BankContent'
import { ns } from 'store/appSlice'

export const nsBankTran = ['components@bank', 'common@validate']


export const botTypo = css`
  margin-bottom: 8px;
`

export const fullWidth = css`
  width: 100%;
`
export const splitAcc = (str: string) => {
  const chunks = []

  for (let i = 0, charsLength = str.length; i < charsLength; i += 4) {
    chunks.push(str.substring(i, i + 4))
  }
  return chunks
}

export const numbersValidate = new RegExp('^[0-9]+$')

const Bank = () => {
  const { t } = useTranslation(nsBankTran)
  reducerManager.add(slice)
  useEffect(() => {
    return () => {
      reducerManager.remove(nsBank)
    }
  }, [])
  return (
    <>
      <Head>
        <title>{t('meta-title')}</title>
        <meta name="description" content={t('meta-description')} />
        <meta name="keywords" content={t('meta-kw')} />
      </Head>
      <BackButton />
      <Grid container>
        <Grid item xs={12} md={9} lg={6}>
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
            `}
          >
            <Typography variant="h6">{t('registration-title')}</Typography>
          </div>
          <Typography
            variant="subtitle1"
            css={css`
              margin-top: 16px;
            `}
          >
            {t('registration-subtitle')}
          </Typography>
          <BankContent />
        </Grid>
        <Grid item xs={12} md={3} lg={6}></Grid>
      </Grid>
    </>
  )
}

export const getServerSideProps = sw.getServerSideProps((store) => async ({ req }) => {
  reducerManager.add(slice)

  const isSkjDeveloper = store.getState()[ns]?.auth?.isSkjDeveloper
  if(!isSkjDeveloper) return {
    redirect: {
      permanent: false,
      destination: '/'
    }
  }

  const [_nextI18Next, data] = await Promise.all([
    ggjServerSideTranslations(req as unknown as NextRequest, nsBankTran),
    getBankInfo(req as unknown as NextRequest),
  ])
  store.dispatch(actions.setBankInfo(data))

  const props = {
    props: {
      ..._nextI18Next,
    },
  }
  return { ...props }
})

export default Bank
