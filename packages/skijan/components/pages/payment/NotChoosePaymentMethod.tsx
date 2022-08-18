import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import Fade from '@mui/material/Fade'
import { memo, useMemo } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import CartIcon from '../guide/CartIcon'
import { useTranslation } from 'next-i18next'
const nsTran = 'surface@payment'
import { useAppSelector } from 'store/hooks'
import { ns } from 'store/paymentSlice'

const NotChoosePaymentMethod = () => {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const currentPaymentMethod = useAppSelector(
    (state) => state[ns]?.currentPaymentMethod
  )
  const breakPointMd = useMemo(() => theme.breakpoints.values.md, [])
  if(currentPaymentMethod) return null
  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Stack
          direction={'column'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <CartIcon
            css={css`
              width: 160px;
              height: 140px;
              @media only screen and (min-width: ${breakPointMd}px) {
                width: 212px;
                height: 204px;
              }
            `}
          />
          <Typography
            variant="subtitle1"
            css={css`
              color: ${theme.palette.smoke.dark};
              letter-spacing: 0.14px;
              line-height: 24px;
              font-weight: 500;
              margin-top: ${theme.spacing(3)};
            `}
          >
            {t('9')}
          </Typography>
        </Stack>
      </Box>
    </Fade>
  )
}
export default memo(NotChoosePaymentMethod)
