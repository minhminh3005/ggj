import { Control, Controller, UseFormReturn } from 'react-hook-form'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import OutlinedInput from '@mui/material/OutlinedInput'
import {css as css2} from '@emotion/css'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import Checkbox from '@mui/material/Checkbox'
import {css} from '@emotion/react'
import {useTranslation} from 'next-i18next'
import {useTheme} from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { MemberFormData, nsTran, TPrefectureData } from 'components/pages/member/member.typing'
import {
  ChangeEvent,
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useState,
  MutableRefObject,
} from 'react'
import Button from '@mui/material/Button'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { styled } from '@mui/system'
import DatePicker from '@mui/lab/DatePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import {PatternNameKana, PatternName, PatternCode} from 'common/variables'
import { checkExtension, checkFileSize } from 'common/upload'
import { utcToZonedTime } from 'date-fns-tz'
import { timeZone } from 'common/date'
import NumberFormat, { NumberFormatPropsBase } from 'react-number-format'
import {FC, KeyboardEvent} from 'react'
import {toastHandler} from '../../../contexts/ToastContext'

// fix type
type TNumberFormatComp = (NumberFormatPropsBase<TextFieldProps>) & TextFieldProps
const NumberFormatComp = NumberFormat as unknown as FC<TNumberFormatComp>

import {
  ja as jaLocale,
  enUS as enUSLocale,
  vi as viLocale,
  th as thLocale,
  zhTW as zhTWLocale,
  zhCN as zhCNLocale,
} from 'date-fns/locale'

type FormFieldsFactoryInputType = {
  control:  Control<MemberFormData>,
  t: (s: string) => string
  defaultData?: MemberFormData | null
  prefectures: TPrefectureData[]
  locale: keyof typeof timeZone
  setValue: UseFormReturn<MemberFormData>['setValue']
  setError: UseFormReturn<MemberFormData>['setError']
  clearErrors: UseFormReturn<MemberFormData>['clearErrors']
  isValidatingByNicknameRef: MutableRefObject<boolean>
}
type FormFieldsFactoryOutType = {
  [Property in keyof Omit<MemberFormData, 'corporateName' | 'registrationNumber'>]: ReactNode
}

type CompanyInfoFormProps = {
  control:  Control<MemberFormData>,
  defaultData?: MemberFormData | null
}
const HiddenInput = styled('input')({
  display: 'none',
})
const DefaultData: MemberFormData = {
  firstName: '',
  lastName: '',
  isCorporation: 'false',
  firstNameKana: '',
  lastNameKana: '',
  corporateName: '',
  registrationNumber: '',
  zip: '',
  address1: '',
  address2: '',
  prefectureId: 0,
  sexType: 'other',
  birthday: null,
  address3: '',
  isNda: false,
  nda: '',
  transaction: '',
  isTransaction: false,
  tel: '',
  nickName: ''
}
const localeMap = {
  ja: jaLocale,
  en: enUSLocale,
  vi: viLocale,
  th: thLocale,
  ch: zhCNLocale, // Chinese Simplified (zh-CN) locale
  tw: zhTWLocale, // Chinese Traditional  (zh-TW) locale
}
const toolbarFormatMap= {
  ja: 'MM月dd日',
  en: 'MM/dd',
}
const maxLengthDataBaseSupport = 60
const maxLengthTransaction = 3000
const maxLengthNickname = 30

function NickNameComponent ({
  control,
  defaultData = null
}: FormFieldsFactoryInputType) {
  const {t} =useTranslation(nsTran)

  return (
    <Controller
      control={control}
      name="nickName"
      rules={{
        required: {
          value: true,
          message: t('error_hook_form_required_error')
        },
        minLength: {
          value: 2,
          message: t('error_hook_form_name_max_length'),
        },
        maxLength: {
          value: maxLengthNickname,
          message: t('error_hook_form_name_max_length'),
        },
      }}
      defaultValue={defaultData?.nickName?.trim() || DefaultData.nickName}
      render={({field: {ref, onChange, ...rest}, formState: {errors}}) => {
        return (
          <OutlinedInput
            inputProps={{
              minLength: 2,
              maxLength: maxLengthNickname
            }}
            error={Boolean(errors.nickName)}
            {...rest}
            onChange={(e) => {
              onChange(e)
            }}
            inputRef={ref}
          />
        )
      }}
    />
  )
}

