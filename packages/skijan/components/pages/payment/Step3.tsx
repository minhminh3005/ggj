import {css} from '@emotion/react'
import Fade from '@mui/material/Fade'
import {memo} from 'react'
import {Box, Button, Divider, Grid, Stack, Typography} from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import PayIcon from '../guide/PayIcon'
import TextTitle from './TextTitle'
import Link from 'next/link'
import {useTheme} from '@mui/material/styles'
//Redux
import {useAppSelector} from 'store/hooks'
import {ns} from 'store/paymentSlice'
//I18n
import {useTranslation} from 'next-i18next'
//Common
import {BankTransferMethodType, PaymentCompleteType, PaymentMethods} from './const'
import {GgjContainButton} from '../../commons/GgjButton'
import {PaidOptionType} from '../../commons/GgjPaymentPanel/paymentPanelSlice'
import {formatNumber} from '../../../common/number'

const nsTran = 'surface@payment'


const InvoiceInfoBox = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTran)
  const paymentComplete = useAppSelector((state) => state[ns]?.paymentComplete)
  return (
    <Box
      css={css`
        border-radius: 10px;
        padding-left: ${theme.spacing(3)};
        padding-right: ${theme.spacing(3)};
        padding-top: ${theme.spacing(4)};
        padding-bottom: ${theme.spacing(4)};
        border: 1px solid ${theme.palette.smoke.light};
      `}
    >
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Typography
          variant="subtitle2"
          css={css`
            line-height: 24px;
            letter-spacing: 0.1px;
            font-weight: 400;
          `}
        >
          {t('17')}
        </Typography>
        <Typography
          variant="subtitle2"
          css={css`
            line-height: 24px;
            letter-spacing: 0.1px;
            font-weight: 400;
          `}
        >
          {paymentComplete?.sessionId}
        </Typography>
      </Stack>
      <Divider
        css={css`
          margin-top: ${theme.spacing(1)};
          margin-bottom: ${theme.spacing(4)};
        `}
      />
      <Stack direction={'row'}>
        <Box
          css={css`
            width: 80px;
            height: 80px;
            min-width: 80px;
            min-height: 80px;
          `}
        >
          <img
            src={paymentComplete?.product?.imageUrl}
            alt=""
            width="80px"
            height="80px"
            css={css`
              object-fit: cover;
              border-radius: 10px;
            `}
          />
        </Box>
        <Box ml={theme.spacing(4)}>
          <Typography
            variant="h6"
            css={css`
              line-height: 24px;
              letter-spacing: 0.15px;
              font-weight: 400;
            `}
          >
            {paymentComplete?.product?.title}
          </Typography>
        </Box>
      </Stack>
      {
        paymentComplete.paidOptions.length > 0 &&
        <>
          <Divider
            css={css`
              margin-top: ${theme.spacing(4)};
              margin-bottom: ${theme.spacing(1)};
            `}
          />
          <Typography
            variant="body2"
            css={css`
              line-height: ${theme.spacing(4)};
              color: ${theme.palette.jade.light};
            `}
          >
            {t('購入オプション')}
          </Typography>
          <ul css={css`
            margin-top: ${theme.spacing(1)};
            margin-bottom: 0;
            padding-left: ${theme.spacing(4)};
          `}>
            {
              paymentComplete.paidOptions.map((p: PaidOptionType) => (
                <li css={css` color: ${theme.palette.jade.light};`} key={p.id}>
                  <Typography
                    className={'ggj-wt'}
                    variant="body2"
                    css={css`
                      line-height: ${theme.spacing(4)};
                    `}
                  >
                    {p.optionName}
                  </Typography></li>
              ))
            }
          </ul>
        </>
      }
    </Box>
  )
}

