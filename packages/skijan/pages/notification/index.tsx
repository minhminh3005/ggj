import { NextRequest } from 'next/server'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import InformationCommon from 'components/pages/information/common'
import { nsTranSurfaceLayout, SurfaceLayout } from 'components/layouts'
const nsTran = 'surface@information'
const Notification = () => {
  return (
    <InformationCommon type='notification' />
  )
}
export async function getServerSideProps({ req }: { req: NextRequest }) {
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
      ...await ggjServerSideTranslations(req as NextRequest, [nsTran], nsTranSurfaceLayout),
    },
  }
}
export default Notification
Notification.Layout = SurfaceLayout