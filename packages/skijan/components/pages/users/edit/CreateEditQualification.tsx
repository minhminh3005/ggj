import React, {useEffect} from 'react'
import { css } from '@emotion/react'
import { Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { FormProvider, useForm } from 'react-hook-form'
import GgjInputCountText from 'components/commons/GgjInputCountText'
import ButtonGroupForm from './ButtonGroupForm'
import DropdownYearAndMonth from './DropdownYearAndMonth'
import {actions, createItem, IUserQualification, ns, updateItem} from '../../../../store/usersSlice'
import {useAppDispatch, useAppSelector} from '../../../../store/hooks'
import {loadingOffHandler, loadingOnHandler} from '../../../../contexts/LoadingContext'
import {toastHandler} from '../../../../contexts/ToastContext'
import {useTranslation} from 'next-i18next'
import {nsUserProfile} from '../../../../common/constant'

interface IFormValues {
  name: string
  qualificationMonth: number
  qualificationYear : number
}

// MAIN
function CreateEditQualification () {
  const theme = useTheme()
  const methods = useForm<IFormValues>({reValidateMode: 'onSubmit'})
  const dataItem :IUserQualification = useAppSelector(state => state[ns]?.editItem)
  const settingMode = useAppSelector(state => state[ns]?.settingMode)
  const dispatch = useAppDispatch()
  const {t} = useTranslation(nsUserProfile)
  const onSubmit = async ({name, qualificationMonth, qualificationYear}: IFormValues) => {
    const body = {
      name: name.trim(),
      qualificationMonth: Number(qualificationMonth),
      qualificationYear: Number(qualificationYear)
    }
    try {
      loadingOnHandler()
      const res = dataItem.id == undefined ? await createItem(settingMode, body) : await updateItem(dataItem.id, settingMode, body)
      if (res.error) {
        toastHandler({type: 'error'})
        return
      }
      dispatch(actions.setQualifications(res.data))
      dispatch(actions.setShowEditForm(false))
      // toastHandler({
      //   type: 'success',
      //   message: dataItem.id == 0 ? t('create-qualification-success') : t('update-qualification-success')
      // })
    }catch (e) {
      toastHandler({type: 'error'})
    }finally {
      loadingOffHandler()
    }
  }

  useEffect(()=>{
    methods.setValue('name', dataItem.name)
    methods.setValue('qualificationMonth', dataItem.qualificationMonth)
    methods.setValue('qualificationYear', dataItem.qualificationYear)
  },[dataItem])

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} action=''>
        <Stack
          css={css`
            background: ${theme.palette.canvas.light};
            border: solid 1px #cccccc;
            border-radius: 3px;
            padding: ${theme.spacing(4)};
          `}
          mb={5}
        >
          <GgjInputCountText errorText={t('56')} name="name" rules={{maxLength: 50, required: true, validate: (data) => {
            return Boolean(data.trim().length)
          }}} placeholder={t('affi-name-placeholder')} cssInput={css`border-radius: 3px`} />
          <Stack direction="column" spacing={2} mt={2} mb={3}>
            <Typography variant="body2" css={css`color: ${theme.palette.jade.light}`}>{t('57')}</Typography>
            <DropdownYearAndMonth name="qualification" isDisabled={false}/>
          </Stack>
          <ButtonGroupForm />
        </Stack>
      </form>
    </FormProvider>
  )
}

export default React.memo(CreateEditQualification)
