import {  ReactElement } from 'react'
import { css } from '@emotion/react'
import { HeaderDetail } from './components/HeaderDetail'
import { useTheme } from '@mui/material/styles'
import { HEADER_HEIGHT_LG } from 'components/layouts/const'
import { BodyBase } from '../common/BodyBase'
import { BodyWrapper } from './components/BodyWrapper'
import {nsTranInformation} from '../common/Information'
import {nsSideMenuComp} from 'components/layouts/mypage/components/SideMenu'

export const nsTranSurfacePaymentsLayout = ['layouts@surface-layout', nsTranInformation, nsSideMenuComp]

export function SurfacePaymentsLayout(props: { children: ReactElement }) {
  const theme = useTheme()
  return <div css={css`
    height: 100%;
    width: 100%;
  `}>
    {/* HEADER */}
    <HeaderDetail />
    <div css={css`
      display: flex;
      justify-content: space-between;
      padding-top: ${HEADER_HEIGHT_LG}px;
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        padding-top: ${HEADER_HEIGHT_LG}px;
      }
    `}>
      {/* BODY */}
      <BodyWrapper>
        <BodyBase>
          {props.children}
        </BodyBase>
      </BodyWrapper>
    </div>
  </div>
}

