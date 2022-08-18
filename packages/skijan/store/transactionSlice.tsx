import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import http, {appendGgjHeader} from 'common/http'
// import {HYDRATE} from 'store/reduxWrapper'
import {
  checkIsValidChatStatus,
  IChatInfo,
  IChatroom,
  IChatRoomPagingMeta, IListOption,
  IMenuListStatus,
  IMessages,
  INITIAL_MENU_LIST_STATUS,
  IPaidOption,
  PanelId,
  SKILL_SALES_STATUS,
  TEXT,
  TimeoutTime,
  TimeoutTransactionLoot,
  TransactionType,
} from '../components/pages/mypage/transaction'
import {NextRequest} from 'next/server'
import {IncomingMessage} from 'http'
import {ReviewObject} from 'components/pages/mypage/transaction/PopupReview'
import {AppThunk} from './store'
import {loadingOffHandler, loadingOnHandler} from 'contexts/LoadingContext'
import {FileTypes} from '../components/pages/mypage/transaction/ChatControlUpload'
import {MENU_TABS} from 'components/pages/mypage/transaction/const'
import axios from 'axios'
import {NextRouter} from 'next/dist/shared/lib/router/router'

// namespace
export const ns = 'transaction'

// state interface
export interface AttachmentProps<T> {
  attachmentId: number
  ext: T
  fileName: T
  fileType: T
  sizeImage: any
  url: T
}

export interface SkillInfo {
  path: string
  price: number
  skillId: number
  sellerId: number
  payAt: number
  imageUrl?: string
  saleId?: number
  developerTimeLimit: number
}

export interface TransactionInfo {
  completeAt?: number
  payAt: number
  reviewAt?: number
  salesStatus: number
  cancelAt?: number,
  closeAt?: number
}

export interface ReviewDetailsProps {
  rating: number
  reviewRequirementsId: number
  reviewRequirementsName: string
}

export interface UsersReviewProps {
  avgReviewStars: number
  comment: string
  reviewAt: number
  userId: number
  isAdminCancel: number
  reviewDetail: ReviewDetailsProps[]
}

export interface ReviewInfoProps {
  buyerReview: UsersReviewProps | null
  sellerReview: UsersReviewProps | null
}

export interface IImageSize {
  width?: number,
  height?: number
}

interface State {
  isOpenTransactionDetailsDrawer: boolean,
  isOpenPopupLeftMenu: boolean,
  isOpenPopupCancelTransaction: boolean,
  viewingImages: string[],
  firstViewingImageIndex: number
  newMessageTimeout: number | null,
  transactionDetailTimeout: number | null
  tabMenuTimeout: number | null
  isLoading?: boolean
  isLoadingMess?: boolean
  isNotifyUnread: boolean
  isChatClose?: boolean
  closeChatTimeout: number | null

  // Page header for manage tab and list rooms
  MENU_currentTab: string
  MENU_currentMode: string // 'bu' | 'se'
  MENU_pageSize: Array<number>
  MENU_listStatus: Array<IMenuListStatus> | null
  MENU_listChatroom: Array<IChatroom> | null
  MENU_chatRoomPagingMeta: IChatRoomPagingMeta | null
  MENU_isLoadingChatroom: boolean
  MENU_chatRoomPageSize: number | null
  // Common info for chat
  CHATINFO_info: IChatInfo | null // -> menu_currentTab
  // Manage list message render in chat content
  CHATCONTENT_listMessages: Array<IMessages>
  CHATCONTENT_oldMessageId: number
  CHATCONTENT_newMessageId: number
  // All detail info of chat
  DETAIL_intervalData: number | null,
  DETAIL_nMsgAttachmentAt: number,
  DETAIL_transactionInfo: TransactionInfo | null
  DETAIL_listFiles: Array<AttachmentProps<string>>
  DETAIL_skillInfo?: SkillInfo | null,
  DETAIL_skillTitle?: string | null,
  DETAIL_sellerNickName?: string | null,
  DETAIL_buyerNickName?: string | null,
  DETAIL_paidOptions: IPaidOption | null,
  DETAIL_reviewBySeller?: UsersReviewProps | null
  DETAIL_reviewByBuyer?: UsersReviewProps | null,
  DETAIL_isShowPopupReview?: boolean | null,
  DETAIL_isShowPopupConfirm?: boolean | null,
  listReview: ListReviewProps<number>[]
}

