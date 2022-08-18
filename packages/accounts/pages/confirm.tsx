import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { useTheme } from '@mui/material/styles'
import { css } from '@emotion/react'

import SkijanIcon from 'components/icons/SkijanIcon'
import NaviIcon from 'components/icons/NaviIcon'
import RealtradeIcon from 'components/icons/RealtradeIcon'
import GogojungleIcon from 'components/icons/GogojungleIcon'

import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  Modal,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material'
import { NextRequest, NextResponse } from 'next/server'
import { useTranslation } from 'next-i18next'

import { reducerManager } from 'store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import slice, {actions, checkNicknameApi, getEmailApi, getTermApi, ns} from 'store/confirmSlice'
import { Control, Controller, useForm, useWatch } from 'react-hook-form'
import LogoContainer from 'components/LogoContainer'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { Box } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import { UseFormClearErrors, UseFormSetError } from 'react-hook-form/dist/types/form'
import { useRouter } from 'next/router'
import { ggjDebounce } from '../common/utils'
import { authApi } from '../store/authSlice'
import Head from 'next/head'
import { toastHandler } from 'contexts/ToastContext'
import { appError } from '../common/variables'
import { loadingOffHandler, loadingOnHandler } from 'contexts/LoadingContext'
import getConfig from 'next/config'

const nsTran = 'gui@confirm'
const COOKIE_SNS = 'ggjAT'
const SNS = 'sns/login'

const PageMeta = React.memo(() => {
  const { t } = useTranslation(nsTran)
  return <Head>
    <title>{t('meta-title')}</title>
    <meta name="keywords" content={t('meta-keywords')} />
  </Head>
})
PageMeta.displayName = 'PageMeta'

const HardText = React.memo(() => {
  const {t} = useTranslation(nsTran)
  const { publicRuntimeConfig } = getConfig()

  const iconList = [
    {icon: <GogojungleIcon />, href: publicRuntimeConfig.GOGO_HOST_URL},
    {icon: <SkijanIcon />, href: publicRuntimeConfig.SKJ_HOST_URL},
    {icon: <NaviIcon />, href: `${publicRuntimeConfig.GOGO_HOST_URL}finance/navi`},
    {icon: <RealtradeIcon />, href: publicRuntimeConfig.REALTRADE_HOST_URL},
  ]

  return <>
    <Typography variant="h5" mb={0} textAlign="center">{t('1')}</Typography>
    {/* list icon */}
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
      my={4}
    >
      {iconList.map((icon, idx) => (
        <LogoContainer key={idx} width="60px" height="60px" rounded="50%" border={idx === 1 ? '1px solid #9F9F9F' : ''}
          href={icon.href as string || ''}>{icon.icon}</LogoContainer>))
      }
    </Stack>
    <Typography mb={3}>{t('2')}</Typography>
  </>
})
HardText.displayName = 'HardText'

const SubmitButtonConfirm = React.memo(({
  control,
}: {control: Control<IFormValues>}) => {
  const {query} = useRouter()
  const {t} = useTranslation(nsTran)
  const isAgreeTerm = useWatch({
    control,
    name: 'isAgreeTerm',
  })
  const nickName = useWatch({
    control,
    name: 'nickName',
  })
  const checkingNickname = useAppSelector(state => state[ns].checkingNickname)

  return (
    <Button
      disabled={!isAgreeTerm || (query.nickName ? false : !nickName) || checkingNickname == 'checking'}
      type="submit"
      fullWidth
      variant="contained"
    >
      {t('11')}
    </Button>
  )
})
SubmitButtonConfirm.displayName = 'SubmitButtonConfirm'

const EmailPart = React.memo(({email}:{email:string}) => {
  const {t} = useTranslation(nsTran)

  return (
    <Stack spacing={1}>
      <Typography variant="body2" display="block" mb={0}>
        {t('3')}
      </Typography>
      <Typography mb={3} variant="body1" css={css`word-break: break-all;`}>
        {email ?? ''}
      </Typography>
    </Stack>
  )
})
EmailPart.displayName = 'EmailPart'

