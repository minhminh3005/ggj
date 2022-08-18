import {MypageTransactionDetailLayout, nsMypageTransactionDetailLayout} from 'components/layouts'
import {ggjServerSideTranslations} from 'common/i18nUtils'
import {NextRequest} from 'next/server'
import {reducerManager} from 'store/store'
import slice, {
  actions,
  createCloseChatTimeout,
  getChatInfo,
  getNewMessageLoop,
  getNewTransactionByIdLoop,
  getTabMenuDataLoop,
  getTransactionByIdServer,
  markReadMessage,
  ns,
  TransactionDetailProps
} from 'store/transactionSlice'
import {GgjChatImageViewer, ns as nsImageViewer, slice as imageViewerSlice} from 'components/commons/GgjChatImageViewer'
import {useCallback, useEffect, useMemo} from 'react'
import {Box, NoSsr, Slide, Stack, Typography, useMediaQuery, useTheme} from '@mui/material'
import {
  ChatControlPanel,
  ChatPanel,
  checkIsValidChatStatus,
  ContentChatPanel,
  HeaderChatPanel,
  HeaderInfo,
  IChatInfo,
  LeftMenu,
  nsTransaction,
  PanelId,
  TransactionDetailsMenu,
  TransactionType,
  addEventVisibilityChangeListener,
  removeEventVisibilityChangeListener,
  isDocumentVisible, SKILL_SALES_STATUS,
} from 'components/pages/mypage/transaction'

import {useLayoutContext} from '../../../contexts/LayoutContext'
import {css} from '@emotion/react'
import {useAppDispatch, useAppSelector} from '../../../store/hooks'
import Fade from '@mui/material/Fade'
import {nsTranUploadFiles} from '../../../components/commons/GgjUploadImagesOrFiles'
import {IMessages} from '../../../components/pages/mypage/transaction'
import {ParsedUrlQuery} from 'querystring'
import {NextParsedUrlQuery} from 'next/dist/server/request-meta'
import {useTranslation} from 'next-i18next'
import GgjCommonHead from '../../../components/commons/GgjCommonHead'

const WrapperLeftMenu = () => {
  const isOpenPopupLeftMenu = useAppSelector((state) => state[ns]?.isOpenPopupLeftMenu)
  const dispatch = useAppDispatch()

  const onClickDocument = useCallback((ev: MouseEvent) => {
    const leftMenuEle = document.getElementById('transactionLeftMenu')
    if (!leftMenuEle) return
    const isClickInsideLeftMenu = leftMenuEle.contains(ev.target as Node)
    if (!isClickInsideLeftMenu) {
      dispatch(actions.setIsOpenPopupLeftMenu(false))
    }
  }, [dispatch])

  useEffect(() => {
    if (document && isOpenPopupLeftMenu) {
      document.addEventListener('click', onClickDocument)
    }
    return () => {
      document.removeEventListener('click', onClickDocument)
    }
  }, [isOpenPopupLeftMenu, onClickDocument])

  if (!isOpenPopupLeftMenu) return null
  return (
    <Fade
      id="transactionLeftMenu"
      in={true}
      timeout={800}
    >
      <Box css={css`
        position: absolute;
        left: 0;
        top: 0;
        width: auto;
        height: 100%;
        box-shadow: 1px 0 12px #00000029;
        border-radius: 10px;
        background: #FFFFFF 0 0 no-repeat padding-box;
      `}>
        <LeftMenu isPopup/>
      </Box>
    </Fade>
  )
}

const WrapperCheckDocumentVisible = ({onGetMessageLoop} : {onGetMessageLoop: (salesStatus: number, closeAt: number) => void}) => {
  const dispatch = useAppDispatch()
  const salesStatus = useAppSelector((state) => state[ns]?.DETAIL_transactionInfo?.salesStatus || SKILL_SALES_STATUS.PROGRESS_STATUS)
  const closeAt = useAppSelector((state) => state[ns]?.DETAIL_transactionInfo?.closeAt || 0)
  useEffect(() => {
    const handler = function() {
      if(isDocumentVisible()) {
        dispatch(getTabMenuDataLoop())
        onGetMessageLoop(salesStatus, closeAt)
      } else {
        dispatch(actions.stopAllTimeout())
        dispatch(actions.clearTabMenuTimeout())
      }
    }
    addEventVisibilityChangeListener(handler)
    return () => removeEventVisibilityChangeListener(handler)
  }, [])
  return (<></>)
}

const WrapperHeaderInfo = () => {
  const theme = useTheme()
  const breakPoint = useMediaQuery(`(max-width:${theme.breakpoints.values.lg - 1}px)`)
  const isMobileOrTablet = useMemo(() => breakPoint, [breakPoint])
  if (isMobileOrTablet) return null
  return <HeaderInfo isDetailPage={true}/>
}

