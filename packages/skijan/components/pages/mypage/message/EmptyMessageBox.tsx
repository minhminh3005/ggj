import { css } from '@emotion/react'
import Image from 'next/image'
import noMessageIllustration from './noMessageIllustration.png'
import { Typography, Stack } from '@mui/material'
import { useTheme } from '@mui/material'

export const EmptyMessageBox = () => {
  const theme = useTheme()
  return (
    <Stack
      direction="column"
      alignItems="center"
      css={css`
        padding-top: 40px;
        height: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
          justify-content: center;
          padding-top: 0;
        }
      `}
    >
      <Image height={160} width={160} src={noMessageIllustration} alt="NoMessage" />
      <Typography
        css={css`
          margin-top: ${theme.spacing(4)};
        `}
        variant="subtitle1"
      >
        メッセージがありません
      </Typography>
      <Typography
        css={css`
          text-align: center;
          margin-top: ${theme.spacing(3)};
          letter-spacing: 0.14px;
        `}
        variant="body1"
      >
        購入前の質問など、
        <br /> 取引前のやり取りはここで行えます。
      </Typography>
    </Stack>
  )
}
