import { memo } from 'react'
import { useAppSelector } from 'store/hooks'
import { ns } from 'store/paymentSlice'
import { Steps } from './const'
import TextTitle from './TextTitle'
import { useTranslation } from 'next-i18next'
const nsTran = 'surface@payment'

const TextTitleWrapper = () => {
  const { t } = useTranslation(nsTran)
  const currentStep = useAppSelector((state) => state[ns]?.currentStep)
  if (currentStep == Steps.Step1) {
    return <TextTitle>{t('1')}</TextTitle>
  }
  if (currentStep == Steps.Step2) {
    return <TextTitle>{t('2')}</TextTitle>
  }
  return null
}
export default memo(TextTitleWrapper)
