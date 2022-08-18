import React, { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import Menu from '@mui/material/Menu'
import { css } from '@emotion/react'
import MenuItem from '@mui/material/MenuItem'
import {Typography, useMediaQuery} from '@mui/material'
import SortIcon from '@mui/icons-material/Sort'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import { buildQueryString } from 'common/utils'
import FilterChip from './FilterChip'
import { SP, SPO } from './consts'

const nsTran = 'surface@search'

export default function SortMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const {t} = useTranslation(nsTran)
  const router = useRouter()
  const theme = useTheme()
  const isDesktop = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)

  const sortOptions = useMemo(() => {
    return [
      // Order by recommend is not developed in current phase
      // {
      //   label: t('ro'),
      //   value: 'ro',
      // },
      {
        label: t('na'),
        value: 'na',
      },
      {
        label: t('hs'),
        value: 'hs',
      },
      {
        label: t('hr'),
        value: 'hr',
      },
    ]
  }, [])

  function handleSortChange(value: string) {
    buildQueryString(
      router,
      {
        [SPO]: value
      },
      [SP],
      undefined,
      {shallow: true}
    )
    setAnchorEl(null)
  }

  return (
    <>
      <div onClick={(e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}>
        <FilterChip
          css={css`
            background-color: ${router.query[SPO] ? '#e2e7f9' : 'white'};
            border: ${router.query[SPO] || isDesktop
      ? '1px solid transparent'
      : '1px solid '+theme.palette.smoke.light};
          `}
          onClick={(e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}
          icon={<SortIcon css={css`
            color: ${theme.palette.jade.light};
          `}/>}
          label={<Typography variant="subtitle2" component="p">{router.query[SPO]? t(router.query[SPO] as string) : sortOptions[0].label}</Typography>}
          variant="outlined"
        />
      </div>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        css={css`
          top: 5px;
        `}
      >
        <div
          css={css`
            width: 200px;
          `}
        >
          {sortOptions.map(({label, value}, index) => (
            <MenuItem
              css={css`
                background-color: ${router.query[SPO] === value
              ? 'rgba(73,108,220,0.08)'
              : ''};
              `}
              key={index}
              onClick={() => handleSortChange(value)}
            >
              {label}
            </MenuItem>
          ))}
        </div>
      </Menu>
    </>
  )
}