export interface ListReviewProps<T> {
  id: T
  targetType: T
  priority: T
  name: string
  rating: T
}

export interface ReviewInfoProps {
  buyerReview: UsersReviewProps | null
  sellerReview: UsersReviewProps | null
}

export interface TransactionDetailProps {
  intervalData: number
  nMsgAttachmentAt: number
  attachment: Array<AttachmentProps<string>>
  reviewInfo: ReviewInfoProps
  title: string
  sellerNickName: string
  buyerNickName: string
  transactionInfo: TransactionInfo | null

  // for paid options
  paidOptions?: Array<IListOption>
  totalPrice?: number

  // for checking is calling from serverside
  isLoad?: boolean
}

// initial state
const initialState: State = {
  listReview: [],
  isOpenTransactionDetailsDrawer: false,
  isOpenPopupLeftMenu: false,
  isOpenPopupCancelTransaction: false,
  viewingImages: [],
  firstViewingImageIndex: 0,
  newMessageTimeout: null,
  transactionDetailTimeout: null,
  tabMenuTimeout: null,
  isLoading: false,
  isLoadingMess: false,
  isNotifyUnread: false,
  isChatClose: false,
  closeChatTimeout: null,

  MENU_currentTab: 'btr',
  MENU_currentMode: TransactionType.Buyer,
  MENU_pageSize: [1, 1, 1, 1],
  MENU_listStatus: INITIAL_MENU_LIST_STATUS,
  MENU_listChatroom: [],
  MENU_chatRoomPagingMeta: null,
  MENU_isLoadingChatroom: false,
  MENU_chatRoomPageSize: null,

  CHATINFO_info: null,

  CHATCONTENT_listMessages: [],
  CHATCONTENT_newMessageId: 0,
  CHATCONTENT_oldMessageId: 0,

  DETAIL_intervalData: null,
  DETAIL_nMsgAttachmentAt: 0,
  DETAIL_listFiles: [],
  DETAIL_skillInfo: null,
  DETAIL_skillTitle: null,
  DETAIL_sellerNickName: null,
  DETAIL_buyerNickName: null,
  DETAIL_paidOptions: null,
  DETAIL_transactionInfo: null,
  DETAIL_isShowPopupReview: false,
  DETAIL_isShowPopupConfirm: false,
  DETAIL_reviewBySeller: null,
  DETAIL_reviewByBuyer: null,
}

