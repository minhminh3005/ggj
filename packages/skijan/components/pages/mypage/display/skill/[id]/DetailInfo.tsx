import {useTheme} from '@mui/material/styles'
import {css} from '@emotion/react'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import StarIcon from '@mui/icons-material/Star'
import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled'
import NavigateButtons from './NavigateButtons'
import {useTranslation} from 'next-i18next'
import {ns} from './const'
// import Image from 'next/image'
// import TreasureHuntIllustration from 'components/pages/skill/treasure_hunt.png'
import { formatNumber } from 'common/number'
import { dateFormat, formatDate } from 'common/date'
import {useAppSelector} from 'store/hooks'
import {
  detailInfoSelector,
  priceSelector,
} from 'store/mypage/display/skill/skillDetailSlice'
import {STATUS_MAP} from '../skill-common-types'

export default function DetailInfo() {
  const componentData = useAppSelector(detailInfoSelector)
  const theme = useTheme()
  const { t } = useTranslation(ns)
  return (
    <div css={css`
      margin-bottom: ${theme.spacing(3)};
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        margin-bottom: ${theme.spacing(5)};
      }
    `}>
      {/* image + numbers info */}
      <Grid container gridTemplateColumns="repeat(12, 1fr)" gap={2}>
        <Grid
          item
          xs={12}
          md={10}
          css={css`
            display: flex;
            @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
              max-width: 480px;
            }
          `}
        >
          {/* image */}
          <div
            css={css`
              display: flex;
              height: 96px;
              width: 96px;
              flex: 0 0 96px;
              border-radius: 10px;
              background: ${theme.palette.grey.A200};
              overflow: hidden;
              @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
                height: 160px;
                width: 160px;
                flex: 0 0 160px;
              }
            `}
          >
            <img
              src={componentData.imageUrl}
              alt=""
              width={160}
              height={160}
              css={css`max-width: 100%; max-height: 100%;object-fit: cover;`}
            />
          </div>

          {/* number info */}
          <div
            css={css`
              flex-grow: 1;
              margin-left: ${theme.spacing(3)};
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
                margin-left: ${theme.spacing(5)};
                justify-content: start;
              }
            `}
          >
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              css={css`
                width: 100%;
                margin-bottom: 20px;
                @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
                  padding-right: 0;
                }
              `}
            >
              <SkillInfoColumn num={componentData.totalItem} text={t('on-sale')}/>
              <SkillInfoColumn num={componentData.numberSalesCompleted} text={t('complete')}/>
              <SkillInfoColumn num={componentData.stars ?? 0} text={t('review')} star/>
            </Stack>
            <Stack
              direction="column"
              css={css`text-align: right;`}
            >
              {
                componentData.isSpecialDiscount
                  ? <SalePrice/>
                  : <NormalPrice/>
              }
            </Stack>
            {
              componentData.statusType === STATUS_MAP.close && (
                <StopSellLabel
                  date={componentData.updatedAt}
                  css={css`
                    white-space: nowrap;
                    margin-top: ${theme.spacing(2)};
                    display: none;
                    width: 100%;
                    @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
                      display: flex;
                    }`
                  }
                />
              )
            }
            {componentData.statusType === STATUS_MAP.pause && (
              <PauseSellLabel
                css={css`
                  white-space: nowrap;
                  margin-top: ${theme.spacing(2)};
                  display: none;
                  width: 100%;
                  @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
                    display: flex;
                  }`
                }/>
            )}
          </div>
        </Grid>
      </Grid>
      <div
        css={css`
          text-align: center;
          margin-top: ${theme.spacing(3)};
          width: 100%;
          white-space: normal;
          word-break: break-word;
          @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
            display: none;
          }
        `}
      >
        {componentData.statusType === STATUS_MAP.close && <StopSellLabel date={componentData.updatedAt} css={css`width: 100%;`}/>}
        {componentData.statusType === STATUS_MAP.pause && <PauseSellLabel css={css`width: 100%;`}/>}
      </div>
      <NavigateButtons css={css`
        display: flex;
        margin-top: 20px;
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          margin-top: ${theme.spacing(4)};
        }
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          display: none;
        }
      `}/>
    </div>
  )
}

