import React from 'react'
import {css} from '@emotion/react'
import {useTheme} from '@mui/material/styles'
import {Controller} from 'react-hook-form'
import {InputBaseComponentProps, Button} from '@mui/material'
import {
  Typography,
  OutlinedInput,
  TextField,
  FormControl,
  FormHelperText,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@mui/material'

export enum InputType {
  TextArea = 'TEXT_AREA',
  Radio = 'RADIO',
}

interface FormInputProps {
  title?: string
  message?: string
  error?: boolean
  placeholder?: string
  type?: InputType
  multiline?: boolean
  rows?: number
  register?: object
  options?: {
    value: string
    label: string
  }[]
  defaultValue?: string | number
  inputProps?: InputBaseComponentProps
  controllerprops?: {
    name?: string
    control?: any
  }
}

function FormInput(props: FormInputProps) {
  const {
    title,
    message,
    error,
    type,
    register,
    options,
    controllerprops,
    inputProps,
  } = props
  const theme = useTheme()

  function renderInput(type?: string) {
    switch (type) {
    case InputType.TextArea:
      return <TextField {...props} {...register} />
    case InputType.Radio:
      return (
        <Controller
          render={({field}) => (
            <RadioGroup {...props} {...field}>
              {options?.map(
                (
                  {
                    value,
                    label,
                  }: {
                    value: string | number
                    label: string
                  },
                  index
                ) => (
                  <FormControlLabel
                    key={index}
                    value={value}
                    control={<Radio/>}
                    label={label}
                  />
                )
              )}
            </RadioGroup>
          )}
          name={controllerprops?.name || ''}
          control={controllerprops?.control}
        />
      )
    default:
      return (
        <OutlinedInput
          inputProps={{
            ...inputProps,
          }}
          {...props}
          {...register}
        />
      )
    }
  }

  return (
    <FormControl
      fullWidth
      css={css`
        margin-bottom: ${theme.spacing(4)};
      `}
    >
      <Typography variant="caption" component="h3">{title}</Typography>
      {renderInput(type)}
      <FormHelperText
        css={css`
          color: ${theme.palette.ruby.main};
        `}
      >
        {error ? message : ''}
      </FormHelperText>
    </FormControl>
  )
}

export function SubmitButton({
  buttonText,
  disabled,
}: {
  buttonText?: string
  disabled?: boolean
}) {
  return (
    <FormControl fullWidth>
      <Button
        css={css`
          width: 156px;
          margin: 0 auto;
        `}
        variant="contained"
        type="submit"
        disabled={disabled}
      >
        {buttonText}
      </Button>
    </FormControl>
  )
}

export default React.memo(FormInput)
