import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import http from '../common/http'
import { URL } from 'common/variables'
import getConfig from 'next/config'
import { store } from 'store'
import {HYDRATE} from 'store/reduxWrapper'

//namespace
export const ns = 'authSlice'

//interface
export interface TAuth {
  email: string
  clientId: string
}

const initialState: TAuth = {
  email: '',
  clientId: 'other'
}
const authSlice = createSlice({
  name: ns,
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    setClientId: (state, action: PayloadAction<string>) => {
      const {serverRuntimeConfig} = getConfig()
      const arr = [[serverRuntimeConfig.SKJ_HOST_URL, 'skj']]
      let clientId = ''
      if (!arr.some(x => {clientId = x[1]; return action.payload.includes(x[0])})) {
        return
      }
      state.clientId = clientId
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

export enum TScreenType {
  LOGIN = 0,
  REGISTER = 1
}

export interface TUser {
  email: string
  password: string
  isRegister: TScreenType
  clientId?: 'skj' | 'ggj' | 'other'
}
type TRegisterStatus = {
  data: {
    registerStatus: {
      ggj: number,
      skij: number
    },
    user: {
      nickName: string,
      email: string
    }
  },
  error: string
}
export const checkUserStatusApi = async (user: TUser) => {
  const {clientId} = store.getState()[ns]
  const u = new URLSearchParams(location.search).get('u')
  const {data} = await http.post<TRegisterStatus>(`${URL}/credential/validate`, Object.assign(user, {clientId}, u ? {u} : {}))
  return data
}

export interface TLogin {
  nickName?: string,
  isNotification?: number
}

export const authApi = async (login: TLogin, type: 'login' | 'register' | 'sns/login') => {
  const {data} = await http.post(`${URL}/${type}`, login)
  if (data.error) {
    return data
  }
  location.href = data.data.url
  return data
}

export const { actions } = authSlice
export default authSlice
