import { css } from '@emotion/react'
import {Typography, useTheme} from '@mui/material'
import http, { appendGgjHeader } from 'common/http'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { nsTranSurfaceLayout, SurfaceLayout } from 'components/layouts'
import { ITermData } from 'components/pages/terms/Content'
import Heading from 'components/pages/terms/Heading'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { NextRequest } from 'next/server'
import React from 'react'

const Tokushou = ({ data }: { data: ITermData }) => {
  const { t } = useTranslation(nsTranSurfaceLayout)
  const theme = useTheme()
  const h2Css = css`
    position: absolute;
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(0px 0px 99.9% 99.9%);
    overflow: hidden;
    height: 1px;
    width: 1px;
    padding: 0;
    border: 0;
  `

  return (
    <>
      <Head><title>{t('tokushou')}</title></Head>
      <Heading title={data.title} showTitle={true} />
      <Typography component="h2" css={h2Css}>{t('tokushou')}</Typography>

      <div
        css={css`
          a {
            color: ${theme.palette.primary.main};
            text-decoration: none;
          }
        `}
        dangerouslySetInnerHTML={{
          __html: data.content,
        }}
      ></div>
    </>
  )
}

export async function getServerSideProps({ req }: { req: NextRequest }) {
  const data = await http.get('/api/skijan/v1/tokushou/18647', {
    headers: appendGgjHeader({ req }),
  })
  return {
    props: {
      data: data.data.data,
      ...(await ggjServerSideTranslations(req, nsTranSurfaceLayout)),
    },
  }
}

export default Tokushou
Tokushou.Layout = SurfaceLayout
