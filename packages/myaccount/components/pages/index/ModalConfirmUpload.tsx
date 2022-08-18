import { css } from '@emotion/react'
import { Close, Save, Upload } from '@mui/icons-material'
import {
  Box, Button, IconButton, Modal, Stack
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { checkExtension, checkFileSize } from 'common/upload'
import { ggjDebounce } from 'common/utils'
import { toastHandler } from 'contexts/ToastContext'
import { useTranslation } from 'next-i18next'
import { DragEvent, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { actions, nsIndex, uploadAvatar } from 'store/indexSlice'

const nsTran = 'components@index'
const ACCEPT_FILES_TYPE = '.png, .jpg, .bmp, .jpeg'


function ModalConfirmUpload () {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(nsTran)

  const isShowConfirmUploadModal = useAppSelector(state => state[nsIndex].isShowConfirmUploadModal)
  const id = useAppSelector(state => state[nsIndex].data.id)
  const avatar = useAppSelector(state => state[nsIndex].avatar)
  const [imageData, setImageData] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)

  // method
  const closeConfirmModal = () => {
    dispatch(actions.setIsShowConfirmUploadModal(false))
    setImageData(null)
  }
  const getFileInput = (eventFiles : FileList | null) => {
    if(!eventFiles) return
    if(eventFiles.length > 1) return
    if(!checkExtension(eventFiles[0], ACCEPT_FILES_TYPE) || !checkFileSize(eventFiles[0], 100 /*MB*/)) {
      toastHandler({ message: t('extension-error'), type: 'error' })
      return
    }
    setImageData(eventFiles[0])
  }
  const handleFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    getFileInput(e.target.files)
  }
  const handleDragOver = (e : DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }
  const handleDragLeave = (e : DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }
  const handleDrop = (e : DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    handleDragLeave(e)
    getFileInput(e.dataTransfer.files)
  }
  const handleUploadAvatar = async () => {
    if(!imageData) return
    try {
      closeConfirmModal()
      const statusMessage = {
        SUCCESS: t('upload-success'),
        ERROR: t('upload-fail')
      }
      await dispatch(uploadAvatar(imageData, id, statusMessage))
    } catch (error) {
      console.log(error)
    }
  }
  const handleUploadAvatarDebounced = ggjDebounce(handleUploadAvatar)

  return (
    <Modal
      open={isShowConfirmUploadModal || false}
      onClose={closeConfirmModal}
      aria-labelledby="modal-label-confirm-upload-avatar"
      aria-describedby="modal-description-confirm-upload-avatar"
    >
      <Box css={css`
      position: absolute;
      top: 50%;
      left: calc(50% - ${theme.spacing(4)});
      transform: translate(-50%, -50%);
      border-radius: 4px;
      background: #fff;
      width: 400px;
      overflow: hidden;
      margin: ${theme.spacing(4)};
      max-width: 90vw;
      outline: none;
    `}>
        <IconButton onClick={closeConfirmModal} aria-label="close" css={css` margin-left: auto; display: flex; justify-content: flex-end;`}>
          <Close/>
        </IconButton>
        {/* TODO: HUYNH add resize and crop function */}
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragEnd={handleDragLeave}
          css={css`
            width: 100%;
            aspect-ratio: 1 / 1;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            background: #fff;
            opacity: ${isDragOver ? '0.7' : '1'};
          `}
        >
          <img
            src={(imageData && window.URL.createObjectURL(imageData))|| avatar}
            alt="Avatar"
            css={css`
              max-width: 100%;
              max-height: 100%;
            `}
          />
          <Box css={css`
          width: 95%;
          aspect-ratio: 1 / 1;
          content: '';
          border-radius: 50%;
          background: transparent;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0px 0px 0px 300px rgba(0,0,0,0.4);
          transition: all 0.3s linear;`}/>
        </Box>
        <Stack
          alignItems="center"
          p={3}
          justifyContent="flex-end"
          spacing={2}
          direction="row"
        >
          <label htmlFor="upload-avatar">
            <input
              type="file"
              accept={ACCEPT_FILES_TYPE}
              name="upload-avatar"
              id="upload-avatar"
              css={css` display: none;`}
              onChange={handleFileChange}
            />
            <Button
              variant="outlined"
              size="medium"
              component="span"
              css={css`
              white-space: nowrap;
              text-overflow: ellipsis;
              color: ${theme.palette.primary.main};
              border: 1px solid ${theme.palette.primary.main};
              &:hover, &:focus {
                color: ${theme.palette.primary.main};
                border: 1px solid ${theme.palette.primary.main};
                background: ${theme.palette.success.light};
              }
            `}
              startIcon={<Upload/>}
            >{t('23')}</Button>
          </label>
          <Button
            variant="contained"
            size="medium"
            disabled={!imageData}
            css={css`
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #fff;
            background: ${theme.palette.primary.main};
            &:disabled {
              background: ${theme.palette.primary.main};
            }
            &:hover, &:focus {
              background: ${theme.palette.primary.dark};
            }

          `}
            startIcon={<Save/>}
            onClick={handleUploadAvatarDebounced}
          >{t('24')}</Button>
        </Stack>
      </Box>
    </Modal>
  )
}
export default ModalConfirmUpload
