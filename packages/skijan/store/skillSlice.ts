import {TGgjRes} from 'app'
import http, {appendGgjHeader} from 'common/http'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'store/reduxWrapper'
import {NextRequest} from 'next/server'
import { IGgjReviewBox } from 'components/commons/GgjReviewBox'

// namespace
export const ns = 'surfaceServiceDetail'

// state interface
export type TAPIResObject = {
  generalInfoSkill: {
    url: string
    catchcopy: string
    totalFavorite: number
    remainSkills: number
    totalSold: number
    outline: string
    isFavorite: boolean
    imageUrl: string
  }
  skillFAQs: {
    id: number
    question: string
    answer: string
  }[]
  skillReview: {
    noReview: number // number of review
    avgReviewStars: number
    masterTitle: string
    reviewRequirementDetails: {
      id: number
      name: string
      priority: number
      avgReviewStars: number
    }[]
    topReviews: IGgjReviewBox[]
  }
  sellerInfo: {
    nickName: string
    isNda: number
    identityStatus: number
    selfIntroduce: string
    sellerId: number
    imageUrl: string
  },
  skillsRelatedSeller: [
    {
      discountPrice: number|null
      isFavorite: number
      isSpecialDiscount: number
      price: number
      reviewStar: number
      sellerId: number
      skillId: number
      statusType: number
      title: string
      imageUrl: string
    },
  ],
  skillsRelatedCategory: {
    discountPrice: number|null
    isFavorite: number
    isSpecialDiscount: number
    price: number
    reviewStar: number
    sellerId: number
    skillId: number
    statusType: number
    title: string
    imageUrl: string
  }[]
  category: {
    large: number
    middle: number
    small: number
  },
  paymentInfo: {
    id: number
    statusType: number
    limit: number
    title: string,
    price: number
    isSpecialDiscount: boolean
    specialDiscountPrice: number
    specialDiscountEndAt: number
    listPaidOptions: {
      id: number
      optionName: string
      optionPrice: number
      isSelected: boolean
    }[]
  }
}
export type State = {
  apiResObj: TAPIResObject | null
}

// initial state
const initialState: State = {apiResObj: null}

// slice
const slice = createSlice({
  name: ns,
  initialState,
  reducers: {
    setData(state, action: PayloadAction<TAPIResObject>) {
      state.apiResObj = action.payload
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...(state ?? {}),
        ...action.payload[ns],
      }
    },
  },
})

export default slice

// ajax function
export async function getSkillDetails(req: NextRequest, id: string): Promise<TGgjRes<TAPIResObject>> {
  return (await http.get<TGgjRes<TAPIResObject>>(`api/skijan/v1/skill/${id}`, {
    headers: appendGgjHeader({req})
  })).data
}

export async function getSkillReview(id: string, reviewType: string|number): Promise<TGgjRes<TAPIResObject>> {
  return (await http.get<TGgjRes<TAPIResObject>>(`/api/skijan/v1/skill/review/${id}/paging`, {
    params: {
      stars: reviewType === 'all' ? 0 : reviewType,
      order: 'DESC',
      page: 1,
      limit: 5,
    }
  })).data
}
