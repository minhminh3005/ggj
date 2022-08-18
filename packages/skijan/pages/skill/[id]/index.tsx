import {useTheme} from '@mui/material/styles'
import {Typography} from '@mui/material'
import Divider from '@mui/material/Divider'

import {css} from '@emotion/react'
import {NextRequest} from 'next/server'
import {ggjServerSideTranslations} from 'common/i18nUtils'

import {useEffect, useMemo} from 'react'

import {
  createSliceByNameSpace,
  ISkillInfoType,
  NSPaymentSkillDetail,
  PaymentPanelProvider
} from 'components/commons/GgjPaymentPanel/paymentPanelSlice'
import {GgjPaymentInfoBox, nsTranPaymentPanel} from 'components/commons/GgjPaymentPanel'
import SkillPaidOption from 'components/pages/skill/[id]/ProductPaidOption'
import {NextParsedUrlQuery} from 'next/dist/server/request-meta'
import SkillBreadCrumbs from 'components/pages/skill/[id]/SkillBreadCrumbs'
import ProductReview from 'components/pages/skill/[id]/ProductReview'
import GgjLazyRenderComp from 'components/commons/GgjLazyRenderComp'
import ProductDescription from 'components/pages/skill/[id]/ProductDescription'
import SkillTopSlider from 'components/pages/skill/[id]/SkillTopSlider/SkillTopSlider'
import SellerInfo from 'components/pages/skill/[id]/SellerInfo'
import ProductFaq from 'components/pages/skill/[id]/ProductFaq'
import ProductSlider from 'components/pages/skill/[id]/ProductSlider'
import ProductInfo from 'components/pages/skill/[id]/ProductInfo'
import {nsTranSurfaceDetailLayout, SurfaceDetailLayout} from 'components/layouts'
import {skillDetailNsTran as nsTran} from 'components/pages/skill/[id]/const'
import GgjCommonHead from 'components/commons/GgjCommonHead'

// store import
import skillSlice, {
  getSkillDetails,
  ns as skillDetailNs,
  ns as skillDetailSliceNs,
  State as SkillSliceState,
  State,
  TAPIResObject
} from 'store/skillSlice'
import {reducerManager, sw} from 'store/store'
import {useAppSelector} from 'store/hooks'
import {nsGgjFavoriteButton} from 'components/commons/GgjFavoriteButton'
import {nsGgjBreadcrumbs} from 'components/commons/GgjBreadcrumbs'
import {nsCommonCategories} from 'common/categories'
import {useRouter} from 'next/router'
import {ggjReviewBoxI18nNs} from 'components/commons/GgjReviewBox'
import {useTranslation} from 'next-i18next'

const paymentSkillDetailSlice = createSliceByNameSpace(NSPaymentSkillDetail)

function SkillTitle({className}: { className?: string }) {
  const title = useAppSelector(state => (state[skillDetailSliceNs] as SkillSliceState)?.apiResObj?.paymentInfo?.title)
  return <Typography className={className} variant="h5" component="h1">{title}</Typography>
}

function ServiceDetail({keyDetectRouterChange}: { keyDetectRouterChange: number }) {
  const theme = useTheme()
  const router = useRouter()
  const {t} = useTranslation(nsTran)
  const imageUrl = useAppSelector(state => state[skillDetailSliceNs]?.apiResObj?.generalInfoSkill?.imageUrl)

  const headData = useMemo(() => ({
    title: t('meta-title'),
    description: t('meta-description'),
    keywords: t('meta-keywords'),
    imageUrl
  }), [])

  const containerCss = css`
    max-width: 592px;
    margin-right: auto;
    margin-left: auto;
    display: flex;
    flex-direction: column;
    padding-top: ${theme.spacing(3)};
    @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
      max-width: 100%;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: space-between;
      padding-top: 0;
    }
  `

  reducerManager.add([paymentSkillDetailSlice, skillSlice])
  useEffect(() => {
    return function () {
      reducerManager.remove([NSPaymentSkillDetail, skillDetailNs])
    }
  }, [])

  useEffect(() => {
    const el = document.getElementById('BodyWrapper')
    el && (el.scrollTop = 0)
    window.scrollTo(0, 0)
  }, [keyDetectRouterChange])

  return <>
    <GgjCommonHead data={headData} />
    <div css={containerCss} key={`SF_SKILL_DETAIL_${router.query.id}`}>
      {/* top slider */}
      <SkillTopSlider css={css`
        order: 2;
        margin-bottom: ${theme.spacing(2)};
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          order: 3;
          margin-bottom: ${theme.spacing(6)};
          flex: 1 0 529px;
          max-width: calc(100% - 327px - 96px);
        }
      `}/>

      {/* title + breadcrumb */}
      <div css={css`
        order: 3;
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          order: 2;
          min-height: ${theme.spacing(4)};
          flex: 1 0 529px;
          max-width: calc(100% - 327px - 96px);
        }
      `}>
        <SkillBreadCrumbs css={css`margin-bottom: ${theme.spacing(3)}`}/>
        <SkillTitle css={css`margin-bottom: ${theme.spacing(3)}`}/>
      </div>

      {/* description */}
      <ProductDescription css={css`
        order: 5;
        margin-bottom: ${theme.spacing(5)};
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          order: 4;
          margin-bottom: ${theme.spacing(6)};
          flex: 1 0 529px;
          max-width: calc(100% - 327px - 96px);
        }
      `}/>

      {/* left block (review + recommended products) */}
      <LeftBlock css={css`
        order: 6;
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          order: 5;
          flex: 1 0 529px;
          max-width: calc(100% - 327px - 96px);
        }
      `}/>
      <RightBlock />
    </div>
  </>
}

