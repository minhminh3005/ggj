import React, {memo, useEffect, useMemo, useState} from 'react'
import {MypageDetailLayout, nsTranMypageDetailLayout} from 'components/layouts'
import {css} from '@emotion/react'
import {Checkbox, FormControlLabel, Stack, Typography, useTheme,} from '@mui/material'
import {GgjContainButton} from 'components/commons/GgjButton'
import {useTranslation} from 'next-i18next'
import {getTerms, registerSeller,} from 'store/mypage/display/register/registerSlice'
import {toastHandler} from 'contexts/ToastContext'
import {loadingOffHandler, loadingOnHandler} from 'contexts/LoadingContext'
import {sw} from 'store/store'
import {useRouter} from 'next/router'
import {ns as nsApp} from 'store/appSlice'
import {ggjServerSideTranslations} from '../../../../common/i18nUtils'
import {NextRequest} from 'next/server'
import GgjCommonHead from '../../../../components/commons/GgjCommonHead'
import {useLayoutContext} from '../../../../contexts/LayoutContext'
import {NoSsr} from '@mui/base'

const ns = 'mypage@displayregister'

const AgreeCheckBox = memo(() => {
  const [isAgree, setIsAgree] = useState<boolean>(false)
  const {t} = useTranslation(ns)
  const theme = useTheme()
  const router = useRouter()
  const {u} = router.query

  function toggleCheck(e: React.ChangeEvent<HTMLInputElement>) {
    setIsAgree(e.target.checked)
  }

  async function handleRegisterSeller() {
    loadingOnHandler()
    try {
      const {error}: any = await registerSeller()
      if (error === 'EDR001') {
        toastHandler({message: t('5'), type: 'error'})
        return
      } else if (error) {
        toastHandler({type: 'error'})
        return
      }
      router.push(u ? String(u) : '/mypage')
      toastHandler({
        message: t('4'),
        type: 'success',
      })
    } catch (err) {
      toastHandler({
        type: 'error',
      })
    } finally {
      loadingOffHandler()
    }
  }

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        marginTop="50px"
        marginBottom="26px"
      >
        <FormControlLabel
          control={
            <Checkbox disableRipple onChange={toggleCheck} checked={isAgree}/>
          }
          label={<Typography variant="body2">{t('2')}</Typography>}
        />
      </Stack>

      <GgjContainButton
        css={css`
          width: 100%;
          @media (min-width: ${theme.breakpoints.values.md}px) {
            width: unset;
          }
        `}
        disabled={!isAgree}
        onClick={handleRegisterSeller}
      >
        {t('3')}
      </GgjContainButton>
    </>
  )
})

AgreeCheckBox.displayName = 'AgreeCheckBox'

const Register = ({
  terms,
}: {
  terms: {
    title: string
    content: string
    id: number
  }[]
}) => {
  const theme = useTheme()
  const {t} = useTranslation(ns)
  const router = useRouter()
  const {updateLayoutSetting} = useLayoutContext()

  const headData = useMemo(() => ({
    title: t('6'),
    description: t('7'),
    keywords: t('8'),
  }), [])

  useEffect(() => {
    updateLayoutSetting({
      title: t('9'),
      onBack: () => router.push('/')
    })
  }, [])

  return (
    <>
      <GgjCommonHead data={headData}/>
      <NoSsr>
        <div
          css={css`
            padding-bottom: 20px;
            @media (min-width: ${theme.breakpoints.values.lg}px) {
              padding-bottom: 86px;
            }
          `}
        >
          <Typography
            css={css`
              padding-bottom: 14px;
              border-bottom: 1px solid ${theme.palette.divider};
              margin-bottom: ${theme.spacing(4)};
            `}
            variant="h6"
          >
            {t('1')}
          </Typography>

          {terms?.map(({title, content, id}) => (
            <div
              key={id}
              css={css`
                margin-bottom: 32px;
              `}
            >
              <Typography
                css={css`
                  margin-bottom: 32px;
                `}
                variant="body2"
              >
                {title}
              </Typography>

              <Typography
                dangerouslySetInnerHTML={{__html: content}}
                variant="body2"
              />
            </div>
          ))}

          <AgreeCheckBox/>
        </div>
      </NoSsr>
    </>
  )
}

Register.Layout = MypageDetailLayout

export default Register

export const getServerSideProps = sw.getServerSideProps(
  (store) =>
    async ({req}) => {
      const isSkjDeveloper = store.getState()[nsApp].auth.isSkjDeveloper
      if (isSkjDeveloper) {
        return {
          redirect: {
            permanent: false,
            destination: '/mypage',
          },
        }
      }
      const [_nextI18Next, data] = await Promise.all([
        ggjServerSideTranslations(req as unknown as NextRequest, [ns],
          nsTranMypageDetailLayout),
        getTerms(req as unknown as NextRequest)
      ])
      return {
        props: {
          ..._nextI18Next,
          terms: data.data,
        },
      }
    }
)
