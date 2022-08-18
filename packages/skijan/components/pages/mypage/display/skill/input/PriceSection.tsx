import {css, SerializedStyles} from '@emotion/react'
import {Add, Close, HelpOutline} from '@mui/icons-material'
import {
  Box,
  Divider,
  FormControl,
  FormControlProps,
  FormHelperText,
  Grid,
  IconButton,
  OutlinedInput,
  Stack,
  Switch,
  Typography
} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {GgjOutlineButton, GgjTextButton} from 'components/commons/GgjButton'
import {GgjDatePicker} from 'components/commons/GgjDatePicker'
import GgjPriceInput from 'components/commons/GgjPriceInput'
import {MAX_PAID_OPTION_ITEM, SKILL_MAX_PRICE} from 'components/pages/mypage/display/skill/input/const'
import {Caption} from 'components/pages/mypage/display/skill/input/ServiceSection'
import {AnyTagLabel} from 'components/pages/mypage/display/skill/input/SupportSection'
import {useTranslation} from 'next-i18next'
import {memo} from 'react'
import {Controller, RegisterOptions, useFieldArray, useFormContext, useWatch} from 'react-hook-form'
import {actions, IPaidOptionValue, ns} from 'store/mypage/display/skill/skillInputSlice'
import {useAppDispatch, useAppSelector} from '../../../../../../store/hooks'
import {TextButtonDelete} from 'components/pages/mypage/display/skill/input/ButtonGroup'
import {SectionTitle} from './SectionTitle'
import {SkillInputName, nsTran} from './const'
import {rgba} from 'emotion-rgba'

const PRICE = SkillInputName.PRICE
const PAID_OPTIONS = SkillInputName.PAID_OPTIONS

interface PriceInputProps extends FormControlProps {
  name: string
  isError?: boolean
  rules?: RegisterOptions
  placeholder?: string
  inputStyles?: SerializedStyles
}

function SkillPriceInput(props: PriceInputProps) {
  const {
    name,
    rules,
    placeholder,
    ...rest
  } = props
  const { control, formState: {errors} } = useFormContext()
  const {t} = useTranslation(nsTran)
  const isError = !!Object.keys(errors[name] || {}).length

  return (
    <FormControl
      variant="outlined"
      {...rest}
      error={isError}
    >
      <Controller
        control={control}
        name={name}
        aria-describedby={`component-${name}-text`}
        defaultValue={null}
        rules={rules}
        render={({ field }) => {
          return (<GgjPriceInput {...field} placeholder={placeholder} />)
        }}
      />
      {isError && <FormHelperText css={css `width: 300px;`}>
        {t(`price-${errors[name].type}`)}
      </FormHelperText>}
    </FormControl>
  )
}

function PaidOptionPriceInput({index}: {index: number}) {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const { control, formState: {errors} } = useFormContext()

  const name = `paidOptions.${index}.optionPrice`
  const isError= !!Object.keys(errors?.['paidOptions']?.[index]?.['optionPrice'] || {}).length

  return (
    <FormControl
      variant="outlined"
      error={isError}
      css={css`
        margin-bottom: ${theme.spacing(1)};
        width: 140px;
        @media (min-width: ${theme.breakpoints.values.md}px) {
          width: 100%;
        }
      `}
    >
      <Controller
        control={control}
        name={name}
        aria-describedby={`component-${name}-text`}
        defaultValue={null}
        rules={{ required: true, min: 500, max: SKILL_MAX_PRICE}}
        render={({ field }) => {
          return (<GgjPriceInput {...field} placeholder="500" />)
        }}
      />
      {isError && <FormHelperText css={css `
        text-align: left;
        margin-left: 0;
        margin-right: 0;
        width: 300px;
        @media (min-width: ${theme.breakpoints.values.md}px) {
          text-align: right;
          width: 130%;
          margin-left: -30%;
        }

      `}>
        {t(`price-${errors?.['paidOptions']?.[index]?.['optionPrice']?.type}`)}
      </FormHelperText>}
    </FormControl>
  )
}


function OriginalPrice() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const isPublishValidation = useAppSelector(state => state[ns].isPublishValidation)

  return (
    <>
      <Caption title={ t('25') } style={css `margin-bottom: ${theme.spacing(2)};`} />
      <SkillPriceInput
        name={PRICE}
        rules={{
          required: isPublishValidation,
          min: isPublishValidation ? 500 : 0,
          max: SKILL_MAX_PRICE,
          validate: (value) => !(value && value < 500)
        }}
        placeholder="500"
        css={css`
          margin-bottom: ${theme.spacing(1)};
          width: 140px;
          @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 152px;
          }
      `}
      />
      <Typography variant="caption" mb={4} css={css `color: ${theme.palette.smoke.dark}; display: block;`}>{ t('26') }</Typography>
    </>
  )
}

