
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { Button, Typography } from '@mui/material'
import { SerializedStyles } from '@emotion/react'
import {useTranslation} from 'next-i18next'
import {nsUserProfile} from '../../../../common/constant'

interface Props {
  css?: SerializedStyles
}

const ButtonForm = (props: Props) => {
  const theme = useTheme()
  const { t } = useTranslation(nsUserProfile)

  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="secondary"
      css={css`height: 44px; border-radius: 9px; margin-top: ${theme.spacing(4)}`}
      {...props}
    >
      <Typography>{t('5')}</Typography>
    </Button>
  )
}

export default ButtonForm
