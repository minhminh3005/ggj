import {css} from '@emotion/react'
import {Close} from '@mui/icons-material'
import {
  Button,
  Dialog,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {useTranslation} from 'next-i18next'
import {botTypo, fullWidth, nsBankTran, numbersValidate} from 'pages/bank'
import {Controller, useForm} from 'react-hook-form'
import {actions, IBankInfo, nsBank, updateBankInfo} from 'store/bankSlice'
import {useAppDispatch, useAppSelector} from 'store/hooks'
import {loadingOffHandler, loadingOnHandler} from '../../../contexts/LoadingContext'
import {toastHandler} from '../../../contexts/ToastContext'

interface BankProps {
  data: IBankInfo[]
  dot?: number
  dotAccFirst?: string
  dotAccSecond?: string
  dotAccThird?: string
  dotAccFourth?: string
}

// Phase 0 not included
// const DotAccOptions = ({control, errors}: {
//   control: Control<BankProps>
//   errors: FieldErrors
// }) => {
//   const {t} = useTranslation(nsBankTran)
//   const dotAccFirstRef = useRef<HTMLInputElement>()
//   const dotAccSecondRef = useRef<HTMLInputElement>()
//   const dotAccThirdRef = useRef<HTMLInputElement>()
//   const dotAccFourthRef = useRef<HTMLInputElement>()
//
//   const bankType = useWatch({control, name: 'dot'})
//
//   return (
//     <>
//       <FormControl error={!!Object.keys(errors.data || {}).length}>
//         <Typography>{t('payment-settings')}</Typography>
//         <Controller
//           control={control}
//           name="dot"
//           aria-describedby="component-error-text"
//           rules={{
//             required: true,
//           }}
//           render={({field}) => {
//             return (
//               <RadioGroup {...field} onChange={(e) => field.onChange(parseInt(e.target.value))}>
//                 <FormControlLabel value={1} control={<Radio/>} label={`${t('payment-1')}`}/>
//                 <FormControlLabel value={2} control={<Radio/>} label={`${t('payment-2')}`}/>
//               </RadioGroup>
//             )
//           }}
//         />
//       </FormControl>
//       <Stack spacing={3}>
//         <div
//           css={css`
//             display: flex;
//             flex-direction: column;
//           `}
//         >
//           <Typography variant="caption" css={botTypo}>
//             {t('fee-term')}
//           </Typography>
//           <Typography variant="caption">{t('dot-acc')}</Typography>
//         </div>
//         <Stack spacing={3} direction="row">
//           <FormControl error={!!Object.keys(errors.dotAccFirst || {}).length}>
//             <Controller
//               control={control}
//               name="dotAccFirst"
//               aria-describedby="component-error-text"
//               rules={{
//                 pattern: numbersValidate,
//                 required: bankType == 2,
//                 minLength: 4,
//                 maxLength: 4
//               }}
//               render={({field: {onChange, ref, ...rest}}) => {
//                 return (
//                   <OutlinedInput
//                     inputProps={{
//                       maxLength: 4,
//                     }}
//                     id="outlined-adornment-number"
//                     type={'text'}
//                     css={css`
//                       input {
//                         text-align: center;
//                       }
//                     `}
//                     {...rest}
//                     onChange={(e) => {
//                       onChange(e)
//                       if (e.target.value.length == 4) {
//                         e.preventDefault()
//                         dotAccSecondRef.current?.focus()
//                       }
//                     }}
//                     inputRef={(e) => {
//                       ref(e)
//                       dotAccFirstRef.current = e
//                     }}
//                   />
//                 )
//               }}
//             />
//           </FormControl>
//           <FormControl error={!!Object.keys(errors.dotAccSecond || {}).length}>
//             <Controller
//               control={control}
//               name="dotAccSecond"
//               aria-describedby="component-error-text"
//               rules={{
//                 pattern: numbersValidate,
//                 required: bankType == 2,
//                 minLength: 4,
//                 maxLength: 4
//               }}
//               render={({field: {onChange, ref, ...rest}}) => {
//                 return (
//                   <OutlinedInput
//                     inputProps={{
//                       maxLength: 4,
//                     }}
//                     id="outlined-adornment-number"
//                     type={'text'}
//                     css={css`
//                       input {
//                         text-align: center;
//                       }
//                     `}
//                     onChange={(e) => {
//                       onChange(e)
//                       if (e.target.value.length == 4) {
//                         e.preventDefault()
//                         dotAccThirdRef.current?.focus()
//                       }
//                     }}
//                     {...rest}
//                     inputRef={(e) => {
//                       ref(e)
//                       dotAccSecondRef.current = e
//                     }}
//                   />
//                 )
//               }}
//             />
//           </FormControl>
//           <FormControl error={!!Object.keys(errors.dotAccThird || {}).length}>
//             <Controller
//               control={control}
//               name="dotAccThird"
//               aria-describedby="component-error-text"
//               rules={{
//                 pattern: numbersValidate,
//                 required: bankType == 2,
//                 minLength: 4,
//                 maxLength: 4
//               }}
//               render={({field: {onChange, ref, ...rest}}) => {
//                 return (
//                   <OutlinedInput
//                     inputProps={{
//                       maxLength: 4,
//                     }}
//                     id="outlined-adornment-number"
//                     type={'text'}
//                     css={css`
//                       input {
//                         text-align: center;
//                       }
//                     `}
//                     onChange={(e) => {
//                       onChange(e)
//                       if (e.target.value.length == 4) {
//                         e.preventDefault()
//                         dotAccFourthRef.current?.focus()
//                       }
//                     }}
//                     {...rest}
//                     inputRef={(e) => {
//                       ref(e)
//                       dotAccThirdRef.current = e
//                     }}
//                   />
//                 )
//               }}
//             />
//           </FormControl>
//           <FormControl error={!!Object.keys(errors.dotAccFourth || {}).length}>
//             <Controller
//               control={control}
//               name="dotAccFourth"
//               aria-describedby="component-error-text"
//               rules={{
//                 pattern: numbersValidate,
//                 required: bankType == 2,
//                 minLength: 4,
//                 maxLength: 4
//               }}
//               render={({field: {ref, ...rest}}) => {
//                 return (
//                   <OutlinedInput
//                     inputProps={{
//                       maxLength: 4,
//                     }}
//                     id="outlined-adornment-number"
//                     type={'text'}
//                     css={css`
//                       input {
//                         text-align: center;
//                       }
//                     `}
//                     {...rest}
//                     inputRef={(e) => {
//                       ref(e)
//                       dotAccFourthRef.current = e
//                     }}
//                   />
//                 )
//               }}
//             />
//           </FormControl>
//         </Stack>
//       </Stack>
//     </>
//   )
// }

const BankModal = ({open, close}: { open: boolean; close: () => void }) => {
  const {t} = useTranslation(nsBankTran)
  const theme = useTheme()
  const fullScreen = useMediaQuery(`${theme.breakpoints.down('md')}`)
  const dispatch = useAppDispatch()
  const data = useAppSelector((state) => state[nsBank]?.bankInfoArr)
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: {errors},
    clearErrors,
  } = useForm<BankProps>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      data: [
        {
          accountType: data[0].accountType,
          bankType: data[0].bankType,
          accountNumber: data[0].accountNumber,
          accountHolder: data[0].accountHolder,
          bankName: data[0].bankName,
          bankBranchName: data[0].bankBranchName,
        },
        {
          accountType: data[1].accountType,
          bankType: data[1].bankType,
          accountNumber: data[1].accountNumber,
          accountHolder: data[1].accountHolder,
          bankName: data[1].bankName,
          bankBranchName: data[1].bankBranchName,
        },
      ],
      // dot: data[1].accountNumber ? 2 : 1,
      // dotAccFirst: data[1].accountNumber.substring(0, 4),
      // dotAccSecond: data[1].accountNumber.substring(4, 8),
      // dotAccThird: data[1].accountNumber.substring(8, 12),
      // dotAccFourth: data[1].accountNumber.substring(12, 16),
    },
  })

  const closeHandler = () => {
    const dot = getValues('dot')
    if (dot == 1) {
      setValue('dotAccFirst', '')
      setValue('dotAccSecond', '')
      setValue('dotAccThird', '')
      setValue('dotAccFourth', '')
    }
    clearErrors()
    close()
  }

  const onSubmit = async (data: BankProps) => {
    // if (
    //   data.dot == 2 &&
    //   data.dotAccFirst &&
    //   data.dotAccSecond &&
    //   data.dotAccThird &&
    //   data.dotAccFourth
    // ) {
    //   data.data[1].accountNumber =
    //     data.dotAccFirst + data.dotAccSecond + data.dotAccThird + data.dotAccFourth
    // } else if (data.dot == 1) {
    //   data.data[1].accountNumber = ''
    // }
    data.data[1].accountNumber = ''
    try {
      loadingOnHandler()
      const res = await updateBankInfo([data.data[0]])
      if (res.error) {
        toastHandler({
          type: 'error',
        })
        return
      }
      dispatch(actions.setBankInfo(data.data))
      close()
      toastHandler({message: t('update-success'), type: 'success'})
    } catch (error) {
      toastHandler({type: 'error'})
    } finally {
      loadingOffHandler()
    }
  }

  return (
    <Dialog open={open} fullScreen={fullScreen}>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          padding: 15px 16px 15px 15px;
        `}
      >
        <Typography variant="h6">{t('form-title')}</Typography>
        <IconButton
          css={css`
            padding: 0;
          `}
          onClick={closeHandler}
        >
          <Close/>
        </IconButton>
      </div>
      <form
        css={css`
          max-width: 500px;
          width: 100%;
          padding: 15px 16px;
          overflow-y: auto;

          ::-webkit-scrollbar {
            display: none;
          }

          @media (min-width: ${theme.breakpoints.values.md}px) {
            min-width: 500px;
          }
        `}
      >
        <Stack spacing={3}>
          <FormControl error={errors.data && !!Object.keys(errors.data[0].bankName || {}).length} css={fullWidth}>
            <Typography variant="caption" css={botTypo}>
              {t('bank-name')}
            </Typography>
            <Controller
              control={control}
              name="data.0.bankName"
              aria-describedby="component-error-text"
              rules={{
                required: true,
              }}
              render={({field}) => {
                return (
                  <Grid container spacing={3} alignItems="center" columns={4}>
                    <Grid item xs={3}>
                      <OutlinedInput id="bank-name" css={fullWidth} type={'text'} {...field} inputProps={{maxLength: 64}} />
                    </Grid>
                    <Grid item xs={1}>
                      <Typography variant="subtitle1">{t('bank')}</Typography>
                    </Grid>
                  </Grid>
                )
              }}
            />

            {!!errors.data && errors.data[0].bankName && (
              <FormHelperText id="component-error-text">
                {t(`${errors.data[0].bankName.type}-bankName`, {
                  ns: 'common@validate',
                })}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl error={errors.data && !!Object.keys(errors.data[0].bankBranchName || {}).length} css={fullWidth}>
            <Typography variant="caption" css={botTypo}>
              {t('branch-name')}
            </Typography>
            <Controller
              control={control}
              name="data.0.bankBranchName"
              aria-describedby="component-error-text"
              rules={{
                required: true,
              }}
              render={({field}) => {
                return (
                  <Grid container spacing={3} alignItems="center" columns={4}>
                    <Grid item xs={3}>
                      <OutlinedInput id="branch-name" css={fullWidth} type={'text'} {...field} inputProps={{maxLength: 64}} />
                    </Grid>
                    <Grid item xs={1}>
                      <Typography variant="subtitle1">{t('branch')}</Typography>
                    </Grid>
                  </Grid>
                )
              }}
            />

            {!!errors.data && errors.data[0].bankBranchName && (
              <FormHelperText id="component-error-text">
                {t(`${errors.data[0].bankBranchName.type}-bankBranchName`, {
                  ns: 'common@validate',
                })}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl error={!!Object.keys(errors.data || {}).length}>
            <Typography variant="caption">{t('acc-type')}</Typography>
            <Controller
              control={control}
              name="data.0.accountType"
              aria-describedby="component-error-text"
              rules={{
                required: true,
              }}
              render={({field}) => {
                return (
                  <RadioGroup {...field} onChange={(e) => field.onChange(parseInt(e.target.value))}>
                    <FormControlLabel value={1} control={<Radio/>} label={`${t('acc-type-1')}`}/>
                    <FormControlLabel value={2} control={<Radio/>} label={`${t('acc-type-2')}`}/>
                  </RadioGroup>
                )
              }}
            />
          </FormControl>
          <FormControl error={errors.data && !!Object.keys(errors.data[0].accountNumber || {}).length} css={fullWidth}>
            <Typography variant="caption" css={botTypo}>
              {t('acc-num')}
            </Typography>
            <Controller
              control={control}
              name="data.0.accountNumber"
              aria-describedby="component-error-text"
              rules={{
                required: true,
                pattern: numbersValidate,
                minLength: 7,
                maxLength: 7,
              }}
              defaultValue=""
              render={({field}) => {
                return (
                  <OutlinedInput
                    id="account-number"
                    type={'text'}
                    inputProps={{
                      maxLength: 7,
                    }}
                    {...field}
                  />
                )
              }}
            />
            {!!errors.data && errors.data[0].accountNumber && (
              <FormHelperText id="component-error-text">
                {t(`${errors.data[0].accountNumber.type}-accountNumber`, {
                  ns: 'common@validate',
                })}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl error={errors.data && !!Object.keys(errors.data[0].accountHolder || {}).length} css={fullWidth}>
            <Typography variant="caption" css={botTypo}>
              {t('acc-name')}
            </Typography>
            <Controller
              control={control}
              name="data.0.accountHolder"
              aria-describedby="component-error-text"
              defaultValue=""
              rules={{
                required: true,
              }}
              render={({field}) => {
                return <OutlinedInput id="account-name" type={'text'} {...field} inputProps={{maxLength: 128}} />
              }}
            />
            {!!errors.data && errors.data[0].accountHolder && (
              <FormHelperText id="component-error-text">
                {t(`${errors.data[0].accountHolder.type}-accountHolder`, {
                  ns: 'common@validate',
                })}
              </FormHelperText>
            )}
          </FormControl>
          <Button
            variant="contained"
            css={css`
              margin-top: 40px;
              padding: 10px 16px;
              width: 100%;
              @media (min-width: ${theme.breakpoints.values.md}px) {
                width: 226px;
              }
            `}
            onClick={handleSubmit(onSubmit)}
          >
            {t('submit')}
          </Button>
        </Stack>
      </form>
    </Dialog>
  )
}

export default BankModal
