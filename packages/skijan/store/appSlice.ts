import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'store/reduxWrapper'
import menuData from 'components/layouts/common/menu-data.json'

const AVATAR_URL = '/img/v3/skijan/users/avatar'
// TODO: - An refactor later, get response from api
const AVATAR_URL_NO_CACHE = '/img/no-cache/skijan/users/avatar'

// namespace
export const ns = 'app'

export interface IAuth {
  userId: number
  userName: string
  clientId?: string
  isSkjDeveloper?: boolean
}

// state interface
export interface State {
  menuData: object[]
  auth: IAuth | Record<string, never>
  user: { avatar: string }
}

// initial state
const initialState: State = {
  menuData,
  auth: {},
  user: { avatar: '' }
}

// slice
const slice = createSlice({
  name: ns,
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<IAuth | Record<string, never>>) => {
      state.auth = action.payload
      state.user.avatar = `${AVATAR_URL}/${action.payload.userId}?noDefaultImg=0`
    },
    setUserAvatarNoCache(state) {
      state.user.avatar = `${AVATAR_URL_NO_CACHE}/${state.auth.userId}?noDefaultImg=0&v=${(new Date().getTime())}`
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
