import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {UploadTypes} from 'components/commons/GgjUploadImagesOrYoutube/UploadImagesOrYoutubeContext'

export type ImageItemType = {
  type: UploadTypes.Image
  imageUrl: string
  createdAt?: string
  imageName?: string
  number?: number
  updatedAt?: string
}
export type YoutubeItemType = {
  type: UploadTypes.Youtube
  thumbnailId: string
  thumbnailUrl: string
  videoUrl: string
  updatedAt?: string
  createdAt?: string
}
export type ItemType = YoutubeItemType | ImageItemType

// namespace
export const ns = 'imageViewer'

// state interface
interface State {
  viewingData: ItemType[],
  firstViewingIndex: number
}

// initial state
const initialState: State = {
  viewingData: [],
  firstViewingIndex: 0
}

// slice
export const slice = createSlice({
  name: ns,
  initialState,
  reducers: {
    setViewingImages(state, action: PayloadAction<ItemType[]>) {
      state.viewingData = action.payload
    },
    setFirstViewingImageIndex(state, action: PayloadAction<number>) {
      state.firstViewingIndex = action.payload
    },
  },

})

export const {actions} = slice
export default slice
