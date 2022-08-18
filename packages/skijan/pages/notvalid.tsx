
import {NextRequest} from 'next/server'
import { SurfaceLayout, nsTranSurfaceLayout } from 'components/layouts'
import {ggjServerSideTranslations} from '../common/i18nUtils'
import {useTranslation} from 'next-i18next'
import getConfig from 'next/config'
import {useTheme} from '@mui/material/styles'
import {useMemo} from 'react'
import { getInvalidUrl } from '../common/url'
import Link from 'next/link'
import {Stack, Typography} from '@mui/material'
import {css} from '@emotion/react'
import GgjCommonHead from '../components/commons/GgjCommonHead'
import {ParsedUrlQuery} from 'querystring'
import {GgjContainButton} from '../components/commons/GgjButton'

const nsTran = 'surface@notvalid'

const LoginButton = ({urlQuery}:{urlQuery:  string}) => {
  const {t} = useTranslation(nsTranSurfaceLayout)
  const linkUrl = getInvalidUrl('logout', urlQuery)
  return (
    <div css={css`margin-top: 36px !important;`}>
      <Link href={linkUrl} passHref>
        <GgjContainButton
          cssStr={'width:220px; '}
        >{t('LoginButtons-1')}</GgjContainButton>
      </Link>
    </div>
  )
}

export default function NotValid({urlQuery}:{urlQuery:  string }) {
  const theme = useTheme()
  const {t} = useTranslation(['common@common-error', nsTran])
  const headData = useMemo(() => ({
    title: t('title',{ns:nsTran}),
    description: t('description',{ns:nsTran}),
    keywords: t('keywords',{ns:nsTran}),
  }), [])

  return (
    <>
      <GgjCommonHead data={headData} />
      <Stack spacing={3} justifyContent="center" alignItems="center" css={css`
  width: 100%;
  height: 54vh;
  padding: 0 16px;
  @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
    padding: unset;
  }`}>
        <Typography  variant='h5' css={css`font-size: 3rem`}>Oops!</Typography>
        <Typography  variant='body1'>{t('try-again')}</Typography>
        <LoginButton urlQuery={urlQuery}  />
      </Stack>
    </>
  )
}

export async function getServerSideProps({query, req}:{query: ParsedUrlQuery,req: NextRequest}) {
  const { publicRuntimeConfig: { ACCOUNT_HOST_URL } } = getConfig()
  // @ts-ignore
  const refHeader = req.headers['referer'] || ''
  const urlQuery = query?.u || ''
  if(refHeader !== (ACCOUNT_HOST_URL + '/')) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }
  return {
    props: {
      urlQuery: urlQuery,
      ...await ggjServerSideTranslations(req as unknown as NextRequest, ['common@common-error',nsTran],nsTranSurfaceLayout),
    },
  }
}

NotValid.Layout = SurfaceLayout
