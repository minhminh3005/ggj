import { NextRequest } from 'next/server'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import InformationDetailCommon from 'components/pages/information/common/[id]'
import { nsTranSurfaceDetailLayout, SurfaceDetailLayout } from 'components/layouts'
import { ItemProps } from 'pages/information'
const nsTran = 'surface@information'
const NotificationDetail = (data: {data: ItemProps}) => {
  return (
    <InformationDetailCommon data={data?.data || {}} type='notification' />
  )
}
export async function getServerSideProps({ req }: { req: NextRequest, query: {id: string} }) {
  // if (!data || data?.error === AppError.ECB404) {
  //   return {
  //     notFound: true,
  //   }
  // }
  return {
    notFound: true,
  }
  return {
    props: {
      ...await ggjServerSideTranslations(req as NextRequest, [nsTran], nsTranSurfaceDetailLayout),
    },
  }
}
export default NotificationDetail
NotificationDetail.Layout = SurfaceDetailLayout