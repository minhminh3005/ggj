import { css } from '@emotion/react'
import { ChevronRight } from '@mui/icons-material'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import BackButton from 'components/common/BackButton'
import { useTranslation } from 'next-i18next'
import getConfig from 'next/config'
import Link from 'next/link'
import { NextRequest } from 'next/server'
import { sw } from 'store'
import Head from 'next/head'

const nsTran = 'components@others'
const { publicRuntimeConfig: { ACCOUNT_HOST_URL } } = getConfig()

function OtherMenuItem({title, url} : {title: string, url: string}) {
  const theme = useTheme()
  return (
    <>
      <Link href={url} passHref>
        <Button
          fullWidth
          css={css`
            color: ${theme.palette.text.primary};
            padding: ${theme.spacing(3)};
            height: ${theme.spacing(6)};
            &:hover {
              background: ${theme.palette.grey[50]};
            }
            &:focus {
              background: ${theme.palette.grey[50]};
            }
          `}
        >
          <Stack direction="row" justifyContent="space-between" css={css` width: 100%;`}>
            <Typography variant="body1">{title}</Typography>
            <ChevronRight />
          </Stack>
        </Button>
      </Link>
      <Divider css={css`
        display: none;
        @media (min-width: ${theme.breakpoints.values.md}px) {
          display: block;
        }
      `}/>
    </>
  )
}


export default function Others() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const otherList = [
    {
      title: t('2'),
      url: '/others/withdrawal'
    },
    {
      title: t('3'),
      url: `${ACCOUNT_HOST_URL}/logout`
    },
  ]
  return (
    <>
      <Head>
        <title>{t('meta-title')}</title>
        <meta name="description" content={t('meta-description')} />
        <meta name="keywords" content={t('meta-kw')} />
      </Head>
      <Box>
        <BackButton />
        <Typography variant="h5" mb={3} mt={2} fontWeight={theme.typography.fontWeightMedium} >{t('1')}</Typography>
        {otherList.map(item =>
          <OtherMenuItem key={item.title} title={item.title} url={item.url} />
        )}
      </Box>
    </>
  )
}


export const getServerSideProps = sw.getServerSideProps(() => async ({ req }) => {
  const props = {
    props: {
      ...await ggjServerSideTranslations(req as unknown as NextRequest, [nsTran]),
    },
  }
  return { ...props }
})
