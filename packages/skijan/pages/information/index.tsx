import { NextRequest } from 'next/server'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { nsTranSurfaceLayout, SurfaceLayout } from 'components/layouts'
import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import GgjCommonHead from '../../components/commons/GgjCommonHead'
const nsTran = 'surface@information'
export interface ItemProps {
  content: string
  id: number
  publishedAt: number
  title: string
  isShowRedIcon: boolean
  imgUserAvatarUrl: string
}
export interface ListInformationNew {
  informations: ItemProps[]
  isLastInformation: boolean
}
export interface DataProps {
  data: ItemProps[]
  pagingMeta: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    limit: number
    page: number
    totalItem: number
    totalPage: number
  }
}
const Information = () => {
  const { t } = useTranslation(nsTran)
  const headData = useMemo(() => ({
    title: t('22'),
    description: t('23'),
    keywords: t('24'),
  }), [])
  return (
    <GgjCommonHead data={headData} />
  )
}
export async function getServerSideProps({ req }: { req: NextRequest, query: {id: string} }) {
  // TODO: HIEU NGUYEN - RELEASE NEXT PHASE
  return {
    notFound: true,
  }
  return {
    props: {
      ...await ggjServerSideTranslations(req as NextRequest, [nsTran], nsTranSurfaceLayout),
    },
  }
}
export default Information
Information.Layout = SurfaceLayout
