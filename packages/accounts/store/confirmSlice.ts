import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import http from '../common/http'
import {NextRequest} from 'next/server'

//namespace
export const ns = 'confirmSlice'

//interface
export interface Modal {
  open: boolean
  checkingNickname: 'checked' | 'checking'
}

const initialState: Modal = {
  open: false,
  checkingNickname: 'checked'
}
const slice = createSlice({
  name: ns,
  initialState,
  reducers: {
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload
    },
    setCheckingNickname: (state, action: PayloadAction<'checked' | 'checking'>) => {
      state.checkingNickname = action.payload
    },
  },
})

export const getTermApi = async (callbackFn: (da: typeof data) => void) => {
  const {data} = await http.get('/api/accounts/v1/term')
  callbackFn(data)
}

export const checkNicknameApi = async ({nickName}: {nickName: string}) => {
  const {data} = await http.post('/api/accounts/v1/register/nick-name/status', {nickName})
  return data
}

export const getEmailApi = async (req: NextRequest) => {
  // @ts-ignore
  const cookie = req.headers['cookie'] || ''
  const data = await http.post('/api/accounts/v1/authentication/confirm',{},{
    headers: {
      Cookie: cookie
    }
  })
  return data.data.data
}

export const { actions } = slice
export default slice
