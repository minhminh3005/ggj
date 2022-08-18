import React, { useEffect, useState } from 'react'
import { css } from '@emotion/react'
import FaqAccordion from 'components/pages/faq/FaqAccordion'
import { useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import { Typography, FormControl } from '@mui/material'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import type { NextRequest } from 'next/server'
import { InquiryLayout, nsTranInquiryLayout } from 'components/layouts'
import { getFaqDetail } from 'store/faqSlice'
import { AppError } from 'app.d'
import { useRouter } from 'next/router'
import { HeadSeo } from '.'
import { useLayoutContext } from 'contexts/LayoutContext'
import GgjHiddenH1 from 'components/commons/GgjHiddenH1'

const nsTran = 'surface@faq'

interface FaqListProps {
  category?: {
    name: string
    categoriesMiddle?: {
      id: number
      name: string
      faqs?: {
        id: number
        question: string
        answer: string
      }[]
    }[]
  }
}

interface FaqDetailProps {
  faqDetail?: {
    faq?: {
      id: number
      faqCategoryLargeId: number
      faqCategoryMiddleId: number
      question: string
      answer: string
    }
    categoryLarge?: {
      id: number
      name: string
      priority: number
      categoriesMiddle?: {
        id: number
        name: string
        faqCategoryLargeId: number
        priority: number
        faqs: {
          id: number
          faqCategoryLargeId: number
          faqCategoryMiddleId: number
          question: string
          answer: string
        }[]
      }[]
    }
  }
}

function FaqList({ category }: FaqListProps) {
  const theme = useTheme()
  const [currentExpanded, setCurrentExpanded] = useState<number>()

  function handleExpandChange(isExpanded: boolean, subCategoryId: number) {
    if (isExpanded) {
      setCurrentExpanded(subCategoryId)
      return
    }
    setCurrentExpanded(0)
  }

  return (
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
      {category?.categoriesMiddle?.map((subCategory) => (
        <FaqAccordion
          key={subCategory?.id}
          title={subCategory?.name}
          questionList={subCategory?.faqs}
          onChange={(isExpanded: boolean) =>
            handleExpandChange(isExpanded, subCategory.id)
          }
          expanded={currentExpanded === subCategory.id}
        />
      ))}
    </div>
  )
}

function FaqDetail({ faqDetail }: FaqDetailProps) {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const router = useRouter()
  const { updateLayoutSetting } = useLayoutContext()

  const onBackFn = () => {
    return window.history.length > 2 ? router.back() : router.push('/faq')
  }

  useEffect(() => {
    updateLayoutSetting({
      backgroundColor: theme.palette.canvas.light,
      title: t('1'),
      isShowTitleOnHeaderMobile: true,
      onBack: onBackFn
    })
  }, [])

  return (
    <>
      <HeadSeo
        description={t('5') + faqDetail?.faq?.question + ' ' + t('8')}
        title={faqDetail?.faq?.question + ' | ' + t('6')}
        keywords={t('7')}
      />
      <GgjHiddenH1 text={faqDetail?.faq?.question}/>

      <div
        css={css`
          background-color: ${theme.palette.canvas.light};
          padding: 24px 0 230px 0;
          max-width: 1080px;
          @media (min-width: ${theme.breakpoints.values.md}px) {
            padding: 24px 0 296px 0;
          }
          @media (min-width: ${theme.breakpoints.values.lg}px) {
            padding: 24px 0 300px 0;
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
        <div>
          <div
            css={css`
              background-color: ${theme.palette.primary.main};
              color: white;
              height: 24px;
              width: 24px;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 12px;
              margin-bottom: 8px;
            `}
          >
            Q
          </div>

          <Typography
            css={css`
              font-weight: 500;
            `}
            component="h2"
            variant="body1"
          >
            {faqDetail?.faq?.question}
          </Typography>

          <div
            css={css`
              background-color: ${theme.palette.ruby.main};
              color: white;
              height: 24px;
              width: 24px;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 12px;
              margin-top: 24px;
              margin-bottom: 8px;
            `}
          >
            A
          </div>

          <Typography
            css={css`
              margin-bottom: ${theme.spacing(6)};
              display: block;
            `}
            component="h2"
            variant="body1"
            dangerouslySetInnerHTML={{ __html: faqDetail?.faq?.answer || '' }}
          />

          <Typography
            component="h3"
            css={css`
              color: ${theme.palette.primary.main};
              font-weight: 500;
              margin-bottom: ${theme.spacing(3)};
            `}
            variant="subtitle1"
          >
            {faqDetail?.categoryLarge?.name}
          </Typography>

          <FaqList category={faqDetail?.categoryLarge} />

          <div
            css={css`
              border-top: 1px solid ${theme.palette.smoke.light};
              border-bottom: 1px solid ${theme.palette.smoke.light};
              padding: 25px 0 27px 0;
              margin: 48px 0 0 0;
            `}
          >
            <Typography
              css={css`
                text-align: center;
                font-weight: 500;
              `}
              variant="body1"
            >
              {t('2')}
            </Typography>

            <Typography
              css={css`
                text-align: center;
              `}
              variant="subtitle1"
            >
              {t('3')}
            </Typography>

            <FormControl fullWidth>
              <Link href={'/inquiry'} passHref>
                <Button
                  component="a"
                  variant="outlined"
                  css={css`
                    width: 288px;
                    margin: 26px auto 0 auto;
                    font-size: 14px;
                  `}
                >
                  <MailOutlinedIcon
                    htmlColor={theme.palette.primary.main}
                    css={css`
                      margin-right: 8px;
                    `}
                    sx={{
                      fontSize: theme.spacing(4),
                    }}
                  />
                  {t('4')}
                </Button>
              </Link>
            </FormControl>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({
  req,
  query,
}: {
  req: NextRequest
  query: {
    id: string
  }
}) {
  if(!+query?.id) {
    return {
      notFound: true,
    }
  }

  const { data } = await getFaqDetail(query?.id)
  if (data.error === AppError.ECB404) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      ...(await ggjServerSideTranslations(req, nsTran, nsTranInquiryLayout)),
      faqDetail: data?.data || {},
    },
  }
}

export default FaqDetail
FaqDetail.Layout = InquiryLayout
