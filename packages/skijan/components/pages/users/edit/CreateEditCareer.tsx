import React, {useEffect, useState} from 'react'
import { css } from '@emotion/react'
import {Checkbox, FormControlLabel, FormGroup, Stack, Typography} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { FormProvider, useForm } from 'react-hook-form'
import GgjInputCountText from 'components/commons/GgjInputCountText'
import ButtonGroupForm from './ButtonGroupForm'
import DropdownYearAndMonth from './DropdownYearAndMonth'
import {
  actions,
  createItem,
  IUserCareer,
  ns,
  updateItem
} from '../../../../store/usersSlice'
import {useAppDispatch, useAppSelector} from '../../../../store/hooks'
import {loadingOffHandler, loadingOnHandler} from '../../../../contexts/LoadingContext'
import {toastHandler} from '../../../../contexts/ToastContext'
import {useTranslation} from 'next-i18next'
import {nsUserProfile} from '../../../../common/constant'
interface IFormValues {
  company: string
  job: string
  description: string
  fromYear: number
  fromMonth: number
  toYear: number
  toMonth: number
}

// MAIN
function CreateEditCareer () {
  const theme = useTheme()
  const methods = useForm<IFormValues>({reValidateMode: 'onSubmit'})
  const dataItem: IUserCareer = useAppSelector((state) => state[ns]?.editItem)
  const settingMode = useAppSelector(state => state[ns]?.settingMode)
  const {t} = useTranslation(nsUserProfile)
  const dispatch = useAppDispatch()
  const [checked, setChecked] = useState(false)
  const onSubmit = async ({company, job, description, fromYear, fromMonth, toYear, toMonth}: IFormValues) => {
    const body = {
      belong: company.trim(),
      job: job.trim(),
      from: Number(fromYear.toString() + fromMonth.toString().padStart(2, '0')),
      to: checked ? 0 : Number(toYear.toString() + toMonth.toString().padStart(2, '0')),
      detail: description
    }
    try{
      loadingOnHandler()
      const res = dataItem.id == undefined ? await createItem(settingMode, body) : await updateItem(dataItem.id,settingMode, body)
      if(res.error){
        toastHandler({type: 'error'})
        return
      }
      dispatch(actions.setCareers(res.data))
      dispatch(actions.setShowEditForm(false))
      // toastHandler({
      //   type: 'success',
      //   message: dataItem.id == 0 ? t('create-career-success') : t('update-career-success')
      // })
    }catch (e) {
      toastHandler({type: 'error'})
    }finally {
      loadingOffHandler()
    }
  }

  useEffect(()=>{
    methods.setValue('company', dataItem.belong)
    methods.setValue('job', dataItem.job)
    methods.setValue('description', dataItem.detail)
    if(dataItem.from) {
      methods.setValue('fromYear', Number(dataItem.from.toString().slice(0,4)))
      methods.setValue('fromMonth', Number(dataItem.from.toString().slice(-2)))
    }
    if(dataItem.to) {
      methods.setValue('toYear', Number(dataItem.to.toString().slice(0,4)))
      methods.setValue('toMonth', Number(dataItem.to.toString().slice(-2)))
    }
  },[dataItem])

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} action=''>
        <Stack
          css={css`
            background: ${theme.palette.canvas.light};
            border: solid 1px #cccccc;
            border-radius: 7px;
            padding: ${theme.spacing(4)};
          `}
          mb={5}
        >
          <GgjInputCountText name="company" errorText={t('53')} rules={{maxLength: 50, required: true, validate: (data) => {
            return Boolean(data.trim().length)
          }}} placeholder={t('affi-name-placeholder')} />
          <GgjInputCountText name="job" errorText={t('54')} rules={{maxLength: 50}} placeholder={t('job-placeholder')} cssInput={css`margin-top: 12px`}/>
          <Stack direction="column" spacing={3} mt={4} mb={5}>
            <Stack direction="row" alignItems="center" spacing={5}>
              <Typography variant="body2" css={css`color: ${theme.palette.jade.light}`}>{t('12')}</Typography>
              <FormGroup>
                <FormControlLabel
                  css={css`
                  .MuiFormControlLabel-label {
                    font-size: 12px;
                    color: ${theme.palette.jade.light};
                  }
                `}
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setChecked(event.target.checked)
                      }}
                    />
                  }
                  label={`${t('66')}`}
                />
              </FormGroup>
            </Stack>
            <DropdownYearAndMonth name="from" isDisabled={false}/>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" css={css`color: ${theme.palette.jade.light}`}>～</Typography>
              <DropdownYearAndMonth name="to" isDisabled={checked}/>
            </Stack>
          </Stack>
          <GgjInputCountText name="description" errorText={t('55')} rules={{maxLength: 200}} isMultiline={true} rows={4} placeholder={t('explain-placeholder')} />
          <ButtonGroupForm />
        </Stack>
      </form>
    </FormProvider>
  )
}

export default React.memo(CreateEditCareer)
