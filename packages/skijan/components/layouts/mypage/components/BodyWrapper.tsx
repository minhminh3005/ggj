import { ReactNode } from 'react'
import {css, SerializedStyles} from '@emotion/react'
import { NAVBAR_HEIGHT } from '../../common/NavBar'
import { useTheme } from '@mui/material/styles'
import { SPACING_HEADER, HEADER_HEIGHT_LG } from 'components/layouts/const'
import {useLayoutContext} from '../../../../contexts/LayoutContext'


export function BodyWrapper(props: { children: ReactNode, cssStr?: SerializedStyles}) {
  const theme = useTheme()
  const {layoutSetting} = useLayoutContext()
  const {bodyBackgroundColor} = layoutSetting
  return (
    <div
      id="BodyWrapper"
      css={css`
        background-color: ${bodyBackgroundColor};
        position: relative;
        flex-grow: 1;
        padding-bottom: ${NAVBAR_HEIGHT}px;
        margin-left: 0;
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          padding-top: ${SPACING_HEADER}px;
          padding-bottom: 0;
          max-height: calc(100vh - ${HEADER_HEIGHT_LG}px);
          overflow: auto;
        }
        ${props.cssStr}
      `}
    >
      {props.children}
    </div>
  )
}
