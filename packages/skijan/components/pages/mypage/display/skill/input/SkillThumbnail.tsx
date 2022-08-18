import {css} from '@emotion/react'
import {useTranslation} from 'next-i18next'
import {CameraAltOutlined, UploadFile, Close} from '@mui/icons-material'
import {Box, IconButton, Input, Stack, Typography, Avatar} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import UploadPhotoIcon from 'components/icons/UploadPhotoIcon'
import {GgjOutlineButton} from 'components/commons/GgjButton'
import {ChangeEvent, DragEvent, MouseEvent, memo, useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {useAppDispatch, useAppSelector} from 'store/hooks'
import {ns, actions} from 'store/mypage/display/skill/skillInputSlice'
import {checkExtension, checkFileSize} from 'common/upload'
import {toastHandler} from 'contexts/ToastContext'
import {
  skillAvatarUrl, SkillType,
  THUMB_ACCEPT_FILE_TYPE,
  THUMB_MAX_FILE_SIZE
} from 'components/pages/mypage/display/skill/input/const'
import {Action, DispatchContext, ThumbImageContext} from './SkillContextProvider'
import {imgUrlToFile, nsTran} from 'components/pages/mypage/display/skill/input/const'
import {rgba} from 'emotion-rgba'


const DesktopUploadBox = memo(function DesktopUploadBox(props: {
  getFileInput: (eventFiles : FileList | null) => void
}) {
  const theme = useTheme()
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const isDisableAllInput = useAppSelector(state => state[ns].isDisableAllInput)
  const { t } = useTranslation(nsTran)
  const {getFileInput} = props

  const handleDragOver = (e : DragEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }
  const handleDragLeave = (e : DragEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }
  const handleDrop = (e : DragEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleDragLeave(e)
    getFileInput(e.dataTransfer.files)
  }

  return (
    <form
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragLeave}
      css={css`
        width: 100%;
        height: 156px;
        flex-grow: 1;
        background-color: ${isDragOver ? theme.palette.smoke.light : '#ffffff'};
        background-image:  url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23626262FF' stroke-width='2' stroke-dasharray='8%2c8' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
        border-radius: 10px;
        display: none;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
          display: block;
        }
    `}>
      <Stack direction="column" spacing={2} px={4} alignItems="center" justifyContent="center" css={css` height: 100%;`}>
        <Stack direction={{md: 'column', lg: 'row'}} rowGap={2} spacing={{md:2 ,lg: 4}} flexWrap="wrap" alignItems="center" justifyContent="center">
          <Typography variant="subtitle1" fontWeight="medium" textAlign="center"  >{ t('1') }</Typography>
          <label htmlFor="skill-thumbnail" css={css` flex-shrink: 0;`}>
            {/*@ts-ignore*/}
            <GgjOutlineButton component={isDisableAllInput ? 'button' : 'span'}>
              <UploadFile css={css`margin-right: ${theme.spacing(2)};`}/>{t('2')}
            </GgjOutlineButton>
          </label>
        </Stack>
        <Typography variant="subtitle1" fontWeight="medium" >{ t('3') }</Typography>
      </Stack>
    </form>
  )
})

const UserAvatar = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isHasAvatar = useAppSelector(state => state[ns].product.isHasAvatar)
  const isHasCloneAvatar = useAppSelector(state => state[ns].cloneData.isHasAvatar)
  const cloneId = useAppSelector(state => state[ns].cloneData.id)
  const thumbUrl = useAppSelector(state => state[ns].product?.imageUrl)
  const statusType = useAppSelector(state => state[ns].product?.statusType)

  const {thumbImage} = useContext(ThumbImageContext)
  const contextDispatch = useContext(DispatchContext)
  const thumbTempUrl = useMemo(() => thumbImage ? URL.createObjectURL(thumbImage) : '', [thumbImage])


  const setThumb = (file: (File | null)) => {
    contextDispatch({
      type: Action.UPDATE_THUMB_IMAGE,
      payload: file
    })
  }
  const handleClickDeleteAvatar = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    thumbImage && setThumb(null)
    if(isHasAvatar) {
      dispatch(actions.setIsCallApiDeleteAvatar(true))
      dispatch(actions.setThumbUrl(''))
    }
  }

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(thumbTempUrl)
    }
  },[thumbTempUrl])

  useEffect(() => {
    type TFileRes = {file: File | null , url: string}
    (async() => {
      if(!isHasCloneAvatar) return
      return await imgUrlToFile(skillAvatarUrl + cloneId, 'thumbImages')
    })().then(img => setThumb(img ? (img as TFileRes).file : null))
  }, [isHasCloneAvatar])

  return (
    <>
      {
        Boolean((isHasAvatar && thumbUrl) || thumbTempUrl)
        && <Box css={css` width: 100%; height: 100%; position: relative;`}>
          <Avatar
            variant="square"
            css={css` width: 100%; height: 100%;`}
            src={thumbTempUrl || thumbUrl}
            alt="Skill Thumb"
          />
          {
            statusType !== SkillType.CLOSE &&
            <IconButton
              aria-label="delete avatar"
              onClick={handleClickDeleteAvatar}
              css={css`
              position: absolute;
              top: 4px;
              right: 4px;
              width: ${theme.spacing(4)};
              height: ${theme.spacing(4)};
              background-color: ${rgba(theme.palette.jade.dark, 0.5)};
              color: ${theme.palette.common.white};
              &:hover,
              &:focus {
                background-color: ${rgba(theme.palette.jade.dark, 0.68)};
              }
            `}
            >
              <Close css={css` width: 14px; height: 14px;`}/>
            </IconButton>
          }
        </Box>
      }
    </>
  )
}

