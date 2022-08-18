import { Link, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { NextRequest } from 'next/server'
import { useTranslation } from 'next-i18next'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { roleError } from '../common/variables'
import getConfig from 'next/config'

const nsTran = 'gui@error'

function ErrorMultiId() {
  const router = useRouter()
  const { t } = useTranslation(nsTran)
  const errorCode = router.query.code
  const { publicRuntimeConfig } = getConfig()
  return (
    <Stack spacing={3}>
      <Typography variant="h5">{t(`${errorCode}-title`)}</Typography>
      <Typography variant="body1">{t(`${errorCode}-des`)}</Typography>
      <Link textAlign="right" href={publicRuntimeConfig.GOGO_HOST_URL+t(`${errorCode}-linkUrl`)}>
        {t(`${errorCode}-linkTitle`)}
      </Link>
    </Stack>
  )
}


export async function getServerSideProps({req,query}: {req: NextRequest, query: {[index: string]: unknown}}) {
  if (!roleError.includes(query['code'] as string)) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      ...await ggjServerSideTranslations(req, [nsTran]),
    },
  }
}

export default ErrorMultiId
