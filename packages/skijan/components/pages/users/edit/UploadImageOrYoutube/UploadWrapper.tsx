import {ChangeEvent, memo, useCallback, useContext, useEffect, useRef, useState} from 'react'
import {css} from '@emotion/react'
import {Box, IconButton, useTheme} from '@mui/material'
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import UploadYoutube from './UploadYoutube'

import {
  Action,
  DispatchContext,
  OptFileContext,
  StateContext,
  UploadTypes,
} from '../../../../commons/GgjUploadImagesOrYoutube/UploadImagesOrYoutubeContext'
import {dateFormat, formatDate} from '../../../../../common/date'
import TrashIcon from '../../icons/TrashIcon'
import {actions, IPortfolio, ns} from '../../../../../store/usersSlice'
import {useAppDispatch, useAppSelector} from '../../../../../store/hooks'
import {getImgUrlFromJSON, NO_PORTFOLIO_IMG, isImageItem} from '../const'

const UploadWrapper = () => {
  const theme = useTheme()
  const dispatch = useContext(DispatchContext)
  const dispatchStore = useAppDispatch()
  const state = useContext(StateContext)
  const fileInputField = useRef<HTMLInputElement>(null)
  const {acceptType, maxSize} = useContext(OptFileContext)
  const date = formatDate(new Date(), dateFormat)
  const item = state.listImagesOrYoutube[0]
  const [type, setType] = useState<string>((item || {}).type || '')
  const index = 0
  const dataItem: IPortfolio = useAppSelector((state) => state[ns]?.portfolioSelected)
  const isRevokeImg: boolean = useAppSelector((state) => state[ns]?.isRevokeImg)
  const [imageSrc, setImageSrc] = useState<string>('')
  const dispatchUserSlice = useAppDispatch()

  useEffect(() => {
    if (!dataItem) return
    if(dataItem.url) setImageSrc(getImgUrlFromJSON(dataItem))
    else setImageSrc(NO_PORTFOLIO_IMG)
    setType(!isImageItem(dataItem) ? UploadTypes.Youtube : '')
  },[dataItem])

  useEffect(() => {
    if (!item) return
    if ('thumbnailUrl' in item && item.thumbnailUrl) {
      setImageSrc(item.thumbnailUrl)
      setType(UploadTypes.Youtube)
    }
    if ('imageUrl' in item && item.imageUrl) setImageSrc(item.imageUrl)
  },[item])

  useEffect(() => {
    if(!isRevokeImg) return
    dispatch({type: Action.RemoveImage, payload: {index, item: item, type}})
    dispatchUserSlice(actions.setIsRevokeImg(false))
  },[isRevokeImg])

  const handleClickUpload = useCallback(() => {
    if (fileInputField.current) {
      fileInputField.current.click()
    }
  },
  [])

  const onDelete = () => {
    setType('')
    setImageSrc(NO_PORTFOLIO_IMG)
    if(dataItem.id) dispatchStore(actions.deletePortfolioSelectedUrl())
    if(item) dispatch({type: Action.RemoveImage, payload: {index, item: item, type}})
  }

  const uploadImages = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const {files} = event.target
    if (files) handleUpload(files)
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [])

  const handleUpload = async(files: FileList) => {
    const maxFiles = 1
    if (files.length == 0) return
    await dispatch({type: Action.RemoveImage, payload: {index, item: item, type}})
    await dispatch({
      type: Action.AddImages, payload: {files, maxFiles, date, acceptType, maxSize}
    })
    if (fileInputField.current) {
      fileInputField.current.value = ''
    }
  }

  return (
    <div css={css`display: flex;
      flex-direction: column;
      align-items: center;`}>
      <input type={'file'} css={css`display: none`} accept={acceptType} ref={fileInputField} onChange={e => {uploadImages(e)}}/>
      <div css={css`
        width: 297px;
        height: 297px;
        margin-top: 10px;
        position: relative;
        background: ${theme.palette.smoke.light};
        overflow: hidden;
        padding-top: calc(100% / (3 / 1));
      `}>
        {
          imageSrc !== NO_PORTFOLIO_IMG && <img src={imageSrc} alt="" css={css`
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
        }
        {/*UPLOAD*/}
        { type !== UploadTypes.Youtube &&
          <>
            <IconButton color="primary" aria-label="upload avatar" component="span" css={css`
                height: 100px;
                width: 100px;
                padding: 8px;
                border: 1px solid ${theme.palette.smoke.light};
                position: absolute;
                background: #C2C3BC;
                opacity: 0.7;
                text-align: center;
                left: calc(50% - 50px);
                bottom: calc(50% - 50px);
                :hover {
                  background: #999999;
                }
              `} onClick={handleClickUpload}>
              <PhotoCameraOutlinedIcon css={css`color: #ffffff; font-size: 50px;`}/>
            </IconButton>
          </>
        }
        {/*DELETE*/}
        <IconButton onClick={onDelete} color="primary" aria-label="upload portfolio" component="span" css={css`
                height: 30px;
                width: 30px;
                background: ${theme.palette.canvas.light};
                position: absolute;
                text-align: center;
                top: 18px;
                right: 21px;
                opacity: 0.7;
                cursor: pointer;
                z-index: 1;
                :hover {
                  background: ${theme.palette.canvas.light};
                }
              `}>
          <TrashIcon
            css={css`
                  width: 14px;
                  height: 15px;
                  color: ${theme.palette.ruby.main};
                `}
          />
        </IconButton>
        {/*YOUTUBE*/}
        { type == UploadTypes.Youtube && <>
          <Box color="primary" aria-label="upload avatar" component="span" css={css`
            position: absolute;
            top: calc(50% - ${theme.spacing(6)}/2);
            left: calc(50% - ${theme.spacing(6)}/2);
            text-align: center;
            background: #C2C3BC;
            border-radius: 50%;
            border: none;
            width: ${theme.spacing(6)};
            height: ${theme.spacing(6)};
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
          `}>
            <PlayArrowIcon css={css`
              width: 24px;
              height: 24px;`}/>
          </Box>
        </>
        }
      </div>
      {/*YOUTUBE*/}
      <UploadYoutube />
    </div>
  )
}
export default memo(UploadWrapper)
