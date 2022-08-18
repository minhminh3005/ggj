import {Stack, Typography, useTheme} from '@mui/material'
import {css} from '@emotion/react'
import Image from 'next/image'
import {Title} from './Title'
import NoFavoriteIllustration from '../transaction/Images/noFavoriteIllustration.png'
import {CheckCircleOutline} from '@mui/icons-material/'
import {ns, TransactionInfo} from '../../../../store/transactionSlice'
import {useAppSelector} from '../../../../store/hooks'
import {dateFormatSlash, formatDate} from '../../../../common/date'
import {useTranslation} from 'next-i18next'
import {memo} from 'react'
import {TransactionType, nsTransaction} from './const'
import {GgjSocialSharing} from '../../../commons/GgjSocialSharing'

const ShareOnSocial = memo(({skillId}:{skillId: number}) => {
  const theme = useTheme()
  const { t } = useTranslation(nsTransaction)
  const mode = useAppSelector(state => state[ns]?.MENU_currentMode)
  if (mode == TransactionType.Seller) return null
  return <>
    <Typography
      css={css`
            margin-top: ${theme.spacing(3)};
            margin-bottom: 18px;
            letter-spacing: -2px;
            text-align: center;
            font-size: 12px;
            color: #707070;
            @media (min-width: ${theme.breakpoints.values.lg}px) {
              margin-top: 40px;
            }
          `}
      variant="subtitle2"
    >
      {t('50')}
    </Typography>

    <GgjSocialSharing skillId={skillId}/>
  </>
})
ShareOnSocial.displayName = 'ShareOnSocial'

export const CompleteTransaction = () => {
  const theme = useTheme()
  const { t } = useTranslation(nsTransaction)
  const transactionInfo: TransactionInfo = useAppSelector((state) => state[ns].DETAIL_transactionInfo || {})
  const skillId = useAppSelector((state) => state[ns].CHATINFO_info?.skillInfo?.skillId)
  if(transactionInfo?.cancelAt || !transactionInfo?.reviewAt) return null
  const payAt = transactionInfo?.payAt && formatDate(transactionInfo.payAt, dateFormatSlash) || ''
  const completeAt = transactionInfo?.completeAt && formatDate(transactionInfo.completeAt, dateFormatSlash) || ''
  const reviewAt = transactionInfo?.reviewAt && formatDate(transactionInfo.reviewAt, dateFormatSlash) || ''
  const steps = [{
    date: payAt ,
    title:  t('20'),
    status: t('21')
  },
  {
    date: completeAt ,
    title:t('22'),
    status: t('23')
  },
  {
    date: reviewAt ,
    title: t('24'),
    status: t('25')
  }]
  return (
    <div>
      <Title>{t('45')}</Title>
      <div
        css={css`
          border: 1px solid ${theme.palette.smoke.light};
          border-radius: 10px;
          padding: ${theme.spacing(4)};
          margin-top: ${theme.spacing(3)};
          background-color: ${theme.palette.canvas.light};
        `}
      >
        <Typography
          css={css`
            margin-bottom: ${theme.spacing(2)};
            text-align: center;
          `}
          variant="h6"
        >
          {t('progress-title-4')}
        </Typography>
        <Typography
          css={css`
            text-align: center;
            margin-bottom: ${theme.spacing(4)};
            @media (min-width: ${theme.breakpoints.values.md}px) {
              margin-bottom: 72px;
            }
            @media (min-width: ${theme.breakpoints.values.lg}px) {
              margin-bottom: 0px;
            }
          `}
          variant="subtitle1"
        >
          {t('progress-des-4')}
        </Typography>

        <Stack
          direction={'row'}
          justifyContent={'center'}
          gap={theme.spacing(1)}
          css={css`
            margin-top: ${theme.spacing(3)};
`}
        >
          <div
            css={css`
              height: 132px;
              width: 132px;
              @media (min-width: ${theme.breakpoints.values.lg}px) {
                height: 92px;
                width: 92px;
              }
            `}
          >
            <Image
              alt='SkjianImage'
              src={NoFavoriteIllustration}
              css={css`
                width: 100%;
                height: 100%;
              `}
            />
          </div>

          <div
            css={css`
              @media (min-width: ${theme.breakpoints.values.lg}px) {
                flex: 1;
              }
            `}
          >
            {steps.map(({title, date, status}, index) => (
              <div
                key={index}
                css={css`
                  &:not(:last-child) {
                    margin-bottom: ${theme.spacing(3)};
                  }
                `}
              >
                <Stack
                  color={theme.palette.primary.main}
                  direction={'row'}
                  alignItems={'center'}
                >
                  <CheckCircleOutline/>
                  <Typography
                    css={css`
                      color: ${theme.palette.primary.main};
                      margin-left: 10px;
                    `}
                    variant="subtitle1"
                  >
                    {title}
                  </Typography>
                </Stack>

                <Typography
                  css={css`
                    margin-top: ${theme.spacing(1)};
                    font-size: 12px;
                  `}
                  variant="subtitle2"
                >
                  {date + status}
                </Typography>
              </div>
            ))}
          </div>
        </Stack>

        <ShareOnSocial skillId={skillId}/>
      </div>
    </div>
  )
}
