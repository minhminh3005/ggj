import { ggjServerSideTranslations } from 'common/i18nUtils'
import { nsTranUploadImages } from 'components/commons/GgjUploadImagesOrYoutube'
import { MypageDetailLayout, nsTranMypageDetailLayout } from 'components/layouts'
import CreateEditSkill from 'components/pages/mypage/display/skill/CreateEditSkill'
import type {NextRequest} from 'next/server'
import {useEffect} from 'react'
import {reducerManager, sw} from 'store/store'
import inputSlice, {actions, getCloneSkillProduct, ns} from 'store/mypage/display/skill/skillInputSlice'
import {useAppDispatch} from 'store/hooks'
import {useTranslation} from 'next-i18next'
import {useLayoutContext} from '../../../../contexts/LayoutContext'
import CreateEditSkillHead from '../../../../components/pages/mypage/display/skill/input/CreateEditSkillHead'
import {nsTran} from 'components/pages/mypage/display/skill/input/const'
import { skjMiddleware } from '../../../../common/middleware/SkjMiddleware'


function SkillInput() {
  reducerManager.add(inputSlice)
  const {t} = useTranslation(nsTran)
  const dispatch = useAppDispatch()
  const {updateLayoutSetting} = useLayoutContext()

  useEffect(() => {
    updateLayoutSetting({
      title: t('input-title-header'),
      isShowTitleOnHeaderMobile: true,
    })
    // @ts-ignore
    const cloneId = window.cloneId
    if (cloneId) {
      (async (id: number) => {
        // @ts-ignore
        await dispatch(getCloneSkillProduct(id))
      })(cloneId)
    }

    // destroy component
    return () => {
      reducerManager.remove(ns)
    }
  }, [])


  return (
    <>
      <CreateEditSkillHead />
      <CreateEditSkill />
    </>
  )
}

export const getServerSideProps = sw.getServerSideProps(({dispatch}) => async ({req, resolvedUrl}) => {
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
        nsTranMypageDetailLayout,
      ),
      // ...state
    },
  }
  return {...props}
})

SkillInput.Layout = MypageDetailLayout
export default SkillInput
