import {useTheme} from '@mui/material/styles'
import {useEffect, useState, MouseEvent, useMemo} from 'react'
import {css} from '@emotion/react'
import {rgba} from 'emotion-rgba'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import SvgIcon from '@mui/material/SvgIcon'
import HomeIcon from '@mui/icons-material/Home'
import SearchIcon from '@mui/icons-material/Search'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ForumIcon from '@mui/icons-material/Forum'
import CloseIcon from '@mui/icons-material/Close'
import {useTranslation} from 'next-i18next'
import {Box, Button, ClickAwayListener, SwipeableDrawer, useMediaQuery} from '@mui/material'
import MobileInputSearch from 'components/pages/search/MobileInputSearch'
import MobileCategories from 'components/pages/search/MobileCategories'
import {useAppSelector} from 'store/hooks'
import {ns} from 'store/appSlice'
import {useRouter} from 'next/router'
import {genAuthUrl} from 'common/url'
import Link, {LinkProps} from 'next/link'
import {GgjTextButton} from '../../commons/GgjButton'
import {UrlObject} from 'url'

export const nsNavBarComp = 'common@nav-bar'

export const NAVBAR_HEIGHT = 56 // px
export function NavBar() {
  const {t} = useTranslation(nsNavBarComp)
  const theme = useTheme()
  const router = useRouter()
  const [loginUrl, setLoginUrl] = useState('')
  useEffect(() => {
    setLoginUrl(genAuthUrl(router, 'login'))
  }, [])
  const [isLoggedIn] = useState(useAppSelector(state => !!Object.keys(state[ns].auth).length))
  return <Stack
    direction="row"
    spacing={2}
    justifyContent="space-around"
    alignItems="center"
    css={css`
      width: 100vw;
      height: ${NAVBAR_HEIGHT}px;
      z-index: ${theme.zIndex.appBar + 1};
      position: fixed;
      bottom: 0;
      left: 0;
      right: auto;
      background: #fff;
      box-shadow: ${theme.shadows[2]};
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        display: none;
      }
    `}
  >
    <NavBarItem Icon={HomeIcon} title={t('NavBar-1')} isActive={router.pathname === '/'} href="/"/>
    <SearchNavBarItem title={t('NavBar-2')} isActive={router.pathname.startsWith('/search')}/>
    {
      isLoggedIn
        ? <>
          <TransactionNavBar/>
          <NavBarItem Icon={AccountCircleIcon} title={t('NavBar-4')} href="/mypage" isActive={router.pathname === '/mypage'} />
        </>
        : <NavBarItem Icon={AccountCircleIcon} title={t('NavBar-5')} href={loginUrl}/>
    }
  </Stack>
}

function SearchNavBarItem(props: { title: string, isActive?: boolean }) {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const matches = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  useEffect(() => {
    matches && toggleDrawer(false)
  }, [matches])
  const toggleDrawer = (status: boolean) => {
    setOpen(status)
  }
  return <>
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div>
        <NavBarItem
          Icon={SearchIcon}
          title={props.title}
          onClick={() => {
            toggleDrawer(!open)
          }}
          isActive={props.isActive}
        />

        <SwipeableDrawer
          ModalProps={{
            keepMounted: true
          }}
          open={open}
          onClose={() => {
            toggleDrawer(false)
          }}
          onOpen={() => {
            toggleDrawer(true)
          }}
          anchor="bottom"
          css={css`
          z-index: ${theme.zIndex.appBar};

          .MuiDrawer-root > .MuiPaper-root {
            top: 0;
          }
        `}
        >
          <MobileInputSearch isCallFromNavbar={true} backBtnClick={() => {
            toggleDrawer(false)
          }}
          />
          <div css={css`
          overflow: auto;
          height: calc(100vh - 126px);
          margin-bottom: 56px;
          -ms-overflow-style: none;

          ::-webkit-scrollbar {
            display: none;
          }
        `}
          >
            {/* Not implement in current phrase*/}
            {/*<KeywordsHistory />*/}
            <MobileCategories/>
          </div>
        </SwipeableDrawer>
      </div>
    </ClickAwayListener>
  </>
}

