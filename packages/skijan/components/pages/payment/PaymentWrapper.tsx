import { memo } from 'react'
import { Grid, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { css } from '@emotion/react'
import PaymentMethod from './PaymentMethod'
///Component
import OverViewBox from './OverviewBox'
import TextTitleWrapper from './TextTitleWrapper'
import CustomizedButtonWrapper from './CustomizedButtonWrapper'
import NotChoosePaymentMethod from './NotChoosePaymentMethod'
import Step1 from './Step1'
import Step2 from './Step2'

const PaymentWrapper = () => {
  const theme = useTheme()
  return (
    <Box
      css={css`
        margin-top: ${theme.spacing(6)};
      `}
    >
      <Grid container columns={8} columnSpacing={{ lg: 9 }} rowSpacing={5}>
        <Grid item lg={3} xs={12} md={12}>
          <OverViewBox />
        </Grid>
        <Grid item lg={5} xs={12} md={12}>
          <section>
            <PaymentMethod />
            <TextTitleWrapper />
            <Box
              mt={3}
              css={css`
                border-radius: 10px;
                padding: ${theme.spacing(4)};
                border: 1px solid ${theme.palette.smoke.light};
              `}
            >
              <NotChoosePaymentMethod />
              <Step1 />
              <Step2 />
            </Box>
            <CustomizedButtonWrapper />
          </section>
        </Grid>
      </Grid>
    </Box>
  )
}
export default memo(PaymentWrapper)
