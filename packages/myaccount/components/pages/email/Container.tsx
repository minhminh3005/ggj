import { Grid, useTheme } from '@mui/material'
import { ReactNode } from 'react'
import { css } from '@emotion/react'

const Container = (props: { children: ReactNode }) => {
  const theme = useTheme()
  return (
    <Grid
      container
      columns={{ xs: 12, md: 8, lg: 12 }}
      css={css`
				margin-bottom: ${theme.spacing(5)};
			`}
    >
      <Grid item xs={12} md={6} lg={8}>
        {props.children}
      </Grid>
    </Grid>
  )
}

export default Container
