import {css} from '@emotion/react'
import {Box, CircularProgress, circularProgressClasses, Stack, Typography, useTheme} from '@mui/material'
import {toastHandler} from 'contexts/ToastContext'
import {useTranslation} from 'next-i18next'
import {loadingOffHandler, loadingOnHandler} from 'contexts/LoadingContext'
import {Title} from 'components/pages/mypage/transaction/Title'
import {ReviewsOutlined, TaskAlt} from '@mui/icons-material/'
import {GgjContainButton} from '../../../commons/GgjButton'
import {memo} from 'react'
import {actions, ListReviewProps, ns, reviewTransactionById, TransactionInfo} from 'store/transactionSlice'
import {dateFormatSlash, formatDate} from 'common/date'
import {useAppDispatch, useAppSelector} from 'store/hooks'
import {nsTransaction, SKILL_SALES_STATUS, TransactionType} from './const'

export const ProgressTransaction = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTransaction)
  const transactionInfo: TransactionInfo = useAppSelector((state) => state[ns].DETAIL_transactionInfo)
  if(transactionInfo && transactionInfo.cancelAt)
  {
    return <div>
      <div><Title>{t('45')}</Title></div>
      <Box
        mt={3}
        p={3}
        textAlign="center"
        css={css`
          background: ${theme.palette.canvas.light};
          border: 1px solid ${theme.palette.divider};
          border-radius: 10px;
        `}>
        <Typography variant="h6">{t('47')}</Typography>
        <Typography variant="subtitle1" css={css`
          margin-top: ${theme.spacing(2)};
        `}>
          {t('46', {closeDate: formatDate(transactionInfo.cancelAt, dateFormatSlash)})}
        </Typography>
      </Box>
    </div>
  }
  if (!transactionInfo || transactionInfo.reviewAt) return null
  const payAt = transactionInfo?.payAt && formatDate(transactionInfo.payAt, dateFormatSlash) || ''
  const completeAt = transactionInfo?.completeAt && formatDate(transactionInfo.completeAt, dateFormatSlash) || ''
  const reviewAt = transactionInfo?.reviewAt && formatDate(transactionInfo.reviewAt, dateFormatSlash) || ''

  const stepList = [{
    isActive: Boolean(payAt),
    date: payAt && `${payAt}${t('21')}`,
    title: t('20')
  },
  {
    isActive: Boolean(completeAt),
    date: completeAt && `${completeAt}${t('23')}`,
    title: t('22')
  },
  {
    isActive: Boolean(reviewAt),
    date: reviewAt && `${reviewAt}${t('25')}`,
    title: t('24')
  }]

  const step = transactionInfo.salesStatus

  return (
    <div>
      <div><Title>{t('45')}</Title></div>
      <Box
        mt={3}
        p={3}
        textAlign="center"
        css={css`
          background: ${theme.palette.canvas.light};
          border: 1px solid ${theme.palette.divider};
          border-radius: 10px;
        `}>
        <TitleAndDescription/>
        <Stack
          direction="row"
          mt={4}
          mb={5}
          spacing={{xs: 4, md: 6, lg: 3}}
          justifyContent="center"
          alignItems="flex-start"
        >
          <ProgressCircleWithSteps step={step}/>
          <Stack spacing={3}>
            {stepList.map((item, index) => <ProgressStep key={index} {...item}/>)}
          </Stack>
        </Stack>
        <StepButton step={transactionInfo.salesStatus}/>
      </Box>
    </div>
  )
}

const TitleAndDescription = () => {
  const {t} = useTranslation(nsTransaction)
  const salesStatus = useAppSelector(state => state[ns]?.DETAIL_transactionInfo?.salesStatus)

  return <>
    <Title>
      {t(`progress-title-${salesStatus}`)}
    </Title>
    <Typography mt={2} variant="subtitle1">
      {t(`progress-des-${salesStatus}`)}
    </Typography>
  </>
}