export function FormFieldsFactory({ control, t, defaultData = null, prefectures, locale, setValue, setError, clearErrors, isValidatingByNicknameRef}: FormFieldsFactoryInputType): FormFieldsFactoryOutType {
  return {
    lastName: (<Controller
      control={control}
      name="lastName"
      defaultValue={defaultData?.lastName || DefaultData?.lastName}
      rules={{
        required: {
          value: true,
          message: t('error_hook_form_required_error')
        },
        pattern: {
          value: PatternName,
          message: t('error_hook_form_pattern_name_error')
        },
        maxLength: {
          value: maxLengthDataBaseSupport,
          message: t('error_hook_form_max_length')
        },
      }}
      render={({ field, formState: { errors }}) => (
        <TextField
          {...field}
          error={Boolean(errors.lastName)}
          inputRef={field.ref}
          variant="outlined"
          placeholder={t('root-28')}
          fullWidth={true}
          inputProps={{
            maxLength: maxLengthDataBaseSupport,
          }}
        />
      )}
    />),
    firstName: (<Controller
      control={control}
      name="firstName"
      defaultValue={defaultData?.firstName || DefaultData?.firstName}
      rules={{
        required: {
          value: true,
          message: t('error_hook_form_required_error')
        },
        pattern: {
          value: PatternName,
          message: t('error_hook_form_pattern_name_error')
        },
        maxLength: {
          value: maxLengthDataBaseSupport,
          message: t('error_hook_form_max_length')
        },
      }}
      render={({ field, formState: { errors },}) => (
        <TextField
          {...field}
          error={Boolean(errors.firstName)}
          inputRef={field.ref}
          variant="outlined"
          placeholder={t('root-29')}
          fullWidth={true}
          inputProps={{
            maxLength: maxLengthDataBaseSupport,
          }}
        />
      )}
    />),
    firstNameKana: (<Controller
      control={control}
      name="firstNameKana"
      defaultValue={defaultData?.firstNameKana || DefaultData?.firstNameKana}
      rules={{
        required: {
          value: true,
          message: t('error_hook_form_required_error')
        },
        pattern: {
          value: PatternNameKana,
          message: t('error_hook_form_pattern_kana_name_error')
        },
        maxLength: {
          value: maxLengthDataBaseSupport,
          message: t('error_hook_form_max_length')
        },
      }}
      render={({ field, formState: { errors }}) => (
        <TextField
          {...field}
          error={Boolean(errors.firstNameKana)}
          inputRef={field.ref}
          variant="outlined"
          placeholder={t('root-30')}
          fullWidth={true}
          inputProps={{
            maxLength: maxLengthDataBaseSupport,
          }}
        />
      )}
    />),
    lastNameKana: (<Controller
      name="lastNameKana"
      control={control}
      defaultValue={defaultData?.lastNameKana || DefaultData?.lastNameKana}
      rules={{
        required: {
          value: true,
          message: t('error_hook_form_required_error')
        },
        pattern: {
          value: PatternNameKana,
          message: t('error_hook_form_pattern_kana_name_error')
        },
        maxLength: {
          value: maxLengthDataBaseSupport,
          message: t('error_hook_form_max_length')
        },
      }}
      render={({ field, formState: { errors }}) => (
        <TextField
          {...field}
          error={Boolean(errors.lastNameKana)}
          inputRef={field.ref}
          variant="outlined"
          placeholder={t('root-43')}
          fullWidth={true}
          inputProps={{
            maxLength: maxLengthDataBaseSupport,
          }}
        />
      )}
    />),
    zip: (<Controller
      control={control}
      name="zip"
      defaultValue={defaultData?.zip || DefaultData?.zip}
      rules={{
        required: {
          value: true,
          message: t('error_hook_form_required_error')
        },
        pattern: {
          value: PatternCode,
          message: t('error_hook_form_zip_error')
        },
      }}
      render={({ field, formState: { errors }}) => (
        <NumberFormatComp
          {...field}
          error={Boolean(errors.zip)}
          inputRef={field.ref}
          variant="outlined"
          fullWidth={true}
          customInput={TextField}
          onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
            const zipValue = (e.target as HTMLInputElement).value
            if(!PatternCode.test(zipValue)) {
              // setValue('prefectureId', '')
              // setValue('address1', '')
              // setValue('address2', '')
              // setValue('address3', '')
              return
            }
            // @ts-ignore
            const AZ3 = AjaxZip3
            if(!AZ3) return
            AZ3.callback = (data:{[k: string]: string[]}) => {
              const addressData = getAjaxZipData(data, zipValue)
              setValue('prefectureId', addressData.prefectureId || '')
              setValue('address1', addressData.address1)
              setValue('address2', addressData.address2)
              // setValue('address3', addressData.address3)
            }
            AZ3.zip2addr(e.target,'','address1','address1')
          }}
          inputProps={{
            inputMode:'decimal',
            pattern:'[0-9]*',
            autoCorrect:'off',
            autoComplete:'cc-csc',
          }}
          format="###-####"
        />
      )}
    />),
    prefectureId: (<Controller
      control={control}
      name="prefectureId"
      defaultValue={defaultData?.prefectureId || 0}
      rules={{
        required: {
          value: true,
          message: t('error_hook_form_prefectureId_required_error')
        },
      }}
      render={({ field, formState: { errors }}) => (
        <Select
          css={css`width: 100%;`}
          displayEmpty
          input={<OutlinedInput css={css`width: 100%;`} error={Boolean(errors.prefectureId)} />}
          MenuProps={{
            PaperProps: {className: 'ggj-scrollbar'},
            className: css2`max-height: 30vh`,
          }}
          {...field}
        >
          <MenuItem key="empty-item" value="">-</MenuItem>
          {prefectures.map(item => (<MenuItem key={`${item.name}-${item.id}`} value={item.id}>{item.name}</MenuItem>))}
        </Select>
      )}
    />),
    address1: (<Controller
      control={control}
      name="address1"
      defaultValue={defaultData?.address1 || DefaultData?.address1}
      rules={{
        required: {
          value: true,
          message: t('error_hook_form_required_error')
        },
        maxLength: {
          value: maxLengthDataBaseSupport,
          message: t('error_hook_form_max_length')
        },
      }}
      render={({ field, formState: { errors }}) => (
        <TextField
          {...field}
          error={Boolean(errors.address1)}
          inputRef={field.ref}
          variant="outlined"
          fullWidth={true}
          inputProps={{
            maxLength: maxLengthDataBaseSupport,
          }}
        />
      )}
    />),
    address2: (<Controller
      control={control}
      name="address2"
      defaultValue={defaultData?.address2 || DefaultData?.address2}
      rules={{
        required: {
          value: true,
          message: t('error_hook_form_required_error')
        },
        maxLength: {
          value: maxLengthDataBaseSupport,
          message: t('error_hook_form_max_length')
        },
      }}
      render={({ field, formState: { errors }}) => (
        <TextField
          {...field}
          error={Boolean(errors.address2)}
          inputRef={field.ref}
          variant="outlined"
          fullWidth={true}
          inputProps={{
            maxLength: maxLengthDataBaseSupport,
          }}
        />
      )}
    />),
    address3: (<Controller
      control={control}
      rules={{
        maxLength: {
          value: maxLengthDataBaseSupport,
          message: t('error_hook_form_max_length')
        },
      }}
      name="address3"
      defaultValue={defaultData?.address3 || DefaultData?.address3}
      render={({ field}) => (
        <TextField
          {...field}
          variant="outlined"
          fullWidth={true}
          placeholder={t('root-31')}
          inputProps={{
            maxLength: maxLengthDataBaseSupport,
          }}
        />
      )}
    />),
    birthday: (
      <Controller
        control={control}
        name="birthday"
        defaultValue={defaultData?.birthday || DefaultData?.birthday}
        rules={{
          validate: {
            value: function Validate(birthday: MemberFormData['birthday']) {
              const zonedBirthday = utcToZonedTime(birthday ?? 0, timeZone[locale]).getTime()
              const zonedNow = utcToZonedTime(Date.now(), timeZone[locale]).getTime()

              const ONE_HUNDRED_YEAR = 3.156e+12 // in milliseconds
              const ONE_HUNDRED_YEAR_AGO = Date.now() - ONE_HUNDRED_YEAR

              return zonedBirthday < zonedNow && zonedBirthday >= ONE_HUNDRED_YEAR_AGO
            },
          },
        }}
        render={({ field, formState: { errors }}) => (
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale as keyof typeof localeMap] ?? jaLocale}>
            <DatePicker
              {...field}
              toolbarTitle={t('root-38')}
              cancelText={t('root-39')}
              toolbarFormat={toolbarFormatMap[locale as keyof typeof toolbarFormatMap] ?? toolbarFormatMap.ja}
              mask="____/__/__"
              value={field.value === null ? field.value : new Date((field.value) as number)}
              onChange={(e) => {
                const time = e ? new Date((new Date(e)).setHours(0,0,0,0)).getTime() : null
                field.onChange(time)
              }}
              inputFormat="yyyy/MM/dd"
              maxDate={Date.now()}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  name="birthday"
                  error={Boolean(errors.birthday)}
                  variant="outlined"
                  placeholder="yyyy/MM/dd"
                />
              )}
            />
          </LocalizationProvider>
        )}
      />
    ),
    sexType: (<Controller
      control={control}
      name="sexType"
      defaultValue={defaultData?.sexType || DefaultData?.sexType}
      render={({ field}) => (
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="sexType-buttons-group"
        >
          <FormControlLabel
            control={<Radio {...field} value="male" checked={field.value === 'male'}/>}
            label={t('root-32') as string}
          />
          <FormControlLabel
            control={<Radio {...field} value="female" checked={field.value === 'female'}/>}
            label={t('root-33') as string}
          />
          <FormControlLabel
            control={<Radio {...field} value="other" checked={field.value === 'other'}/>}
            label={t('root-34') as string}
          />
        </RadioGroup>
      )}
    />),
    // nda: (<Controller
    //   control={control}
    //   name="nda"
    //   defaultValue={defaultData?.nda || DefaultData?.nda}
    //   render={({ field, formState: { errors }}) => (
    //     <TextField
    //       {...field}
    //       error={Boolean(errors.nda)}
    //       multiline
    //       rows={7}
    //       fullWidth={true}
    //       variant="outlined"
    //     />
    //   )}
    // />),
    nda: <NdaContent defaultData={defaultData}/>,
    isNda: (<Controller
      control={control}
      name="isNda"
      defaultValue={defaultData?.isNda || DefaultData?.isNda}
      render={({ field}) => (
        <FormControlLabel
          control={
            <Checkbox
              {...field}
              name="isNda"
              css={css`color: #222;&.Mui-checked { color: #222; }`}
              checked={Boolean(field.value)}
            />
          }
          label={t('root-37') as string}
        />
      )}
    />),
    transaction: (<Controller
      control={control}
      name="transaction"
      defaultValue={defaultData?.transaction || DefaultData?.transaction}
      rules={{
        maxLength: {
          value: maxLengthTransaction,
          message: t('error_hook_form_transaction_max_length'),
        },
      }}
      render={({ field, formState: { errors }}) => (
        <TextField
          {...field}
          multiline
          rows={5}
          fullWidth={true}
          variant="outlined"
          error={Boolean(errors.transaction)}
          inputProps={{
            maxLength: maxLengthTransaction,
          }}
        />
      )}
    />),
    isCorporation: <CompanyInfoForm control={control} defaultData={defaultData} />,
    isTransaction: (<Controller
      control={control}
      name="isTransaction"
      defaultValue={Boolean(defaultData?.isTransaction) || DefaultData?.isTransaction}
      render={({ field}) => (
        <FormControlLabel
          control={
            <Checkbox
              {...field}
              name="isTransaction"
              css={css`color: #222;&.Mui-checked { color: #222; }`}
              checked={Boolean(field.value)}
            />
          }
          label={t('root-37') as string}
        />
      )}
    />),
    tel: (<Controller
      control={control}
      name="tel"
      defaultValue={defaultData?.tel || DefaultData?.tel}
      rules={{
        required: {
          value: true,
          message: t('error_hook_form_required_error')
        },
        minLength: {
          value: 10,
          message: t('error_hook_form_tel_length_error')
        }
        // pattern: {
        //   value: TelCode,
        //   message: t('error_hook_form_tel_error')
        // },
      }}
      render={({ field, formState: { errors }}) => (
        <TextField
          {...field}
          inputProps={{
            maxLength:13
          }}
          error={Boolean(errors.tel)}
          inputRef={field.ref}
          variant="outlined"
          fullWidth={true}
        />
      )}
    />),
    nickName: (
      <NickNameComponent
        control={control}
        defaultData={defaultData}
        t={t}
        prefectures={prefectures}
        locale={locale}
        setValue={setValue}
        setError={setError}
        clearErrors={clearErrors}
        isValidatingByNicknameRef={isValidatingByNicknameRef}
      />),
  }
}

