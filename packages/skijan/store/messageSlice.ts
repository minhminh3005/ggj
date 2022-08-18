import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TransactionType } from 'components/pages/mypage/transaction'
// import http from 'common/http'
import { HYDRATE } from 'store/reduxWrapper'

// namespace
export const ns = 'message'

// state interface
interface State {
  listMessageRoom: Array<MessageRoomType>
  MENU_currentMode: string 
}

interface MessageRoomType {
  messageRoomId: number
  saleId: number
  developerId: number
  userId: number
  nickName: string
  creationTime: number
  name: string
  content: string
}

// initial state
const initialState: State = {
  listMessageRoom: [],
  MENU_currentMode: TransactionType.Buyer,
}

// slice
const slice = createSlice({
  name: ns,
  initialState,
  reducers: {
    setListMessageRoom(state, action: PayloadAction<Array<MessageRoomType>>) {
      state.listMessageRoom = action.payload
    },
    setCurrentMode(state, action: PayloadAction<string>) {
      state.MENU_currentMode = action.payload
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

export const { actions } = slice
export default slice
