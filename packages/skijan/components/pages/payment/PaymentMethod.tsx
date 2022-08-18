import { memo } from 'react'
import { Box, Stack } from '@mui/material'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import TextTitle from './TextTitle'
import CustomizedRadioBtn from './CustomizedRadioBtn'
import { ListPaymentMethods } from './const'
import { useAppSelector } from 'store/hooks'
import { ns } from 'store/paymentSlice'
import { Steps } from './const'
import { useTranslation } from 'next-i18next'
const nsTran = 'surface@payment'

const PaymentMethod = () => {
  const currentStep = useAppSelector((state) => state[ns]?.currentStep)
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  if (currentStep == Steps.Step1)
    return (
      <Box
        css={css`
          width: 100%;
          margin-bottom: ${theme.spacing(6)};
        `}
      >
        <TextTitle>{t('4')}</TextTitle>
        <Stack mt={3} direction={'row'} spacing={{ md: 3, xs: 2 }}>
          {ListPaymentMethods.map((p) => (
            <CustomizedRadioBtn paymentMethod={p} key={p.type} />
          ))}
        </Stack>
      </Box>
    )
  return null
}

export default memo(PaymentMethod)
