import {ReactNode, useMemo} from 'react'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { HEADER_HEIGHT_LG } from 'components/layouts/const'
import { TransactionBodyBase } from './components/TransactionBodyBase'
import { TransactionBodyWrapper } from './components/TransactionBodyWrapper'
import {nsSideMenuComp, SideMenu} from './components/SideMenu'
import {
  useLayoutContext,
} from 'contexts/LayoutContext'
import {Header} from './components/Header'
import {useMediaQuery} from '@mui/material'
import {nsTranInformation} from '../common/Information'

export const nsMypageTransactionDetailLayout = ['layouts@mypage-layout', nsSideMenuComp, nsTranInformation]

export function MypageTransactionDetailLayout(props: { children: ReactNode }) {
  const theme = useTheme()
  const { layoutSetting } = useLayoutContext()
  const { backgroundColor } = layoutSetting
  const breakPoint = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const isDesktop = useMemo(() => breakPoint, [breakPoint])
  return <div css={css`
    height: 100%;
    width: 100%;
    background-color:${backgroundColor}
  `}>
    {/* HEADER */}
    {isDesktop && <Header/>}
    <div css={css`
      display: flex;
      justify-content: space-between;
      padding-top: 0;
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        padding-top: ${HEADER_HEIGHT_LG}px;
      }
    `}>
      {/* LEFT MENU */}
      <SideMenu />
      {/* BODY */}
      <TransactionBodyWrapper>
        <TransactionBodyBase>
          {props.children}
        </TransactionBodyBase>
      </TransactionBodyWrapper>
    </div>
  </div>
}
