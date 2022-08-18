import {MypageTransactionLayout,  nsMypageTransactionLayout} from 'components/layouts'
import {ggjServerSideTranslations} from 'common/i18nUtils'
import {NextRequest} from 'next/server'
import {reducerManager} from 'store/store'
import slice, {actions, getTabMenuData, getTabMenuDataLoop, ns} from 'store/transactionSlice'
import {useEffect, useMemo} from 'react'
import {NoSsr, Stack, useMediaQuery, useTheme} from '@mui/material'
import {
  addEventVisibilityChangeListener,
  removeEventVisibilityChangeListener,
  isDocumentVisible,
  BeforeTrading,
  ChatPanel,
  EmptyChat,
  HeaderChatPanelEmpty,
  HeaderInfo,
  LeftMenu,
  nsTransaction,
  TransactionType
} from 'components/pages/mypage/transaction'
import {useLayoutContext} from 'contexts/LayoutContext'
import {useAppDispatch} from 'store/hooks'
import { skjMiddleware } from '../../../../common/middleware/SkjMiddleware'
import {useTranslation} from 'next-i18next'
import GgjCommonHead from '../../../../components/commons/GgjCommonHead'

const WrapperChatPanel = () => {
  const theme = useTheme()
  const breakPoint = useMediaQuery(`(max-width:${theme.breakpoints.values.lg - 1}px)`)
  const isMobileOrTablet = useMemo(() => breakPoint, [breakPoint])
  if (isMobileOrTablet) return <LeftMenu/>
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
    dispatch(actions.setCurrentMode(TransactionType.Seller))
    dispatch(actions.setCurrentTab(BeforeTrading))
    // @ts-ignore
    dispatch(getTabMenuDataLoop())
  }

  useEffect(() => {
    reducerManager.add(slice)
    updateLayoutSetting({
      maxWidth: 1560
    })
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

export const getServerSideProps =async ({req, resolvedUrl}:{req:NextRequest, resolvedUrl:string }) => {
  const re = skjMiddleware(req, resolvedUrl)
  if (re !== true) {
    return re
  }
  reducerManager.add(slice)
  const [_nextI18Next, resTabMenu] = await Promise.all([
    ggjServerSideTranslations(req as unknown as NextRequest, [nsTransaction], nsMypageTransactionLayout),
    getTabMenuData(TransactionType.Seller, BeforeTrading, undefined, req as unknown as NextRequest),
  ])

  if (!Object.keys(resTabMenu.data.data).length || resTabMenu.data.error) return {notFound: true}
  //const result = resTabMenu.data.data
  // store.dispatch(actions.setMenuListStatus(result.menuStatus))
  // store.dispatch(actions.setMenuListChatroom(result.transactionData.data))
  // store.dispatch(actions.setMenuChatroomPagingMeta(result?.transactionData?.pagingMeta || null))
  // store.dispatch(actions.setCurrentMode(TransactionType.Seller))
  // store.dispatch(actions.setCurrentTab(BeforeTrading))

  const props = {
    props: {
      responseTransaction: resTabMenu.data.data,
      ..._nextI18Next,
    },
  }

  return {...props}
}
