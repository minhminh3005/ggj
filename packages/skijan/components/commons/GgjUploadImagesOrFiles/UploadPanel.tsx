import {Stack, Typography, useTheme} from '@mui/material'
import {ChangeEvent, DragEvent, memo, useCallback, useContext, useRef} from 'react'
import {css} from '@emotion/react'
import {GgjOutlineButton, MARGIN_RIGHT_ICON} from '../GgjButton'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import {Action, DispatchContext, IsMaxFileContext, OptFileContext} from './UploadImagesOrFilesContext'
import {useTranslation} from 'next-i18next'
import {nsTranUploadFiles} from './index'

const UploadPanel = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTranUploadFiles)
  const fileInputField = useRef<HTMLInputElement>(null)
  const dispatch = useContext(DispatchContext)
  const isMaxFileContext = useContext(IsMaxFileContext)
  const {maxFiles, acceptType, maxSize} = useContext(OptFileContext)
  const dropImages = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      if (event.dataTransfer) {
        const files = event.dataTransfer.files
        handleUpload(files)
      }
    },
    []
  )

  const uploadImages = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const {files} = event.target
    if (files) {
      handleUpload(files)
    }
  }, [])

  const handleUpload = useCallback((files: FileList) => {
    if (files.length == 0)
      return
    dispatch({
      type: Action.AddFiles, payload: {files, maxFiles, acceptType, maxSize}
    })
  }, [])

  const handleClickUpload = useCallback(() => {
    if (fileInputField.current) {
      fileInputField.current.click()
    }
  }, [])

  const preventDefault = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  let arrayAcceptType = acceptType.split(',')
  if (arrayAcceptType.length) {
    arrayAcceptType = arrayAcceptType.map(p => p.replace('.', ''))
  }
  return (<>
    <div
      draggable
      onDrop={dropImages}
      onDragOver={preventDefault}
      css={css`
        margin-top: ${theme.spacing(3)};
        min-height: 130px;
        width: 100%;
        background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%23626262FF' stroke-width='2' stroke-dasharray='8' stroke-dashoffset='8' stroke-linecap='butt'/%3e%3c/svg%3e");
        border-radius: 10px;
        padding: ${theme.spacing(4)};
      `}
    >
      <input type={'file'} multiple={maxFiles > 1} css={css`display: none`} accept={acceptType} ref={fileInputField}
        onChange={e => {
          uploadImages(e)
        }}/>
      <Stack direction={'column'} alignItems={'center'}>
        <Stack alignItems={'center'} flexWrap={'wrap'}
          css={css``}
        >
          <Typography variant={'subtitle1'} css={css`max-width: 255px;
            line-height: 20px;
            text-align: center;
            color: ${theme.palette.jade.light}`}>
            {t('1')}
          </Typography>
          <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}
            css={css`margin-top: ${theme.spacing(2)}`}>
            <GgjOutlineButton onClick={handleClickUpload} disabled={isMaxFileContext}>
              <UploadFileIcon css={css`margin-right: ${MARGIN_RIGHT_ICON}`}/>{t('2')}
            </GgjOutlineButton>
          </Stack>
          <ul css={css`margin-top: ${theme.spacing(2)};
            list-style: none;
            padding-left: 12px;
            margin-bottom: 0`}>
            <li><Typography variant={'subtitle1'} css={css`line-height: 20px;
              display: flex;`}>
              {
                arrayAcceptType.map(p => (
                  <div key={p}>
                    <span
                      css={css`margin: 0 ${theme.spacing(1)}`}
                    >・</span>
                    <span css={css`text-transform: uppercase`}>{p}</span>
                  </div>
                ))
              }
            </Typography>
            </li>
            <li><Typography variant={'subtitle1'} css={css`line-height: 20px`}><span
              css={css`margin: 0 ${theme.spacing(1)}`}>・</span>{t('添付は{{maxFiles}}つまで', {maxFiles})}</Typography></li>
            <li><Typography variant={'subtitle1'} css={css`line-height: 20px`}><span
              css={css`margin: 0 ${theme.spacing(1)}`}>・</span>{t('1ファイル{{maxSize}}まで', {maxSize})}</Typography></li>
          </ul>
        </Stack>
      </Stack>
    </div>
  </>)
}

export default memo(UploadPanel)
