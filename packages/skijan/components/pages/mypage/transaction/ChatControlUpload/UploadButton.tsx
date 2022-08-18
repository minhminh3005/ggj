import React, {memo, useContext, useRef} from 'react'
import {css} from '@emotion/react'
import {useTheme} from '@mui/material'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import {StateContext} from './ChatUploadContext'
import {actions, ns, upLoadFiles} from '../../../../../store/transactionSlice'
import {useAppDispatch, useAppSelector} from '../../../../../store/hooks'
import { toastHandler } from 'contexts/ToastContext'
import {LoadingButton} from '@mui/lab'
import {useRouter} from 'next/router'
import {useTranslation} from 'next-i18next'
const nsTran = 'mypage@transaction'

const UploadButton = ({closeModal}:{closeModal: () => void}) => {
  const theme = useTheme()
  const router = useRouter()
  const currentUrl = useRef(router.asPath)
  const {t} = useTranslation(nsTran)

  const state = useContext(StateContext)
  const isDisableButton = !state.listFiles.length
  const isLoading = useAppSelector((state) => state[ns]?.isLoadingMess)
  const dispatch = useAppDispatch()
  const handleUpload = async () => {
    dispatch(actions.setIsLoadingMess(true))

    // @ts-ignore
    const error = await dispatch(upLoadFiles(state.listFiles,router,currentUrl.current,t('Are you sure you want to leave?')))

    dispatch(actions.setIsLoadingMess(false))
    // @ts-ignore
    if(error) return toastHandler({ message: 'ECI500', type: 'error' })
    closeModal()
  }
  return (
    <div css={css`
      padding: ${theme.spacing(3)} ${theme.spacing(4)};
      background: ${theme.palette.common.white};
    `}>
      {/*<GgjContainButton*/}
      {/*  disabled={isDisableButton || isLoading}*/}
      {/*  onClick={handleUpload}*/}
      {/*  css={css`width: 100%`}*/}
      {/*>*/}
      {/*  <SendRoundedIcon css={css`*/}
      {/*    color: ${theme.palette.common.white};*/}
      {/*    font-size: ${theme.spacing(3)};*/}
      {/*    margin-right: ${theme.spacing(2)}*/}
      {/*  `}/>*/}
      {/*  ファイルを送信*/}
      {/*</GgjContainButton>*/}
      <LoadingButton
        color="primary"
        disabled={isDisableButton || isDisableButton}
        loading={isLoading}
        onClick={handleUpload}
        css={css`
          width: 100%;
          background-color: ${theme.palette.primary.main};
          color: ${theme.palette.common.white};
          font-size: ${theme.spacing(3)};
          border-radius: 10px;
          &:hover {
            background-color: ${theme.palette.primary.main};
            color: ${theme.palette.common.white};
          }
          &:disabled {
            background-color: #496cdc80;
            color: ${theme.palette.common.white};
          }
        `}
        startIcon={<SendRoundedIcon css={css`
          color: ${theme.palette.common.white};
          font-size: ${theme.spacing(3)};
          //margin-right: ${theme.spacing(2)}
        `}/>}
      >
        {t('84')}
      </LoadingButton>
    </div>
  )
}
export default memo(UploadButton)
