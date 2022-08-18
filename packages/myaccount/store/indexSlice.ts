import upload from 'common/upload'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from './index'
import http, { appendGgjHeader } from 'common/http'
import { HYDRATE } from 'store/reduxWrapper'
import { loadingOffHandler, loadingOnHandler } from 'contexts/LoadingContext'
import { toastHandler } from 'contexts/ToastContext'
import { TGgjRes } from 'app'
import { NextRequest } from 'next/server'

// namespace
export const nsIndex = 'index'

// state interface
export interface IIndexData {
  nickName: string
  id: number
  isNda: boolean
  identity: 0 | 1 | 2 | 3 // 0: Accepting, 1: Confirmation completed, 2: Re-upload required, 3: Disapproved
  isAllowChangeMail: boolean
}

export interface State {
  isShowConfirmUploadModal: boolean
  avatar: string
  data: IIndexData | object
}

type TResponseUploadData = Array<{
  fileName: string
  number: number
  size: string
  hash: string
  fileType: string
}>

// initial state
const initialState: State = {
  data: {},
  isShowConfirmUploadModal: false,
  avatar: '',
}

// slice
const slice = createSlice({
  name: nsIndex,
  initialState,
  reducers: {
    setData(state, action: PayloadAction<IIndexData | Record<string, never>>) {
      state.data = action.payload
      state.avatar = `/img/v3/myaccount/users/avatar/${action.payload.id}?noDefaultImg=0`
    },
    setIsShowConfirmUploadModal: (state, action: PayloadAction<boolean>) => {
      state.isShowConfirmUploadModal = action.payload
    },
    setAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = `/img/no-cache/myaccount/users/avatar/${action.payload}`
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload[nsIndex],
      }
    },
  },
})

export const getApi = (req : NextRequest): AppThunk => async (dispatch) => {
  const res = await http.get<TGgjRes<IIndexData>>('/api/myaccount/v1/index', { headers: appendGgjHeader({ req }) })
  dispatch(slice.actions.setData(res.data.data as IIndexData))
}

export const uploadAvatar = (
  file: File,
  id: string,
  statusMessage: {SUCCESS: string, ERROR: string}
): AppThunk =>
  async (dispatch) => {
    try {
      loadingOnHandler()
      const fd = new FormData()
      const f = file instanceof File ? new Blob([file], { type: file.type }) : file
      fd.append('file', f, file.name)

      const res = (await upload<{data: TGgjRes<TResponseUploadData>}>({
        url: `/upload/v3/myaccount/users/avatar/${id}`,
        fd
      }))
      if (res?.data?.error) {
        throw new Error(res.data.error)
      } else {
        dispatch(slice.actions.setAvatar(`${id}?t=${new Date().getTime()}?noDefaultImg=0`))
        loadingOffHandler()
        toastHandler({ message: statusMessage.SUCCESS, type: 'success' })
      }
    } catch (error) {
      loadingOffHandler()
      toastHandler({ message: statusMessage.ERROR, type: 'error' })
    }
  }

export const { actions } = slice
export default slice
