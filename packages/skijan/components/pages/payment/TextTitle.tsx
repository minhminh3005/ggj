import { Typography } from '@mui/material'
import { css } from '@emotion/react'
import { memo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const TextTitle = ({ children }: Props) => {
  return (
    <Typography
      variant="h6"
      css={css`
        line-height: 24px;
        letter-spacing: 0.15px;
        font-weight: 500;
      `}
    >
      {children}
    </Typography>
  )
}
export default memo(TextTitle)
