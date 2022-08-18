import {Avatar, Grid, Rating, Stack, Typography, useTheme} from '@mui/material'
import {css} from '@emotion/react'
import {StarRate} from '@mui/icons-material'
import {Title} from './Title'
import {formatNumber} from '../../../../common/number'
import {ns, ReviewDetailsProps, UsersReviewProps} from '../../../../store/transactionSlice'
import {useAppSelector} from '../../../../store/hooks'
import {nsTransaction, TransactionType} from './const'
import {useTranslation} from 'next-i18next'
import GgjCollapseText from '../../../commons/GgjCollapseText'
import {rateColor} from '../../../../theme.config'

const reviewBuyerContainer = 'review-buyer'

export interface IGgjReviewSummaryDetail {
  reviewType: string | ''
  reviewStars: number | 1
}

export const AvgReviewDetail = ({detail}: { detail: IGgjReviewSummaryDetail }) => {
  const theme = useTheme()
  const buyerReview: UsersReviewProps = useAppSelector((state) => state[ns]?.DETAIL_reviewByBuyer || {})
  return (
    <>
      <div>
        <Typography variant="body2" css={css`
          font-size: 12px;
          @media (min-width: ${theme.breakpoints.values.lg}) {
            max-width: 120px;
          }
        `}>{detail.reviewType}</Typography>
      </div>
      <div
        css={css`
          display: flex;
          align-items: flex-start;
        `}
      >
        <div>
          <Rating
            readOnly
            precision={0.5}
            name="simple-controlled"
            size="medium"
            value={!buyerReview.isAdminCancel ? detail.reviewStars : 0}
            css={css`
              font-size: 1.2rem;
              max-width: 120px;
            `}
          />
        </div>
        <div
          css={css`
            margin-left: 5px;
            width: 10px;
          `}
        >
          {
            !buyerReview.isAdminCancel ?
              <Typography variant="body2">{formatNumber(detail.reviewStars)}</Typography>
              :
              <Typography variant="body2">--</Typography>
          }
        </div>
      </div>
    </>
  )
}

const CompTitle = () => {
  const {t} = useTranslation(nsTransaction)
  const mode = useAppSelector(state => state[ns]?.MENU_currentMode)
  return (
    <Title>{mode == TransactionType.Buyer ? t('31') : t('32')} </Title>
  )
}

const UserInfo = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTransaction)
  const buyerReview = useAppSelector((state) => state[ns].DETAIL_reviewByBuyer || {}) as UsersReviewProps
  const buyerNickname = useAppSelector((state) => state[ns].DETAIL_buyerNickName || '')
  return (
    <Stack
      direction={'row'}
      css={css`
        align-items: flex-start;
        margin-bottom: ${theme.spacing(3)};
        padding-bottom: ${theme.spacing(3)};
        border-bottom: 1px solid ${theme.palette.smoke.light};
      `}
    >
      <Avatar
        src={`/img/v3/skijan/users/avatar/${buyerReview.userId || -1}?noDefaultImg=0`}
        css={css`
          width: 40px;
          height: 40px;
          margin-right: ${theme.spacing(3)};
        `}
      />
      <div>
        <Typography variant="subtitle2" css={css`color: ${theme.palette.jade.light}`}>
          {t('29')}
        </Typography>
        <Typography css={css`
          word-break: break-all;
        `}>
          {buyerNickname}
        </Typography>
      </div>
    </Stack>
  )
}

export const ReviewByBuyer = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTransaction)
  const buyerReview: UsersReviewProps = useAppSelector((state) => state[ns]?.DETAIL_reviewByBuyer || {})
  if (Object.keys(buyerReview).length == 0) return null
  const comment = buyerReview?.comment || ''
  const reviewData = {
    reviewStars: buyerReview?.avgReviewStars || 0,
    reviewDetails: buyerReview.reviewDetail.map((valuesReview : ReviewDetailsProps) => {
      return {
        reviewType: valuesReview?.reviewRequirementsName || '',
        reviewStars: valuesReview?.rating || 0
      }
    }),
  }

  return (
    <div>
      <CompTitle/>
      <div
        css={css`
          border: 1px solid ${theme.palette.smoke.light};
          border-radius: 10px;
          padding: ${theme.spacing(4)} ${theme.spacing(3)};
          margin-top: ${theme.spacing(3)};
          background-color: ${theme.palette.canvas.light};
        `}
      >
        <UserInfo/>
        <Stack
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          css={css`
            margin-bottom: ${theme.spacing(2)};
          `}
        >
          <Typography
            variant="h6"
            css={css`
              letter-spacing: 0.15px;
            `}
          >
            {t('74')}
          </Typography>

          <Stack direction={'row'} alignItems={'center'}>
            <Stack
              direction={'row'}
              alignItems={'center'}
              css={css`
                color: ${theme.palette.secondary.main};
              `}
            >
              <StarRate
                css={css`
                  font-size: 32px;
                  margin-right: ${theme.spacing(2)};
                  color: ${rateColor};
                `}
              />
              {
                !buyerReview.isAdminCancel ?
                  <Typography variant="h4" css={css`color: ${rateColor};`}>{reviewData.reviewStars}</Typography>
                  :
                  <Typography variant="h4" css={css`color: ${rateColor};`}>--</Typography>
              }
            </Stack>
          </Stack>
        </Stack>


        <div
          css={css`
            border-radius: 10px;
            border: unset;
            padding: unset;
          `}
        >
          <Typography
            variant="h6"
            css={css`
              margin-bottom: 20px;
            `}
          >
            {t('75')}
          </Typography>
          <Grid container rowSpacing={3} columnSpacing={5}>
            {reviewData.reviewDetails.map((item: IGgjReviewSummaryDetail) => (
              <Grid
                key={item.reviewType}
                item
                container
                alignItems="center"
                justifyContent="space-between"
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <AvgReviewDetail detail={item}/>
              </Grid>
            ))}
          </Grid>
        </div>
        <div
          id={reviewBuyerContainer}
          css={css`
            margin-top: ${theme.spacing(3)};
            padding-top: ${theme.spacing(3)};
            border-top: 1px solid ${theme.palette.smoke.light};
          `}
        >
          {
            !buyerReview.isAdminCancel ?
              <GgjCollapseText
                collapseHeight={72}
                content={comment}
                containerId={`#${reviewBuyerContainer}`}
                openTextDefault={t('78')}
                closeTextDefault={t('79')}
                css={css`
                .OpacityDiv {
                  background: transparent linear-gradient(180deg, #Fafafa59 0%, #fafafaf2 100%) 0 0 no-repeat padding-box;
                }
              `}/>
              :
              <Typography variant="subtitle1">{t('94')}</Typography>
          }
        </div>
      </div>
    </div>
  )
}
