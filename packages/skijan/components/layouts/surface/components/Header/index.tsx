import {Button, Divider, IconButton, InputAdornment, Stack, TextField, Typography, useMediaQuery,} from '@mui/material'
import {useTranslation} from 'next-i18next'
import {MouseEvent, useEffect, useMemo, useRef, useState} from 'react'
import {styled, useTheme} from '@mui/material/styles'
import {css} from '@emotion/react'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import Fade from '@mui/material/Fade'
import {nsTranSurfaceLayout} from 'components/layouts/surface/SurfaceLayout'
import {useRouter} from 'next/router'
import {buildQueryString} from 'common/utils'
import {allParams, SQ} from 'components/pages/search/consts'
import {genAuthUrl} from 'common/url'
import {useAppSelector} from 'store/hooks'
import {ns} from 'store/appSlice'
import {BellIconComponent} from 'components/layouts/common/Information'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import {GgjDesktopHeader} from '../../../../commons/GgjHeader'

const DynamicProfileMenu = dynamic(() => import('./ProfileMenu'))

export function Header({isDesktop = true} : {isDesktop?: boolean}) {
  return (
    <GgjDesktopHeader>
      <SearchInput/>
      <Stack
        direction="row"
        spacing={2}
      >
        <HelpButton/>
        {isDesktop && <BellIconComponent/>}
        <DynamicHeaderItem/>
      </Stack>
    </GgjDesktopHeader>
  )
}

export const DynamicHeaderItem = () => {
  const theme = useTheme()
  const breakPoint = useMediaQuery(`(max-width:${theme.breakpoints.values.lg}px)`)
  const isMobile = useMemo(() => breakPoint, [breakPoint])
  const [ isLoggedIn ] = useState(useAppSelector(state => !!Object.keys(state[ns].auth).length))
  return <>
    {isLoggedIn
      ? !isMobile && <DynamicProfileMenu />
      : <LoginButtons/>
    }
  </>
}

const CssTextField = styled(TextField)(({theme}) => ({
  width: '100%',
  '& label.Mui-focused': {
    color: 'green',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'green',
  },
  '& .MuiOutlinedInput-root': {
    height: '48px',
    padding: '0 6px',
    '& fieldset': {
      borderRadius: '24px',
      borderColor: theme.palette.smoke.light,
    },
  },
}))

function SearchInput() {
  const {t} = useTranslation(nsTranSurfaceLayout)
  const router = useRouter()
  const [keyword, setKeyword] = useState(router.query ? router.query[SQ] as string : '')
  const theme = useTheme()
  const matches = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)

  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (router.query[SQ]) {
      setKeyword(router.query[SQ] as string)
    }
  }, [router, setKeyword])

  useEffect(() => {
    matches && setKeyword((document.getElementById('ggj-search-mobile') as HTMLInputElement)?.value)
  }, [matches])

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    inputRef.current?.blur()
    if (!keyword?.length) {
      router.push('/search')
      return
    }
    buildQueryString(router, {q: keyword}, allParams, '/search', {shallow: true})
  }
  return <form
    onSubmit={onSubmit}
    action=""
    css={css`
      flex-grow: 1;
      margin: 0 ${theme.spacing(7)} 0 100px;
      display: none;
      position: relative;
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
       display: flex;
       align-items: center;
      }
    `}
  >
    <CssTextField
      placeholder={t('Header-1')}
      size="small"
      id="ggj-search-desktop"
      value={keyword?.length ? keyword : ''}
      inputRef={inputRef}
      autoComplete="off"
      onChange={(e) => setKeyword(e.target.value)}
      inputProps={{
        maxLength: 200
      }}
      InputProps={{
        endAdornment:
          <>
            {keyword &&
              <>
                <InputAdornment position="end">
                  <IconButton
                    color="inherit"
                    aria-label="upload picture"
                    onClick={() => {
                      inputRef.current?.focus()
                      setKeyword('')
                    }}
                    css={css`
                      color: ${theme.palette.smoke.dark};
                    `}
                  >
                    <ClearIcon color="inherit"/>
                  </IconButton>
                </InputAdornment>
                <Divider
                  orientation="vertical"
                  flexItem
                  css={css`
                    margin: ${theme.spacing(2)};
                  `}/>
              </>
            }
            <InputAdornment position="start">
              <IconButton
                color="inherit"
                aria-label="upload picture"
                component="span"
                css={css`color: ${theme.palette.smoke.dark};`}
                onClick={onSubmit}
              >
                <SearchIcon color="inherit"/>
              </IconButton>
            </InputAdornment>
          </>,
      }}
    />
    {/* Not implement in current phrase*/}
    {/*<div css={css`*/}
    {/*  display: ${isActive ? 'block' : 'none'};*/}
    {/*`}>*/}
    {/*  <FloatingSearchHistory/>*/}
    {/*</div>*/}
  </form>
}

