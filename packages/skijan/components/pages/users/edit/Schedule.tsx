import React, {useEffect} from 'react'
import {css} from '@emotion/react'
import {useTheme} from '@mui/material/styles'
import {Stack, useMediaQuery} from '@mui/material'
import {FormProvider, useForm} from 'react-hook-form'
import UserAvatar from './UserAvatar'
import ButtonForm from './ButtonForm'
import GgjInputCountText from 'components/commons/GgjInputCountText'
import {loadingOffHandler, loadingOnHandler} from '../../../../contexts/LoadingContext'
import {useAppDispatch, useAppSelector} from '../../../../store/hooks'
import {actions, IUserSelfIntro, ns, updateSchedule} from '../../../../store/usersSlice'
import {toastHandler} from '../../../../contexts/ToastContext'
import {useTranslation} from 'next-i18next'
import {ns as commonNs} from '../../../../store/appSlice'
import {nsUserProfile} from '../../../../common/constant'
import {SCHEDULE} from './const'

interface IFormValues {
  schedule: string
}

// MAIN
function Schedule() {
  //TODO Minh: Fix Translation
  const theme = useTheme()
  const {t} = useTranslation(nsUserProfile)
  const methods = useForm<IFormValues>({reValidateMode: 'onSubmit'})
  const isDesktop = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const height = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`) ? 262 : 362
  const userSelfIntroduce: IUserSelfIntro = useAppSelector((state) => state[ns]?.userSelfIntroduce)
  const userId = useAppSelector(state => state[commonNs].auth.userId)
  const dispatch = useAppDispatch()

  const onSubmit = async ({schedule}: IFormValues) => {
    loadingOnHandler()
    const bodySchedule = schedule ? schedule.trim() : ''
    try {
      const res = await updateSchedule(userId, bodySchedule)
      if (res.error) {
        toastHandler({type: 'error'})
        return
      }
      dispatch(actions.setUserSelfIntroduce({
        ...userSelfIntroduce,
        schedule: res.data.schedule.trim()
      }))
      toastHandler({type: 'success', message: t('update-schedule-success')})
    } catch (e) {
      toastHandler({type: 'error'})
    } finally {
      loadingOffHandler()
    }
  }

  useEffect(()=>{
    methods.setValue(SCHEDULE,userSelfIntroduce.schedule)
  },[])

  return (
    <FormProvider {...methods}>
      {!isDesktop && <div css={css`margin-bottom: 16px`}><UserAvatar/></div>}
      <form onSubmit={methods.handleSubmit(onSubmit)} action="">
        <Stack spacing={4}>
          <GgjInputCountText
            name="schedule"
            errorText={t('31')}
            rules={{maxLength: 2000}}
            isMultiline={true}
            defaultValue={userSelfIntroduce.schedule}
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
          <ButtonForm/>
        </Stack>
      </form>
    </FormProvider>
  )
}

export default React.memo(Schedule)
