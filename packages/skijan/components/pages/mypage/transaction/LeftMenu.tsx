import {css} from '@emotion/react'
import {Backdrop, Button, Box, Chip, CircularProgress, IconButton, Slide, Stack, useTheme} from '@mui/material'
import {Title} from './Title'
import CloseIcon from '@mui/icons-material/Close'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import {memo, useCallback, useEffect, useRef, useState} from 'react'
import {useAppDispatch, useAppSelector} from '../../../../store/hooks'
import {actions, getMenuChatListByTabAndPaging, ns} from '../../../../store/transactionSlice'
import {ProductItem} from 'components/pages/mypage/transaction/ProductItem'
import {IChatroom, MENU_TABS, nsTransaction} from 'components/pages/mypage/transaction/const'
import {EmptyLeftMenu} from './EmptyLeftMenu'
import {ggjDebounce} from 'common/utils'
import {useTranslation} from 'next-i18next'
import {isInteger} from 'lodash'

interface  LeftMenuProps {
  cssStr?: string
  isPopup?: boolean
}

function Menu({isPopup,cssStr}: LeftMenuProps) {
  const theme = useTheme()
  const {t} = useTranslation(nsTransaction)
  const dispatch = useAppDispatch()
  const onCloseLeftMenu = useCallback(() => {
    dispatch(actions.setIsOpenPopupLeftMenu(false))
    dispatch(actions.resetCurrentTab())
  }, [])
  return <Box css={css`
    width: 320px;
    border-radius: 10px;
    height: inherit;
    border: 1px solid ${theme.palette.smoke.light};
    overflow: hidden;
    ${cssStr};
    @media only screen and (max-width: ${theme.breakpoints.values.lg - 1}px) {
      width: 100%;
      border: none;
      border-radius: unset;
    }
  `}>
    <Stack
      direction={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
      css={css`
        width: 100%;
        height: 56px;
        background-color: ${theme.palette.common.white};
        border-bottom: 1px solid ${theme.palette.smoke.light};
        padding: 0 ${theme.spacing(1)} 0 ${theme.spacing(3)};
        @media only screen and (max-width: ${theme.breakpoints.values.lg - 1}px) {
          display: none;
        }
      `}>
      <Title>{t('56')}</Title>
      {isPopup && <IconButton onClick={onCloseLeftMenu}><CloseIcon/></IconButton>}
    </Stack>
    <Box
      css={css`
        position: relative;
        height: calc(100vh - 128px - 56px);
        @media (min-width: ${theme.breakpoints.values.lg}px) {
          height: calc(100% - 56px);
        }
    `}>
      <GotoPreviousChatRoomBtn />
      <MenuListChatroom />
      <GoToLatestChatroomBtn />
      <LeftMenuBackdropLoading />
    </Box>
  </Box>
}

const MenuListChatroom = memo(function MenuListChatroom() {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const chatRoomListEle = useRef<HTMLDivElement | null>(null)
  const currentTab = useAppSelector(state => state[ns].MENU_currentTab)
  const currentTabIndex = MENU_TABS.indexOf(currentTab)
  const menuListChatroom = useAppSelector(state => state[ns].MENU_listChatroom)
  const currentTabPaging = useAppSelector(state => state[ns].MENU_chatRoomPagingMeta?.page)
  const isHasNextPage = useAppSelector(state => state[ns].MENU_chatRoomPagingMeta?.hasNextPage)
  const isHasPrePage = useAppSelector(state => state[ns].MENU_chatRoomPagingMeta?.hasPreviousPage)
  const chatRoomPageSize = useAppSelector(state => state[ns].MENU_chatRoomPageSize)
  const totalChatRoom = useAppSelector(state => state[ns].MENU_chatRoomPagingMeta?.totalItem)

  const handleScrollListChatroom = useCallback(async () => {
    const chatRoomListEl = chatRoomListEle?.current
    if(!chatRoomListEl) return
    if(chatRoomListEl?.scrollHeight && (chatRoomListEl.scrollHeight > chatRoomListEl.clientHeight)) {
      // handle scroll up
      if(chatRoomListEl?.scrollTop === 0 && isHasPrePage) {
        dispatch(actions.setMenuPageSize({
          index: currentTabIndex,
          value: currentTabPaging - 1
        }))
        // @ts-ignore
        await dispatch(getMenuChatListByTabAndPaging(undefined, undefined, currentTabPaging - 1))
        const bottomPosition = chatRoomListEl.scrollHeight - chatRoomListEl.offsetHeight - 16
        chatRoomListEl.scrollTop = bottomPosition
      }

      // handle scroll down
      const isAtBottomPosition = chatRoomListEl.scrollTop + chatRoomListEl.offsetHeight + 1 >= chatRoomListEl.scrollHeight
      if(isAtBottomPosition && isHasNextPage) {
        dispatch(actions.setMenuPageSize({
          index: currentTabIndex,
          value: currentTabPaging + 1
        }))
        // @ts-ignore
        await dispatch(getMenuChatListByTabAndPaging(undefined, undefined, currentTabPaging + 1))
        chatRoomListEl.scrollTop = 16
      }
    }

  }, [currentTabPaging, isHasPrePage, isHasNextPage, currentTabIndex, chatRoomListEle, chatRoomPageSize])

  const handleCheckChatroomPageSize = useCallback(ggjDebounce(async() => {
    const skillItemEle = document.querySelector('.skill-item') as HTMLElement
    const chatRoomListEl = chatRoomListEle?.current
    if(!chatRoomListEl || menuListChatroom.length === 0 || !skillItemEle || !totalChatRoom)
      return
    const roomHeight = skillItemEle.offsetHeight
    const chatRoomContainerHeight = chatRoomListEl.offsetHeight
    const totalRoomHeight = roomHeight * menuListChatroom.length
    // if has scroll -> return
    if(totalRoomHeight > chatRoomContainerHeight)
      return
    const numberOfMoreItem = (chatRoomContainerHeight - totalRoomHeight)/roomHeight
    const result = isInteger(numberOfMoreItem) ? numberOfMoreItem + 1 : Math.ceil(numberOfMoreItem)
    const pageSize = 10 + result
    if(result >= 1 && pageSize <= totalChatRoom) {
      dispatch(actions.setChatRoomPageSize(pageSize))
      await dispatch(getMenuChatListByTabAndPaging(undefined, undefined, currentTabPaging || 1, pageSize))
    }
  }), [currentTabPaging, totalChatRoom])

  // first mount -> checkChatRoomPageSize
  useEffect(() => {
    (async() => {
      await handleCheckChatroomPageSize()
    })()
  }, [])

  useEffect(() => {
    window.removeEventListener('resize', handleCheckChatroomPageSize)
    window.addEventListener('resize', handleCheckChatroomPageSize)
    return () => {
      window.removeEventListener('resize', handleCheckChatroomPageSize)
    }
  }, [handleCheckChatroomPageSize])

  useEffect(() => {
    if (chatRoomListEle?.current){
      chatRoomListEle.current.onscroll = ggjDebounce(handleScrollListChatroom, 800)
    }
    return () => {
      if (chatRoomListEle.current){
        chatRoomListEle.current.onscroll = null
      }
    }
  }, [handleScrollListChatroom])

  return (
    <Box
      className="ggj-scrollbar"
      id="chatRoomList"
      ref={chatRoomListEle}
      css={css`
        height: 100%;
        overflow-y: auto;
        ${currentTabPaging !== 1 && `& > div:first-of-type { margin-top: ${theme.spacing(3)};}`}
        & > div:last-child {
         margin-bottom: ${theme.spacing(4)};
        }
    `}>
      {
        menuListChatroom.map((item: IChatroom) =>
          <ProductItem
            key={item.transactionId}
            {...item}
          />
        )
      }
      {!menuListChatroom?.length && <EmptyLeftMenu />}
    </Box>
  )
})

const GoToLatestChatroomBtn = memo(function GoToLatestChatroom (){
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const {t} = useTranslation(nsTransaction)
  const currentTab = useAppSelector(state => state[ns].MENU_currentTab)
  const currentTabIndex = MENU_TABS.indexOf(currentTab)
  const currentTabPaging = useAppSelector(state => state[ns].MENU_chatRoomPagingMeta?.page)
  const isHasNewMessage = useAppSelector(state => state[ns].MENU_listStatus?.[currentTabIndex]?.isNewMessage)

  const handleClick = async() => {
    dispatch(actions.setMenuPageSize({
      index: currentTabIndex,
      value: 1
    }))

    // @ts-ignore
    await dispatch(getMenuChatListByTabAndPaging(undefined, undefined, 1))
  }
  return (
    <Slide
      direction="up"
      in={!!(isHasNewMessage && currentTabPaging !== 1)}
    >
      <Box css={css`
        width: 100%;
        position: absolute;
        bottom: ${theme.spacing(3)};
      `}>
        <Chip
          label={t('goto-latest-chatroom')}
          color="primary"
          onClick={handleClick}
          icon={<ArrowUpwardIcon/>}
          css={css`
            position: absolute;
            bottom: ${theme.spacing(3)};
            left: 50%;
            transform: translateX(-50%);
          `}
        />
      </Box>
    </Slide>
  )
})

const GotoPreviousChatRoomBtn = memo(function GotoPreviousChatRoomButton(){
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const {t} = useTranslation(nsTransaction)
  const [isNoScrollable, setIsNoScrollable] = useState(false)
  const currentTab = useAppSelector(state => state[ns].MENU_currentTab)
  const currentTabIndex = MENU_TABS.indexOf(currentTab)
  const currentTabPaging = useAppSelector(state => state[ns].MENU_chatRoomPagingMeta?.page)
  const isHasPre = useAppSelector(state => state[ns].MENU_chatRoomPagingMeta?.hasPreviousPage)

  const handleClick = async() => {
    dispatch(actions.setMenuPageSize({
      index: currentTabIndex,
      value: currentTabPaging - 1
    }))
    // @ts-ignore
    await dispatch(getMenuChatListByTabAndPaging(undefined, undefined, currentTabPaging - 1))
    const chatRoomListEle = document.getElementById('chatRoomList')
    if(chatRoomListEle) {
      chatRoomListEle.scrollTop = (chatRoomListEle?.scrollHeight && chatRoomListEle?.offsetHeight)
        ? chatRoomListEle.scrollHeight - chatRoomListEle.offsetHeight - 16
        : 16
    }
  }

  useEffect(() => {
    const chatRoomListEle = document.getElementById('chatRoomList')
    if(chatRoomListEle) {
      setIsNoScrollable(chatRoomListEle.scrollHeight === chatRoomListEle.clientHeight)
    }
  }, [currentTabPaging, currentTab])

  return (
    <Slide
      direction="down"
      in={Boolean(isHasPre && currentTabPaging !== 1 && isNoScrollable)}
    >
      <Box css={css`
        width: 100%;
        margin-bottom: ${theme.spacing(2)};
        position: ${isHasPre && currentTabPaging !== 1 && isNoScrollable ? 'relative' : 'absolute'};
        top: ${theme.spacing(1)};
      `}>
        <Button
          variant="text"
          color="primary"
          onClick={handleClick}
          css={css`
            font-size: 12px;
            position: relative;
            top: ${theme.spacing(1)};
            left: 50%;
            transform: translateX(-50%);
          `}
        >{t('goto-previous-chatroom')}</Button>
      </Box>
    </Slide>
  )
})

const LeftMenuBackdropLoading = () => {
  const theme = useTheme()
  const isLoadingChatroom = useAppSelector(state => state[ns].MENU_isLoadingChatroom)
  return (
    <Backdrop
      css={css`
        color: ${theme.palette.common.white};
        position: absolute;
        z-index: ${theme.zIndex.modal + 1};
      `}
      open={isLoadingChatroom}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}


Menu.defaultProps = {
  isPopup:false
}

export const LeftMenu = memo(Menu)
