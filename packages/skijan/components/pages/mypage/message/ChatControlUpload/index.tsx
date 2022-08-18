import {FileTypes} from './const'

export * from './const'
import {memo, useContext, useMemo, useState} from 'react'
import {NoSsr, useTheme} from '@mui/material'
import { ChatModal } from './ChatModal'
import {StateContext, UploadImagesOrFilesProvider} from './ChatUploadContext'
import Badge from '@mui/material/Badge'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import {css} from '@emotion/react'
export const nsTranUploadFiles = 'common@upload-images-or-files'

const WrapperIconUpload = ({openUploadModal}:{openUploadModal:()=>void})=>{
  const theme = useTheme()
  const state = useContext(StateContext)
  const isHasFiles = useMemo(() => state.listFiles.length>0, [state.listFiles])
  return   <Badge
    color={isHasFiles ? 'primary' : 'default'}
    variant="dot"
  >
    <UploadFileIcon
      css={css`
                  cursor: pointer;
                  color: ${theme.palette.jade.light}
                `}
      onClick={openUploadModal}
    />
  </Badge>
}
function UploadImgsOrFiles(props: {
  onChange: (listFiles: Array<FileTypes>) => void
  maxSize: number
  maxFiles: number
  totalSize: number
  acceptType: string
  masterId: number
  createMessageUrl: string
  uploadFileUrl: string
}) {
  const optFile = {
    maxSize: props.maxSize,
    maxFiles: props.maxFiles,
    totalSize: props.totalSize,
    acceptType: props.acceptType,
  }
  const [open, setOpen] = useState(false)

  const openUploadModal = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  return (
    <NoSsr>
      <UploadImagesOrFilesProvider optFile={optFile} onChange={props.onChange}>
        <WrapperIconUpload openUploadModal={openUploadModal}/>
        <ChatModal open={open} onCloseModal={handleClose} />
      </UploadImagesOrFilesProvider>
    </NoSsr>
  )
}

UploadImgsOrFiles.defaultProps = {
  maxSize: 100,
  maxFiles: 5,
  totalSize: 500,
  acceptType: '.pdf,.jpg,.png,.mp3,.mp4,.zip',
  masterId: 0,
  createMessageUrl: '',
  uploadFileUrl: '',
}

export const ChatUpload = memo(UploadImgsOrFiles)
