import { css } from '@emotion/react'
import Chip from '@mui/material/Chip'
import React from 'react'
import { useTheme } from '@mui/material/styles'

export default function FiterChip({...props}) {
  const theme = useTheme()
  return (
    <Chip
      {...props}
      clickable={true}
      css={css`
        padding: 10px 5px;
        transition: all 0.25s;
        &:not(:last-child) {
          margin-right: ${theme.spacing(2)};
        }
        @media (min-width: ${theme.breakpoints.values.lg}px) {
          margin-bottom: ${theme.spacing(3)};
        }
      `}
      variant="outlined"
    />
  )
}
