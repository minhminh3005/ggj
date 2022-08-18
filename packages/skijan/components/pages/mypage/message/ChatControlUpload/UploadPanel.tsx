import { Button, Stack, Typography, useTheme } from '@mui/material'
import { css } from '@emotion/react'
// import { useTranslation } from 'next-i18next'
// import { nsTranUploadFiles } from './index'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import {
  Action,
  DispatchContext,
  OptFileContext,
  StateContext,
} from './ChatUploadContext'
import {
  ChangeEvent,
  DragEvent,
  memo,
  useCallback,
  useContext,
  useRef,
} from 'react'

const UploadPanel = () => {
  const theme = useTheme()
  //const { t } = useTranslation(nsTranUploadFiles)
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const fileInputField = useRef<HTMLInputElement>(null)
  const { maxFiles, maxSize, totalSize, acceptType } =
    useContext(OptFileContext)
  const isMaxFileContext = state.listFiles.length >= maxFiles

  const dropImages = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.dataTransfer) {
      const files = event.dataTransfer.files
      handleUpload(files)
    }
  }, [])

  // console.log({ state })

  const uploadImages = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (files) {
      handleUpload(files)
    }
  }, [])

  const handleUpload = useCallback((files: FileList) => {
    if (files.length == 0) return
    dispatch({
      type: Action.AddFiles,
      payload: { files, maxFiles, maxSize, totalSize, acceptType },
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

  let arrayAcceptType = acceptType.split(',')
  if (arrayAcceptType.length) {
    arrayAcceptType = arrayAcceptType.map((p) => p.replace('.', ''))
  }
  return (
    <div
      css={css`
        margin-top: ${theme.spacing(2)};
      `}
    >
      <Typography variant="body1">ファイルの選択</Typography>
      <div draggable onDrop={dropImages} onDragOver={preventDefault}>
        <input
          type={'file'}
          multiple={maxFiles > 1}
          css={css`
            display: none;
          `}
          accept={acceptType}
          ref={fileInputField}
          onChange={(e) => {
            uploadImages(e)
          }}
        />
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
          `}
        >
          <Typography variant="body2" color={theme.palette.jade.light}>
            ファイルをドラッグ&ドロップ または
          </Typography>
          <Button
            disabled={isMaxFileContext}
            onClick={handleClickUpload}
            variant="outlined"
            startIcon={<UploadFileIcon />}
            css={css`
              width: 100%;
              border-radius: 10px;
              height: 44px;
            `}
          >
            <Typography>画像を選択</Typography>
          </Button>
          <div>
            <Typography
              variant="body2"
              color={theme.palette.jade.light}
              css={css`
                line-height: 20px;
                display: flex;
              `}
            >
              {arrayAcceptType.map((p, idx) => (
                <span key={p}>
                  {idx > 0 && <span>/</span>}
                  <span
                    css={css`
                      text-transform: uppercase;
                    `}
                  >
                    {p}
                  </span>
                </span>
              ))}
              ファイル
            </Typography>
          </div>
        </Stack>
      </div>
    </div>
  )
}

export default memo(UploadPanel)
