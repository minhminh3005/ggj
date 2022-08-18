import {css} from '@emotion/react'
import emptyChatPNG from 'components/pages/mypage/transaction/Images/presentSkillIllustration.png'
import {Stack, Typography, useTheme} from '@mui/material'
import {nsTransaction} from './const'
import {useTranslation} from 'next-i18next'

export const EmptyChat = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTransaction)
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={4}
      css={css`
        text-align: center;
        height: 100%;
        background: ${theme.palette.canvas.light};
      `}
    >
      <img
        src={emptyChatPNG.src}
        alt="Empty Chat"
        css={css`
          max-width: 320px;
          width: 50%;
          height: auto;
          margin-top: ${theme.spacing(3)};
        `}
      />
      <Typography variant="h4" fontWeight="medium">{t('53')}</Typography>
      <Typography variant="subtitle1" color="smoke.dark">{t('54')}</Typography>

    </Stack>
  )
}
