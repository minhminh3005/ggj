import {TGgjRes} from 'app'
import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import { HYDRATE } from 'store/reduxWrapper'
import {AppState} from 'store/store'
import { NextRequest } from 'next/server'
import http, {appendGgjHeader} from 'common/http'
export const LIMIT = 10

export type TSkillDetail = {
  infoSkillDetail: {
    title: string
    price: number,
    updatedAt?: number,
    stars: number | null,
    statusType: number,
    numberSalesCompleted: number,
    isSpecialDiscount: 0 | 1
    specialDiscountPrice: number
    specialDiscountStartAt?: Date
    specialDiscountEndAt?: Date
    id: number
    imageUrl: string
  },
  buyersSkillDetail: {
    data: {
      nickName: string,
      startTime: number,
      price: number,
      finishTime: number,
      imageUrl: string
    }[],
    pagingMeta: {
      page: number,
      limit: number,
      totalItem: number,
      totalPage: number,
      hasPreviousPage: boolean,
      hasNextPage: boolean
    }
  }
}

export const ns = 'MpSkillDetail'
export interface State {
  data:TSkillDetail | null
}
const initialState: State = {
  data: null
}
const slice = createSlice({
  name: ns,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<TSkillDetail>) => {
      state.data = action.payload
    },
    setStatusType: (state: State, action: PayloadAction<number>) => {
      if(!state.data) return
      state.data.infoSkillDetail.statusType = action.payload
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
export const {actions} = slice
export default slice

export const getSkillServiceDetail = async (req: NextRequest, params: {id: number, page: number}): Promise<TGgjRes<TSkillDetail>> => {
  const data = await http.get<TGgjRes<TSkillDetail>>(`/api/skijan/v1/mypage/display/skill/detail/${params.id}`, {
    params: {
      order: 'ASC',
      page: params.page ?? 1,
      limit: LIMIT,
    },
    headers: appendGgjHeader({req})
  })
  !data.data.error && ((data.data.data as TSkillDetail).infoSkillDetail.id = params.id)
  return data.data
}

export const getSkillServiceDetailTab = async (id: number, page: number, tab = 1): Promise<TGgjRes<TSkillDetail['buyersSkillDetail']>> => {
  const data = await http.get<TGgjRes<TSkillDetail['buyersSkillDetail']>>(`/api/skijan/v1/mypage/display/skill/detail/${id}/buyers`, {
    params: {
      tab: tab ?? 1,
      order: 'ASC',
      page: page,
      limit: LIMIT,
    },
  })
  return data.data
}

// memorizing selectors
export const priceSelector = createSelector(
  (state: AppState) => state[ns] as State,
  (state: State) => {
    if(!state?.data) return {
      specialDiscountPrice: 0,
      price: 0,
      specialDiscountStartAt: 0,
      specialDiscountEndAt: 0,
    }
    return {
      specialDiscountPrice: state.data.infoSkillDetail.specialDiscountPrice,
      price: state.data.infoSkillDetail.price,
      specialDiscountStartAt: (state.data.infoSkillDetail.specialDiscountStartAt) ?? 0,
      specialDiscountEndAt: (state.data.infoSkillDetail.specialDiscountEndAt) ?? 0,
    }
  },
  {
    // New in 4.1: Pass options through to the built-in `defaultMemoize` function
    memoizeOptions: {
      maxSize: 10,
      resultEqualityCheck: (a: {data: TSkillDetail}, b: {data: TSkillDetail}) => {
        if(!a.data || !b.data) return false

        // in case d and b have data, check this condition
        return (
          a.data.infoSkillDetail.price !== b.data.infoSkillDetail.price ||
          a.data.infoSkillDetail.isSpecialDiscount !== b.data.infoSkillDetail.isSpecialDiscount ||
          a.data.infoSkillDetail.specialDiscountStartAt !== b.data.infoSkillDetail.specialDiscountStartAt ||
          a.data.infoSkillDetail.statusType !== b.data.infoSkillDetail.statusType ||
          a.data.infoSkillDetail.specialDiscountEndAt !== b.data.infoSkillDetail.specialDiscountEndAt
        )
      },
    }
  }
)

// memorizing selectors
type DetailInfoSelectorReturnType = {
  numberSalesCompleted: number
  totalItem: number
  stars: number
  price: number
  isSpecialDiscount: number
  updatedAt: number
  statusType: number
  id: number
  imageUrl: string
}
export const detailInfoSelector = createSelector(
  (state: AppState) => state[ns] as State,
  (state: State) => {
    if(!state?.data) return {
      numberSalesCompleted: 0,
      totalItem: 0,
      stars: 0,
      price: 0,
      isSpecialDiscount: 0,
      statusType: 0,
      updatedAt: 0,
      id: -1,
      imageUrl: '',
    }
    return {
      numberSalesCompleted:  state.data.infoSkillDetail.numberSalesCompleted,
      totalItem: state.data.buyersSkillDetail.pagingMeta.totalItem,
      stars: state.data.infoSkillDetail.stars,
      price: state.data.infoSkillDetail.price,
      updatedAt: state.data.infoSkillDetail.updatedAt ?? 0,
      statusType: state.data.infoSkillDetail.statusType,
      isSpecialDiscount: state.data.infoSkillDetail.isSpecialDiscount,
      id: state.data.infoSkillDetail.id,
      imageUrl: state.data.infoSkillDetail.imageUrl,
    }
  },
  {
    memoizeOptions: {
      resultEqualityCheck: (a: DetailInfoSelectorReturnType, b: DetailInfoSelectorReturnType) => {
        return (
          a.numberSalesCompleted === b.numberSalesCompleted &&
          a.totalItem === b.totalItem &&
          a.stars === b.stars &&
          a.price === b.price &&
          a.updatedAt === b.updatedAt &&
          a.statusType === b.statusType &&
          a.id === b.id &&
          a.isSpecialDiscount !== b.isSpecialDiscount &&
          a.imageUrl !== b.imageUrl
        )
      },
    }
  }
)

// memorizing selectors
export const onSaleListSelector = createSelector(
  (state: AppState) => state[ns] as State,
  (state: State) => {
    if(!state?.data) return []
    return state?.data.buyersSkillDetail.data
  },
  {
    memoizeOptions: {
      maxSize: 10,
      equalityCheck: (a: TSkillDetail['buyersSkillDetail']['data'], b: TSkillDetail['buyersSkillDetail']['data']) => {
        return a?.length !== b?.length
      }
    }
  }
)
