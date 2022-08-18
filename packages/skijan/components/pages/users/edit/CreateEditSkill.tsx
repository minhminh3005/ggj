import React, {useEffect} from 'react'
import {css} from '@emotion/react'
import {useTheme} from '@mui/material/styles'
import {FormControl, OutlinedInput, Stack, Typography} from '@mui/material'
import {
  Controller,
  FormProvider,
  RegisterOptions,
  useForm,
  useFormContext,
} from 'react-hook-form'
import GgjInputCountText from 'components/commons/GgjInputCountText'
import ButtonGroupForm from './ButtonGroupForm'
import {
  actions, createItem,
  IUserSkill,
  ns, updateItem,
} from '../../../../store/usersSlice'
import {useAppDispatch, useAppSelector} from '../../../../store/hooks'
import {useTranslation} from 'next-i18next'
import {loadingOffHandler, loadingOnHandler} from '../../../../contexts/LoadingContext'
import {toastHandler} from '../../../../contexts/ToastContext'
import {nsUserProfile} from '../../../../common/constant'
import {validNumber} from './const'

interface IFormValues {
  name: string
  note: string
  experienceYears: string
  experienceMonth: string
}

interface IFormInput {
  name: string,
  rules: Omit<RegisterOptions, 'maxLength'> & { maxLength: number }
  txt: string, // TODO: An - Remove after integrate gg sheet translate
}

const InputYearOrMonthOfExperience = ({name, rules ,txt}: IFormInput) => {
  const theme = useTheme()
  const {control, formState: {errors}} = useFormContext()
  const isError = !!Object.keys(errors[name] || {}).length

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <FormControl error={isError}>
        <Controller
          name={name}
          control={control}
          defaultValue={'0'}
          aria-describedby={'component-experienceYears-text'}
          rules={rules}
          render={({field: {ref, ...rest}}) => {
            return (
              <OutlinedInput
                type="text"
                fullWidth={true}
                error={isError}
                css={css`
                    padding: 0;
                    background: #fff;
                    font-size: 14px;
                    border-radius: 3px;
                    border: #cccccc;
                    color: ${theme.palette.jade.light};
                    width: 48px;
                    height: 48px;
                  `}
                inputRef={ref}
                inputProps={{maxLength: 2}}
                {...rest}
              />
            )
          }}
        />
      </FormControl>
      <Typography
        variant="body2"
        css={css`
            color: ${theme.palette.jade.light};
          `}
      >
        {txt}
      </Typography>
    </Stack>
  )
}

const YearsOfExperience = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsUserProfile)

  return (
    <Stack direction="row" alignItems="center" spacing={3}>
      <Typography
        variant="body2"
        css={css`
          color: ${theme.palette.jade.light};
        `}
      >
        {t('50')}：
      </Typography>
      <InputYearOrMonthOfExperience name="experienceYears" rules={{min: 0, max: 99, maxLength: 2, pattern: validNumber}} txt={t('16')}/>
      <InputYearOrMonthOfExperience name="experienceMonth" rules={{min: 0, max: 11, maxLength: 2, pattern: validNumber}} txt={t('17')}/>
    </Stack>
  )
}

// MAIN
function CreateEditSkill() {
  const theme = useTheme()
  const methods = useForm<IFormValues>({reValidateMode: 'onSubmit'})
  const dataItem: IUserSkill = useAppSelector((state) => state[ns]?.editItem)
  const settingMode = useAppSelector(state => state[ns]?.settingMode)
  const {t} = useTranslation(nsUserProfile)
  const dispatch = useAppDispatch()

  const onSubmit = async ({name, note, experienceYears, experienceMonth}: IFormValues) => {
    try {
      loadingOnHandler()
      const body = {
        name: name.trim(),
        note: note.trim(),
        experienceYears: Number(experienceYears),
        experienceMonth: Number(experienceMonth),
      }
      const res = dataItem.id == undefined ? await createItem(settingMode, body) : await updateItem(dataItem.id, settingMode , body)
      if (res.error) {
        toastHandler({type: 'error'})
        return
      }
      dispatch(actions.setMySkills(res.data))
      dispatch(actions.setShowEditForm(false))
      // toastHandler({
      //   type: 'success',
      //   message: dataItem.id == 0 ? t('create-skill-success') : t('update-skill-success')
      // })
    } catch (e) {
      toastHandler({type: 'error'})
    } finally {
      loadingOffHandler()
    }
  }

  useEffect(() => {
    methods.setValue('name', dataItem.name)
    methods.setValue('experienceYears', dataItem?.experienceYears ? dataItem?.experienceYears.toString() : '0')
    methods.setValue('experienceMonth', dataItem?.experienceMonth ? dataItem?.experienceMonth.toString() : '0')
    methods.setValue('note', dataItem.note)
  }, [dataItem])

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} action="">
        <Stack
          direction="column"
          css={css`
            background: ${theme.palette.canvas.light};
            border: solid 1px #cccccc;
            border-radius: 7px;
            padding: ${theme.spacing(4)};
          `}
          mb={5}
        >
          <GgjInputCountText
            name="name"
            errorText={t('51')}
            rules={{maxLength: 50, required: true, validate: (data) => {
              return Boolean(data.trim().length)
            }}}
            placeholder={t('15')}
            cssInput={css`
              margin-bottom: ${theme.spacing(1)};
            `}
          />
          <YearsOfExperience/>
          <GgjInputCountText
            name="note"
            rules={{maxLength: 200}}
            isMultiline={true}
            rows={4}
            placeholder={t('explain-placeholder')}
            cssInput={css`
              margin-top: ${theme.spacing(4)};
            `}
          />
          <ButtonGroupForm/>
        </Stack>
      </form>
    </FormProvider>
  )
}

export default React.memo(CreateEditSkill)
