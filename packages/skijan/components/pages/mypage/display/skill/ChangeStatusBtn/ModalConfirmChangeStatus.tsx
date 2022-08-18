import {useTheme} from '@mui/material/styles'
import Modal from '@mui/material/Modal'
import {css} from '@emotion/react'
import Typography from '@mui/material/Typography'
import MuiButton from '@mui/material/Button'
import {useState} from 'react'
import {loadingOffHandler, loadingOnHandler} from 'contexts/LoadingContext'
import {putSkillServiceList} from 'store/mypage/display/skill/skillSlice'
import {toastHandler} from 'contexts/ToastContext'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import {SaleStatusType, STATUS_MAP} from '../skill-common-types'
import { useTranslation } from 'next-i18next'
import { nsDisplaySkill } from '../constants'
export const ModalConfirmChangeStatusNS = 'mypage-component@service-change-status-btn'

type TModalConfirmChangeStatus = ReturnType<typeof calcModalState> & {
  open: boolean,
  setOpen: (val: boolean) => void
  onSubmit: () => void
}
export default function ModalConfirmChangeStatus({
  title,
  content,
  cancelText,
  submitText,
  mode,
  open,
  setOpen,
  onSubmit
}: TModalConfirmChangeStatus) {
  const theme = useTheme()
  const styleBtn = css`
    height: 44px;
    width: 130px;
    white-space: nowrap;
    border-radius: 10px;
    max-width: calc(50% - ${theme.spacing(2)}/2);
    &:first-of-type {
      margin-right: ${theme.spacing(2)};
    }
  `
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div css={
        css`
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 400px;
          background: #fff;
          padding: ${theme.spacing(3, 4, 3, 4)};
          border-radius: 4px;
          max-width: calc(100vw - 40px);
          box-shadow: rgb(0 0 0 / 20%) 0 11px 15px -7px, rgb(0 0 0 / 14%) 0 24px 38px 3px, rgb(0 0 0 / 12%) 0 9px 46px 8px;
        `
      }>
        <Typography
          variant="h6"
          component="h2"
          css={css`
            color: ${mode === 'error' ? theme.palette.error.main : ''};
            display: flex;
            align-items: center;
          `}
          mb={3}
        >
          {mode === 'error' && <ErrorOutlineOutlinedIcon css={css`margin-right: ${theme.spacing(1)}`}/>}
          <b>{title}</b>
        </Typography>
        <Typography mb={4}>
          {content}
        </Typography>
        <div css={css`
          display: flex;
          justify-content: space-around;
          @media (min-width: ${theme.breakpoints.values.md}px) {
            justify-content: flex-end;
          }
        `}>
          <MuiButton
            variant="outlined"
            color={mode === 'success' ? 'primary' : 'inherit'}
            onClick={() => setOpen(false)}
            css={styleBtn}
          >{cancelText}</MuiButton>
          <MuiButton
            css={styleBtn}
            variant={mode === 'success' ? 'contained' : 'outlined'}
            color={mode === 'success' ? 'primary' : 'error'}
            onClick={onSubmit}
          >{submitText}</MuiButton>
        </div>
      </div>
    </Modal>
  )
}

