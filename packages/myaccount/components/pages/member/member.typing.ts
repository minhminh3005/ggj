// using for get/post (integrate) with api
// GET/POST: /api/myaccount/v1/member
export interface TMemberInfo {
  id: number
  firstName: string
  lastName: string
  isCorporation: boolean
  firstNameKana: string
  lastNameKana: string
  corporateName: string
  registrationNumber: string
  zip: string
  address1: string
  address2: string
  address3: string
  prefectureId: number | string
  sexType: number
  birthday: number | null
  isNda: boolean
  identity: number
  nda: string | null
  transaction: string | null
  prefectures: TPrefectureData[]
  isTransaction: boolean
  tel: string
  nickName: string
}

// using for hook form
export interface MemberFormData extends Omit<TMemberInfo, 'prefectures' | 'identity' | 'sexType' | 'isCorporation' | 'id'> {
  sexType: 'other' | 'male' | 'female',
  isCorporation: 'true' | 'false',
}
export const nsTran = ['components@member', 'common@common-error']
export const MapSexType = {
  // map
  0: 'other',
  1: 'male',
  2: 'female',

  // map reserve
  'other': 0,
  'male': 1,
  'female': 2,
}
export interface TPrefectureData {
  id: number
  name: string | null
}
