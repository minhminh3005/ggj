import { css } from '@emotion/react'
import { Error } from '@mui/icons-material'
import {
  Box,
  Button,
  ButtonProps,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Slide,
  Stack,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
import { Control, Controller, useForm, useWatch } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { ns, validateWithdraw } from 'store/others/withdrawalSlice'

const nsTran = 'components@withdrawal'


interface IFormValues {
  isConfirmWithdraw: boolean;
}
interface WithdrawCheckboxProps {
  control?: Control<IFormValues>;
  name: keyof IFormValues;
  content: string;
}
interface SubmitButtonProps extends ButtonProps {
  control: Control<IFormValues>;
  content: string;
}

function WithdrawWarningPaper() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  return (
    <Paper css={css`
      background-color: #FBE8EC;
      box-shadow: none;
      padding: ${theme.spacing(3)};
      margin-bottom: ${theme.spacing(3)};
      @media (min-width: ${theme.breakpoints.values.md}px) {
        padding: ${theme.spacing(4)};
      }
    `}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Error css={css`
          color: ${theme.palette.error.main};
          font-size: ${theme.spacing(5)};
        `} />
        <Typography variant="body1" fontWeight={theme.typography.fontWeightBold} color={theme.palette.error.main}>
          {t('warning-title')}
        </Typography>
      </Stack>
      <Typography variant="body1" pt={3} fontWeight={theme.typography.fontWeightBold}>
        {t('3')}
      </Typography>
      <Box component="ul" px={3} mb={0}>
        {['4','5','6','7','8'].map(i => <Typography key={i} variant="button" component="li">{t(i)}</Typography>)}
      </Box>
    </Paper>
  )
}
function WithdrawCheckbox({ control, name, content } : WithdrawCheckboxProps) {
  const theme = useTheme()
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={false}
      render={({ field }) => (
        <FormControlLabel
          css={css`
            & span { font-size: 14px;}`
          }
          control={<Checkbox
            onChange={(e) => field.onChange(e.target.checked)}
            checked={!!field.value}
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
function SubmitButton({ control, content, ...rest }: SubmitButtonProps) {
  const isConfirmWithdraw = useWatch({
    control,
    name: 'isConfirmWithdraw'
  })
  const isDisable = !isConfirmWithdraw
  return (
    <Button {...rest} disabled={isDisable} >{content}</Button>
  )
}

function WithdrawScreen(){
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const dispatch = useAppDispatch()
  const screenIndex = useAppSelector(state => state[ns].screenIndex)
  const { handleSubmit, control } = useForm<IFormValues>({
    reValidateMode: 'onSubmit'
  })

  const handleClick = async () => {
    await dispatch(validateWithdraw())
  }
  return (
    <Slide
      mountOnEnter unmountOnExit
      timeout={{exit: 0, enter: theme.transitions.duration.enteringScreen}}
      direction="left"
      in={screenIndex === 0}
      appear={false}
      css={css` flex-grow: 1;`}
    >
      <Box>
        <Typography variant="h5" mb={3} mt={2} fontWeight={theme.typography.fontWeightMedium} >{t('2')}</Typography>
        <WithdrawWarningPaper />
        <WithdrawCheckbox control={control} content={t('9')} name="isConfirmWithdraw" />
        <Grid container>
          <Grid item xs={12} mb={8}>
            <SubmitButton
              control={control}
              content={t('submit-withdraw')}
              fullWidth
              variant="text"
              color="error"
              onClick={handleSubmit(handleClick)}
              css={css`
                font-weight: ${theme.typography.fontWeightBold};
                font-size: ${theme.spacing(3)};
                margin-top: ${theme.spacing(6)};
                &:disabled {
                  color: #D5013452;
                }
                @media (min-width: ${theme.breakpoints.values.md}px) {
                  width: auto;
                  margin-top: ${theme.spacing(3)};
                }
              `}
            />
          </Grid>
        </Grid>
      </Box>
    </Slide>
  )
}

export default WithdrawScreen
