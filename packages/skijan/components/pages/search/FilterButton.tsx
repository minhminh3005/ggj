import { Typography } from '@mui/material'
import FilterChip from './FilterChip'
import React, { useState } from 'react'
import Filter, { FilterModal } from './Filter'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
import { css } from '@emotion/react'
import {SPC, SPD, SPR, SPP} from './consts'
const nsTran = 'surface@search'

export default function FilterButton() {
  const {query} = useRouter()
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const {t} = useTranslation(nsTran)

  return (
    <>
      <FilterChip
        css={css`
          background-color: ${[SPC, SPD, SPR, SPP].some(e => query[e]) ? '#e2e7f9' : 'white'};
          border: ${[SPC, SPD, SPR, SPP].some(e => query[e])
      ? '1px solid #e2e7f9'
      : '1px solid '+ theme.palette.smoke.light};
          margin-left: ${theme.spacing(2)};
        `}
        onClick={() => setIsOpen(true)}
        icon={<FilterAltIcon css={css`
            font-size: 18px;
            color: ${theme.palette.jade.light}
          `}
        />}
        label={<Typography variant="subtitle2" component="p">{t('6')}</Typography>}
      />
      <FilterModal visible={isOpen}>
        <Filter
          closeFilterModal={() => setIsOpen(false)}
        />
      </FilterModal>
    </>
  )
}
