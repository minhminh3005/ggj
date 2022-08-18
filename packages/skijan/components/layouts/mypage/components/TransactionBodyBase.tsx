import {ReactNode} from 'react'
import {useTheme} from '@mui/material/styles'
import {css} from '@emotion/react'
import {useLayoutContext} from 'contexts/LayoutContext'
import {SPACING_HEADER} from '../../const'

export function TransactionBodyBase(props: { children: ReactNode, maxWidth?: number }) {
  const theme = useTheme()
  const {layoutSetting} = useLayoutContext()
  const {maxWidth} = layoutSetting
  const maxWidthBody = typeof (maxWidth) === 'number' ? `${maxWidth}px` : 'unset'
  return (
    <main
      css={css`
        max-width: ${maxWidthBody};
        margin: 0 auto;
        padding: 0;
        // @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
        //   padding: 0 ${theme.spacing(5)};
        // }
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          padding: ${SPACING_HEADER}px ${theme.spacing(4)} 0;
        }
      `}
    >
      {props.children}
    </main>
  )
}
