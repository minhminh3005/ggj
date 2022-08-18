import React, {memo, useContext} from 'react'
import {css} from '@emotion/react'
import PopupError from './PopupError'
import UploadPanel from './UploadPanel'
import DisplayPanel from './DisplayPanel'
import UploadButton from './UploadButton'
import CloseIcon from '@mui/icons-material/Close'
import {Action, DispatchContext} from './ChatUploadContext'
import {Dialog, DialogContent, IconButton, Stack, Typography, useMediaQuery, useTheme} from '@mui/material'
import {nsTransaction} from '../const'
import {useTranslation} from 'next-i18next'

function UploadImgsOrFiles(props: {
  open: boolean,
  onCloseModal: () => void
}) {
  const theme = useTheme()
  const {t} = useTranslation(nsTransaction)
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useContext(DispatchContext)
  const handleCloseModal = () => {
    props.onCloseModal()
    dispatch({type: Action.CloseUploadModal})
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={props.open}
      onClose={handleCloseModal}
      css={css`
        .MuiPaper-root {
          width: 100%;
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            max-width: 500px;
            height: 560px;
          }
        }
      `}
    >
      {/*DIALOG HEADER*/}
      <Stack direction="row" justifyContent="space-between" alignItems="center" css={css`
            height: 56px;
            min-height: 56px;
            padding: 0 ${theme.spacing(3)} 0 ${theme.spacing(4)}`}>
        <Typography variant="h6">{t('80')}</Typography>
        <IconButton onClick={handleCloseModal}>
          <CloseIcon/>
        </IconButton>
      </Stack>
      {/*DIALOG CONTENT*/}
      <DialogContent dividers className="ggj-scrollbar">
        <UploadPanel/>
        <DisplayPanel/>
      </DialogContent>
      <UploadButton closeModal={handleCloseModal}/>
      <PopupError/>
    </Dialog>
  )
}

export const ChatModal = memo(UploadImgsOrFiles)