function DiscountPrice() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center" mt={4} mb={2}>
        <Caption title={ t('27') } />
        <AnyTagLabel />
      </Stack>
      <Box mb={2}>
        <Typography variant="subtitle1" display="inline" color="error">{ t('28') }</Typography>
        <IconButton aria-label="help" color="primary" disabled={true}>
          <HelpOutline css={css` color: ${theme.typography.subtitle1.color};`} />
        </IconButton>
      </Box>
      <SkillPriceInput
        name="discountPrice"
        placeholder="500"
        disabled
        css={css`
          margin-bottom: ${theme.spacing(1)};
          width: 152px;
      `}
      />
      <Typography variant="caption" mb={3} css={css `color: ${theme.palette.smoke.dark}; display: block;`}>{ t('26') }</Typography>
    </>
  )
}

function SaleDatePicker({title, name} : {title: string, name: string}) {
  const { control, formState: {errors}} = useFormContext()
  const discountData = useWatch({
    control,
    name: ['discountStartAt', 'discountEndAt', 'discountPrice']
  })

  return (
    <>
      <FormControl variant="outlined" error={!!Object.keys(errors[name] || {}).length}>
        <Controller
          control={control}
          name={name}
          aria-describedby={`component-${name}-text`}
          defaultValue={null}
          rules={{
            required: !!discountData[2]
          }}
          render={({ field: { value, onChange, ref,...rest } }) => {
            return (
              <GgjDatePicker
                value={value}
                label={title}
                onChange={onChange}
                datePickerRef={ref}
                disabled={true}
                maxDate={name === 'discountStartAt' && discountData[1] ? new Date(discountData[1]) : undefined}
                minDate={name === 'discountEndAt' && discountData[0] ? new Date(discountData[0]) : undefined}
                isError={!!Object.keys(errors[name] || {}).length}
                inputStyles={css`
                  width: 152px;
                  & input {
                    padding-left: 12px;
                    padding-right: 0;
                  }
                `}
                {...rest}
              />
            )
          }}
        />
        {/* {!!Object.keys(errors[name] || {}).length && <FormHelperText id="component--text">HELLO</FormHelperText>} */}
      </FormControl>

    </>
  )
}

function DateRangePickers() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const { resetField } = useFormContext()
  const resetDiscountCampaign = () => {
    resetField('discountStartAt')
    resetField('discountEndAt')
    resetField('discountPrice')
  }
  return (
    <>
      <Stack direction={{xs: 'column', md: 'row' }} spacing={{xs: 3, md: 2}}>
        <Stack direction="row" spacing={2} alignItems="center">
          <SaleDatePicker name="discountStartAt" title={t('29')} />
          <Typography variant="caption" css={css `color: ${theme.palette.smoke.dark};`}>{ t('30') }</Typography>
        </Stack>
        <SaleDatePicker name="discountEndAt" title={t('31')} />
      </Stack>
      <Box mt={2} mb={3}><GgjTextButton disabled onClick={resetDiscountCampaign} startIcon={<Close />} variant="text">{ t('32') }</GgjTextButton></Box>
    </>
  )
}

