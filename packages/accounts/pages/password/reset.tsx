import { ggjServerSideTranslations } from 'common/i18nUtils'
import { NextRequest } from 'next/server'

import { useTranslation } from 'next-i18next'
import { Stack, Typography, FormControl, OutlinedInput, FormHelperText, Button } from '@mui/material'

import { useForm, Controller, useWatch, Control, FieldErrors } from 'react-hook-form'
import { validEmail } from 'common/variables'
import {useCallback, useEffect, useRef, useState} from 'react'
import React from 'react'
import Head from 'next/head'
import SuccessSlider from 'components/pages/password/SuccessSlider'
import { requestResetPassword } from 'store/passwordSlice'
import { toastHandler } from 'contexts/ToastContext'
import { loadingOffHandler, loadingOnHandler } from 'contexts/LoadingContext'
import {ggjDebounce} from '../../common/utils'

const nsTran = 'gui@reset'

interface IFormValues {
  email: string;
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

const SubmitButtonReset= React.memo(({
  control,
}:{control: Control<IFormValues>}) => {
  const {t} = useTranslation(nsTran)
  const formData = useWatch({
    control: control,
    name: ['email'],
  })

  return (
    <Button
      disabled={formData.some(x => !x)}
      type="submit"
      fullWidth
      variant="contained"
    >
      {t('5')}
    </Button>
  )
})
SubmitButtonReset.displayName = 'SubmitButtonReset'

const InputEmail = ({
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

  return <>
    <Controller
      control={control}
      name="email"
      aria-describedby="component-email-text"
      defaultValue=""
      rules={{
        required: true,
        pattern: validEmail,
      }}
      render={({field: {ref, ...rest}}) => {
        return (
          <OutlinedInput
            {...rest}
            inputRef={e => {ref(e);inputRef.current = e}}
          />
        )
      }}
    />
    {!!errors?.email && <FormHelperText>
      {t(`validate.${errors.email.type}-email`)}
    </FormHelperText>}
  </>
}

function Reset() {
  const { t } = useTranslation(nsTran)
  const [ isSuccess, setIsSuccess ] = useState(false)

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm<IFormValues>({
    reValidateMode: 'onSubmit'
  })

  const resetPassword = useCallback(ggjDebounce(async (data: IFormValues) => {
    try {
      const res = await requestResetPassword(data.email)
      if(res.error == 'ECI500' || res.error == 'ERT002') {
        toastHandler({type: 'error'})
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
    loadingOnHandler()
    resetPassword(data)
  }

  return <>
    <PageMeta/>
    <Stack spacing={3}>
      <Typography variant="h5" textAlign="center">{t('1')}</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography>{t('2')}</Typography>
        <Stack spacing={3} mt={3}>
          <FormControl fullWidth error={!!Object.keys(errors || {}).length}>
            <Typography variant="body2" pb={1}>
              {t('3')}
            </Typography>
            <InputEmail control={control} errors={errors}/>
            <Typography variant="caption" mt={1}>
              {t('4')}
            </Typography>
          </FormControl>
          <SubmitButtonReset control={control}/>
        </Stack>
      </form>
    </Stack>

    {/* Success screen*/}
    <SuccessSlider isShow={isSuccess}>
      <Stack spacing={3}>
        <Typography variant="h5" textAlign="center">{t('10')}</Typography>
        <Typography>{t('11')}</Typography>
      </Stack>
    </SuccessSlider>
  </>
}

export async function getServerSideProps({req}: {req: NextRequest}) {
  return {
    props: {
      ...await ggjServerSideTranslations(req, [nsTran, 'common@validate']),
    },
  }
}

export default Reset
