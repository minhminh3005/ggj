import {ReactElement} from 'react'
import {css} from '@emotion/react'
import {Header} from './components/Header'
import {NavBar} from '../common/NavBar'
import {Footer} from './components/Footer'
import {useTheme} from '@mui/material/styles'
import {SPACING_HEADER, HEADER_HEIGHT_LG} from 'components/layouts/const'
import MobileInputSearch from 'components/pages/search/MobileInputSearch'
import MobileFilterBar from 'components/pages/search/MobileFilterBar'
import Filter from 'components/pages/search/Filter'
import SortMenu from 'components/pages/search/SortMenu'
import {useRouter} from 'next/router'
import { Typography } from '@mui/material'
import FilterButton from '../../pages/search/FilterButton'
import HideOnScroll from '../common/HideOnScroll'
import {useTranslation} from 'next-i18next'
import {nsNavBarComp} from 'components/layouts/common/NavBar'
import {nsFooter} from 'components/layouts/surface/components/Footer'
import {nsCommonCategories} from 'common/categories'
import {nsSideMenuComp} from 'components/layouts/mypage/components/SideMenu'
import {nsTranInformation} from '../common/Information'

export const nsTranSurfaceSearchLayout = ['layouts@surface-layout', nsNavBarComp, nsFooter, nsCommonCategories, nsSideMenuComp, nsTranInformation]

function GetStyles(layout: string) {
  const theme = useTheme()
  const desktop = `
    display: none;
    @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
      display: block;
    }
  `
  const mobile = `
    @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
      display: none;
    }
  `
  return layout == 'desktop' ? desktop : mobile
}

const SearchHeader = () => {
  const router = useRouter()
  const theme = useTheme()
  const onBackFn = () => {
    return window.history.length > 2 ? router.back() : router.push('/')
  }
  return <>
    <div css={css`${GetStyles('desktop')}`}>
      <Header/>
    </div>
    <div css={css`
      width: 100%;
      position: fixed;
      left: 0;
      top: 0;
      z-index: ${theme.zIndex.appBar};
      ${GetStyles('mobile')}
    `}>
      <MobileInputSearch
        backBtnClick={onBackFn}
      />
      <HideOnScroll>
        <div css={css`
          position: absolute;
          background-color: ${theme.palette.common.white};
          width: 100%;
          z-index: -1;
          box-shadow: rgb(0 0 0 / 20%) 0 5px 5px -3px, rgb(0 0 0 / 14%) 0px 8px 10px 1px, rgb(0 0 0 / 12%) 0px 3px 14px 2px;
        `}>
          <MobileFilterBar>
            <SortMenu />
            <FilterButton />
          </MobileFilterBar>
        </div>
      </HideOnScroll>
    </div>
  </>
}

const StickyFilter = () => {
  const theme = useTheme()
  const { t } = useTranslation(nsTranSurfaceSearchLayout)
  return (
    <div css={css`
      width: 256px;
      position: sticky;
      top: ${HEADER_HEIGHT_LG}px;
      height: calc(100vh - ${HEADER_HEIGHT_LG}px);
      overflow-y: auto;
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        margin-bottom: ${theme.spacing(7)};
      }
      &::-webkit-scrollbar {
        width: 0;
        &-track {
          background: transparent;
        }
        &-thumb {
          background: ${theme.palette.grey[500]};
          &:hover {
            background: ${theme.palette.grey[600]};
          }
        }
      }
      ${GetStyles('desktop')}
    `}>
      <Typography
        variant="h6"
        component="h2"
        css={css`
          padding: 14px ${theme.spacing(3)};
          border-bottom: 1px solid ${theme.palette.smoke.light};
          margin-top: ${SPACING_HEADER}px;
        `}
      >
        {t('filter-tit-1')}
      </Typography>
      <MobileFilterBar />
      <Filter />
    </div>
  )
}

export function SurfaceSearchLayout(props: { children: ReactElement }) {
  const theme = useTheme()
  return (
    <div css={css`
      height: 100%;
      width: 100%;
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        padding-bottom: 0;
      }
    `}>
      {/* HEADER */}
      <SearchHeader/>
      {/* BODY */}
      <div css={css`
        position: relative;
        max-width: 1920px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        padding-top: calc(${HEADER_HEIGHT_LG}px + ${theme.spacing(7)});
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          padding-top: ${HEADER_HEIGHT_LG}px;
          height: 100vh;
          overflow-y: hidden;
        }
      `}>
        {/* LEFT MENU */}
        <StickyFilter/>
        {/* BODY */}
        <div id={'BodyWrapper'} css={css`
          flex: 1;
          overflow-y: auto;
          padding-bottom: 56px;
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            padding-bottom: 0;
          }
        `}>
          <main css={css`
            min-height: 500px;
            margin: 0 ${theme.spacing(3)} ${theme.spacing(5)};
            @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
              margin: 0 40px ${theme.spacing(6)};
            }
            @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
              margin: ${SPACING_HEADER}px 80px ${theme.spacing(7)};
            }
          `}>
            {props.children}
          </main>
          {/* FOOTER */}
          <Footer/>
        </div>
      </div>
      {/* NAVIGATION BAR */}
      <NavBar />

    </div>
  )
}
