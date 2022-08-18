import {BarChart, ShowChart} from '@mui/icons-material'
import {Grid, Stack, Typography} from '@mui/material'
import {useTranslation} from 'next-i18next'
import {cssSaleWrapper, nsTran} from 'pages/mypage/sales'
import {IProduct, ISales} from './interfaces'
import {css} from '@emotion/react'
import BoxItem from './BoxItem'
import {useAppSelector} from 'store/hooks'
import {ns} from 'store/saleSlice'

const HighLightContent = ({
  profits,
  products,
  masterTitle,
}: {
  profits?: IProduct[]
  products?: IProduct[]
  masterTitle: string
}) => {
  const {t} = useTranslation(nsTran)
  const contentArr = masterTitle === t('hit-product') ? products : profits
  return (
    <div css={cssSaleWrapper}>
      <Stack spacing={3}>
        <div
          css={css`
            display: flex;
            align-items: center;
            color: #496cdc;
          `}
        >
          {masterTitle === t('interest') ? <BarChart/> : <ShowChart/>}
          <Typography
            variant="subtitle1"
            css={[
              css`
                margin-left: 8px;
                color: #496cdc;
              `,
            ]}
          >
            {masterTitle === t('interest') ? t('interest') : t('hit-product')}
          </Typography>
        </div>
        <Stack spacing={3}>
          {contentArr?.length !== 0 ? contentArr?.map((item, idx) => (
            <BoxItem
              key={`${masterTitle}-productId-${idx}`}
              item={item}
              masterTitle={
                masterTitle === t('interest') ? t('interest') : t('hit-product')
              }
            />
          )) : Array(3).fill({
          } as IProduct).map((item, idx) => (
            <BoxItem
              key={`${masterTitle}-productId-${idx}`}
              item={item}
              masterTitle={
                masterTitle === t('interest') ? t('interest') : t('hit-product')
              }
            />
          ))}
        </Stack>
      </Stack>
    </div>
  )
}

const HighLights = () => {
  const {t} = useTranslation(nsTran)
  const data: ISales = useAppSelector(state => state[ns]?.salesData)
  return (
    <Grid container spacing={{xs: 2, md: 3}}>
      <Grid item xs={12} sm={6} md={6}>
        <HighLightContent
          masterTitle={t('hit-product')}
          products={data.monthlyHotSales.hotProducts}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <HighLightContent
          masterTitle={t('interest')}
          profits={data.monthlyHotSales.bestProfits}
        />
      </Grid>
    </Grid>
  )
}

export default HighLights
