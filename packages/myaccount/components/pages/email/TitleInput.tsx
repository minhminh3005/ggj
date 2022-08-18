import { css } from '@emotion/react'
import { useTheme, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'

const nsTran = 'components@email'

const Title = () => {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  return (
    <Typography
      variant="h5"
      css={css`
				line-height: 29px;
				color: ${theme.palette.text.primary};
			`}
    >
      {t('1')}
    </Typography>
  )
}

export default Title