const NicknamePart = ({
  errors,
  control,
  setError,
  clearErrors,
  nickNameSNSRegistered
}: {
  errors: FieldErrors,
  control: Control<IFormValues>,
  setError: UseFormSetError<IFormValues>,
  clearErrors: UseFormClearErrors<IFormValues>,
  nickNameSNSRegistered: number}) => {
  const {t} = useTranslation(nsTran)
  const inputRef = useRef<HTMLInputElement>()
  const dispatch = useAppDispatch()
  const {query} = useRouter()

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
    })
  }, [])

  const checkNickname = useCallback(ggjDebounce(async (nickName: string) => {
    if (!nickName || nickName.length < 2) return
    try {
      const res = await checkNicknameApi({nickName})
      if(res.error) {
        if (appError.includes(res.error)) {
          setError('nickName', {
            type: 'existed',
            message: '',
          })
        } else {
          toastHandler({type: 'error'})
        }
        return
      }
      if (!res.data.isRegistered) {
        clearErrors('nickName')
        dispatch(actions.setCheckingNickname('checked'))
        return
      }
      setError('nickName', {type: 'existed'})
    } catch (e) {
      toastHandler({type: 'error'})
    }
  }, 500), [])

  return (
    <Stack>
      <Typography variant="body2" display="block" mb={0}>
        {t('4')}
      </Typography>
      {nickNameSNSRegistered || (query.nickName) ? (
        <Typography variant="body1" component="div" css={css`word-break: break-all;`}>
          {query.nickName}
        </Typography>
      ) : (
        <FormControl error={!!errors.nickName}>
          <Controller
            control={control}
            name="nickName"
            rules={{required: true, minLength: 2, maxLength: 30}}
            aria-describedby="component-error-text"
            defaultValue=""
            render={({field: {ref, onChange, ...rest}}) => {
              return (
                <OutlinedInput
                  inputProps={{
                    minLength: 2,
                    maxLength: 30
                  }}
                  placeholder={t('5')}
                  error={!!errors.nickName}
                  {...rest}
                  onChange={(e) => {
                    onChange(e)
                    dispatch(actions.setCheckingNickname('checking'))
                    checkNickname(e.target.value)
                  }}
                  inputRef={(e) => {
                    ref(e)
                    inputRef.current = e
                  }}
                />
              )
            }}
          />
          {!!errors.nickName && (
            <FormHelperText>
              {t(`validate.${errors.nickName.type}-nickName`)}
            </FormHelperText>
          )}
        </FormControl>
      )}
      <Typography mt={1} mb={0} variant="caption" display="block">
        {t('6')}
      </Typography>
    </Stack>
  )
}
NicknamePart.displayName = 'NicknamePart'

const TermModal = React.memo(() => {
  const theme = useTheme()
  const [term, setTerm] = useState('')
  const open = useAppSelector((state) => state[ns].open)
  const dispatch = useAppDispatch()
  const {t} = useTranslation(nsTran)

  useEffect(() => {
    getTermApi(data => {
      setTerm(data?.data.content)
    })
  }, [])

  const handleClose = () => {
    dispatch(actions.setOpen(false))
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      css={css`
        display: flex;
        align-items: center;
      `}
    >
      <Box css={
        css`
          background: #fff;
          margin: 0 auto;
          border-radius: 4px;
          box-shadow: 0 3px 6px #00000029;
          height: 100%;
          width: 100%;
          @media (min-width: ${theme.breakpoints.values.sm}px) {
            width: 568px;
            height: 90%;
            max-height: 640px;
          }
        `
      }>
        <Stack px={3} py={2} direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {t('14')}
          </Typography>
          <Button onClick={handleClose} css={
            css`
              padding: 0;
              min-width: auto;
              color: ${theme.palette.text.primary}
            `
          }>
            <CloseIcon />
          </Button>
        </Stack>
        <Divider />
        <Box
          px={3}
          py={2}
          css={css`
            overflow: auto;
            height: calc(100% - 64px);
            &::-webkit-scrollbar {
              width: ${theme.spacing(2)};;
              &-track {
                background: transparent;
              }
              &-thumb {
                background: ${theme.palette.grey[500]};
                &:hover {
                  background: ${theme.palette.grey[600]};
                }
              }
            }
          `}
        >
          <div dangerouslySetInnerHTML={{__html: term}} />
        </Box>
      </Box>
    </Modal>
  )
})
TermModal.displayName = 'TermModal'

