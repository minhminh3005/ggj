import {css} from '@emotion/react'
import {Box, Divider, Stack, Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
// import ItemSales from 'components/pages/skill-service-list/ItemSales.png'
// import Image from 'next/image'
import {memo} from 'react'
import {useTranslation} from 'next-i18next'
import {formatNumber} from '../../../common/number'
import {useAppSelector} from '../../../store/hooks'
import {ns} from '../../../store/paymentSlice'
import {PaidOptionType} from '../../commons/GgjPaymentPanel/paymentPanelSlice'

const nsTran = 'surface@payment'

const OverViewBox = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTran)
  const breakPointXs = theme.breakpoints.values.md - 1
  const paymentInfo = useAppSelector((state) => state[ns]?.paymentInfo)
  if (!paymentInfo) return null
  return (
    <section
      css={css`
        border-radius: 10px;
        padding-top: ${theme.spacing(4)};
        padding-left: ${theme.spacing(3)};
        padding-right: ${theme.spacing(3)};
        padding-bottom: 20px;
        border: 1px solid ${theme.palette.smoke.light};
      `}
    >
      <Stack direction="row" spacing={4} mb={3}>
        <div
          css={css`
            min-width: 80px;
            min-height: 80px;
          `}
        >
          <img
            src={paymentInfo.product?.imageUrl}
            alt=""
            width="80px"
            height="80px"
            css={css`
              object-fit: cover;
              border-radius: 10px;
            `}
          />
        </div>
        <Typography
          css={css`
            line-height: ${theme.spacing(4)};
            font-weight: normal;
            letter-spacing: 0.15px;
            word-break: break-all;
          `}
          variant="h6"
        >
          {paymentInfo.product?.title}
        </Typography>
      </Stack>
      <Divider/>
      <Stack mt={3}>
        <Stack direction="row" justifyContent="space-between">
          <Typography
            variant="subtitle1"
            css={css`
              line-height: ${theme.spacing(4)};
              font-weight: 500;
              letter-spacing: 0.5px;
            `}
          >
            {t('5')}
          </Typography>
          <Typography
            variant="subtitle1"
            css={css`
              line-height: ${theme.spacing(4)};
              font-weight: 500;
              letter-spacing: 0.5px;
            `}
          >
            ￥{formatNumber(paymentInfo.product.price.toString())}
          </Typography>
        </Stack>
        {paymentInfo.product.isSpecialDiscount && <Stack
          direction="row"
          justifyContent="space-between"
          css={css`
            margin-top: ${theme.spacing(3)};
            @media only screen and (max-width: ${breakPointXs}px) {
              margin-top: ${theme.spacing(2)};
            }
          `}
        >
          <Typography
            variant="subtitle1"
            css={css`
              line-height: ${theme.spacing(4)};
              font-weight: 500;
              color: ${theme.palette.ruby.main};
              letter-spacing: 0.5px;
            `}
          >
            {t('6')}
          </Typography>
          <Typography
            variant="subtitle1"
            css={css`
              line-height: ${theme.spacing(4)};
              font-weight: 500;
              color: ${theme.palette.ruby.main};
              letter-spacing: 0.5px;
            `}
          >
            - ￥{formatNumber((paymentInfo.product.price - paymentInfo.product.specialDiscountPrice).toString())}
          </Typography>
        </Stack>}
        {
          paymentInfo.paidOptions.length > 0 &&
          <Stack
            direction="row"
            justifyContent="space-between"
            css={css`
              margin-top: ${theme.spacing(3)};
              margin-bottom: ${theme.spacing(3)};
              @media only screen and (max-width: ${breakPointXs}px) {
                margin-top: ${theme.spacing(2)};
              }
            `}
          >
            <Typography
              variant="subtitle1"
              css={css`
                line-height: ${theme.spacing(4)};
                font-weight: 500;
                letter-spacing: 0.5px;
              `}
            >
              {t('7')}
            </Typography>
            <Typography
              variant="subtitle1"
              css={css`
                line-height: ${theme.spacing(4)};
                font-weight: 500;
                letter-spacing: 0.5px;
              `}
            >
              ￥{formatNumber(paymentInfo.totalPaidOptionsPrice.toString())}
            </Typography>
          </Stack>
        }

      </Stack>
      {
        paymentInfo.paidOptions.length > 0 &&
        <Box
          css={css`
            padding: ${theme.spacing(3)} ${theme.spacing(2)};
            background-color: ${theme.palette.canvas.light};
            margin-bottom: ${theme.spacing(2)};
          `}>
          <Typography
            variant="body2"
            css={css`
              font-size: 12px;
              line-height: ${theme.spacing(4)};
              color: ${theme.palette.jade.light};
            `}
          >
            {t('オプション内訳')}
          </Typography>
          <Divider/>
          <Box css={css`width: 100%`}>
            {
              paymentInfo.paidOptions.map((p: PaidOptionType) => (
                <Stack direction={'row'} justifyContent={'space-between'} key={p.id}>
                  <Typography
                    variant="body2"
                    className="ggj-wt"
                    css={css`
                      font-size: 12px;
                      line-height: ${theme.spacing(4)};
                      color: ${theme.palette.smoke.dark};
                      width: 60%;
                      padding-right: 8px;
                      @media (min-width: ${theme.breakpoints.values.md}px ) and (max-width: ${theme.breakpoints.values.lg-1}px)
                      {
                        width: 70%;
                      }
                    `}
                  >
                    {p.optionName}
                  </Typography>
                  <Typography
                    variant="body2"
                    css={css`
                      font-size: 12px;
                      line-height: ${theme.spacing(4)};
                      color: ${theme.palette.smoke.dark};
                      width: 40%;
                      text-align: right;
                      @media (min-width: ${theme.breakpoints.values.md}px ) and (max-width: ${theme.breakpoints.values.lg-1}px)
                      {
                        width: 30%;
                      }
                    `}
                  >
                    ￥{formatNumber(p.optionPrice.toString())}
                  </Typography>
                </Stack>
              ))
            }

          </Box>
        </Box>
      }
      <Divider/>
      <Stack direction="row" justifyContent="space-between" mt={3}>
        <Typography
          variant="subtitle1"
          css={css`
            line-height: ${theme.spacing(4)};
            font-weight: 500;
            letter-spacing: 0.5px;
            color: #222222DE;
          `}
        >
          {t('8')}
        </Typography>
        <Typography
          variant="h6"
          css={css`
            line-height: ${theme.spacing(4)};
            font-weight: 500;
            color: #222222de;
            letter-spacing: 0.15px;
          `}
        >
          ￥{formatNumber(paymentInfo.totalPrice.toString())}
        </Typography>
      </Stack>
    </section>
  )
}

export default memo(OverViewBox)
