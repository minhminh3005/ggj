import {css} from '@emotion/react'
import Fade from '@mui/material/Fade'
import {memo, useCallback} from 'react'
import {Box, FormControlLabel, Radio, RadioGroup, Stack, Typography, useMediaQuery,} from '@mui/material'

import {PaymentMethods, Steps, StoreName} from './const'
import {useAppDispatch, useAppSelector} from 'store/hooks'
import {actions, ns} from 'store/paymentSlice'
import {useTheme} from '@mui/material/styles'
import CartIcon from '../guide/CartIcon'
import {useTranslation} from 'next-i18next'
import image_master from 'components/pages/payment/image_master.png'
import image_visa from 'components/pages/payment/image_visa.png'
import Image from 'next/image'

const nsTran = 'surface@payment'

export const CreditSectionMemo = memo(function CreditSection() {
  const {t} = useTranslation(nsTran)
  const theme = useTheme()
  const breakPointXs = theme.breakpoints.values.md - 1
  return (
    <>
      <Fade in={true} timeout={900}>
        <Stack
          direction={'column'}
          justifyContent={'space-between'}
          css={css`
            height: 100%;
          `}
        >
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Box
              css={css`
                flex: auto;
              `}
            >
              <Typography
                variant="h6"
                css={css`
                  letter-spacing: 0.15px;
                  line-height: 24px;
                  font-weight: 400;
                `}
              >
                {t('クレジットカード')}
              </Typography>
            </Box>
            <Box
              css={css`
                width: auto;
              `}
            >
              <CartIcon
                css={css`
                  width: 113px;
                  height: 113px;
                `}
              />
            </Box>
          </Stack>
          <Typography
            variant="subtitle2"
            css={css`
              letter-spacing: 0.15px;
              line-height: 24px;
              color: #222222de;
              font-weight: 400;
              @media only screen and (max-width: ${breakPointXs}px) {
                letter-spacing: 0.1px;
              }
            `}
          >
            {t('利用可能なクレジットカード')}
          </Typography>
          <Stack
            direction={'row'}
            css={css`width: 100%`}
          >
            <Image src={image_master} width={64} height={44} alt="PayMaster"/>
            <Image src={image_visa} width={77} height={44} alt="PayVisa"/>
          </Stack>
        </Stack>
      </Fade>
    </>
  )
})

const BankTransferSectionMemo = memo(function BankTransferSection() {
  const {t} = useTranslation(nsTran)
  const theme = useTheme()
  const breakPointXs = theme.breakpoints.values.md - 1
  return (
    <>
      <Fade in={true} timeout={900}>
        <Stack
          direction={'column'}
          justifyContent={'space-between'}
          css={css`
            height: 100%;
          `}
        >
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Box
              css={css`
                flex: auto;
              `}
            >
              <Typography
                variant="h6"
                css={css`
                  letter-spacing: 0.15px;
                  line-height: 24px;
                  font-weight: 400;
                `}
              >
                {t('10')}
              </Typography>
            </Box>
            <Box
              css={css`
                width: auto;
              `}
            >
              <CartIcon
                css={css`
                  width: 113px;
                  height: 113px;
                `}
              />
            </Box>
          </Stack>
          <Typography
            variant="subtitle2"
            css={css`
              letter-spacing: 0.15px;
              line-height: 24px;
              color: #222222de;
              font-weight: 400;
              @media only screen and (max-width: ${breakPointXs}px) {
                letter-spacing: 0.1px;
              }
            `}
          >
            {t('11')}
          </Typography>
        </Stack>
      </Fade>
    </>
  )
})

const ChooseConvenienceStoreMemo = memo(function ChooseConvenienceStore() {
  const theme = useTheme()
  const {t} = useTranslation(nsTran)
  const isMobile = useMediaQuery(
    `(max-width:${theme.breakpoints.values.md - 1}px
      )`,
    {noSsr: true}
  )
  return (
    <>
      <Fade in={true} timeout={900}>
        <Stack
          direction={'column'}
          justifyContent={'space-between'}
          css={css`
            height: 100%;
          `}
        >
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Box
              css={css`
                flex: auto;
              `}
            >
              <Box>
                <Typography
                  variant="h6"
                  css={css`
                    letter-spacing: 0.15px;
                    line-height: 24px;
                    font-weight: 400;
                  `}
                >
                  {t('12')}
                </Typography>
                {!isMobile && (
                  <Typography
                    variant="subtitle2"
                    css={css`
                      margin-top: ${theme.spacing(3)};
                      letter-spacing: 0.1px;
                      line-height: 24px;
                      font-weight: 400;
                      color: #222222de;
                    `}
                  >
                    {t('13')}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box
              css={css`
                width: auto;
                margin-left: 20px;
              `}
            >
              <CartIcon
                css={css`
                  width: 113px;
                  height: 113px;
                `}
              />
            </Box>
          </Stack>
          {isMobile && (
            <Typography
              variant="subtitle2"
              css={css`
                margin-top: ${theme.spacing(3)};
                letter-spacing: 0.1px;
                line-height: 24px;
                font-weight: 400;
                color: #222222de;
              `}
            >
              {t('13')}
            </Typography>
          )}
          <CustomizedRadioButtonGroup/>
        </Stack>
      </Fade>
    </>
  )
})

const CustomizedRadioButtonGroup = memo(function CustomizedRadioButtonGroup() {
  const {t} = useTranslation(nsTran)
  const storeName = useAppSelector((state) => state[ns]?.storeName)
  const dispatch = useAppDispatch()
  const handleChange = useCallback((e: any) => {
    if (!e) return
    dispatch(actions.handleSetStoreName(e.target.value))
  }, [])
  return (
    <RadioGroup onChange={handleChange} value={storeName}>
      {Object.keys(StoreName).map((p) => {
        const label = t(p)
        return (
          <FormControlLabel
            value={p}
            control={<Radio/>}
            key={p}
            label={label}
          />
        )
      })}
    </RadioGroup>
  )
})

const Step1 = () => {
  const currentPaymentMethod = useAppSelector(
    (state) => state[ns]?.currentPaymentMethod
  )
  const currentStep = useAppSelector((state) => state[ns]?.currentStep)
  if (currentStep == Steps.Step1)
    return (
      <Fade in={true} timeout={900}>
        <Box>
          {
            currentPaymentMethod == PaymentMethods.Credit && (<CreditSectionMemo/>)
          }
          {currentPaymentMethod == PaymentMethods.BankTransfer && (
            <BankTransferSectionMemo/>
          )}
          {currentPaymentMethod == PaymentMethods.PayAtConvenienceStore && (
            <ChooseConvenienceStoreMemo/>
          )}
        </Box>
      </Fade>
    )
  return null
}
export default memo(Step1)
