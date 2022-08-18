import { ggjServerSideTranslations } from 'common/i18nUtils'
import { NextRequest } from 'next/server'
import { getEmailAddressFromApi, confirmChangeEmailAddress } from 'store/emailSlice'
import { useEffect } from 'react'
import { simpleDecode } from 'common/utils'
import { toastHandler } from 'contexts/ToastContext'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { NextParsedUrlQuery } from 'next/dist/server/request-meta'
const nsTran = 'components@email'

const Index = ({ error }: { error: string }) => {
  const router = useRouter()
  const { t } = useTranslation(nsTran)

  useEffect(() => {
    if (error) {
      toastHandler({ message: t(error), type: 'error' })
      router.push('/')
    } else {
      toastHandler({ message: t('confirm-change-email-success'), type: 'success' })
      router.push('/email')
    }
  }, [])

  return <></>
}

export default Index

export async function getServerSideProps({
  req,
  params,
}: {
  req: NextRequest
  params: NextParsedUrlQuery
}) {
  const _nextI18Next = await ggjServerSideTranslations(req, [nsTran])
  const token = params.token
  const decode = simpleDecode(token as string)
  const resp = await getEmailAddressFromApi(req)
  const changeEmail = resp.data
  let objectToken
  try {
    objectToken = JSON.parse(decode)
    if (objectToken.uid !== changeEmail.id) {
      return {
        props: {
          ..._nextI18Next,
          error: 'user-id-not-match',
        },
      }
    }
  } catch (error) {
    return {
      props: {
        ..._nextI18Next,
        error: 'EM005',
      },
    }
  }

  const data = await confirmChangeEmailAddress(objectToken.token, req)
  if (data.error) {
    return {
      props: {
        ..._nextI18Next,
        error: data.error,
      },
    }
  }

  return {
    props: {
      ..._nextI18Next,
    },
  }
}
