import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {HYDRATE} from 'store/reduxWrapper'
import {AppThunk} from 'store/store'
import http, {appendGgjHeader} from 'common/http'
import {TGgjRes} from 'app'
import upload from '../../../../common/upload'
import {NextRequest} from 'next/server'
import {skillAvatarUrl, SkillType} from '../../../../components/pages/mypage/display/skill/input/const'
import {loadingOffHandler, loadingOnHandler} from 'contexts/LoadingContext'

export const ns = 'MpSkillInput'

export interface IState {
  product: SkillFormValue
  isShowConfirmModal: boolean
  isShowRequiredThumbError: boolean
  isDisableAllInput: boolean
  cloneData: ICloneValue
  deletedPaidOption: Array<IPaidOptionValue>
  deletedFAQ: Array<IFAQValue>
  isCallApiDeleteAvatar: boolean
  isPublishValidation: boolean
}

export interface IFAQValue {
  id?: number
  question: string
  answer: string
  isDelete?: boolean
  statusType?: number
}

export interface IPaidOptionValue {
  statusType: number
  id?: number,
  optionName: string
  optionPrice: number | null
  isDelete?: boolean
}
interface ICloneValue {
  id?: number
  isHasAvatar?: number
  url?: string | null
}
export interface SkillFormValue {
  id?: number,
  statusType: number
  serviceCategoryLargeId?: number
  serviceCategoryMiddleId?: number
  title: string
  catchcopy: string
  outline: string
  faqs: Array<IFAQValue>
  estimateType?: number
  estimateContent?: string
  limit: number | null
  price: number | null
  discountPrice?: number
  discountStartAt?: number
  discountEndAt?: number
  paidOptions: Array<IPaidOptionValue>
  deliveryDays: number | null
  url?: string | null
  isHasAvatar: number
  imageUrl?: string
}

type TResponseUploadData = Array<{
  fileName: string
  number: number
  size: string
  hash: string
  fileType: string
}>

// initial state
const initialState: IState = {
  product: {
    statusType: SkillType.DRAFT,
    title: '',
    catchcopy: '',
    outline: '',
    faqs: [],
    limit: null,
    price: null,
    paidOptions: [],
    deliveryDays: null,
    url: null,
    isHasAvatar: 0,
    imageUrl: ''
  },
  isShowConfirmModal: false,
  isShowRequiredThumbError: false,
  isDisableAllInput: false,
  cloneData: {},
  deletedPaidOption: [],
  deletedFAQ: [],
  isCallApiDeleteAvatar: false,
  isPublishValidation: true
}

