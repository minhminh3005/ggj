import { ReactNode } from 'react'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { HEADER_HEIGHT_XS, HEADER_HEIGHT_LG } from 'components/layouts/const'
import { Footer } from './components/Footer'
import { BodyWrapper } from './components/BodyWrapper'
import { HeaderDetail } from './components/HeaderDetail'
import { useLayoutContext} from 'contexts/LayoutContext'
import { BodyBase } from '../common/BodyBase'
import { nsFooter } from 'components/layouts/surface/components/Footer'
import {nsTranInformation} from '../common/Information'
import {nsSideMenuComp} from '../mypage/components/SideMenu'

export const nsTranSurfaceDetailLayout = ['layouts@surface-layout', nsFooter, nsTranInformation, nsSideMenuComp]

export function SurfaceDetailLayout(props: { children: ReactNode }) {
  const theme = useTheme()
  const { layoutSetting: {backgroundColor} } = useLayoutContext()
  return <div css={css`
    height: 100%;
    width: 100%;
    background-color:${backgroundColor}
  `}>
    {/* HEADER */}
    <HeaderDetail />
    <div css={css`
      display: flex;
      justify-content: space-between;
      padding-top: ${HEADER_HEIGHT_XS + 8}px;
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        padding-top: ${HEADER_HEIGHT_LG}px;
      }
    `}>
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
