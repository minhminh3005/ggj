import {nsTranSurfacePaymentsLayout, SurfacePaymentsLayout,} from 'components/layouts'
import {ggjServerSideTranslations} from 'common/i18nUtils'
import {NextRequest} from 'next/server'
///Component
import {Box, NoSsr} from '@mui/material'
import CustomizedStepper from 'components/pages/payment/Stepper'
import PaymentRender from 'components/pages/payment/PaymentRender'
import {useTheme} from '@mui/material/styles'
///Store
import {reducerManager} from 'store/store'
import slice, {
  actions,
  ErrorStatusTypes,
  getPaymentComplete,
  getPaymentInfo,
  handlePaymentInfoErrorStatus,
  IErrorCheckoutType,
  ns,
  PaymentInfoType,
  PaymentStatus
} from 'store/paymentSlice'
import {useEffect} from 'react'
import {AppError} from 'app.d'
import {getAuthUrl} from '../common/url'
import {useRouter} from 'next/router'

import {useTranslation} from 'next-i18next'
import {PaymentCompleteType, PaymentMethods, Steps} from 'components/pages/payment/const'
import {PopupError} from '../components/pages/payment/PopupError'
import Head from 'next/head'
import {useAppDispatch} from '../store/hooks'
import {ParsedUrlQuery} from 'querystring'

const nsTran = 'surface@payment'

export default function PaymentPage(
  {
    errorCode,
    productId,
    result,
    csid,
  }:
    {
      errorCode?: string,
      productId?: number,
      csid?: string | null,
      result?: any,
    }
) {
  const theme = useTheme()
  const router = useRouter()
  const {t} = useTranslation(nsTran)
  const dispatch = useAppDispatch()
  const initStore = () => {
    dispatch(actions.resetState())

    if (!result.data.errorCode) {
      if (csid) {
        dispatch(actions.setCartSessionId(csid as string))
        dispatch(actions.setPaymentInfo(result.data as PaymentInfoType))
        dispatch(actions.handleSetCurrentStep(Steps.Step1))
      } else {
        dispatch(actions.handleSetPaymentComplete(result.data as PaymentCompleteType))
        dispatch(actions.handleSetCurrentStep(Steps.Step3))
      }
      return
    }

    if (result.data.errorCode == ErrorStatusTypes.EPVCreditPaymentCheckoutError || ErrorStatusTypes.EPVCreditPaymentCancel) {
      if (csid) dispatch(actions.setCartSessionId(csid as string))
      dispatch(actions.setPaymentInfo(result.data as PaymentInfoType))
      dispatch(actions.handleSetCurrentStep(Steps.Step2))
      dispatch(actions.handleSetCurrentPaymentMethod(PaymentMethods.Credit))
      if (result.data.errorCode === ErrorStatusTypes.EPVCreditPaymentCheckoutError) {
        dispatch(actions.setIsShowPopupError(true))
      }
    }

  }

  useEffect(() => {
    if (errorCode) {
      const errorCheckoutType: IErrorCheckoutType = {
        EPAuthNOTLogin: t('EPAuthNOTLogin'),
        EPVInvalidSkill: t('EPVInvalidSkill'),
        EPVSkillDraft: t('EPVSkillDraft'),
        EPVSkillClosed: t('EPVSkillClosed'),
        EPVSkillPaused: t('EPVSkillPaused'),
        EPVInvalidBuyer: t('EPVInvalidBuyer'),
        EPVInvalidSeller: t('EPVInvalidSeller'),
        EPVInvalidOpts: t('EPVInvalidOpts'),
        EPVSkillLimited: t('EPVSkillLimited'),
        EPVInvalidCart: t('EPVInvalidCart'),
        EPVSkillPriceChanged: t('EPVSkillPriceChanged'),
        EPVOptsPriceChanged: t('EPVOptsPriceChanged'),
        EPVCreditPaymentCheckoutError: t('EPVCreditPaymentCheckoutError'),
        EPVCreditPaymentCancel: t('EPVCreditPaymentCheckoutError')
      }
      handlePaymentInfoErrorStatus(errorCode, errorCheckoutType, router, productId as number)
      return
    }

    reducerManager.add(slice)
    if (result) {
      initStore()
    }

    return function () {
      reducerManager.remove(ns)
    }
  }, [router])

  return (
    <>
      <Head>
        <title>Skijan</title>
      </Head>
      <NoSsr>
        <Box mb={theme.spacing(6)}>
          <CustomizedStepper/>
          <PaymentRender/>
        </Box>
        <PopupError/>
      </NoSsr>
    </>
  )
}
PaymentPage.Layout = SurfacePaymentsLayout


export const getServerSideProps = async ({
  req,
  query
}: { query: ParsedUrlQuery, req: NextRequest }) => {
  const csid = query?.csid
  const ssid = query?.ssid
  if (!query || !csid && !ssid) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      }
    }
  }

  const getType = {
    getCartInfo: 'getCartInfo',
    getPaymentComplete: 'getPaymentComplete'
  }

  let type = ''
  if (csid) {
    type = getType.getCartInfo
  } else if (ssid) {
    type = getType.getPaymentComplete
  } else {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      }
    }
  }

  const request = req as unknown as NextRequest
  const [_nextI18Next, result] = await Promise.all([
    ggjServerSideTranslations(request, [nsTran], nsTranSurfacePaymentsLayout),
    type == getType.getCartInfo ? getPaymentInfo(csid as string, request)
      : getPaymentComplete(ssid as string, request)
  ])

  if (!result.error) {
    return {props: {..._nextI18Next, result: result, csid: csid ? csid : null}}
  }

  if (result.error) {
    switch (result.error) {
    case AppError.ECB404: {
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        }
      }
    }
    case PaymentStatus.EPAuthNOTLogin: {
      return {
        redirect: {
          destination: getAuthUrl('login', request.url),
          permanent: false,
        }
      }
    }
    default: {
      if (type == getType.getCartInfo) {
        return {props: {..._nextI18Next, errorCode: result.error, productId: result.message}}
      }
    }
    }
  }

  return {
    redirect: {
      destination: '/404',
      permanent: false,
    }
  }

}
