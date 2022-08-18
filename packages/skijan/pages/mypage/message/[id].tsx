import {
  MypageTransactionDetailLayout,
  nsMypageTransactionDetailLayout,
} from 'components/layouts'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { NextRequest } from 'next/server'
import { reducerManager, sw } from 'store/store'
import slice, { actions, ns } from 'store/messageSlice'
import {
  slice as imageViewerSlice,
  ns as nsImageViewer,
  GgjChatImageViewer,
} from 'components/commons/GgjChatImageViewer'
import { useEffect, useMemo } from 'react'
import { NoSsr, Stack, useMediaQuery, useTheme } from '@mui/material'
import {
  nsTran,
  ChatPanel,
  ContentChatPanel,
  HeaderInfo,
  LeftMenu,
  HeaderChatPanel,
  ChatControlPanel
} from 'components/pages/mypage/message'
import { useLayoutContext } from '../../../contexts/LayoutContext'
import { css } from '@emotion/react'
import { TransactionType } from 'components/pages/mypage/transaction'

const WrapperHeaderInfo = () => {
  const theme = useTheme()
  const breakPoint = useMediaQuery(
    `(max-width:${theme.breakpoints.values.lg - 1}px)`
  )
  const isMobileOrTablet = useMemo(() => breakPoint, [breakPoint])
  if (isMobileOrTablet) return null
  return <HeaderInfo />
}

export default function IndexPage({id}: {id: number}) {
  const { updateLayoutSetting } = useLayoutContext()
  const theme = useTheme()
  reducerManager.add([slice, imageViewerSlice])
  useEffect(() => {
    updateLayoutSetting({
      maxWidth: 1560,
    })
    return function () {
      reducerManager.remove([ns, nsImageViewer])
    }
  }, [])

  return (
    <NoSsr>
      <WrapperHeaderInfo />
      <Stack
        direction={'row'}
        css={css`
          position: relative;
        `}
      >
        <LeftMenu
          cssStr={`margin-right:${theme.spacing(
            4
          )}; height: calc(100vh - 255px);`}
          roomId={id}
        />
        <ChatPanel>
          <HeaderChatPanel/>
          <ContentChatPanel/>
          <ChatControlPanel masterId={1} createMessageUrl="" uploadFileUrl="" />
        </ChatPanel>
        <GgjChatImageViewer />
      </Stack>
    </NoSsr>
  )
}

IndexPage.Layout = MypageTransactionDetailLayout

//TODO - Minh: Remove redirect after current phase
export const getServerSideProps = sw.getServerSideProps(
  (store) =>
    async ({ req , query}) => {
      return {
        redirect: {
          destination: '/mypage',
          permanent: false,
        },
      }
      const {id} = query
      reducerManager.add(slice)
      const [_nextI18Next] = await Promise.all([
        ggjServerSideTranslations(
          req as unknown as NextRequest,
          [nsTran],
          nsMypageTransactionDetailLayout
        ),
      ])
      store.dispatch(actions.setListMessageRoom([]))
      store.dispatch(actions.setCurrentMode(TransactionType.Message))

      const props = {
        props: {
          ..._nextI18Next,
          id: Number(id)
        },
      }

      return { ...props }
    }
)
