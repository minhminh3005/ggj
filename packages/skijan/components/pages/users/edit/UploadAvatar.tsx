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
import { ChangeEvent, DragEvent, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {actions, ns, uploadAvatar} from 'store/usersSlice'
import {actions as commonActions, ns as commonNs} from '../../../../store/appSlice'
import {loadingOffHandler, loadingOnHandler} from '../../../../contexts/LoadingContext'
import {nsUserProfile} from '../../../../common/constant'

const ACCEPT_FILE_TYPE = '.png, .jpg, .bmp, .jpeg'
const ACCEPT_FILE_SIZE = 100

function UploadAvatar () {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(nsUserProfile)
  const showUploadAvatarModal = useAppSelector(state => state[ns]?.showUploadAvatarModal || false)
  const avatar = useAppSelector(state => state[ns]?.avatar || '')
  const [imageData, setImageData] = useState<File | null>(null)
  const [imageSrc, setImageSrc] = useState<string>('')
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const userId = useAppSelector(state => state[commonNs].auth.userId)

  const closeConfirmModal = () => {
    dispatch(actions.setShowUploadAvatarModal(false))
    setImageSrc(avatar)
    setImageData(null)
  }
  const getFileInput = (eventFiles : FileList | null) => {
    if(!eventFiles) return
    const ef = eventFiles[0]
    if(!checkExtension(ef, ACCEPT_FILE_TYPE) || !checkFileSize(ef, ACCEPT_FILE_SIZE /*MB*/)) {
      toastHandler({ message: t('extension-error'), type: 'error' })
      return
    }
    setImageData(ef)
    setImageSrc(URL.createObjectURL(ef))
  }
  const handleFileChange = (e : ChangeEvent<HTMLInputElement>) => {
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
      loadingOnHandler()
      const data = await uploadAvatar(imageData, userId)
      if(data.error) {
        toastHandler({type: 'error', message: t('upload-avatar-fail')})
        loadingOffHandler()
      } else {
        dispatch(actions.setAvatarNoCache())
        dispatch(commonActions.setUserAvatarNoCache())
        setImageSrc('')
        URL.revokeObjectURL(imageSrc)
        // toastHandler({type: 'success', message: t('upload-avatar-success')})
        loadingOffHandler()
      }

    } catch (error) {
      console.log(error)
    }
  }
  const handleUploadAvatarDebounced = ggjDebounce(handleUploadAvatar)

  return (
    <Modal
      open={showUploadAvatarModal}
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
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragEnd={handleDragLeave}
          css={css`
            width: 100%;
            height: 100%;
            padding-top: calc(100% / (1 / 1));
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            opacity: ${isDragOver ? '0.7' : '1'};
          `}
        >
          <img src={imageSrc || avatar} alt="avatar" css={css`
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              object-fit: cover;
              object-position: center;
          `}/>
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
          box-shadow: 0 0 0 300px rgba(0,0,0,0.4);
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
              accept={ACCEPT_FILE_TYPE}
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
            >{t('1')}</Button>
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
          >{t('2')}</Button>
        </Stack>
      </Box>
    </Modal>
  )
}
export default UploadAvatar
