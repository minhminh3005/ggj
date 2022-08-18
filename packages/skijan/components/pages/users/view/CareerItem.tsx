import { css } from '@emotion/react'
import { Typography, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
import { IUserCareer } from 'store/usersSlice'
import TitleItem from '../edit/TitleItem'
import {nsUserProfile} from '../../../../common/constant'
import {getYearAndMonth} from '../edit/const'

interface ICareer {
  showEdit?: boolean | false
  data: IUserCareer
}

const CareerItem = ({ showEdit, data }: ICareer) => {
  const theme = useTheme()
  const { t } = useTranslation(nsUserProfile)
  if(!data) return null
  return (
    <div
      css={css`
        margin-top: 12px;
        padding-bottom: 12px;
        border-bottom: solid 1px #f2f2f2;
      `}
    >
      <TitleItem name={data.belong} showEdit={showEdit} data={data} />
      <Stack direction="column">
        <Typography variant="caption" css={css`white-space: pre-wrap;word-break: break-word; margin-top: ${theme.spacing(1)}`}>{data.job}</Typography>
        <Typography variant="caption" css={css`white-space: pre-wrap;word-break: break-word; margin-top: ${theme.spacing(1)}`}>{data.detail}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="flex-end">
        <Typography
          variant="subtitle2"
          css={css`
            color: ${theme.palette.smoke.dark};
          `}
        >
          {`
            ${t('date-format', getYearAndMonth(data?.from || 0))} ~
            ${(data?.to || 0) ? t('date-format', getYearAndMonth(data?.to || 0)) : t('66')}
          `}
        </Typography>
      </Stack>
    </div>
  )
}

export default CareerItem