const BankTransferInfo = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTran)
  const paymentComplete = useAppSelector<PaymentCompleteType>((state) => state[ns]?.paymentComplete)
  return (
    <Box
      mt={theme.spacing(3)}
      css={css`
        margin-top: ${theme.spacing(3)};
        border-radius: 10px;
        padding-left: ${theme.spacing(3)};
        padding-right: ${theme.spacing(3)};
        padding-top: ${theme.spacing(4)};
        padding-bottom: ${theme.spacing(4)};
        border: 1px solid ${theme.palette.smoke.light};
      `}
    >
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Typography
          variant="subtitle1"
          css={css`
            line-height: 24px;
            letter-spacing: 0.11px;
            font-weight: 400;
          `}
        >
          {t('18')}
        </Typography>
        <Typography
          variant="h6"
          css={css`
            line-height: 24px;
            letter-spacing: 0.11px;
            font-weight: 500;
          `}
        >
          {paymentComplete.thirdPartyData?.transferNumber}
        </Typography>
      </Stack>
      <Typography
        variant="subtitle1"
        css={css`
          line-height: 24px;
          letter-spacing: 0.11px;
          font-weight: 400;
        `}
      >
        {t('19')}
      </Typography>
      <Divider
        css={css`
          margin-top: ${theme.spacing(4)};
          margin-bottom: ${theme.spacing(4)};
        `}
      />
      <Typography
        variant="subtitle1"
        css={css`
          line-height: 24px;
          letter-spacing: 0.11px;
          font-weight: 400;
        `}
      >
        {t('20')}
      </Typography>
      <Box
        css={css`
          margin-top: ${theme.spacing(3)};
        `}
      >
        <TableBankTransferInfo
          css={css`
            margin-top: ${theme.spacing(3)};
          `}
        />
      </Box>
    </Box>
  )
}

const TableBankTransferInfo = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTran)
  const bankTransferInfos = useAppSelector(
    (state) => state[ns]?.paymentComplete?.thirdPartyData?.bankTransferMethod
  )
  if (!bankTransferInfos) return null
  const length = bankTransferInfos.length - 1
  return bankTransferInfos.map((p: BankTransferMethodType, index: number) => (
    <Box
      key={p.bankName}
      css={css`
        margin-bottom: ${index == length ? 0 : theme.spacing(5)};
      `}
    >
      <Box
        css={css`
          padding: 10px ${theme.spacing(3)};
          background-color: ${theme.palette.jade.dark};
          text-align: center;
        `}
      >
        <Typography
          variant="subtitle1"
          css={css`
            line-height: 24px;
            letter-spacing: 0.5px;
            font-weight: 500;
            color: #ffffff;
          `}
        >
          {p.bankName}
        </Typography>
      </Box>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        mt={theme.spacing(4)}
      >
        <Typography
          variant="subtitle2"
          css={css`
            line-height: 24px;
            letter-spacing: 0.1px;
            font-weight: 400;
          `}
        >
          {t('21')}
        </Typography>
        <Typography
          variant="subtitle1"
          css={css`
            line-height: 24px;
            letter-spacing: 0.5px;
            font-weight: 500;
            color: ${theme.palette.jade.dark};
          `}
        >
          {p.bankName}
        </Typography>
      </Stack>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        mt={theme.spacing(4)}
      >
        <Typography
          variant="subtitle2"
          css={css`
            line-height: 24px;
            letter-spacing: 0.1px;
            font-weight: 400;
          `}
        >
          {t('22')}
        </Typography>
        <Typography
          variant="subtitle1"
          css={css`
            line-height: 24px;
            letter-spacing: 0.5px;
            font-weight: 500;
            color: ${theme.palette.jade.dark};
          `}
        >
          {p.branchName}
        </Typography>
      </Stack>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        mt={theme.spacing(4)}
      >
        <Typography
          variant="subtitle2"
          css={css`
            line-height: 24px;
            letter-spacing: 0.1px;
            font-weight: 400;
          `}
        >
          {t('23')}
        </Typography>
        <Typography
          variant="subtitle1"
          css={css`
            line-height: 24px;
            letter-spacing: 0.5px;
            font-weight: 500;
            color: ${theme.palette.jade.dark};
          `}
        >
          {p.accountType}
        </Typography>
      </Stack>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        mt={theme.spacing(4)}
      >
        <Typography
          variant="subtitle2"
          css={css`
            line-height: 24px;
            letter-spacing: 0.1px;
            font-weight: 400;
          `}
        >
          {t('24')}
        </Typography>
        <Typography
          variant="subtitle1"
          css={css`
            line-height: 24px;
            letter-spacing: 0.5px;
            font-weight: 500;
            color: ${theme.palette.jade.dark};
          `}
        >
          {p.accountNumber}
        </Typography>
      </Stack>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        mt={theme.spacing(4)}
      >
        <Typography
          variant="subtitle2"
          css={css`
            line-height: 24px;
            letter-spacing: 0.1px;
            font-weight: 400;
          `}
        >
          {t('25')}
        </Typography>
        <Typography
          variant="subtitle1"
          css={css`
            line-height: 24px;
            letter-spacing: 0.5px;
            font-weight: 500;
            color: ${theme.palette.jade.dark};
          `}
        >
          {p.accountHolder}
        </Typography>
      </Stack>
    </Box>
  ))
}

