import React, {useEffect, useMemo, useState} from 'react'
import {css} from '@emotion/react'
import {useTheme} from '@mui/material/styles'
import {Typography, useMediaQuery} from '@mui/material'
import Image from 'next/image'
import ServiceReviewEmpty from 'components/pages/skill/review-empty.png'
import {useTranslation} from 'next-i18next'
import {ggjServerSideTranslations} from 'common/i18nUtils'
import type {NextRequest} from 'next/server'
import {useRouter} from 'next/router'
import {nsTranSurfaceDetailLayout, SurfaceDetailLayout,} from 'components/layouts'
import GgjReviewBox, {ggjReviewBoxI18nNs as ggjReviewBoxNs, IGgjReviewBox} from 'components/commons/GgjReviewBox'
import GgjSort from 'components/commons/GgjSort'
import {getSkillServiceReview, getSkillServiceReviewDetail,} from 'store/reviewSlice'
import GgjReviewSummary from 'components/commons/GgjReviewSummary'
import GgjBreadcrumbs from 'components/commons/GgjBreadcrumbs'
import {GgjOutlineButton} from 'components/commons/GgjButton'
import {loadingOffHandler, loadingOnHandler} from 'contexts/LoadingContext'

import {toastHandler} from 'contexts/ToastContext'
import {AppError} from 'app.d'
import {reducerManager, sw} from '../../../store/store'
import {
  createSliceByNameSpace,
  ISkillInfoType,
  NSPaymentReviewDetail,
  PaymentPanelProvider,
} from '../../../components/commons/GgjPaymentPanel/paymentPanelSlice'
import {NextParsedUrlQuery} from 'next/dist/server/request-meta'
import {GgjPaymentInfoBox} from '../../../components/commons/GgjPaymentPanel'
import {nsTranPaymentPanel} from 'components/commons/GgjPaymentPanel'
import {IGgjCategoriesLarge, IGgjCategoriesMiddle, nsCommonCategories} from 'common/categories'
import menuData from 'components/layouts/common/menu-data.json'
import GgjCommonHead from '../../../components/commons/GgjCommonHead'

const paymentReviewDetailSlice = createSliceByNameSpace(NSPaymentReviewDetail)
const nsTran = 'surface@service-review'

interface ServiceReviewProps {
  reviewDetail?: {
    reviewInfo?: {
      avgReviewStars: number
      noReview: string
      reviewRequirementDetails: {
        avgReviewStars: number
        name: string
      }[]
    }
    category: {
      large?: number
      middle?: number
      small?: number
    }
    paymentInfo: {
      catchcopy: string
    }
  }
  reviewDataInit?: {
    data: IGgjReviewBox[]
    pagingMeta: {
      hasNextPage: boolean
    }
  }
  title: string
}

