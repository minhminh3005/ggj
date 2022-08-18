import { css } from '@emotion/react'
import { FormEvent, memo, useMemo } from 'react'
import { Box, FormControl, FormHelperText, Grid, OutlinedInput, Typography, useTheme } from '@mui/material'
import { Control, Controller, RegisterOptions, useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { ns, sendRequestChangeEmailAddress,statusCodeChangeEmail } from 'store/emailSlice'
import { validEmail } from 'common/variables'
import { GgjPrimaryButton } from 'components/common'
import { toastHandler } from '../../../contexts/ToastContext'
import { ggjDebounce } from '../../../common/utils'

const nsTran = 'components@email'

const DescriptionMemo = memo(function Description() {
  const { t } = useTranslation(nsTran)
  return (
    <Typography
      variant='caption'
      css={css`
        line-height: 14px;
        font-weight: normal;
        text-align: left;
        letter-spacing: 0px;
      `}
    >
      {t('4')}
    </Typography>
  )
})

// interface FooterFormProps {
//   isDisabled: boolean
// }

const FooterFormMemo = memo(function FooterForm() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  // const isLoading = useAppSelector((state) => state[ns]?.isLoading)
  return (
    <Grid
      container
      css={css`
        margin-top: ${theme.spacing(4)};
      `}
    >
      <Grid item xs={12} md={6} lg={6}>
        <GgjPrimaryButton type='submit'>{t('5')}</GgjPrimaryButton>
      </Grid>
    </Grid>
  )
})

interface InputFormProps {
  control: Control<IFormValues>
  isError: boolean
  rules: RegisterOptions
  errorType: string
}

interface IFormValues {
  emailAddress: string
}

const InputForm = (props: InputFormProps) => {
  const { t } = useTranslation(nsTran)
  const theme = useTheme()
  const { isError, rules, control, errorType } = props
  return (
    <FormControl variant='outlined' fullWidth error={isError}>
      <Controller
        control={control}
        name='emailAddress'
        defaultValue=''
        aria-describedby='component-error-text'
        rules={rules}
        render={({ field }) => {
          return (
            <OutlinedInput
              css={css`
                margin-top: ${theme.spacing(1)};
                display: block;
                overflow: hidden;
              `}
              id='outlined-adornment-password'
              type={'text'}
              inputProps={{
                maxLength: 64,
              }}
              {...field}
            />
          )
        }}
      />
      {isError && <FormHelperText>{t(`${errorType}`)}</FormHelperText>}
    </FormControl>
  )
}

const InputFormMemo = memo(InputForm)

const LabelMemo = memo(function Label() {
  const { t } = useTranslation(nsTran)
  const theme = useTheme()
  return (
    <Typography
      variant='caption'
      css={css`
        line-height: 14px;
        color: ${theme.palette.text.primary};
      `}
    >
      {t('3')}
    </Typography>
  )
})

const Form = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(nsTran)
  const email = useAppSelector((state) => state[ns]?.emailAddress)
  const {
    handleSubmit,
    control,
    getValues,
    resetField,
    formState: { errors },
  } = useForm<IFormValues>({
    reValidateMode: 'onSubmit',
  })

  const errorType = useMemo(() => {
    if (errors && errors.emailAddress) {
      return errors.emailAddress.type
    }
    return ''
  }, [errors.emailAddress])

  const submit = async (data: { emailAddress: string }) => {
    const { emailAddress } = data
    if (emailAddress === email) {
      toastHandler({
        message: t('new email same email login'),
        type: 'error',
      })
      return
    }

    const statusCode: statusCodeChangeEmail = {
      SUCCESS: t('send-request-change-email-success'),
      EM001: t('validate error'),
      EM002: t('email already existed'),
      EM003: t('new email same email login'),
      EM004: t('too many request'),
    }

    // @ts-ignore
    await dispatch(sendRequestChangeEmailAddress(emailAddress, statusCode))
    resetField('emailAddress')
  }

  const onSubmit = ggjDebounce(() => {
    handleSubmit(submit)()
  }, 400)

  return (
    <Box
      component='form'
      css={css`
        margin-top: ${theme.spacing(4)};
      `}
      autoComplete='off'
      onSubmit={(e:FormEvent<HTMLElement>) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <div>
        <LabelMemo />
        <InputFormMemo
          errorType={errorType}
          control={control}
          isError={!!errors.emailAddress}
          rules={{
            required: true,
            validate: {
              checkEmailFormat: async () => {
                const email = getValues('emailAddress')
                return validEmail.test(email)
              },
            },
          }}
        />
        <DescriptionMemo />
        <FooterFormMemo />
      </div>
    </Box>
  )
}

export default Form
