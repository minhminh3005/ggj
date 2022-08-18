import http, { appendGgjHeader } from 'common/http'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import {nsTranSurfaceTermLayout, SurfaceTermLayout,} from 'components/layouts'
import Content, { ITermData } from 'components/pages/terms/Content'
import Heading from 'components/pages/terms/Heading'
import { useTranslation } from 'next-i18next'
import getConfig from 'next/config'
import { NextRequest } from 'next/server'
import {useMemo} from 'react'
import GgjCommonHead from '../../components/commons/GgjCommonHead'

const Policy = ({ data }: { data: ITermData[] }) => {
  const { t } = useTranslation(nsTranSurfaceTermLayout)
  const headData = useMemo(() => ({
    title: t('p-tt'),
    description: t('p-dt'),
    keywords: t('p-kw'),
  }), [])

  return (
    <>
      <GgjCommonHead data={headData} />
      <Heading title={t('term-policy')} showTitle={true} />
      <Content data={data} />
    </>
  )
}

export async function getServerSideProps({ req }: { req: NextRequest }) {
  const { serverRuntimeConfig } = getConfig()
  const data = await http.get('/api/myaccount/v1/terms/privacy', {
    headers: appendGgjHeader({ req }),
    baseURL: serverRuntimeConfig.MYACCOUNT_API_URL,
  })
  return {
    props: {
      data: data.data.data,
      ...(await ggjServerSideTranslations(req, nsTranSurfaceTermLayout)),
    },
  }
}

export default Policy
Policy.Layout = SurfaceTermLayout
