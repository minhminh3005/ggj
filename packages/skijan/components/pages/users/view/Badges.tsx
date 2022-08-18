import React from 'react'
import { css } from '@emotion/react'
import { Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { ISpecialty } from 'store/usersSlice'
import { useTranslation } from 'next-i18next'
import {nsCommonCategories} from 'common/categories'

// BADGE ITEM
const BadgeItem = ({ name }: { name: string }) => {
  const theme = useTheme()

  return (
    <div
      css={css`
        height: 20px;
        display: flex;
        border-radius: 5px;
        align-items: center;
        background: #ffffff;
        border: solid 1px ${theme.palette.smoke.light};
        padding: ${theme.spacing(0)} ${theme.spacing(1)};
      `}
    >
      <Typography variant="caption">{name}</Typography>
    </div>
  )
}

// BADGES
const Badges = ({ data }: { data: ISpecialty }) => {
  const { t } = useTranslation(nsCommonCategories)
  return (
    <Stack
      direction="row"
      css={css`
        flex-wrap: wrap;
        gap: 4px;
        width: 80%;
        margin-top: 8px;
        margin-bottom: 12px;
      `}
    >
      {data.serviceCategoryMiddle.split(',').map((item: string, idx) => (
        <BadgeItem name={t(`mid_${item}`)} key={idx} />
      ))}
    </Stack>
  )
}

export default Badges
