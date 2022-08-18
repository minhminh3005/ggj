import {css} from '@emotion/react'
import {Avatar, Drawer} from '@mui/material'
import {useState} from 'react'
import IconButton from '@mui/material/IconButton'
import {useAppSelector} from 'store/hooks'
import {ns as appSliceNs} from 'store/appSlice'
import {useTheme} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import CloseIcon from '@mui/icons-material/Close'

import dynamic from 'next/dynamic'
const DynamicSideMenu = dynamic(() => import('components/layouts/mypage/components/SideMenu'), { ssr: false })

export default function ProfileMenu() {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  const isDesktop = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const avatar = useAppSelector(state => state[appSliceNs]?.user?.avatar)

  return (
    <>
      <IconButton
        color="inherit"
        size="large"
        css={css`
          color: ${theme.palette.smoke.dark};
          padding: 4px;
        `}
        onClick={() => setOpen(true)}
      >
        <Avatar css={css`background: gray;`} src={avatar} />
      </IconButton>
      <Drawer
        anchor="right"
        open={open && isDesktop}
        onClose={handleClose}
        ModalProps={{
          keepMounted: true, // better performance in mobile device
        }}
      >
        <>
          <div css={css`padding:  ${theme.spacing(3)} ${theme.spacing(3)} 0  ${theme.spacing(3)}; text-align: right`}>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
          <DynamicSideMenu css={css`
          padding-top: ${theme.spacing(3)}!important;
        `}/>
        </>
      </Drawer>
    </>
  )
}
