import {  ReactElement } from 'react'
import {HeaderDetail} from './components/HeaderDetail'
import {css} from '@emotion/react'// mui
import { HEADER_HEIGHT_LG } from 'components/layouts/const'
import { BodyBase } from '../common/BodyBase'
import { BodyWrapper } from './components/BodyWrapper'
import { NavBar } from '../common/NavBar'
import {nsNavBarComp} from 'components/layouts/common/NavBar'
import {nsCommonCategories} from 'common/categories'
import {nsSideMenuComp} from 'components/layouts/mypage/components/SideMenu'
import {nsTranInformation} from '../common/Information'
// import {useAppSelector} from '../../../store/hooks'
// import {ns} from '../../../store/usersSlice'

export const nsTranSurfaceUserLayout = ['layouts@surface-layout', nsNavBarComp, nsCommonCategories, nsSideMenuComp, nsTranInformation]

export function SurfaceUsersLayout(props: { children: ReactElement }) {
  // const settingMode = useAppSelector((state) => state[ns]?.settingMode)
  // HIDE SCROLL OF FULL PAGE WHEN OPEN LEFT SIDE
  // let styleWrapper: SerializedStyles = {name: '', styles: ''}
  // if(settingMode !== 'closed') {
  //   styleWrapper = css`overflow: auto;-ms-overflow-style: none;::-webkit-scrollbar {visibility: hidden;};`
  // }
  // ${styleWrapper}

  return <div css={css`
    height: 100%;
    width: 100%;
    min-height: 100vh;
  `}>
    {/* HEADER */}
    <HeaderDetail />
    <div css={css`
      display: flex;
      justify-content: space-between;
      padding-top: ${HEADER_HEIGHT_LG}px;
      height: 100vh;
    `}>
      {/* BODY */}
      <BodyWrapper >
        <BodyBase>
          {props.children}
        </BodyBase>
      </BodyWrapper>
      {/* NAVIGATION BAR */}
      <NavBar />
    </div>
  </div>
}
