import { Stack } from '@mui/material'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { ns } from 'store/messageSlice'
import { TransactionMenus } from '../transaction/HeaderInfo'

export const HeaderInfo = () => {
  const theme = useTheme()
  return (
    <>
      <Stack
        mb={{ lg: 5 }}
        pl={{ xs: 2, md: 4 }}
        pr={{ xs: 2, md: 4 }}
        pt={{ xs: 3, md: 4, lg: 2 }}
        pb={{ xs: 4, md: 4, lg: 2 }}
        direction={{ xs: 'column', lg: 'row' }}
        spacing={{ xs: 0, lg: 4 }}
        alignItems={{ xs: 'left', lg: 'center' }}
        justifyContent={{ xs: 'end', lg: 'start' }}
        css={css`
          background: transparent
            linear-gradient(
              96deg,
              ${theme.palette.jade.light} 0%,
              ${theme.palette.jade.dark} 100%
            )
            0% 0% no-repeat padding-box;
          min-height: 80px;
          border-radius: 0 0 10px 10px;
          @media (min-width: ${theme.breakpoints.values.lg}px) {
            height: 80px;
            min-height: auto;
            border-radius: 10px;
          }
        `}
      >
        <TransactionMenus ns={ns} />
      </Stack>
    </>
  )
}
