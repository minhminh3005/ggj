import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '../index'
import { HYDRATE } from 'store/reduxWrapper'
import http, { appendGgjHeader } from 'common/http'
import { loadingOffHandler, loadingOnHandler } from 'contexts/LoadingContext'
import { TGgjRes } from 'app'
import { NextRequest } from 'next/server'
import { toastHandler } from '../../contexts/ToastContext'

// namespace
export const ns = 'withdrawal'
const WithdrawalError = {
  EW001: 'EW001', // User is marchant `privacy.users.is_marchant = 1`
  EW002: 'EW002', // Has unfinished estimate product
  EW003: 'EW003', // Bought subscription product (month bill)
  EW004: 'EW004', // Has unfinished skijan skills product}
}
// state interface
export interface IState {
  reasonWithdrawList: Array<IReasonWithdraw>
  isOpenModal: boolean
  screenIndex: TScreen
}
// initial state
const initialState: IState = {
  reasonWithdrawList: [],
  isOpenModal: false,
  screenIndex: 0
}
export interface IReasonWithdraw {
  id: number
  withdrawalReason: string
  priority: number
}
/**
 * 0: Withdraw screen
 * 1: ReasonWithdraw screen
 * 2: WithdrawSuccess screen
 */
type TScreen = 0 | 1 | 2
interface ISubmitWithdrawalPayload {
  reasonIds: number[]
  reason?: string
}

// slice
const slice = createSlice({
  name: ns,
  initialState,
  reducers: {
    setReasonWithdrawList: (state, action: PayloadAction<IReasonWithdraw[]>) => {
      state.reasonWithdrawList = action.payload
    },
    setIsOpenModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenModal = action.payload
    },
    setScreenIndex: (state, action: PayloadAction<TScreen>) => {
      state.screenIndex = action.payload
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload[ns],
      }
    },
  },
})


export const getListReasonWithdraw = (req: NextRequest) : AppThunk => async dispatch => {
  const res = (await http.get<TGgjRes<IReasonWithdraw[]>>('/api/myaccount/v1/withdrawal/reason', { headers: appendGgjHeader({ req }) }))
  const data = res.data.data as IReasonWithdraw[]
  if(data.length > 0) {
    dispatch(actions.setReasonWithdrawList(data))
  }
}

export const sendRequestWithdrawal = (payload: ISubmitWithdrawalPayload) : AppThunk<Promise<boolean>> => async dispatch => {
  try {
    loadingOnHandler()
    const res = await http.post<TGgjRes<object>>('/api/myaccount/v1/withdrawal', payload)
    const error = res?.data?.error

    // error handle
    if(error) {
      if(WithdrawalError[error as keyof typeof WithdrawalError]) {
        dispatch(actions.setIsOpenModal(true))
        return false
      } else {
        throw new Error('Unexpected Error')
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    loadingOffHandler()
  }

  // any way, go to screen index 2 and return true
  dispatch(actions.setScreenIndex(2))
  return true
}


export const validateWithdraw = () : AppThunk => async dispatch => {
  try {
    loadingOnHandler()
    const res = await http.get('/api/myaccount/v1/withdrawal/validate')
    const data = res?.data?.data
    const error = res?.data?.error
    loadingOffHandler()
    if(error) {
      if(WithdrawalError[error as keyof typeof WithdrawalError]) {
        dispatch(actions.setIsOpenModal(true))
        return
      } else {
        throw new Error('Unexpected Error')
      }
    }

    if(data) {
      dispatch(actions.setScreenIndex(1))
    }
  } catch (error) {
    console.log(error)
    loadingOffHandler()
    toastHandler({message: undefined, type: 'error'})
  }
}


export const {actions} = slice
export default slice
