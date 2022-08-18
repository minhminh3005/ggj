import {
  Divider
} from '@mui/material'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import MenuCardsBox from 'components/pages/index/MenuCards'
import ModalConfirmUpload from 'components/pages/index/ModalConfirmUpload'
import PrivacyCardsContainer from 'components/pages/index/PrivacyCards'
import ReferenceCardsBox from 'components/pages/index/ReferrenceCards'
import UserInfo from 'components/pages/index/UserInfo'
import HeadIndex from 'components/pages/index/HeadIndex'
import type { NextRequest } from 'next/server'
import { useEffect } from 'react'
import { reducerManager, sw } from 'store'
import slice, { getApi, nsIndex } from 'store/indexSlice'

// Const
const nsTran = 'components@index'


// Page Container
function Index() {
  reducerManager.add(slice)
  useEffect(() => {
    return function () {
      reducerManager.remove(nsIndex)
    }
  }, [])

  return (
    <>
      <HeadIndex />
      <UserInfo />
      <Divider />
      <PrivacyCardsContainer />
      <MenuCardsBox />
      <ReferenceCardsBox />
      <ModalConfirmUpload />
    </>
  )
}

export const getServerSideProps = sw.getServerSideProps((store) => async ({ req }) => {
  reducerManager.add(slice)
  const props = {
    props: {
      ...await ggjServerSideTranslations(req as unknown as NextRequest, [nsTran]),
    },
  }
  await store.dispatch(getApi(req as unknown as NextRequest))
  return { ...props }
})

export default Index
