import {actions, DELETE_BANNER, deleteBanner, ns} from 'store/usersSlice'
import {useAppSelector, useAppDispatch} from 'store/hooks'
import { useTheme } from '@mui/material/styles'
import {Dialog, DialogActions, DialogContent, Typography} from '@mui/material'
import Button from '@mui/material/Button'
import {css} from '@emotion/react'
import {ns as commonNs} from '../../../../store/appSlice'
import {loadingOffHandler, loadingOnHandler} from '../../../../contexts/LoadingContext'
import {toastHandler} from '../../../../contexts/ToastContext'
import {useTranslation} from 'next-i18next'
import {nsUserProfile} from '../../../../common/constant'

function CommonDialog() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(nsUserProfile)
  const title = useAppSelector(state => state[ns]?.confirmDialogData.title)
  const okText = useAppSelector(state => state[ns]?.confirmDialogData.okText)
  const description = useAppSelector(state => state[ns]?.confirmDialogData.description)
  const closeText = useAppSelector(state => state[ns]?.confirmDialogData.closeText)
  const mode = useAppSelector(state => state[ns]?.confirmDialogData.mode)
  const userId = useAppSelector(state => state[commonNs].auth.userId)

  const onClose = () => {
    dispatch(actions.resetConfirmDialog())
  }

  const onOk = async() => {
    if(mode === DELETE_BANNER) {
      loadingOnHandler()
      const data = await deleteBanner(userId)
      if(data.error) {
        toastHandler({type: 'error', message: t('delete-banner-fail')})
      } else {
        // toastHandler({type: 'success', message: t('delete-banner-success')})
        dispatch(actions.setBannerNoCache(userId))
      }
      loadingOffHandler()
    }
    dispatch(actions.resetConfirmDialog())
  }
  return (
    <Dialog open={Boolean(title)}>
      <DialogContent css={css`
              width: 340px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 20px 0 0 26px;
      `}>
        <Typography css={css`font-size: 22px`}>{title}</Typography>
        <Typography variant="caption" css={css`color: ${theme.palette.jade.dark}; padding-top: 9px`}>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}><Typography variant="body2" css={css`color: ${theme.palette.jade.light}; font-weight: 300`}>{closeText}</Typography></Button>
        <Button onClick={onOk}><Typography variant="body2" css={css`color: ${theme.palette.ruby.main}; font-weight: 300`}>{okText}</Typography></Button>
      </DialogActions>
    </Dialog>
  )
}

export default CommonDialog
