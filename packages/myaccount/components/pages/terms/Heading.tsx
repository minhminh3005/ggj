import { Typography, Divider } from '@mui/material'
import { css } from '@emotion/react'
const Heading = ({ title }: { title: string }) => {
  return (
    <div
      css={css`
        margin-bottom: 24px;
      `}
    >
      <Typography
        variant="h5"
        css={css`
          font-weight: bold;
        `}
      >
        {title}
      </Typography>
      <Divider />
    </div>
  )
}

export default Heading
