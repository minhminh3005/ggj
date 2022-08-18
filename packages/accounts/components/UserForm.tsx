import { Button, FormControl, FormHelperText, OutlinedInput, Stack, Typography } from '@mui/material'

import {useEffect, useRef, forwardRef, useState, memo, ReactElement, useCallback} from 'react'
import { useTranslation } from 'next-i18next'
import { Control, Controller, useForm, useWatch } from 'react-hook-form'
import {
  appError,
  roleError,
  validEmail,
  validPassword
} from 'common/variables'
import GgjInputPassword from './GgjInputPassword'
import { useRouter } from 'next/router'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { toastHandler } from 'contexts/ToastContext'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { ns, authApi, checkUserStatusApi, TScreenType, actions } from '../store/authSlice'
import { loadingOnHandler, loadingOffHandler } from 'contexts/LoadingContext'
import {ggjDebounce} from '../common/utils'

interface IFormValues {
  email: string,
  password: string,
}

const SubmitButtonForm = memo(({
  control,
  children,
}: {control: Control<IFormValues>, children: ReactElement}) => {
  const formData = useWatch({
    control: control,
    name: ['email', 'password'],
  })

  return (
    <Button
      disabled={formData.some(x => !x)}
      type="submit"
      fullWidth
      variant="contained"
    >
      {children}
    </Button>
  )
})
SubmitButtonForm.displayName = 'SubmitButtonForm'

const InputEmail = memo(forwardRef(({
  errors,
  control,
}: {errors: FieldErrors, control: Control<IFormValues>}, inputRef) => {
  const {t} = useTranslation(['common@userform', 'common@validate'])
  const email = useAppSelector(state => state[ns].email)
  useEffect(() => {
    setTimeout(() => {
      //@ts-ignore
      inputRef!.current.focus()
    })
  }, [])

  return (
    <FormControl variant="outlined" fullWidth error={!!Object.keys(errors.email || {}).length}>
      <Typography variant="body2" pb={1}>
        {t('1')}
      </Typography>
      <Controller
        control={control}
        name="email"
        aria-describedby="component-email-text"
        defaultValue={email}
        rules={{
          required: true,
          pattern: validEmail,
        }}
        render={({field: {ref, ...rest}}) => {
          return (
            <OutlinedInput
              placeholder={t('1')}
              {...rest}
              inputRef={e => {
                ref(e)
                //@ts-ignore
                inputRef!.current = e
              }}
            />
          )
        }}
      />
      {!!errors.email && <FormHelperText>
        {t(`${errors.email.type}-email`, {ns: 'common@validate'})}
      </FormHelperText>}
    </FormControl>
  )
}))
InputEmail.displayName = 'InputEmail'

const InputPassword = ({errors, control, screenType}: {errors: FieldErrors, control: Control<IFormValues>, screenType: TScreenType}) => {
  const { t } = useTranslation(['common@userform', 'common@validate'])
  const inputRefPass = useRef<HTMLInputElement>()
  return (
    <FormControl variant="outlined" fullWidth error={!!Object.keys(errors.password || {}).length}>
      <Typography variant="body2" pb={1}>
        {t('2')}
      </Typography>
      <Controller
        control={control}
        name="password"
        aria-describedby="component-password-text"
        defaultValue=""
        rules={{
          required: true,
          maxLength: 32,
          minLength: 6,
          pattern: screenType? validPassword : undefined,
        }}
        render={({field: {ref, ...rest}}) => {
          return (
            <GgjInputPassword
              error={!!errors.password}
              {...rest}
              inputRef={e => {ref(e);inputRefPass.current = e}}
            />
          )
        }}
      />
      {!!errors.password && <FormHelperText>
        {t(`${errors.password.type}-password`,{ ns:'common@validate' } )}
      </FormHelperText>}
    </FormControl>
  )
}

export default function UserForm({screenType}: {
  screenType: TScreenType,
}) {
  const { t } = useTranslation(['common@userform', 'common@validate'])
  const router = useRouter()
  const inputRefEmail = useRef<HTMLInputElement>(null)
  const [isValidating, setIsValidating] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setTimeout(() => {
      inputRefEmail.current?.focus()
    })
  }, [])

  const {
    handleSubmit,
    control,
    formState: {errors},
    setError,
  } = useForm<IFormValues>({
    reValidateMode: 'onSubmit'
  })

  /**
   * 2 cases
   * - user accepted skijan term
   *   redirect url
   * - user does not accept skijan term
   *   navigate to confirm screen & accept term
   * @param email
   * @param password
   * @returns {Promise<void>}
   */
  const validateInfo = useCallback(ggjDebounce(async ({email, password}: IFormValues) => {
    try {
      const {data, error} = await checkUserStatusApi({email, password, isRegister: screenType})
      if (error) {
        if (roleError.includes(error)) {
          await router.push(`/error?code=${error}`)
          return
        }
        if (appError.includes(error)) {
          setError('password', {
            type: error,
          })
        } else {
          toastHandler({type: 'error'})
        }
        return
      }
      const {user, registerStatus} = data
      // case user don't login skijan yet
      if (registerStatus.skij) {
        const {error} = await authApi({}, 'login')
        if (error) {
          setError('password', {
            type: error,
          })
        }
        return
      }
      await router.push({
        pathname: '/confirm',
        query: {nickName: user.nickName ?? '', isRegister: +screenType}
      }, '/confirm')
      dispatch(actions.setEmail(email))
    } catch (e) {
      toastHandler({type: 'error'})
    } finally {
      loadingOffHandler()
      setIsValidating(false)
    }
  }, 500), [])

  const onSubmit = (info: IFormValues) => {
    loadingOnHandler()
    // Not send more requests if the current is sending a request
    if(isValidating) return

    setIsValidating(true)
    validateInfo(info)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} action=''>
      <Stack spacing={4}>
        <Stack spacing={3}>
          <InputEmail errors={errors} control={control} ref={inputRefEmail} />
          <Stack spacing={1}>
            <InputPassword errors={errors} control={control} screenType={screenType} />
            {screenType == TScreenType.REGISTER &&
              <Typography variant="caption">{t('3')}</Typography>}
          </Stack>
        </Stack>
        <SubmitButtonForm control={control}>
          {screenType == TScreenType.REGISTER ? t('6') : t('7')}
        </SubmitButtonForm>
      </Stack>
    </form>
  )
}
