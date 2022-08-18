import {FormControl, FormHelperText, OutlinedInput, Typography} from '@mui/material'
import {memo, useContext, useEffect, useMemo} from 'react'
import {css} from '@emotion/react'
import {Control, Controller, RegisterOptions, useForm} from 'react-hook-form'
import {ytRegExp} from 'common/variables'
import {useTranslation} from 'next-i18next'
import Button from '@mui/material/Button'
import { nsTranUploadImages } from 'components/commons/GgjUploadImagesOrYoutube'
import {dateFormat, formatDate} from '../../../../../common/date'
import {
  Action,
  DispatchContext,
  StateContext,
} from 'components/commons/GgjUploadImagesOrYoutube/UploadImagesOrYoutubeContext'
import {useTheme} from '@mui/material/styles'
import {useAppDispatch, useAppSelector} from '../../../../../store/hooks'
import {actions, ns} from '../../../../../store/usersSlice'

interface IFormValues {
  youtubeLink: string
}

interface InputFormProps {
  control: Control<IFormValues>
  isError: boolean
  rules: RegisterOptions
  errorType: string
}

const InputForm = (props: InputFormProps) => {
  const {t} = useTranslation(nsTranUploadImages)
  const {isError, rules, control, errorType} = props

  return (
    <FormControl variant="outlined" fullWidth error={isError}>
      <Controller
        control={control}
        name="youtubeLink"
        defaultValue=""
        aria-describedby="component-error-text"
        rules={rules}
        render={({field: { ref, ...rest }}) => {
          return (
            <OutlinedInput
              placeholder={t('8')}
              css={css`
                  border-radius: 7px;
                  border-color: #cccccc;
                  overflow: hidden;
                  width: 100%;
                  background: #ffffff;
              `}
              inputRef={ref}
              {...rest}
            />
          )
        }}
      />
      {isError && <FormHelperText>{t(errorType)}</FormHelperText>}
    </FormControl>
  )
}

const UploadYoutube = () => {
  const index = 0
  const maxFiles = 1
  const theme = useTheme()
  const date = formatDate(new Date(),dateFormat)
  const dispatch = useContext(DispatchContext)
  const state = useContext(StateContext)
  const item = state.listImagesOrYoutube[0]
  const type = (item || {}).type || ''
  const {t} = useTranslation(nsTranUploadImages)
  const resetYoutubeLink: boolean = useAppSelector((state) => state[ns]?.resetYoutubeLink)
  const dispatchUserSlice = useAppDispatch()

  const {
    handleSubmit,
    control,
    resetField,
    formState: {errors},
  } = useForm<IFormValues>({
    reValidateMode: 'onSubmit',
  })

  useEffect(()=>{
    return () => resetField('youtubeLink')
  },[])

  useEffect(()=>{
    if(resetYoutubeLink) {
      resetField('youtubeLink')
      dispatchUserSlice(actions.onResetYoutubeLink(false))
    }
  },[resetYoutubeLink])

  const onSubmit = handleSubmit(async (data) => {
    const {youtubeLink} = data
    const filteredYTLink = youtubeLink.replace(/&list=[\w-]+/, '')
    const matchArray = filteredYTLink.match(ytRegExp)
    let thumbnailId
    if (matchArray && matchArray.length >= 1) {
      thumbnailId = matchArray[5]
    }
    await dispatch({type: Action.RemoveImage, payload: {index, item: item, type}})
    dispatch({
      type: Action.AddYoutube, payload: {
        youtubeLink,
        thumbnailId,
        maxFiles,
        date
      }
    })
    resetField('youtubeLink')
  })

  const errorType = useMemo(() => {
    if (errors && errors.youtubeLink) {
      return errors.youtubeLink.type
    }
    return ''
  }, [errors])

  return (
    <form onSubmit={onSubmit} css={css`margin-top: 21px;
      margin-bottom: 23px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center`}>
      <InputForm
        errorType={errorType}
        control={control}
        isError={!!errors.youtubeLink}
        rules={{
          required: true
        }}
      />
      <Button type="submit" css={css`margin-left: 4px;
      height: 40px;
      background: ${theme.palette.secondary.main};
      color: #ffffff;
      :hover {
        background: rgb(153, 78, 50);
      }
    `}>
        <Typography variant="caption" css={css`color: #ffffff`}>{t('9')}</Typography>
      </Button>
    </form>
  )
}
export default memo(UploadYoutube)
