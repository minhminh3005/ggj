import React, { useState, useEffect } from 'react'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { InputType } from 'components/pages/inquiry/FormInput'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import type { NextRequest } from 'next/server'
import { Stack, Typography } from '@mui/material'
import FormInput, { SubmitButton } from 'components/pages/inquiry/FormInput'
import { useForm } from 'react-hook-form'
import { FieldErrors } from 'react-hook-form'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { sw } from 'store/store'
import { validEmail } from 'common/variables'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import {
  getInquirycategories,
  sendInquiryForm,
  getUserInfo,
} from 'store/inquirySlice'
import { toastHandler } from 'contexts/ToastContext'
import { InquiryLayout, nsTranInquiryLayout } from 'components/layouts'
import { useLayoutContext } from 'contexts/LayoutContext'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ggjDebounce } from 'common/utils'
import { loadingOnHandler, loadingOffHandler } from 'contexts/LoadingContext'
import { scrollToElSmoothly } from 'common/utils'
import { AppError } from 'app.d'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'
import getConfig from 'next/config'

const nsTran = 'surface@inquiry'

interface InquiryProps {
  categories?: {
    id: number
    name: string
    priority: number
  }[]
  userInfo: {
    mailAddress: string
    nickName: string
  }
}

function Inquiry({ categories, userInfo }: InquiryProps) {
  const { t } = useTranslation(nsTran)
  const theme = useTheme()
  const { updateLayoutSetting } = useLayoutContext()
  const isDesktop = useMediaQuery(
    `(min-width:${theme.breakpoints.values.lg}px)`
  )
  const router = useRouter()
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const isLogined = !isEmpty(userInfo)
  const { publicRuntimeConfig } = getConfig()
  const { ACCOUNT_HOST_URL, SKJ_HOST_URL } = publicRuntimeConfig

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    defaultValues: {
      categoryLargeId: '1',
      content: '',
      email: userInfo?.mailAddress || '',
      name: userInfo?.nickName || '',
    },
  })

  function enableSubmitButton() {
    setIsButtonDisabled(false)
  }

  const enableSubmitButtonAfterFiveMinutes = ggjDebounce(
    enableSubmitButton,
    5 * 60000
  )

  function handleError(error: string) {
    if (error) {
      if (error === 'EIN400') {
        setIsButtonDisabled(true)
        enableSubmitButtonAfterFiveMinutes()
        toastHandler({
          message: t('22'),
          type: 'error',
        })
      } else {
        toastHandler({
          type: 'error',
        })
      }
    } else {
      toastHandler({
        message: t('26'),
        type: 'success',
      })
      reset()
    }
  }

  const submitFormdebounced = ggjDebounce(submitForm)

  async function submitForm(data: {
    name?: string
    email?: string
    categoryLargeId: string
    content?: string
  }) {
    loadingOnHandler()
    try {
      const res = await sendInquiryForm({
        ...data,
        categoryLargeId: parseInt(data.categoryLargeId),
      })
      handleError(res?.data?.error)
    } catch (err) {
      console.error(err)
      toastHandler({
        type: 'error',
      })
    } finally {
      loadingOffHandler()
    }
  }

  useEffect(() => {
    if (isDesktop) {
      updateLayoutSetting({
        backgroundColor: theme.palette.canvas.light,
      })
    } else {
      updateLayoutSetting({
        backgroundColor: '#ffffff',
        onBack: () => router.push('/'),
        title: (
          <Stack direction="row" alignItems="center">
            <MailOutlinedIcon
              htmlColor={theme.palette.jade.light}
              css={css`
                margin-right: 8px;
              `}
              sx={{
                fontSize: theme.spacing(5),
              }}
            />
            <Typography
              variant="body1"
              css={css`
                font-size: 18px;
              `}
            >
              {t('20')}
            </Typography>
          </Stack>
        ),
      })
    }
  }, [isDesktop])

  useEffect(() => {
    if (errors) {
      const fields = Object?.keys(errors || {})
      if (fields?.length) {
        const element = document?.querySelector(`[name=${fields[0]}]`)
        scrollToElSmoothly({
          el: element as HTMLElement,
          focusEl: true,
          positionOffset: 300,
        })
      }
    }
  })

  return (
    <>
      <Head>
        <title>{t('25')}</title>
        <meta name="description" content={t('23')} />
        <meta name="keywords" content={t('24')} />
      </Head>
      <div
        css={css`
          padding: 26px 0 119px 0;
          margin: 0 auto;
          @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 328px;
            padding: 28px 0 136px 0;
          }
          @media (min-width: ${theme.breakpoints.values.lg}px) {
            width: 584px;
          }
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            border-bottom: 1px solid ${theme.palette.divider};
            margin-bottom: 28px;
            @media (min-width: ${theme.breakpoints.values.lg}px) {
              border-bottom: none;
              margin-bottom: unset;
            }
          `}
        >
          <Typography
            component="h1"
            variant="h5"
            css={css`
              margin-bottom: 36px;
              align-items: center;
              display: none;
              @media (min-width: ${theme.breakpoints.values.lg}px) {
                display: flex;
              }
            `}
          >
            <MailOutlinedIcon
              htmlColor={theme.palette.jade.light}
              css={css`
                margin-right: 8px;
              `}
              sx={{
                fontSize: theme.spacing(5),
              }}
            />
            {t('20')}
          </Typography>

          <Typography
            css={css`
              margin-bottom: 12px;
            `}
            variant="subtitle2"
            component="p"
          >
            {t('1')}
          </Typography>

          <Link href="/guide" passHref>
            <Typography
              variant="subtitle2"
              component="a"
              css={css`
                color: ${theme.palette.primary.main};
                margin-bottom: 12px;
                cursor: pointer;
              `}
            >
              {t('2')}
            </Typography>
          </Link>

          <Link href="/faq" passHref>
            <Typography
              variant="subtitle2"
              component="a"
              css={css`
                color: ${theme.palette.primary.main};
                margin-bottom: 20px;
                text-decoration: none;
                cursor: pointer;
              `}
            >
              {t('3')}
            </Typography>
          </Link>
        </div>

        <div
          css={css`
            @media (min-width: ${theme.breakpoints.values.lg}px) {
              padding: 29px 128px 59px 128px;
              background-color: white;
            }
          `}
        >
          <Typography
            variant="subtitle2"
            component="h2"
            css={css`
              font-weight: bold;
              margin-bottom: ${theme.spacing(4)};
              text-align: center;
            `}
          >
            {t('4')}
            <a
              hidden={isLogined}
              href={`${ACCOUNT_HOST_URL}/login?u=${
                SKJ_HOST_URL + router.asPath
              }`}
              css={css`
                color: ${theme.palette.primary.main};
              `}
            >
              {t('5')}
            </a>
          </Typography>

          <form onSubmit={handleSubmit(submitFormdebounced)}>
            {isLogined ? (
              <>
                <Typography variant="caption" component="h3">{t('6')}</Typography>
                <Typography
                  variant="body1"
                  css={css`
                    margin-bottom: 21px;
                    padding-left: 10px;
                  `}
                >
                  {userInfo?.mailAddress}
                </Typography>

                <Typography variant="caption" component="h3">{t('8')}</Typography>
                <Typography
                  variant="body1"
                  css={css`
                    margin-bottom: 28px;
                    padding-left: 10px;
                  `}
                >
                  {userInfo?.nickName}
                </Typography>
              </>
            ) : (
              <>
                <FormInput
                  register={register('email', {
                    required: true,
                    pattern: validEmail,
                  })}
                  error={!!(errors as FieldErrors).email}
                  title={t('6')}
                  message={
                    ((errors as FieldErrors)?.email?.type === 'required' &&
                      t('7')) ||
                    ((errors as FieldErrors)?.email?.type === 'pattern' &&
                      t('21')) ||
                    ''
                  }
                />

                <FormInput
                  register={register('name', { required: true })}
                  error={!!(errors as FieldErrors).name}
                  title={t('8')}
                  message={(errors as FieldErrors).name && t('9')}
                />
              </>
            )}

            <FormInput
              defaultValue={'0'}
              options={(categories?.length ? categories : [])?.map(
                ({ id, name }: { id: number; name: string }) => ({
                  label: name,
                  value: id + '',
                })
              )}
              type={InputType.Radio}
              title={t('10')}
              controllerprops={{
                name: 'categoryLargeId',
                control: control,
              }}
            />

            <FormInput
              inputProps={{
                maxLength: 3000,
              }}
              register={register('content', { required: true })}
              multiline={true}
              rows={11}
              error={!!(errors as FieldErrors)?.content}
              type={InputType.TextArea}
              title={t('11')}
              message={(errors as FieldErrors).content && t('12')}
              placeholder={t('13')}
            />

            <SubmitButton disabled={isButtonDisabled} buttonText={t('14')} />
          </form>
        </div>
      </div>
    </>
  )
}

const InquiryEx = React.memo(Inquiry) as React.MemoExoticComponent<
  typeof Inquiry
> & { Layout: typeof InquiryLayout }
InquiryEx.Layout = InquiryLayout
export default InquiryEx

export const getServerSideProps = sw.getServerSideProps(
  () =>
    async ({ req }) => {
      const [categories, userInfo] = await Promise.all([
        getInquirycategories(),
        getUserInfo(req as unknown as NextRequest),
      ])

      const props = {
        props: {
          ...(await ggjServerSideTranslations(
            req as unknown as NextRequest,
            [nsTran],
            nsTranInquiryLayout
          )),
          categories: categories?.data?.data || [],
          userInfo: userInfo?.data?.data || {},
        },
      }

      if (categories?.data.error === AppError.ECB404) {
        return {
          notFound: true,
        }
      }

      return { ...props }
    }
)
