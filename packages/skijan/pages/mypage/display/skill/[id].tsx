import {MypageDetailLayout, nsTranMypageDetailLayout} from 'components/layouts'
import {ggjServerSideTranslations} from 'common/i18nUtils'
import {NextRequest} from 'next/server'
import {css} from '@emotion/react'
import ServiceDetailPageHeader from 'components/pages/mypage/display/skill/[id]/ServiceDetailPageHeader'
import SkillTabs from 'components/pages/mypage/display/skill/[id]/SkillTabs'
import DetailInfo from 'components/pages/mypage/display/skill/[id]/DetailInfo'
import {useLayoutContext} from 'contexts/LayoutContext'
import {useEffect} from 'react'
import {useTheme} from '@mui/material/styles'
import {useTranslation} from 'next-i18next'
import {ns} from 'components/pages/mypage/display/skill/[id]/const'
import Head from 'next/head'

// store
import skillDetailSlice, {
  getSkillServiceDetail,
  TSkillDetail,
  ns as storeNs
} from 'store/mypage/display/skill/skillDetailSlice'
import {reducerManager, sw} from 'store/store'
import {
  ModalConfirmChangeStatusNS
} from 'components/pages/mypage/display/skill/ChangeStatusBtn/ModalConfirmChangeStatus'
import {nsGgjProductBox} from 'components/commons/GgjProductBox'
import {skjMiddleware} from '../../../../common/middleware/SkjMiddleware'

import useComponentWillMount from 'hooks/useComponentWillMount'

export default function IndexPage() {
  const theme = useTheme()
  const {updateLayoutSetting} = useLayoutContext()
  const {t} = useTranslation(ns)
  useEffect(() => {
    updateLayoutSetting({
      backgroundColor: '#fff',
      title: t('13'),
    })
  }, [])

  // add slice when before mount
  useComponentWillMount(() => reducerManager.add(skillDetailSlice))
  // remove slice when unmount
  useEffect(() => (() => reducerManager.remove(storeNs)), [])

  return (
    <>
      <Head>
        <title>{t('meta-title')}</title>
        <meta data-n-head="true" name="description" content={t('meta-description')} data-hid="description"/>
        <meta data-n-head="true" name="keywords" content={t('meta-keywords')} data-hid="keywords"/>
      </Head>
      <div
        css={css`
        min-height: 100vh;
        margin: 0 auto 0 auto;
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          max-width: 700px;
          margin-top: ${theme.spacing(4)};
          padding: 0 ${theme.spacing(3)};
        }
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          max-width: inherit;
          padding: 0;
          margin-top: 0;
        }
      `}>
        {/*HEADER*/}
        <ServiceDetailPageHeader/>
        {/*DETAIL INFO*/}
        <DetailInfo/>
        {/*TABS*/}
        <SkillTabs/>
      </div>
    </>
  )
}
export const getServerSideProps = sw.getServerSideProps((storeServerSide) => async ({req, query, resolvedUrl}) => {
  const re = skjMiddleware(req, resolvedUrl)
  if (re !== true) {
    return re
  }
  // in case id is not a number, 404
  if (!query.id || !parseInt(`${+query.id}`)) return {notFound: true}

  const data = await getSkillServiceDetail(req as unknown as NextRequest, {id: parseInt(`${query.id}`), page: 1})

  // in case id is not exist, 404
  if(data.error) return {notFound: true}

  // init data store
  reducerManager.add(skillDetailSlice)
  storeServerSide.dispatch(skillDetailSlice.actions.setData(data.data as TSkillDetail))

  return {
    props: {
      ...await ggjServerSideTranslations(req as unknown as NextRequest, [ns, ModalConfirmChangeStatusNS, ...nsGgjProductBox], nsTranMypageDetailLayout),
      data,
    }
  }
})

IndexPage.Layout = MypageDetailLayout
