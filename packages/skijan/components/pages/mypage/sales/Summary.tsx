import {css} from '@emotion/react'
import {BarChart, DonutLarge, ShowChart} from '@mui/icons-material'
import {Divider, Grid, Stack, Typography} from '@mui/material'
import {formatNumber} from 'common/number'
import {useTranslation} from 'next-i18next'
import {cssSaleWrapper, nsTran, PieChart} from 'pages/mypage/sales'
import BoxItem from './BoxItem'
import {ISales} from './interfaces'
import {useAppSelector} from 'store/hooks'
import {ns} from 'store/saleSlice'

const Summary = () => {
  const {t} = useTranslation(nsTran)
  const data: ISales = useAppSelector(state => state[ns]?.salesData)
  return (
    <Grid container spacing={{xs: 2, md: 3}}>
      <Grid item xs={12} sm={6} md={6}>
        <div css={cssSaleWrapper}>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center"
              css={css`
                color: #496cdc;
              `}
            >
              <BarChart/>
              <Typography
                variant="subtitle1"
                css={[
                  css`
                    margin-left: 8px;
                    color: #496cdc;
                  `,
                ]}
              >
                {t('sales-results')}
              </Typography>
            </Stack>
            <Stack
              spacing={3}
              direction="row"
              divider={<Divider orientation="vertical" flexItem/>}
            >
              <Stack direction="row" alignItems="flex-end"
                css={css`
                    display: flex;
                    align-items: flex-end;
                  `}
              >
                <Typography variant="h5">
                  {formatNumber(data.generalSales.totalSales)}
                </Typography>
                <Typography
                  variant="caption"
                  css={css`
                      margin-left: 6px;
                    `}
                >
                  {t('subject')}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="flex-end">
                <Typography variant="caption">{t('currency')}</Typography>
                <Typography
                  variant="h5"
                  css={css`
                      margin-left: 6px;
                    `}
                >
                  {formatNumber(data.generalSales.totalProfit !== null ? data.generalSales.totalProfit : 0)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <div css={cssSaleWrapper}>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center"
              css={css`
                color: #496cdc;
              `}
            >
              <DonutLarge/>
              <Typography
                variant="subtitle1"
                css={[
                  css`
                    margin-left: 8px;
                    color: #496cdc;
                  `,
                ]}
              >
                {t('product-types')}
              </Typography>
            </Stack>
            <Stack direction={{xs: 'column', md: 'row'}} spacing={3}>
              <PieChart/>
              <div>
                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" alignItems="center">
                    <div
                      css={css`
                        border-radius: 5px;
                        background: #496cdc;
                        width: 16px;
                        height: 16px;
                      `}
                    ></div>
                    <Typography
                      variant="subtitle2"
                      css={css`
                        margin-left: 5px;
                      `}
                    >
                      {t('normal-product')}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    css={css`
                      margin-left: 10px;
                    `}
                  >
                    56%
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" alignItems="center">
                    <div
                      css={css`
                        border-radius: 5px;
                        background: #db7048;
                        width: 16px;
                        height: 16px;
                      `}
                    ></div>
                    <Typography
                      variant="subtitle2"
                      css={css`
                        margin-left: 5px;
                      `}
                    >
                      {t('product-offer')}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    css={css`
                      margin-left: 10px;
                    `}
                  >
                    24%
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" alignItems="center">
                    <div
                      css={css`
                        border-radius: 5px;
                        background: #dc496c;
                        width: 16px;
                        height: 16px;
                      `}
                    ></div>
                    <Typography
                      variant="subtitle2"
                      css={css`
                        margin-left: 5px;
                      `}
                    >
                      {t('nomination-offer')}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    css={css`
                      margin-left: 10px;
                    `}
                  >
                    20%
                  </Typography>
                </Stack>
              </div>
            </Stack>
          </Stack>
          <div
            css={css`
              position: absolute;
              display: block;
              border-radius: 10px;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: #22222252;
            `}
          >
            <Typography
              variant="body2"
              css={css`
                color: white;
                position: absolute;
                bottom: 16px;
                right: 16px;
                text-align: center;
              `}
            >
              coming soon...
            </Typography>
          </div>
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <div css={cssSaleWrapper}>
          <Stack spacing={3}>
            <div
              css={css`
                display: flex;
                align-items: center;
                color: #496cdc;
              `}
            >
              <ShowChart/>
              <Typography
                variant="subtitle1"
                css={[
                  css`
                    margin-left: 8px;
                    color: #496cdc;
                  `,
                ]}
              >
                {t('hit-product')}
              </Typography>
            </div>
            <BoxItem
              masterTitle={t('hit-product')}
              item={data?.hotSales.hotProduct}
            />
          </Stack>
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <div css={cssSaleWrapper}>
          <Stack spacing={3}>
            <div
              css={css`
                display: flex;
                align-items: center;
                color: #496cdc;
              `}
            >
              <BarChart/>
              <Typography
                variant="subtitle1"
                css={[
                  css`
                    margin-left: 8px;
                    color: #496cdc;
                  `,
                ]}
              >
                {t('interest')}
              </Typography>
            </div>
            <BoxItem
              masterTitle={t('interest')}
              item={data?.hotSales.bestProfit}
            />
          </Stack>
        </div>
      </Grid>
    </Grid>
  )
}

export default Summary
