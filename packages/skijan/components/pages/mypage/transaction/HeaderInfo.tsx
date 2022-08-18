import GgjMenu from 'components/commons/GgjMenu'
import {memo, ReactNode, useMemo, useRef, useState, useEffect} from 'react'
import {Box, Button, Stack, Typography} from '@mui/material'
import {Check, KeyboardArrowDown} from '@mui/icons-material'
import {css} from '@emotion/react'
import {useTheme} from '@mui/material/styles'
import {useAppDispatch, useAppSelector} from 'store/hooks'
import {
  TRANSACTION_URL,
  TransactionType,
  IMenuListStatus, MENU_TABS
} from 'components/pages/mypage/transaction/const'
import {actions, getMenuChatListByTabAndPaging, ns} from 'store/transactionSlice'
import {useRouter} from 'next/router'
import {useTranslation} from 'next-i18next'

const nsTran = 'mypage@transaction'

export const HeaderInfo = (props: { isDetailPage?: boolean }) => {
  const {isDetailPage} = props
  const theme = useTheme()
  const router = useRouter()
  const MENU_currentMode = useAppSelector(state => state[ns]?.MENU_currentMode)

  const isBuyer = useMemo(() => MENU_currentMode === TransactionType.Buyer, [MENU_currentMode])
  const bgColor = useMemo(() =>
    MENU_currentMode === TransactionType.Buyer
      ? css`background: transparent linear-gradient(129deg, ${theme.palette.ruby.main} 0%, ${theme.palette.secondary.main} 100%) 0 0 no-repeat padding-box;`
      : css`background: transparent linear-gradient(129deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%) 0 0 no-repeat padding-box;`
  , [MENU_currentMode, theme])

  useEffect(() => {
    router.prefetch(TRANSACTION_URL[(isBuyer ? TransactionType.Seller : TransactionType.Buyer) as keyof typeof TRANSACTION_URL])
  }, [])

  return (
    <>
      <Stack
        mb={{lg: 5}}
        pl={{xs: 2, md: 4}}
        pr={{xs: 2, md: 4}}
        pt={{xs: 0, md: 0, lg: 2}}
        pb={{xs: 4, md: 4, lg: 2}}
        direction={{xs: 'column', lg: 'row'}}
        spacing={{xs: 0, lg: 4}}
        alignItems={{xs: 'left', lg: 'center'}}
        justifyContent={{xs: 'end', lg: 'start'}}
        css={css`
          ${bgColor};
          border-radius: 0 0 10px 10px;

          @media (min-width: ${theme.breakpoints.values.lg}px) {
            height: 80px;
            min-height: auto;
            border-radius: 10px;
          }
        `}
      >
        <TransactionMenus ns={ns}/>
        <Stack
          direction="row"
          spacing={3}
          flexWrap="nowrap"
          alignItems="center"
          mb={{xs: 2}}
          css={css`
            height: 100%;
            overflow-y: hidden;
            overflow-x: scroll;
            -ms-overflow-style: none;
            scrollbar-width: none;

            &::-webkit-scrollbar {
              display: none;
            }

            @media (min-width: ${theme.breakpoints.values.md}px) {
              padding-left: ${theme.spacing(3)} !important;
            }
          `}
        >
          <TabButtonList isBuyer={isBuyer} isDetailPage={isDetailPage}/>
        </Stack>
      </Stack>
    </>
  )
}

export const TransactionMenus = ({ns}: { ns: string }) => {
  const {t} = useTranslation(nsTran)
  const [isOpenTransactionMenu, setIsOpenTransactionMenu] = useState<boolean>(false)
  const currentTransactionType = useAppSelector(state => state[ns]?.MENU_currentMode)
  const buttonRef = useRef(null)
  const theme = useTheme()
  const router = useRouter()

  const onChangeTransactionType = (type: string) => {
    if (currentTransactionType == type) return
    router.push(TRANSACTION_URL[type as keyof typeof TRANSACTION_URL])
  }

  const menuData = useMemo(() =>
    Object.values(TransactionType).filter(value => value !== TransactionType.Message).map(value => (
      {
        icon: currentTransactionType === value ? <Check/> : <div></div>,
        title: t(value),
        onClick: () => onChangeTransactionType(value)
      }
    )), [currentTransactionType, onChangeTransactionType]
  )

  return (
    <Box pb={{xs: 1, lg: 3}} css={css`
      padding-top: 10 ${theme.spacing(2)};
      padding-bottom: ${theme.spacing(3)};
      @media (min-width: ${theme.breakpoints.values.lg}px) {
        height: 80px;
        min-height: auto;
        border-radius: 10px;
        padding-top: ${theme.spacing(3)};
      }
    `}>
      <Button
        variant="text"
        ref={buttonRef}
        onClick={() => setIsOpenTransactionMenu(true)}
        endIcon={<KeyboardArrowDown/>}
        css={css`
          color: ${theme.palette.common.white};
        `}
      >
        <MenuTitle>
          {t(currentTransactionType)}
        </MenuTitle>
      </Button>

      <GgjMenu
        data={menuData}
        open={isOpenTransactionMenu}
        anchorEl={buttonRef.current}
        activeIndex={Object.values(TransactionType).indexOf(currentTransactionType) + 1}
        onClose={() => setIsOpenTransactionMenu(false)}
        itemStyles={css`
          text-align: left;
          padding-inline: ${theme.spacing(3)};
        `}
      />
    </Box>
  )
}

