import {Dialog, DialogActions,  DialogContent,  DialogTitle, Typography} from '@mui/material'
import {css} from '@emotion/react'
import {useAppDispatch, useAppSelector} from '../../../store/hooks'
import {useTranslation} from 'next-i18next'
import {useTheme} from '@mui/material/styles'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import {GgjOutlineButton} from '../../commons/GgjButton'
import {useCallback} from 'react'
import {
  actions,
  ns
} from 'store/paymentSlice'
const nsTran = 'surface@payment'

export const PopupError = () => {
  const {t} = useTranslation(nsTran)
  const isShowPopupError = useAppSelector((state) => state[ns]?.isShowPopupError)
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const closePopup = useCallback(()=>{
    dispatch(actions.setIsShowPopupError(false))
  },[])
  return <Dialog open={Boolean(isShowPopupError)}>
    <div css={css`
      max-width: 500px;
      @media (min-width: ${theme.breakpoints.values.lg}px)
      {
        min-width: 500px;
      }
    `}>
      <DialogTitle
        css={css`
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          color: ${theme.palette.error.main};
        `}
      >
        <ErrorOutlineOutlinedIcon
          css={css`
            width: ${theme.spacing(5)};
            height: ${theme.spacing(5)};
          `}/>
        <span
          css={css`
            font-size: 20px;
            margin-left: ${theme.spacing(2)};
            font-weight: 500;
          `}
        >{t('決済エラー')}</span></DialogTitle>
      <DialogContent>
        <Typography variant={'subtitle1'}>{t('エラーが発生し、決済を完了することが出来ませんでした。もう一度はじめから決済を行ってください。')}</Typography>
      </DialogContent>
      <DialogActions  css={css`
           padding: 0 ${theme.spacing(3)} ${theme.spacing(3)} 0 ;
           display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
           @media (max-width: ${theme.breakpoints.values.md-1}px){
              -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
           }
          `}>
        <GgjOutlineButton onClick={closePopup} cssStr={`border-color:${theme.palette.jade.light}; color: ${theme.palette.jade.light}`} >{t('閉じる')}</GgjOutlineButton>
      </DialogActions>
    </div>
  </Dialog>
}
