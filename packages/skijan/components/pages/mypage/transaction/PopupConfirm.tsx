import {Modal, Stack, Typography, useTheme} from '@mui/material'
import {css} from '@emotion/react'
import {GgjContainButton, GgjOutlineButton} from '../../../commons/GgjButton'
import {useAppDispatch, useAppSelector} from '../../../../store/hooks'
import {actions, completeTransactionById, ns} from '../../../../store/transactionSlice'
import {loadingOffHandler, loadingOnHandler} from '../../../../contexts/LoadingContext'
import {toastHandler} from '../../../../contexts/ToastContext'
import {useTranslation} from 'next-i18next'
import {SKILL_SALES_STATUS, nsTransaction, TransactionType} from './const'

export const PopupConfirm = () => {
  const theme = useTheme()
  const { t } = useTranslation(nsTransaction)
  const dispatch = useAppDispatch()
  const isShowPopupConfirm = useAppSelector((state) => state[ns]?.DETAIL_isShowPopupConfirm)
  const chatInfo = useAppSelector((state) => state[ns]?.CHATINFO_info)
  const mode = useAppSelector(state => state[ns]?.MENU_currentMode)
  const id = chatInfo?.id

  if (!isShowPopupConfirm) return null
  const handClosePopup = () => {
    dispatch(actions.setIsShowPopupConfirm(false))
  }

  const handleConfirmStep = async () => {
    handClosePopup()
    try {
      loadingOnHandler()
      const { data,error}: any = await completeTransactionById(id)
      if (error) {
        toastHandler({message: t('28'),type: 'error'})
        return
      }
      dispatch(actions.setSaleStatusTransaction({salesStatus:data?.data?.saleStatusType || SKILL_SALES_STATUS.PROGRESS_STATUS, date: new Date().valueOf()  } ))
    } catch (e) {
      toastHandler({type: 'error'})
    } finally {
      loadingOffHandler()
    }
  }

  return (
    <Modal
      open={isShowPopupConfirm}
      aria-labelledby="modal-modal-title-withdraw-failed"
      aria-describedby="modal-modal-description-withdraw-failed"
    >
      <Stack css={css`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 4px;
      background: #fff;
      min-height: 140px;
      width: 280px;
      max-height: 95vh;
      max-width: 95vw;
      outline: none;
      @media (min-width: ${theme.breakpoints.values.lg}px) {
        width: 340px;
      }

    `}>
        <Typography variant="h6" p={4} pb={3} flexGrow={1}>
          <strong>{mode == TransactionType.Buyer? t('92') : t('68')}</strong>
        </Typography>
        <Typography variant="body2" px={4} flexGrow={1}>
          {t('69')}
        </Typography>
        <Stack p={4} direction="row" spacing={4} justifyContent="center">
          <GgjOutlineButton
            variant="outlined"
            fullWidth
            size="large"
            css={css`
            font-size: 14px;
            width: 108px;
            height: 42px;
            white-space: nowrap;
            text-overflow: ellipsis;
          `}
            onClick={handClosePopup}
          >{t('70')}</GgjOutlineButton>
          <GgjContainButton
            fullWidth
            size="large"
            css={css`
            font-size: 14px;
            width: 108px;
            height: 42px;
            white-space: nowrap;
            text-overflow: ellipsis;
          `}
            onClick={handleConfirmStep}
          >{mode == TransactionType.Buyer? t('93') : t('71')}</GgjContainButton>
        </Stack>
      </Stack>
    </Modal>
  )

}
