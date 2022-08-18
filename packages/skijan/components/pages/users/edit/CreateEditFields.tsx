import {useEffect} from 'react'
import {css} from '@emotion/react'
import {useTheme} from '@mui/material/styles'
import {
  Button,
  FormControl, FormHelperText,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'

import {
  Controller,
  useForm,
  FormProvider,
  useWatch,
  useFormContext,
} from 'react-hook-form'
import GgjInputCountText from 'components/commons/GgjInputCountText'
import ButtonGroupForm from './ButtonGroupForm'
import menu from '../../../layouts/common/menu-data.json'
import {nsCommonCategories} from '../../../../common/categories'
import {useTranslation} from 'next-i18next'
import {
  actions,
  createItem,
  ISpecialty,
  ns,
  updateItem,
} from '../../../../store/usersSlice'
import {toastHandler} from '../../../../contexts/ToastContext'
import {loadingOffHandler, loadingOnHandler} from '../../../../contexts/LoadingContext'
import {useAppDispatch, useAppSelector} from '../../../../store/hooks'
import {nsUserProfile} from '../../../../common/constant'

interface IFormValues {
  serviceCategoryLargeId: string
  serviceCategoryMiddle: Array<string>
  explain: string
}

interface IOptions {
  id: string
  name: string
  sub: ISubOptions[]
}

interface ISubOptions {
  id: string
  name: string
}

// LARGE CATEGORIES
const SelectLargeCategories = () => {
  const theme = useTheme()
  const {control} = useFormContext<IFormValues>()
  const {t} = useTranslation(nsCommonCategories)
  const options: IOptions[] = [...menu.map(item => ({
    id: item.id.toString(),
    name: t(`${item.id}`),
    sub: [...item.sub.map(sub => ({
      id: sub.id.toString(),
      name: t(`mid_${sub.id}`)
    }))]
  }))]

  return (
    <>
      <FormControl fullWidth>
        <Controller defaultValue="1" control={control} name="serviceCategoryLargeId" render={({field}) => <Select
          {...field}
          displayEmpty
          onChange={(e) => field.onChange(e.target.value)}
          inputProps={{'aria-label': 'Without label'}}
          css={css`
            height: 42px;
          `}
        >
          {
            options.map(item => (
              <MenuItem key={`${item.id}`} value={item.id}><Typography variant="body2" css={css`color: ${theme.palette.jade.light};`}
              >{item.name}</Typography></MenuItem>
            ))
          }
        </Select>}
        />
      </FormControl>
      <SelectMiddleCategories options={options}/>
    </>
  )
}

// MIDDLE CATEGORIES
const SelectMiddleCategories = ({options}: { options: IOptions[] }) => {
  const theme = useTheme()
  const {control, setValue, formState: {errors}} = useFormContext<IFormValues>()
  const {t} = useTranslation(nsUserProfile)
  const dataItem: ISpecialty = useAppSelector((state)=> state[ns]?.editItem)
  const isError = !!Object.keys(errors['serviceCategoryMiddle'] || {}).length

  const midCategoryId = useWatch({
    control,
    name: 'serviceCategoryMiddle'
  })

  const largeCategoryId = useWatch({
    control,
    name: 'serviceCategoryLargeId'
  })

  const handler = (subId: string) => {
    let newMidIdArr
    if (midCategoryId.includes(subId)) {
      newMidIdArr = midCategoryId.filter(item => item !== subId)
    } else {
      newMidIdArr = [...midCategoryId, subId]
    }
    setValue('serviceCategoryMiddle', newMidIdArr)
  }

  useEffect(() => {
    if(dataItem.serviceCategoryLargeId && dataItem.serviceCategoryLargeId.toString() !== largeCategoryId){
      setValue('serviceCategoryMiddle', [])
    }else{
      if(dataItem.serviceCategoryMiddle) {
        setValue('serviceCategoryMiddle', dataItem.serviceCategoryMiddle.split(',').filter(item => item !== ''))
      }
    }
  },[largeCategoryId])

  return (
    <div css={css`margin-top: 16px;
      margin-bottom: 16px`}
    >
      <Typography variant="caption">
        {t('13')}
      </Typography>
      <Stack
        direction="row"
        css={css`
          padding: 15px 15px 25px;
          background-color: #fff;
          flex-wrap: wrap;
          gap: 7px;
          border-radius: 7px;
          margin-top: 8px;
        `}
      >
        {options.filter(item => item.id === largeCategoryId).map(item => item.sub.map((sub, idx) =>
          <div key={`midcat${idx}`}>
            <Controller name={'serviceCategoryMiddle'} rules={{required: true}} render={({field}) => (
              <Button
                {...field}
                name={`serviceCategoryMiddle.${idx}`}
                onClick={() => handler(sub.id)}
                css={css`
                  border-radius: 0;
                  padding: 8px;
                  background: ${midCategoryId.includes(sub.id) ? theme.palette.secondary.main : theme.palette.canvas.light};
                  &:hover {
                    background: ${midCategoryId.includes(sub.id) ? theme.palette.secondary.main : theme.palette.canvas.light};
                  }
                `}
              >
                <Typography
                  variant="caption"
                  css={css`
                    color: ${midCategoryId.includes(sub.id) ? '#FFFFFF' : theme.palette.jade.light};
                  `}
                >
                  {sub.name}
                </Typography>
              </Button>
            )}
            />
          </div>
        ))}
      </Stack>
      {isError && <FormHelperText css={css`color: ${theme.palette.error.main}`}>{t('62')}</FormHelperText>}
    </div>
  )
}

// MAIN
function CreateEditFields() {
  const theme = useTheme()
  const methods = useForm<IFormValues>({
    reValidateMode: 'onSubmit'
  })
  const dataItem: ISpecialty = useAppSelector((state)=> state[ns]?.editItem)
  const settingMode = useAppSelector(state => state[ns]?.settingMode)
  const {t} = useTranslation(nsUserProfile)
  const dispatch = useAppDispatch()

  const onSubmit = async ({serviceCategoryLargeId, serviceCategoryMiddle, explain}: IFormValues) => {
    try {
      loadingOnHandler()
      const body = {
        serviceCategoryLargeId: parseInt(serviceCategoryLargeId),
        serviceCategoryMiddle: [...new Set(serviceCategoryMiddle)].toString(),
        explain: explain.trim()
      }
      const res = dataItem.id == undefined ? await createItem(settingMode, body) : await updateItem(dataItem.id, settingMode, body)
      if(res.error){
        toastHandler({type: 'error'})
        return
      }
      dispatch(actions.setSpecialty(res.data))
      dispatch(actions.setShowEditForm(false))
      // toastHandler({type:'success', message: dataItem.id == 0 ? t('create-specialty-success'): t('update-specialty-success')})
    } catch (e) {
      toastHandler({type: 'error'})
    } finally {
      loadingOffHandler()
    }
  }

  useEffect(() => {
    methods.setValue('serviceCategoryLargeId', dataItem.serviceCategoryLargeId ? dataItem.serviceCategoryLargeId.toString() : '')
    methods.setValue('serviceCategoryMiddle', dataItem.serviceCategoryMiddle ? dataItem.serviceCategoryMiddle.split(',').filter(item => item) : [])
    methods.setValue('explain', dataItem.explain)
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
          <SelectLargeCategories/>
          <GgjInputCountText name="explain" errorText={t('14')} rules={{maxLength: 200}} isMultiline={true} rows={10} placeholder={t('explain-placeholder')}/>
          <ButtonGroupForm/>
        </Stack>
      </form>
    </FormProvider>
  )
}

export default CreateEditFields
