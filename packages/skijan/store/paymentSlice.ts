import {AnyAction, createSlice, PayloadAction, ThunkDispatch} from '@reduxjs/toolkit'
import {AppThunk} from './store'
import http, {appendGgjHeader} from 'common/http'
// import {HYDRATE} from 'store/reduxWrapper'
import {loadingOffHandler, loadingOnHandler} from '../contexts/LoadingContext'
import {PaymentCompleteType, PaymentMethods, Steps,} from '../components/pages/payment/const'
import {NextRequest} from 'next/server'
import {NextRouter} from 'next/dist/shared/lib/router/router'
import {genAuthUrl} from '../common/url'
import {toastHandler} from '../contexts/ToastContext'
// namespace
export const ns = 'payment'

interface PaidOptionType {
  optionName: string,
  id: number,
  optionPrice: number
}

export interface PaymentInfoType {
  product: {
    id: number,
    title: string,
    price: number,
    specialDiscountPrice: number | null,
    isSpecialDiscount: boolean | null
    imageUrl: string
  }
  totalPrice: number | null,
  totalPaidOptionsPrice: number | null,
  paidOptions: Array<PaidOptionType>
}

export const PaymentStatus = {
  EPAuthNOTLogin: 'EPAuthNOTLogin',
  EPVInvalidSkill: 'EPVInvalidSkill',
  EPVSkillDraft: 'EPVSkillDraft',
  EPVSkillClosed: 'EPVSkillClosed',
  EPVSkillPaused: 'EPVSkillPaused',
  EPVInvalidBuyer: 'EPVInvalidBuyer',
  EPVInvalidSeller: 'EPVInvalidSeller',
  EPVInvalidOpts: 'EPVInvalidOpts',
  EPVSkillLimited: 'EPVSkillLimited',
  EPVInvalidCart: 'EPVInvalidCart',
  EPVSkillPriceChanged: 'EPVSkillPriceChanged',
  EPVOptsPriceChanged: 'EPVOptsPriceChanged',
  EPVInvalidSSID: 'EPVInvalidSSID'
}

// state interface
interface State {
  currentStep: number
  currentPaymentMethod: number | null
  storeName: string
  paymentComplete?: PaymentCompleteType
  paymentInfo?: PaymentInfoType,
  cartSessionId?: string,
  isShowPopupError?:boolean
}


// initial state
const initialState: State = {
  currentStep: 0,
  currentPaymentMethod: null,
  storeName: '',
}

