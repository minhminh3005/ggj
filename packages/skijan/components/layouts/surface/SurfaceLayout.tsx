import {ReactElement, useMemo, useState} from 'react'
import {css} from '@emotion/react'
import {Header, HelpButton, LoginButtons} from './components/Header'
import {NavBar} from '../common/NavBar'
import {Footer} from './components/Footer'
import {SideMenu} from './components/SideMenu'
import {useTheme} from '@mui/material/styles'
import {HEADER_HEIGHT_LG} from 'components/layouts/const'
import {BodyBase} from '../common/BodyBase'
import {BodyWrapper} from './components/BodyWrapper'
import {nsNavBarComp} from 'components/layouts/common/NavBar'
import {nsFooter} from 'components/layouts/surface/components/Footer'
import {nsCommonCategories} from 'common/categories'
import {nsSideMenuComp} from 'components/layouts/mypage/components/SideMenu'
import {BellIconComponent, nsTranInformation} from '../common/Information'
import {AppBar, Stack, Toolbar, useMediaQuery} from '@mui/material'
import HideOnScroll from '../common/HideOnScroll'
import {SkijanLogo} from '../../commons/GgjHeader'
import {useAppSelector} from '../../../store/hooks'
import {ns} from '../../../store/appSlice'

export const nsTranSurfaceLayout = ['layouts@surface-layout', nsNavBarComp, nsTranInformation, nsFooter, nsCommonCategories, nsSideMenuComp]

const TopHeaderMobile = () => {
  const theme = useTheme()
  const mobileBreakPoint = useMediaQuery(`(max-width:${theme.breakpoints.values.lg - 1}px)`)
  const isMobileOrTablet = useMemo(() => mobileBreakPoint, [mobileBreakPoint])
  const [ isLoggedIn ] = useState(useAppSelector(state => !!Object.keys(state[ns].auth).length))
  return (
    <HideOnScroll>
      <AppBar
        color="transparent"
        css={css`
        box-shadow: ${theme.shadows[1]};
        background: ${theme.palette.common.white};
        width: 100%;
      `}
      >
        <Toolbar
          variant="dense"
          css={css`
          justify-content: space-between;
          padding: 0 ${theme.spacing(4)};
          height: ${HEADER_HEIGHT_LG}px;
          width: 100%;
        `}
        >
          <SkijanLogo/>
          <HelpButton/>
          {isMobileOrTablet && <BellIconComponent/>}
          <Stack direction="row" spacing={2}>
            {!isLoggedIn && <LoginButtons/>}
          </Stack>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  )
}



const TopHeader = () => {
  const theme = useTheme()
  // TODO: HUYNH improve useMediaQuery (it always return false at the first time
  const breakPoint = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const isDesktop = useMemo(() => breakPoint, [breakPoint])

  return <>
    {isDesktop ? <Header isDesktop={isDesktop}/> : <TopHeaderMobile/>}
  </>
}

export function SurfaceLayout(props: { children: ReactElement }) {
  const theme = useTheme()
  return (
    <div
      css={css`
        height: 100%;
        width: 100%;
      `}
    >
      {/* HEADER */}
      <TopHeader/>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          padding-top: ${HEADER_HEIGHT_LG}px;
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            padding-top: ${HEADER_HEIGHT_LG}px;
          }
        `}
      >
        {/* LEFT MENU */}
        <SideMenu />
        {/* BODY */}
        <BodyWrapper>
          <BodyBase>{props.children}</BodyBase>
          {/* FOOTER */}
          <Footer />
        </BodyWrapper>
        {/* NAVIGATION BAR */}
        <NavBar />
      </div>
    </div>
  )
}
