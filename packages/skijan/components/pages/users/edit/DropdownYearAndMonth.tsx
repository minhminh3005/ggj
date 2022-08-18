import React from 'react'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { Controller, useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormHelperText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import {useTranslation} from 'next-i18next'
import {nsUserProfile} from '../../../../common/constant'

const yearList = function (startYear: number) {
  const currentYear = new Date().getFullYear(),
    years = []
  startYear = startYear || 1980
  while (startYear <= currentYear) {
    years.push(startYear++)
  }
  return years.reverse()
}

function SelectInput({
  name,
  options,
  isDisabled
}: {
  name: string
  options: Array<number>
  isDisabled: boolean
}) {
  const theme = useTheme()
  const {t} = useTranslation(nsUserProfile)
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl
      css={css`
        display: block;
        flex-grow: 1;
        .Mui-disabled {
            -webkit-text-fill-color: transparent;
        }
      `}
      error={!!Object.keys(errors[name] || {}).length}
      disabled={isDisabled}
    >
      <Controller
        defaultValue={options[0]}
        control={control}
        name={name}
        aria-describedby={`component-${name}-text`}
        rules={{ required: true }}
        render={({ field: { value, ...rest } }) => {
          return (
            <Select
              css={css`
                height: 48px;
                border-radius: 3px;
                background: ${isDisabled ? '#747474' : '#ffffff'};
                color: ${theme.palette.jade.light};
                overflow-y: hidden;
              `}
              fullWidth
              displayEmpty
              input={<OutlinedInput label=""/>}
              inputProps={{ 'aria-label': `component-select-${name}` }}
              value={value}
              {...rest}
            >
              {options.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  css={css`
                    color: ${theme.palette.jade.light};
                  `}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
          )
        }}
      />
      {!!Object.keys(errors[name] || {}).length && (
        <FormHelperText>{t('18')}</FormHelperText>
      )}
    </FormControl>
  )
}

function DropdownYearAndMonth({ name, isDisabled }: { name: string, isDisabled: boolean }) {
  const theme = useTheme()
  const years = yearList(1950)
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const {t} = useTranslation(nsUserProfile)

  return (
    <Stack direction="row" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <SelectInput name={`${name}Year`} options={years} isDisabled={isDisabled}/>
        <Typography
          variant="body2"
          css={css`
            color: ${theme.palette.jade.light};
          `}
        >
          {t('58')}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2}>
        <SelectInput name={`${name}Month`} options={months} isDisabled={isDisabled}/>
        <Typography
          variant="body2"
          css={css`
            color: ${theme.palette.jade.light};
          `}
        >
          {t('59')}
        </Typography>
      </Stack>
    </Stack>
  )
}

export default React.memo(DropdownYearAndMonth)
