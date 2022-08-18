import {css} from '@emotion/react'
import {Button, Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import {useAppDispatch} from '../../../../store/hooks'
import {actions} from '../../../../store/usersSlice'
import {useTranslation} from 'next-i18next'
import {nsUserProfile} from '../../../../common/constant'
import {CAREER, MY_SKILL, SPECIALTY} from './const'

const ButtonAddItem = ({type, disabled}: { type: string, disabled: boolean }) => {
  const theme = useTheme()
  const { t } = useTranslation(nsUserProfile)
  const dispatch = useAppDispatch()
  const defaultData = type == SPECIALTY ? {
    serviceCategoryLargeId: 1,
    serviceCategoryMiddle: '',
    explain: ''
  } : type == MY_SKILL ? {
    name: '',
    experienceMonth: 0,
    experienceYears: 0,
    note: ''
  } : type == CAREER ?{
    belong : '',
    job: '',
    from: 202001,
    to: 202002,
    detail: ''
  } : {
    name: '',
    qualificationMonth: 6,
    qualificationYear: 2020
  }
  return (
    <Button
      onClick={() => {
        dispatch(actions.setEditItem({data: defaultData}))
        dispatch(actions.setShowEditForm(true))
      }}
      disabled={disabled}
      fullWidth
      startIcon={<AddCircleOutlinedIcon/>}
      css={css`
        background: ${theme.palette.canvas.light};
        border: solid 1px #cccccc;
        color: ${theme.palette.jade.light};
        margin: ${theme.spacing(3)} 0;
      `}
    >
      <Typography variant="body2">{t('73')}</Typography>
    </Button>
  )
}

export default ButtonAddItem
