import { Stack, Typography } from '@mui/material'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { dateFormat, formatDate } from 'common/date'
import { ItemProps } from 'pages/information'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
const nsTran = 'surface@information'
interface InformationDetailCommonProps {
  type: 'information' | 'notification';
  data: ItemProps;
}
const InformationDetailCommon: React.FC<InformationDetailCommonProps> = ({type, data}) => {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  return (
    <section>
      <Link href={type === 'notification' ? '/notification' : '/information'}>
        <a
          css={css`
            width: 100%;
            text-decoration: none;
            cursor: pointer;
            @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
              display: none;
            }`}>
        </a>
      </Link>
      <Stack css={css`
        width: 100%;
        margin: 0;
        padding: 0;
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          max-width: 670px;
          margin: 0 auto;
        }
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          max-width: 1032px;
          padding: 0 16px 20px 16px;
        }`}>
        <Typography
          css={css`
            color: ${theme.palette.jade.dark};
            font-weight: 500;
            overflow: hidden;
            word-break: break-all;
            margin: 24px 0 16px 0;`} variant="subtitle1">
          {data?.title || ''}
        </Typography>
        <Stack justifyContent="flex-start" alignItems="center" direction="row">
          <Typography css={css`color: ${theme.palette.jade.dark};`} variant="subtitle1">{formatDate(data?.publishedAt, dateFormat)}</Typography>
          <span
            css={css`margin: 0 4px;`}>
          -
          </span>
          <Typography className='ggj-wt' css={css`color: ${theme.palette.jade.dark};`} variant="subtitle1">{t('11')}</Typography>
        </Stack>
        <div
          css={css`
          border-top: 1px solid ${theme.palette.smoke.light};
          margin: 8px 0 12px 0;`}></div>
        <Typography component='div' dangerouslySetInnerHTML={{__html:data?.content || ''}} css={css`
        color: ${theme.palette.jade.dark};
        width: 100%;`} variant="subtitle1"/>
        <Link href='/' passHref>
          <a css={css`
          margin-top: 24px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
          color: ${theme.palette.primary.main};
          text-decoration: none;`}>
            {t('9')}
            <ArrowForwardIosIcon css={css`
            margin: 0.25rem 0 0 0.25rem;
            font-size: 1rem;`} />
          </a>
        </Link>
      </Stack>
    </section>
  )
}
export default InformationDetailCommon