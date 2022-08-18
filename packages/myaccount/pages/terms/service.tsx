import Content, { ITermData } from 'components/pages/terms/Content'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { NextRequest } from 'next/server'
import http, { appendGgjHeader } from 'common/http'
import BackButton from 'components/common/BackButton'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRouter } from 'next/router'

const nsTran = 'components@terms'

const Service = ({ data }: { data: ITermData[] }) => {
  const { t } = useTranslation(nsTran)
  const router = useRouter()
  return (
    <>
      <Head>
        <title>{t('service-title')}</title>
        <meta name="description" content={t('service-description')} />
        <meta name="keywords" content={t('service-kw')} />
      </Head>
      <BackButton onClick={() => router.back()} />
      <Content data={data} />
    </>
  )
}

export async function getServerSideProps({ req }: { req: NextRequest }) {
  const data = await http.get('/api/myaccount/v1/terms/service', {
    headers: appendGgjHeader({ req }),
  })
  return {
    props: {
      data: data.data.data,
      ...(await ggjServerSideTranslations(req, [nsTran])),
    },
  }
}

export default Service
