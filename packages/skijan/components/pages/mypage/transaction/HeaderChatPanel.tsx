import {css} from '@emotion/react'
import {IconButton, Stack, useMediaQuery, useTheme} from '@mui/material'
import {useRouter} from 'next/router'
import {memo, useCallback, useMemo} from 'react'
import {Title} from './Title'
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone'
import {actions, ns} from 'store/transactionSlice'
import {useAppDispatch, useAppSelector} from '../../../../store/hooks'
import {TRANSACTION_URL} from 'components/pages/mypage/transaction/const'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

const RoomTitle = () => {
  const theme = useTheme()
  const skillTitle = useAppSelector((state) => state[ns]?.DETAIL_skillTitle)

  return <Stack css={css` margin: 0 ${theme.spacing(2)}; `}>
    <Title>{skillTitle}</Title>
  </Stack>
}

export const HeaderChatPanel = memo(function HeaderChatPanel() {
  const theme = useTheme()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const isOpenTransactionDetailsDrawer = useAppSelector((state) => state[ns]?.isOpenTransactionDetailsDrawer)
  const mode = useAppSelector((state) => state[ns]?.MENU_currentMode) as ('se' | 'bu' | 'me')
  const DETAIL_skillTitle =  useAppSelector((state) => state[ns]?.DETAIL_skillTitle)

  const onClick = useCallback(() => {
    dispatch(actions.setIsOpenTransactionDetailsDrawer(true))
  }, [])
  const onBack = () => {
    router.push(TRANSACTION_URL[mode])
  }
  const breakPoint = useMediaQuery(`(max-width:${theme.breakpoints.values.lg - 1}px)`)
  const isMobileOrTablet = useMemo(() => breakPoint, [breakPoint])
  if (isMobileOrTablet) return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
      css={css`
        width: 100%;
        min-height: ${theme.spacing(6)};
        background: ${theme.palette.common.white} 0% 0% no-repeat padding-box;
        box-shadow: 0px 1px 12px #00000014;
        padding: 0 ${theme.spacing(2)};
        text-align: center;
      `}>
      <IconButton onClick={onBack} css={css`{
        color: ${theme.palette.primary.main}
      }`}>
        <ArrowBackIosNewIcon/>
      </IconButton>
      <RoomTitle/>
      <IconButton onClick={onClick}>
        <MenuTwoToneIcon/>
      </IconButton>
    </Stack>
  )

  return <Stack
    direction={'row'}
    alignItems={'center'}
    justifyContent={'space-between'}
    css={css`
      width: 100%;
      min-height: 56px;
      background-color: ${theme.palette.common.white};
      border-bottom: 1px solid ${theme.palette.smoke.light};
      padding: 0 ${theme.spacing(4)};
    `}>
    <Title>{DETAIL_skillTitle}</Title>
    {
      !isOpenTransactionDetailsDrawer &&
      <IconButton onClick={onClick}>
        <MenuTwoToneIcon/>
      </IconButton>
    }
  </Stack>
})
