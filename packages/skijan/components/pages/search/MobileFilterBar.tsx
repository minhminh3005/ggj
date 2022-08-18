import React from 'react'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { buildQueryString } from 'common/utils'
import { useRouter } from 'next/router'
import FilterChip from './FilterChip'
import {SPS, SPS_ON_SALE_VAL, SP} from './consts'

interface MobileFilterBarProps {
  children?: React.ReactNode
}

const nsTran = 'surface@search'

const MobileFilterBar = ({children}: MobileFilterBarProps) => {
  const theme = useTheme()
  const {t} = useTranslation(nsTran)
  const router = useRouter()

  const filterOptions = [
    {
      label: t('7'),
      value: SPS_ON_SALE_VAL,
      style: {
        backgroundColor: router.query[SPS]?.includes(SPS_ON_SALE_VAL) ? '#e2e7f9' : 'white',
        border:
          router.query[SPS]?.includes(SPS_ON_SALE_VAL)
            ? '1px solid #e2e7f9'
            : `1px solid ${theme.palette.smoke.light}`,
      },
      handleFn: handleOnSaleChange,
    },
    // Discount is not developed in current phase
    // {
    //   label: t('8'),
    //   value: '1',
    //   style: {
    //     backgroundColor: router.query[SPDC]? '#e2e7f9' : 'white',
    //     border:
    //       router.query[SPDC]
    //         ? '1px solid #e2e7f9'
    //         : `1px solid ${theme.palette.smoke.light}`,
    //   },
    //   handleFn: function handleDiscountChange() {
    //     if(router.query[SPDC]) {
    //       buildQueryString(router, {}, [SPDC])
    //       return
    //     }
    //     buildQueryString(router, {[`${SPDC}`]: 1})
    //   },
    // },
  ]

  function handleOnSaleChange(val: string) {
    const psVal = router.query[SPS]
    let arr = (psVal || '').toString()?.split(',')
    arr[0] == '' && (arr = [])
    if (!~arr.indexOf(val)) {
      arr.push(val)
    } else {
      arr.splice(arr.indexOf(val), 1)
    }

    buildQueryString(
      router,
      {
        [SPS]: arr.join(),
      },
      !arr.length ? [SPS, SP] : [SP],
      undefined,
      {shallow: true},
    )
  }



  return (
    <div css={css`
      display: flex;
      padding: 12px ${theme.spacing(3)};
      overflow-x: auto;
      align-items: center;
      margin: auto;
      max-width: fit-content;
      @media (min-width: ${theme.breakpoints.values.lg}px) {
        overflow-x: unset;
        flex-wrap: wrap;
        margin: unset;
      }
    `}>
      {children}
      {filterOptions
        .map(({label, value, style, handleFn}, index) => {
          return (
            <FilterChip
              key={index}
              style={style}
              onClick={() => handleFn(value)}
              label={<Typography variant="subtitle2" component="p">{label}</Typography>}
            />
          )
        })}
    </div>
  )
}

export default React.memo(MobileFilterBar)