// slice
const slice = createSlice({
  name: ns,
  initialState,
  reducers: {
    setCurrentMode(state, action: PayloadAction<string>) {
      state.MENU_currentMode = action.payload
    },
    setCurrentTab(state, action: PayloadAction<string>) {
      state.MENU_currentTab = action.payload
    },
    setIsShowPopupReview(state, action: PayloadAction<boolean>) {
      state.DETAIL_isShowPopupReview = action.payload
    },
    setIsShowPopupConfirm(state, action: PayloadAction<boolean>) {
      state.DETAIL_isShowPopupConfirm = action.payload
    },
    setReview(state, action: PayloadAction<UsersReviewProps>) {
      if (action.payload) {
        if (state.MENU_currentMode === TransactionType.Seller) {
          state.DETAIL_reviewBySeller = action.payload
        } else {
          state.DETAIL_reviewByBuyer = action.payload
        }
      }
    },
    setIsOpenTransactionDetailsDrawer(state, action: PayloadAction<boolean>) {
      state.isOpenTransactionDetailsDrawer = action.payload
    },
    setIsOpenPopupLeftMenu(state, action: PayloadAction<boolean>) {
      state.isOpenPopupLeftMenu = action.payload
    },
    setChatInfo(state, action: PayloadAction<IChatInfo>) {
      state.CHATINFO_info = action.payload
    },
    setListMessages(state, action: PayloadAction<Array<IMessages>>) {
      state.CHATCONTENT_listMessages = action.payload
    },
    setSaleStatusTransaction(state, action: PayloadAction<{ salesStatus: number, date?: number }>) {
      const {salesStatus, date} = action.payload
      if (salesStatus === SKILL_SALES_STATUS.BUYER_COMPLETE_STATUS) {
        state.DETAIL_transactionInfo = {
          ...state.DETAIL_transactionInfo,
          salesStatus: salesStatus,
          completeAt: date
        } as TransactionInfo
      } else {
        state.DETAIL_transactionInfo = {...state.DETAIL_transactionInfo, salesStatus: salesStatus} as TransactionInfo
      }

    },
    setListReviewTransaction(state, action: PayloadAction<ListReviewProps<number>[]>) {
      state.listReview = action.payload
    },
    setReviewAtTransaction(state, action: PayloadAction<number>) {
      state.DETAIL_transactionInfo = {...state.DETAIL_transactionInfo, reviewAt: action.payload} as TransactionInfo
    },
    // For New messages
    pushHeadListMessages(state, action: PayloadAction<Array<IMessages>>) {
      state.CHATCONTENT_listMessages.splice(0, 0, ...action.payload)
    },
    // For Old messages
    pushBottomListMessages(state, action: PayloadAction<Array<IMessages>>) {
      state.CHATCONTENT_listMessages.push(...action.payload)
    },
    setNewMessageTimeout(state, action: PayloadAction<number | null>) {
      state.newMessageTimeout = action.payload
    },
    clearNewMessageTimeout(state) {
      if (state.newMessageTimeout) {
        clearTimeout(state.newMessageTimeout)
        state.newMessageTimeout = null
      }
    },
    setIsLoadingMess(state, action: PayloadAction<boolean>) {
      state.isLoadingMess = action.payload
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setNewDetailAttachmentAt(state, action: PayloadAction<number>) {
      state.DETAIL_nMsgAttachmentAt = action.payload
    },
    stopAllTimeout(state) {
      state.newMessageTimeout && clearTimeout(state.newMessageTimeout)
      state.transactionDetailTimeout && clearTimeout(state.transactionDetailTimeout)
    },
    clearTabMenuTimeout(state) {
      state.tabMenuTimeout && clearTimeout(state.tabMenuTimeout)
    },
    clearCloseChatTimeout(state) {
      state.closeChatTimeout && clearTimeout(state.closeChatTimeout)
    },
    setTransactionDetailTimeout(state, action: PayloadAction<number | null>) {
      state.transactionDetailTimeout = action.payload
    },
    setTransactionDetailListFile(state, action: PayloadAction<Array<AttachmentProps<string>>>) {
      // state.DETAIL_listFiles.push(...action.payload)
      state.DETAIL_listFiles = action.payload.concat(state.DETAIL_listFiles)
    },
    setTransactionDetail(state, action: PayloadAction<TransactionDetailProps>) {
      const {
        attachment: attachmentPayload,
        reviewInfo: reviewInfoPayload,
        transactionInfo,
        intervalData,
        nMsgAttachmentAt,
        title,
        sellerNickName,
        buyerNickName,
        isLoad,
        paidOptions,
        totalPrice,
      } = action.payload


      state.DETAIL_intervalData = intervalData
      state.DETAIL_nMsgAttachmentAt = nMsgAttachmentAt
      state.DETAIL_skillTitle = title
      state.DETAIL_sellerNickName = sellerNickName
      state.DETAIL_buyerNickName = buyerNickName
      if (paidOptions && paidOptions.length && totalPrice)
        state.DETAIL_paidOptions = {
          total: totalPrice,
          options: paidOptions
        }

      if (transactionInfo) {
        state.DETAIL_transactionInfo = transactionInfo
      }
      const buyerReview = reviewInfoPayload?.buyerReview || {}
      const sellerReview = reviewInfoPayload?.sellerReview || {}
      if (Array.isArray(attachmentPayload) && attachmentPayload.length > 0) {
        if (!isLoad) state.DETAIL_listFiles.push(...attachmentPayload)
        else state.DETAIL_listFiles = attachmentPayload
      }
      if (Object.keys(buyerReview).length > 0) {
        state.DETAIL_reviewByBuyer = buyerReview as UsersReviewProps
      }
      if (Object.keys(sellerReview).length > 0) {
        state.DETAIL_reviewBySeller = sellerReview as UsersReviewProps
      }

    },
    setNotifyUnread(state, action: PayloadAction<boolean>) {
      state.isNotifyUnread = action.payload
    },
    resetCurrentTab(state) {
      state.MENU_currentTab = state.CHATINFO_info?.statusName || state.MENU_currentTab
    },
    setTabMenuTimeout(state, action: PayloadAction<number | null>) {
      state.tabMenuTimeout = action.payload
    },
    setMenuListStatus(state, action: PayloadAction<Array<IMenuListStatus> | null>) {
      state.MENU_listStatus = action.payload
    },
    setMenuListChatroom(state, action: PayloadAction<Array<IChatroom> | null>) {
      state.MENU_listChatroom = action.payload
    },
    setMenuChatroomPagingMeta(state, action: PayloadAction<IChatRoomPagingMeta | null>) {
      state.MENU_chatRoomPagingMeta = action.payload
    },
    setMenuPageSize(state, action: PayloadAction<{ index: number, value: number }>) {
      state.MENU_pageSize[action.payload.index] = action.payload.value
    },
    setMenuIsLoadingChatroom(state, action: PayloadAction<boolean>) {
      state.MENU_isLoadingChatroom = action.payload
    },
    setIsChatClose(state, action: PayloadAction<boolean>) {
      state.isChatClose = action.payload
    },
    setCloseChatTimeout(state, action: PayloadAction<number | null>) {
      state.closeChatTimeout = action.payload
    },
    resetState: () => initialState,
    setChatRoomPageSize(state, action: PayloadAction<number | null>) {
      state.MENU_chatRoomPageSize = action.payload
    }
  },
  // extraReducers: {
  //   [HYDRATE]: (state, action) => {
  //     return {
  //       ...state,
  //       ...action.payload[ns],
  //     }
  //   },
  // },
})
// Call api

/* General: Default get for 4-tabs-menu data
*  Page: /buy, /sell
*  API_Input: NextRequest (for authorize), currentMode, defaultStatus, defaultStatusPage
*  API_Output: { menuStatus: MENU_listStatus, transactionData: {data: MENU_listChatroom, pagingMeta: Paging} }
*  */
export const getTabMenuData = async (
  mode: string,
  statusType: string,
  paging?: number,
  req?: NextRequest | IncomingMessage,
  limit?: number
) => {
  const data = await http.get('/api/skijan/v1/mypage/transaction', {
    headers: req && appendGgjHeader({req}),
    params: {
      m: mode,
      st: statusType,
      page: paging || 1,
      limit: limit || 10
    }
  })
  return data
}

export const getChatRoomList = async (
  mode: string,
  statusType: string,
  paging?: number,
) => {
  const data = await http.get('/api/skijan/v1/mypage/transaction/lists', {
    params: {
      m: mode,
      st: statusType,
      page: paging || 1
    }
  })
  return data
}

/* General: Default get current transaction data
*  Page: /id
*  API_Input: currentTransactionId, NextRequest (for authorize)
*  API_Output: { chatInfo: CHATINFO_info, messageData: CHATCONTENT_listMessages }
*  */
export const getChatInfo = async (transactionId: number, req: NextRequest | IncomingMessage) => {
  const data = await http.get(`/api/skijan/v1/mypage/transaction/${transactionId}`, {
    headers: appendGgjHeader({req}),
  })
  return data
}

export const getTransactionById = async (transactionId: string) => {
  const data = await http.get(`/api/skijan/v1/mypage/transaction/${transactionId}/details`)
  return data
}
export const completeTransactionById = async (transactionId: string) => {
  const data = await http.put(`/api/skijan/v1/mypage/transaction/${transactionId}/complete`)
  return data
}
export const submitReviewTransactionById = async (transactionId: string, objectReviewSubmit: ReviewObject) => {
  const data = await http.post(`/api/skijan/v1/mypage/transaction/${transactionId}/review`, objectReviewSubmit)
  return data
}
export const reviewTransactionById = async (type: number) => {
  const data = await http.get('/api/skijan/v1/mypage/transaction/review-requirements', {
    params: {
      tt: type,
    }
  })
  return data
}

/* General: Get list new message by current newest message id
*  Page: /id
*  API_Input: currentTransactionId, newestMessageId
*  API_Output: { data: CHATCONTENT_listMessages }
*  */
export const getNewMessage = async (transactionId: number, nMsgAt: number) => {
  const data = await http.get(`/api/skijan/v1/mypage/transaction/${transactionId}`, {
    headers: {},
    params: {
      nMsgAt: nMsgAt,
    }
  })
  return data
}

/* General: Get list old message by current oldest message id
*  Page: /id
*  API_Input: currentTransactionId, oldestMessageId
*  API_Output: { data: CHATCONTENT_listMessages }
*  */
export const getOldMessage = async (transactionId: number, oMsgAt: number) => {
  const data = await http.get(`/api/skijan/v1/mypage/transaction/${transactionId}`, {
    headers: {},
    params: {
      oMsgAt: oMsgAt,
    }
  })
  return data
}

/* General: Send text message
*  Page: /id
*  API_Input: currentTransactionId, newestMessageId, messageContent, defaultMessageType
*  API_Output: { data: CHATCONTENT_listMessages }
*  */
export const sendTextMessage = async (transactionId: number, nMsgAt: number, messageContent: string) => {
  const data = await http.post(`/api/skijan/v1/mypage/transaction/${transactionId}`, {
    headers: {},
    content: messageContent,
    contentType: TEXT,
    nMsgAt: nMsgAt,
  })
  return data
}


export const markRead = async (transactionId: number, nMsgId: number) => {
  const data = await http.put(`/api/skijan/v1/mypage/transaction/${transactionId}`, {
    headers: {},
    lastMessageId: nMsgId,
  })
  return data
}

// Other function

export const upLoadFiles =
  (list: Array<FileTypes>,
    router: NextRouter,
    currentUrl: string,
    messageError: string): AppThunk =>
    async (dispatch, getState) => {
      let source = axios.CancelToken.source()
      const onRouteChangeStart = (url: string) => {
        if (url != currentUrl) {
          if (source) {
            if (window.confirm(messageError)) {
              source.cancel()
              // @ts-ignore
              source = null
              return true
            }
            router.events.emit('routeChangeError')
            throw  'avoid redirect url'
          }
        }
        return true
      }

      router.events.on('routeChangeStart', onRouteChangeStart)

      try {
        dispatch(actions.stopAllTimeout())
        const state: State = getState()[ns]
        if (!state) return
        const chatId = state.CHATINFO_info?.id || 0
        const nMsgAt = Array.isArray(state.CHATCONTENT_listMessages) && state.CHATCONTENT_listMessages.length > 0 ? state.CHATCONTENT_listMessages[0].sentAt : 0

        const formData = new FormData()

        const sizes: IImageSize[] = []

        list.forEach((p) => {
          if (p.type.includes('image')) {
            sizes.push({
              width: p.width,
              height: p.height
            })
          } else {
            sizes.push({})
          }
        })

        formData.append('sizes', JSON.stringify(sizes))

        list.forEach((p) => {
          formData.append('file', p)
        })

        // @ts-ignore
        window.CancelToken = source
        const res = await http.post(`/upload/v3/skijan/mypage/transaction/${chatId}`, formData, {
          params: {
            nMsgAt: nMsgAt,
          },
          cancelToken: source.token
        })

        if (res.data.data.length) {
          dispatch(actions.stopAllTimeout())
          const list = res.data.data
          // setNewDetailId
          if(list[0].sentAt) dispatch(actions.setNewDetailAttachmentAt(list[0].sentAt))
          // PUSH list
          const attachments = []
          for (let i = 0; i < list.length; i++) {
            attachments.push(...list[i].attachment)
          }

          dispatch(actions.setTransactionDetailListFile(attachments.reverse()))
          dispatch(actions.pushHeadListMessages(res.data.data as Array<IMessages>))
        }

        dispatch(getNewMessageLoop())
        dispatch(getNewTransactionByIdLoop())

        return res.data.error
      } catch (error) {
        console.log(error)
      } finally {
        // @ts-ignore
        router.events.off('routeChangeStart', onRouteChangeStart)
      }
    }

export const getNewMessageLoop =
  (): AppThunk =>
    async (dispatch, getState) => {
      try {
        const state: State = getState()[ns]
        dispatch(actions.clearNewMessageTimeout())
        const timeoutId = setTimeout(async () => {
          if (!state) return
          const chatId = state.CHATINFO_info?.id || 0
          const nMsgId = Array.isArray(state.CHATCONTENT_listMessages) && state.CHATCONTENT_listMessages.length > 0 ? state.CHATCONTENT_listMessages[0].id : 0
          const nMsgAt = Array.isArray(state.CHATCONTENT_listMessages) && state.CHATCONTENT_listMessages.length > 0 ? state.CHATCONTENT_listMessages[0].sentAt : 0
          const data = await getNewMessage(chatId as number, nMsgAt)
          if (data.data.data.length) {
            clearTimeout(timeoutId)
            dispatch(actions.setNewMessageTimeout(null))
            dispatch(actions.pushHeadListMessages(data.data.data as Array<IMessages>))
            const panel = document.getElementById(PanelId)
            if (panel && panel.scrollTop < -100) {
              dispatch(actions.setNotifyUnread(true))
            } else {
              markRead(chatId, nMsgId)
            }
          }
          const salesStatus = state.DETAIL_transactionInfo?.salesStatus as number
          const closeAt = state.DETAIL_transactionInfo?.closeAt

          if (!data.data.error || !checkIsValidChatStatus(salesStatus, closeAt))
            await dispatch(getNewMessageLoop())

        }, TimeoutTime)
        dispatch(actions.setNewMessageTimeout(timeoutId as unknown as number))
      } catch (error) {
        console.log(error)
      }
    }

export const getOldMessageOnScrollTop =
  (killFn: () => void): AppThunk =>
    async (dispatch, getState) => {
      const {
        isLoading,
        CHATCONTENT_listMessages,
        CHATINFO_info,
      }: State = getState()[ns]

      if (isLoading || !CHATINFO_info) return

      dispatch(actions.setIsLoading(true))
      try {
        const oMsgAt = CHATCONTENT_listMessages[CHATCONTENT_listMessages.length - 1].sentAt
        const data = await getOldMessage(CHATINFO_info.id, oMsgAt)

        // Stop when api return error
        if (data.data.error) {
          if (killFn)
            killEventScrollTop(killFn)
        } else {
          const listMessage = data.data.data as Array<IMessages>
          dispatch(actions.pushBottomListMessages(listMessage))

          // Continue when data still available
          if (listMessage.length == 10)
            dispatch(actions.setIsLoading(false))
          // Stop when no more data available
          else {
            if (killFn)
              killEventScrollTop(killFn)
          }

        }
      } catch (error) {
        console.log(error)
      }
    }

const killEventScrollTop = (killFn: () => void) => {
  const panel = document.getElementById(PanelId)
  if (panel) panel.removeEventListener('scroll', killFn)
}

export const sendNewMessage =
  (content: string): AppThunk =>
    async (dispatch, getState) => {
      const {
        CHATCONTENT_listMessages,
        CHATINFO_info,
      }: State = getState()[ns]
      if (!CHATINFO_info) return
      try {
        dispatch(actions.clearNewMessageTimeout())

        const nMsgAt = CHATCONTENT_listMessages.length ? CHATCONTENT_listMessages[0].sentAt : 0
        const data = await sendTextMessage(CHATINFO_info.id, nMsgAt, content)

        if (data.data.data)
          dispatch(actions.pushHeadListMessages(data.data.data))

        dispatch(getNewMessageLoop())
        return data.data.data ? '' : content
      } catch (error) {
        console.log(error)
        return content
      }
    }

export const getNewTransactionByIdLoop = (): AppThunk =>
  async (dispatch, getState) => {
    try {
      const state: State = getState()[ns]
      const buyerReview = state?.DETAIL_reviewByBuyer || {}
      const sellerReview = state?.DETAIL_reviewBySeller || {}
      if (state?.DETAIL_intervalData !== TimeoutTransactionLoot) return

      const checkObjectReviewInfo: { getNew: number, dontGet: number } = {
        getNew: 1,
        dontGet: 0
      }

      const buyer = Object.keys(buyerReview).length > 0 ? checkObjectReviewInfo.dontGet : checkObjectReviewInfo.getNew
      const seller = Object.keys(sellerReview).length > 0 ? checkObjectReviewInfo.dontGet : checkObjectReviewInfo.getNew
      const timeoutId = setTimeout(async () => {
        const {data} = await getTransactionByIdClient(state?.CHATINFO_info?.id || 0, state?.DETAIL_nMsgAttachmentAt || 0, buyer, seller)
        if (data?.data) {
          clearTimeout(timeoutId)
          dispatch(actions.setTransactionDetail(data?.data))
          const salesStatus = data.data.transactionInfo?.salesStatus
          if (!checkIsValidChatStatus(salesStatus)) {
            dispatch(actions.setIsChatClose(true))
            dispatch(actions.stopAllTimeout())
            dispatch(actions.setCloseChatTimeout(null))
            dispatch(actions.setNewMessageTimeout(null))
            return
          }

          const closeAt = data.data.transactionInfo?.closeAt
          if (closeAt) {
            if (checkIsValidChatStatus(salesStatus, closeAt) && !state.closeChatTimeout) {
              dispatch(actions.setIsChatClose(false))
              dispatch(createCloseChatTimeout(closeAt))
            }
          }
        }
        if (!data.data.error)
          await dispatch(getNewTransactionByIdLoop())
      }, TimeoutTime)
      dispatch(actions.setTransactionDetailTimeout(timeoutId as unknown as number))
    } catch (error) {
      console.log(error)
    }
  }

export const markReadMessage =
  (): AppThunk =>
    async (dispatch, getState) => {
      const {
        CHATCONTENT_listMessages,
        CHATINFO_info,
        isNotifyUnread
      }: State = getState()[ns]

      if (!CHATINFO_info) return
      try {
        if (!isNotifyUnread || !CHATCONTENT_listMessages.length) return

        const nMsgId = CHATCONTENT_listMessages[0].id
        const data = await markRead(CHATINFO_info.id, nMsgId)

        dispatch(actions.setNotifyUnread(false))

        return data.data.error

      } catch (error) {
        console.log(error)
      }
    }

export const getTransactionByIdServer = async (transactionId: number, req: NextRequest | IncomingMessage) => {
  const data = await http.get(`/api/skijan/v1/mypage/transaction/${transactionId}/details`, {
    headers: appendGgjHeader({req}),
  })
  return data
}
export const getTransactionByIdClient = async (transactionId: number, nMsgAttachmentAt: number, rvBu: number, rvSe: number) => {
  const data = await http.get(`/api/skijan/v1/mypage/transaction/${transactionId}/details`, {
    params: {
      nMsgAt: nMsgAttachmentAt,
      rvBu,
      rvSe
    }
  })
  return data
}

// Get loop data for header and listChatroom page = 1
export const getTabMenuDataLoop = (
  tab?: string,
): AppThunk =>
  async (dispatch, getState) => {
    try {
      const state: State = getState()[ns]
      if (!state) return
      state.tabMenuTimeout && await clearTimeout(state.tabMenuTimeout)
      const timeoutId = setTimeout(async () => {
        const menuMode = state.MENU_currentMode
        const menuTab = tab || state.MENU_currentTab
        const totalLimit = state?.MENU_chatRoomPageSize || 10
        const res = await getTabMenuData(menuMode, menuTab, 1, undefined, totalLimit)
        if (!res.data.error) {
          clearTimeout(timeoutId)
          const result = res.data.data
          const menuPageSize = state.MENU_pageSize
          const currentTabIndex = MENU_TABS.indexOf(state.MENU_currentTab)
          dispatch(actions.setMenuListStatus(result?.menuStatus || null))
          if (currentTabIndex >= 0 && menuPageSize[currentTabIndex] === 1) {
            dispatch(actions.setMenuListChatroom(result?.transactionData?.data || []))
          }
          await dispatch(getTabMenuDataLoop())
        }
      }, TimeoutTime)
      dispatch(actions.setTabMenuTimeout(timeoutId as unknown as number))
    } catch (error) {
      console.log(error)
    }
  }

/* General: Get Menu Data base on menuTab, paging.
*  Page: /id, /sell, /buy
*  API_Input: mode ,menuTab, paging
*  API_Output: { data:  }
*  */
export const getMenuChatListByTabAndPaging = (
  mode?: string,
  tab?: string,
  paging?: number,
  limit?: number
): AppThunk =>
  async (dispatch, getState) => {
    try {
      tab ? loadingOnHandler() : dispatch(actions.setMenuIsLoadingChatroom(true))
      const state: State = getState()[ns]
      if (!state) return
      const menuMode = mode || state.MENU_currentMode
      const menuTab = tab || state.MENU_currentTab
      const totalLimit = limit || state?.MENU_chatRoomPageSize || 10
      state.tabMenuTimeout && await clearTimeout(state.tabMenuTimeout)
      const res = await getTabMenuData(menuMode, menuTab, paging, undefined, totalLimit)

      if (!res.data.error) {
        const result = res.data.data
        dispatch(actions.setMenuListStatus(result?.menuStatus || []))
        dispatch(actions.setMenuListChatroom(result?.transactionData.data || []))
        dispatch(actions.setMenuChatroomPagingMeta(result?.transactionData?.pagingMeta || []))
        await dispatch(getTabMenuDataLoop(menuTab))
      }
    } catch (error) {
      console.log(error)
    } finally {
      tab ? loadingOffHandler() : dispatch(actions.setMenuIsLoadingChatroom(false))
    }
  }
const setCloseChat =
  (): AppThunk => (dispatch) => {
    dispatch(actions.setIsChatClose(true))
  }

export const createCloseChatTimeout =
  (closeAt: number): AppThunk => (dispatch) => {
    const remainingTime = closeAt - Date.now()
    const closeAtTimeout = setTimeout(async () => {
      await dispatch(setCloseChat())
      dispatch(actions.stopAllTimeout())
      dispatch(actions.setCloseChatTimeout(null))
      dispatch(actions.setNewMessageTimeout(null))
      dispatch(actions.setTransactionDetailTimeout(null))
    }, remainingTime)
    dispatch(actions.setCloseChatTimeout(closeAtTimeout as unknown as number))
  }

export const {actions} = slice
export default slice
