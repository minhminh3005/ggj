import {css} from '@emotion/react'
import Dialog from '@mui/material/Dialog'
import {memo, useContext, useMemo} from 'react'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import {
  Action,
  DispatchContext,
  IsShowPopupErrorContext,
  OptFileContext
} from './ChatUploadContext'
import {Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {useTranslation} from 'next-i18next'
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded'
import { GgjContainButton } from 'components/commons/GgjButton/GgjContainButton'
import {nsTransaction} from '../const'

const PopupError = () => {
  const {t} = useTranslation(nsTransaction)
  const isShowPopupError = useContext(IsShowPopupErrorContext)
  const dispatch = useContext(DispatchContext)
  const {maxFiles, acceptType, maxSize} = useContext(OptFileContext)
  const theme = useTheme()
  const isOpen = useMemo(() => Boolean(isShowPopupError), [isShowPopupError])
  return <Dialog open={isOpen} >
    <DialogTitle>{t('43')}</DialogTitle>
    <DialogContent css={css`
      max-width: 500px;
      @media screen and (min-width: ${theme.breakpoints.values.lg}px) {
        min-width: 500px;
      }
    `}
    >
      <ul css={css`list-style: none; padding-left: ${theme.spacing(3)}`}>
        <li css={css`display: flex`}>
          <ArrowRightRoundedIcon/>
          <Typography variant={'subtitle1'} css={css`word-break: break-word`}>
            {t('81', {acceptType})}
          </Typography>
        </li>
        <li css={css`display: flex`}>
          <ArrowRightRoundedIcon/>
          <Typography variant={'subtitle1'} css={css`word-break: break-word`}>
            {t('82', {maxFiles})}
          </Typography>
        </li>
        <li  css={css`display: flex`}>
          <ArrowRightRoundedIcon/>
          <Typography variant={'subtitle1'} css={css`word-break: break-word`}>
            {t('83', {maxSize})}
          </Typography>
        </li>
      </ul>
      {/*<div>*/}
      {/*  <ErrorTable/>*/}
      {/*</div>*/}
    </DialogContent>
    <DialogActions css={css`padding: 24px`}>
      <GgjContainButton autoFocus onClick={() => dispatch({type: Action.ClosePopupMaxFiles})}>
        Ok
      </GgjContainButton>
    </DialogActions>
  </Dialog>
}

export default memo(PopupError)
