import React, { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { css } from '@emotion/react'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'
import ListItemButton from '@mui/material/ListItemButton'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import List from '@mui/material/List'
import { useTranslation } from 'next-i18next'
import getCategories, {IGgjCategoriesLarge, nsCommonCategories} from '../../../common/categories'
import {SvgIcon} from '@mui/material'
import {buildQueryString} from '../../../common/utils'
import {useRouter} from 'next/router'
import {SPC, SP} from './consts'
import {dataExtendId} from '../../../common/constant'

function CategoryItem({
  sub,
  id,
  icon,
}: IGgjCategoriesLarge) {
  const theme = useTheme()
  const router = useRouter()
  const { t } = useTranslation(nsCommonCategories)
  const iconStyle = css`
    color: ${theme.palette.jade.light};
    font-size: 26px;
  `
  const [expanded, setExpanded] = useState(false)
  const larId = id
  const Icon = icon as typeof SvgIcon
  const handleOnClick = (idx: number) => {
    const item = sub[idx]

    if (item.path) {
      window.open(item.path as string, '_blank')
      return
    }

    if(idx) {
      buildQueryString(
        router,
        {[SPC]: [item.id].concat(item.smallIds || []).join(',')},
        [SP],
        '/search',
        {shallow: true},
      )
      return
    }

    const queryArr: Array<number> = []
    sub.forEach((i, index) => {
      if(index) queryArr.push(i.id)
    })
    buildQueryString(
      router,
      {[SPC]: queryArr.join(',')},
      [SP],
      '/search',
      {shallow: true},
    )
  }
  return (
    <>
      <ListItemButton
        onClick={() => {
          setExpanded(!expanded)
        }}
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-left: 0;
        `}
      >
        <div css={css`
          display: flex;
          align-items: center;
        `}>
          {icon && <Icon color="inherit" css={css`
            margin-right: 16px;
          `}/>}
          <Typography variant="subtitle1" component="p">
            {t(`${id}`)}
            {id == dataExtendId && <>
              <span css={css`
              color: #6d82d3;
              font-size: 12px;
              letter-spacing: initial;
              margin-left: 8px;
            `}>
                <strong>{t('sub-title-15')}</strong>
              </span>
            </>}
          </Typography>
        </div>

        {expanded
          ? <ExpandLess css={iconStyle}/>
          : <ExpandMore css={iconStyle}/>}
      </ListItemButton>

      <Collapse in={expanded} timeout="auto">
        <List component="div" disablePadding>
          {sub?.map(({ name , id}, index) => (
            <ListItemButton key={`${name+index}`}
              component={Typography}
              onClick={() => {handleOnClick(index)}}
              css={css`
                padding: 0 0 0 ${theme.spacing(4)};
                min-height: ${theme.spacing(6)};
                display: flex;
                align-items: center;
                padding-left: ${theme.spacing(3)};
              `}
              variant="body1"
            >
              {t(`mid_${id}`, {largeId: t(larId.toString())})}
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  )
}

const MobileCategories = () => {
  const theme = useTheme()
  const { t } = useTranslation(nsCommonCategories)
  const categories = getCategories(true, true)

  return (
    <div
      css={css`
        padding: 0 ${theme.spacing(3)};
        margin-top: ${theme.spacing(4)};
      `}
    >
      <Typography
        css={css`
          margin-bottom: ${theme.spacing(3)};
        `}
        variant="h6"
        component="p"
      >
        {t('tit-1')}
      </Typography>
      {categories?.map((item, index) => (
        <CategoryItem
          key={index}
          {...item as IGgjCategoriesLarge}
        />
      ))}
    </div>
  )
}

export default React.memo(MobileCategories)
