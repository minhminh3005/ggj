import {css} from '@emotion/react'
import {Box, FormControl, FormHelperText, Stack, Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {Caption} from 'components/pages/mypage/display/skill/input/ServiceSection'
import {useTranslation} from 'next-i18next'
import {memo} from 'react'
import {Controller, useFormContext} from 'react-hook-form'
import {SectionTitle} from './SectionTitle'
import {useAppSelector} from '../../../../../../store/hooks'
import {ns} from '../../../../../../store/mypage/display/skill/skillInputSlice'
import {nsTran, SkillInputName} from 'components/pages/mypage/display/skill/input/const'
import GgjNumberInput from '../../../../../commons/GgjNumberInput'

const DELIVERY_DAYS = SkillInputName.DELIVERY_DAYS

function DeliveryDateInput() {
  const theme = useTheme()
  const {t} = useTranslation(nsTran)
  const isPublishValidation = useAppSelector(state => state[ns].isPublishValidation)
  const {control, formState: {errors}} = useFormContext()
  return (
    <FormControl
      variant="outlined"
      error={!!Object.keys(errors.deliveryDays || {}).length}
      css={css`
        margin-bottom: ${theme.spacing(1)};
        width: 140px;
        @media (min-width: ${theme.breakpoints.values.md}px) {
          width: 152px;
        }
      `}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Controller
          control={control}
          name={DELIVERY_DAYS}
          rules={{
            max: 99,
            required: isPublishValidation,
            min: isPublishValidation ? 1 : 0,
            validate: (value) => (!value && value !== 0) ? true : value >= 1
          }}
          aria-describedby={`component-${DELIVERY_DAYS}-number`}
          render={({field: {ref, value, onChange, ...rest}}) => {
            return (
              <GgjNumberInput
                onChange={onChange}
                ref={ref}
                value={value}
                {...rest}
              />
            )
          }}
        />
        <Typography variant="body1" css={css` margin-bottom: ${theme.spacing(1)} !important;`}>{t('40')}</Typography>
      </Stack>
      {!!Object.keys(errors[DELIVERY_DAYS] || {}).length && <FormHelperText css={css` width: 200px;`}>
        {t('43')}
      </FormHelperText>}
    </FormControl>
  )
}

function DeliverySection() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)

  return (
    <>
      <SectionTitle title={t('41')}/>
      <Box px={{xs: 3, md: 6}} py={4} mb={6} css={css` background: ${theme.palette.grey[50]}; border-radius: 15px; `}>
        <Caption title={t('42')} style={css`margin-bottom: ${theme.spacing(1)};`}/>
        <DeliveryDateInput />
        <Typography variant="caption" mb={3} css={css `color: ${theme.palette.smoke.dark}; display: block;`}>{ t('43') }</Typography>
      </Box>
    </>
  )
}

export default memo(DeliverySection)
