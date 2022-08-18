import Content, { ITermData } from 'components/pages/terms/Content'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { NextRequest } from 'next/server'
import http, { appendGgjHeader } from 'common/http'
import { useTranslation } from 'next-i18next'
import {nsTranSurfaceTermLayout, SurfaceTermLayout} from 'components/layouts'
import getConfig from 'next/config'
import {useMemo} from 'react'
import GgjCommonHead from 'components/commons/GgjCommonHead'
import Heading from 'components/pages/terms/Heading'

const Service = ({ data }: { data: ITermData[] }) => {
  const { t } = useTranslation(nsTranSurfaceTermLayout)
  const headData = useMemo(() => ({
    title: t('sv-tt'),
    description: t('sv-dt'),
    keywords: t('sv-kw'),
  }), [])
  return (
    <>
      <GgjCommonHead data={headData} />
      <Content data={data} />
      <Heading title={t('term-service')} showTitle={false} />
    </>
  )
}

export async function getServerSideProps({ req }: { req: NextRequest }) {
  const { serverRuntimeConfig } = getConfig()
  const data = await http.get('/api/myaccount/v1/terms/service', {
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

export default Service
Service.Layout = SurfaceTermLayout