// const ConvenienceStoreInfo = () => {
//   const theme = useTheme()
//   const {t} = useTranslation(nsTran)
//   const convenienceStoreInfo = useAppSelector<ConvenienceStoreInfoType>(
//     (state) => state[ns]?.invoice?.convenienceStoreInfo
//   )
//   if (!convenienceStoreInfo) return null
//   return (
//     <Box
//       mt={theme.spacing(3)}
//       css={css`
//         margin-top: ${theme.spacing(3)};
//         border-radius: 10px;
//         padding-left: ${theme.spacing(3)};
//         padding-right: ${theme.spacing(3)};
//         padding-top: ${theme.spacing(4)};
//         padding-bottom: ${theme.spacing(4)};
//         border: 1px solid ${theme.palette.smoke.light};
//       `}
//     >
//       <Stack
//         direction={'row'}
//         justifyContent={'space-between'}
//         alignItems={'center'}
//       >
//         <Typography
//           variant="subtitle2"
//           css={css`
//             line-height: 24px;
//             letter-spacing: 0.1px;
//             font-weight: 400;
//           `}
//         >
//           {t('26')}
//         </Typography>
//         <Typography
//           variant="subtitle1"
//           css={css`
//             line-height: 24px;
//             letter-spacing: 0.5px;
//             font-weight: 500;
//             max-width: 160px;
//             color: ${theme.palette.jade.dark};
//           `}
//         >
//           {convenienceStoreInfo.storeName}
//         </Typography>
//       </Stack>
//       <Stack
//         direction={'row'}
//         justifyContent={'space-between'}
//         alignItems={'center'}
//         mt={theme.spacing(4)}
//       >
//         <Typography
//           variant="subtitle2"
//           css={css`
//             line-height: 24px;
//             letter-spacing: 0.1px;
//             font-weight: 400;
//           `}
//         >
//           {t('27')}
//         </Typography>
//         <Typography
//           variant="subtitle1"
//           css={css`
//             line-height: 24px;
//             letter-spacing: 0.5px;
//             font-weight: 500;
//             color: ${theme.palette.jade.dark};
//           `}
//         >
//           {convenienceStoreInfo.paymentDueDate}
//         </Typography>
//       </Stack>
//       <Stack
//         direction={'row'}
//         justifyContent={'space-between'}
//         alignItems={'center'}
//         mt={theme.spacing(4)}
//       >
//         <Typography
//           variant="subtitle2"
//           css={css`
//             line-height: 24px;
//             letter-spacing: 0.1px;
//             font-weight: 400;
//           `}
//         >
//           {t('28')}
//           <br/>
//           {t('29')}
//         </Typography>
//         <Typography
//           variant="subtitle1"
//           css={css`
//             line-height: 24px;
//             letter-spacing: 0.5px;
//             font-weight: 500;
//             color: ${theme.palette.jade.dark};
//           `}
//         >
//           {convenienceStoreInfo.companyCode}
//         </Typography>
//       </Stack>
//       <Stack
//         direction={'row'}
//         justifyContent={'space-between'}
//         alignItems={'center'}
//         mt={theme.spacing(4)}
//       >
//         <Typography
//           variant="subtitle2"
//           css={css`
//             line-height: 24px;
//             letter-spacing: 0.1px;
//             font-weight: 400;
//           `}
//         >
//           {t('30')}
//           <br/>
//           {t('31')}
//         </Typography>
//         <Typography
//           variant="subtitle1"
//           css={css`
//             line-height: 24px;
//             letter-spacing: 0.5px;
//             font-weight: 500;
//             color: ${theme.palette.jade.dark};
//           `}
//         >
//           {convenienceStoreInfo.orderNumber}
//         </Typography>
//       </Stack>
//     </Box>
//   )
// }

