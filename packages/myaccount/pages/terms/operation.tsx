import http, { appendGgjHeader } from 'common/http'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { BackButton } from 'components/common'
import Content, { ITermData } from 'components/pages/terms/Content'
import Heading from 'components/pages/terms/Heading'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextRequest } from 'next/server'

const nsTran = 'components@terms'

const Operation = ({ data }: { data: ITermData[] }) => {
  const { t } = useTranslation(nsTran)
  const router = useRouter()
  return (
    <>
      <Head>
        <title>{t('operation-title')}</title>
        <meta name="description" content={t('operation-description')} />
        <meta name="keywords" content={t('operation-kw')} />
      </Head>
      <BackButton onClick={() => router.back()} />
      <Heading title={t('3')} />
      <Content data={data} />
    </>
  )
}

export async function getServerSideProps({ req }: { req: NextRequest }) {
  const data = await http.get('/api/myaccount/v1/terms/operation', {
    headers: appendGgjHeader({ req }),
  })
  return {
    props: {
      data: data.data.data,
      ...(await ggjServerSideTranslations(req, [nsTran])),
    },
  }
}

export default Operation
