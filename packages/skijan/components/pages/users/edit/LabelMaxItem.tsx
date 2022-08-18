import { Stack, Typography } from '@mui/material'
import {useTranslation} from 'next-i18next'
import {nsUserProfile} from '../../../../common/constant'

const LabelMaxItem = ({ max }: { max: number }) => {
  const {t} = useTranslation(nsUserProfile)
  return (
    <Stack direction="row" justifyContent="end">
      <Typography variant="caption" color="initial">
        {max}{t('28')}
      </Typography>
    </Stack>
  )
}

export default LabelMaxItem
