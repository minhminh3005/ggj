import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AlertColor } from '@mui/material'

//namespace
export const ns = 'appSlice'

//interface
export interface Alert {
  open: boolean
  type: AlertColor
  msg: string
}

export interface App {
  alert: Alert,
  loadingScreen: boolean
}

const initialState: App = {
  alert: {
    open: false,
    type: 'success',
    msg: '',
  },
  loadingScreen: false
}
const appSlice = createSlice({
  name: ns,
  initialState,
  reducers: {
    setAlert: (state, action: PayloadAction<Alert>) => {
      state.alert = action.payload
    },
    setLoadingScreen: (state, action: PayloadAction<boolean>) => {
      state.loadingScreen = action.payload
    }
  },
})

export const { setAlert } = appSlice.actions
export default appSlice
