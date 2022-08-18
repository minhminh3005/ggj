import { css } from '@emotion/react'
import { Box, Checkbox, FormControl, FormControlLabel, Grid, OutlinedInput, Slide, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { GgjPrimaryButton } from 'components/common'
import { useTranslation } from 'next-i18next'
import { Controller, FormProvider, useFieldArray, useForm, useFormContext, useWatch } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { IReasonWithdraw, ns, sendRequestWithdrawal } from 'store/others/withdrawalSlice'
import { ggjDebounce } from 'common/utils'
import { useRouter } from 'next/router'
import getConfig from 'next/config'

const { publicRuntimeConfig: { ACCOUNT_HOST_URL } } = getConfig()

const nsTran = 'components@withdrawal'
interface IFormValues {
  reasonList: {
    isChecked: boolean
    id: number
  }[]
  otherReasonContent: string
}
interface WithdrawCheckboxProps {
  name: string
  content: string
}


function ReasonCheckbox({ name, content } : WithdrawCheckboxProps) {
  const theme = useTheme()
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={false}
      render={({ field: {onChange, value} }) => (
        <FormControlLabel
          css={css`
            & span { font-size: 14px;}`
          }
          control={<Checkbox
            onChange={(e) => onChange(e.target.checked)}
            checked={value}
            css={css`
              color: ${theme.palette.text.primary};
              &.Mui-checked {
                color: ${theme.palette.text.primary};
              }
            `}/>
          }
          label={content} />
      )}
    />
  )
}
function ReasonInput() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const { control } = useFormContext()
  const reasonList = useWatch({
    control,
    name: 'reasonList'
  })
  const isOtherReasonChecked = reasonList?.[reasonList.length - 1]?.isChecked || false
  return (
    <FormControl variant="outlined" fullWidth css={css` margin-bottom: ${theme.spacing(4)};`}>
      {isOtherReasonChecked &&
        <>
          <Typography  variant="caption" component="label" htmlFor="otherReasonContent" pb={1} mt={2}>
            { t('16') }
          </Typography>
          <Controller
            control={control}
            name="otherReasonContent"
            aria-describedby={'component-other-reason-content-text'}
            defaultValue=""
            render={({ field: { ref, ...rest } }) => {
              return (
                <OutlinedInput
                  type="text"
                  multiline
                  disabled={!isOtherReasonChecked}
                  rows={5}
                  css={css` padding: ${theme.spacing(2)};`}
                  fullWidth={true}
                  inputRef={ref} {...rest} />
              )
            }}
          />
        </>
      }
    </FormControl>
  )
}

function SubmitButton() {
  const { t } = useTranslation(nsTran)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { handleSubmit, control } = useFormContext<IFormValues>()
  const formData = useWatch({
    control,
    name: 'reasonList'
  })

  const isDisable = !Object.values(formData).some(i => i.isChecked === true)
  const preProcessingData = (data : IFormValues) => {
    const checkedReasons = data.reasonList.filter(item => item.isChecked === true).map(item => item.id)
    return {
      reasonIds: checkedReasons,
      ...(checkedReasons.includes(4) && {reason: data.otherReasonContent})
    }
  }

  const onSubmit = async (data : IFormValues) => {
    const payload = preProcessingData(data)
    const result = await dispatch(sendRequestWithdrawal(payload))
    if(result) {
      setTimeout(() => {
        router.push(`${ACCOUNT_HOST_URL}/logout`)
      }, 5e3)
    }
  }

  return (
    <GgjPrimaryButton
      fullWidth
      variant="outlined"
      color="error"
      disabled={isDisable}
      onClick={ggjDebounce(handleSubmit(onSubmit), 400)}
    >
      <strong>{t('submit-reason')}</strong>
    </GgjPrimaryButton>
  )
}

function ReasonWithdrawScreen(){
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const reasonWithdrawList = useAppSelector(state => state[ns].reasonWithdrawList)
  const screenIndex = useAppSelector(state => state[ns].screenIndex)
  const defaultValueList = reasonWithdrawList.map((item : IReasonWithdraw) => ({ isChecked: false, id: item.id }))
  const methods = useForm<IFormValues>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      reasonList: defaultValueList,
      otherReasonContent: ''
    }
  })
  const { fields } = useFieldArray({
    control: methods.control,
    name: 'reasonList'
  })

  return (
    <Slide
      mountOnEnter
      unmountOnExit
      direction="left"
      in={screenIndex === 1}
      appear={false}
      css={css` flex-grow: 1;`}
      timeout={{exit: 0, enter: theme.transitions.duration.enteringScreen}}
    >
      <Box>
        <FormProvider {...methods}>
          {/* title */}
          <Typography variant="h5" mb={3} mt={2} fontWeight={theme.typography.fontWeightMedium} >{t('2')}</Typography>
          <Typography variant="body1" mb={2}>{ t('10') }</Typography>
          <Typography variant="subtitle2" mb={2}>{ t('11') }</Typography>
          {/* checkboxes */}
          <FormControl>
            {fields.map((item, idx) =>
              <ReasonCheckbox
                key={idx}
                content={reasonWithdrawList[idx].withdrawalReason}
                name={`reasonList.${idx}.isChecked`} />)
            }
          </FormControl>
          {/* text area */}
          <ReasonInput />

          <Grid container>
            <Grid item xs={12} md={6} lg={4} mb={8}>
              <SubmitButton />
            </Grid>
          </Grid>
        </FormProvider>
      </Box>
    </Slide>
  )
}

export default ReasonWithdrawScreen
