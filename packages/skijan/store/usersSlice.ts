import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {IPaging} from 'app'
import http from 'common/http'
import { IGgjReviewBoxMeta } from 'components/commons/GgjReviewBox'
import {HYDRATE} from 'store/reduxWrapper'
import {
  CAREER,
  CLOSED,
  INTRO,
  MY_SKILL,
  PORTFOLIO,
  QUALIFICATION,
  SCHEDULE,
  SPECIALTY, VIEW, EDIT, getHashImg,
} from '../components/pages/users/edit/const'

//namespace
export const ns = 'usersSlice'

const API_URL = '/api/skijan/v1/users'
const UPLOAD_URL = '/upload/v3/skijan/users'
const IMG_URL = '/img/v3/skijan/users'
// TODO: - An refactor later, get response from api
const IMG_URL_NO_CACHE = '/img/no-cache/skijan/users'

export type TUserSettingMode =
  | typeof CLOSED
  | typeof SCHEDULE
  | typeof INTRO
  | typeof SPECIALTY
  | typeof MY_SKILL
  | typeof CAREER
  | typeof QUALIFICATION
  | typeof PORTFOLIO

export const DELETE_BANNER = 'deleteBanner'

export type TModalMode = 'deleteBanner' | 'deletePortfolioImage' | ''

//interface
export interface IDialog {
  title: string
  description: string
  closeText: string
  okText: string
  mode: TModalMode
}

export interface TUser {
  isOwner: boolean
  mode: typeof VIEW | typeof EDIT
  settingMode: TUserSettingMode
  userDialog: IDialog | object
  avatar: string
  banner: string
  showUploadAvatarModal: boolean
  showUploadBannerModal: boolean
  user: IUserInfo
  userSelfIntroduce: IUserSelfIntro
  careers: IUserCareer[]
  mySkills: IUserSkill[]
  portfolios: IPortfolio[]
  specialty: ISpecialty[]
  qualifications: IUserQualification[]
  confirmDialogData: IDialog | object
  portfolioSelected: IPortfolio | object
  isRevokeImg: boolean
  resetYoutubeLink: boolean
  showEditForm: boolean
  editItem: IEditItem<IUserCareer | IUserSkill | ISpecialty | IUserQualification | object>
}

export interface IEditItem<T> {
  data: T
}

export interface ISkillReviews {
  data: IGgjReviewBoxMeta[]
  pagingMeta: IPaging
}

export interface ISkillList {
  data: ISkillItem[]
  pagingMeta: IPaging
}

export interface ISkillItem {
  skillId: number
  statusType: number
  userId: number
  title: string
  price: number
  isSpecialDiscount: number
  specialDiscountPrice: number
  reviewStar: number
  favorite: number
}

export interface IUserInfo {
  id: number
  nickName: string
  birthday: string
  sexType: number
  isCorporation: number
  prefectureId: number
  prefectures: string
  saleCount: number
  isNda: number
  isIdentity: number
  reviewStar: number
  lastLoginAt: number
}

export interface IUserSelfIntro {
  id: number
  isEdit: number
  title: string
  content: string
  schedule: string
  isDisplayAge: number
  isDisplayResidential: number
  isDisplayGender: number
}

export interface IUserCareer {
  id: number
  belong: string
  job: string
  from: number
  to: number
  detail: string
}

export interface IUserSkill {
  id: number
  name: string
  experienceYears: number
  experienceMonth: number
  note: string
}

export interface IPortfolio {
  id?: number
  url: string
  title: string
  content: string
  priority: number
}

export interface ISpecialty {
  id: number
  serviceCategoryLargeId: number
  serviceCategoryMiddle: string
  explain: string
}

export interface IUserQualification {
  id: number
  name: string
  qualificationYear: number
  qualificationMonth: number
}

