import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextRequest } from 'next/server'

export async function ggjServerSideTranslations(
  req: NextRequest,
  ns: string[] | string
) {
  if (typeof ns == 'string') {
    ns = [ns]
  }
  // add common i18n
  ns.push('common@footer', 'common@header', 'common@common-head', 'common@common-error')
  return serverSideTranslations('ja', ns)
}