const PaymentInfoBox = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTran)
  const paymentComplete = useAppSelector(
    (state) => state[ns]?.paymentComplete
  )

  if (!paymentComplete) return null

  return (
    <Box mt={theme.spacing(5)}>

      {
        paymentComplete.payId === PaymentMethods.Credit && (
          <Stack direction={'row'} justifyContent={'center'}>
            <Link href={`/mypage/transaction/${paymentComplete.transactionId}`} passHref>
              <GgjContainButton cssStr={'width:100%; max-width:440px'}>{t('やり取りをはじめる')}</GgjContainButton>
            </Link>
          </Stack>
        )
      }
      {paymentComplete.payId == PaymentMethods.BankTransfer && (
        <>
          <TextTitle>{t('32')}</TextTitle>
          <BankTransferInfo/>
        </>
      )}
      {paymentComplete.payId == PaymentMethods.PayAtConvenienceStore && (
        <>
          <TextTitle>{t('32')}</TextTitle>
        </>
      )}
      {/*<ConvenienceStoreInfo/>*/}
    </Box>
  )
}

const FooterInfo = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTran)

  const paymentComplete = useAppSelector(
    (state) => state[ns]?.paymentComplete
  )
  if (!paymentComplete) return null
  let Banner = null
  if (paymentComplete.payId == PaymentMethods.PayAtConvenienceStore) {
    Banner = (
      <Box
        css={css`
          margin-top: ${theme.spacing(3)};
          margin-bottom: ${theme.spacing(3)};
          max-width: 100%;
          display: flex;
          justify-content: center;
        `}
      >
        <img src={paymentComplete.thirdPartyData.bannerUrl} alt="" css={css`object-fit: contain;
          max-width: 100%`}/>
      </Box>
    )
  }
  return (
    <footer
      css={css`
        margin-top: ${theme.spacing(4)};
      `}
    >
      <Typography
        variant="subtitle1"
        css={css`
          line-height: 24px;
          letter-spacing: 0.5px;
          font-weight: 400;
          color: ${theme.palette.jade.dark};
        `}
      >
        {t('33')}
      </Typography>
      <Typography
        variant="subtitle1"
        css={css`
          line-height: 24px;
          letter-spacing: 0.5px;
          font-weight: 400;
          color: ${theme.palette.jade.dark};
          margin-top: ${theme.spacing(3)};
        `}
      >
        {t('34')}
      </Typography>
      {Banner}
    </footer>
  )
}

const Step3 = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTran)
  const paymentComplete = useAppSelector(
    (state) => state[ns]?.paymentComplete
  )

  return (
    <Fade in={true} timeout={900}>
      <Stack direction={'column'} justifyContent={'center'}>
        <Stack
          direction={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          css={css`
            margin-top: 40px;
            margin-bottom: 40px;
          `}
        >
          <PayIcon
            css={css`
              width: 120px;
              height: 120px;
            `}
          />
          <div>
            <Typography
              variant="h6"
              css={css`
                margin-top: ${theme.spacing(3)};
                line-height: 36px;
                font-size: 34px;
                text-align: center;
                font-weight: normal;
              `}
            >
              ￥{formatNumber(paymentComplete.totalPrice.toString())}
            </Typography>
            <Typography
              variant="h6"
              css={css`
                margin-top: ${theme.spacing(1)};
                line-height: 24px;
                letter-spacing: 0.15px;
                font-weight: 500;
                text-align: center;
              `}
            >
              {t('36')}
            </Typography>
          </div>
        </Stack>

        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12} lg={8} md={12}>
            <InvoiceInfoBox/>
            <PaymentInfoBox/>
            {paymentComplete.payId !== PaymentMethods.Credit && <FooterInfo/>}
            <Link href="/" passHref>
              <Button
                variant="text"
                css={css`
                  margin-top: ${theme.spacing(3)};
                  font-size: 16px;
                  font-weight: 500;
                `}
              >
                {t('35')}
                <ArrowForwardIosIcon
                  css={css`
                    width: 16px;
                    height: 16px;
                  `}
                />
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Stack>
    </Fade>
  )
}
export default memo(Step3)
