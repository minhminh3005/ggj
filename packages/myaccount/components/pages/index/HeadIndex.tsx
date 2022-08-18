import Head from 'next/head'
import { useTranslation } from 'next-i18next'
const nsTran = 'components@index'

const HeadIndex = () => {
  const { t } = useTranslation(nsTran)
  return (
    <Head>
      <title>{t('meta-title')}</title>
      <meta name="description" content={t('meta-description')} />
      <meta name="keywords" content={t('meta-kw')} />
    </Head>
  )
}

export default HeadIndex
