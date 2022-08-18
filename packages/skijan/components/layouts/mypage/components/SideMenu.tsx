// @mui/material
import {useTheme} from '@mui/material/styles'
import {css} from '@emotion/react'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemButton from '@mui/material/ListItemButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import { useTranslation } from 'next-i18next'
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined'
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined'
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
// import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useState, useMemo, FC } from 'react'
import { SPACING_HEADER, HEADER_HEIGHT_LG } from 'components/layouts/const'
import {useRouter} from 'next/router'
import {useAppSelector} from 'store/hooks'
import {ns} from 'store/appSlice'
import getConfig from 'next/config'
import {FavoriteBorder} from '@mui/icons-material'
import {useEffect} from 'react'
export const LEFT_MENU_WIDTH = 280 // px
interface MenuItem {
  icon: typeof SvgIcon | FC<{ color: SvgIconProps }>,
  title: string,
  url: string
}
interface GroupItem {
  title: string,
  subList: Array<MenuItem>
}
type MenuListInterface = Array<GroupItem>
export const nsSideMenuComp = 'common@side-menu'
// Sheet i18n for the const MenuList:
// https://docs.google.com/spreadsheets/d/1uWAQ34UffWr5QZjFTmSd-7LwB4WK73-0Hwvn5Y0pywc/edit#gid=58752701
const MenuList: MenuListInterface = [
  {
    title: 'MenuList-title-1',
    subList: [
      {
        icon: PostAddOutlinedIcon,
        title: 'MenuList-title-1-1',
        url: '/mypage/display/skill/input'
      },
      {
        icon: DesignServicesOutlinedIcon,
        title: 'MenuList-title-1-2',
        url: '/mypage/display/skill'
      },
      // {
      //   icon: PanToolOutlinedIcon,
      //   title: 'MenuList-title-1-4',
      //   url: ''
      // },
      {
        icon: SavingsOutlinedIcon,
        title: 'MenuList-title-1-3',
        url: '/mypage/sales'
      },
      {
        icon: QuestionAnswerOutlinedIcon,
        title: 'MenuList-title-3-1',
        url: '/mypage/transaction/sell'
      },
    ]
  },
  {
    title: 'MenuList-title-2',
    subList: [
      // {
      //   icon: ZoomInOutlinedIcon,
      //   title: 'MenuList-title-2-1',
      //   url: ''
      // },
      {
        icon: FormatListBulletedOutlinedIcon,
        title: 'MenuList-title-2-2',
        url: '/mypage/transaction/buy'
      },
    ]
  },
  {
    title: 'MenuList-title-6',
    subList: [
      {
        icon: FavoriteBorder,
        title: 'MenuList-title-6-1',
        url: '/mypage/favorite'
      },
      // {
      //   icon: BrowseGalleryOutlined,
      //   title: 'MenuList-title-6-2',
      //   url: '/'
      // },
    ]
  },
  {
    title: 'MenuList-title-4',
    subList: [
      {
        icon: PersonOutlinedIcon,
        title: 'MenuList-title-4-1',
        url: '/mypage/member'
      },
      // {
      //   icon: NotificationsActiveOutlinedIcon,
      //   title: 'MenuList-title-4-2',
      //   url: '/mypage/email'
      // },
    ]
  },
  {
    title: 'MenuList-title-5',
    subList: [
      {
        icon: AutoStoriesOutlinedIcon,
        title: 'MenuList-title-5-1',
        url: '/guide'
      },
      {
        icon: HelpOutlineOutlinedIcon,
        title: 'MenuList-title-5-2',
        url: '/faq'
      },
      {
        icon: MailOutlinedIcon,
        title: 'MenuList-title-5-3',
        url: '/inquiry'
      },
    ]
  },
]
export function SideMenu(props: {className?: string}) {
  const theme = useTheme()
  const router = useRouter()
  const isMypage = router.pathname === '/mypage'
  const list = useMemo(() => MenuList, [])
  const { t } = useTranslation(nsSideMenuComp)
  const userId = useAppSelector(state => state[ns]?.auth?.userId)
  const userName = useAppSelector(state => state[ns]?.auth?.userName) || 'A'
  const avatar = useAppSelector(state => state[ns]?.user?.avatar)
  const {publicRuntimeConfig: {SKJ_HOST_URL}} = getConfig()

  const gotoUserPage = async() => {
    await router.push(`${SKJ_HOST_URL}/users/${userId}`)
  }
  return <div
    css={css`
      height: 100%;
      width: ${isMypage ? '100%' : '0'};
      flex-direction: column;
      padding: ${SPACING_HEADER}px 24px ${theme.spacing(4)} 24px;
      display: ${isMypage ? 'block' : 'none'};
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        width: ${LEFT_MENU_WIDTH}px;
        display: flex;
        flex-direction: column;
        height: calc(100vh - ${HEADER_HEIGHT_LG}px);
      }
    `}
    className={props.className}
  >
    <Stack
      direction="row"
      css={css`
        flex: 0 0 102px; /** specific height **/
      `}
    >
      <Avatar css={css`height: 64px; width: 64px;`} src={avatar} />
      <Stack css={css`width: calc(100% - 72px); margin-left: 12px; cursor: pointer`} onClick={gotoUserPage}>
        <Typography variant="caption" color="inherit" css={css`color: #626262;`}>{t('SideMenu-1', { userId: userId })}</Typography>
        <Typography variant="body1" mb={2} className="ggj-wt"><strong>{decodeURI(userName)}</strong></Typography>
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
          `}
        >
          <Typography
            variant="body2"
            color="inherit"
            css={css`
              color: ${theme.palette.jade.light};
            `}>{t('SideMenu-2')}</Typography>
          <ChevronRightIcon color="inherit"/>
        </div>
      </Stack>
    </Stack>
    <Divider />
    <div
      css={css`
        margin-top: ${theme.spacing(3)};
        padding: 0 0 ${theme.spacing(7)} 0;
        overflow: auto;
        -ms-overflow-style: none;
        ::-webkit-scrollbar {
          display: none;
        }
      `}
    >
      {list.map((group, idx) => (
        <div
          key={idx}
          css={css`
            margin-bottom: ${theme.spacing(3)};
          `}
        >
          <Typography mb={2}><strong>{t(group.title)}</strong></Typography>
          <Stack
            direction="column"
            css={css`
              background: #fff;
              overflow: hidden;
              padding: ${theme.spacing(2)} 0;
              border-radius: 10px;
            `}
            divider={<Divider orientation="horizontal" flexItem css={css`margin: 0 16px;`}/>}
          >
            {group.subList.map((item, idx2) => (
              <MypageMenuItem
                {...item}
                key={`MypageMenuItem-mobile-${idx}-${idx2}`}
              />
            ))}
          </Stack>
        </div>
      ))}
      <Divider css={css`margin: ${theme.spacing(4)} 0`}/>
      <MypageMenuItem
        icon={LogoutIcon}
        title="MenuList-title-logout"
        url="logout"
      />
    </div>
  </div>
}
export default SideMenu
function MypageMenuItem(props: MenuItem & { css?: string}) {
  const theme = useTheme()
  const router = useRouter()
  const [isActive] = useState(false)
  const Icon = props.icon
  const {publicRuntimeConfig: {SKJ_HOST_URL}} = getConfig()
  const { t } = useTranslation(nsSideMenuComp)

  useEffect(() => {
    router.prefetch(`${props.url}`)
  }, [])


  const gotoPage = async() => {
    if(props.url === 'logout') {
      location.href = `${SKJ_HOST_URL}/logout`
      return
    }
    await router.push(`${SKJ_HOST_URL}${props.url}`)
  }

  return (
    <ListItemButton
      disabled={!props.url}
      onClick={gotoPage}
      css={css`
        color: ${theme.palette.jade.light};
        transition: all ${theme.transitions.duration.standard};
        border-radius: 10px;
        &:hover, &.active {
          background: #F1F3FC;
          color: ${theme.palette.primary.main};
          .MuiSvgIcon-root {
            background: #F1F3FC;
            color: ${theme.palette.primary.main};
          }
        }
        ${props.css ?? ''}
      `}
      classes={{ root: isActive ? 'active' : '' }}
    >
      <ListItemIcon
        css={css`
          color: #222222A3;
          min-width: 24px;
          margin-right: 16px;
        `}
      >
        <Icon color="inherit"/>
      </ListItemIcon>
      <ListItemText
        primary={t(props.title)}
        css={css`color: inherit;`}/>
    </ListItemButton>
  )
}

//TODO: Minh - Implement real-time after phase 0
// function MsgIcon(props: SvgIconProps) {
//   const [isNew] = useState(true)
//   const theme = useTheme()
//   return <div css={css`
//     position: relative;
//     height: 24px;
//     width: 24px;
//   `}>
//     {
//       isNew &&
//       <CircleIcon
//         css={css`
//           position: absolute;
//           color: ${theme.palette.error.main}!important;
//           font-size: 10px;
//           transform: translate(-50%, -50%);
//           left: -8px;
//           top: 50%;
//         `}
//         color="inherit"
//       />
//     }
//     <QuestionAnswerOutlinedIcon {...props}/>
//   </div>
// }
