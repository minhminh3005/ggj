import {MypageTransactionLayout,  nsMypageTransactionLayout} from 'components/layouts'
import {ggjServerSideTranslations} from 'common/i18nUtils'
import {NextRequest} from 'next/server'
import {useTranslation} from 'next-i18next'
import {reducerManager} from 'store/store'
import slice, {actions, getTabMenuData, getTabMenuDataLoop, ns} from 'store/transactionSlice'
import {useEffect, useMemo} from 'react'
import {NoSsr, Stack, useMediaQuery, useTheme} from '@mui/material'
import {
  addEventVisibilityChangeListener,
  removeEventVisibilityChangeListener,
  isDocumentVisible,
  ChatPanel,
  EmptyChat,
  HeaderChatPanelEmpty,
  HeaderInfo,
  LeftMenu,
  nsTransaction,
  TransactionType
} from 'components/pages/mypage/transaction'
import {useLayoutContext} from '../../../contexts/LayoutContext'
import {BeforeTrading} from 'components/pages/mypage/transaction/const'
import {useAppDispatch} from '../../../store/hooks'
import GgjCommonHead from '../../../components/commons/GgjCommonHead'


const WrapperChatPanel = () => {
  const theme = useTheme()
  const breakPoint = useMediaQuery(`(max-width:${theme.breakpoints.values.lg - 1}px)`)
  const isMobileOrTablet = useMemo(() => breakPoint, [breakPoint])
  if (isMobileOrTablet) return <LeftMenu />
  return (
    <>
      <LeftMenu cssStr={`margin-right:${theme.spacing(4)}; height: calc(100vh - 255px);`}/>
      <ChatPanel>
        <HeaderChatPanelEmpty/>
        <EmptyChat/>
      </ChatPanel>
    </>
  )
}

export default function IndexPage({responseTransaction}:{responseTransaction:any}) {
  const {updateLayoutSetting} = useLayoutContext()
  const dispatch = useAppDispatch()
  const {t} = useTranslation(nsTransaction)
  const headData = useMemo(() => ({
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  }), [])

  const initStore = () =>{
    dispatch(actions.resetState())
    dispatch(actions.setMenuListStatus(responseTransaction?.menuStatus))
    dispatch(actions.setMenuListChatroom(responseTransaction?.transactionData?.data))
    dispatch(actions.setMenuChatroomPagingMeta(responseTransaction?.transactionData?.pagingMeta || null))
    dispatch(actions.setCurrentMode(TransactionType.Buyer))
    dispatch(actions.setCurrentTab(BeforeTrading))
    // @ts-ignore
    dispatch(getTabMenuDataLoop())
  }

  useEffect(() => {
    updateLayoutSetting({
      maxWidth: 1560
    })
    reducerManager.add(slice)
    initStore()
    return function () {
      dispatch(actions.clearTabMenuTimeout())
      reducerManager.remove([ns])
    }
  }, [])

  useEffect(() => {
    const handler = function() {
      isDocumentVisible()
        ? dispatch(getTabMenuDataLoop())
        : dispatch(actions.clearTabMenuTimeout())
    }
    addEventVisibilityChangeListener(handler)
    return () => removeEventVisibilityChangeListener(handler)
  }, [])

  return (
    <NoSsr>
      <GgjCommonHead data={headData} />
      <HeaderInfo/>
      <Stack direction={'row'} >
        <WrapperChatPanel/>
      </Stack>
    </NoSsr>
  )
}

IndexPage.Layout = MypageTransactionLayout

export const getServerSideProps =  async ({req}:{req:NextRequest}) => {
  //reducerManager.add(slice)
  const [_nextI18Next, resTabMenu] = await Promise.all([
    ggjServerSideTranslations(req as unknown as NextRequest, [nsTransaction], nsMypageTransactionLayout),
    getTabMenuData(TransactionType.Buyer, BeforeTrading , undefined, req as unknown as NextRequest),
  ])

  if (!Object.keys(resTabMenu.data.data).length || resTabMenu.data.error)
    return {notFound: true}

  const props = {
    props: {
      responseTransaction: resTabMenu.data.data,
      ..._nextI18Next,
    },
  }

  return {...props}
}
