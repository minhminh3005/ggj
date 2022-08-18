import { css } from '@emotion/react'
import { Box, Slide, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
import { useAppSelector } from 'store/hooks'
import { ns } from 'store/others/withdrawalSlice'
const nsTran = 'components@withdrawal'


function WithdrawSuccessScreen() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const screenIndex = useAppSelector(state => state[ns].screenIndex)
  const lineHeight = css`line-height: 28px;`

  return (
    <Slide
      mountOnEnter
      unmountOnExit
      direction="left"
      in={screenIndex === 2}
      appear={false}
      css={css` flex-grow: 1;`}
      timeout={{exit: 0, enter: theme.transitions.duration.enteringScreen}}
    >
      <Box px={2}>
        <Typography css={lineHeight} variant="body1" mb={2} mt={3}><strong>{t('19')}</strong></Typography>
        <Typography css={lineHeight} variant="body1" fontWeight={theme.typography.fontWeightMedium}>{t('20')}</Typography>
        <Typography css={lineHeight} variant="body1" mb={8} fontWeight={theme.typography.fontWeightMedium}>{t('21')}</Typography>
      </Box>
    </Slide>
  )
}

export default WithdrawSuccessScreen
