import { NextRequest } from 'next/server'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { getAllGuideByID } from 'store/guideSlice'
import { GuideProps } from '.'
import { css } from '@emotion/react'
import { InquiryLayout, nsTranInquiryLayout } from 'components/layouts'
import { AppError } from 'app.d'
import { useTranslation } from 'next-i18next'
import { useEffect, useMemo } from 'react'
import { useLayoutContext } from 'contexts/LayoutContext'
import { useRouter } from 'next/router'
import GgjCommonHead from 'components/commons/GgjCommonHead'
import GgjHiddenH1 from 'components/commons/GgjHiddenH1'
const nsTran = 'surface@guide'
const GuideDetail = ({data}: {data: GuideProps<string>}) => {
  const router = useRouter()
  const {updateLayoutSetting} = useLayoutContext()
  const { t } = useTranslation(nsTran)
  const headData = useMemo(() => ({
    title: t('12'),
    description: t('14'),
    keywords: t('13'),
  }), [])

  useEffect(() => {
    updateLayoutSetting({
      title: data?.title || '',
      isShowTitleOnHeaderMobile: true,
      onBack: () => router.push('/guide')
    })
  }, [])
  return (
    <>
      <GgjCommonHead data={headData} />
      <GgjHiddenH1 text={data?.title || ''}/>
      <section css={css`overflow: hidden`} >
        <div className='skj-outline-cls' dangerouslySetInnerHTML={{__html: data?.content || ''}}/>
      </section>
    </>
  )
}
export async function getServerSideProps({ req, query }: { req: NextRequest, query: {id: string} }) {
  const data = await getAllGuideByID(query?.id)
  if (!data || data?.error === AppError.ECB404) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      data: data.data,
      ...await ggjServerSideTranslations(req as NextRequest, [nsTran], nsTranInquiryLayout),
    },
  }
}
export default GuideDetail
GuideDetail.Layout = InquiryLayout