export function useModalConfirmChangeStatus() {
  const { t } = useTranslation([nsDisplaySkill, 'common@common-error'])
  const [openModal, setOpenModal] = useState(false)
  const [newStatusType, setNewStatusType] = useState(-1)
  const [currentItem, setCurrentItem] = useState({id: -1, statusType: -1})
  const [modalProps, setModalProp] = useState<ReturnType<typeof calcModalState>>({
    title: '',
    content: '',
    cancelText: '',
    submitText: '',
    mode: 'success',
  })
  const handleShowErrorMessage = (): void => {
    switch(currentItem.statusType) {
    case STATUS_MAP.sale: {
      // status change from sale to pause or sale to close
      if(newStatusType === STATUS_MAP.pause || newStatusType === STATUS_MAP.close) {
        toastHandler({message: t('36'), type: 'error'})
      }
      break
    }
    default: toastHandler({message: t('37'), type: 'error'})
    }
  }
  return {
    openModal,
    setOpenModal,
    modalProps,
    setModalProp,
    currentItem,
    setCurrentItem,
    newStatusType,
    setNewStatusType,
    calcModalState,
    async onSubmitStatus() {
      setOpenModal(false)
      loadingOnHandler()
      let isError = false
      try {
        const {error} = await putSkillServiceList(parseInt(`${currentItem.id}`) ?? 0, {statusType: newStatusType})
        if (error) {
          switch(error) {
          case 'ESIProductNoAvatar': {
            toastHandler({message: t('ESIProductNoAvatar'), type: 'error'})
            break
          }
          default: handleShowErrorMessage()
          }
          isError = true
        } else {
          switch(currentItem.statusType) {
          case STATUS_MAP.sale: {
            // status change from sale to pause or sale to close
            if(newStatusType === STATUS_MAP.pause || newStatusType === STATUS_MAP.close) {
              toastHandler({message: t('35'), type: 'success'})
            }
            break
          }
          case STATUS_MAP.pause: {
            // status change from pause to sale or pause to draft
            if(newStatusType === STATUS_MAP.sale || newStatusType === STATUS_MAP.draft) {
              toastHandler({message: t('35'), type: 'success'})
            }
            break
          }
          default: ''
          }
        }
      } catch (e) {
        console.log(e)
        handleShowErrorMessage()
      } finally {
        loadingOffHandler()
      }
      return {isError}
    },
  }
}

function calcModalState(oldStatus: SaleStatusType, newStatus: SaleStatusType, t: (s: string, obj: {ns: string}) => string): {
  title: string
  content: string
  cancelText: string
  submitText: string
  mode: 'error' | 'success'
} {
  if (oldStatus === 'sale' && newStatus === 'pause') { // sale -> pause
    return {
      title: t('want-to-pause?title', {ns: ModalConfirmChangeStatusNS}),
      content: t('want-to-pause?content', {ns: ModalConfirmChangeStatusNS}),
      cancelText: t('want-to-pause?cancel-text', {ns: ModalConfirmChangeStatusNS}),
      submitText:  t('want-to-pause?submit-text', {ns: ModalConfirmChangeStatusNS}),
      mode: 'success',
    }
  }
  if ((oldStatus === 'sale' || oldStatus === 'pause') && newStatus === 'close') { // sale or pause  -> close
    return {
      title: t('want-to-close?title', {ns: ModalConfirmChangeStatusNS}),
      content: t('want-to-close?content', {ns: ModalConfirmChangeStatusNS}),
      cancelText: t('want-to-close?cancel-text', {ns: ModalConfirmChangeStatusNS}),
      submitText:  t('want-to-close?submit-text', {ns: ModalConfirmChangeStatusNS}),
      mode: 'error',
    }
  }
  if ((oldStatus === 'draft' || oldStatus === 'pause') && newStatus === 'sale') { // draft or pause -> sale
    return {
      title: t('want-to-sale?title', {ns: ModalConfirmChangeStatusNS}),
      content: '',
      cancelText: t('want-to-sale?cancel-text', {ns: ModalConfirmChangeStatusNS}),
      submitText:  t('want-to-sale?submit-text', {ns: ModalConfirmChangeStatusNS}),
      mode: 'success',
    }
  }
  // draft
  return {
    title: t('want-to-draft?title', {ns: ModalConfirmChangeStatusNS}),
    content: t('want-to-draft?content', {ns: ModalConfirmChangeStatusNS}),
    cancelText: t('want-to-draft?cancel-text', {ns: ModalConfirmChangeStatusNS}),
    submitText:  t('want-to-draft?submit-text', {ns: ModalConfirmChangeStatusNS}),
    mode: 'success',
  }
}