// slice
const slice = createSlice({
  name: ns,
  initialState,
  reducers: {
    handleSetCurrentStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload
    },
    handleSetStoreName(state, action: PayloadAction<string>) {
      state.storeName = action.payload
    },
    handleSetCurrentPaymentMethod(state, action: PayloadAction<number|null>) {
      state.currentPaymentMethod = action.payload
    },
    handleSetPaymentComplete(state, action: PayloadAction<PaymentCompleteType>) {
      state.paymentComplete = action.payload
    },
    setPaymentInfo(state, action: PayloadAction<PaymentInfoType>) {
      state.paymentInfo = action.payload
    },
    setCartSessionId(state, action: PayloadAction<string>) {
      state.cartSessionId = action.payload
    },
    setIsShowPopupError(state, action: PayloadAction<boolean>) {
      state.isShowPopupError = action.payload
    },
    resetState: () => initialState,
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

const paymentInfoUrl = 'api/skijan/v1/payment'
export const getPaymentInfo = async (csid: string, req: NextRequest) => {
  const {data} = await http.get(paymentInfoUrl,
    {
      params: {csid: csid},
      headers: appendGgjHeader({req})
    })
  return data
}
export const getPaymentComplete = async (ssid: string, req: NextRequest) => {
  const {data} = await http.get('api/skijan/v1/payment/result',
    {
      params: {ssid: ssid},
      headers: appendGgjHeader({req})
    })
  return data
}

export const handleValidateOrCheckout = (
  errorCheckoutType: IErrorCheckoutType,
  router: NextRouter
): AppThunk => {
  return async (dispatch, getState) => {
    const state: State = getState()[ns]
    //TODO: thao, remove code after relase
    if(state.currentPaymentMethod !== PaymentMethods.BankTransfer) return
    if (state.currentStep == Steps.Step1) {
      await handleValidatePaymentInfo(state.cartSessionId as string, errorCheckoutType, router, dispatch)
      return
    }
    if (state.currentStep == Steps.Step2) {
      const cartSessionId = state.cartSessionId as string
      const checkoutInfo: ICheckoutInfoType = {
        payId: Number(state.currentPaymentMethod),
        cartSessionId: cartSessionId
      }
      await handleValidateAndCheckout(checkoutInfo, cartSessionId, errorCheckoutType, router, dispatch)
    }
  }
}

const handleValidatePaymentInfo = async (
  cartSessionId: string,
  errorCheckoutType: IErrorCheckoutType,
  router: NextRouter,
  dispatch: ThunkDispatch<State, unknown, AnyAction>
) => {
  try {
    loadingOnHandler()
    const data = await validatePaymentInfo(cartSessionId)
    if (!data.error) {
      dispatch(actions.handleSetCurrentStep(Steps.Step2))
      return
    }
    let url = ''
    switch (data.error) {
    case ErrorStatusTypes.EPAuthNOTLogin:
      return window.location.href = genAuthUrl(router, 'login')
    case ErrorStatusTypes.EPVInvalidCart:
    case ErrorStatusTypes.EPVInvalidSkill: {
      url = '/'
      break
    }
    case ErrorStatusTypes.EPVSkillDraft: {
      url = '/404'
      break
    }
    case ErrorStatusTypes.EPVSkillPaused:
    case ErrorStatusTypes.EPVSkillClosed:
    case ErrorStatusTypes.EPVSkillLimited:
    case ErrorStatusTypes.EPVInvalidOpts: {
      url = `/skill/${data.message}`
      break
    }
    case ErrorStatusTypes.EPVSkillPriceChanged:
    case ErrorStatusTypes.EPVOptsPriceChanged: {
      // Note:Thao, only use for case validate payment info
      // @ts-ignore
      toastHandler({
        message: errorCheckoutType[data.error as keyof IErrorCheckoutType],
        type: 'error',
      })
      dispatch(refreshPaymentInfo(cartSessionId, errorCheckoutType, router, dispatch))
      dispatch(actions.handleSetCurrentStep(Steps.Step1))
      dispatch(actions.handleSetCurrentPaymentMethod(null))
      return
    }
    }
    toastHandler({
      message: errorCheckoutType[data.error as keyof IErrorCheckoutType],
      type: 'error',
    })
    if (url) {
      router.push(url)
    }
    //await handleErrorStatus(data.error, errorCheckoutType, router, dispatch, data.message, cartSessionId)
  } catch (error) {
    toastHandler({type: 'error'})
  } finally {
    loadingOffHandler()
  }
}


const handleValidateAndCheckout = async (
  checkoutInfo: ICheckoutInfoType,
  cartSessionId: string,
  errorCheckoutType: IErrorCheckoutType,
  router: NextRouter,
  dispatch: ThunkDispatch<State, unknown, AnyAction>
) => {
  try {
    loadingOnHandler()
    const data = await validateAndCheckout(checkoutInfo)
    if (!data.error) {
      const result = data.data as PaymentCompleteType
      dispatch(actions.handleSetPaymentComplete(result))
      if(checkoutInfo.payId != PaymentMethods.Credit)
      {
        window.history.pushState('payment', 'payment', `/payment?ssid=${result.sessionId}`)
        dispatch(actions.handleSetCurrentStep(Steps.Step3))
        return
      }

      const form = document.createElement('form')
      form.method = 'post'
      form.action = 'https://pay.veritrans.co.jp/web1/deviceCheck.action'
      const MERCHANT_ID_input = document.createElement('input')
      MERCHANT_ID_input.type = 'hidden'
      MERCHANT_ID_input.name = 'MERCHANT_ID'
      MERCHANT_ID_input.value = result?.thirdPartyData?.merchantId ||''

      const ORDER_ID_input = document.createElement('input')
      ORDER_ID_input.type = 'hidden'
      ORDER_ID_input.name = 'ORDER_ID'
      ORDER_ID_input.value = result?.sessionId||''

      const BROWSER_ENCRYPTION_KEY_input = document.createElement('input')
      BROWSER_ENCRYPTION_KEY_input.type = 'hidden'
      BROWSER_ENCRYPTION_KEY_input.name = 'BROWSER_ENCRYPTION_KEY'
      BROWSER_ENCRYPTION_KEY_input.value =result?.thirdPartyData?.browserEncryptionKey ||''

      form.appendChild(MERCHANT_ID_input)
      form.appendChild(ORDER_ID_input)
      form.appendChild(BROWSER_ENCRYPTION_KEY_input)
      document.body.appendChild(form)
      form.submit()
      return
    }
    await handleCheckoutErrorStatus(data.error, errorCheckoutType, router, dispatch, data.message, cartSessionId)
  } catch (error) {
    toastHandler({type: 'error'})
  } finally {
    loadingOffHandler()
  }
}

export const validatePaymentInfo = async (cartSessionId: string) => {
  const {data} = await http.post('api/skijan/v1/payment/confirm', {cartSessionId: cartSessionId})
  return data
}

interface ICheckoutInfoType {
  cartSessionId: string,
  payId: number,
  providerId?: string | null
}

const validateAndCheckout = async (checkoutInfo: ICheckoutInfoType) => {
  const {data} = await http.post('api/skijan/v1/payment/checkout', checkoutInfo)
  return data
}

export interface IErrorCheckoutType {
  EPAuthNOTLogin: string,
  EPVInvalidSkill: string,
  EPVSkillDraft: string,
  EPVSkillClosed: string,
  EPVSkillPaused: string,
  EPVInvalidBuyer: string,
  EPVInvalidSeller: string,
  EPVInvalidOpts: string,
  EPVSkillLimited: string,
  EPVInvalidCart: string,
  EPVSkillPriceChanged: string,
  EPVOptsPriceChanged: string,
  EPVCreditPaymentCheckoutError?:string,
  EPVCreditPaymentCancel?:string
}

export const ErrorStatusTypes: IErrorCheckoutType = {
  EPAuthNOTLogin: 'EPAuthNOTLogin',
  EPVInvalidSkill: 'EPVInvalidSkill',
  EPVSkillDraft: 'EPVSkillDraft',
  EPVSkillClosed: 'EPVSkillClosed',
  EPVSkillPaused: 'EPVSkillPaused',
  EPVInvalidBuyer: 'EPVInvalidBuyer',
  EPVInvalidSeller: 'EPVInvalidSeller',
  EPVInvalidOpts: 'EPVInvalidOpts',
  EPVSkillLimited: 'EPVSkillLimited',
  EPVInvalidCart: 'EPVInvalidCart',
  EPVSkillPriceChanged: 'EPVSkillPriceChanged',
  EPVOptsPriceChanged: 'EPVOptsPriceChanged',
  EPVCreditPaymentCheckoutError:'EPVCreditPaymentCheckoutError',
  EPVCreditPaymentCancel:'EPVCreditPaymentCancel'
}

const handleCheckoutErrorStatus = async (
  errorStatus: string,
  errorCheckoutType: IErrorCheckoutType,
  router: NextRouter,
  dispatch: ThunkDispatch<State, unknown, AnyAction>,
  productId?: string,
  cartSessionId?: string) => {
  let url
  switch (errorStatus) {
  case ErrorStatusTypes.EPAuthNOTLogin:
    return window.location.href = genAuthUrl(router, 'login')
  case ErrorStatusTypes.EPVInvalidCart:
  case ErrorStatusTypes.EPVInvalidSkill:
  case ErrorStatusTypes.EPVInvalidBuyer:
  case ErrorStatusTypes.EPVInvalidSeller: {
    url = '/'
    break
  }
  case ErrorStatusTypes.EPVSkillDraft: {
    url = '/404'
    break
  }
  case ErrorStatusTypes.EPVSkillPaused:
  case ErrorStatusTypes.EPVSkillClosed:
  case ErrorStatusTypes.EPVSkillLimited:
  case ErrorStatusTypes.EPVInvalidOpts: {
    url = `/skill/${productId}`
    break
  }
  case ErrorStatusTypes.EPVSkillPriceChanged:
  case ErrorStatusTypes.EPVOptsPriceChanged: {
    // Note:Thao, only use for case validate payment info
    // @ts-ignore
    toastHandler({
      message: errorCheckoutType[errorStatus as keyof IErrorCheckoutType],
      type: 'error',
    })
    dispatch(refreshPaymentInfo(cartSessionId as string, errorCheckoutType, router, dispatch))
    dispatch(actions.handleSetCurrentStep(Steps.Step1))
    dispatch(actions.handleSetCurrentPaymentMethod(null))
    return
  }
  }
  toastHandler({
    message: errorCheckoutType[errorStatus as keyof IErrorCheckoutType],
    type: 'error',
  })
  if (url) {
    router.push(url)
  }
}

const refreshPaymentInfo =  (
  csid: string,
  errorCheckoutType: IErrorCheckoutType,
  router: NextRouter,
  dispatch: ThunkDispatch<State, unknown, AnyAction>):AppThunk => {
  return async ()=> {
    try {
      const {data} = await http.get(paymentInfoUrl, {params: {csid: csid},})
      if (!data.error) {
        dispatch(actions.setPaymentInfo(data.data as PaymentInfoType))
        return
      }
      const errorStatus = data.error
      const productId = data.message
      handlePaymentInfoErrorStatus(errorStatus, errorCheckoutType, router, productId)
    } catch (error) {
      console.log('error ', error)
      toastHandler({type: 'error'})
    }
  }
}


export const handlePaymentInfoErrorStatus = async (
  errorStatus: string,
  errorCheckoutType: IErrorCheckoutType,
  router: NextRouter,
  productId?: number) => {
  let url
  switch (errorStatus) {
  case ErrorStatusTypes.EPAuthNOTLogin:
    return window.location.href = genAuthUrl(router, 'login')
  case ErrorStatusTypes.EPVInvalidCart:
  case ErrorStatusTypes.EPVInvalidSkill:
  case ErrorStatusTypes.EPVInvalidBuyer:
  case ErrorStatusTypes.EPVInvalidSeller: {
    url = '/'
    break
  }
  case ErrorStatusTypes.EPVSkillDraft: {
    url = '/404'
    break
  }
  case ErrorStatusTypes.EPVSkillPaused:
  case ErrorStatusTypes.EPVSkillClosed:
  case ErrorStatusTypes.EPVSkillLimited:
  case ErrorStatusTypes.EPVInvalidOpts: {
    url = `/skill/${productId}`
    break
  }
  }
  toastHandler({
    message: errorCheckoutType[errorStatus as keyof IErrorCheckoutType],
    type: 'error',
  })
  if (url) {
    router.push(url)
  }
}

export const {actions} = slice
export default slice
