import {NextRequest} from 'next/server'
import {ggjServerSideTranslations} from 'common/i18nUtils'
import {nsTranSurfaceUserLayout, SurfaceUsersLayout} from 'components/layouts'
import AvatarArea from 'components/pages/users/AvatarArea'
import View from 'components/pages/users/View'
import Edit from 'components/pages/users/Edit'
import {useAppSelector} from 'store/hooks'
import usersSlice, {
  ns,
  actions,
  getUserInfo,
} from 'store/usersSlice'

import {css} from '@emotion/react'
import {useTheme} from '@mui/material/styles'
import React, {useEffect, useMemo} from 'react'
import {nsTranUploadImages} from 'components/commons/GgjUploadImagesOrYoutube'
import {nsTranUploadFiles} from 'components/commons/GgjUploadImagesOrFiles'
import CommonDialog from 'components/pages/users/edit/CommonDialog'
import {nsNavBarComp} from 'components/layouts/common/NavBar'
import {reducerManager, sw} from '../../store/store'
import {nsCommonCategories} from '../../common/categories'
import { AppError } from 'app.d'
import {nsUserProfile} from '../../common/constant'
import {nsGgjFavoriteButton} from 'components/commons/GgjFavoriteButton'
import {EDIT, VIEW} from '../../components/pages/users/edit/const'
import {ggjReviewBoxI18nNs as ggjReviewBoxNs} from 'components/commons/GgjReviewBox'
import {useTranslation} from 'next-i18next'
import GgjCommonHead from '../../components/commons/GgjCommonHead'
import GgjHiddenH1 from 'components/commons/GgjHiddenH1'


const Users = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsUserProfile)

  const headData = useMemo(() => ({
    title: t('meta-title'),
    description: t('meta-description'),
    keywords: t('meta-keyword'),
  }), [])

  reducerManager.add(usersSlice)
  useEffect(() => {
    return function () {
      reducerManager.remove(ns)
    }
  }, [])

  const mode = useAppSelector((state) => state[ns]?.mode || VIEW)

  return (
    <>
      <GgjCommonHead data={headData} />
      <GgjHiddenH1 text={headData.title}/>

      <div
        css={css`
        padding-bottom: 76px;
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          padding: 0 16px;
        }
      `}
      >
        <AvatarArea/>
        {mode === EDIT ? <Edit/> : <View/>}
        <CommonDialog/>
      </div>
    </>
  )
}

export const getServerSideProps = sw.getServerSideProps(
  (store) =>
    async ({req, query: {id}}) => {
      reducerManager.add(usersSlice)
      const userId = store.getState().app.auth.userId
      store.dispatch(actions.setIsOwner(Boolean(Number(id) === userId)))

      const [_nextI18Next, data] = await Promise.all([
        ggjServerSideTranslations(req as unknown as NextRequest, [
          nsUserProfile,
          nsTranUploadImages,
          nsTranUploadFiles,
          nsCommonCategories,
          nsNavBarComp,
          nsGgjFavoriteButton, // using at 'components/pages/users/View'
          ...ggjReviewBoxNs,
        ], nsTranSurfaceUserLayout),
        getUserInfo(Number(id || ''))
      ])

      if(!data || data?.error === AppError.ECB001 || data?.error === AppError.ECB404) {
        return {
          notFound: true,
        }
      }
      store.dispatch(actions.setUserData(data.data))
      const props = {
        props: {
          ..._nextI18Next,
        },
      }

      return {...props}
    }
)

export default Users
Users.Layout = SurfaceUsersLayout
