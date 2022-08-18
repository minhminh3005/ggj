import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import http, {appendGgjHeader} from 'common/http'
import {NextRequest} from 'next/server'
import {HYDRATE} from './reduxWrapper'

export const nsBank = 'updateBank'

export interface IBankInfo {
  bankName: string
  bankBranchName: string
  accountType: number
  accountNumber: string
  accountHolder: string
  bankType: number
}

type initialStateType = {
  bankInfoArr: IBankInfo[]
}

const bankInfoArr: IBankInfo[] = [
  {
    bankName: '',
    bankBranchName: '',
    accountType: 1,
    accountNumber: '',
    accountHolder: '',
    bankType: 1,
  },
  {
    bankName: '',
    bankBranchName: '',
    accountType: 1,
    accountNumber: '',
    accountHolder: '',
    bankType: 2,
  },
]

const initialState: initialStateType = {
  bankInfoArr,
}

const slice = createSlice({
  name: nsBank,
  initialState,
  reducers: {
    setBankInfo: (state, action: PayloadAction<IBankInfo[]>) => {
      if (action.payload.length == 0) {
        state.bankInfoArr = [{
          bankName: '',
          bankBranchName: '',
          accountType: 1,
          accountNumber: '',
          accountHolder: '',
          bankType: 1,
        },
        {
          bankName: '',
          bankBranchName: '',
          accountType: 1,
          accountNumber: '',
          accountHolder: '',
          bankType: 2,
        },]
      } else {
        if (action.payload.length == 1) {
          state.bankInfoArr[0] = action.payload[0]
          state.bankInfoArr[1] = {
            bankName: '',
            bankBranchName: '',
            accountType: 1,
            accountNumber: '',
            accountHolder: '',
            bankType: 2,
          }
        } else {
          state.bankInfoArr = action.payload
        }
      }
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload[nsBank],
      }
    },
  },
})

export const updateBankInfo = async (data: IBankInfo[]) => {
  const res = await http.put('/api/myaccount/v1/bank/update', data)
  return res.data
}

export const getBankInfo = async (req: NextRequest) => {
  const data = await http.get('/api/myaccount/v1/bank', {
    headers: appendGgjHeader({req}),
  })
  return data.data.data
}

export const {actions} = slice
export default slice
