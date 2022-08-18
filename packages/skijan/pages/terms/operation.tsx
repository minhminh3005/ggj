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


const Operation = ({ data }: { data: ITermData[] }) => {
  const { t } = useTranslation(nsTranSurfaceTermLayout)
  const headData = useMemo(() => ({
    title: t('o-tt'),
    description: t('o-dt'),
    keywords: t('o-kw'),
  }), [])

  return (
    <>
      <GgjCommonHead data={headData} />
      <Heading title={t('term-operation')} showTitle={true}/>
      <Content data={data} />
    </>
  )
}

export async function getServerSideProps({ req }: { req: NextRequest }) {
  const { serverRuntimeConfig } = getConfig()
  const data = await http.get('/api/myaccount/v1/terms/operation', {
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

export default Operation
Operation.Layout = SurfaceTermLayout
