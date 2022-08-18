import { Stack, Tooltip, Typography } from '@mui/material'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { NextRequest } from 'next/server'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { getAllGuideByID } from 'store/guideSlice'
import { InquiryLayout, nsTranInquiryLayout } from 'components/layouts'
import { AppError } from 'app.d'
import { useEffect, useMemo } from 'react'
import { useLayoutContext } from 'contexts/LayoutContext'
import { useRouter } from 'next/router'
import GgjCommonHead from '../../components/commons/GgjCommonHead'
import GgjHiddenH1 from 'components/commons/GgjHiddenH1'
const nsTran = 'surface@guide'
export interface GuideProps<T> {
  caption: T
  content: T
  id: number
  thumbnail: T
  title: T
}
const ContentComponent = ({text}: {text: string}) => {
  const theme = useTheme()
  return (
    <Tooltip placement="bottom-start" title={text}>
      <Typography
        className='ggj-wt ggj-wt-l-2'
        component="p"
        css={css`
        width: 100%;
        cursor: pointer;
        line-height: 20px;
        max-width: 124px;
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          max-width: 180px;
        }
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          max-width: 208px;
        }`} variant="subtitle2">
        {text}
      </Typography>
    </Tooltip>
  )
}
const GuideChildComponent = ({valuesChild}: {valuesChild: GuideProps<string>}) => {
  const theme = useTheme()
  const {id, caption, thumbnail, title} = valuesChild
  return (
    <Link href={`/guide/${id}`} >
      <a css={css`text-decoration: none;
      cursor: pointer;`}>
        <Stack
          justifyContent="center"
          alignItems="center"
          direction="column"
          css={css`
          width: 156px;
          margin-bottom: 16px;
          /* max-width: 240px; */
          max-width: 100%;
          background-color: #ffffff;
          height: 257px;
          padding: 0 16px 16px 16px;
          @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
            width: 212px;
          }
          @media only screen and (min-width: ${theme.breakpoints.values.lg+1}px) {
            width: 240px;
            margin-bottom: 24px;
          }`}>
          <img css={css`
              margin: 24px 0;
              width: 100px;
              height: 100px;
              object-fit: contain;
            `} src={`https://${thumbnail || ''}`} alt='SkjianGuide' />
          <Typography
            css={css`margin-bottom: 8px;`} variant="subtitle1" component="h3">
            {title}
          </Typography>
          <ContentComponent text={caption} />
        </Stack>
      </a>
    </Link>
  )
}
const Guide = ({data}: {data: GuideProps<string>[]}) => {
  const { t } = useTranslation(nsTran)
  const theme = useTheme()
  const router = useRouter()
  const {updateLayoutSetting} = useLayoutContext()
  const headData = useMemo(() => ({
    title: t('12'),
    description: t('14'),
    keywords: t('13'),
  }), [])

  useEffect(() => {
    updateLayoutSetting({
      title: t('1'),
      isShowTitleOnHeaderMobile: true,
      onBack: () => router.push('/')
    })
  }, [])
  return (
    <>
      <GgjCommonHead data={headData} />
      <GgjHiddenH1 />

      <section
        css={css`
        width: 100%;
        background-color: ${theme.palette.canvas.light};
        margin: 0 auto;
        max-width: 600px;
        padding: 16px 0 64px 0;
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          max-width: 960px;
          padding-top: 32px;
        }
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          max-width: 1080px;
          height: 100vh;
          padding: 24px 0;}`}>
        <Typography
          variant="h5"
          component="h2"
          css={css`
          justify-content: center;
          margin: 16px 0 24px 0;
          display: none;
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            display: unset;
          }`}>
          {t('1')}
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          css={css`
        margin: 8px 0 23px 0;
        line-height: 24px;
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          line-height: unset;
        }`}>
          {t('2')}
        </Typography>
        <Stack
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center"
          direction="row">
          {data &&
          data.length > 0 &&
          data.map((valuesChild) => {
            return (
              <GuideChildComponent
                key={valuesChild.id}
                valuesChild={valuesChild}
              />
            )
          })}
        </Stack>
      </section>
    </>
  )
}
export async function getServerSideProps({ req }: { req: NextRequest }) {
  const data  = await getAllGuideByID('')
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
export default Guide
Guide.Layout = InquiryLayout
