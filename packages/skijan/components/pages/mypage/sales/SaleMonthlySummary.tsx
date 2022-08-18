import {BarChart, Download} from '@mui/icons-material'
import {
  Button,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {formatNumber} from 'common/number'
import {useTranslation} from 'next-i18next'
import {cssSaleWrapper, nsTran} from 'pages/mypage/sales'
import {useEffect, useRef, useState} from 'react'
import {IMonthlySummary} from './interfaces'
import {css} from '@emotion/react'
import {format} from 'date-fns'
import {getMonthlySaleRecord} from 'store/saleSlice'

const useDidMountEffect = (fn: () => void, deps: any) => {
  const didMount = useRef(false)
  useEffect(() => {
    if (didMount.current) {
      return fn()
    }
    didMount.current = true
  }, deps)
}


const dateRangeArr = (startDate: number) => {
  const cd = new Date()
  const sd = new Date(startDate)
  const endYear = cd.getFullYear()
  const month = cd.getMonth()
  const start = sd.getMonth()
  const startYear = sd.getFullYear()
  const dates = []

  for (let i = endYear; i >= startYear; i--) {
    const endMonth = i !== endYear ? 11 : month
    const startMonth = i === startYear ? start : 0
    for (let j = endMonth; j >= startMonth; j--) {
      dates.push([i, String(j + 1).padStart(2, '0')].join('-'))
    }
  }
  return dates
}

const SaleMonthlySummary = () => {
  const {t} = useTranslation(nsTran)
  const theme = useTheme()
  const [page, setPage] = useState(1)
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM'))
  const [monthlyData, setMonthlyData] = useState<IMonthlySummary>({
    generalSales: {
      totalSales: 0,
      totalProfit: 0,
    },
    months: [],
    detailSales: {
      data: [],
      pagingMeta: {
        page: 1,
        limit: 1,
        totalItem: 1,
        totalPage: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    },
  })
  const mobileView = useMediaQuery(`${theme.breakpoints.down('md')}`)
  const [isLoading, setIsLoading] = useState(false)
  const dateArrGenerate = dateRangeArr(
    monthlyData.months[monthlyData.months.length - 1]
  )
  useEffect(() => {
    setIsLoading(true)

    async function getNewData() {
      const newData = await getMonthlySaleRecord({date, page})
      setMonthlyData(newData)
      setIsLoading(false)
    }

    getNewData()
  }, [])

  useDidMountEffect(() => {
    setIsLoading(true)
    async function getNewData() {
      const newData = await getMonthlySaleRecord({date, page})
      setMonthlyData((prevData) => ({
        ...prevData,
        detailSales: {
          ...prevData.detailSales,
          data: [...prevData.detailSales.data, ...newData.detailSales.data],
        },
      }))
      setIsLoading(false)
    }
    getNewData()
  }, [page])

  useDidMountEffect(() => {
    setIsLoading(true)
    async function getNewData() {
      const newData = await getMonthlySaleRecord({date, page})
      setIsLoading(false)
      setPage(1)
      setMonthlyData(newData)
    }
    getNewData()
  }, [date])

  return (
    <div css={cssSaleWrapper}>
      <Stack spacing={4}>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            margin-bottom: 16px;
            @media (min-width: ${theme.breakpoints.values.md}px) {
              flex-direction: row;
              margin-bottom: 8px;
            }
          `}
        >
          <Select
            disabled={monthlyData.detailSales.data.length == 0}
            css={css`
              border-radius: 10px;
              height: 44px;
            `}
            value={date}
            onChange={(event: SelectChangeEvent) => setDate(event.target.value)}
          >
            {dateArrGenerate.length == 0 && (
              <MenuItem value={date}>
                {t('date-format', {
                  year: new Date(date).getFullYear(),
                  month: new Date(date).getMonth() + 1,
                })}
              </MenuItem>
            )}
            {dateArrGenerate.map((item) => (
              <MenuItem
                disabled={
                  !monthlyData.months
                    .map((item) => format(new Date(item), 'yyyy-MM'))
                    .includes(item)
                }
                key={`${item}`}
                value={item}
              >
                {t('date-format', {
                  year: new Date(item).getFullYear(),
                  month: new Date(item).getMonth() + 1,
                })}
              </MenuItem>
            ))}
          </Select>
          <Button
            disabled={monthlyData.detailSales.data.length == 0}
            href={`/api/skijan/v1/mypage/sales/${date}/download`}
            variant="contained"
            startIcon={<Download/>}
            css={css`
              height: 44px;
              margin-top: 16px;
              border-radius: 10px;
              @media (min-width: ${theme.breakpoints.values.md}px) {
                margin-left: 16px;
                margin-top: 0px;
              }
            `}
          >
            <Typography variant="body2">{t('issuance')}</Typography>
          </Button>
        </div>
        <Stack spacing={5}>
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
                {`${t('date-format', {
                  year: new Date(date).getFullYear(),
                  month: new Date(date).getMonth() + 1,
                })}${t('sale-results')}`}
              </Typography>
            </div>
            <Stack
              spacing={3}
              direction="row"
              divider={<Divider orientation="vertical" flexItem/>}
            >
              <div>
                <div
                  css={css`
                    display: flex;
                    align-items: flex-end;
                  `}
                >
                  {isLoading ? (
                    <Skeleton
                      css={css`
                        width: 100%;
                        height: 36px;
                      `}
                    />
                  ) : (
                    <>
                      <Typography variant="h5">
                        {formatNumber(monthlyData.generalSales.totalSales)}
                      </Typography>
                      <Typography
                        variant="caption"
                        css={css`
                          margin-left: 6px;
                        `}
                      >
                        {t('subject')}
                      </Typography>
                    </>
                  )}
                </div>
              </div>
              <div>
                <div
                  css={css`
                    display: flex;
                    align-items: flex-end;
                  `}
                >
                  {isLoading ? (
                    <Skeleton
                      css={css`
                        width: 100%;
                        height: 36px;
                      `}
                    />
                  ) : (
                    <>
                      <Typography variant="caption">{t('currency')}</Typography>
                      <Typography
                        variant="h5"
                        css={css`
                          margin-left: 6px;
                        `}
                      >
                        {formatNumber(monthlyData.generalSales.totalProfit !== null ? monthlyData.generalSales.totalProfit : 0)}
                      </Typography>
                    </>
                  )}
                </div>
              </div>
            </Stack>
          </Stack>
          {!mobileView && monthlyData.detailSales.data.length !== 0 && (
            <>
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
                  {`${t('date-format', {
                    year: new Date(date).getFullYear(),
                    month: new Date(date).getMonth() + 1,
                  })}${t('trans-details')}`}
                </Typography>
              </div>
              {
                monthlyData.detailSales.data.length == 0 ? <Typography variant="subtitle1">
                  {t('no-data-product')}
                </Typography> : <TableContainer>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('purchase-id')}</TableCell>
                        <TableCell align="right">{t('purchase-date')}</TableCell>
                        <TableCell align="left">{t('product-title')}</TableCell>
                        <TableCell align="right">{t('trading-user')}</TableCell>
                        <TableCell align="right">{t('sales-profit')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isLoading ? (
                        <>
                          {Array(10)
                            .fill(0)
                            .map((item, idx) => (
                              <TableRow
                                key={`${item} - ${idx}`}
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  <Skeleton/>
                                </TableCell>
                                <TableCell align="left">
                                  <Skeleton/>
                                </TableCell>
                                <TableCell align="right">
                                  <Skeleton />
                                </TableCell>
                                <TableCell align="right">
                                  <Skeleton/>
                                </TableCell>
                                <TableCell align="right">
                                  <Skeleton/>
                                </TableCell>
                              </TableRow>
                            ))}
                        </>
                      ) : (
                        <>
                          {monthlyData.detailSales.data.map((row) => (
                            <TableRow
                              key={`${row.titleProduct} - ${row.id}`}
                              sx={{
                                '&:last-child td, &:last-child th': {border: 0},
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {row.id}
                              </TableCell>
                              <TableCell align="right">
                                {format(new Date(row.date), 'yyyy/MM/dd')}
                              </TableCell>
                              <TableCell align="left">
                                {row.saleType == 1 ? row.titleProduct : (<>
                                  <div css={css`display: inline-block; padding: 0 4px; margin-right: 4px; background: #999; border-radius: 2px; color: #fff`}>option</div>
                                  {row.optionName}
                                </>)}
                              </TableCell>
                              <TableCell align="right">{row.buyer}</TableCell>
                              <TableCell align="right">{`${t('currency')}${formatNumber(row.profit)}`}</TableCell>
                            </TableRow>
                          ))}
                        </>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              }
            </>
          )}
          {!mobileView && page < monthlyData.detailSales.pagingMeta.totalPage && (
            <div
              css={css`
                display: flex;
                justify-content: center;
                width: 100%;
                margin-top: 24px;
              `}
            >
              <Button
                variant="outlined"
                css={css`
                  width: 100%;
                  max-width: 500px;
                  min-height: 44px;
                `}
                onClick={() => setPage((prev) => prev + 1)}
              >
                <Typography variant="body2">{t('display-button')}</Typography>
              </Button>
            </div>
          )}
        </Stack>
      </Stack>
    </div>
  )
}
export default SaleMonthlySummary
