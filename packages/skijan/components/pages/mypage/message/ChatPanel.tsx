import {css} from '@emotion/react'
import {Box, useTheme} from '@mui/material'
import {ReactNode} from 'react'

export const ChatPanel = ({children}: { children: ReactNode }) => {
  const theme = useTheme()
  return <Box css={css`
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    flex-direction: column;
    border: 1px solid ${theme.palette.smoke.light};
    position: fixed;
    @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
      position: relative;
      height: calc(100vh - 255px);
      justify-content: space-between;
      border-radius: 10px;
    }
  `}>
    {children}
  </Box>
}