const TabButtonList = (props: {isBuyer: boolean, isDetailPage?: boolean}) => {
  const menuTabData = useAppSelector(state => state[ns]?.MENU_listStatus)
  const {isBuyer, isDetailPage} = props
  return (
    <>
      {menuTabData.map((item : IMenuListStatus) =>
        <TabButton
          key={item.statusName}
          isBuyer={isBuyer}
          isDetailPage={isDetailPage}
          {...item}
        />
      )}
    </>
  )
}

const TabButton = memo(function TabButton(props: {
  numberCount: number
  isNewMessage: boolean
  statusName: string
  statusType: number
  isDetailPage?: boolean
  isBuyer: boolean
}) {
  const {statusName, isDetailPage, isBuyer, ...rest} = props
  const theme = useTheme()
  const {t} = useTranslation(nsTran)
  const currentSalesStatus = useAppSelector(state => state[ns]?.MENU_currentTab)
  const currentTabIndex = MENU_TABS.indexOf(statusName)
  const currentTabPaging = useAppSelector(state => state[ns]?.MENU_pageSize?.[currentTabIndex])
  const isLoadingChatroom = useAppSelector(state => state[ns]?.MENU_isLoadingChatroom)
  // const isOpenPopupLeftMenu = useAppSelector(state => state[ns]?.isOpenPopupLeftMenu)
  const dispatch = useAppDispatch()

  const handleClickTab = async() => {
    // if(isDetailPage && isOpenPopupLeftMenu && currentSalesStatus === statusName) return
    // if(!isDetailPage && currentSalesStatus === statusName) return

    // @ts-ignore
    await dispatch(getMenuChatListByTabAndPaging(undefined, statusName, currentTabPaging || 1))
    dispatch(actions.setCurrentTab(statusName))
    if(isDetailPage) {
      dispatch(actions.setIsOpenPopupLeftMenu(true))
    }
    const chatRoomListEle = document.getElementById('chatRoomList')
    if(chatRoomListEle && currentTabPaging !== 1) {
      chatRoomListEle.scrollTop = 16
    }
  }
  return (
    <Button
      variant="text"
      disabled={isLoadingChatroom}
      onKeyPress={(e) => {
        if(e.key == 'Enter') {
          e.preventDefault()
        }
      }}
      onClick={handleClickTab}
      css={css`
        color: ${theme.palette.common.white};
        height: 44px;
        position: relative;
        flex-shrink: 0;
        flex-grow: 0;
        opacity: ${currentSalesStatus === statusName ? '1' : '0.5'};

        &:after {
          content: '';
          display: ${currentSalesStatus === statusName ? 'block' : 'none'};
          height: 1px;
          width: calc(100% - ${theme.spacing(3)});
          margin: 0 auto;
          background: ${theme.palette.common.white};
          border-radius: 2px;
          position: absolute;
          bottom: 1px;
          left: ${theme.spacing(2)};
        }
      `}>
      <TabButtonTitle title={t(statusName)}/>
      <RoomCount isBuyer={isBuyer} {...rest}/>
    </Button>
  )
})

const RoomCount = memo(function RoomCount(props: {
  numberCount?: number
  isNewMessage: boolean
  isBuyer: boolean
}) {
  const theme = useTheme()
  const {numberCount = 0, isNewMessage, isBuyer} = props
  return (
    <span css={css`
      border-radius: 24px;
      font-size: 12px;
      letter-spacing: 0.5px;
      padding: 2px 6px;
      color: ${isBuyer ? theme.palette.secondary.main : theme.palette.primary.main};
      min-width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      background: ${theme.palette.common.white};
      position: relative;
    `}>
      {numberCount}
      {!!isNewMessage && <span css={css`
        position: absolute;
        display: ${isNewMessage ? 'block' : 'none'};
        right: 0;
        top: 0;
        width: ${theme.spacing(2)};
        height: ${theme.spacing(2)};
        border-radius: ${theme.spacing(2)};
        background-color: ${isBuyer ? theme.palette.primary.main : theme.palette.ruby.main};
      `}></span>}
    </span>
  )
})

// Title component
const TabButtonTitle = memo(function TabButtonTitle({title}: { title: string }) {
  const theme = useTheme()
  return (
    <Typography variant="subtitle1" mr={2} css={css` color: ${theme.palette.common.white};`}>{title}</Typography>
  )
})
const MenuTitle = memo(function MenuTitle({children}: { children: ReactNode }) {
  return (
    <Typography variant="h5" flexShrink={0}>
      {children}
    </Typography>
  )
})