function SkillInfoColumn(props: {text: string, num: number, star?: boolean}) {
  const { num, text, star = false } = props
  const theme = useTheme()
  return (
    <div css={css`text-align: center;height: 41px;flex-grow: 1;`}>
      <Typography
        css={css`
          line-height: 21px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        `}
      >
        {
          star && <StarIcon
            css={css`
              font-size: 16px;
              height: 15px;
              width: 15px;
              margin: 0 5px 0 0;
              color: ${theme.palette.secondary.main};
            `}
          />
        }
        {
          num > 1000
            ? `${num/1000}K`
            : num
        }
      </Typography>
      <Typography variant="body2" css={css`line-height: 20px;`}>{text}</Typography>
    </div>
  )
}
function NormalPrice() {
  const prices = useAppSelector(priceSelector)
  const { t } = useTranslation(ns)
  const theme = useTheme()
  return (
    <Typography
      variant="h6"
      css={css`
        display: flex;
        align-items: center;
        justify-content: flex-end;
        line-height: 27px;
      `}
    >
      <Typography
        component="span"
        variant="body2"
        css={css`
          margin-top: auto;
          margin-bottom: 2px;
          margin-right: ${theme.spacing(1)};
          font-weight: 200;
        `}
      >{t('10')}</Typography>
      <span>￥{formatNumber(prices.price) || 0}</span>
    </Typography>
  )
}
function SalePrice() {
  const theme = useTheme()
  // const { t } = useTranslation(ns)
  const prices = useAppSelector(priceSelector)
  return (
    <>
      {/*<Typography*/}
      {/*  variant="body2"*/}
      {/*  css={css`*/}
      {/*    display: none;*/}
      {/*    @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {*/}
      {/*      display: inline-block;*/}
      {/*    }*/}
      {/*  `}*/}
      {/*>{t('11', { date1: formatDate(prices.specialDiscountStartAt, dateFormat), date2: formatDate(prices.specialDiscountEndAt, dateFormat) })}</Typography>*/}
      <Typography
        variant="h6"
        css={css`
          color: ${theme.palette.ruby.main};
          display: flex;
          align-items: center;
          justify-content: flex-end;
        `}
      >
        <Typography
          component="span"
          variant="body2"
          css={css`
            background: ${theme.palette.ruby.main};
            color: #fff;
            display: inline-flex;
            padding: ${theme.spacing(1)} ${theme.spacing(2)};
            border-radius: 300px;
          `}>SALE</Typography>
        <span>￥{formatNumber(prices.specialDiscountPrice) || 0}</span>
      </Typography>
      <Typography
        variant="body2"
        css={css`
          text-decoration: line-through;
          display: none;
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            display: inline-block;
          }
        `}
      >￥{formatNumber(prices.price) || 0}</Typography>
    </>
  )
}
function StopSellLabel(props: {date: number, className?: string}) {
  const theme = useTheme()
  const { t } = useTranslation(ns)
  return (
    <Typography
      className={props.className}
      css={css`
        display: inline-flex;
        padding: 12px 16px;
        color: ${theme.palette.jade.light};
        background: ${theme.palette.smoke.light};
        border-radius: 10px;
        white-space: normal!important;
        word-break: break-word;
      `}
    ><DesktopAccessDisabledIcon css={css`margin-right: 9px;`}/>{t('12', {date: formatDate(new Date(props.date), dateFormat)})}</Typography>
  )
}

function PauseSellLabel(props: { className?: string }) {
  const theme = useTheme()
  const { t } = useTranslation(ns)
  return (
    <Typography
      className={props.className}
      css={css`
        display: inline-flex;
        padding: 12px 16px;
        color: ${theme.palette.jade.light};
        background: ${theme.palette.smoke.light};
        border-radius: 10px;
        white-space: normal!important;
        word-break: break-word;
      `}
    >{t('14')}</Typography>
  )
}
