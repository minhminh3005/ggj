import { css } from '@emotion/react'
import Fade from '@mui/material/Fade'
import { memo } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { PaymentMethods, Steps } from './const'
import { useAppSelector } from 'store/hooks'
import { ns } from 'store/paymentSlice'
import { useTheme } from '@mui/material/styles'
import CartIcon from '../guide/CartIcon'
import { useTranslation } from 'next-i18next'
import {CreditSectionMemo} from './Step1'
const nsTran = 'surface@payment'

// const ConfirmCreditMemo = memo(function ConfirmCredit() {
//   const { t } = useTranslation(nsTran)
//   return (
//     <>
//       <Fade in={true} timeout={900}>
//         <Stack
//           direction={'column'}
//           justifyContent={'space-between'}
//           css={css`
//             height: 100%;
//           `}
//         >
//           <Stack direction={'row'} justifyContent={'space-between'}>
//             <Box
//               css={css`
//                 flex: auto;
//               `}
//             >
//               <Typography
//                 variant="h6"
//                 css={css`
//                   letter-spacing: 0.15px;
//                   line-height: 24px;
//                   font-weight: 400;
//                 `}
//               >
//                 {t('クレジットカード')}
//               </Typography>
//             </Box>
//             <Box
//               css={css`
//                 width: auto;
//               `}
//             >
//               <CartIcon
//                 css={css`
//                   width: 113px;
//                   height: 113px;
//                 `}
//               />
//             </Box>
//           </Stack>
//           <Typography
//             variant="subtitle2"
//             css={css`
//               letter-spacing: 0.15px;
//               line-height: 24px;
//               color: #222222de;
//               font-weight: 400;
//             `}
//           >
//             {/*{t('15')}*/}
//           </Typography>
//         </Stack>
//       </Fade>
//     </>
//   )
// })

const ConfirmBankTransferMemo = memo(function ConfirmBankTransfer() {
  const { t } = useTranslation(nsTran)
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
            `}
          >
            {t('15')}
          </Typography>
        </Stack>
      </Fade>
    </>
  )
})

const ConfirmConvenienceStoreMemo = memo(function ConfirmConvenienceStore() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const storeName = useAppSelector((state) => state[ns]?.storeName)
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
                {t(storeName)}
              </Typography>
            </Box>
            <Box
              css={css`
                width: auto;
                margin-left: ${theme.spacing(3)};
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
            `}
          >
            {t('16')}
          </Typography>
        </Stack>
      </Fade>
    </>
  )
})

const Step2 = () => {
  const currentPaymentMethod = useAppSelector(
    (state) => state[ns]?.currentPaymentMethod
  )
  const currentStep = useAppSelector((state) => state[ns]?.currentStep)
  if (currentStep == Steps.Step2)
    return (
      <Fade in={true} timeout={900}>
        <Box>
          {currentPaymentMethod == PaymentMethods.Credit && (
            <CreditSectionMemo />
          )}
          {currentPaymentMethod == PaymentMethods.BankTransfer && (
            <ConfirmBankTransferMemo />
          )}
          {currentPaymentMethod == PaymentMethods.PayAtConvenienceStore && (
            <ConfirmConvenienceStoreMemo />
          )}
        </Box>
      </Fade>
    )
  return null
}
export default memo(Step2)
