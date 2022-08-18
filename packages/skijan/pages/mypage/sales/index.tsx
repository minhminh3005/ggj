import { Typography, useTheme, useMediaQuery } from '@mui/material'
import { css } from '@emotion/react'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { NextRequest } from 'next/server'
import { useTranslation } from 'next-i18next'
import {MypageDetailLayout, nsTranMypageDetailLayout} from 'components/layouts'
import SaleMonthlySummary from 'components/pages/mypage/sales/SaleMonthlySummary'
import Summary from 'components/pages/mypage/sales/Summary'
import slice, {actions, getSaleRecord, ns} from 'store/saleSlice'
import {reducerManager, sw} from 'store/store'
import {useEffect, useMemo} from 'react'
import HighLights from 'components/pages/mypage/sales/HighLights'
import {useLayoutContext} from 'contexts/LayoutContext'
import {useRouter} from 'next/router'
import GgjLazyRenderComp from 'components/commons/GgjLazyRenderComp'
import { skjMiddleware } from 'common/middleware/SkjMiddleware'
import GgjCommonHead from '../../../components/commons/GgjCommonHead'

export const cssSaleWrapper = css`
  background-color: #fff;
  border-radius: 10px;
  padding: 16px;
  height: 100%;
  min-height: 150px;
  position: relative;
`
export const marginBottom = css`
  margin-bottom: 8px;
`
export const nsTran = 'mypage@sales'

export const PieChart = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="72"
      height="72"
      viewBox="0 0 72 72"
    >
      <g
        id="グループ_12118"
        data-name="グループ 12118"
        transform="translate(14902 -14954)"
      >
        <g
          id="楕円形_249"
          data-name="楕円形 249"
          transform="translate(-14830 15026) rotate(180)"
          fill="none"
          stroke="#dc496c"
          strokeWidth="8"
          strokeDasharray="175 75"
        >
          <circle cx="36" cy="36" r="36" stroke="none" />
          <circle cx="36" cy="36" r="32" fill="none" />
        </g>
        <g
          id="楕円形_248"
          data-name="楕円形 248"
          transform="translate(-14902 14954)"
          fill="none"
          stroke="#db7048"
          strokeWidth="8"
          strokeDasharray="191 75"
        >
          <circle cx="36" cy="36" r="36" stroke="none" />
          <circle cx="36" cy="36" r="32" fill="none" />
        </g>
        <g
          id="楕円形_247"
          data-name="楕円形 247"
          transform="translate(-14902 14954)"
          fill="none"
          stroke="#9aa9ea"
          strokeWidth="8"
          strokeDasharray="147 125"
        >
          <circle cx="36" cy="36" r="36" stroke="none" />
          <circle cx="36" cy="36" r="32" fill="none" />
        </g>
        <g
          id="楕円形_251"
          data-name="楕円形 251"
          transform="translate(-14902 14954)"
          fill="none"
          stroke="#496cdc"
          strokeWidth="8"
          strokeDasharray="123 125"
        >
          <circle cx="36" cy="36" r="36" stroke="none" />
          <circle cx="36" cy="36" r="32" fill="none" />
        </g>
      </g>
    </svg>
  )
}

const Sales = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTran)
  const desktopView = useMediaQuery(`${theme.breakpoints.up('md')}`)
  const { updateLayoutSetting } = useLayoutContext()
  const router = useRouter()
  const sectionStyle = css`
    margin-bottom: 32px;
    @media (min-width: ${theme.breakpoints.values.lg}px) {
      margin-bottom: 40px;
    }
  `
  const headData = useMemo(() => ({
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  }), [])

  reducerManager.add(slice)
  useEffect(() => {
    return () => {
      reducerManager.remove(ns)
    }
  }, [])


  useEffect(() => {
    updateLayoutSetting({
      backgroundColor: '#fff',
      bodyBackgroundColor: '#FAFAFA',
      title: t('sales-title'),
      onBack: () => router.push('/mypage')
    })
  }, [])
  return (
    <div>
      <GgjCommonHead data={headData} />
      {desktopView && (
        <Typography
          variant="h5"
          css={css`
            margin-bottom: 24px;
          `}
        >
          {t('sales-title')}
        </Typography>
      )}
      <div css={sectionStyle}>
        <Typography variant="h6" css={marginBottom}>
          {t('summary')}
        </Typography>
        <Summary />
      </div>
      <div css={sectionStyle}>
        <Typography variant="h6" css={marginBottom}>
          {t('highlight')}
        </Typography>
        <HighLights />
      </div>
      <div css={sectionStyle}>
        <Typography variant="h6" css={marginBottom}>
          {t('monthly-summary')}
        </Typography>
        <GgjLazyRenderComp component={SaleMonthlySummary} minHeight={100} />
      </div>
    </div>
  )
}

export const getServerSideProps = sw.getServerSideProps((store) => async ({ req, resolvedUrl }) => {
  const re = skjMiddleware(req, resolvedUrl)
  if (re !== true) {
    return re
  }
  reducerManager.add(slice)
  const [_nextI18Next, data] = await Promise.all([
    ggjServerSideTranslations(req as unknown as NextRequest, nsTran, nsTranMypageDetailLayout),
    getSaleRecord(req as unknown as NextRequest)])

  store.dispatch(actions.setSalesData(data))

  const props = {
    props: {
      ..._nextI18Next
    }
  }
  return {...props}
})

Sales.Layout = MypageDetailLayout

export default Sales