// Not implement in current phrase
// function FloatingSearchHistory() {
//   const router = useRouter()
//   return (
//     <Card variant="outlined" css={css`
//       position: absolute;
//       top: 50px;
//       left: 0;
//       padding: 32px;
//       width: 640px;
//       border-radius: 10px;
//     `}>
//       <KeywordsHistory/>
//       <Button onClick={()=>{
//         router.push({
//           pathname: '/search',
//           query: {
//             q: 'Demo'
//           }
//         })
//       }}>Demo</Button>
//     </Card>
//   )
// }

export function LoginButtons() {
  const {t} = useTranslation(nsTranSurfaceLayout)
  const theme = useTheme()
  const router = useRouter()
  const [loginUrl, setLoginUrl] = useState('')
  const [registerUrl, setRegisterUrl] = useState('')
  useEffect(() => {
    setLoginUrl(genAuthUrl(router, 'login'))
    setRegisterUrl(genAuthUrl(router, 'register'))
  }, [router])


  return <>
    {
      !router.pathname.startsWith('/notvalid') && <> <Link href={loginUrl} passHref>
        <Button
          css={css`
        white-space: nowrap;
        display: ${router.route == '/'? 'none' : 'inline-flex'};
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          display: inline-flex;
        }
      `}
          size="large"
          variant="outlined">{t('LoginButtons-1')}</Button>
      </Link>
      <Link href={registerUrl} passHref>
        <Button
          css={css`
        white-space: nowrap;
      `}
          size="large"
          variant="contained">{t('LoginButtons-2')}</Button>
      </Link></>
    }
  </>
}

export function HelpButton() {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const {t} = useTranslation(nsTranSurfaceLayout)
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const customMenuCss = css`
    padding-left: ${theme.spacing(5)};
    padding-right: ${theme.spacing(5)};
  `

  const menuItemArr = [{
    href: '/guide',
    title: t('HelpButton-1')
  }, {
    href: '/faq',
    title: t('HelpButton-2')
  }, {
    href: '/inquiry',
    title: t('HelpButton-3')
  }]

  return <>
    <IconButton
      color="inherit"
      size="large"
      onClick={handleClick}
      css={css`
        color: ${theme.palette.smoke.dark};
        margin-left: auto;
      `}
    >
      <HelpOutlineIcon color="inherit"/>
    </IconButton>
    <Menu
      id="fade-menu"
      MenuListProps={{
        'aria-labelledby': 'fade-button',
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      TransitionComponent={Fade}
    >
      {
        menuItemArr.map((item, idx) => (
          <MenuItem key={`${item.title}${idx}`} css={customMenuCss} onClick={handleClose}>
            <Link href={item.href} passHref>
              <Typography>{item.title}</Typography>
            </Link>
          </MenuItem>
        ))
      }
      {/*<MenuItem component={Link} href={genAuthUrl(null, 'logout')}><Typography>Logout</Typography></MenuItem>*/}
    </Menu>
  </>
}
