import { css } from '@emotion/react'
import { useTheme, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { useAppSelector } from 'store/hooks'
import { ns } from 'store/emailSlice'
const nsTran = 'components@email'

const EmailInfo = () => {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const emailAddress = useAppSelector((state) => state[ns]?.emailAddress)

  return (
    <div
      css={css`
				margin-top: ${theme.spacing(5)};
			`}
    >
      <Typography
        variant="caption"
        css={css`
					line-height: 19px;
					font-weight: normal;
					color: ${theme.palette.text.primary};
					margin-bottom: ${theme.spacing(1)};
				`}
      >
        {t('2')}
      </Typography>
      <Typography
        variant="subtitle1"
        css={css`
					line-height: 19px;
					font-weight: normal;
					color: ${theme.palette.text.primary};
				`}
      >
        {emailAddress}
      </Typography>
    </div>
  )
}

export default EmailInfo