const NewMessageNotification = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isShow = useAppSelector(state => state[ns].isNotifyUnread)
  return (
    <Slide
      direction="up"
      in={isShow}
    >
      <div css={css`
        background-color: transparent;
        position: absolute;
        left: 0;
        bottom: 120px;
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          bottom: 100px;
        }
        display: flex;
        width: 100%;
      `}>
        <Typography
          variant="body1"
          css={css`
            margin: auto;
            padding: 4px 8px;
            border: 1px solid ${theme.palette.divider};
            border-radius: 25px;
            font-size: 14px;
            background-color: ${theme.palette.common.white};

            &:hover {
              cursor: pointer;
            }
          `}
          onClick={() => {
            const panel = document.getElementById(PanelId)
            panel && panel.scrollTo(0, 0)
            // @ts-ignore
            dispatch(markReadMessage())
          }}
        >
          New Message
        </Typography>
      </div>
    </Slide>
  )
}

export default function IndexPage({
  respChatInfo,
  resChatDetail,
  chatRoomId
}: { respChatInfo: any, resChatDetail: any, chatRoomId: string }) {
  const dispatch = useAppDispatch()
  const {t} = useTranslation(nsTransaction)
  const {updateLayoutSetting} = useLayoutContext()
  const headData = useMemo(() => ({
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  }), [])

  const currentUserId = useAppSelector((state) => state['app']?.auth?.userId)
  // const {publicRuntimeConfig} = getConfig()

  const getMessageLoop = (salesStatus: number, closeAt: number) => {
    if (!closeAt) {
      //Note: Thao, use display or hidden control chat panel
      dispatch(actions.setIsChatClose(false))
      //Note: Thao, Status != buyerCancel and sellerCancel
      if (checkIsValidChatStatus(salesStatus)) {
        dispatch(getNewMessageLoop())
        dispatch(getNewTransactionByIdLoop())
      } else {
        dispatch(actions.setIsChatClose(true))
      }
    } else {
      //Note: Thao, have closeAt and closeAt > Date.now
      if (checkIsValidChatStatus(salesStatus, closeAt)) {
        dispatch(getNewMessageLoop())
        //Note: Thao,use create timeout check close At
        dispatch(createCloseChatTimeout(closeAt))
        dispatch(getNewTransactionByIdLoop())
      } else dispatch(actions.setIsChatClose(true))
    }
  }

  const initStore = () => {
    dispatch(actions.resetState())
    const dataDetail = resChatDetail
    const closeAt = dataDetail?.transactionInfo.closeAt
    const salesStatus = dataDetail?.transactionInfo.salesStatus as number
    const currentMode = currentUserId == respChatInfo?.chatInfo?.buyerId ? TransactionType.Buyer : TransactionType.Seller
    dataDetail.isLoad = true
    // set state to store
    dispatch(actions.setMenuListStatus(respChatInfo?.menuStatus || null))
    dispatch(actions.setCurrentMode(currentMode))
    dispatch(actions.setCurrentTab(respChatInfo.chatInfo.statusName))
    dispatch(actions.setChatInfo(respChatInfo.chatInfo as IChatInfo))
    dispatch(actions.setListMessages(respChatInfo.messageData as Array<IMessages>))
    dispatch(actions.setTransactionDetail(dataDetail as TransactionDetailProps))
    dispatch(actions.setNewDetailAttachmentAt(dataDetail.nMsgAttachmentAt as number))
    dispatch(getTabMenuDataLoop())
    getMessageLoop(salesStatus, closeAt)
  }

  useEffect(() => {
    reducerManager.add([slice, imageViewerSlice])
    updateLayoutSetting({
      maxWidth: 1560
    })

    initStore()
    return function () {
      dispatch(actions.stopAllTimeout())
      dispatch(actions.clearTabMenuTimeout())
      dispatch(actions.clearCloseChatTimeout())
      // publicRuntimeConfig.ENV != 'local' && reducerManager.remove([ns, nsImageViewer])
      reducerManager.remove([ns, nsImageViewer])
    }
  }, [chatRoomId])

  return (
    <NoSsr>
      <GgjCommonHead data={headData} />
      <WrapperHeaderInfo/>
      <WrapperCheckDocumentVisible onGetMessageLoop={getMessageLoop}/>
      <Stack direction={'row'} css={css`position: relative;`}>
        <Stack direction={'row'} css={css`overflow: hidden;
          width: 100%`}>
          <ChatPanel>
            <HeaderChatPanel/>
            <ContentChatPanel/>
            <ChatControlPanel/>
            <NewMessageNotification/>
          </ChatPanel>
          <TransactionDetailsMenu/>
        </Stack>
        <WrapperLeftMenu/>
        <GgjChatImageViewer/>
      </Stack>
    </NoSsr>
  )
}

IndexPage.Layout = MypageTransactionDetailLayout

export const getServerSideProps = async ({req, params}: { req: NextRequest, params: ParsedUrlQuery }) => {
  const id = (params as NextParsedUrlQuery).id as string

  // validate params
  if (!params || !params || isNaN(parseInt(id))) return {notFound: true}

  const [_nextI18Next, res, resTransaction] = await Promise.all([
    ggjServerSideTranslations(req as unknown as NextRequest, [nsTransaction, nsTranUploadFiles], nsMypageTransactionDetailLayout),
    getChatInfo(Number(id), req),
    getTransactionByIdServer(Number(id), req)
  ])
  if (res.data.error || resTransaction.data.error) return {notFound: true}

  const props = {
    props: {
      chatRoomId: id,
      respChatInfo: res?.data?.data,
      resChatDetail: resTransaction?.data?.data,
      ..._nextI18Next,
    },
  }
  return {...props}
}

