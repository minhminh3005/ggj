import {ReactElement, useMemo} from 'react'
import {css} from '@emotion/react'
import {Header} from './components/Header'
import {NavBar} from '../common/NavBar'
import {nsSideMenuComp, SideMenu} from './components/SideMenu'
import {useTheme} from '@mui/material/styles'
import {HEADER_HEIGHT_LG} from 'components/layouts/const'
import {BodyBase} from '../common/BodyBase'
import {BodyWrapper} from './components/BodyWrapper'
import {useLayoutContext,} from 'contexts/LayoutContext'
import {nsNavBarComp} from 'components/layouts/common/NavBar'
import { useRouter } from 'next/router'
import {nsCommonCategories} from '../../../common/categories'
import {useMediaQuery} from '@mui/material'
import {nsTranInformation} from '../common/Information'

export const nsTranMypageLayout = ['layouts@mypage-layout', nsNavBarComp, nsCommonCategories, nsSideMenuComp, nsTranInformation]

export const route: {favorite: string} = {
  favorite: '/mypage/favorite'
}

export function MypageLayout(props: { children: ReactElement }) {
  const theme = useTheme()
  const { layoutSetting } = useLayoutContext()
  const { backgroundColor } = layoutSetting
  const router = useRouter()
  const {pathname} = router
  const breakPoint = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const isDesktop = useMemo(() => breakPoint, [breakPoint])
  return (
    <div
      css={css`
        height: 100%;
        width: 100%;
        background-color: ${backgroundColor}
      `}
    >
      {/* HEADER */}
      {isDesktop && <Header/>}
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          padding-top: ${pathname == '/mypage' ? '0' : `calc(${HEADER_HEIGHT_LG}px + ${theme.spacing(2)})`};
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            padding-top: ${HEADER_HEIGHT_LG}px;
          }
        `}
      >
        {/* LEFT MENU */}
        <SideMenu/>
        {/* BODY */}

        <BodyWrapper cssStr={css`
          display: none;
          @media (min-width: ${theme.breakpoints.values.lg}px) {
            display: block;
          }
        `}>
          <BodyBase>{props.children}</BodyBase>
        </BodyWrapper>
        {/* NAVIGATION BAR */}
        <NavBar/>
      </div>
    </div>
  )
}
