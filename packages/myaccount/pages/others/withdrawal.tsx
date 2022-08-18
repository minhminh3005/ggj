import { Stack } from '@mui/material'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import BackButton from 'components/common/BackButton'
import ReasonWithdrawScreen from 'components/pages/others/withdrawal/ReasonWithdrawScreen'
import WithdrawScreen from 'components/pages/others/withdrawal/WithdrawScreen'
import WithdrawSuccessScreen from 'components/pages/others/withdrawal/WithdrawSuccessScreen'
import { useRouter } from 'next/router'
import type { NextRequest } from 'next/server'
import { useEffect } from 'react'
import { reducerManager, sw } from 'store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import withdrawalSlice, { getListReasonWithdraw, ns } from 'store/others/withdrawalSlice'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import ModalWithdrawFailed from '../../components/pages/others/withdrawal/ModalWithdrawFailed'

const nsTran = 'components@withdrawal'


export default function Withdrawal() {
  reducerManager.add(withdrawalSlice)
  const router = useRouter()
  const { t } = useTranslation(nsTran)
  const dispatch = useAppDispatch()
  const screenIndex = useAppSelector(state => state[ns].screenIndex)

  const handleClickReturn = () => {
    const newScreenIndex = screenIndex - 1
    if(newScreenIndex  === 0 || newScreenIndex === 1 ) {
      dispatch(withdrawalSlice.actions.setScreenIndex(newScreenIndex))
      return
    }
    router.push('/others')
  }

  useEffect(() => {
    return () => {
      reducerManager.remove(ns)
    }
  }, [])

  return (
    <>
      <Head>
        <title>{t('meta-title')}</title>
        <meta name="description" content={t('meta-description')} />
        <meta name="keywords" content={t('meta-kw')} />
      </Head>
      {screenIndex !== 2 && <BackButton onClick={handleClickReturn} />}
      <Stack direction="row">
        <WithdrawScreen/>
        <ReasonWithdrawScreen/>
        <WithdrawSuccessScreen/>
      </Stack>
      <ModalWithdrawFailed />
    </>
  )
}


export const getServerSideProps = sw.getServerSideProps((store) => async ({ req }) => {
  reducerManager.add(withdrawalSlice)
  const props = {
    props: {
      ...await ggjServerSideTranslations(req as unknown as NextRequest, [nsTran]),
    },
  }
  await store.dispatch(getListReasonWithdraw(req as unknown as NextRequest))
  return { ...props }
})
