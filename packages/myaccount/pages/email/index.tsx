import Container from 'components/pages/email/Container'
import Title from 'components/pages/email/TitleInput'
import EmailInfo from 'components/pages/email/EmailInfo'
import Form from 'components/pages/email/FormControl'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { NextRequest } from 'next/server'
import { reducerManager, sw } from 'store'
import slice, { getEmailAddressFromApi, ns, actions } from 'store/emailSlice'
import { toastHandler } from 'contexts/ToastContext'
import { useEffect } from 'react'
import { BackButton } from 'components/common'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Head from 'next/head'
const nsTran = 'components@email'

const EmailRender = () => {
  reducerManager.add(slice)
  const {t} = useTranslation(nsTran)
  useEffect(() => {
    return () => {
      reducerManager.remove(ns)
    }
  }, [])
  return (
    <>
      <Head>
        <title>{t('meta-title')}</title>
        <meta name="description" content={t('meta-description')} />
        <meta name="keywords" content={t('meta-kw')} />
      </Head>
      <BackButton />
      <Container>
        <Title />
        <EmailInfo />
        <Form />
      </Container>
    </>
  )
}

const Email = ({ error }: { error: string }) => {
  const { t } = useTranslation(nsTran)
  const router = useRouter()
  useEffect(() => {
    if (error) {
      router.push('/')
      toastHandler({ message: t(error), type: 'error' })
    }
  }, [])

  return !error && <EmailRender />
}

export default Email

export const getServerSideProps = sw.getServerSideProps((store) => async ({ req }) => {
  reducerManager.add(slice)
  const [_nextI18Next, data] = await Promise.all([
    ggjServerSideTranslations(req as unknown as NextRequest, [nsTran]),
    getEmailAddressFromApi(req as unknown as NextRequest),
  ])

  const { mailAddress, isAllowChangeMail, id } = data.data
  //Note: Thao, In case user create an account by sns but does not create account normal with sns email address,
  //it is not allow change email address
  if (!isAllowChangeMail) {
    return {
      props: {
        error: 'not-allow-change-email',
        ..._nextI18Next,
      },
    }
  }

  store.dispatch(actions.setEmailAddress(mailAddress))
  store.dispatch(actions.setUserId(id))

  const props = {
    props: {
      ..._nextI18Next,
    },
  }

  return { ...props }
})