const CheckboxPart = React.memo(({control}: {control: Control<IFormValues>}) => {
  const dispatch = useAppDispatch()
  const {t} = useTranslation(nsTran)
  const theme = useTheme()
  useEffect(() => {
    return function() {
      dispatch(actions.setOpen(false))
    }
  }, [])

  return (
    <Stack mt={3} mb={4} spacing={2}>
      {/* checkbox for receive email */}
      <Controller
        control={control}
        name="isNotification"
        render={({field}) => (
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="start" alignItems="center">
              <Checkbox
                css={css`
                  padding: 0;
                `}
                onChange={(e) => field.onChange(e.target.checked)}
                checked={field.value}
              />
              <Typography ml={2} variant="body1">
                {t('7')}
              </Typography>

            </Stack>
            <Typography variant="caption">{t('8')}</Typography>
          </Stack>
        )}
      />
      {/* checkbox for agree term */}
      <Controller
        control={control}
        name="isAgreeTerm"
        defaultValue={false}
        render={({field}) => (
          <Stack
            mt={1}
            direction="row"
            css={css`
              display: flex;
              align-items: center;
            `}
          >
            <Checkbox
              css={css`
                padding: 0;
              `}
              onChange={(e) => field.onChange(e.target.checked)}
              checked={field.value}
            />
            <Button
              css={css`
                padding: 0;
                margin-left: ${theme.spacing(2)};;
              `}
              onClick={() => dispatch(actions.setOpen(true))}
            >
              <Typography variant="body1">
                {t('9')}
              </Typography>
            </Button>
            <Typography variant="body1">
              {t('10')}
            </Typography>
          </Stack>
        )}
      />
    </Stack>
  )
})
CheckboxPart.displayName = 'CheckboxPart'

interface IFormValues {
  nickName: string
  isNotification: boolean
  isAgreeTerm: boolean
}

function Confirm({fromType, nickNameSNSRegistered, email}: {fromType: 'login' | 'register' | 'sns/login',nickNameSNSRegistered: number,email: string}) {
  reducerManager.add(slice)
  const checkingNickname = useAppSelector(state => state[ns].checkingNickname)
  const {query} = useRouter()

  const {
    handleSubmit,
    control,
    formState: {errors},
    setError,
    clearErrors,
  } = useForm<IFormValues>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      isNotification: true,
      nickName: query['nickName'] as string || ''
    }
  })

  const onSubmit = useCallback(async (data: IFormValues) => {
    if(checkingNickname == 'checking') return
    loadingOnHandler()
    try {
      const {error} = await authApi({nickName: data.nickName,isNotification: +data.isNotification}, fromType)
      if (error) {
        if (appError.includes(error)) {
          setError('nickName', {
            type: error,
          })
        } else {
          toastHandler({type: 'error'})
        }
      }
    } catch (e) {
      toastHandler({type: 'error'})
    } finally {
      loadingOffHandler()
    }
  }, [])

  return <>
    <PageMeta/>
    <form action="" onSubmit={handleSubmit(onSubmit)}>
      <HardText />
      {/* info user */}
      <Stack spacing={2}>
        <EmailPart email={email} />
        <NicknamePart errors={errors} control={control} setError={setError} clearErrors={clearErrors} nickNameSNSRegistered={nickNameSNSRegistered} />
      </Stack>
      <CheckboxPart control={control} />
      {/* submit btn */}
      <SubmitButtonConfirm control={control} />
      {/* Term modal */}
      <TermModal />
    </form>
  </>
}

const FROM_TYPE: {
  [index: number]: string
} = {
  0: 'login',
  1: 'register'
}

export async function getServerSideProps({req, res, query}: {req: NextRequest, res: NextResponse, query: {[index: string]: any}}) {
  const fromSns = req.cookies[COOKIE_SNS] == 'in'
  // should clear cookie after checking for security reason
  fromSns && res.clearCookie(COOKIE_SNS)

  //@ts-ignore
  const docReq = (req.headers['accept'] || '').includes('text/html')

  // login | register | sns
  const fromType: string|false = (!docReq && FROM_TYPE[+query['isRegister']]) || (docReq && fromSns && SNS)

  // check user register with sns
  // nickname already in db
  let nickNameSNSRegistered = 0
  if(fromType === SNS && query['nickName']) {
    const {data: {isRegistered}} = await checkNicknameApi({nickName: query['nickName']})
    nickNameSNSRegistered = isRegistered
  }

  // get email address
  const {email} = await getEmailApi(req)

  if (!fromType) {
    // don't allow user access directly /confirm
    // must be navigated from login/register or sns
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      email,
      fromType,
      nickNameSNSRegistered,
      ...await ggjServerSideTranslations(req, nsTran),
    },
  }
}

export default Confirm
