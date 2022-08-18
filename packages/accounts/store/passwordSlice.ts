import { createSlice } from '@reduxjs/toolkit'
import http from 'common/http'
import { URL } from 'common/variables'

//namespace
export const ns = 'passwordSlice'

//interface
export interface TPassword {
}

const initialState: TPassword = {
}
const slice = createSlice({
  name: ns,
  initialState,
  reducers: {
  },
})

export const checkTokenIsValid = async (token: string | string[]) => {
  const {data} = await http.post(`${URL}/password/confirm/status`, {token})
  return data
}

export const requestResetPassword = async (email: string) => {
  const {data} = await http.post(`${URL}/password/reset`, {email})
  return data
}

export const requestConfirmPassword = async (password: string, token: string) => {
  const {data} = await http.post(`${URL}/password/confirm`, {password, token})
  return data
}

export const { actions } = slice
export default slice
