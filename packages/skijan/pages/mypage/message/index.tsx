import {MypageTransactionLayout,  nsMypageTransactionLayout} from 'components/layouts'
import {ggjServerSideTranslations} from 'common/i18nUtils'
import {NextRequest} from 'next/server'
import {reducerManager, sw} from 'store/store'
import slice, {actions, ns} from 'store/messageSlice'
import {useEffect, useMemo} from 'react'
import {NoSsr, Stack, useMediaQuery, useTheme} from '@mui/material'
import {
  nsTran,
  LeftMenu,
  HeaderInfo,
  ChatPanel,
  HeaderChatPanelEmpty
} from 'components/pages/mypage/message'
import {useLayoutContext} from '../../../contexts/LayoutContext'
import { TransactionType } from 'components/pages/mypage/transaction'

const WrapperChatPanel = () => {
  const theme = useTheme()
  const breakPoint = useMediaQuery(`(max-width:${theme.breakpoints.values.lg - 1}px)`)
  const isMobileOrTablet = useMemo(() => breakPoint, [breakPoint])
  if (isMobileOrTablet) return <LeftMenu />
  return (
    <>
      <LeftMenu cssStr={`margin-right:${theme.spacing(4)}; height: calc(100vh - 255px);`}/>
      <ChatPanel>
        <HeaderChatPanelEmpty/>
      </ChatPanel>
    </>
  )
}

export default function IndexPage() {
  const {updateLayoutSetting} = useLayoutContext()
  reducerManager.add(slice)
  useEffect(() => {
    updateLayoutSetting({
      maxWidth: 1560
    })
    return function () {
      reducerManager.remove(ns)
    }
  }, [])

  return (
    <NoSsr>
      <HeaderInfo/>
      <Stack direction={'row'} >
        <WrapperChatPanel/>
      </Stack>
    </NoSsr>
  )
}

IndexPage.Layout = MypageTransactionLayout

//TODO - Minh: Remove redirect after current phase
export const getServerSideProps = sw.getServerSideProps((store) => async ({req}) => {
  return {
    redirect: {
      destination: '/mypage',
      permanent: false,
    },
  }
  reducerManager.add(slice)
  const [_nextI18Next] = await Promise.all([
    ggjServerSideTranslations(req as unknown as NextRequest, [nsTran], nsMypageTransactionLayout),
    // getEmailAddressFromApi(req as unknown as NextRequest),
  ])

  store.dispatch(actions.setListMessageRoom([]))
  store.dispatch(actions.setCurrentMode(TransactionType.Message))

  const props = {
    props: {
      ..._nextI18Next,
    },
  }

  return {...props}
})
