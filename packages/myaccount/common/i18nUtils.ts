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
  ns.push('common@common-layout')

  // temple disable multi lang, hardcode ja when translate
  // return serverSideTranslations(/*req.cookies.lang || */ 'ja', ns)
  return serverSideTranslations('ja', ns)
}
