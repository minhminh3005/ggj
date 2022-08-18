import {Typography, TypographyProps} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {css} from '@emotion/react'
import {memo} from 'react'


export const SectionTitle = memo(
  function SectionTitle(props: TypographyProps & {title: string}) {
    const {title, ...rest} = props
    const theme = useTheme()

    return (
      <Typography
        variant="h6"
        mb={2}
        ml={{xs: 3, md: 6}}
        css={css` color: ${theme.typography.subtitle1.color};`}
        {...rest}
      >
        <strong>{title}</strong>
      </Typography>

    )
  }
)
