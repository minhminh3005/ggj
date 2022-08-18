import {css} from '@emotion/react'
import {Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {memo} from 'react'
import {useTranslation} from 'next-i18next'
import {GgjPaidOption} from '../../../commons/GgjPaymentPanel'
import {useAppSelector} from '../../../../store/hooks'
import {
  NSPaymentSkillDetail,
  PaymentPanelProvider,
  SkillStatus
} from '../../../commons/GgjPaymentPanel/paymentPanelSlice'

import {skillDetailNsTran as nsTran} from 'components/pages/skill/[id]/const'

const ProductPaidOption = () => {
  const {t} = useTranslation(nsTran)
  const theme = useTheme()
  const listPaidOptions = useAppSelector((state) => state[NSPaymentSkillDetail]?.listPaidOptions ?? [])
  const skillInfo = useAppSelector((state) => state[NSPaymentSkillDetail]?.skillInfo ?? {})
  if (skillInfo.isLimit || skillInfo.statusType !== SkillStatus.Selling || !listPaidOptions || listPaidOptions.length == 0) return null
  return (

    <section css={css`
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;`}>
      <Typography variant="h6" css={css`
        width: 100%;
        padding: 24px 0;
        color: ${theme.palette.jade.dark}`}>{t('27')}</Typography>
      <PaymentPanelProvider namespace={NSPaymentSkillDetail}>
        <GgjPaidOption/>
      </PaymentPanelProvider>
      <div
        css={css`
          border-bottom: 1px solid ${theme.palette.smoke.light};
          width: 100%;
        `}
      >
      </div>
    </section>
  )
}
export default memo(ProductPaidOption)
