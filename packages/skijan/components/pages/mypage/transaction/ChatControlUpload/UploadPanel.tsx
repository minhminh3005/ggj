import {Button, Stack, Typography, useTheme} from '@mui/material'
import {css} from '@emotion/react'
import {useTranslation} from 'next-i18next'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import {Action, DispatchContext, OptFileContext, StateContext} from './ChatUploadContext'
import React, {ChangeEvent, DragEvent, memo, useCallback, useContext, useRef} from 'react'
import {nsTransaction} from '../const'
import {useAppSelector} from '../../../../../store/hooks'
import {ns} from '../../../../../store/transactionSlice'

const UploadPanel = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTransaction)
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const fileInputField = useRef<HTMLInputElement>(null)
  const {maxFiles, maxSize, totalSize, acceptType} = useContext(OptFileContext)
  const loading = useAppSelector((state) => state[ns]?.isLoadingMess)
  const isMaxFileContext = state.listFiles.length >= maxFiles

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
      type: Action.AddFiles, payload: {files, maxFiles, maxSize, totalSize, acceptType}
    })
    if (fileInputField.current) {
      fileInputField.current.value = ''
    }
  }, [])

  const handleClickUpload = useCallback(() => {
    if (fileInputField.current) {
      fileInputField.current.click()
    }
  }, [])

  const preventDefault = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const arrayAcceptType = acceptType.replaceAll('.', '').replaceAll(',', '/ ').toLocaleUpperCase()

  return (<div css={css`margin-top: ${theme.spacing(2)}`}>
    <Typography variant="body1">{t('89')}</Typography>
    <div
      draggable
      onDrop={dropImages}
      onDragOver={preventDefault}
    >
      <input type={'file'} multiple={maxFiles > 1} css={css`display: none`} accept={acceptType} ref={fileInputField}
        onChange={e => {
          uploadImages(e)
        }}/>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        css={css`
          margin-top: ${theme.spacing(3)};
          width: 100%;
          background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%23626262FF' stroke-width='2' stroke-dasharray='8' stroke-dashoffset='8' stroke-linecap='butt'/%3e%3c/svg%3e");
          border-radius: 10px;
          padding: ${theme.spacing(4)};
        `}>
        <Typography variant="body2" color={theme.palette.jade.light}>{t('87')}</Typography>
        <Button disabled={loading || isMaxFileContext} onClick={handleClickUpload} variant="outlined" startIcon={<UploadFileIcon/>} css={css`width: 100%;
          border-radius: 10px;
          height: 44px;`}>
          <Typography>{t('88')}</Typography>
        </Button>
        <div>
          <Typography
            variant="body2"
            color={theme.palette.jade.light}
            css={css`
              line-height: 20px;
              word-break: break-word;
            `}
          >
            {arrayAcceptType}
          </Typography>
          <Typography variant="body2" color={theme.palette.jade.light} css={css`line-height: 20px`}>{t('85', {maxFiles: maxFiles})}</Typography>
          <Typography variant="body2" color={theme.palette.jade.light} css={css`line-height: 20px`}>{t('86', {maxSize})}</Typography>
        </div>
      </Stack>
    </div>
  </div>)
}

export default memo(UploadPanel)
