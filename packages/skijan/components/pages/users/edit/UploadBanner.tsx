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
import {actions, ns, uploadBanner} from 'store/usersSlice'
import { ns as commonNs } from 'store/appSlice'
import {loadingOffHandler, loadingOnHandler} from '../../../../contexts/LoadingContext'
import {nsUserProfile} from '../../../../common/constant'

const ACCEPT_FILE_TYPE = '.png, .jpg, .bmp, .jpeg'
const ACCEPT_FILE_SIZE = 100

function UploadBanner () {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(nsUserProfile)
  const showUploadBannerModal = useAppSelector(state => state[ns]?.showUploadBannerModal)
  const banner = useAppSelector(state => state[ns]?.banner || '')
  const [imageData, setImageData] = useState<File | null>(null)
  const [imageSrc, setImageSrc] = useState<string>('')
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const userId = useAppSelector(state => state[commonNs].auth.userId)

  const closeConfirmModal = () => {
    dispatch(actions.setShowUploadBannerModal(false))
    setImageSrc('')
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
  const handleUploadBanner = async () => {
    if(!imageData) return
    try {
      closeConfirmModal()
      loadingOnHandler()
      const data = await uploadBanner(imageData, userId)
      if (data.error) {
        toastHandler({type: 'error', message: t('upload-banner-fail')})
      } else {
        dispatch(actions.setBannerNoCache(userId))
        setImageSrc('')
        URL.revokeObjectURL(imageSrc)
        // toastHandler({type: 'success', message: t('upload-banner-success')})
      }
      loadingOffHandler()
    } catch (error) {
      console.log(error)
    }
  }
  const handleUploadBannerDebounced = ggjDebounce(handleUploadBanner)

  return (
    <Modal
      open={showUploadBannerModal || false}
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
      width: 1100px;
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
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            padding-top: calc(100% / (3 / 1));
            opacity: ${isDragOver ? '0.7' : '1'};
            background: ${theme.palette.canvas.light};
          `}
        >
          <img src={imageSrc || banner} alt="banner" css={css`
              height: 100%;
              width: 100%;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              position: absolute;
              object-fit: cover;
              object-position: center;
          `}/>
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
            onClick={handleUploadBannerDebounced}
          >{t('2')}</Button>
        </Stack>
      </Box>
    </Modal>
  )
}
export default UploadBanner
