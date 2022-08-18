import { memo, useCallback, useEffect, useMemo } from 'react'
import { useAppSelector, useAppDispatch } from 'store/hooks'
import { ns, actions } from 'store/paymentSlice'
import { Steps } from './const'
import PaymentWrapper from './PaymentWrapper'
import Step3 from './Step3'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useLayoutContext } from 'contexts/LayoutContext'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { css } from '@emotion/react'
import { Typography } from '@mui/material'
const nsTran = 'surface@payment'

const PaymentRender = () => {
  const { t } = useTranslation(nsTran)
  const theme = useTheme()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const currentStep = useAppSelector((state) => state[ns]?.currentStep)
  const isMobileOrTablet = useMediaQuery(
    `(max-width:${theme.breakpoints.values.lg - 1}px
      )`,
    { noSsr: true }
  )

  const { updateLayoutSetting } = useLayoutContext()
  const titleHeader = useMemo(() => {
    if (currentStep == Steps.Step1) return 'step-1'
    if (currentStep == Steps.Step2) return 'step-2'
    if (currentStep == Steps.Step3) return 'step-3'
    return ''
  }, [currentStep])
  const onBack = useCallback(() => {
    if (currentStep == Steps.Step1) return router.back()
    if (currentStep == Steps.Step2)
      return dispatch(actions.handleSetCurrentStep(Steps.Step1))
    if (currentStep == Steps.Step3) return router.push('/')
  }, [currentStep])

  useEffect(() => {
    if (isMobileOrTablet) {
      updateLayoutSetting({
        title: t(titleHeader),
        onBack: onBack,
        backButton:
          currentStep == Steps.Step3 ? (
            <Typography
              onClick={onBack}
              variant="subtitle1"
              css={css`
                margin-left: ${theme.spacing(3)};
                color: ${theme.palette.primary.main};
              `}
            >
              {t('37')}
            </Typography>
          ) : null,
      })
    }
  }, [currentStep])

  if (currentStep == Steps.Step1 || currentStep == Steps.Step2) {
    return <PaymentWrapper />
  }
  if (currentStep == Steps.Step3) {
    return <Step3 />
  }
  return null
}
export default memo(PaymentRender)
