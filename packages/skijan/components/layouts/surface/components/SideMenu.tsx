import {useTheme} from '@mui/material/styles'
import {css} from '@emotion/react'
import {css as css2} from '@emotion/css'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import SvgIcon from '@mui/material/SvgIcon'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useTranslation } from 'next-i18next'
import {useState, useMemo, useEffect, useCallback,} from 'react'
import { SPACING_HEADER, HEADER_HEIGHT_LG } from 'components/layouts/const'
import {buildQueryString, ggjDebounce} from 'common/utils'
import Fade from '@mui/material/Fade'
import { nsTranSurfaceLayout } from '../SurfaceLayout'
import getCategories, {nsCommonCategories} from 'common/categories'
import {useRouter} from 'next/router'
import {SPC} from 'components/pages/search/consts'

import dynamic from 'next/dynamic'
import {dataExtendId} from '../../../../common/constant'
const DynamicHoverMenu = dynamic(() => import('material-ui-popup-state/HoverMenu'), { ssr: false })
const DynamicMenuItem = dynamic(() => import('@mui/material/MenuItem'), { ssr: false })

export const LEFT_MENU_WIDTH = 280 // px
interface SubMenuItem {
  id: number
  path: string
  name: string
  serviceCategoryLargeId: number
  smallIds: number[] | null
}
interface MenuItem {
  id: number
  icon: typeof SvgIcon | null,
  name: string,
  sub: SubMenuItem[],
}
const MenuList = getCategories(true, true) as unknown as MenuItem[]
export function SideMenu() {
  const theme = useTheme()
  const list = useMemo(() => MenuList, [])
  // const { t } = useTranslation(nsTranSurfaceLayout)
  return <div
    css={css`
      height: 100%;
      width: ${LEFT_MENU_WIDTH}px;
      flex: 0 0 ${LEFT_MENU_WIDTH}px;
      flex-direction: column;
      display: none;
      text-align: center;
      padding: ${SPACING_HEADER}px 24px 0 0;
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        max-height: calc(100vh - ${HEADER_HEIGHT_LG}px);
        overflow: auto;
        display: flex;
      }
    `}
  >
    {/*<Stack direction="row" spacing={2} mb={3} pl={3} pr={3}>*/}
    {/*  <Button*/}
    {/*    variant="contained"*/}
    {/*    css={css`border-radius: 100px;`}*/}
    {/*  >{t('SideBar-1')}</Button>*/}
    {/*  <Button*/}
    {/*    css={css`border-radius: 100px;`}*/}
    {/*    disabled*/}
    {/*  >*/}
    {/*    <div css={css`display: inline-flex;flex-direction: column;`}>*/}
    {/*      <Typography>{t('SideBar-2')}</Typography>*/}
    {/*      <Typography variant="caption">{t('coming-soon')}</Typography>*/}
    {/*    </div>*/}
    {/*  </Button>*/}
    {/*</Stack>*/}
    <List
      css={css`
        padding-top: 0;
        flex-grow: 1;
        overflow: auto;
        -ms-overflow-style: none;
        ::-webkit-scrollbar {
          display: none;
        }
      `}>
      {list.map((item, idx) => (
        <SurfaceMenuItem
          {...item}
          key={`SurfaceMenuItem-${idx}`}
        />
      ))}
      <div css={css`height: 100px`}/>
    </List>
  </div>
}
function SurfaceMenuItem(props: MenuItem) {
  const theme = useTheme()
  const { t } = useTranslation(nsTranSurfaceLayout)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const router = useRouter()
  const debounceSetAnchorEl = ggjDebounce(setAnchorEl, 100)
  const handleClose = useCallback(() => debounceSetAnchorEl(null), [debounceSetAnchorEl])
  const handleOpen = (event: { target: HTMLElement }) => debounceSetAnchorEl(event.target)
  const Icon = props.icon
  const onClickMenu = function(item: SubMenuItem, idx: number) {
    if (item.path) {
      window.open(item.path, '_blank')
      return
    }

    if(idx) {
      buildQueryString(
        router,
        {[SPC]: [item.id].concat(item.smallIds || []).join(',')},
        [],
        '/search',
        {shallow: true}
      )
      return
    }

    const categories = [] as Array<number>
    props.sub.forEach((sub, idx) => {
      if(idx) categories.push(sub.id)
    })

    buildQueryString(
      router,
      {[SPC]: categories.join(',')},
      [],
      '/search',
      {shallow: true}
    )
  }
  useEffect(() => {
    if(open) {
      window.addEventListener('resize', handleClose)
    } else {
      window.removeEventListener('resize', handleClose)
    }
    return () => window.removeEventListener('resize', handleClose)
  }, [setAnchorEl, open, handleClose])
  if(props.sub.length === 0) {
    return <ListItemButton>
      <ListItemIcon css={css`
        color: inherit;
        min-width: 24px;
        margin-right: 16px;
      `}>
        {Icon && <Icon color="inherit"/>}
      </ListItemIcon>
      <ListItemText primary={t(`${props.id}`, {ns: nsCommonCategories})} />
    </ListItemButton>
  }
  return <div
    onMouseEnter={e => handleOpen(e as unknown as { target: HTMLElement })}
    onMouseLeave={handleClose}
  >
    <ListItemButton
      css={css`
        color: ${theme.palette.jade.light};
        border-radius: 5px;
        transition: all ${theme.transitions.duration.standard};
        &:hover, &.active {
          background: #eff1fc;
          color: #5072dd;
        }
      `}
      classes={{ root: open ? 'active' : '' }}
    >
      <ListItemIcon css={css`
        color: inherit;
        min-width: 24px;
        margin-right: 16px;
        ${props.id == dataExtendId && 'align-self: flex-start; margin-top: 3px;'}
      `}>
        {Icon && <Icon color="inherit"/>}
      </ListItemIcon>
      <ListItemText primary={
        <>
          {props.name}
          {props.id == dataExtendId && <>
            <br/>
            <span css={css`
              color: #6d82d3;
              font-size: 12px;
              letter-spacing: initial;
            `}>
              <strong>{t('sub-title-15', {ns: nsCommonCategories})}</strong>
            </span>
          </>}
        </>
      } />
      <ChevronRightIcon color="inherit" css={css`color: ${theme.palette.smoke.dark};`}/>
    </ListItemButton>
    <DynamicHoverMenu
      id="fade-menu"
      MenuListProps={{
        'aria-labelledby': 'fade-button',
      }}
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      TransitionComponent={Fade}
      autoFocus={false}
      anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
      PaperProps={{className: 'ggj-scrollbar'}}
      classes={{
        root: css2`
          .MuiPaper-root {
            width: 256px;
            left: 256px!important;
            .MuiMenuItem-root {
              word-break: break-word;
              white-space: pre-line;
            }
          }
        `,
      }}
    >
      {
        props.sub.map((item, idx) => (
          <DynamicMenuItem
            onClick={() => onClickMenu(item, idx)}
            css={css`
              color: ${theme.palette.jade.light};
              transition: all ${theme.transitions.duration.standard};
              background: #fff;
              &:hover {
                background: #eff1fc;
                color: #5072dd;
              }
            `}
            key={`submenu-item-${idx}`}
          >
            {t(
              t(`mid_${item.id}`),
              {
                ns: nsCommonCategories,
                largeId: t(`${props.id}`, {ns: nsCommonCategories})
              }
            )}
          </DynamicMenuItem>))
      }
    </DynamicHoverMenu>
  </div>
}
