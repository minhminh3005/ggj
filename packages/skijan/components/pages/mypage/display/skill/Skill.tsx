import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import {Stack, Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'

import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'

import React, {memo, useMemo, useState} from 'react'
import {css} from '@emotion/react'

import {themeCss} from 'pages/mypage/display/skill'
import {STATUS_MAP} from './skill-common-types'

const nsTran = 'mypage@displayskill'

interface MenuComponentProps {
  open: boolean
  anchorEl: null | HTMLElement
  handleClose: () => void
  saleId: number
  statusType: number
}

interface ItemComponentProps {
  index: number;
  values: ActionProps
  handleClose: () => void
}

interface ActionProps {
  title: string
  status?: boolean
  id: number
  icon?: JSX.Element
}

const ItemComponent: React.FC<ItemComponentProps> = ({
  index,
  values,
  handleClose,
}) => {
  return (
    <MenuItem
      onClick={handleClose}
      className="item"
      key={index}
      css={css`
        width: 200px;
        background-color: ${themeCss.color.white} !important;
      `}
    >
      <Stack justifyContent="flex-start" alignItems="center" direction="row">
        {(values?.icon || '')}
        <Typography className="title" variant="subtitle1">{values?.title || ''}</Typography>
      </Stack>
    </MenuItem>
  )
}

function useCalcActionFollowingStatus(saleId: number, statusType: STATUS_MAP, handleClose: () => void) {
  const {t} = useTranslation(nsTran)
  const router = useRouter()
  type TSaleAction = {
    title: string,
    id: number,
    status: boolean,
    icon: JSX.Element,
    handleClick: () => void
  }
  const dataSaleAction = useMemo(() => {
    return {
      edit: {
        title: t('38'),
        id: 1,
        status: false,
        icon: (<EditOutlinedIcon className="icon" css={css` margin-right: 0.75rem;
          font-size: 1.25rem;`}/>),
        handleClick() {
          handleClose()
          router.push(`/mypage/display/skill/edit?id=${saleId}`).then()
        },
      },
      copy: {
        title: t('11'),
        id: 2,
        status: false,
        icon: (<ContentCopyOutlinedIcon className="icon" css={css` margin-right: 0.75rem;
          font-size: 1.25rem;`}/>),
        handleClick() {
          (window as (typeof window & { cloneId: number })).cloneId = saleId
          handleClose()
          router.push('/mypage/display/skill/input').then()
        },
      },
      forward: {
        title: t('12'),
        id: 3,
        status: false,
        icon: (<LaunchOutlinedIcon className="icon" css={css` margin-right: 0.75rem;
          font-size: 1.25rem;`}/>),
        handleClick() {
          handleClose()
          router.push(`/skill/${saleId}`).then()
        },
      },
    } as { [key in ('forward' | 'copy' | 'edit')]: TSaleAction }
  }, [handleClose, router, saleId, t])
  const actionFollowingStatus = useMemo(() => {
    const {edit, copy, forward} = dataSaleAction
    return {
      [STATUS_MAP['draft']]: [edit, copy],
      [STATUS_MAP['sale']]: [edit, copy, forward],
      [STATUS_MAP['pause']]: [edit, copy, forward],
      [STATUS_MAP['close']]: [copy, forward],
    } as { [key in STATUS_MAP]: TSaleAction[] }
  }, [dataSaleAction])
  return actionFollowingStatus[statusType]
}

const MenuComponent: React.FC<MenuComponentProps> = ({
  anchorEl,
  open,
  handleClose,
  saleId,
  statusType,
}) => {
  const actions = useCalcActionFollowingStatus(saleId, statusType, handleClose)
  const menuComponentCss = css`
    width: 100%;
    margin-top: 8px;
    .item:hover {
      background-color: ${themeCss.color.grey} !important;

      .title {
        color: ${themeCss.color.blue} !important;
      }

      .icon {
        color: ${themeCss.color.blue} !important;
      }
    }`
  return (
    <Menu
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right'}}
      css={menuComponentCss}
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{'aria-labelledby': 'basic-button'}}>
      {
        actions && actions.length > 0 && actions.map((values, index) => (
          <ItemComponent
            key={index}
            index={values?.id}
            values={values}
            handleClose={values.handleClick}/>
        ))
      }
    </Menu>
  )
}
const ActionComponent = (props: { saleId: number, statusType: number }) => {
  const theme = useTheme()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [saveBackgroundAction, setSaveBackgroundAction] = useState<number>(-1)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
    setSaveBackgroundAction(props.saleId)
  }
  const handleClose = (): void => {
    setAnchorEl(null)
    setSaveBackgroundAction(-1)
  }
  return (
    <>
      <div
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        css={css`
          display: flex;
          cursor: pointer;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          flex: 0 0 40px;
          background-color: ${saveBackgroundAction === props.saleId ? themeCss.color.black : ''};
          border-radius: 50%;
          @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
            margin-left: 24px;
          }
        `}
      >
        <MoreHorizIcon/>
      </div>
      <MenuComponent
        open={open}
        anchorEl={anchorEl}
        saleId={props.saleId}
        statusType={props.statusType}
        handleClose={handleClose}/>
    </>
  )
}
export const ActionComponentHOC = memo(ActionComponent)
