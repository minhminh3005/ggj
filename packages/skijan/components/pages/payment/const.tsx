import CreditCardIcon from '@mui/icons-material/CreditCard'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined'
import { PaidOptionType } from 'components/commons/GgjPaymentPanel/paymentPanelSlice'
export const Steps = {
  Step1: 0,
  Step2: 1,
  Step3: 2,
}
export const PaymentMethods = {
  Credit: 11,
  BankTransfer: 1,
  PayAtConvenienceStore: 4,
}

export const StoreName = {
  FamilyMart: 'family_mart',
  GS25: 'daily_yamazaki'
}


export const ListSteps = [
  {
    step: Steps.Step1,
    label: 'step-1',
  },
  {
    step: Steps.Step2,
    label: 'step-2',
  },
  {
    step: Steps.Step3,
    label: 'step-3',
  },
]


export const Icons = [
  { name: 'CreditCardIcon', icon: CreditCardIcon },
  { name: 'AccountBalanceOutlinedIcon', icon: AccountBalanceOutlinedIcon },
  { name: 'StoreOutlinedIcon', icon: StoreOutlinedIcon },
]

export const ListPaymentMethods = [

  {
    icon: 'AccountBalanceOutlinedIcon',
    type: PaymentMethods.BankTransfer,
    disabled: false,
    label: 'BankTransfer',
  },
  {
    icon: 'CreditCardIcon',
    type: PaymentMethods.Credit,
    //TODO: thao, remove disabled
    disabled: true,
    label: 'Credit',
  },
  {
    icon: 'StoreOutlinedIcon',
    type: PaymentMethods.PayAtConvenienceStore,
    disabled: true,
    label: 'PayAtConvenienceStore',
  },
]

export interface PaymentCompleteType {
  product:{
    id:number,
    title:string,
    price:number,
    isSpecialDiscount:boolean,
    specialDiscountPrice?:number|null
    imageUrl: string
  }
  totalPrice: number | null,
  paidOptions: Array<PaidOptionType>
  payId:number,
  sessionId: string,
  transactionId:number | null,
  thirdPartyData:{
    transferNumber:number,
    bankTransferMethod:Array<BankTransferMethodType>,
    browserEncryptionKey?:string,
    merchantId?:string
  }
}

export interface BankTransferMethodType {
  bankName: string
  branchName: string
  accountType: string
  accountNumber: string
  accountHolder: string
}