const ServiceReview = ({
  reviewDetail,
  reviewDataInit,
  title,
}: ServiceReviewProps) => {
  const theme = useTheme()
  const {t} = useTranslation([nsTran, nsCommonCategories])
  const router = useRouter()
  const {id} = router.query
  reducerManager.add(paymentReviewDetailSlice)
  useEffect(() => {
    return function () {
      reducerManager.remove(NSPaymentReviewDetail)
    }
  }, [])
  const [params, setParams] = useState({
    selected: '0',
    page: 1,
  })
  const [reviewData, setReviewData] = useState(reviewDataInit)
  const category = reviewDetail?.category
  const breakPoint = useMediaQuery(`(max-width:${theme.breakpoints.values.lg - 1}px)`)
  const isMobileOrTablet = useMemo(() => breakPoint, [breakPoint])

  const pc = useMemo(() => {
    const largeId = category?.large
    const middleId = category?.middle
    const largeObject = (menuData as Array<IGgjCategoriesLarge>).filter(item => item.id === largeId)[0] as IGgjCategoriesLarge
    const middleObject = largeObject.sub.filter(item => item.id === middleId)[0] as IGgjCategoriesMiddle
    return {
      large: largeObject.sub.map(item => item.id),
      middle: [middleObject.id, ...(middleObject.smallIds ?? [])],
    }
  }, [category?.large, category?.middle])

  const breadcrumbs = useMemo(() => (
    [
      {
        title: t('ホーム'),
        url: '/',
      },
      category?.large
        ? {
          title: t(`${category.large}`, { ns: nsCommonCategories }),
          url: {
            pathname: '/search',
            query: { pc: pc.large.toString() },
          },
        }
        : null,
      category?.middle
        ? {
          title: t(`mid_${category.middle}`, { ns: nsCommonCategories }),
          url: {
            pathname: '/search',
            query: { pc: pc.middle.toString() },
          },
        }
        : null,
      category?.small
        ? {
          title: t(`mid_${category.small}`, { ns: nsCommonCategories }),
          url: {
            pathname: '/search',
            query: { pc: category?.small },
          },
        }
        : null,
      {
        title: title,
        url: `/skill/${router.query.id}`,
      },
      {
        title: t('レビュー'),
      },
    ].filter(Boolean) as Array<{ title: string; url?: string }>
  ), [category?.large, category?.middle, category?.small, title])

  async function handleFetchSkillServiceReview({
    selected,
    page,
    resetData,
  }: {
    selected: string
    page: number
    resetData: boolean
  }) {
    loadingOnHandler()
    try {
      const {data} = await getSkillServiceReview({
        skillId: parseInt(id + ''),
        params: {
          page,
          order: 'DESC',
          stars: +selected,
          limit: 10,
        },
      })

      setReviewData(
        resetData
          ? data?.data
          : {
            ...data?.data,
            data: reviewData?.data?.concat(data?.data?.data),
          }
      )
    } catch (err) {
      toastHandler({
        type: 'error',
      })
    } finally {
      loadingOffHandler()
    }
  }

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
      max-width: 289px;
      top: min(92px, calc(6vh - 42px));
      margin-left: 62px;
      order: 3;
      max-height: unset;
      height: fit-content;
      padding-bottom: 100px;
    }
  `
  const productInfoCss = css`
    margin-bottom: ${theme.spacing(5)};
    @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
      max-width: 289px;
      margin-bottom: ${theme.spacing(4)};
    }
  `

  function fetchMoreReview() {
    setParams({
      ...params,
      page: params.page + 1,
    })
    handleFetchSkillServiceReview({
      page: params.page + 1,
      selected: params.selected,
      resetData: false,
    })
  }

  function handleRatingChange(value: string) {
    setParams({
      page: 1,
      selected: value,
    })
    handleFetchSkillServiceReview({
      page: 1,
      selected: value,
      resetData: true,
    })
  }

  const headData = useMemo(() => ({
    title: title + t('26'),
    description: reviewDetail?.paymentInfo?.catchcopy || '',
    keywords: t('25'),
  }), [])

  // @ts-ignore
  return (
    <>
      <GgjCommonHead data={headData} />
      <div
        css={css`
          @media (min-width: ${theme.breakpoints.values.lg}px) {
            display: grid;
            grid-template-columns: calc(100% - 370px) auto;
            grid-column-gap: 20px;
          }
        `}
      >
        <div
          css={css`
            padding: 24px 0 159px 0;
            @media (min-width: ${theme.breakpoints.values.md}px) {
              max-width: 668px;
              margin: 0 auto;
              padding: 24px 0 152px 0;
            }

            @media (min-width: ${theme.breakpoints.values.lg}px) {
              max-width: 1080px;
              margin: unset;
            }
          `}
        >
          <GgjBreadcrumbs data={breadcrumbs}/>

          <Typography
            variant="h5"
            component="h1"
            css={css`
              margin-top: 32px;
            `}
          >
            {title}
            {t('のレビュー')}
          </Typography>

          {
            isMobileOrTablet &&
            <GgjReviewSummary
              data={{
                reviewStars: parseInt(
                  reviewDetail?.reviewInfo?.avgReviewStars + ''
                ),
                count: parseInt(reviewDetail?.reviewInfo?.noReview + ''),
                reviewDetails:
                  reviewDetail?.reviewInfo?.reviewRequirementDetails?.map(
                    ({name, avgReviewStars}) => ({
                      reviewType: name,
                      reviewStars: avgReviewStars,
                    })
                  ),
              }}
            />
          }

          <Typography
            css={css`
              margin-top: 32px;
              margin-bottom: 24px;
            `}
            variant="h6"
            component="h2"
          >
            {t('7')}
          </Typography>

          <GgjSort selected={params.selected} handler={handleRatingChange}/>

          {!reviewData?.data?.length && (
            <>
              <div
                css={css`
                  margin: 0 auto;
                  width: 240px;
                  height: 240px;
                  margin-top: 48px;
                  @media (min-width: ${theme.breakpoints.values.md}px) {
                    width: 326px;
                    height: 326px;
                    margin-top: 52px;
                  }
                  @media (min-width: ${theme.breakpoints.values.lg}px) {
                    width: 280px;
                    height: 280px;
                    margin-top: 94px;
                  }
                `}
              >
                <Image sizes="100% 100%" src={ServiceReviewEmpty} alt=""/>
              </div>

              <Typography
                css={css`
                  text-align: center;
                  margin-top: ${theme.spacing(4)};
                `}
                variant="subtitle1"
              >
                {t('10')}
              </Typography>
            </>
          )}

          <div
            css={css`
              margin-top: 24px;
            `}
          >
            {reviewData?.data?.map((item, index) => (
              <div
                key={index}
                css={css`
                  &:not(:last-child) {
                    margin-bottom: 15px;
                  }
                `}
              >
                <GgjReviewBox
                  data={item}
                />
              </div>
            ))}
            {reviewData?.pagingMeta?.hasNextPage && (
              <GgjOutlineButton
                onClick={fetchMoreReview}
                css={css`
                  width: 100%;
                  margin-top: 24px;
                `}
              >
                {t('24')}
              </GgjOutlineButton>
            )}
          </div>
        </div>

        {
          !isMobileOrTablet &&
          <div css={containerCss}>
            <div css={productInfoCss}>
              <GgjReviewSummary
                lgGridColumns={12}
                data={{
                  reviewStars: parseFloat(reviewDetail?.reviewInfo?.avgReviewStars + ''),
                  count: parseInt(reviewDetail?.reviewInfo?.noReview + ''),
                  reviewDetails:
                    reviewDetail?.reviewInfo?.reviewRequirementDetails?.map(
                      ({name, avgReviewStars}) => ({
                        reviewType: name,
                        reviewStars: avgReviewStars,
                      })
                    ),
                }}
              />
            </div>
            <PaymentPanelProvider namespace={NSPaymentReviewDetail}>
              <GgjPaymentInfoBox/>
            </PaymentPanelProvider>
          </div>
        }

        {
          isMobileOrTablet &&
          <PaymentPanelProvider namespace={NSPaymentReviewDetail}>
            <GgjPaymentInfoBox/>
          </PaymentPanelProvider>
        }

      </div>
    </>
  )
}

export const getServerSideProps = sw.getServerSideProps(
  (store) =>
    async ({req, params}) => {
      if (!params) return {notFound: true}
      const id = (params as NextParsedUrlQuery).id
      reducerManager.add(paymentReviewDetailSlice)
      const [{data: reviewDetail}, {data: reviewList}, _nextI18Next] =
        await Promise.all([
          getSkillServiceReviewDetail({
            skillId: parseInt(id + ''),
          }),
          getSkillServiceReview({
            skillId: parseInt(id + ''),
            params: {
              page: 1,
              stars: 0,
            },
          }),
          ggjServerSideTranslations(
            req as unknown as NextRequest,
            [nsTran, nsTranPaymentPanel, nsCommonCategories, ...ggjReviewBoxNs],
            nsTranSurfaceDetailLayout
          ),
        ])

      if (
        reviewDetail.error === AppError.ECB404 ||
        reviewList.error === AppError.ECB404
      ) {
        return {
          notFound: true,
        }
      }

      const paymentInfo = reviewDetail.data.paymentInfo as ISkillInfoType
      const actions = paymentReviewDetailSlice.actions
      store.dispatch(actions.updateStatePaymentInfo(paymentInfo))

      return {
        props: {
          ..._nextI18Next,
          reviewDetail: reviewDetail?.data,
          reviewDataInit: reviewList?.data,
          title: paymentInfo?.title,
        },
      }
    }
)

export default ServiceReview
ServiceReview.Layout = SurfaceDetailLayout
