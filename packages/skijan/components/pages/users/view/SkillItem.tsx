import { css } from '@emotion/react'
import { Stack } from '@mui/material'
import { Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { IUserSkill } from 'store/usersSlice'
import TitleItem from '../edit/TitleItem'
import {nsUserProfile} from '../../../../common/constant'

interface ISkill {
  showEdit?: boolean | false
  data: IUserSkill
}

const SkillItem = ({ showEdit, data }: ISkill) => {
  const { t } = useTranslation(nsUserProfile)
  return (
    <Stack
      direction="column"
      css={css`
        margin-top: 12px;
        padding-bottom: 8px;
        border-bottom: solid 1px #f2f2f2;
      `}
    >
      <TitleItem name={data.name} showEdit={showEdit} data={data}/>
      {
        !data.experienceYears && data.experienceMonth
          ?
          <Typography variant="caption" mb={2} mt={1}>
            {t('65')}
            {' '}
            {t('month-format', {
              month: Number(data.experienceMonth),
            })}
          </Typography>
          :
          <Typography variant="caption" mb={2} mt={1}>
            {t('65')}
            {' '}
            {t('date-format', {
              year: Number(data.experienceYears),
              month: Number(data.experienceMonth),
            })}
          </Typography>
      }
      <Typography variant="caption" css={css`white-space: pre-wrap;word-break: break-word;`}>{data.note}</Typography>
    </Stack>
  )
}

export default SkillItem