// slice
const slice = createSlice({
  name: ns,
  initialState,
  reducers: {
    setIsShowConfirmModal: (state, action: PayloadAction<boolean>) => {
      state.isShowConfirmModal = action.payload
    },
    setIsShowRequiredThumbError: (state, action: PayloadAction<boolean>) => {
      state.isShowRequiredThumbError = action.payload
    },
    deletePaidOption: (state, action: PayloadAction<IPaidOptionValue>) => {
      state.deletedPaidOption.push(action.payload)
    },
    deleteFAQ: (state, action: PayloadAction<IFAQValue>) => {
      state.deletedFAQ.push(action.payload)
    },
    setSkillId: (state, action: PayloadAction<number>) => {
      state.product.id = action.payload
    },
    setSkillStatusType: (state, action: PayloadAction<number>) => {
      state.product.statusType = action.payload
    },
    setIsHasAvatar: (state, action: PayloadAction<number>) => {
      state.product.isHasAvatar = action.payload
    },
    setBannersUrl: (state, action: PayloadAction<string>) => {
      state.product.url = action.payload
    },
    setProductData: (state, action: PayloadAction<SkillFormValue>) => {
      state.product = {
        ...state.product,
        ...action.payload
      }
    },
    setCloneData: (state, action: PayloadAction<ICloneValue>) => {
      state.cloneData = action.payload
    },
    setIsDisableAllInput: (state, action: PayloadAction<boolean>) => {
      state.isDisableAllInput = action.payload
    },
    setThumbUrl: (state, action: PayloadAction<string>) => {
      state.product.imageUrl = action.payload
    },
    resetState: () => initialState,
    setIsCallApiDeleteAvatar: (state, action: PayloadAction<boolean>) => {
      state.isCallApiDeleteAvatar = action.payload
    },
    setIsPublishValidation: (state, action: PayloadAction<boolean>) => {
      state.isPublishValidation = action.payload
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

export const postProductData = (payload: SkillFormValue, id?: number): AppThunk<Promise<number>> => async (dispatch) => {
  type PostResType = { skillId?: number }
  const response = (await http[id ? 'put' : 'post']<TGgjRes<PostResType>>(
    '/api/skijan/v1/mypage/display/skill/detail/' + (id ? `${id}/edit` : 'create'),
    payload
  ))
  const data = response.data.data as PostResType
  if (!data.skillId) {
    return 0
  }
  dispatch(actions.setSkillId(data.skillId))
  return data.skillId
}

export const uploadThumb = (
  thumbImage: File,
  id: number,
): AppThunk<Promise<TGgjRes<TResponseUploadData>>> => {
  return async (dispatch) => {
    const fd = new FormData()
    const f = thumbImage instanceof File
      ? new Blob([thumbImage], {type: thumbImage.type})
      : thumbImage
    fd.append('file', f, thumbImage.name)
    const res = await upload<{ data: TGgjRes<TResponseUploadData> }>({
      url: `/upload/v3/skijan/mypage/display/skill/${id}`,
      fd
    })
    if (res && !res?.data?.error) {
      dispatch(actions.setIsHasAvatar(1))
      dispatch(actions.setThumbUrl(`${skillAvatarUrl + id}/?t=${new Date().getTime()}`))
    }
    return res?.data || {data: {}, error: 'Error Upload Thumbnail'}
  }
}

type PutResType = { data: string }
export const uploadBannersOrPublish = (
  payload: {
    url: string,
    statusType: number
  },
  id: number
): AppThunk<Promise<TGgjRes<PutResType>>> => {
  return async (dispatch) => {
    const response = await http.put<TGgjRes<PutResType>>(
      `/api/skijan/v1/mypage/display/skill/detail/advance/${id}`,
      payload
    )
    if (!response.data.error) {
      dispatch(actions.setSkillStatusType(payload.statusType))
      dispatch(actions.setBannersUrl(payload.url))
    }
    return response.data
  }
}

type GetResType = { data: SkillFormValue }
export const getSkillProduct = (
  id: number,
  req: NextRequest
): AppThunk<Promise<TGgjRes<GetResType>>> => {
  return async (dispatch) => {
    const response = await http.get<TGgjRes<GetResType>>(
      `/api/skijan/v1/mypage/display/skill/detail/${id}/edit`,
      {headers: appendGgjHeader({req})}
    )
    const result = response.data as GetResType
    if(result?.data) {
      const limit = result.data.limit
      const deliveryDays = result.data.deliveryDays
      result.data.limit = limit === 0 ? null : limit
      result.data.deliveryDays = deliveryDays === 0 ? null : deliveryDays
      dispatch(actions.setProductData(result.data))
      dispatch(actions.setIsDisableAllInput(result.data.statusType === SkillType.CLOSE))
    }
    return result
  }
}

export const deleteAvatar = (
  id: number,
): AppThunk<Promise<TGgjRes<TResponseUploadData>>> => {
  return async (dispatch) => {
    const res = await http.delete(`/upload/v3/skijan/mypage/display/skill/${id}`)
    if (res && !res?.data?.error) {
      dispatch(actions.setIsHasAvatar(0))
    }
    return res?.data || {data: {}, error: 'Error Upload Thumbnail'}
  }
}

export const getCloneSkillProduct = (
  id: number,
): AppThunk => {
  return async (dispatch) => {
    try {
      loadingOnHandler()
      type GetResType = {data: SkillFormValue, error?: string}
      const response = await http.get<TGgjRes<GetResType>>(
        `/api/skijan/v1/mypage/display/skill/detail/${id}/edit`,
      )
      const result = response.data as GetResType
      if(result.error) {
        return
      }
      const data = result.data
      dispatch(actions.setCloneData({
        isHasAvatar: data.isHasAvatar,
        id: data.id || 0,
        url: data.url || null
      }))
      data.statusType = SkillType.DRAFT
      data.isHasAvatar = 0
      data.url = null
      data.imageUrl = ''
      data.limit = data.limit === 0 ? null : data.limit
      data.deliveryDays = data.deliveryDays === 0 ? null : data.deliveryDays
      delete data.id
      dispatch(actions.setProductData(result.data))

    } catch (e) {
      console.log(e)
    } finally {
      loadingOffHandler()
      if(window) {
        // @ts-ignore
        delete window.cloneId
      }
    }
  }
}



export const {actions} = slice
export default slice
