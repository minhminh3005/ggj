import { css } from '@emotion/react'
import { Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
import { IUserQualification } from 'store/usersSlice'
import TitleItem from '../edit/TitleItem'
import {nsUserProfile} from '../../../../common/constant'

interface IQualification {
  showEdit?: boolean | false
  data: IUserQualification
}

const QualificationItem = ({ showEdit, data }: IQualification) => {
  const theme = useTheme()
  const { t } = useTranslation(nsUserProfile)
  return (
    <div
      css={css`
        margin-top: 12px;
        padding-bottom: 10px;
        border-bottom: solid 1px #f2f2f2;
      `}
    >
      <TitleItem name={data.name} showEdit={showEdit} data={data}/>
      <Typography
        variant="caption"
        css={css`
          color: ${theme.palette.smoke.dark};
        `}
      >
        {t('date-format', {
          year: data.qualificationYear,
          month: data.qualificationMonth,
        })}
      </Typography>
    </div>
  )
}

export default QualificationItem