const ProgressCircleWithSteps = memo(function ProgressCircleWithSteps({step}: { step: number }) {
  const calcStep = step == SKILL_SALES_STATUS.BUYER_COMPLETE_STATUS ? 2 : 1
  return (
    <Box
      css={css`
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <ProgressCircle step={calcStep}/>
      <Box css={css`
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `}>
        <Typography
          variant="subtitle1"
          fontWeight="medium"
          color="primary.main"
        >STEP</Typography>
        <Typography
          variant="caption"
          fontWeight="medium"
        >{`${calcStep}/3`}</Typography>
      </Box>
    </Box>
  )
})

const ProgressCircle = memo(function ProgressCircle(props: {
  step: number
}) {
  const theme = useTheme()
  const {step} = props
  return (
    <Box position="relative" height="92px">
      <CircularProgress
        variant="determinate"
        css={css`
          color: #DEDEDE;
        `}
        size={92}
        thickness={4}
        {...props}
        value={100}
      />

      <CircularProgress
        variant="determinate"
        css={css`
          position: absolute;
          left: 0;
          color: #AEBADE;

          & .${circularProgressClasses.circle} {
            stroke-linecap: round;
          }
        `}
        size={92}
        thickness={4}
        {...props}
        value={(step + 1) / 3 * 100}
      />
      <CircularProgress
        variant="determinate"
        css={css`
          position: absolute;
          left: 0;
          color: ${theme.palette.primary.main};

          & .${circularProgressClasses.circle} {
            stroke-linecap: round;
          }
        `}
        size={92}
        thickness={4}
        {...props}
        value={step / 3 * 100}
      />
    </Box>
  )
})

const ProgressStep = memo(function ProgressStep(props: {
  isActive?: boolean,
  date: string,
  title: string
}) {
  const theme = useTheme()
  const {isActive, date, title} = props
  return (
    <Box>
      <Stack direction="row" spacing={2} css={css` opacity: ${isActive ? 1 : 0.5}`}>
        <TaskAlt css={css`fill: ${isActive ? theme.palette.primary.main : theme.palette.jade.light};`}/>
        <Typography
          variant="subtitle1"
          fontWeight="medium"
          css={css`
            color: ${isActive && theme.palette.primary.main};
          `}
        >
          {title}
        </Typography>
      </Stack>
      {isActive && date &&
        <Typography
          variant="body2"
          mt={1}
          css={css` color: ${theme.palette.jade.light};`}
        >
          {date}
        </Typography>}
    </Box>
  )
})

const StepButton = memo(function StepButton({step}:{step:number}) {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const {t} = useTranslation(nsTransaction)
  const mode = useAppSelector(state => state[ns]?.MENU_currentMode)
  const transactionInfo: TransactionInfo = useAppSelector((state) => state[ns].DETAIL_transactionInfo)
  const chatInfo = useAppSelector((state) => state[ns].CHATINFO_info)
  const salesStatus = transactionInfo?.salesStatus
  const isNotDisabled = chatInfo?.sellerId === chatInfo?.buyerId ||
    salesStatus === SKILL_SALES_STATUS.BUYER_COMPLETE_STATUS ||
    (mode === TransactionType.Seller && salesStatus === SKILL_SALES_STATUS.PROGRESS_STATUS) ||
    (mode === TransactionType.Buyer && salesStatus === SKILL_SALES_STATUS.SELLER_COMPLETE_STATUS)

  let text = ''
  if(salesStatus == SKILL_SALES_STATUS.BUYER_COMPLETE_STATUS) text = t('36')
  else if(mode == TransactionType.Buyer) text = t('37')
  else text = t('38')

  const handleCallApiReview = async () => {
    try {
      loadingOnHandler()
      const targetType = chatInfo?.sellerId === chatInfo?.buyerId || mode === TransactionType.Buyer ? 1 : 2
      const {data, error}: any = await reviewTransactionById(targetType)
      if (error) {
        toastHandler({message: t('28'), type: 'error'})
        return
      }
      const listRefactor = data.data.map((values: ListReviewProps<number>) => {
        return {
          ...values, rating: 0
        }
      })
      dispatch(actions.setListReviewTransaction(listRefactor))
      dispatch(actions.setIsShowPopupReview(true))
    } catch (e) {
      toastHandler({type: 'error'})
    } finally {
      loadingOffHandler()
    }
  }

  const handleCheckType = async () => {
    if (chatInfo?.buyerId === chatInfo?.sellerId) {
      switch (transactionInfo.salesStatus) {
      case SKILL_SALES_STATUS.PROGRESS_STATUS:
      case SKILL_SALES_STATUS.SELLER_COMPLETE_STATUS: {
        dispatch(actions.setIsShowPopupConfirm(true))
        break
      }
      case SKILL_SALES_STATUS.BUYER_COMPLETE_STATUS: {
        await handleCallApiReview()
        break
      }
      }
      return
    }

    if (mode === TransactionType.Seller) {
      switch (transactionInfo.salesStatus) {
      case SKILL_SALES_STATUS.PROGRESS_STATUS: {
        dispatch(actions.setIsShowPopupConfirm(true))
        break
      }
      case SKILL_SALES_STATUS.BUYER_COMPLETE_STATUS: {
        await handleCallApiReview()
        break
      }
      }
    }
    // is buyer
    else {
      switch (transactionInfo.salesStatus) {
      case SKILL_SALES_STATUS.SELLER_COMPLETE_STATUS: {
        dispatch(actions.setIsShowPopupConfirm(true))
        break
      }
      case SKILL_SALES_STATUS.BUYER_COMPLETE_STATUS: {
        await handleCallApiReview()
        break
      }
      }
    }
  }

  return <>
    <GgjContainButton
      disabled={!isNotDisabled}
      css={css`
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.md}px) {
          width: auto;
          padding-inline: ${theme.spacing(6)};
        }
        @media (min-width: ${theme.breakpoints.values.lg}px) {
          width: 100%;
        }


      `}
      startIcon={step === SKILL_SALES_STATUS.BUYER_COMPLETE_STATUS ? <ReviewsOutlined/> : <TaskAlt/>}
      onClick={handleCheckType}
    >
      {text}
    </GgjContainButton>
  </>
})
