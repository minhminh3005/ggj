import {useTranslation} from 'next-i18next'
import {useTheme} from '@mui/material/styles'
import {MouseEvent, useCallback, useEffect, useMemo, useState} from 'react'
import {css} from '@emotion/react'
import Typography from '@mui/material/Typography'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ListItemText from '@mui/material/ListItemText'
import MuiButton, {ButtonProps} from '@mui/material/Button'
import {FC} from 'react'
import {SaleStatusType, STATUS_MAP_REVERSE} from '../skill-common-types'
import {ModalConfirmChangeStatusNS} from './ModalConfirmChangeStatus'
type TChangeStatusBtnProps = {
  statusTypeInitValue: number
  Button?: FC<ButtonProps>
  ButtonProps?: ButtonProps
  handleSelectItem: (val: SaleStatusType) => void
}
export function ChangeStatusBtn({statusTypeInitValue, Button = MuiButton, ButtonProps = {}, handleSelectItem}: TChangeStatusBtnProps) {
  const { t } = useTranslation(ModalConfirmChangeStatusNS)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = useMemo(() => Boolean(anchorEl), [anchorEl])
  const handleClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleClose = useCallback(() => setAnchorEl(null), [setAnchorEl])
  const onSelectItem = (val: SaleStatusType) => {
    if(val !== STATUS_MAP_REVERSE[statusTypeInitValue]) {
      handleSelectItem(val)
    }
    handleClose()
  }
  const listMenuItem = useMemo(() => calcListMenuItem(STATUS_MAP_REVERSE[statusTypeInitValue]), [statusTypeInitValue])
  useEffect(() => {
    if(open) {
      window.addEventListener('resize', handleClose)
    } else {
      window.removeEventListener('resize', handleClose)
    }
    return () => window.removeEventListener('resize', handleClose)
  }, [setAnchorEl, open, handleClose])

  if(!listMenuItem.length) return <></>
  return (
    <>
      <Button
        {...ButtonProps}
        onClick={handleClick}
      >
        <Typography css={css`display: flex;
          align-items: center;`}>{t(STATUS_MAP_REVERSE[statusTypeInitValue])}<KeyboardArrowDownRoundedIcon/></Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {listMenuItem.map(item => (
          <ChangeStatusMenuItem
            key={`${ChangeStatusMenuItem}-${item}`}
            currentStatus={STATUS_MAP_REVERSE[statusTypeInitValue]}
            handleSelectItem={() => onSelectItem(item)}
            text={t(item)}
            value={item}
          />
        ))}
      </Menu>
    </>
  )
}
function ChangeStatusMenuItem({handleSelectItem, currentStatus, text, value}: {handleSelectItem?: ()=>void, currentStatus: string, text: string, value: SaleStatusType}) {
  const theme = useTheme()
  return (
    <MenuItem
      onClick={() => handleSelectItem && handleSelectItem()}
      selected={currentStatus === value}
      css={css`
        .MuiListItemIcon-root {
          color: ${theme.palette.primary.main};
          display: flex;
          justify-content: center;
          min-width: 20px;
          margin-right: 4px;
        }
        &.Mui-selected {
          background: #f1f3fc;
          color: ${theme.palette.primary.main};
          .MuiListItemIcon-root {
            opacity: 1;
          }
          .MuiSvgIcon-root {
            color: ${theme.palette.primary.main};
          }
        }
        &:hover {
          background: transparent;
          opacity: .6;
        }
      `}
    >
      <ListItemIcon css={css`opacity: 0;`}
      >
        <CheckRoundedIcon fontSize="small"/>
      </ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </MenuItem>
  )
}

function calcListMenuItem(currentStatus: SaleStatusType): (SaleStatusType)[] {
  const draft = STATUS_MAP_REVERSE[0] // 'draft'
  const sale  = STATUS_MAP_REVERSE[1] // 'sale'
  const pause = STATUS_MAP_REVERSE[2] // 'pause'
  const close = STATUS_MAP_REVERSE[3] // 'close'

  if(currentStatus === sale) {
    return [sale, draft, pause, close]
  }
  if(currentStatus === pause) {
    return [pause, sale, draft, close]
  }
  return [] // currentStatus === 'close' || currentStatus === 'draft'
}

