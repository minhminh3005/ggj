import {Avatar, Stack, Typography, useTheme} from '@mui/material'
import {css} from '@emotion/react'
import {StarRate} from '@mui/icons-material'
import {Title} from './Title'
import {useTranslation} from 'next-i18next'
import {ns, UsersReviewProps} from '../../../../store/transactionSlice'
import {useAppSelector} from '../../../../store/hooks'
import {nsTransaction, TransactionType} from './const'
import GgjCollapseText from '../../../commons/GgjCollapseText'
import {rateColor} from '../../../../theme.config'

const reviewSellerContainer = 'review-seller'

const CompTitle = () => {
  const {t} = useTranslation(nsTransaction)
  const mode = useAppSelector(state => state[ns]?.MENU_currentMode)
  return (
    <Title>{mode == TransactionType.Buyer ? t('32') : t('33')} </Title>
  )
}

const UserInfo = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTransaction)
  const sellerReview: UsersReviewProps = useAppSelector((state) => state[ns].DETAIL_reviewBySeller || {})
  const sellerNickname = useAppSelector((state) => state[ns].DETAIL_sellerNickName || '')
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
        src={`/img/v3/skijan/users/avatar/${sellerReview.userId || -1}?noDefaultImg=0`}
        css={css`
          width: 40px;
          height: 40px;
          margin-right: ${theme.spacing(3)};
        `}
      />
      <div>
        <Typography variant="subtitle2" css={css`color: ${theme.palette.jade.light}`}>
          {t('30')}
        </Typography>
        <Typography css={css`
          word-break: break-all;
        `}>
          {sellerNickname}
        </Typography>
      </div>
    </Stack>
  )
}

export const ReviewBySeller = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTransaction)
  const sellerReview: UsersReviewProps = useAppSelector((state) => state[ns].DETAIL_reviewBySeller || {})
  if (Object.keys(sellerReview).length == 0) return null
  const comment = sellerReview?.comment || ''
  const reviewStars = sellerReview?.avgReviewStars ||0

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
            {t('76')}
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
                  font-size: ${theme.spacing(5)};
                  margin-right: ${theme.spacing(2)};
                  color: ${rateColor};
                `}
              />
              {
                !sellerReview.isAdminCancel ?
                  <Typography variant="h4" css={css`color: ${rateColor};`}>{reviewStars}</Typography>
                  :
                  <Typography variant="h4" css={css`color: ${rateColor};`}>--</Typography>
              }
            </Stack>
          </Stack>
        </Stack>

        <div
          id={reviewSellerContainer}
          css={css`
            margin-top: ${theme.spacing(3)};
            padding-top: ${theme.spacing(3)};
            border-top: 1px solid ${theme.palette.smoke.light};
          `}
        >
          {
            !sellerReview.isAdminCancel ?
              <GgjCollapseText
                collapseHeight={72}
                content={comment}
                containerId={`#${reviewSellerContainer}`}
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