function SkillThumbnail() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const dispatch = useAppDispatch()
  const isShowRequiredThumbError = useAppSelector(state => state[ns].isShowRequiredThumbError)
  const {thumbRef} = useContext(ThumbImageContext)
  const contextDispatch = useContext(DispatchContext)

  const setThumb = (file: (File | null)) => {
    contextDispatch({
      type: Action.UPDATE_THUMB_IMAGE,
      payload: file
    })
  }
  const getFileInput = useCallback((eventFiles : FileList | null) => {
    if(!eventFiles) return
    if(eventFiles.length > 1 || eventFiles.length === 0) return
    if(!checkExtension(eventFiles[0], THUMB_ACCEPT_FILE_TYPE)) {
      toastHandler({ message: t('extension-error', {extension: THUMB_ACCEPT_FILE_TYPE}), type: 'error' })
      return
    }
    if(!checkFileSize(eventFiles[0], THUMB_MAX_FILE_SIZE)) {
      toastHandler({ message: t('max-size-error', {size: THUMB_MAX_FILE_SIZE}), type: 'error' })
      return
    }
    setThumb(eventFiles[0])
    dispatch(actions.setIsCallApiDeleteAvatar(false))
  },[])

  const handleChangeImage = (e : ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    getFileInput(e.target.files)
  }

  return (
    <Box
      mb={{xs: 3, lg: 5}}
      p={{xs: 3, lg: 4}}
      px={{lg: 6}}
      ref={thumbRef}
      css={css`
        @media (min-width: ${theme.breakpoints.values.lg}px) {
          background: ${theme.palette.grey[50]};
          border-radius: 15px;
        }
      `}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={4}
        alignItems={{xs: 'center', lg: 'flex-end'}}
      >
        <Stack alignItems={{ xs: 'center', lg: 'flex-start' }}>
          <Typography variant="caption" mb={1} color={theme.palette.text.primary} >{ t('4') }</Typography>
          <Box
            component="label"
            htmlFor="skill-thumbnail"
            css={css`
            width: 156px;
            height: 156px;
            border-radius: 10px;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            margin-bottom: 0 !important;
        `}>
            <UserAvatar />
            <Box css={css`
            width: 156px;
            height: 156px;
            background: ${theme.palette.divider};
            text-align: center;
          `}>
              <UploadPhotoIcon css={css`
              width: 120px;
              height: 120px;
              margin-top: ${theme.spacing(2)};
              fill: ${theme.typography.subtitle1.color};
            `} />
            </Box>
            <Input
              type="file"
              onChange={handleChangeImage}
              inputProps={{ accept: THUMB_ACCEPT_FILE_TYPE }}
              id="skill-thumbnail"
              css={css` display: none;`}
            />
            <IconButton aria-label="upload thumbnail" component="span" css={css`
            position: absolute;
            bottom: 4px;
            right: 0;
            @media (min-width: ${theme.breakpoints.values.lg}px) {
              display: none;
            }
          `}>
              <CameraAltOutlined css={css`
                width: 32px;
                height: 32px;
                padding: 4px;
                background: ${theme.typography.subtitle1.color};
                color: #fff;
                border-radius: 50%;
                `} />
            </IconButton>
          </Box>
        </Stack>
        <DesktopUploadBox getFileInput={getFileInput} />
      </Stack>
      {isShowRequiredThumbError &&
        <Typography
          component="p"
          variant="caption"
          color="error.main"
          textAlign={{xs: 'center', lg: 'left'}}
          mt={1}
        >{t('required-avatar')}</Typography>
      }
    </Box>
  )
}

export default memo(SkillThumbnail)
