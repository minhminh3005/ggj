import { ReactNode } from 'react'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { HEADER_HEIGHT_LG } from 'components/layouts/const'
import {LEFT_MENU_WIDTH} from 'components/layouts/mypage/components/SideMenu'

export function TransactionBodyWrapper(props: { children: ReactNode }) {
  const theme = useTheme()
  return (
    <div
      css={css`
        flex-grow: 1;
        margin-left: 0;
        width: 100%;
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          width: calc(100% - ${LEFT_MENU_WIDTH}px);
          max-height: calc(100vh - ${HEADER_HEIGHT_LG}px);
          overflow: auto;
        }
      `}
    >
      {props.children}
    </div>
  )
}
