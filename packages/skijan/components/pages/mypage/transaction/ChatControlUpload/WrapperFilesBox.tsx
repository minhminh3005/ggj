import {DispatchContext,Action} from './ChatUploadContext'
import {CLOSE} from '../const'
import {FileTypes} from './const'
import FileItem from '../FileItem'
import {useTheme} from '@mui/material'
import React, {memo, useContext} from 'react'

const WrapperFilesBox = ({index, item}: { item: FileTypes, index: number }) => {
  const theme = useTheme()
  const dispatch = useContext(DispatchContext)
  const handleRemove = () => {
    dispatch({type: Action.RemoveFile, payload: {index, item: item}})
  }
  return (
    <FileItem key={index} ext={item.extension}
      name={item.fileName} imgSrc={item.fileUrl}
      colorIcon="#ffffff"
      colorBgIcon={theme.palette.primary.main}
      colorText={theme.palette.jade.light}
      btnMode={CLOSE} onClickDownloadIcon={handleRemove} />
  )
}
export default memo(WrapperFilesBox)
