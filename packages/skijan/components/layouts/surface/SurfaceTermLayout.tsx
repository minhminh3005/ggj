import {ReactNode, useMemo} from 'react'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { HEADER_HEIGHT_LG } from 'components/layouts/const'
import { Footer } from './components/Footer'
import { BodyWrapper } from './components/BodyWrapper'
import { HeaderDetail } from './components/HeaderDetail'
import { BodyBase } from '../common/BodyBase'
import { nsFooter } from 'components/layouts/surface/components/Footer'
import {nsTranInformation} from '../common/Information'
import {nsSideMenuComp} from '../mypage/components/SideMenu'
import {nsCommonCategories} from '../../../common/categories'
import {useMediaQuery} from '@mui/material'
import {Header} from './components/Header'
import {SideMenu} from './components/SideMenu'

export const nsTranSurfaceTermLayout = ['layouts@surface-layout', nsTranInformation, nsFooter, nsCommonCategories, nsSideMenuComp]

const TopHeader = () => {
  const theme = useTheme()
  const breakPoint = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const isDesktop = useMemo(() => breakPoint, [breakPoint])
  return <>
    {isDesktop
      ? <Header/>
      :  <HeaderDetail />
    }
  </>
}


export function SurfaceTermLayout(props: { children: ReactNode }) {
  const theme = useTheme()
  return   <div
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
        <BodyBase>
          {props.children}
        </BodyBase>
        {/* FOOTER */}
        <Footer />
      </BodyWrapper>
    </div>
  </div>
}
