import { NextRequest } from 'next/server'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import InformationDetailCommon from 'components/pages/information/common/[id]'
import { nsTranSurfaceDetailLayout, SurfaceDetailLayout } from 'components/layouts'
import { ItemProps } from '.'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useLayoutContext } from 'contexts/LayoutContext'
import { getInformationById } from 'store/informationSlice'
import { AppError } from 'app.d'
import GgjCommonHead from '../../components/commons/GgjCommonHead'
const nsTran = 'surface@information'
const InformationDetail = (data: {data: ItemProps}) => {
  const { t } = useTranslation(nsTran)
  const router = useRouter()
  const {updateLayoutSetting} = useLayoutContext()
  const headData = useMemo(() => ({
    title: t('22'),
    description: t('23'),
    keywords: t('24'),
  }), [])
  useEffect(() => {
    updateLayoutSetting({
      title: t('21'),
      isShowTitleOnHeaderMobile: true,
      onBack: () => router.push('/')
    })
  }, [])
  return (
    <div>
      <GgjCommonHead data={headData} />
      <InformationDetailCommon data={data?.data || {}} type='information' />
    </div>
  )
}
export async function getServerSideProps({ req, query }: { req: NextRequest, query: {id: string} }) {
  const data = await getInformationById(query?.id, req)
  if (data?.error === AppError.ECB404) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      data: data.data,
      ...await ggjServerSideTranslations(req as NextRequest, [nsTran], nsTranSurfaceDetailLayout),
    },
  }
}
export default InformationDetail
InformationDetail.Layout = SurfaceDetailLayout
