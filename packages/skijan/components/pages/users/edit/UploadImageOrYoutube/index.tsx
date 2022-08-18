import React, {memo} from 'react'
import {NoSsr} from '@mui/base'
import UploadWrapper from './UploadWrapper'
import {
  ImageTypes,
  UploadImagesOrYoutubeProvider, YoutubeTypes
} from '../../../../commons/GgjUploadImagesOrYoutube/UploadImagesOrYoutubeContext'
import PopupError from 'components/commons/GgjUploadImagesOrYoutube/PopupError'

function SingleUploadImageOrYoutube(props: {
  maxSize: number,
  acceptType: string,
  onChange: (listImages: Array<ImageTypes|YoutubeTypes>) => void,
  onRemove: (listImageRemove: Array<ImageTypes>) => void,
  value: string
}) {
  const optFile = {
    maxFiles: 1,
    acceptType: props.acceptType,
    maxSize: props.maxSize,
    isMobile: false
  }
  return (
    <NoSsr>
      <UploadImagesOrYoutubeProvider
        onChange={props.onChange}
        onRemove={props.onRemove}
        value={props.value}
        optFile={optFile}>
        <UploadWrapper />
        <PopupError/>
      </UploadImagesOrYoutubeProvider>
    </NoSsr>
  )
}

export const UploadImageOrYoutube = memo(SingleUploadImageOrYoutube)
