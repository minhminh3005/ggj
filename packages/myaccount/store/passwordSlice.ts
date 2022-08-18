import http, { appendGgjHeader } from 'common/http'
import { loadingOnHandler, loadingOffHandler } from 'contexts/LoadingContext'
import { toastHandler } from 'contexts/ToastContext'
import { TGgjRes } from 'app'
import { NextRequest } from 'next/server'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from './reduxWrapper'


// namespace
export const ns = 'changePassword'
// ERROR code
export const EP002 = 'EP002' // Current password is not correct
export const ERROR = 'ERROR'
export const SUCCESS = 'SUCCESS'
export interface IStatusMessage {
  SUCCESS: string
  ERROR: string
}
interface ISubmitData {
  currentPassword: string
  newPassword: string
}
export interface PasswordState {
  isHideCurrentPassword: boolean
}

const initialState: PasswordState = {
  isHideCurrentPassword: false
}

const slice = createSlice({
  name: ns,
  initialState,
  reducers: {
    setIsHideCurrentPassword: (state, action: PayloadAction<boolean>) => {
      state.isHideCurrentPassword = action.payload
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



export const sendRequestChangePassword = async (
  passwords: ISubmitData,
  statusMessage: IStatusMessage
) => {
  try {
    loadingOnHandler()
    const res = await http.post<TGgjRes<object>>('/api/myaccount/v1/password/change', passwords)
    const result = res.data
    // error
    if(result.error === EP002) {
      loadingOffHandler()
      return EP002
    }
    if (result.error) {
      throw new Error(result.message)
    }
    // success
    toastHandler({
      message: statusMessage['SUCCESS'],
      type: 'success',
    })
    loadingOffHandler()
    return SUCCESS
  } catch (error) {
    loadingOffHandler()
    toastHandler({
      message: statusMessage['ERROR'],
      type: 'error',
    })
    console.log(error)
    return ERROR
  }
}

export const getPassword = async (req : NextRequest) => {
  const { data } = await http.get('/api/myaccount/v1/password', { headers: appendGgjHeader({ req }) })
  return data
}
export const { actions } = slice
export default slice
