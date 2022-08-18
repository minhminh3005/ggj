import { memo, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {ns, handleValidateOrCheckout, IErrorCheckoutType} from 'store/paymentSlice'
import CustomizedButton from './CustomizedButton'
import { Steps, PaymentMethods } from './const'
import { useTranslation } from 'next-i18next'
import {useRouter} from 'next/router'
const nsTran = 'surface@payment'

const CustomizedButtonWrapper = () => {
  const { t } = useTranslation(nsTran)
  const router = useRouter()
  const currentPaymentMethod = useAppSelector(
    (state) => state[ns]?.currentPaymentMethod
  )
  const storeName = useAppSelector((state) => state[ns]?.storeName)

  const currentStep = useAppSelector((state) => state[ns]?.currentStep)
  const isDisabled = useMemo(
    () =>
      currentPaymentMethod == PaymentMethods.PayAtConvenienceStore &&
      !storeName,
    [currentPaymentMethod, storeName]
  )
  const dispatch = useAppDispatch()
  const handleSubmit =  () => {
    const errorCheckoutType:IErrorCheckoutType = {
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
      EPVCreditPaymentCheckoutError:t('EPVCreditPaymentCheckoutError'),
      EPVCreditPaymentCancel:t('EPVCreditPaymentCheckoutError')
    }

    // @ts-ignore
    dispatch(handleValidateOrCheckout(errorCheckoutType,router))
  }

  if (!currentPaymentMethod) {
    return <CustomizedButton disabled={true}>{t('3')}</CustomizedButton>
  } else {
    if (currentStep == Steps.Step1)
      return (
        <CustomizedButton onClick={handleSubmit} disabled={isDisabled}>
          {t('3')}
        </CustomizedButton>
      )
    if (currentStep == Steps.Step2) {
      return (
        <CustomizedButton onClick={handleSubmit}>{t('38')}</CustomizedButton>
      )
    }
  }
  return null
}
export default memo(CustomizedButtonWrapper)
