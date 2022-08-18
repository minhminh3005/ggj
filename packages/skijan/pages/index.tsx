import { nsTranSurfaceLayout, SurfaceLayout } from 'components/layouts'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { NextRequest } from 'next/server'
import { css } from '@emotion/react'
import TopBanner from '../components/pages/index/TopBanner'
import SkijanReason from '../components/pages/index/SkijanReason'
import Banner from 'components/pages/index/Banner'
import SellerInterview from '../components/pages/index/SellerInterview'
import Suggestion from 'components/pages/index/Suggestion'
import Ranking from 'components/pages/index/Ranking'
import { getAllDataTop } from 'store'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import {IGgjSKillItem, nsGgjProductBox} from 'components/commons/GgjProductBox'
import {useLayoutContext} from 'contexts/LayoutContext'
import GgjCommonHead from '../components/commons/GgjCommonHead'
import GgjHiddenH1 from '../components/commons/GgjHiddenH1'
const nsTran = 'surface@index'
interface SkjBannerProps<T> {
  content: T
  id: number
  title: T
  imageUrl: T
  url: T
  background: T
}
interface AdvertisingProps {
  id: number
  url: string
  imageUrl: string
  nameCate?: string
  title?: string
}
export interface CustomContentProps {
  title: string
  id: number
  data: IGgjSKillItem[]
}
interface IndexProps {
  advertising: AdvertisingProps[]
  customContent: {
    [key: string]: {
      title: string,
      data: IGgjSKillItem[]
    }
  }
  featured: AdvertisingProps[]
  interview: AdvertisingProps[]
  ranking: {
    [key: string]: IGgjSKillItem[]
  }
  skjBanner: SkjBannerProps<string>[]
}
export const typeCheck = {
  custom_content: 'custom_content',
  ranking: 'ranking'
}
export default function IndexPage({data}: {data: IndexProps}) {
  const { t } = useTranslation(nsTran)
  const {updateLayoutSetting} = useLayoutContext()
  const {skjBanner, advertising, featured, interview, ranking, customContent} = data

  const headData = useMemo(() => ({
    title: t('43'),
    description: t('44'),
    keywords: t('45'),
  }), [])

  useEffect(() => {
    updateLayoutSetting({ maxWidth: 1280 })
  }, [])
  return (
    <>
      <GgjCommonHead data={headData} />
      <GgjHiddenH1 />

      {
        <section css={css`margin-bottom: 24px;`}>
          {skjBanner?.length > 0 && <TopBanner listSkjBanner={skjBanner}/>}
          <SkijanReason />
          {featured?.length > 0 && <Suggestion listFeatured={featured}/>}
          {advertising?.length > 0 && <Banner listAdvertising={advertising} />}
          {interview?.length > 0 && <SellerInterview listInterview={interview}/>}
          {Object.keys(customContent)?.length > 0 && <Ranking type={typeCheck.custom_content} listRanking={customContent}/>}
          {Object.keys(ranking)?.length > 0 && <Ranking type={typeCheck.ranking} listRanking={ranking}/>}
        </section>
      }
    </>
  )
}
export async function getServerSideProps({ req }: { req: NextRequest }) {
  const {data}: {data: {[key in string]: Array<{[key2 in string]: string|number}>}} = await getAllDataTop(req)
  if (!data) {
    return {
      notFound: true,
    }
  }
  const props = {
    props: {
      data: data,
      ...await ggjServerSideTranslations(
        req as NextRequest,
        [nsTran, ...nsGgjProductBox],
        nsTranSurfaceLayout
      ),
    },
  }
  return { ...props }
}

IndexPage.Layout = SurfaceLayout
