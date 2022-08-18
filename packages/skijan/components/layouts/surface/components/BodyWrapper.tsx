import { ReactNode } from 'react'
import { useTheme } from '@mui/material/styles'
import {css, SerializedStyles} from '@emotion/react'
import { SPACING_HEADER, HEADER_HEIGHT_LG } from '../../const'

export function BodyWrapper(props: { children: ReactNode, wCss?: SerializedStyles }) {
  const theme = useTheme()
  return<div
    id="BodyWrapper"
    css={css`
      flex-grow: 1;
      overflow: auto;
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        overflow: auto;
        padding-top: ${SPACING_HEADER}px;
        padding-bottom: 0;
        max-height: calc(100vh - ${HEADER_HEIGHT_LG}px);
      }
      ${props.wCss}
    `}
  >
    {props.children}
  </div>
}
