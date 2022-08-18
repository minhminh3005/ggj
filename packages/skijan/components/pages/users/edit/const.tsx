import {IPortfolio} from '../../../../store/usersSlice'
import {YoutubeTypes} from '../../../commons/GgjUploadImagesOrYoutube/UploadImagesOrYoutubeContext'

export const CAREER = 'career'
export const SPECIALTY = 'specialty'
export const MY_SKILL = 'mySkill'
export const QUALIFICATION = 'qualification'
export const PORTFOLIO = 'portfolio'
export const SCHEDULE = 'schedule'
export const INTRO = 'intro'
export const CLOSED = 'closed'
export const VIEW = 'view'
export const EDIT = 'edit'

export const IMG_URL = '/img/v3/skijan/users/portfolio'
export const NO_PORTFOLIO_IMG = 'no-data'
export const HEADER_FORM = '70px'
export const validNumber = new RegExp(/-?\d+\.?\d*/)

export const getImgUrlFromJSON = (item: IPortfolio ) => {
  let data = {
    imageUrl: '',
    thumbnailUrl: ''
  }
  // in case JSON wrong format: Uncaught SyntaxError: Unexpected end of JSON input
  try {
    data = JSON.parse(item.url)
  } catch {
    return `${IMG_URL}/${item.id}/0?noDefaultImg=0`
  }
  if ('thumbnailUrl' in data && data.thumbnailUrl) return data.thumbnailUrl
  if ('imageUrl' in data && data.imageUrl) return data.imageUrl
  return `${IMG_URL}/${item.id}/0?noDefaultImg=0`
}

export const getYoutubeLink = (item: IPortfolio) => {
  try {
    const data: YoutubeTypes = JSON.parse(item.url)
    if ('thumbnailId' in data && data.thumbnailId)
      return `https://www.youtube.com/embed/${data.thumbnailId}?autoplay=0&mute=0`
  } catch {
    return ''
  }
  return ''
}

export const getHashImg = (item: IPortfolio) => {
  try {
    const data = JSON.parse(item.url)
    return (data.imageUrl || '').split('/').pop().split('?noDefaultImg=0')[0]
  } catch {
    return ''
  }
}

export const isImageItem = (item: IPortfolio) => {
  let data = { imageUrl: ''}
  try {
    data = JSON.parse(item.url)
    return Boolean('imageUrl' in data && data.imageUrl)
  } catch {
    return true
  }
}

export const intervals = [
  { label: '年以上前', seconds: 31536000 }, // year
  { label: 'ヶ月前', seconds: 2592000 }, // month
  { label: '週間前', seconds: 604800 }, // week
  { label: '日前', seconds: 86400 }, // day
  { label: '時間前', seconds: 3600 }, // hour
  { label: '分前', seconds: 60 }, // minute
  { label: '秒', seconds: 1 } // second
]

export function timeSince(date: number) {
  const seconds = Math.floor((Date.now() - date) / 1000)
  const interval = intervals.find(i => i.seconds < seconds)
  const count = Math.floor(seconds / (interval ? interval.seconds : 1))
  // return `${count} ${interval ? interval.label : ''}${count !== 1 ? 's' : ''} ago`;
  return `${count}${interval ? interval.label : ''}`
}

export function getYearAndMonth(data: number) {
  const date = data.toString()
  return {
    year: Number(date.slice(0,4)),
    month: Number(date.slice(-2)),
  }
}

// 10 - 19 return 10
// 20 - 29 return 20
export function getGeneration(age: number) {
  const ten = 10
  if(age < ten || age > ten*10) return age
  return Math.floor((age / ten) % ten) * ten
}
