import { css } from '@emotion/react'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { validPassword } from 'common/variables'
import BackButton from 'components/common/BackButton'
import { useTranslation } from 'next-i18next'
import type { NextRequest } from 'next/server'
import { memo, useEffect, useState } from 'react'
import {
  Controller,
  FormProvider,
  RefCallBack,
  RegisterOptions,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import { reducerManager, sw } from 'store'
import { EP002, IStatusMessage, sendRequestChangePassword, SUCCESS } from 'store/passwordSlice'
import { ggjDebounce } from 'common/utils'
import Head from 'next/head'
import slice, { actions, getPassword, ns } from '../store/passwordSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

const nsTran = 'components@change-password'
const passwordMaxLength = 32

const validateRules = {
  password: {
    required: true,
    maxLength: passwordMaxLength,
    minLength: 6,
    pattern: validPassword,
  },
  repeatPassword: {
    required: true,
    maxLength: passwordMaxLength,
    minLength: 6,
  }
}
interface IPasswordFormValues {
  password: string;
  newPassword: string;
  newPassword2: string;
}

function PageHeading() {
  const { t } = useTranslation(nsTran)
  return (
    <>
      <BackButton />
      <Typography variant="h5" css={css`display: inline-block;`} mb={3}>{ t('2') }</Typography>
    </>
  )
}

function LabelInput(props: {
  title : string,
  name: keyof IPasswordFormValues
}) {
  const { title, name } = props
  const theme = useTheme()
  return (
    <Typography color={theme.palette.text.primary} variant="caption" component="label" htmlFor={name} mt={3} pb={2}>
      {title}
    </Typography>
  )
}

function InputWithIcon({ inputRef, ...rest }: { inputRef: RefCallBack }) {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <OutlinedInput
      type={showPassword ? 'text' : 'password'}
      endAdornment={
        <InputAdornment position="end">
          <IconButton onClick={() => { setShowPassword(!showPassword) }}>
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
      {...rest}
      inputProps={{
        maxLength: passwordMaxLength,
      }}
      inputRef={e => { inputRef(e) }}
    />
  )
}

function PasswordForm(
  props: {
    name: keyof IPasswordFormValues,
    rules: RegisterOptions
  }) {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const { control, formState: { errors } } = useFormContext()
  const {rules, name} = props
  const isError = !!Object.keys(errors[name] || {}).length
  return (
    <Grid item xs={12} sm={9} md={8}>
      <FormControl variant="outlined" fullWidth error={isError}>
        <LabelInputMemo title={t(name)} name={name} />
        <Controller
          control={control}
          name={name}
          aria-describedby={`component-${name}-text`}
          defaultValue=""
          rules={rules}
          render={({ field: { ref, ...rest } }) => {
            return (
              <InputWithIcon inputRef={ref} {...rest} />
            )
          }}
        />
        {/* error text */}
        {!!isError && name !== 'newPassword' && <FormHelperText>{t(`warning-${name}`)}</FormHelperText>}
        {name === 'newPassword' &&
          <>
            {(errors['newPassword'] || {}).type === 'validate' &&
              <FormHelperText>{t('duplicate-warning')}</FormHelperText>
            }
            <Typography
              color={(errors['newPassword'] || {}).type !== 'validate' && isError ? 'error' : theme.palette.text.primary}
              variant="caption"
              component="p"
              mt={1}
            >
              {t('warning-newPassword')}
            </Typography>
          </>
        }
      </FormControl>
    </Grid>
  )
}

function SubmitButton() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const dispatch = useAppDispatch()
  const { control, handleSubmit, reset, setError } = useFormContext<IPasswordFormValues>()
  const formData = useWatch({
    control,
  })
  const isDisable = Object.values(formData).length <= 0 || Object.values(formData).some(i => i.length < 6)

  const handleClickChangePassword = async (data : IPasswordFormValues) => {
    const statusCode: IStatusMessage = {
      SUCCESS: t('success'),
      ERROR: t('error'),
    }
    const payload = {
      currentPassword: data.password,
      newPassword: data.newPassword
    }
    const res = await sendRequestChangePassword(payload, statusCode)
    if(res === SUCCESS) {
      reset()
      dispatch(actions.setIsHideCurrentPassword(false))
    } else if (res === EP002) {
      setError('password', {type: 'custom', message: t('warning-password')}, {shouldFocus: true})
    }
  }


  return (
    <Grid container>
      <Grid item xs={12} sm={5} md={4}>
        <Button
          variant="contained"
          fullWidth
          onClick={ggjDebounce(handleSubmit(handleClickChangePassword), 400)}
          disabled={isDisable}
          css={css`
            height: 42px;
            margin:${theme.spacing(4)} 0;
          `}
        >{ t('button') }</Button>
      </Grid>
    </Grid>
  )
}

const FormGroup = () => {
  const isHideCurrentPassword = useAppSelector(state => state[ns].isHideCurrentPassword)
  const { t } = useTranslation(nsTran)
  const methods = useForm<IPasswordFormValues>({
    reValidateMode: 'onSubmit',
  })
  return (
    <FormProvider {...methods}>
      {isHideCurrentPassword &&
        <Typography variant='h6' my={4} color="primary.dark" fontWeight="normal">
          {t('sns-change-password')}
        </Typography>
      }

      <Grid container>
        {!isHideCurrentPassword &&
          <PasswordForm
            name='password'
            rules={validateRules.password}
          />
        }
        <PasswordForm
          name='newPassword'
          rules={{
            ...validateRules.password,
            validate: (value: string) => value !== methods.getValues('password'),
          }}
        />
        <PasswordForm
          name='newPassword2'
          rules={{
            ...validateRules.repeatPassword,
            validate: (value: string) => value === methods.getValues('newPassword'),
          }}
        />
        <SubmitButtonMemo />
      </Grid>
    </FormProvider>
  )
}

// MEMO
const SubmitButtonMemo = memo(SubmitButton)
const LabelInputMemo = memo(LabelInput)
const FormGroupMemo = memo(FormGroup)

export default function Password() {
  reducerManager.add(slice)
  const { t } = useTranslation(nsTran)

  useEffect(() => {
    return () => {
      reducerManager.remove(ns)
    }
  })
  return (
    <>
      <Head>
        <title>{t('meta-title')}</title>
        <meta name="description" content={t('meta-description')} />
        <meta name="keywords" content={t('meta-kw')} />
      </Head>
      <PageHeading />
      <FormGroupMemo />
    </>
  )
}

export const getServerSideProps = sw.getServerSideProps(({ dispatch }) => async ({ req }) => {
  reducerManager.add(slice)

  const [_nextI18Next, data] = await Promise.all([
    ggjServerSideTranslations(req as unknown as NextRequest, [nsTran]),
    getPassword(req as unknown as NextRequest),
  ])

  const { isHideCurrentPassword } = data.data
  dispatch(actions.setIsHideCurrentPassword(isHideCurrentPassword))

  const props = {
    props: {
      ..._nextI18Next,
    },
  }
  return { ...props }
})