function TransactionNavBar(props: { isActive?: boolean }) {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const {t} = useTranslation(nsNavBarComp)
  const router = useRouter()
  const matches = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const transactionList = [
    {title: t('seller-box'), url: '/mypage/transaction/sell'},
    {title: t('buyer-box'), url: '/mypage/transaction/buy'},
  ]

  const handleOnClick = (clickedMenu: string, e: MouseEvent<HTMLAnchorElement>) => {
    if(router.pathname === clickedMenu) e.preventDefault()
    setOpen(false)
  }
  const activeMenuStyles = useMemo(() => css`
    background-color: ${rgba(theme.palette.primary.main, 0.05)};
    color: ${theme.palette.primary.main};
    cursor: pointer;
  `, [])

  useEffect(() => {
    matches && setOpen(false)
  }, [matches])

  return <>
    <NavBarItem
      Icon={ForumIcon}
      title={t('NavBar-3')}
      onClick={() => {
        setOpen(!open)
      }}
      isActive={props.isActive}
    />
    <SwipeableDrawer
      ModalProps={{
        keepMounted: true
      }}
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      onOpen={() => {
        setOpen(true)
      }}
      anchor="bottom"
      css={css`
        z-index: ${theme.zIndex.appBar + 1};

        .MuiPaper-root {
          border-radius: 20px 20px 0 0;
        }
      `}
    >
      <Box
        p={3}
        textAlign="center"
      >
        <Typography
          variant="h6"
          component="p"
          fontWeight={theme.typography.fontWeightRegular}
          mb={4}
        >
          {t('transaction')}
        </Typography>
        {transactionList.map(item => (
          <Link href={item.url} key={item.url} passHref>
            <a css={css` text-decoration: none;`} onClick={(e) => handleOnClick(item.url, e)}>
              <GgjTextButton
                fullWidth
                css={css`
                  color: ${theme.palette.jade.dark};
                  justify-content: flex-start;
                  padding-left: ${theme.spacing(3)};
                  ${item.url === router.pathname && activeMenuStyles}
                `}
              >
                {item.title}
              </GgjTextButton>
            </a>
          </Link>
        ))}
        <Button
          variant="contained"
          startIcon={<CloseIcon/>}
          onClick={() => setOpen(false)}
          css={css`
            margin-top: ${theme.spacing(4)};
            border-radius: 22px;
            height: 44px;
            padding: 10px ${theme.spacing(4)};
            background-color: ${theme.palette.jade.light};
            font-weight: ${theme.typography.fontWeightRegular};

            &:hover,
            &:focus {
              color: #ffffff;
              background: ${theme.palette.jade.dark};
            }
          `}
        >
          {t('1')}
        </Button>

      </Box>
    </SwipeableDrawer>
  </>
}

interface INavBarItem extends Omit<LinkProps, 'href'> {
  Icon: typeof SvgIcon,
  title: string,
  onClick?: () => void,
  isActive?: boolean,
  href?: UrlObject | string | null
}


function NavBarItem(props: INavBarItem) {
  const {title, isActive, href} = props
  const theme = useTheme()
  const Icon = props.Icon
  const children = <Stack
    component={Button}
    onClick={props.onClick}
    direction="column"
    justifyContent="center"
    alignItems="center"
    className={isActive ? 'active' : ''}
    css={css`
      color: #222222A3;
      cursor: pointer;
      user-select: none;

      &:hover, &.active {
        color: ${theme.palette.primary.main};

        .MuiTypography-root {
          color: ${theme.palette.primary.main};
        }
      }
    `}
  >
    <Icon fontSize="small"/>
    <Typography variant="caption">{title}</Typography>
  </Stack>
  if (href) return (
    <Link href={href} passHref>
      {children}
    </Link>
  )
  return <>{children}</>
}