function RightBlock() {
  const theme = useTheme()
  const containerCss = css`
    max-height: calc(100vh - 112px);
    overflow: auto;
    -ms-overflow-style: none;
    order: 4;
    padding: 2px 2px 10px 2px;

    &::-webkit-scrollbar {
      display: none;
    }

    @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
      position: sticky;
      max-width: 327px;
      top: min(92px, calc(6vh - 42px));
      margin-left: ${theme.spacing(4)};
      order: 3;
      max-height: unset;
      height: fit-content;
      padding-bottom: 100px;
    }
  `
  const productInfoCss = css`
    margin-bottom: ${theme.spacing(5)};
    @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
      max-width: 328px;
      margin-bottom: ${theme.spacing(4)};
    }
  `
  return (
    <div css={containerCss}>
      <ProductInfo css={productInfoCss}/>
      <PaymentPanelProvider namespace={NSPaymentSkillDetail}>
        <GgjPaymentInfoBox/>
      </PaymentPanelProvider>
    </div>
  )
}

function LeftBlock({className}: { className?: string }) {
  const theme = useTheme()
  const faqData = useAppSelector(
    state => (state[skillDetailSliceNs] as State)?.apiResObj?.skillFAQs ?? [],
    (left, right) => left?.length === right?.length
  )
  const leftBlockCss = css`
    @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
      width: 592px;
      flex: 0 0 592px;
    }
  `

  return (
    <div css={leftBlockCss} className={className}>
      {/* product faq */}
      {faqData.length > 0 && <>
        <GgjLazyRenderComp
          minHeight={100}
          component={ProductFaq}
        />
      </>}

      {/* product paid option */}
      <SkillPaidOption/>
      <Divider css={css`margin-bottom: ${theme.spacing(4)}`}/>

      {/* seller info */}
      <GgjLazyRenderComp
        minHeight={100}
        component={SellerInfo}
      />

      {/* reviews block */}
      <ProductReview css={css`margin-bottom: 4px;`}/>

      {/* product slider */}
      <GgjLazyRenderComp
        component={ProductSlider}
        minHeight={400}
      />
    </div>
  )
}

export const getServerSideProps = sw.getServerSideProps((store) => async ({req, params}) => {
  const skillId = (params as NextParsedUrlQuery).id as string

  // validate params
  if (!params || !skillId || isNaN(parseInt(skillId))) return {notFound: true}

  // call api
  const [_nextI18Next, result] = await Promise.all([
    ggjServerSideTranslations(req as unknown as NextRequest, [...ggjReviewBoxI18nNs, nsTran, nsTranPaymentPanel, nsGgjFavoriteButton, nsCommonCategories, nsGgjBreadcrumbs], nsTranSurfaceDetailLayout),
    getSkillDetails(req as unknown as NextRequest, skillId as string)
  ])

  // validate data
  const {data, error} = result as { data: TAPIResObject, error: string }
  if (error || !data || !data?.paymentInfo) return {notFound: true}

  // init store payment
  reducerManager.add([paymentSkillDetailSlice, skillSlice])
  const paymentActions = paymentSkillDetailSlice.actions

  store.dispatch(paymentActions.updateStatePaymentInfo(data.paymentInfo as ISkillInfoType))
  // init store skill-detail
  store.dispatch(skillSlice.actions.setData(data))

  // return
  return {
    props: {
      ..._nextI18Next,
      data,
      keyDetectRouterChange: Math.random(), // using for detect router change
    }
  }
})

ServiceDetail.Layout = SurfaceDetailLayout
export default ServiceDetail
