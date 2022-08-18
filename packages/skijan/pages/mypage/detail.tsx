import { MypageDetailLayout, nsTranMypageDetailLayout } from 'components/layouts'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { NextRequest } from 'next/server'
import { useLayoutContext } from 'contexts/LayoutContext'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function IndexPage() {
  const { updateLayoutSetting } = useLayoutContext()
  const router = useRouter()
  useEffect(() => {
    updateLayoutSetting({
      backgroundColor: '#fff',
      title: 'Create Skill',
      onBack: () => router.push('/mypage')
    })
  }, [])
  return (
    <>
      {Array(100)
        .fill(null)
        .map((item, idx) => (
          <div key={idx}>BODY INQUIRY</div>
        ))}
    </>
  )
}

export async function getServerSideProps({ req }: { req: NextRequest }) {
  const props = {
    props: {
      ...(await ggjServerSideTranslations(
        req as NextRequest,
        [],
        nsTranMypageDetailLayout
      )),
    },
  }
  return { ...props }
}

IndexPage.Layout = MypageDetailLayout