function CompanyInfoForm({ control, defaultData }: CompanyInfoFormProps) {
  const { t } = useTranslation(nsTran)
  const theme = useTheme()
  return <Controller
    control={control}
    name="isCorporation"
    defaultValue={defaultData?.isCorporation || DefaultData?.isCorporation}
    render={({ field, formState: { errors }}) => {
      const isCorporationCurrentValue = field.value.toString()
      return (
        <Grid container rowSpacing={1} columnSpacing={{ xs: 2, lg: 3 }} mb={3}>
          <Grid item xs={12} mb={1}>
            <Grid item xs={12} md={6} mb={1} css={css`display: inline-flex;`}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  control={<Radio {...field} value="false" checked={isCorporationCurrentValue === 'false'}/>}
                  label={t('root-35') as string}
                />
                <FormControlLabel
                  control={<Radio {...field} value="true" checked={isCorporationCurrentValue === 'true'}/>}
                  label={t('root-36') as string}
                />
              </RadioGroup>
            </Grid>
          </Grid>
          {
            isCorporationCurrentValue === 'true' &&
            <Grid
              item
              xs={12}
              md={6}
              mb={1}
              css={css`
                padding: 0 ${theme.spacing(3)};
                @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
                  padding: 0;
                }
              `}
            >
              <Grid container rowSpacing={1} columnSpacing={{ xs: 2, lg: 3 }} mb={3}>
                <Grid item xs={12} mb={1}>
                  <Typography variant="caption"><strong>{t('root-17')}</strong></Typography>
                </Grid>
                <Grid item xs={12} mb={3}>
                  {/* 12a. company name */}
                  <Controller
                    control={control}
                    name="corporateName"
                    defaultValue={defaultData?.corporateName || ''}
                    rules={{
                      maxLength: {
                        value: maxLengthDataBaseSupport,
                        message: t('error_hook_form_max_length')
                      },
                      required: {
                        value: true,
                        message: t('error_hook_form_required_error')
                      },
                    }}
                    render={({ field}) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth={true}
                        error={Boolean(errors.corporateName)}
                        inputProps={{
                          maxLength: maxLengthDataBaseSupport,
                        }}
                      />
                    )}
                  />
                  {errors.corporateName && <Typography color="error">{errors.corporateName.message}</Typography>}
                </Grid>
              </Grid>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 2, lg: 3 }} mb={3}>
                <Grid item xs={12} mb={1}>
                  <Typography variant="caption"><strong>{t('root-19')}</strong></Typography>
                </Grid>
                <Grid item xs={12} mb={3}>
                  {/* 12c. company id */}
                  <Controller
                    control={control}
                    name="registrationNumber"
                    defaultValue={defaultData?.registrationNumber ?? ''}
                    rules={{
                      maxLength: {
                        value: maxLengthDataBaseSupport,
                        message: t('error_hook_form_max_length')
                      },
                      required: {
                        value: true,
                        message: t('error_hook_form_required_error')
                      },
                    }}
                    render={({ field}) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth={true}
                        error={Boolean(errors.registrationNumber)}
                        inputProps={{
                          maxLength: maxLengthDataBaseSupport,
                        }}
                      />
                    )}
                  />
                  {errors.registrationNumber && <Typography color="error">{errors.registrationNumber.message}</Typography>}
                  <Typography variant="caption">{t('root-20')}</Typography>
                </Grid>
              </Grid>
            </Grid>
          }
          <Grid item xs={12} md={6} mb={1} />
        </Grid>
      )
    }}
  />
}
type IdentityButtonProps = {
  updateFile: (fileList: FileList | null) => void,
}
export type IdentityButtonRefHandler = { resetData: () => void }
export const IdentityButton = forwardRef(function IdentityButtonRaw(props: IdentityButtonProps, ref) {
  const { updateFile } = props
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const [fileNames, setFileNames] = useState<string[]>([])
  useImperativeHandle(ref, (): IdentityButtonRefHandler => ({
    resetData: () => setFileNames([])
  }))
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filesInput = e.target.files ?? null
    updateFile(filesInput)
    if(!filesInput) return
    if(!checkExtension(filesInput[0], e.target.accept) || !checkFileSize(filesInput[0], 5 /*MB*/)) {
      toastHandler({ message: t('extension-error'), type: 'error' })
      e.target.value = ''
      return
    }
    setFileNames([filesInput[0].name])
  }
  return (
    <>
      <label htmlFor="contained-button-file">
        <HiddenInput
          accept=".gif, .jpeg, .jpg, .png, .pdf"
          type="file"
          id="contained-button-file"
          onChange={handleFileChange}
        />
        <Button
          css={css`
            background: #fff;
            color: #626262;
            border: 1px solid #9F9F9F;
            border-radius: 100px;
            box-shadow: ${theme.shadows[2]};
            padding-left: 16px;
            padding-right: 16px;
          `}
          component="span"
          startIcon={<FileUploadIcon />}
        >{t('root-22')}</Button>
      </label>
      {
        fileNames.length > 0 &&
        <div css={css`margin-top: ${theme.spacing(3)}`}>
          {fileNames.map((name, idx) => <Typography key={`${idx}-${name}`}>{name}</Typography>)}
        </div>
      }
    </>
  )
})

function getAjaxZipData(data: { [k: string]: string[] }, s: string) {
  const zipNum = s.replace('-', '')
  if(data[zipNum]) {
    return {
      prefectureId: parseInt(data[zipNum][0]),
      address1: data[zipNum][1],
      address2: data[zipNum][2] ?? '',
      address3: data[zipNum][3] ?? '',
    }
  }
  else {
    return {
      prefectureId: 0,
      address1: '',
      address2: '',
      address3: '',
    }
  }
}
function NdaContent({ defaultData }: { defaultData: MemberFormData | null }) {
  const theme = useTheme()
  return (
    <div
      css={css`
        white-space: pre-wrap;
        max-height: 500px;
        overflow: auto;
        padding: ${theme.spacing(2)};
      `}
      className="ggj-scrollbar"
    >
      <Typography>{defaultData?.nda}</Typography>
    </div>
  )
}
