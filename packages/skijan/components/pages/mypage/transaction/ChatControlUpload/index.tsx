import {optFile} from './const'

export * from './const'
import React, {memo} from 'react'
import {NoSsr} from '@mui/material'
import {ChatModal} from './ChatModal'
import {UploadImagesOrFilesProvider} from './ChatUploadContext'

export const nsTranUploadFiles = 'common@upload-images-or-files'

function UploadImgsOrFiles(props: {
  open: boolean,
  onCloseModal: () => void,
  maxSize: number,
  maxFiles: number,
  totalSize: number,
  acceptType: string
}) {

  const optFile = {
    maxSize: props.maxSize,
    maxFiles: props.maxFiles,
    totalSize: props.totalSize,
    acceptType: props.acceptType
  }

  return (
    <NoSsr>
      <UploadImagesOrFilesProvider optFile={optFile}>
        <ChatModal open={props.open} onCloseModal={props.onCloseModal} />
      </UploadImagesOrFilesProvider>
    </NoSsr>
  )
}

UploadImgsOrFiles.defaultProps = {
  open: false,
  onCloseModal: null,
  maxSize: 100,
  maxFiles: 5,
  totalSize: 500,
  acceptType: optFile.acceptType
}

export const ChatUpload = memo(UploadImgsOrFiles)
