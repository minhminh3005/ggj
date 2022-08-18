import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from './index'
import {HYDRATE} from 'store/reduxWrapper'
import http, { appendGgjHeader } from 'common/http'
import { loadingOnHandler, loadingOffHandler } from 'contexts/LoadingContext'
import { toastHandler } from 'contexts/ToastContext'
import { NextRequest } from 'next/server'
export interface State {
  id?: number | null
  emailAddress: string | null
}

const initialState: State = {
  id: null,
  emailAddress: null,
}

export const ns = 'changeEmail'

const slice = createSlice({
  name: ns,
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<number>) => {
      state.id = action.payload
    },
    setEmailAddress: (state, action: PayloadAction<string>) => {
      state.emailAddress = action.payload
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

export const getEmailAddressFromApi = async (req : NextRequest) => {
  const { data } = await http.get('/api/myaccount/v1/index', { headers: appendGgjHeader({ req }) })
  return data
}
export interface statusCodeChangeEmail {
  SUCCESS: string
  EM001: string
  EM002: string
  EM003: string
  EM004: string
}

export const sendRequestChangeEmailAddress = (
  emailAddress: string,
  statusCode: statusCodeChangeEmail
): AppThunk => {
  return async () => {
    try {
      loadingOnHandler()
      const res = await http.post('/api/myaccount/v1/email/change', { email: emailAddress })
      const result = res.data
      if (result.error) {
        toastHandler({
          message: statusCode[result.error as keyof statusCodeChangeEmail],
          type: 'error',
        })
        return
      }
      toastHandler({ message: statusCode.SUCCESS, type: 'success' })
    } catch (error) {
      toastHandler({type: 'error'})
    } finally {
      loadingOffHandler()
    }
  }
}

export const confirmChangeEmailAddress = async (token: string, req: NextRequest) => {
  const { data } = await http.post('/api/myaccount/v1/email/confirm', null, { params: { token }, headers: appendGgjHeader({ req }) })
  return data
}

export const { actions } = slice
export default slice
