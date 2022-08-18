import React, {useEffect} from 'react'
import {css} from '@emotion/react'
import {useTheme} from '@mui/material/styles'
import {
  Stack,
  useMediaQuery,
} from '@mui/material'
import {
  FormProvider,
  useForm,
} from 'react-hook-form'
import UserAvatar from './UserAvatar'
import ButtonForm from './ButtonForm'
import GgjInputCountText from 'components/commons/GgjInputCountText'
import {actions, IUserSelfIntro, ns, updateIntro} from '../../../../store/usersSlice'
import {useAppDispatch, useAppSelector} from '../../../../store/hooks'
import {loadingOffHandler, loadingOnHandler} from '../../../../contexts/LoadingContext'
import {toastHandler} from '../../../../contexts/ToastContext'
import {ns as commonNs} from '../../../../store/appSlice'
import {useTranslation} from 'next-i18next'
import {nsUserProfile} from '../../../../common/constant'

interface IFormValues {
  title: string
  content: string
}

// MAIN
function Intro() {
  const theme = useTheme()
  const {t} = useTranslation(nsUserProfile)
  const methods = useForm<IFormValues>({reValidateMode: 'onSubmit'})
  const isDesktop = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const height = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`) ? 335 : 435
  const userSelfIntroduce: IUserSelfIntro = useAppSelector((state) => state[ns]?.userSelfIntroduce)
  const userId = useAppSelector(state => state[commonNs].auth.userId)
  const dispatch = useAppDispatch()

  useEffect(()=>{
    methods.setValue('title', userSelfIntroduce.title || '')
    methods.setValue('content', userSelfIntroduce.content || '')
  },[])

  const onSubmit = async ({title, content}: IFormValues) => {
    loadingOnHandler()
    try {
      const res = await updateIntro(userId, {title: title, content: content})
      if (res.error) {
        toastHandler({type: 'error'})
        return
      }
      dispatch(actions.setUserSelfIntroduce({
        ...userSelfIntroduce,
        title: res.data.title.trim(),
        content: res.data.content.trim()
      }))
      // toastHandler({type: 'success', message: t('update-intro-success')})
    } catch (e) {
      toastHandler({type: 'error'})
    } finally {
      loadingOffHandler()
    }
  }

  return (
    <FormProvider {...methods}>
      {!isDesktop && <div css={css`margin-bottom: 16px`}><UserAvatar/></div>}
      <form onSubmit={methods.handleSubmit(onSubmit)} action="">
        <Stack spacing={2}>
          <GgjInputCountText
            name="title"
            rules={{maxLength: 50}}
            placeholder={t('26')}
            defaultValue={userSelfIntroduce.title ? userSelfIntroduce.title : t('intro-title')}
          />
          <GgjInputCountText
            name="content"
            rules={{maxLength: 2000}}
            isMultiline={true}
            placeholder={t('27')}
            defaultValue={userSelfIntroduce.content}
            cssInput={css`
              padding: 0;
              background: #fff;
              font-size: 14px;
              border-radius: 7px;
              border: #cccccc;
              color: ${theme.palette.jade.light};

              .MuiOutlinedInput-input {
                height: calc(100vh - ${height}px) !important;
              }
            `}
          />
        </Stack>
        <ButtonForm/>
      </form>
    </FormProvider>
  )
}

export default React.memo(Intro)