function PaidOptionItem({
  index,
  remove,
} : {
  index : number,
  remove: (index: number) => void,
}) {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(nsTran)
  const {control, getValues, formState: {errors}} = useFormContext()
  const paidOptions = getValues(PAID_OPTIONS)

  const handleDeletePaidOption = () => {
    const deletePaidOptionItem = paidOptions[index]

    // handle delete paidOption has ID
    if(deletePaidOptionItem.id) {
      dispatch(actions.deletePaidOption({
        ...deletePaidOptionItem,
        isDelete: true
      }))
    }
    remove(index)
  }

  return (
    <>
      {/* Title and status */}
      <Stack direction="row" mb={1} justifyContent="space-between" alignItems="center">
        <Typography variant="body1" fontWeight="medium">{t('33', {index: index + 1})}</Typography>
        <Controller
          control={control}
          name={`${PAID_OPTIONS}.${index}.statusType`}
          aria-describedby={`component-${PAID_OPTIONS}-status-checkbox`}
          render={({field: {onChange, ...rest}}) => {
            return (
              <Switch
                {...rest}
                onChange={(e) => {
                  onChange(e.target.checked ? 1 : 0)
                }}
                checked={!!rest.value}
              />
            )
          }}
        />
      </Stack>
      <Divider />
      <Grid container mt={3}>
        <Grid item
          xs={12} md={9}
          pr={{xs: 0, md: 2}}
        >
          {/* PaidOption Detail */}
          <FormControl
            variant="outlined"
            fullWidth
            error={!!Object.keys(errors?.[PAID_OPTIONS]?.[index]?.['optionName'] || {}).length}
          >
            <Controller
              control={control}
              name={`${PAID_OPTIONS}.${index}.optionName`}
              aria-describedby={`component-${PAID_OPTIONS}-name-text`}
              rules={{
                required: true,
                maxLength: 60
              }}
              render={({field: {ref, ...rest}}) => {
                return (
                  <OutlinedInput
                    type="text"
                    multiline
                    rows={1}
                    placeholder={t('34')}
                    fullWidth={true}
                    css={css`
                      background: #fff;
                      padding: 0;
                      border-radius: 7px;
                      height: 130px;
                      textarea {height: 100% !important; box-sizing: border-box;}
                      @media (min-width: ${theme.breakpoints.values.md}px) {
                        height: 48px;
                      }
                    `}
                    inputRef={ref} {...rest} />
                )
              }}
            />
            {!!Object.keys(errors?.[PAID_OPTIONS]?.[index]?.['optionName'] || {}).length
              && <FormHelperText
                css={css`
                  margin-left: 0;
                  @media (min-width: ${theme.breakpoints.values.md}px) {
                    margin-left: ${theme.spacing(3)};
                  }
                `}
                id="component-Paid-option-detail-text"
              >
                {t('paid-option-max-length-warning')}
              </FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item
          xs={7} md={3}
          pt={{xs: 2, md: 0}}
          pl={{xs: 0, md: 2}}
        >
          {/* PaidOption Price */}
          <PaidOptionPriceInput index={index}/>
          <Typography
            variant="caption"
            textAlign={{xs: 'left', md: 'right'}}
            css={css `
              color: ${theme.palette.smoke.dark};
              display: block;
              @media (min-width: ${theme.breakpoints.values.md}px) {
                width: 150%;
                margin-left: -50%;
              }
            `}
          >{ t('26') }</Typography>
        </Grid>
        {/* Button Remove PaidOption */}
        <Grid
          item
          xs={5}
          md={12}
          pt={{xs: 3, md: 0}}
          pb={{xs: 0, md: 2}}
          textAlign={{xs: 'right', md: 'left'}}
          css={css` display: block;`}
        >
          <TextButtonDelete
            onClick={handleDeletePaidOption}
            title={ t('12') }
          />
        </Grid>
      </Grid>
    </>
  )
}


function AddPaidOptionButton({append} : {append: (arg0: IPaidOptionValue) => void}) {
  const { control, setFocus } = useFormContext()
  const { t } = useTranslation(nsTran)
  const paidOptionsData = useWatch({
    control,
    name: PAID_OPTIONS
  })

  const availablePaidOptionLeft = MAX_PAID_OPTION_ITEM - (paidOptionsData?.length || 0)

  const onClickAddPaidOption = async () => {
    if(availablePaidOptionLeft <= 0) return
    await append({
      statusType: 1,
      optionName: '',
      optionPrice: null,
    })
    setFocus(`${PAID_OPTIONS}[${paidOptionsData?.length || 0}].optionName`)
  }
  return (
    <Box  textAlign={{xs: 'center', md: 'left'}} mt={{xs: 3, md: 4}} mb={4}>
      <GgjOutlineButton
        startIcon={<Add/>}
        onClick={onClickAddPaidOption}
        css={css`
          border-radius: 22px;
          background: #fff;
        `}>{ t('35', { left: availablePaidOptionLeft }) }</GgjOutlineButton>
    </Box>
  )
}


function PaidOptions() {
  const { control } = useFormContext()
  const { t } = useTranslation(nsTran)
  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: PAID_OPTIONS
  })
  const appendNewPaidOption = (paidOption: IPaidOptionValue) => {
    append(paidOption, { shouldFocus: false })
  }
  const removePaidOption = (index: number) => {
    remove(index)
  }

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center" mt={4} mb={3}>
        <Caption title={ t('36') } />
        <AnyTagLabel />
      </Stack>
      {fields.map((data, index) =>
        <PaidOptionItem
          key={data.id}
          index={index}
          remove={removePaidOption}
        />)
      }

      {fields.length < MAX_PAID_OPTION_ITEM &&
        <AddPaidOptionButton append={appendNewPaidOption}/>
      }
      <Divider />
    </>
  )
}

function ComingSoonBox() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const style = { css: {color: theme.palette.text.primary}}
  return (
    <Box
      css={css`
        margin: ${theme.spacing(3)} -${theme.spacing(3)} 0;
        position: relative;
        &::after{
          content: 'coming soon...';
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          color: ${theme.palette.grey[50]};
          background-color: ${rgba(theme.palette.text.primary, 0.32)};
          border-radius: 10px;
        }
      `}
      px={3} py={4} mt={{md: 4}}
    >
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Typography {...style} variant="subtitle2">{ t('37') }</Typography>
        <Typography {...style} variant="subtitle2">￥--</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography {...style} variant="subtitle2">{ t('38') }</Typography>
        <Typography {...style} variant="subtitle2">￥--</Typography>
      </Stack>
    </Box>
  )
}


function PriceSection() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  return (
    <>
      <SectionTitle title={t('39')}/>
      <Box px={{xs: 3, md: 6}} py={4} mb={{xs: 5, md: 6}} css={css` background: ${theme.palette.grey[50]}; border-radius: 15px; `}>
        <OriginalPrice />
        <Divider />
        <Box css={css`
          margin: ${theme.spacing(3)} -${theme.spacing(3)} 0;
          position: relative;
          &::after{
            content: 'coming soon...';
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            color: ${theme.palette.grey[50]};
            background-color: ${rgba(theme.palette.text.primary, 0.32)};
            border-radius: 10px;
          }
        `}
        px={3} py={1}
        >
          <DiscountPrice />
          <DateRangePickers />
        </Box>
        <Divider />
        <PaidOptions />
        <ComingSoonBox />
      </Box>
    </>
  )
}

export default memo(PriceSection)
