import {theme} from '../../../../theme.config'
import {SkillInfo} from '../../../../store/transactionSlice'

export const nsTransaction = 'mypage@transaction'
export const TransactionType = {
  Seller:'se',
  Buyer:'bu',
  Message:'me'
}

// Note: SalesStatusType
export const BeforeTrading = 'btr'
export const Trading = 'tr'
export const Complete = 'co'
export const Cancel = 'ca'
export const MENU_TABS = [BeforeTrading, Trading, Complete, Cancel]

export enum SKILL_SALES_STATUS {
  PROGRESS_STATUS = 1,
  SELLER_COMPLETE_STATUS = 2,
  BUYER_COMPLETE_STATUS = 3,
  SELLER_CANCEL = 4,
  BUYER_CANCEL = 5
}

export const TRANSACTION_URL = {
  se: '/mypage/transaction/sell',
  bu: '/mypage/transaction/buy',
  me: '/mypage/message',
}

export const IMG_TYPES = ['jpg', 'png', 'image', 'jpeg']
export const IMAGE = 'image'
export const TEXT = 'text'
export const FILE = 'file'
export const DOWNLOAD = 'down'
export const CLOSE = 'cls'
export const TimeoutTime = 10000
export const TimeoutTransactionLoot = 1
export const PanelId = '#chat-panel-content'
export const TwoDays = 48 * 60 * 60 * 1000

export const DATE_FORMAT = {
  TIME: 'HH:mm',
  DAY: 'yyyy/MM/dd',
}

export const CHAT_COLOR = {
  [TransactionType.Buyer]: {
    primary: {
      iconBg: theme.palette.common.white,
      icon: theme.palette.secondary.main,
      bg: theme.palette.secondary.main,
      text: theme.palette.common.white,
      dot: theme.palette.ruby.main
    },
    secondary: {
      iconBg: theme.palette.secondary.main,
      icon: theme.palette.common.white,
      bg: theme.palette.common.white,
      text: theme.palette.jade.dark,
    },
  },
  [TransactionType.Seller]: {
    primary: {
      iconBg: theme.palette.common.white,
      icon: theme.palette.primary.main,
      bg: theme.palette.primary.main,
      text: theme.palette.common.white,
      dot: theme.palette.primary.main,
    },
    secondary: {
      iconBg: theme.palette.primary.main,
      icon: theme.palette.common.white,
      bg: theme.palette.common.white,
      text: theme.palette.jade.dark,
    },
  }
}

export enum TransactionError {
  ECB404 = 'ECB404', // Invalid transactionId or Invalid user
  ECB001 = 'ECB001', // Invalid request
  EUA001 = 'EUA001', // error unauthorized
  ECI500 = 'ECI500', // error common internal error
}

// Interface
export interface IMessages {
  id: number
  sellerId: number
  nickNameSeller: string
  nickNameBuyer: string
  userId: number
  sentAt: number
  content: string
  contentType: string
  isSender: boolean
  attachment: Array<IFileInfo> | []
}
export interface IFileInfo {
  attachmentId: number
  sizeImage: {
    width: number
    height: number
  } | null
  fileType: 'image' | 'file'
  fileName: string
  url: string,
  ext: string
}

export interface IChatroom {
  transactionId: number
  masterId: number
  skillId: number
  skillTitle: string
  isNewMessage: number
  nickName: string
  time: number
  imageUrl: string
}
export interface IChatInfo {
  id: number
  statusName: string // 'btr' | 'tr' | 'co' | 'ca'
  masterType: number
  masterId: number
  sellerId: number
  buyerId: number
  skillId: number
  skillInfo:SkillInfo
}
export interface IListOption {
  id: number
  title: string
  price: number
}
export interface IPaidOption {
  total: number
  options: Array<IListOption>
}

// Function

/* Check current status or progress if DONE or CANCEL
* NOT cancel by seller or buyer
* NOT pass 48 hours after complete */
export function checkIsValidChatStatus (salesStatus: number, closeAt?: number) {
  if(salesStatus === SKILL_SALES_STATUS.SELLER_CANCEL) return false
  if(salesStatus === SKILL_SALES_STATUS.BUYER_CANCEL) return false
  if(!closeAt) return  true
  // if(salesStatus === SKILL_SALES_STATUS.BUYER_COMPLETE_STATUS && closeAt && Date.parse(new Date().toUTCString()) >= closeAt) return false
  if(salesStatus === SKILL_SALES_STATUS.BUYER_COMPLETE_STATUS && closeAt && Date.now() >= closeAt) return false
  return true
}
export interface IMenuListStatus {
  statusName: string
  statusType: number
  numberCount: number
  isNewMessage: boolean
}
export interface IChatRoomPagingMeta {
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  limit: number,
  page: number,
  totalItem: number,
  totalPage: number
}
export const INITIAL_MENU_LIST_STATUS: Array<IMenuListStatus> = [
  {
    statusName: BeforeTrading,
    statusType: 0,
    numberCount: 0,
    isNewMessage: false
  },
  {
    statusName: Trading,
    statusType: 1,
    numberCount: 0,
    isNewMessage: false
  },
  {
    statusName: Complete,
    statusType: 2,
    numberCount: 0,
    isNewMessage: false
  },
  {
    statusName: Cancel,
    statusType: 3,
    numberCount: 0,
    isNewMessage: false
  },
]
export const addEventVisibilityChangeListener = (callBack: () => void) => {
  document.addEventListener('visibilitychange', callBack)
}
export const removeEventVisibilityChangeListener = (callBack: () => void) => {
  document.removeEventListener('visibilitychange', callBack)
}
export function isDocumentVisible(): boolean {
  return document.visibilityState !== 'hidden'
}
