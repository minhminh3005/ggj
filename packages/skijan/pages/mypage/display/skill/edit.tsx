import {ggjServerSideTranslations} from 'common/i18nUtils'
import {nsTranUploadImages} from 'components/commons/GgjUploadImagesOrYoutube'
import {MypageDetailLayout, nsTranMypageDetailLayout} from 'components/layouts'
import CreateEditSkill from 'components/pages/mypage/display/skill/CreateEditSkill'
import type {NextRequest} from 'next/server'
import {useEffect} from 'react'
import {reducerManager, sw} from 'store/store'
import inputSlice, {actions, getSkillProduct, ns} from 'store/mypage/display/skill/skillInputSlice'
import {useTranslation} from 'next-i18next'
import {useLayoutContext} from '../../../../contexts/LayoutContext'
import CreateEditSkillHead from '../../../../components/pages/mypage/display/skill/input/CreateEditSkillHead'
import {nsTran} from 'components/pages/mypage/display/skill/input/const'
import {skjMiddleware} from '../../../../common/middleware/SkjMiddleware'
import {useRouter} from 'next/router'
import {useAppSelector} from '../../../../store/hooks'
import {STATUS_MAP_REVERSE} from '../../../../components/pages/mypage/display/skill/skill-common-types'

function SkillDetail() {
  reducerManager.add(inputSlice)
  const {t} = useTranslation(nsTran)
  const {updateLayoutSetting} = useLayoutContext()
  const statusType = useAppSelector(state => state[ns].product.statusType)
  const router = useRouter()

  const onBack = () => {
    const tabParam = String(STATUS_MAP_REVERSE[statusType])
    router.push({pathname: '/mypage/display/skill', query: {t: tabParam}})
  }

  useEffect(() => {
    updateLayoutSetting({
      title: t('edit-title-header'),
      isShowTitleOnHeaderMobile: true,
      onBack: onBack
    })
    return () => {
      reducerManager.remove(ns)
    }
  }, [])

  return (
    <>
      <CreateEditSkillHead/>
      <CreateEditSkill />
    </>
  )
}

export const getServerSideProps = sw.getServerSideProps(({dispatch}) => async ({ req, query, resolvedUrl }) => {
  const re = skjMiddleware(req, resolvedUrl)
  if (re !== true) {
    return re
  }
  reducerManager.add(inputSlice)
  dispatch(actions.resetState())
  const props = {
    props: {
      ...await ggjServerSideTranslations(
        req as unknown as NextRequest,
        [nsTran, nsTranUploadImages],
        nsTranMypageDetailLayout
      ),
    },
  }
  const id = Number(query.id)
  if(!id) return {
    notFound: true
  }

  // @ts-ignore
  const result = await dispatch(getSkillProduct(id, req as unknown as NextRequest))
  if(result.error) {
    return {
      notFound: true
    }
  }

  return { ...props }
})
SkillDetail.Layout = MypageDetailLayout
export default SkillDetail