export interface IIndexUser {
  user: IUserInfo
  userSelfIntroduce: IUserSelfIntro
  careers: IUserCareer[]
  mySkills: IUserSkill[]
  portfolios: IPortfolio[]
  specialty: ISpecialty[]
  qualifications: IUserQualification[]
}

// initial state
const initialState: TUser = {
  isOwner: false,
  mode: VIEW,
  settingMode: CLOSED,
  userDialog: {},
  showEditForm: false,
  showUploadAvatarModal: false,
  showUploadBannerModal: false,
  avatar: '',
  banner: '',
  confirmDialogData: {},
  user: {
    id: 0,
    isCorporation: 0,
    nickName: '',
    sexType: 0,
    birthday: '',
    isNda: 1,
    isIdentity: 0,
    prefectures: '',
    reviewStar: 0,
    saleCount: 9,
    prefectureId: 0,
    lastLoginAt: 0
  },
  userSelfIntroduce: {
    id: 0,
    isEdit: 0,
    title: '',
    content: '',
    schedule: '',
    isDisplayAge: 0,
    isDisplayResidential: 0,
    isDisplayGender: 0,
  },
  careers: [],
  mySkills: [],
  portfolios: [],
  specialty: [],
  qualifications: [],
  editItem: {
    data: {}
  },
  portfolioSelected: {},
  isRevokeImg: false,
  resetYoutubeLink: false
}
const userSlice = createSlice({
  name: ns,
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<IIndexUser>) {
      const data = action.payload
      const userId = data.user.id
      state.user = data.user
      state.userSelfIntroduce = data.userSelfIntroduce
      state.careers = data.careers
      state.mySkills = data.mySkills
      state.portfolios = data.portfolios
      state.specialty = data.specialty
      state.qualifications = data.qualifications
      state.banner = `${IMG_URL}/banner/${userId}?noDefaultImg=0`
      state.avatar = `${IMG_URL}/avatar/${userId}?noDefaultImg=0`
    },
    setUserSelfIntroduce(state, action: PayloadAction<IUserSelfIntro>) {
      state.userSelfIntroduce = action.payload
    },
    setSpecialty(state, action: PayloadAction<ISpecialty[]>) {
      state.specialty = action.payload
    },
    setMode: (state, action: PayloadAction<typeof VIEW |typeof EDIT>) => {
      state.mode = action.payload
    },
    setSettingMode: (state, action: PayloadAction<TUserSettingMode>) => {
      state.settingMode = action.payload
    },
    setIsOwner: (state, action: PayloadAction<boolean>) => {
      state.isOwner = action.payload
    },
    setUserDialog: (state, action: PayloadAction<IDialog>) => {
      state.userDialog = action.payload
    },
    setBannerNoCache: (state, action: PayloadAction<number>) => {
      state.banner = `${IMG_URL_NO_CACHE}/banner/${action.payload}?noDefaultImg=0&v=${(new Date().getTime())}`
    },
    setAvatarNoCache: (state) => {
      state.avatar = `${IMG_URL_NO_CACHE}/avatar/${state.user.id}?noDefaultImg=0&v=${(new Date().getTime())}`
    },
    setShowUploadAvatarModal: (state, action: PayloadAction<boolean>) => {
      state.showUploadAvatarModal = action.payload
    },
    setShowUploadBannerModal: (state, action: PayloadAction<boolean>) => {
      state.showUploadBannerModal = action.payload
    },
    setShowConfirmDialog: (state, action: PayloadAction<IDialog>) => {
      state.confirmDialogData = action.payload
    },
    resetConfirmDialog: (state) => {
      state.confirmDialogData = {}
    },
    selectPortfolio: (state, action: PayloadAction<number>) => {
      const item = state.portfolios.find(item => item.priority === action.payload)
      if(item) {
        state.portfolioSelected = item
      } else {
        state.portfolioSelected = {
          id: 0,
          url: '',
          title: '',
          content: '',
          priority: action.payload
        }
      }
    },
    deletePortfolioSelectedUrl: (state) => {
      const item = JSON.parse(JSON.stringify(state.portfolioSelected))
      item.url = ''
      state.portfolioSelected = item
    },
    setIsRevokeImg: (state, action: PayloadAction<boolean>) => {
      state.isRevokeImg = action.payload
    },
    onResetYoutubeLink: (state, action: PayloadAction<boolean>) => {
      state.resetYoutubeLink = action.payload
    },
    setPortfolios: (state, action: PayloadAction<Array<IPortfolio>>) => {
      state.portfolios = action.payload
    },
    setShowEditForm: (state, action: PayloadAction<boolean>) => {
      state.showEditForm = action.payload
    },
    setEditItem: (state, action: PayloadAction<IEditItem<any>>) => {
      state.editItem = action.payload.data
    },
    setMySkills: (state, action: PayloadAction<IUserSkill[]>) => {
      state.mySkills = action.payload
    },
    setCareers: (state, action: PayloadAction<IUserCareer[]>) => {
      state.careers = action.payload
    },
    setQualifications : (state, action: PayloadAction<IUserQualification[]>) =>{
      state.qualifications = action.payload
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

export const getReviews = async (id: string, cateId: string, page: number, star: string) => {
  const data = await http.get(`${API_URL}/${id}/skill-review?lci=${cateId}&page=${page}&star=${star} `)
  return data.data
}

export const getSkillList = async (id: number, body:{ page: number | 1, lci?: string | '0', isSelling?: string | '0'}) => {
  const data = await http.get(`${API_URL}/${id}/skill-list`, {params: body})
  return data.data
}

export const getUserInfo = async (id: number) => {
  const data = await http.get(`${API_URL}/${id}`)
  return data.data
}

export const updateSchedule = async (userId: number, schedule: string) => {
  const data = await http.put(`${API_URL}/${userId}/schedule`, {schedule: schedule})
  return data.data
}

export const updateIntro = async (userId: number, body: {title: string, content: string}) => {
  const data = await http.put(`${API_URL}/${userId}/introduce`, body)
  return data.data
}

export const uploadBanner = async (imageData: File, userId: number) => {
  const formData = new FormData()
  formData.append('file', imageData)
  const data = await http.post(`${UPLOAD_URL}/banner/${userId}`, formData, {
    params: {
      noDefault: 0
    }
  })
  return data.data
}

export const deleteBanner = async (userId: number) => {
  const data = await http.delete(`${UPLOAD_URL}/banner/${userId}`, {
    params: {
      noDefault: 0
    }
  })
  return data.data
}

export const uploadAvatar = async (imageData: File, userId: number) => {
  const formData = new FormData()
  formData.append('file', imageData)
  const data = await http.post(`${UPLOAD_URL}/avatar/${userId}`, formData, {
    params: {
      noDefault: 0
    }
  })
  return data.data
}

export const deletePortfolioImage = async (item: IPortfolio) => {
  const hash = getHashImg(item)
  const data = await http.delete(`${UPLOAD_URL}/portfolio/${item.id}/${hash}`, {
    params: {
      noDefault: 0
    }
  })
  return data.data
}

export const createPortfolio = async (item: IPortfolio) => {
  delete item.id
  const data = await http.post(`${API_URL}/portfolio`, item)
  return data.data
}

export const updatePortfolio = async (item: IPortfolio) => {
  const data = await http.put(`${API_URL}/portfolio/${item.id}`, item)
  return data.data
}

export const createItem = async (mode: string, body: any) => {
  const data = await http.post(`${API_URL}/${mode}`, body)
  return data.data
}

export const updateItem = async (id: number, mode: string, body: any) => {
  const data = await http.put(`${API_URL}/${mode}/${id}`, body)
  return data.data
}

export const deleteItem = async (id: number, mode: string) => {
  const data = await http.delete(`${API_URL}/${mode}/${id}`)
  return data.data
}

export const { actions } = userSlice
export default userSlice
