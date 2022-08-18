import { ReactNode } from 'react'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { HEADER_HEIGHT_XS, HEADER_HEIGHT_LG } from 'components/layouts/const'
import { BodyWrapper } from './components/BodyWrapper'
import {nsSideMenuComp, SideMenu} from './components/SideMenu'
import { HeaderDetail } from './components/HeaderDetail'
import { BodyBase } from '../common/BodyBase'
import {
  useLayoutContext,
} from 'contexts/LayoutContext'
import {nsTranInformation} from '../common/Information'

export const nsTranMypageDetailLayout = ['layouts@mypage-layout', nsSideMenuComp, nsTranInformation]

export function MypageDetailLayout(props: { children: ReactNode }) {
  const theme = useTheme()
  const { layoutSetting } = useLayoutContext()
  const { backgroundColor } = layoutSetting
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
      padding-top: calc(${HEADER_HEIGHT_XS}px + ${theme.spacing(2)});
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        padding-top: ${HEADER_HEIGHT_LG}px;
      }
    `}>
      {/* LEFT MENU */}
      <SideMenu />
      {/* BODY */}
      <BodyWrapper>
        <BodyBase>
          {props.children}
        </BodyBase>
      </BodyWrapper>
    </div>
  </div>
}
