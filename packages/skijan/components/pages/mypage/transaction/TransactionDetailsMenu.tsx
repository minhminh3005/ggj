import {css} from '@emotion/react'
import {Box, Drawer, IconButton, Stack, useMediaQuery, useTheme,} from '@mui/material'
import {memo, ReactNode, useCallback, useMemo} from 'react'
import {useAppDispatch, useAppSelector} from 'store/hooks'
import {actions, ns} from 'store/transactionSlice'
import {Title} from './Title'
import CloseIcon from '@mui/icons-material/Close'
import {ProgressTransaction} from './ProgressTransaction'
import {ProductInfoBox} from './ProductInfoBox'
import {ReviewByBuyer} from './ReviewByBuyer'
import {ReviewBySeller} from './ReviewBySeller'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import {ListFilesHistory} from './ListFilesHistory'
import {PopupCancel} from './PopupCancel'
import {CompleteTransaction} from './CompleteTransaction'
import { PopupReview } from './PopupReview'
import {PopupConfirm} from './PopupConfirm'
import {nsTransaction} from './const'
import {useTranslation} from 'next-i18next'

const DrawerMobile = ({children}: { children: ReactNode }) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const {t} = useTranslation(nsTransaction)
  const isOpen = useAppSelector(
    (state) => state[ns]?.isOpenTransactionDetailsDrawer
  )
  const onClick = useCallback(() => {
    dispatch(actions.setIsOpenTransactionDetailsDrawer(false))
  }, [])
  return (
    <Drawer
      open={isOpen}
      anchor={'right'}
      variant="persistent"
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      css={css`
        .MuiPaper-root {
          width: 100%;
          height: 100%;

          &::-webkit-scrollbar {
            width: 5px;
            cursor: pointer;

            &-track {
              background: #ebebeb;
              border-radius: 4px;
            }

            &-thumb {
              background: #d6d6d6;
              border-radius: 7px;
              cursor: pointer;
            }
          }
        }
      `}
    >
      <Stack
        direction={'row'}
        alignItems={'center'}
        css={css`
          width: 100%;
          min-height: 48px;
          background: #FFFFFF 0% 0% no-repeat padding-box;
          box-shadow: 0px 1px 12px #00000014;
          padding: 0 ${theme.spacing(2)};
        `}>
        <IconButton onClick={onClick} css={css`color: ${theme.palette.primary.main}`}>
          <ArrowBackIosNewIcon/>
        </IconButton>
        <Stack css={css`
          margin: 0 4px;
          flex: 1;
          text-align: center;
          padding-right: 40px;
        `}><Title>{t('77')}</Title></Stack>

      </Stack>
      <Box
        css={css`
          padding: ${theme.spacing(4)} ${theme.spacing(3)};
          align-self: center;
          overflow: auto;
          height: calc(100% - 48px);
        `}
      >
        {children}
      </Box>
    </Drawer>)
}
const MenuContent = () => {
  return (
    <>
      <ProgressTransaction/>
      <CompleteTransaction/>
      <ListFilesHistory/>
      <ProductInfoBox/>
      <ReviewByBuyer/>
      <ReviewBySeller/>
      <PopupCancel/>
      <PopupReview/>
      <PopupConfirm/>
    </>
  )
}

const WrapperMenu = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const {t} = useTranslation(nsTransaction)
  const isOpen = useAppSelector((state) => state[ns]?.isOpenTransactionDetailsDrawer)
  const drawerWidth = 320
  const breakPoint = useMediaQuery(`(max-width:${theme.breakpoints.values.lg - 1}px)`)
  const isMobileOrTablet = useMemo(() => breakPoint, [breakPoint])
  const onClick = useCallback((e: any) => {
    if (!e) return
    dispatch(actions.setIsOpenTransactionDetailsDrawer(false))
  }, [])
  if (isMobileOrTablet)
    return (
      <DrawerMobile>
        <Stack
          css={css`
            max-width: 700px;
            margin: auto;
          `}
          spacing={5}
        >
          <MenuContent/>
        </Stack>
      </DrawerMobile>
    )

  return (
    <Box
      css={css`
        min-width: ${drawerWidth}px;
        max-width: ${drawerWidth}px;
        margin-right: ${isOpen ? 0 : -drawerWidth}px;
        transform: translateX(${isOpen ? '0' : '100%'});
        transition: all 0.3s ease-in-out;
        margin-left: ${isOpen ? theme.spacing(4) : 0};
        height: 100%;
      `}
    >
      <Box
        css={css`
          min-width: ${drawerWidth}px;
          height: inherit;
          border-radius: 10px;
          border: 1px solid ${theme.palette.smoke.light};
          overflow: hidden;
        `}
      >
        <Stack
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          css={css`
            width: 100%;
            height: 56px;
            background-color: #ffffff;
            border-bottom: 1px solid ${theme.palette.smoke.light};
            padding: 0 ${theme.spacing(3)};
          `}
        >
          <Title>{t('77')}</Title>

          <IconButton onClick={onClick}>
            <CloseIcon/>
          </IconButton>
        </Stack>
        <Stack
          direction={'column'}
          css={css`
            padding: ${theme.spacing(4)} ${theme.spacing(3)};
            height: calc(100vh - 313px);
            overflow-y: scroll;
          `}
          className="ggj-scrollbar"
          spacing={5}
        >
          <MenuContent/>
        </Stack>
      </Box>
    </Box>
  )
}

export const TransactionDetailsMenu = memo(function TransactionDetailsMenu() {
  return <WrapperMenu/>
})
