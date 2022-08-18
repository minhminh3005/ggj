import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'store/reduxWrapper'

// namespace
export const ns = 'index'

// state interface
export interface State {
  value: number
  status: 'idle' | 'loading' | 'failed'
}

// initial state
const initialState: State & { data: any } = {
  value: 0,
  status: 'idle',
  data: {},
}

// slice
const slice = createSlice({
  name: ns,
  initialState,
  reducers: {
    increment: (state, action: PayloadAction<number>) => {
      state.value += action.payload || 1
    },
    setData(state, action: PayloadAction) {
      state.data = action.payload
    }
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

export const {actions} = slice
export default slice
