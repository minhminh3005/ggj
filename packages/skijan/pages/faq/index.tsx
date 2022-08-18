import React, { useState, useEffect } from 'react'
import { css } from '@emotion/react'
import FaqAccordion from 'components/pages/faq/FaqAccordion'
import { useTheme } from '@mui/material/styles'
import { Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { getCategories } from 'store/faqSlice'
import type { NextRequest } from 'next/server'
import { InquiryLayout, nsTranInquiryLayout } from 'components/layouts'
import { useLayoutContext } from 'contexts/LayoutContext'
import { AppError } from 'app.d'
import Head from 'next/head'
import GgjHiddenH1 from 'components/commons/GgjHiddenH1'

const nsTran = 'surface@faq'

interface FaqProps {
  categories: {
    id?: number
    name?: string
    priority?: number
    categoriesMiddle?: {
      id: number
      name?: string
      faqCategoryLargeId?: number
      priority?: number
      faqs: {
        id: number
        faqCategoryLargeId?: number
        faqCategoryMiddleId?: number
        question: string
        answer: string
      }[]
    }[]
  }[]
}

interface HeadProps {
  title?: string
  description?: string
  keywords?: string
}

export const HeadSeo = ({ title, description, keywords }: HeadProps) => (
  <Head>
    {title && <title>{title}</title>}
    {description && <meta name="description" content={description} />}
    {keywords && <meta name="keywords" content={keywords} />}
  </Head>
)

function FAQ({ categories }: FaqProps) {
  const theme = useTheme()
  const [currentExpanded, setCurrentExpanded] = useState<number>()
  const { updateLayoutSetting } = useLayoutContext()
  const { t } = useTranslation(nsTran)


  function handleExpandChange(isExpanded: boolean, subCategoryId: number) {
    if (isExpanded) {
      setCurrentExpanded(subCategoryId)
      return
    }
    setCurrentExpanded(0)
  }

  useEffect(() => {
    updateLayoutSetting({
      backgroundColor: theme.palette.canvas.light,
      title: t('1'),
      isShowTitleOnHeaderMobile: true,
    })
  }, [])

  return (
    <>
      <HeadSeo description={t('5') + t('8')} title={t('6')} keywords={t('7')} />
      <GgjHiddenH1 />

      <div
        css={css`
          padding: 24px 0 95px 0;
          max-width: 1080px;
          @media (min-width: ${theme.breakpoints.values.md}px) {
            padding: 24px 0 296px 0;
          }
          @media (min-width: ${theme.breakpoints.values.lg}px) {
            padding: 24px 0 350px 0;
          }
        `}
      >
        <Typography
          variant="h5"
          component="h2"
          css={css`
            margin-bottom: 24px;
            display: none;
            @media (min-width: ${theme.breakpoints.values.lg}px) {
              display: block;
            }
          `}
        >
          {t('1')}
        </Typography>
        <div
          css={css`
            @media (min-width: ${theme.breakpoints.values.md}px) {
              display: grid;
              grid-template-columns:
                calc((100% - 32px) / 3) calc((100% - 32px) / 3)
                auto;
              grid-column-gap: 16px;
            }

            @media (min-width: ${theme.breakpoints.values.lg}px) {
              grid-template-columns:
                calc((100% - 48px) / 3) calc((100% - 48px) / 3)
                auto;
              grid-column-gap: 24px;
            }
          `}
        >
          {categories?.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              css={css`
                margin-bottom: ${theme.spacing(4)};
              `}
            >
              <Typography
                css={css`
                  color: ${theme.palette.primary.main};
                  margin-bottom: ${theme.spacing(3)};
                `}
                variant="subtitle1"
                component="h3"
              >
                {category.name}
              </Typography>

              {category?.categoriesMiddle?.map(
                (subCategory, subCategoryIndex) => (
                  <FaqAccordion
                    key={subCategoryIndex}
                    title={subCategory.name}
                    questionList={subCategory?.faqs}
                    onChange={(isExpanded: boolean) =>
                      handleExpandChange(isExpanded, subCategory?.id)
                    }
                    expanded={currentExpanded === subCategory?.id}
                  />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ req }: { req: NextRequest }) {
  const { data } = await getCategories()

  if (data.error === AppError.ECB404) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      ...(await ggjServerSideTranslations(req, nsTran, nsTranInquiryLayout)),
      categories: data?.data || [],
    },
  }
}

export default FAQ
FAQ.Layout = InquiryLayout
