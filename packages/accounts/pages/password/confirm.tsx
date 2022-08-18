import React, {useCallback, useEffect, useRef, useState} from 'react'
import { Control, Controller, FieldErrors, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { ggjServerSideTranslations } from 'common/i18nUtils'

import { Button, FormControl, FormHelperText, Stack, Typography } from '@mui/material'
import { resetPassError, validPassword } from 'common/variables'
import { NextRequest } from 'next/server'
import GgjInputPassword from 'components/GgjInputPassword'
import Head from 'next/head'
import slice, {checkTokenIsValid, requestConfirmPassword} from 'store/passwordSlice'
import { reducerManager, sw } from 'store'
import SuccessSlider from 'components/pages/password/SuccessSlider'
import { loadingOffHandler, loadingOnHandler } from 'contexts/LoadingContext'
import { toastHandler } from 'contexts/ToastContext'
import {ggjDebounce} from '../../common/utils'

const nsTran = 'gui@reset'
interface IFormValues {
  password: string
  confirmPassword: string,
}

const PageMeta = React.memo(() => {
  const { t } = useTranslation(nsTran)
  return <Head>
    <title>{t('meta-title')}</title>
    <meta name="keywords" content={t('meta-keywords')} />
    <meta name="description" content={t('meta-description')} />
  </Head>
})
PageMeta.displayName = 'PageMeta'

const InputPassword = ({
  errors,
  control,
}: {errors: FieldErrors, control: Control<IFormValues>}) => {
  const {t} = useTranslation(nsTran)
  const inputRef = useRef<HTMLInputElement>()
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
    })
  }, [])

  return (
    <FormControl error={!!errors.password}>
      <Typography variant="body2" mb={2}>{t('12')}</Typography>
      <Controller
        name="password"
        control={control}
        defaultValue=""
        rules={{
          required: true,
          pattern: validPassword,
          maxLength: 32,
          minLength: 6,
        }}
        render={({ field: {ref, ...rest} }) => (
          <GgjInputPassword
            {...rest}
            inputRef={(e: HTMLInputElement | undefined) => {
              ref(e)
              inputRef.current = e
            }}
          />
        )}
      />
      { !!errors.password && <FormHelperText>{t(`validate.${errors.password.type}-password`)}</FormHelperText> }
      <Typography variant="caption" mt={1}>{t('13')}</Typography>
    </FormControl>
  )
}

const InputPasswordConfirm = ({
  control,
  getValues,
}: {control: Control<IFormValues>, getValues: (str: string) => string}) => {
  const {t} = useTranslation(nsTran)
  const isAlike = getValues('confirmPassword') !== getValues('password')

  return (
    <FormControl>
      <Typography variant="body2" mb={2}>{t('14')}</Typography>
      <Controller
        name="confirmPassword"
        control={control}
        defaultValue=""
        rules={{
          required: true,
        }}
        render={({ field: { ...rest} }) => (
          <GgjInputPassword
            {...rest}
            error={isAlike}
          />
        )}
      />
      { isAlike && <FormHelperText error={true}>{t('15')}</FormHelperText> }
    </FormControl>
  )
}

const SubmitButtonConfirm = React.memo(({control, children}:{control: Control<IFormValues>, children: React.ReactElement}) => {
  const formData = useWatch({
    control: control,
    name: ['password', 'confirmPassword'],
  })
  return (
    <Button
      disabled={formData.some(x => !x)}
      type="submit"
      fullWidth
      variant="contained"
    >
      { children }
    </Button>
  )
})
SubmitButtonConfirm.displayName = 'SubmitButtonConfirm'

function Confirm({token}: {token: string}) {
  const { t } = useTranslation(nsTran)
  const [ isSuccess, setIsSuccess ] = useState(false)
  const { handleSubmit, control, formState: { errors }, getValues, setError } = useForm<IFormValues>({
    reValidateMode: 'onSubmit',
  })

  const sendNewPassword = useCallback(ggjDebounce(async (data: IFormValues) => {
    try {
      const res = await requestConfirmPassword(data.password,token)
      if(res.error) {
        if (resetPassError.includes(res.error)) {
          setError('password', {
            type: res.error,
            message: '',
          })
        } else {
          toastHandler({type: 'error'})
        }
        return
      }
      setIsSuccess(true)
    } catch(error) {
      toastHandler({type: 'error'})
    } finally {
      loadingOffHandler()
    }
  }, 500), [])

  const onSubmit = (data: IFormValues) => {
    if(data.password != data.confirmPassword) return
    loadingOnHandler()
    sendNewPassword(data)
  }

  return (<>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Typography variant="h5" textAlign="center">{t('19')}</Typography>
        <Stack spacing={3}>
          <Typography variant="body1">{t('20')}</Typography>
          <InputPassword control={control} errors={errors}/>
          <InputPasswordConfirm control={control} getValues={getValues}/>
        </Stack>
        <SubmitButtonConfirm control={control}>{t('5')}</SubmitButtonConfirm>
      </Stack>
    </form>
    {/* Success screen*/}
    <SuccessSlider isShow={isSuccess}>
      <Stack spacing={6}>
        <Stack spacing={1}>
          <Typography variant="h5" textAlign="center">{t('21')}</Typography>
          <Typography>{t('22')}</Typography>
        </Stack>
        <Button fullWidth variant="contained"
          onClick={()=> {
            location.href = '/login'
          }}>{t('23')}</Button>
      </Stack>
    </SuccessSlider>
  </>
  )
}

export const getServerSideProps = sw.getServerSideProps(() => async ({req, query: {token}}) => {
  reducerManager.add(slice)
  let isTokenValid = false
  if (token){
    const res = await checkTokenIsValid(token)
    if(!res.error) { // ERT003 Invalid token
      isTokenValid = true
    }
  }
  return {
    notFound: !isTokenValid,
    props: {
      token: token || null,
      ...await ggjServerSideTranslations(req as unknown as NextRequest, [nsTran]),
    },
  }
})

export default Confirm
