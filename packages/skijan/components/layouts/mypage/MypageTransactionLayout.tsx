import {ReactElement, useMemo} from 'react'
import { css } from '@emotion/react'
import { Header } from './components/Header'
import {NavBar, nsNavBarComp} from '../common/NavBar'
import {nsSideMenuComp, SideMenu} from './components/SideMenu'
import { useTheme } from '@mui/material/styles'
import { HEADER_HEIGHT_LG } from 'components/layouts/const'
import {TransactionBodyWrapper } from './components/TransactionBodyWrapper'
import {
  useLayoutContext,
} from 'contexts/LayoutContext'
import {useMediaQuery} from '@mui/material'
import { TransactionBodyBase } from './components/TransactionBodyBase'
import {nsCommonCategories} from 'common/categories'
import {nsTranInformation} from '../common/Information'

export const nsMypageTransactionLayout = ['layouts@mypage-layout', nsNavBarComp, nsCommonCategories, nsSideMenuComp, nsTranInformation]

export function MypageTransactionLayout(props: { children: ReactElement }) {
  const theme = useTheme()
  const { layoutSetting } = useLayoutContext()
  const { backgroundColor } = layoutSetting
  const breakPoint = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const isDesktop = useMemo(() => breakPoint, [breakPoint])
  return (
    <div
      css={css`
        height: 100%;
        width: 100%;
        background-color:${backgroundColor}
      `}
    >
      {/* HEADER */}
      {isDesktop && <Header/>}
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          padding-top: unset;
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            padding-top: ${HEADER_HEIGHT_LG}px;
          }
        `}
      >
        {/* LEFT MENU */}
        <SideMenu />
        {/* BODY */}
        <TransactionBodyWrapper>
          <TransactionBodyBase>{props.children}</TransactionBodyBase>
        </TransactionBodyWrapper>
        {/* NAVIGATION BAR */}
        <NavBar />
      </div>
    </div>
  )
}
