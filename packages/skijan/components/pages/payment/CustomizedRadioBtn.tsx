import {Button, Stack, Typography} from '@mui/material'
import {memo, useMemo} from 'react'
import {css} from '@emotion/react'
import {useTheme} from '@mui/material/styles'
import {Icons} from './const'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import {useAppDispatch, useAppSelector} from 'store/hooks'
import {actions, ns} from 'store/paymentSlice'
import {useTranslation} from 'next-i18next'
import {rgba} from 'emotion-rgba'

const nsTran = 'surface@payment'

interface PaymentMethod {
  icon: string
  type: number
  disabled: boolean
  label: string
}

const CustomizedRadioBtn = ({
  paymentMethod,
}: {
  paymentMethod: PaymentMethod
}) => {
  const currentPaymentMethod = useAppSelector(
    (state) => state[ns]?.currentPaymentMethod
  )
  const {t} = useTranslation(nsTran)
  const dispatch = useAppDispatch()
  const theme = useTheme()

  const isActive = useMemo(
    () => paymentMethod.type == currentPaymentMethod,
    [currentPaymentMethod]
  )
  const borderColor = isActive
    ? theme.palette.primary.main
    : theme.palette.smoke.light

  const IconComponent = Icons.find((p) => p.name == paymentMethod.icon)?.icon
  const cssStr = !paymentMethod.disabled ?
    css`` :
    css`
      &:before {
        content: '';
        width: 100%;
        height: 100%;
        background-color: ${rgba('#000', 0.5)};
        left: 0;
        top: 0;
        position: absolute;
        border-radius: inherit;
      }

      &:after {
        content: 'Comming soon...';
        width: 90%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        position: absolute;
        font-size: 12px;
        color: #fff;
        text-transform: none;
        @media (max-width: ${theme.breakpoints.values.md - 1}px) {
          font-size: 14px;
        }
      }
    `
  return (
    <Button
      variant="outlined"
      disabled={paymentMethod.disabled}
      css={css`
        position: relative;
        border: 1px solid transparent;
        border-color: ${borderColor};
        border-radius: 10px;
        padding: ${theme.spacing(3)};
        text-align: center;
        flex: 1;
        ${cssStr}
      `}
      onClick={() =>
        dispatch(actions.handleSetCurrentPaymentMethod(paymentMethod.type))
      }
    >
      {isActive && (
        <CheckCircleOutlineIcon
          css={css`
            position: absolute;
            right: 6px;
            top: 6px;
            width: 20px;
            height: 20px;
          `}
        />
      )}
      <Stack direction={'column'} justifyContent="center" alignItems="center">
        {IconComponent ? (
          <IconComponent
            css={css`
              margin-bottom: 10px;
            `}
          />
        ) : (
          <></>
        )}
        <Typography
          variant="subtitle1"
          css={css`
            line-height: 24px;
            letter-spacing: 0.5px;
            font-weight: normal;
            color: ${theme.palette.jade.light};
              //opacity: ${paymentMethod.disabled && 0.4};
          `}
        >
          {t(paymentMethod.label)}
        </Typography>
      </Stack>
    </Button>
  )
}

export default memo(CustomizedRadioBtn)
